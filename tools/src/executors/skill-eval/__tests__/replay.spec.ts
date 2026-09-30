// biome-ignore-all lint/style/useNamingConvention: snake_case fields are defined by the skillgrade report format.
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  checkInputs,
  type EvalReport,
  type EvalTrial,
  INSTRUCTION_FILE,
  loadReplay,
  promptKey,
  type Replay,
  recordedInputs,
  restoreDurations,
  savedRun,
  selectTasks,
  taskInputs,
  writeReplay,
} from '../lib/index.ts';

const writeJson = (file: string, value: unknown) => {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(value));
};

const trial = (instruction: string, stdout: string, duration_ms = 1000): EvalTrial => ({
  reward: 1,
  duration_ms,
  input_tokens: 10,
  output_tokens: 10,
  grader_results: [],
  session_log: [
    { type: 'agent_start', instruction },
    { type: 'command', command: 'echo prompt', stdout: '', stderr: '', exitCode: 0 },
    { type: 'command', command: 'run agent', stdout, stderr: 'warn', exitCode: 2 },
    { type: 'agent_result' },
    { type: 'command', command: 'grader', stdout: 'graded', stderr: '', exitCode: 0 },
  ],
});

describe('replay', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'skill-eval-replay-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  const tasks = [
    { name: 'alpha', instruction: 'Build alpha.' },
    { name: 'beta', instruction: 'Build beta.' },
  ];
  const writeReport = (iteration: string, file: string, report: EvalReport) =>
    writeJson(path.join(dir, iteration, 'with-skill', 'results', file), report);

  describe('promptKey', () => {
    it('should hash the prompt with sha256, as the agent command does', () => {
      expect(promptKey('Build alpha.')).toBe(createHash('sha256').update('Build alpha.').digest('hex'));
    });
  });

  describe('taskInputs', () => {
    it('should change with the prompt and the workspace files, but not the prompt file entry', () => {
      // Arrange
      writeJson(path.join(dir, 'fixture', 'package.json'), { name: 'a' });
      const workspace = [{ src: path.join(dir, 'fixture'), dest: '.' }];
      const task = { name: 'alpha', instruction: 'Build alpha.', workspace };
      const before = taskInputs([task]).alpha;

      // Act
      const withPromptFile = taskInputs([
        { ...task, workspace: [...workspace, { src: path.join(dir, 'missing.md'), dest: INSTRUCTION_FILE }] },
      ]).alpha;
      const otherPrompt = taskInputs([{ ...task, instruction: 'Build beta.' }]).alpha;
      writeJson(path.join(dir, 'fixture', 'package.json'), { name: 'b' });
      const otherFiles = taskInputs([task]).alpha;

      // Assert
      expect(before).toMatch(/^[0-9a-f]{16}$/);
      expect(withPromptFile).toBe(before);
      expect(otherPrompt).not.toBe(before);
      expect(otherFiles).not.toBe(before);
    });
  });

  describe('selectTasks', () => {
    const evalsDir = fileURLToPath(new URL('../../../../../packages/beeq-skills/evals', import.meta.url));
    const suite = [
      { name: 'alpha', metadata: { tags: ['smoke'] } },
      { name: 'beta', metadata: { tags: [] } },
    ];

    it('should select tasks with skillgrade names and filters', () => {
      expect(selectTasks(evalsDir, suite, { eval: [], filter: [] }).map((task) => task.name)).toEqual([
        'alpha',
        'beta',
      ]);
      expect(selectTasks(evalsDir, suite, { eval: ['beta'], filter: [] }).map((task) => task.name)).toEqual(['beta']);
      expect(selectTasks(evalsDir, suite, { eval: [], filter: ['tags=smoke'] }).map((task) => task.name)).toEqual([
        'alpha',
      ]);
    });
  });

  describe('savedRun', () => {
    it('should take the last command before the agent result', () => {
      expect(savedRun(trial('Build alpha.', 'reply'))).toEqual({ stdout: 'reply', stderr: 'warn', exitCode: 2 });
      expect(savedRun({ ...trial('x', 'y'), session_log: [{ type: 'agent_start' }] })).toBeUndefined();
    });
  });

  describe('loadReplay', () => {
    it('should load the latest report of every task with its durations and metadata', () => {
      // Arrange
      writeReport('iteration-3', 'alpha_2026-01-01.json', { task: 'alpha', trials: [trial('Build alpha.', 'old')] });
      writeReport('iteration-3', 'alpha_2026-01-02.json', {
        task: 'alpha',
        trials: [trial('Build alpha.', 'one', 5000), trial('Build alpha.', 'two', 7000)],
      });
      writeReport('iteration-3', 'beta_2026-01-01.json', { task: 'beta', trials: [trial('Build beta.', 'three')] });
      writeJson(path.join(dir, 'iteration-3', 'benchmark.json'), { metadata: { agent: 'copilot' } });

      // Act
      const replay = loadReplay(path.join(dir, 'iteration-3'), 'with-skill', tasks);

      // Assert
      expect(replay.metadata).toEqual({ agent: 'copilot' });
      expect(replay.runs.get('alpha')).toEqual([
        { stdout: 'one', stderr: 'warn', exitCode: 2, durationMs: 5000 },
        { stdout: 'two', stderr: 'warn', exitCode: 2, durationMs: 7000 },
      ]);
      expect(replay.runs.get('beta')?.map((run) => run.stdout)).toEqual(['three']);
    });

    it('should name every task that cannot be replayed', () => {
      // Arrange
      writeReport('iteration-3', 'alpha.json', { task: 'alpha', trials: [trial('Build the old alpha.', 'one')] });
      const tasksWithGamma = [...tasks, { name: 'gamma', instruction: 'Build gamma.' }];
      writeReport('iteration-3', 'gamma.json', {
        task: 'gamma',
        trials: [
          { ...trial('Build gamma.', 'x'), session_log: [{ type: 'agent_start', instruction: 'Build gamma.' }] },
        ],
      });

      // Act & Assert
      expect(() => loadReplay(path.join(dir, 'iteration-3'), 'with-skill', tasksWithGamma)).toThrow(
        /alpha: the prompt changed\n {2}- beta: no saved run\n {2}- gamma: a trial saved no agent output/,
      );
    });
  });

  describe('inputs', () => {
    const replay = (inputs?: unknown): Replay => ({
      sourceDir: '/out/iteration-3',
      runs: new Map(),
      metadata: inputs ? { inputs } : undefined,
    });

    it('should return the tasks the source recorded no inputs for', () => {
      // Arrange
      const source = replay({ 'with-skill': { alpha: 'aaa' } });

      // Act & Assert
      expect(checkInputs(source, 'with-skill', { alpha: 'aaa', beta: 'bbb' })).toEqual(['beta']);
      expect(checkInputs(replay(), 'with-skill', { alpha: 'aaa' })).toEqual(['alpha']);
      expect(recordedInputs(source, 'with-skill', { alpha: 'aaa', beta: 'bbb' })).toEqual({ alpha: 'aaa' });
      expect(recordedInputs(source, 'baseline', { alpha: 'aaa' })).toEqual({});
    });

    it('should throw when a recorded input changed', () => {
      expect(() => checkInputs(replay({ 'with-skill': { alpha: 'old' } }), 'with-skill', { alpha: 'new' })).toThrow(
        'The prompt or workspace files of alpha changed since iteration-3',
      );
    });
  });

  describe('writeReplay', () => {
    it('should write one file per trial under the prompt key', () => {
      // Arrange
      const run = { stdout: 'one', stderr: '', exitCode: 0, durationMs: 5 };
      const replay: Replay = { sourceDir: '/out/iteration-3', runs: new Map([['alpha', [run, run]]]) };

      // Act
      writeReplay(path.join(dir, 'replay'), replay, tasks.slice(0, 1));

      // Assert
      const taskDir = path.join(dir, 'replay', promptKey('Build alpha.'));
      expect(readdirSync(taskDir).sort()).toEqual(['0.json', '1.json']);
      expect(JSON.parse(readFileSync(path.join(taskDir, '0.json'), 'utf8'))).toEqual(run);
    });
  });

  describe('restoreDurations', () => {
    it('should put back each trial duration, matched by the agent output', () => {
      // Arrange
      const file = path.join(dir, 'iteration-4', 'with-skill', 'results', 'alpha.json');
      writeReport('iteration-4', 'alpha.json', {
        task: 'alpha',
        trials: [trial('Build alpha.', 'two', 10), trial('Build alpha.', 'one', 10), trial('Build alpha.', 'new', 10)],
      });
      const run = (stdout: string, durationMs: number) => ({ stdout, stderr: '', exitCode: 0, durationMs });
      const replay: Replay = {
        sourceDir: '/out/iteration-3',
        runs: new Map([['alpha', [run('one', 5000), run('two', 7000)]]]),
      };

      // Act
      restoreDurations(path.join(dir, 'iteration-4'), 'with-skill', replay);

      // Assert
      const report = JSON.parse(readFileSync(file, 'utf8')) as EvalReport;
      expect(report.trials.map((t) => t.duration_ms)).toEqual([7000, 5000, 10]);
    });
  });
});

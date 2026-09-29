// biome-ignore-all lint/style/useNamingConvention: snake_case fields are defined by the skillgrade and agentskills.io formats.
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import {
  buildBenchmark,
  buildEvalConfig,
  checkRubric,
  createRuntime,
  detectGraderProvider,
  type EvalReport,
  findIterationDir,
  findRubricError,
  formatBenchmark,
  INTERRUPTED,
  loadSuite,
  nextIterationDir,
  normalizeOptions,
  previewCommand,
  readReports,
  renderInstruction,
  runNode,
  type Suite,
  skillgradeArgs,
  stat,
  substitute,
  writeEvalConfig,
} from '../lib/index.ts';

const write = (root: string, file: string, content: string) => {
  mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  writeFileSync(path.join(root, file), content);
};

const BASE = `version: '1'
defaults:
  command: node "{{evals}}/agents/run.ts"
  threshold: 0.8
graders:
  - type: deterministic
    run: node "{{evals}}/graders/grade.ts"
    weight: 0.7
  - type: llm_rubric
    rubric: '{{evals}}/rubric.md'
    weight: 0.3
`;

const TASK = `name: alpha
metadata:
  stack: react
  tags: [smoke]
instruction: Build a thing.
workspace:
  - src: '{{evals}}/fixtures/react/package.json'
    dest: package.json
expected:
  checks: []
`;

describe('normalizeOptions', () => {
  const required = { skill: 'skills/beeq', evalsDir: 'packages/beeq-skills/evals' };

  it('should resolve paths and apply defaults', () => {
    // Act
    const options = normalizeOptions(required, '/repo', {});

    // Assert
    expect(options).toMatchObject({
      skillDir: '/repo/skills/beeq',
      evalsDir: '/repo/packages/beeq-skills/evals',
      outputDir: '/repo/tmp/skill-evals',
      agent: 'copilot',
      variants: ['with-skill', 'baseline'],
      trials: 1,
      parallel: 1,
      timeout: 600,
      llmRubric: false,
      validate: false,
    });
    expect(options.notice).toMatch(/only the deterministic graders run/);
  });

  it('should turn the LLM rubric on when a grader key is set', () => {
    // Act
    const options = normalizeOptions(required, '/repo', { OPENAI_API_KEY: 'sk-test' });

    // Assert
    expect(options).toMatchObject({ llmRubric: true, graderProvider: 'openai', notice: undefined });
  });

  it('should keep the rubric off for the deterministic grader even with a key', () => {
    // Act
    const options = normalizeOptions({ ...required, grader: 'deterministic' }, '/repo', { ANTHROPIC_API_KEY: 'k' });

    // Assert
    expect(options).toMatchObject({ llmRubric: false, graderProvider: undefined, notice: undefined });
  });

  it('should require a key for grader "all"', () => {
    expect(() => normalizeOptions({ ...required, grader: 'all' }, '/repo', {})).toThrow(/ANTHROPIC_API_KEY/);
  });

  it('should validate one deterministic baseline trial', () => {
    // Act
    const options = normalizeOptions(
      { ...required, validate: true, trials: 9, grader: 'all', variants: ['with-skill'] },
      '/repo',
      { ANTHROPIC_API_KEY: 'k' },
    );

    // Assert
    expect(options).toMatchObject({ variants: ['baseline'], trials: 1, llmRubric: false });
  });
});

describe('detectGraderProvider', () => {
  it('should prefer Anthropic, then OpenAI, then Gemini, and ignore blank keys', () => {
    expect(detectGraderProvider({ GEMINI_API_KEY: 'g', OPENAI_API_KEY: 'o', ANTHROPIC_API_KEY: 'a' })).toBe(
      'anthropic',
    );
    expect(detectGraderProvider({ GEMINI_API_KEY: 'g', ANTHROPIC_API_KEY: ' ' })).toBe('gemini');
    expect(detectGraderProvider({})).toBeUndefined();
  });
});

describe('suite', () => {
  let evalsDir: string;

  beforeEach(() => {
    evalsDir = mkdtempSync(path.join(tmpdir(), 'skill-eval-suite-'));
    write(evalsDir, 'eval.base.yaml', BASE);
    write(evalsDir, 'tasks/alpha.yaml', TASK);
    write(evalsDir, 'tasks/beta.yaml', TASK.replace('name: alpha', 'name: beta').replace('[smoke]', '[]'));
    write(evalsDir, 'footer.md', 'Stack: {{metadata.stack}}.\n');
    write(evalsDir, 'solutions/alpha.sh', 'rm -- "$0"\n');
    write(evalsDir, 'agents/run.ts', '');
  });

  afterEach(() => {
    rmSync(evalsDir, { recursive: true, force: true });
  });

  it('should load tasks, footer, and solutions', () => {
    // Act
    const suite = loadSuite(evalsDir);

    // Assert
    expect(suite.tasks.map((task) => task.name)).toEqual(['alpha', 'beta']);
    expect(suite.footer).toBe('Stack: {{metadata.stack}}.');
    expect(suite.prepare).toBe(false);
    expect([...suite.solutions]).toEqual([['alpha', 'solutions/alpha.sh']]);
  });

  it('should reject a task whose name does not match its file', () => {
    // Arrange
    write(evalsDir, 'tasks/gamma.yaml', TASK);

    // Act & Assert
    expect(() => loadSuite(evalsDir)).toThrow('tasks/gamma.yaml: "name" must be "gamma".');
  });

  it('should render the footer with task metadata', () => {
    // Arrange
    const [task] = loadSuite(evalsDir).tasks;

    // Act & Assert
    expect(renderInstruction(task, 'Stack: {{metadata.stack}}.')).toBe('Build a thing.\n\nStack: react.');
    expect(() => renderInstruction(task, '{{metadata.missing}}')).toThrow('no metadata.missing');
    expect(() => renderInstruction({ ...task, metadata: { stack: { name: 'react' } } }, '{{metadata.stack}}')).toThrow(
      'metadata.stack must be a string, number, or boolean',
    );
  });

  describe('buildEvalConfig', () => {
    let suite: Suite;
    const input = {
      runtimeDir: '/rt',
      skillDir: '/repo/skills/beeq',
      agent: 'claude' as const,
      timeout: 300,
      llmRubric: true,
      graderProvider: 'anthropic' as const,
      validate: false,
    };

    beforeEach(() => {
      suite = loadSuite(evalsDir);
    });

    it('should point with-skill at the skill and run the agent command', () => {
      // Act
      const config = buildEvalConfig({ ...input, suite, variant: 'with-skill', model: 'claude-sonnet-4.5' });

      // Assert
      expect(config.skill).toBe('/repo/skills/beeq');
      expect(config.defaults).toEqual({
        agent: 'command',
        provider: 'local',
        command: 'node "/rt/agents/run.ts" claude --model claude-sonnet-4.5',
        threshold: 0.8,
        timeout: 300,
        grader_provider: 'anthropic',
      });
      expect(config.tasks[0]).toMatchObject({
        name: 'alpha',
        instruction: 'Build a thing.\n\nStack: react.',
        workspace: [{ src: '/rt/fixtures/react/package.json', dest: 'package.json' }],
        graders: [
          { type: 'llm_rubric', rubric: '/rt/rubric.md' },
          { type: 'deterministic', run: 'node "/rt/graders/grade.ts"' },
        ],
      });
      expect(config.tasks[0]).not.toHaveProperty('solution');
    });

    it('should run the rubric before the deterministic graders, so the judge never sees their scores', () => {
      // Arrange
      const [task] = suite.tasks;
      const graders = [
        { type: 'deterministic' as const, run: 'first' },
        { type: 'deterministic' as const, run: 'second' },
        { type: 'llm_rubric' as const, rubric: 'rubric' },
      ];

      // Act
      const config = buildEvalConfig({
        ...input,
        suite: { ...suite, tasks: [{ ...task, graders }] },
        variant: 'baseline',
      });

      // Assert
      expect(config.tasks[0].graders.map((grader) => grader.run ?? grader.rubric)).toEqual([
        'rubric',
        'first',
        'second',
      ]);
    });

    it('should leave the skill out of the baseline and drop the rubric when it is off', () => {
      // Act
      const config = buildEvalConfig({
        ...input,
        suite,
        variant: 'baseline',
        llmRubric: false,
        graderProvider: undefined,
      });

      // Assert
      expect(config).not.toHaveProperty('skill');
      expect(config.defaults).not.toHaveProperty('grader_provider');
      expect(config.tasks.every((task) => task.graders.every((grader) => grader.type === 'deterministic'))).toBe(true);
    });

    it('should keep only tasks with a solution when validating', () => {
      // Act
      const config = buildEvalConfig({ ...input, suite, variant: 'baseline', validate: true });

      // Assert
      expect(config.tasks.map((task) => task.name)).toEqual(['alpha']);
      expect(config.tasks[0].solution).toBe('/rt/solutions/alpha.sh');
      expect(config.tasks[0].workspace).toContainEqual({ src: '/rt/solutions/alpha.sh', dest: 'alpha.sh' });
    });

    it('should reject a model id that could inject shell', () => {
      expect(() => buildEvalConfig({ ...input, suite, variant: 'baseline', model: 'x; rm -rf /' })).toThrow(
        'Invalid model id',
      );
    });
  });

  it('should copy the suite without tasks, and without solutions unless validating', () => {
    // Act
    const runtime = createRuntime(evalsDir, { validate: false });
    const validating = createRuntime(evalsDir, { validate: true });
    const config = writeEvalConfig(runtime, 'baseline', { version: '1' });

    try {
      // Assert
      expect(() => readFileSync(path.join(runtime, 'tasks/alpha.yaml'))).toThrow();
      expect(() => readFileSync(path.join(runtime, 'solutions/alpha.sh'))).toThrow();
      expect(readFileSync(path.join(validating, 'solutions/alpha.sh'), 'utf8')).toContain('rm --');
      expect(config).toBe(path.join(runtime, 'variants/baseline'));
      expect(parse(readFileSync(path.join(config, 'eval.yaml'), 'utf8'))).toEqual({ version: '1' });
    } finally {
      rmSync(runtime, { recursive: true, force: true });
      rmSync(validating, { recursive: true, force: true });
    }
  });

  it('should number iterations and read variant reports', () => {
    // Arrange
    mkdirSync(path.join(evalsDir, 'out/iteration-2'), { recursive: true });
    mkdirSync(path.join(evalsDir, 'out/iteration-10'), { recursive: true });
    write(evalsDir, 'out/iteration-2/baseline/results/alpha_1.json', '{"task":"alpha","trials":[]}');

    // Act & Assert
    expect(nextIterationDir(path.join(evalsDir, 'missing'))).toBe(path.join(evalsDir, 'missing/iteration-1'));
    expect(nextIterationDir(path.join(evalsDir, 'out'))).toBe(path.join(evalsDir, 'out/iteration-11'));
    expect(readReports(path.join(evalsDir, 'out/iteration-2'), 'baseline')).toEqual([{ task: 'alpha', trials: [] }]);
    expect(readReports(path.join(evalsDir, 'out/iteration-2'), 'with-skill')).toEqual([]);
  });
});

describe('preview', () => {
  let outputDir: string;

  beforeEach(() => {
    outputDir = mkdtempSync(path.join(tmpdir(), 'skill-eval-preview-'));
    mkdirSync(path.join(outputDir, 'iteration-1/with-skill/results'), { recursive: true });
    mkdirSync(path.join(outputDir, 'iteration-3/with-skill/results'), { recursive: true });
  });

  afterEach(() => {
    rmSync(outputDir, { recursive: true, force: true });
  });

  it('should pick the latest iteration, or the requested one', () => {
    expect(findIterationDir(outputDir)).toBe(path.join(outputDir, 'iteration-3'));
    expect(findIterationDir(outputDir, 1)).toBe(path.join(outputDir, 'iteration-1'));
    expect(() => findIterationDir(outputDir, 2)).toThrow('No iteration-2');
    expect(() => findIterationDir(path.join(outputDir, 'missing'))).toThrow('Run the eval first');
  });

  it('should run skillgrade from the variant folder with the iteration as output', () => {
    // Arrange
    const iterationDir = path.join(outputDir, 'iteration-3');

    // Act & Assert
    expect(previewCommand(iterationDir, 'with-skill', 'browser')).toEqual({
      cwd: path.join(iterationDir, 'with-skill'),
      args: ['preview', 'browser', `--output=${iterationDir}`],
    });
    expect(previewCommand(iterationDir, 'with-skill', 'cli').args).toEqual(['preview', `--output=${iterationDir}`]);
    expect(() => previewCommand(iterationDir, 'baseline', 'cli')).toThrow('No baseline results');
  });
});

describe('substitute', () => {
  it('should replace the token in nested strings only', () => {
    expect(substitute({ a: ['{{evals}}/x', 3], b: { c: '{{evals}}' } }, '/rt')).toEqual({
      a: ['/rt/x', 3],
      b: { c: '/rt' },
    });
  });
});

describe('skillgradeArgs', () => {
  const base = { outputDir: '/out', trials: 5, parallel: 2, eval: [], filter: [], validate: false, list: false };

  it('should pass trials, parallelism, and every filter', () => {
    expect(skillgradeArgs({ ...base, eval: ['a', 'b'], filter: ['tags=smoke', 'stack=react'] })).toEqual([
      '--agent=command',
      '--provider=local',
      '--output=/out',
      '--trials=5',
      '--parallel=2',
      '--eval=a,b',
      '--filter=tags=smoke',
      '--filter=stack=react',
    ]);
  });

  it('should replace trials with --validate, and add --list', () => {
    expect(skillgradeArgs({ ...base, validate: true, list: true })).toEqual([
      '--agent=command',
      '--provider=local',
      '--output=/out',
      '--validate',
      '--list',
    ]);
  });
});

describe('benchmark', () => {
  const trial = (reward: number, grader = reward) => ({
    reward,
    duration_ms: 2000,
    input_tokens: 100,
    output_tokens: 50,
    grader_results: [{ grader_type: 'deterministic', score: grader }],
  });
  const report = (task: string, rewards: number[]): EvalReport => ({ task, trials: rewards.map((r) => trial(r)) });

  it('should compute population mean and standard deviation', () => {
    expect(stat([])).toEqual({ mean: 0, stddev: 0 });
    expect(stat([1, 0])).toEqual({ mean: 0.5, stddev: 0.5 });
  });

  it('should summarise each variant and the with-skill minus baseline delta', () => {
    // Act
    const benchmark = buildBenchmark(
      { 'with-skill': [report('a', [1, 1]), report('b', [0.5])], baseline: [report('a', [0.25, 0.25])] },
      { agent: 'copilot' },
    );

    // Assert
    expect(benchmark.metadata).toEqual({ agent: 'copilot' });
    expect(benchmark.run_summary['with-skill']).toMatchObject({
      trials: 3,
      reward: { mean: 0.833 },
      pass_rate: { mean: 1 },
      time_seconds: { mean: 2 },
      tokens: { mean: 150 },
      graders: { deterministic: 0.833 },
    });
    expect(benchmark.run_summary.baseline).toMatchObject({ trials: 2, pass_rate: { mean: 0 } });
    expect(benchmark.run_summary.delta).toEqual({ reward: 0.583, pass_rate: 1, time_seconds: 0, tokens: 0 });
    expect(benchmark.tasks).toEqual([
      {
        task: 'a',
        'with-skill': { trials: 2, reward: 1, pass_rate: 1 },
        baseline: { trials: 2, reward: 0.25, pass_rate: 0 },
        delta: 0.75,
      },
      { task: 'b', 'with-skill': { trials: 1, reward: 0.5, pass_rate: 1 } },
    ]);
  });

  it('should format a table with a delta column only when both variants ran', () => {
    // Arrange
    const both = buildBenchmark({ 'with-skill': [report('a', [1])], baseline: [report('a', [0.5])] });
    const one = buildBenchmark({ baseline: [report('a', [0.5])] });

    // Act & Assert
    expect(formatBenchmark(both).split('\n')).toEqual([
      'task         with-skill  baseline  delta',
      '-----------  ----------  --------  -----',
      'a            1.00 (1)    0.50 (1)  +0.50',
      '-----------  ----------  --------  -----',
      'mean reward  1.00        0.50      +0.50',
    ]);
    expect(formatBenchmark(one).split('\n')[0]).toBe('task         baseline');
  });
});

describe('rubric errors', () => {
  const report = (task: string, details: string): EvalReport => ({
    task,
    trials: [
      {
        reward: 0.7,
        duration_ms: 1000,
        input_tokens: 10,
        output_tokens: 10,
        grader_results: [
          { grader_type: 'llm_rubric', score: 0, details },
          { grader_type: 'deterministic', score: 1, details: 'Failed to parse LLM response: not a rubric' },
        ],
      },
    ],
  });

  it('should find the first rubric the judge never scored', () => {
    // Arrange
    const reports = [
      report('a', '1. The alert uses `type="danger"`, so criterion 1 failed.'),
      report('b', 'OpenAI API returned HTTP 429: {"error":{"code":"insufficient_quota"}}'),
      report('c', 'Missing OPENAI_API_KEY. Set the OPENAI_API_KEY environment variable.'),
    ];

    // Act & Assert
    expect(findRubricError(reports)).toEqual({ task: 'b', details: expect.stringContaining('HTTP 429') });
    expect(findRubricError([report('d', 'Anthropic API error: TypeError: fetch failed')])?.task).toBe('d');
    expect(findRubricError([report('e', 'OpenAI API returned status 401')])?.task).toBe('e');
    expect(findRubricError(reports.slice(0, 1))).toBeUndefined();
  });
});

describe('checkRubric', () => {
  const evalsDir = fileURLToPath(new URL('../../../../../packages/beeq-skills/evals', import.meta.url));
  let server: Server;
  let reply: { status: number; body: unknown };

  beforeEach(async () => {
    server = createServer((_request, response) => {
      response.writeHead(reply.status, { 'content-type': 'application/json' });
      response.end(JSON.stringify(reply.body));
    });
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  });

  afterEach(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  const env = () => ({
    OPENAI_API_KEY: 'test-key',
    OPENAI_BASE_URL: `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`,
  });

  it('should pass when the judge answers', async () => {
    // Arrange
    reply = { status: 200, body: { choices: [{ message: { content: '{"reasoning": "ok", "score": 1}' } }] } };

    // Act & Assert
    await expect(checkRubric(evalsDir, { provider: 'openai', model: 'test-model' }, env())).resolves.toMatchObject({
      score: 1,
    });
  });

  it('should fail with the API error before any agent runs', async () => {
    // Arrange
    reply = { status: 429, body: { error: { code: 'insufficient_quota' } } };

    // Act & Assert
    await expect(checkRubric(evalsDir, { provider: 'openai', model: 'test-model' }, env())).rejects.toThrow(
      /no agent ran\. OpenAI API returned HTTP 429: .*insufficient_quota/,
    );
  });
});

describe('runNode', () => {
  it('should stop the child and report it as interrupted when aborted', async () => {
    // Arrange
    const dir = mkdtempSync(path.join(tmpdir(), 'run-node-'));
    writeFileSync(path.join(dir, 'wait.mjs'), 'setTimeout(() => {}, 30_000);');
    const stop = new AbortController();

    try {
      // Act
      const started = Date.now();
      const exit = runNode(path.join(dir, 'wait.mjs'), [], { cwd: dir, signal: stop.signal });
      setTimeout(() => stop.abort(), 100);

      // Assert
      await expect(exit).resolves.toBe(INTERRUPTED);
      expect(Date.now() - started).toBeLessThan(5000);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

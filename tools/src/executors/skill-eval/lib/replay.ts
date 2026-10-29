// biome-ignore-all lint/style/useNamingConvention: snake_case fields are defined by the skillgrade report format.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import type { SkillEvalVariant } from '../schema.d.ts';
import type { EvalReport, EvalTrial } from './benchmark.ts';
import { INSTRUCTION_FILE } from './suite.ts';

/**
 * One trial's agent run as skillgrade saved it: what the suite's agent command printed and returned, and how
 * long the trial took. The agent command prints every file it wrote, so the run is enough to rebuild the
 * workspace.
 */
export type SavedRun = { stdout: string; stderr: string; exitCode: number; durationMs: number };

/** A variant's saved runs from an earlier iteration, replayed instead of running the agent. */
export type Replay = {
  /** The iteration folder the runs come from. */
  sourceDir: string;
  /** Task name → one saved run per trial. */
  runs: Map<string, SavedRun[]>;
  /** The source's `benchmark.json` metadata, when it has one. */
  metadata?: ReplayMetadata;
};

/** The `benchmark.json` metadata a replay reads back. */
export type ReplayMetadata = {
  agent?: string;
  model?: string;
  trials?: number;
  /** Variant → task → hash of the task's prompt and workspace files. */
  inputs?: Partial<Record<SkillEvalVariant, Record<string, string>>>;
};

/** Environment variable that points the suite's agent command at the runs to replay. */
export const REPLAY_ENV = 'SKILL_EVAL_REPLAY';

type WorkspaceEntry = { src: string; dest: string };
type ReplayTask = { name: string; instruction: string; workspace?: WorkspaceEntry[] };

/** Folder name for a prompt's saved runs. The agent command hashes the prompt it gets the same way. */
export const promptKey = (prompt: string) => createHash('sha256').update(prompt).digest('hex');

/** The tasks skillgrade runs for `eval` and `filter`, chosen with skillgrade's own selection. */
export function selectTasks<T extends { name: string }>(
  evalsDir: string,
  tasks: T[],
  selection: { eval: string[]; filter: string[] },
): T[] {
  const require = createRequire(path.join(evalsDir, 'package.json'));
  const filter = require('skillgrade/dist/core/filter.js') as {
    parseFilter(spec: string, negate: boolean): unknown;
    selectTasks(tasks: T[], selection: { names?: string[]; filters: unknown[] }): T[];
  };
  return filter.selectTasks(tasks, {
    names: selection.eval.length ? selection.eval : undefined,
    filters: selection.filter.map((spec) => filter.parseFilter(spec, false)),
  });
}

function hashTree(hash: ReturnType<typeof createHash>, src: string, relative = '') {
  if (!existsSync(src)) {
    hash.update(`\0missing ${relative}`);
    return;
  }
  if (!statSync(src).isDirectory()) {
    hash.update(`\0${relative}\0`).update(readFileSync(src));
    return;
  }
  for (const entry of readdirSync(src).sort((a, b) => a.localeCompare(b, 'en'))) {
    hashTree(hash, path.join(src, entry), path.posix.join(relative, entry));
  }
}

/**
 * A short hash per task of what its agent starts from besides the skill: the prompt and the workspace files.
 * `benchmark.json` records it, so a later run can tell whether saved runs still answer the current tasks.
 */
export function taskInputs(tasks: ReplayTask[]) {
  return Object.fromEntries(
    tasks.map((task) => {
      const hash = createHash('sha256').update(task.instruction);
      for (const entry of task.workspace ?? []) {
        if (entry.dest === INSTRUCTION_FILE) continue;
        hash.update(`\0dest ${entry.dest}`);
        hashTree(hash, entry.src);
      }
      return [task.name, hash.digest('hex').slice(0, 16)];
    }),
  );
}

/** The agent command's output in a saved trial: the last command skillgrade ran before the agent result. */
export function savedRun(trial: EvalTrial): Omit<SavedRun, 'durationMs'> | undefined {
  const log = trial.session_log ?? [];
  const end = log.findIndex((entry) => entry.type === 'agent_result');
  const agent = log.slice(0, end === -1 ? log.length : end).findLast((entry) => entry.type === 'command');
  if (!agent) return undefined;
  return { stdout: agent.stdout ?? '', stderr: agent.stderr ?? '', exitCode: agent.exitCode ?? 0 };
}

const savedInstruction = (trial: EvalTrial) =>
  trial.session_log?.find((entry) => entry.type === 'agent_start')?.instruction;

function readMetadata(sourceDir: string) {
  const file = path.join(sourceDir, 'benchmark.json');
  if (!existsSync(file)) return undefined;
  return (JSON.parse(readFileSync(file, 'utf8')) as { metadata?: ReplayMetadata }).metadata;
}

function reportFiles(iterationDir: string, variant: SkillEvalVariant) {
  const resultsDir = path.join(iterationDir, variant, 'results');
  if (!existsSync(resultsDir)) return [];
  return readdirSync(resultsDir)
    .filter((file) => file.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map((file) => path.join(resultsDir, file));
}

const readReport = (file: string) => JSON.parse(readFileSync(file, 'utf8')) as EvalReport;

/** Why each task cannot be replayed from `sourceDir`; empty when every task can. */
function replayProblems(tasks: ReplayTask[], latest: Map<string, EvalReport>) {
  const problems: string[] = [];
  for (const task of tasks) {
    const report = latest.get(task.name);
    if (!report?.trials.length) problems.push(`${task.name}: no saved run`);
    else if (report.trials.some((trial) => !savedRun(trial)))
      problems.push(`${task.name}: a trial saved no agent output`);
    else if (report.trials.some((trial) => savedInstruction(trial) !== task.instruction)) {
      problems.push(`${task.name}: the prompt changed`);
    }
  }
  return problems;
}

/**
 * Reads the runs `variant` saved in `sourceDir` for `tasks`. Throws, naming every task, when one has no saved
 * run or its prompt changed since. With several reports for a task, the latest wins.
 */
export function loadReplay(sourceDir: string, variant: SkillEvalVariant, tasks: ReplayTask[]): Replay {
  const latest = new Map(
    reportFiles(sourceDir, variant)
      .map(readReport)
      .map((report) => [report.task, report]),
  );
  const problems = replayProblems(tasks, latest);
  if (problems.length) {
    const list = problems.map((line) => `  - ${line}`).join('\n');
    throw new Error(
      `Cannot replay ${variant} from ${path.basename(sourceDir)}:\n${list}\n` +
        'Run those tasks with the agent, or leave them out with --eval or --filter.',
    );
  }

  const runs = new Map(
    tasks.map((task) => [
      task.name,
      (latest.get(task.name)?.trials ?? []).flatMap((trial) => {
        const run = savedRun(trial);
        return run ? [{ ...run, durationMs: trial.duration_ms }] : [];
      }),
    ]),
  );
  return { sourceDir, runs, metadata: readMetadata(sourceDir) };
}

/** The task inputs `replay`'s source recorded for `variant`, limited to the tasks in `current`. */
export function recordedInputs(replay: Replay, variant: SkillEvalVariant, current: Record<string, string>) {
  const inputs = replay.metadata?.inputs?.[variant] ?? {};
  return Object.fromEntries(Object.keys(current).flatMap((task) => (task in inputs ? [[task, inputs[task]]] : [])));
}

/**
 * Compares the task inputs `replay`'s source recorded for `variant` with `current`. Returns the tasks it
 * recorded none for; throws when a recorded input differs, since the saved runs answer a different task.
 */
export function checkInputs(replay: Replay, variant: SkillEvalVariant, current: Record<string, string>) {
  const saved = recordedInputs(replay, variant, current);
  const unrecorded = Object.keys(current).filter((task) => saved[task] === undefined);
  const changed = Object.keys(current).filter((task) => saved[task] !== undefined && saved[task] !== current[task]);
  if (changed.length) {
    throw new Error(
      `The prompt or workspace files of ${changed.join(', ')} changed since ${path.basename(replay.sourceDir)}, ` +
        `so its ${variant} runs no longer answer them. Run those tasks with the agent.`,
    );
  }
  return unrecorded;
}

/** Writes `replay` as `<dir>/<promptKey>/<trial>.json` for the agent command to claim one by one. */
export function writeReplay(dir: string, replay: Replay, tasks: { name: string; instruction: string }[]) {
  for (const task of tasks) {
    const taskDir = path.join(dir, promptKey(task.instruction));
    mkdirSync(taskDir, { recursive: true });
    for (const [trial, run] of (replay.runs.get(task.name) ?? []).entries()) {
      writeFileSync(path.join(taskDir, `${trial}.json`), JSON.stringify(run));
    }
  }
}

/**
 * Puts each replayed trial's original duration back in the reports skillgrade wrote for `variant`, matched by
 * the agent output, so time stats describe the agent run rather than the replay.
 */
export function restoreDurations(iterationDir: string, variant: SkillEvalVariant, replay: Replay) {
  for (const file of reportFiles(iterationDir, variant)) {
    const report = readReport(file);
    const durations = new Map<string, number[]>();
    for (const run of replay.runs.get(report.task) ?? []) {
      durations.set(run.stdout, [...(durations.get(run.stdout) ?? []), run.durationMs]);
    }
    for (const trial of report.trials) {
      const duration = durations.get(savedRun(trial)?.stdout ?? '')?.shift();
      if (duration !== undefined) trial.duration_ms = duration;
    }
    writeFileSync(file, `${JSON.stringify(report, null, 2)}\n`);
  }
}

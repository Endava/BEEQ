import { spawn } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { stringify } from 'yaml';

import type { SkillEvalVariant } from '../schema.d.ts';
import type { EvalReport } from './benchmark.ts';
import { SUITE_FILES } from './suite.ts';

/**
 * Copies the suite to a temp folder outside the repo, so nothing in the agent's workspace points back at
 * the repo or the answer keys. `tasks/` is left out (it becomes eval.yaml), and `solutions/` unless validating.
 */
export function createRuntime(evalsDir: string, { validate }: { validate: boolean }) {
  const runtimeDir = mkdtempSync(path.join(tmpdir(), 'beeq-skill-eval-'));
  const skipped = new Set<string>([SUITE_FILES.tasks, 'node_modules', ...(validate ? [] : [SUITE_FILES.solutions])]);
  for (const entry of readdirSync(evalsDir)) {
    if (skipped.has(entry)) continue;
    cpSync(path.join(evalsDir, entry), path.join(runtimeDir, entry), { recursive: true });
  }
  return runtimeDir;
}

/** Writes one variant's eval.yaml in its own folder; skillgrade names its output folder after it. */
export function writeEvalConfig(runtimeDir: string, variant: SkillEvalVariant, config: unknown) {
  const dir = path.join(runtimeDir, 'variants', variant);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'eval.yaml'), stringify(config, { lineWidth: 0 }));
  return dir;
}

const iterations = (outputDir: string) =>
  existsSync(outputDir)
    ? readdirSync(outputDir)
        .map((entry) => /^iteration-(\d+)$/.exec(entry)?.[1])
        .filter((value): value is string => value !== undefined)
        .map(Number)
    : [];

/** The next unused `iteration-N` folder in `outputDir`. */
export function nextIterationDir(outputDir: string) {
  return path.join(outputDir, `iteration-${Math.max(0, ...iterations(outputDir)) + 1}`);
}

/** `iteration-<iteration>` in `outputDir`, or the latest one when `iteration` is omitted. */
export function findIterationDir(outputDir: string, iteration?: number) {
  const used = iterations(outputDir);
  const chosen = iteration ?? (used.length ? Math.max(...used) : undefined);
  if (chosen === undefined || !used.includes(chosen)) {
    throw new Error(
      iteration === undefined
        ? `No eval results in ${outputDir}. Run the eval first.`
        : `No iteration-${iteration} in ${outputDir}.`,
    );
  }
  return path.join(outputDir, `iteration-${chosen}`);
}

/**
 * skillgrade `preview` arguments and cwd for one variant. skillgrade reads `<--output>/<cwd name>/results`,
 * so it runs from the variant folder with the iteration as its output.
 */
export function previewCommand(iterationDir: string, variant: SkillEvalVariant, mode: 'cli' | 'browser') {
  const cwd = path.join(iterationDir, variant);
  if (!existsSync(path.join(cwd, 'results'))) throw new Error(`No ${variant} results in ${iterationDir}.`);
  return { cwd, args: ['preview', ...(mode === 'browser' ? ['browser'] : []), `--output=${iterationDir}`] };
}

/** Absolute path of the skillgrade CLI installed for the suite's project. */
export function resolveSkillgradeBin(evalsDir: string) {
  const require = createRequire(path.join(evalsDir, 'package.json'));
  const manifestPath = require.resolve('skillgrade/package.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { bin?: string | Record<string, string> };
  const bin = typeof manifest.bin === 'string' ? manifest.bin : manifest.bin?.skillgrade;
  if (!bin) throw new Error(`skillgrade at ${manifestPath} declares no bin.`);
  return path.join(path.dirname(manifestPath), bin);
}

/** Exit code `runNode` reports when the child was stopped with SIGINT or SIGTERM. */
export const INTERRUPTED = 130;

export function runNode(script: string, args: string[], options: { cwd: string; env?: NodeJS.ProcessEnv }) {
  return new Promise<number>((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      stdio: 'inherit',
    });
    child.on('error', reject);
    child.on('close', (code, signal) =>
      resolve(code ?? (signal === 'SIGINT' || signal === 'SIGTERM' ? INTERRUPTED : 1)),
    );
  });
}

/** skillgrade CLI flags for a run. */
export function skillgradeArgs(options: {
  outputDir: string;
  trials: number;
  parallel: number;
  eval: string[];
  filter: string[];
  validate: boolean;
  list: boolean;
}) {
  return [
    '--agent=command',
    '--provider=local',
    `--output=${options.outputDir}`,
    ...(options.validate ? ['--validate'] : [`--trials=${options.trials}`, `--parallel=${options.parallel}`]),
    ...(options.eval.length ? [`--eval=${options.eval.join(',')}`] : []),
    ...options.filter.map((filter) => `--filter=${filter}`),
    ...(options.list ? ['--list'] : []),
  ];
}

/** Every report skillgrade wrote for `variant` under `iterationDir`. */
export function readReports(iterationDir: string, variant: SkillEvalVariant): EvalReport[] {
  const resultsDir = path.join(iterationDir, variant, 'results');
  if (!existsSync(resultsDir)) return [];
  return readdirSync(resultsDir)
    .filter((file) => file.endsWith('.json'))
    .sort((a, b) => a.localeCompare(b, 'en'))
    .map((file) => JSON.parse(readFileSync(path.join(resultsDir, file), 'utf8')) as EvalReport);
}

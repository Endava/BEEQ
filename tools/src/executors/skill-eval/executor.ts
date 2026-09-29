import { rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { type ExecutorContext, logger, type PromiseExecutor } from '@nx/devkit';

import {
  type Benchmark,
  buildBenchmark,
  buildEvalConfig,
  checkRubric,
  createRuntime,
  type EvalReport,
  findIterationDir,
  findRubricError,
  formatBenchmark,
  INTERRUPTED,
  loadSuite,
  type NormalizedOptions,
  nextIterationDir,
  normalizeOptions,
  previewCommand,
  readReports,
  resolveSkillgradeBin,
  runNode,
  SUITE_FILES,
  type Suite,
  skillgradeArgs,
  writeEvalConfig,
} from './lib/index.ts';
import type { SkillEvalExecutorSchema, SkillEvalVariant } from './schema.d.ts';

/**
 * Runs a skillgrade eval suite with and without a skill and writes `benchmark.json`.
 *
 * 1. With the LLM rubric on, sends the judge one short request, so a broken key, model, or quota fails first.
 * 2. Copies the suite to a temp runtime folder and runs its `prepare.ts`.
 * 3. Writes one skillgrade `eval.yaml` per variant from `eval.base.yaml` and `tasks/*.yaml`.
 * 4. Runs skillgrade once per variant into `<outputPath>/iteration-N/<variant>/`, stopping at the first
 *    rubric error.
 * 5. Aggregates the reports into `iteration-N/benchmark.json` and applies `threshold`.
 */
export const runExecutor: PromiseExecutor<SkillEvalExecutorSchema> = async (rawOptions, context: ExecutorContext) => {
  const options = normalizeOptions(rawOptions, context.root);
  const bin = resolveSkillgradeBin(options.evalsDir);
  if (options.preview) return preview(bin, options);

  const suite = loadSuite(options.evalsDir);
  const iterationDir = nextIterationDir(options.outputDir);
  const runtimeDir = createRuntime(options.evalsDir, { validate: options.validate });
  const run: Run = { bin, suite, runtimeDir, iterationDir, options, root: context.root };

  if (options.notice) logger.warn(options.notice);

  try {
    if (options.llmRubric && !options.list) await checkJudge(options);
    if (suite.prepare && !options.list) await prepare(run);
    const reports = await runVariants(run);
    if (options.list) return { success: true };
    if (options.validate) return { success: checkSolutions(reports.baseline ?? []) };
    return { success: meetsThreshold(writeBenchmark(run, reports), options.threshold) };
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return { success: false };
  } finally {
    rmSync(runtimeDir, { recursive: true, force: true });
  }
};

type Run = {
  bin: string;
  suite: Suite;
  runtimeDir: string;
  iterationDir: string;
  options: NormalizedOptions;
  root: string;
};

type Reports = Partial<Record<SkillEvalVariant, EvalReport[]>>;

/** Fails before any agent runs when the LLM judge cannot answer. */
async function checkJudge({ evalsDir, graderProvider, graderModel }: NormalizedOptions) {
  await checkRubric(evalsDir, { provider: graderProvider, model: graderModel });
  logger.info(`LLM rubric: ${graderProvider} ${graderModel ?? '(skillgrade default model)'} answered.`);
}

/** Runs the suite's `prepare.ts` in the runtime folder. */
async function prepare({ runtimeDir, options, root }: Run) {
  const code = await runNode(path.join(runtimeDir, SUITE_FILES.prepare), [], {
    cwd: runtimeDir,
    env: {
      SKILL_EVAL_WORKSPACE_ROOT: root,
      SKILL_EVAL_VARIANTS: options.variants.join(','),
      SKILL_EVAL_VALIDATE: String(options.validate),
    },
  });
  if (code !== 0) throw new Error(`${SUITE_FILES.prepare} exited with ${code}.`);
}

/** Runs skillgrade once per variant and reads back its reports (none when only listing tasks). */
async function runVariants(run: Run) {
  const reports: Reports = {};
  for (const variant of run.options.variants) {
    const variantReports = await runVariant(run, variant);
    if (!run.options.list) reports[variant] = variantReports;
  }
  return reports;
}

/**
 * Runs skillgrade for one variant. With the LLM rubric on, stops skillgrade at the first report whose rubric
 * failed and throws, so the remaining variants never start.
 */
async function runVariant({ bin, suite, runtimeDir, iterationDir, options, root }: Run, variant: SkillEvalVariant) {
  const variantDir = writeEvalConfig(runtimeDir, variant, buildEvalConfig({ suite, runtimeDir, variant, ...options }));
  const watchRubric = options.llmRubric && !options.list;

  logger.info(`\n${options.validate ? 'validate' : variant} → ${path.relative(root, iterationDir)}`);
  const stop = new AbortController();
  const watch = watchRubric ? watchReports(iterationDir, variant, stop) : undefined;
  const code = await runNode(bin, skillgradeArgs({ ...options, outputDir: iterationDir }), {
    cwd: variantDir,
    signal: stop.signal,
  }).finally(() => clearInterval(watch));

  const reports = options.list ? [] : readReports(iterationDir, variant);
  const rubricError = watchRubric ? findRubricError(reports) : undefined;
  if (rubricError) {
    const inFlight = stop.signal.aborted ? ' The agent trial that was running finishes on its own.' : '';
    throw new Error(
      `The LLM rubric failed on ${variant}/${rubricError.task}: ${rubricError.details}\n` +
        `The run stopped, and its rewards leave out the rubric.${inFlight} Fix the grader and rerun.`,
    );
  }
  if (code !== 0) throw new Error(`skillgrade exited with ${code} for ${variant}.`);
  return reports;
}

/** Aborts `stop` once a report skillgrade has written for `variant` holds a rubric error. */
function watchReports(iterationDir: string, variant: SkillEvalVariant, stop: AbortController) {
  return setInterval(() => {
    try {
      if (findRubricError(readReports(iterationDir, variant))) stop.abort();
    } catch {
      // A report skillgrade is still writing does not parse yet; the next poll reads it.
    }
  }, 5000);
}

/** Logs each reference solution's reward. True when there is at least one and every one scores 1. */
function checkSolutions(reports: EvalReport[]) {
  const results = reports.map((report) => ({ task: report.task, reward: report.trials[0]?.reward ?? 0 }));
  const failed = results.filter((result) => result.reward < 1);
  for (const result of results)
    logger.info(`  ${result.reward === 1 ? 'ok  ' : 'FAIL'}  ${result.task}  ${result.reward.toFixed(2)}`);
  if (results.length === 0) logger.error('No task has a solution to validate.');
  if (failed.length)
    logger.error(`${failed.length} solution(s) did not score 1.0: ${failed.map((r) => r.task).join(', ')}`);
  return results.length > 0 && failed.length === 0;
}

/** Aggregates the reports into `benchmark.json` and logs the table. */
function writeBenchmark({ iterationDir, options, root }: Run, reports: Reports) {
  const benchmark = buildBenchmark(reports, {
    skill: path.relative(root, options.skillDir),
    agent: options.agent,
    model: options.model ?? 'default',
    trials: options.trials,
    graders: options.llmRubric ? `deterministic + llm_rubric (${options.graderProvider})` : 'deterministic',
    filter: options.filter,
    eval: options.eval,
    timestamp: new Date().toISOString(),
  });
  const benchmarkPath = path.join(iterationDir, 'benchmark.json');
  writeFileSync(benchmarkPath, `${JSON.stringify(benchmark, null, 2)}\n`);

  logger.info(`\n${formatBenchmark(benchmark)}\n\nBenchmark: ${path.relative(root, benchmarkPath)}`);
  return benchmark;
}

/** False, with an error, when the with-skill mean reward is below `threshold`. */
function meetsThreshold(benchmark: Benchmark, threshold?: number) {
  const reward = benchmark.run_summary['with-skill']?.reward.mean;
  if (threshold === undefined || reward === undefined || reward >= threshold) return true;
  logger.error(`With-skill mean reward ${reward.toFixed(2)} is below the threshold ${threshold}.`);
  return false;
}

/** Shows saved results: every variant in the terminal, or the first variant in the browser viewer. */
async function preview(bin: string, options: NormalizedOptions) {
  const mode = options.preview ?? 'cli';
  try {
    const iterationDir = findIterationDir(options.outputDir, options.iteration);
    const variants = mode === 'browser' ? options.variants.slice(0, 1) : options.variants;
    for (const variant of variants) {
      const { cwd, args } = previewCommand(iterationDir, variant, mode);
      logger.info(`\n${variant}: ${path.basename(iterationDir)}`);
      const code = await runNode(bin, args, { cwd });
      // Stopping the browser viewer with Ctrl+C is how a preview normally ends.
      if (code === INTERRUPTED) break;
      if (code !== 0) return { success: false };
    }
    return { success: true };
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return { success: false };
  }
}

export default runExecutor;

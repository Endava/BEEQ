import { rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { type ExecutorContext, logger, type PromiseExecutor } from '@nx/devkit';

import {
  type Benchmark,
  buildBenchmark,
  buildEvalConfig,
  checkInputs,
  checkRubric,
  createRuntime,
  type EvalReport,
  findIterationDir,
  findRubricError,
  formatBenchmark,
  INTERRUPTED,
  loadReplay,
  loadSuite,
  type NormalizedOptions,
  nextIterationDir,
  normalizeOptions,
  previewCommand,
  REPLAY_ENV,
  type Replay,
  readReports,
  recordedInputs,
  resolveSkillgradeBin,
  restoreDurations,
  runNode,
  SUITE_FILES,
  type Suite,
  type SuiteTask,
  selectTasks,
  skillgradeArgs,
  taskInputs,
  writeEvalConfig,
  writeInstructions,
  writeReplay,
} from './lib/index.ts';
import type { SkillEvalExecutorSchema, SkillEvalVariant } from './schema.d.ts';

/**
 * Runs a skillgrade eval suite with and without a skill and writes `benchmark.json`.
 *
 * 1. Copies the suite to a temp runtime folder and runs its `prepare.ts`.
 * 2. Loads the saved runs a `regrade` or `reuseBaseline` replays, failing when one no longer fits its task.
 * 3. With the LLM rubric on, sends the judge one short request, so a broken key, model, or quota fails first.
 * 4. Writes one skillgrade `eval.yaml` per variant from `eval.base.yaml` and `tasks/*.yaml`.
 * 5. Runs skillgrade once per variant into `<outputPath>/iteration-N/<variant>/`, one after the other or at
 *    once, stopping at the first rubric error.
 * 6. Aggregates the reports into `iteration-N/benchmark.json` and applies `threshold`.
 */
export const runExecutor: PromiseExecutor<SkillEvalExecutorSchema> = async (rawOptions, context: ExecutorContext) => {
  const options = normalizeOptions(rawOptions, context.root);
  const bin = resolveSkillgradeBin(options.evalsDir);
  if (options.preview) return preview(bin, options);

  const suite = loadSuite(options.evalsDir);
  const iterationDir = nextIterationDir(options.outputDir);
  const runtimeDir = createRuntime(options.evalsDir, { validate: options.validate });
  const setup: Setup = { bin, suite, runtimeDir, iterationDir, options, root: context.root };

  if (options.notice) logger.warn(options.notice);

  try {
    if (suite.prepare && !options.list) await prepare(setup);
    const run: Run = { ...setup, ...(options.list ? { inputs: {}, replays: {} } : plan(setup)) };
    if (options.llmRubric && !options.list) await checkJudge(options);
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

type Setup = {
  bin: string;
  suite: Suite;
  runtimeDir: string;
  iterationDir: string;
  options: NormalizedOptions;
  root: string;
};

type Run = Setup & {
  /** Task inputs (`taskInputs`) of the selected tasks. */
  inputs: Record<string, string>;
  /** The saved runs each replayed variant uses instead of the agent. */
  replays: Partial<Record<SkillEvalVariant, Replay>>;
};

type Reports = Partial<Record<SkillEvalVariant, EvalReport[]>>;

/** A variant stopped because the other one, running at the same time, failed. */
class StoppedError extends Error {}

/** Variants whose agent runs: every variant not replaying saved runs. */
const agentVariants = ({ variants, replay }: NormalizedOptions) =>
  variants.filter((variant) => replay[variant] === undefined);

/** Fails before any agent runs when the LLM judge cannot answer. */
async function checkJudge({ evalsDir, graderProvider, graderModel }: NormalizedOptions) {
  await checkRubric(evalsDir, { provider: graderProvider, model: graderModel });
  logger.info(`LLM rubric: ${graderProvider} ${graderModel ?? '(skillgrade default model)'} answered.`);
}

/** Runs the suite's `prepare.ts` in the runtime folder. */
async function prepare({ runtimeDir, options, root }: Setup) {
  const code = await runNode(path.join(runtimeDir, SUITE_FILES.prepare), [], {
    cwd: runtimeDir,
    env: {
      SKILL_EVAL_WORKSPACE_ROOT: root,
      SKILL_EVAL_VARIANTS: agentVariants(options).join(','),
      SKILL_EVAL_VALIDATE: String(options.validate),
    },
  });
  if (code !== 0) throw new Error(`${SUITE_FILES.prepare} exited with ${code}.`);
}

/**
 * Writes each task's prompt file, hashes the selected tasks' inputs, and loads the saved runs of every
 * replayed variant, so a replay that no longer fits fails before the judge check or any agent.
 */
function plan(setup: Setup): Pick<Run, 'inputs' | 'replays'> {
  const { suite, runtimeDir, options } = setup;
  const { tasks } = buildEvalConfig({ suite, runtimeDir, variant: 'baseline', ...options });
  writeInstructions(runtimeDir, tasks);
  if (options.validate) return { inputs: {}, replays: {} };

  const selected = selectTasks(options.evalsDir, tasks, options);
  const inputs = taskInputs(selected);
  const replays: Run['replays'] = {};
  for (const variant of options.variants) {
    const iteration = options.replay[variant];
    if (iteration !== undefined) replays[variant] = prepareReplay(setup, variant, iteration, selected, inputs);
  }
  return { inputs, replays };
}

/** Loads and checks `variant`'s saved runs from `iteration-<iteration>`, and writes them for the agent command. */
function prepareReplay(
  { runtimeDir, options }: Setup,
  variant: SkillEvalVariant,
  iteration: number,
  tasks: SuiteTask[],
  inputs: Record<string, string>,
) {
  const replay = loadReplay(findIterationDir(options.outputDir, iteration), variant, tasks);
  const source = path.basename(replay.sourceDir);
  const unrecorded = checkInputs(replay, variant, inputs);
  if (unrecorded.length) {
    logger.warn(
      `${source} did not record the inputs of ${unrecorded.length} of ${tasks.length} ${variant} tasks, so only ` +
        'their prompts were checked. Their workspace files may have changed since.',
    );
  }
  if (agentVariants(options).length) checkAgent(replay, options);

  writeReplay(path.join(runtimeDir, 'replay', variant), replay, tasks);
  const trials = [...replay.runs.values()].reduce((sum, runs) => sum + runs.length, 0);
  logger.info(`${variant}: replaying ${trials} saved runs from ${source} through the current graders.`);
  return replay;
}

/** Throws when a reused variant ran another agent or model than this run, which would compare two agents. */
function checkAgent({ sourceDir, metadata }: Replay, options: NormalizedOptions) {
  const source = path.basename(sourceDir);
  if (!metadata) {
    logger.warn(`${source} has no benchmark.json, so its agent and model could not be checked.`);
    return;
  }
  const model = options.model ?? 'default';
  if (metadata.agent !== options.agent || metadata.model !== model) {
    throw new Error(
      `${source} ran ${metadata.agent} with the ${metadata.model} model, and this run uses ${options.agent} with ` +
        `the ${model} model. Reuse runs from the same agent and model.`,
    );
  }
}

/**
 * Runs skillgrade once per variant, one after the other or at once, and reads back its reports (none when
 * only listing tasks). The first failure stops the other variant.
 */
async function runVariants(run: Run) {
  const stop = new AbortController();
  const runOne = (variant: SkillEvalVariant) =>
    runVariant(run, variant, stop).catch((error) => {
      stop.abort();
      throw error;
    });

  const { variants, concurrent, list } = run.options;
  const results: EvalReport[][] = [];
  if (concurrent && !list) {
    const settled = await Promise.allSettled(variants.map(runOne));
    const failures = settled.flatMap((result) => (result.status === 'rejected' ? [result.reason] : []));
    const failure = failures.find((error) => !(error instanceof StoppedError)) ?? failures[0];
    if (failure) throw failure;
    for (const result of settled) if (result.status === 'fulfilled') results.push(result.value);
  } else {
    for (const variant of variants) results.push(await runOne(variant));
  }
  return list ? {} : (Object.fromEntries(variants.map((variant, index) => [variant, results[index]])) as Reports);
}

/** `variant`'s eval.yaml; a replayed task runs once per saved run. */
function variantConfig({ suite, runtimeDir, options, replays }: Run, variant: SkillEvalVariant) {
  const config = buildEvalConfig({ suite, runtimeDir, variant, ...options });
  const replay = replays[variant];
  if (!replay) return config;
  return {
    ...config,
    tasks: config.tasks.map((task) => {
      const runs = replay.runs.get(task.name);
      return runs ? { ...task, trials: runs.length } : task;
    }),
  };
}

/**
 * Runs skillgrade for one variant: the agent, or the saved runs it replays. With the LLM rubric on, stops
 * skillgrade at the first report whose rubric failed and throws. Aborting `stop` ends the run early.
 */
async function runVariant(run: Run, variant: SkillEvalVariant, stop: AbortController) {
  const { bin, runtimeDir, iterationDir, options, root } = run;
  const replay = run.replays[variant];
  const variantDir = writeEvalConfig(runtimeDir, variant, variantConfig(run, variant));
  const watchRubric = options.llmRubric && !options.list;
  const prefix = options.concurrent && !options.list ? `[${variant}] ` : undefined;

  logger.info(`\n${options.validate ? 'validate' : variant} → ${path.relative(root, iterationDir)}`);
  const watch = watchRubric ? watchReports(iterationDir, variant, stop) : undefined;
  const code = await runNode(bin, skillgradeArgs({ ...options, outputDir: iterationDir, replay: Boolean(replay) }), {
    cwd: variantDir,
    signal: stop.signal,
    env: replay ? { [REPLAY_ENV]: path.join(runtimeDir, 'replay', variant) } : undefined,
    prefix,
  }).finally(() => clearInterval(watch));

  if (replay && !options.list) restoreDurations(iterationDir, variant, replay);
  const reports = options.list ? [] : readReports(iterationDir, variant);
  if (watchRubric) checkRubricErrors(reports, variant, stop.signal.aborted);
  if (code !== 0 && stop.signal.aborted) throw new StoppedError(`${variant} stopped because the other variant failed.`);
  if (code !== 0) throw new Error(`skillgrade exited with ${code} for ${variant}.`);
  return reports;
}

/** Throws when a report of `variant` holds a rubric the judge never scored. */
function checkRubricErrors(reports: EvalReport[], variant: SkillEvalVariant, stopped: boolean) {
  const rubricError = findRubricError(reports);
  if (!rubricError) return;
  const inFlight = stopped ? ' The agent trial that was running finishes on its own.' : '';
  throw new Error(
    `The LLM rubric failed on ${variant}/${rubricError.task}: ${rubricError.details}\n` +
      `The run stopped, and its rewards leave out the rubric.${inFlight} Fix the grader and rerun.`,
  );
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

/**
 * Each variant's task inputs: the current ones when its agent ran, and when it replayed saved runs, only those
 * its source recorded, so a replay never vouches for inputs nobody checked.
 */
function variantInputs({ options, inputs, replays }: Run) {
  return Object.fromEntries(
    options.variants.map((variant) => {
      const replay = replays[variant];
      return [variant, replay ? recordedInputs(replay, variant, inputs) : inputs];
    }),
  );
}

/** Aggregates the reports into `benchmark.json` and logs the table. */
function writeBenchmark(run: Run, reports: Reports) {
  const { iterationDir, options, root, replays } = run;
  // A regrade reports the agent, model, and trials of the runs it replayed.
  const source = agentVariants(options).length ? undefined : Object.values(replays)[0]?.metadata;
  const replayed = Object.entries(replays).map(([variant, replay]) => [variant, path.basename(replay.sourceDir)]);
  const benchmark = buildBenchmark(reports, {
    skill: path.relative(root, options.skillDir),
    agent: source?.agent ?? options.agent,
    model: source?.model ?? options.model ?? 'default',
    trials: source?.trials ?? options.trials,
    graders: options.llmRubric ? `deterministic + llm_rubric (${options.graderProvider})` : 'deterministic',
    filter: options.filter,
    eval: options.eval,
    timestamp: new Date().toISOString(),
    ...(replayed.length ? { replayed: Object.fromEntries(replayed) } : {}),
    inputs: variantInputs(run),
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

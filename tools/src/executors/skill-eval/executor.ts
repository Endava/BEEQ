import { rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { type ExecutorContext, logger, type PromiseExecutor } from '@nx/devkit';

import {
  buildBenchmark,
  buildEvalConfig,
  createRuntime,
  type EvalReport,
  findIterationDir,
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
  skillgradeArgs,
  writeEvalConfig,
} from './lib/index.ts';
import type { SkillEvalExecutorSchema, SkillEvalVariant } from './schema.d.ts';

/**
 * Runs a skillgrade eval suite with and without a skill and writes `benchmark.json`.
 *
 * 1. Copies the suite to a temp runtime folder and runs its `prepare.ts`.
 * 2. Writes one skillgrade `eval.yaml` per variant from `eval.base.yaml` and `tasks/*.yaml`.
 * 3. Runs skillgrade once per variant into `<outputPath>/iteration-N/<variant>/`.
 * 4. Aggregates the reports into `iteration-N/benchmark.json` and applies `threshold`.
 */
export const runExecutor: PromiseExecutor<SkillEvalExecutorSchema> = async (rawOptions, context: ExecutorContext) => {
  const options = normalizeOptions(rawOptions, context.root);
  const bin = resolveSkillgradeBin(options.evalsDir);
  if (options.preview) return preview(bin, options);

  const suite = loadSuite(options.evalsDir);
  const iterationDir = nextIterationDir(options.outputDir);
  const runtimeDir = createRuntime(options.evalsDir, { validate: options.validate });

  if (options.notice) logger.warn(options.notice);

  try {
    if (suite.prepare && !options.list) {
      const code = await runNode(path.join(runtimeDir, SUITE_FILES.prepare), [], {
        cwd: runtimeDir,
        env: {
          SKILL_EVAL_WORKSPACE_ROOT: context.root,
          SKILL_EVAL_VARIANTS: options.variants.join(','),
          SKILL_EVAL_VALIDATE: String(options.validate),
        },
      });
      if (code !== 0) throw new Error(`${SUITE_FILES.prepare} exited with ${code}.`);
    }

    const reports: Partial<Record<SkillEvalVariant, EvalReport[]>> = {};
    for (const variant of options.variants) {
      const config = buildEvalConfig({ suite, runtimeDir, variant, ...options });
      const variantDir = writeEvalConfig(runtimeDir, variant, config);

      logger.info(`\n${options.validate ? 'validate' : variant} → ${path.relative(context.root, iterationDir)}`);
      const code = await runNode(bin, skillgradeArgs({ ...options, outputDir: iterationDir }), { cwd: variantDir });
      if (code !== 0) throw new Error(`skillgrade exited with ${code} for ${variant}.`);
      if (!options.list) reports[variant] = readReports(iterationDir, variant);
    }

    if (options.list) return { success: true };

    if (options.validate) {
      const results = (reports.baseline ?? []).map((report) => ({
        task: report.task,
        reward: report.trials[0]?.reward ?? 0,
      }));
      const failed = results.filter((result) => result.reward < 1);
      for (const result of results)
        logger.info(`  ${result.reward === 1 ? 'ok  ' : 'FAIL'}  ${result.task}  ${result.reward.toFixed(2)}`);
      if (results.length === 0) logger.error('No task has a solution to validate.');
      if (failed.length)
        logger.error(`${failed.length} solution(s) did not score 1.0: ${failed.map((r) => r.task).join(', ')}`);
      return { success: results.length > 0 && failed.length === 0 };
    }

    const benchmark = buildBenchmark(reports, {
      skill: path.relative(context.root, options.skillDir),
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

    logger.info(`\n${formatBenchmark(benchmark)}\n\nBenchmark: ${path.relative(context.root, benchmarkPath)}`);

    const reward = benchmark.run_summary['with-skill']?.reward.mean;
    if (options.threshold !== undefined && reward !== undefined && reward < options.threshold) {
      logger.error(`With-skill mean reward ${reward.toFixed(2)} is below the threshold ${options.threshold}.`);
      return { success: false };
    }
    return { success: true };
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    return { success: false };
  } finally {
    rmSync(runtimeDir, { recursive: true, force: true });
  }
};

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

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { SkillEvalGraderProvider } from '../schema.d.ts';
import type { EvalReport } from './benchmark.ts';
import { withJudgeRetries } from './judge-retry.ts';

type GraderResult = { score: number; details: string };
type LlmGrader = {
  grade(
    workspace: string,
    provider: undefined,
    config: Record<string, unknown>,
    taskPath: string,
    sessionLog: unknown[],
    env: NodeJS.ProcessEnv,
  ): Promise<GraderResult>;
};

/**
 * How skillgrade's `llm_rubric` reports a judge that never scored: a missing key, an HTTP or network error,
 * a failed model lookup, or a reply it could not read. skillgrade scores these 0 and carries on.
 */
const RUBRIC_ERROR =
  /^(?:Missing \w+_API_KEY|\w+ API (?:returned (?:HTTP|status) \d+|error:)|Failed to parse LLM response|Invalid response from|No suitable \w+ models|Rubric file not found|Unknown grader provider)/;

export const isRubricError = (details: string) => RUBRIC_ERROR.test(details);

/** The first `llm_rubric` result in `reports` where the judge never scored the trial. */
export function findRubricError(reports: EvalReport[]) {
  for (const report of reports) {
    for (const trial of report.trials) {
      const error = trial.grader_results.find(
        (result) => result.grader_type === 'llm_rubric' && isRubricError(result.details ?? ''),
      );
      if (error) return { task: report.task, details: error.details ?? '' };
    }
  }
  return undefined;
}

/**
 * Runs skillgrade's LLM judge once on a one-line rubric, with the provider and model the eval will use, so a
 * bad key, model, permission, or quota fails before any agent runs. Costs one short request, retried like the
 * eval's judge calls when it hits a rate limit.
 */
export async function checkRubric(
  evalsDir: string,
  judge: { provider?: SkillEvalGraderProvider; model?: string },
  env: NodeJS.ProcessEnv = process.env,
) {
  const require = createRequire(path.join(evalsDir, 'package.json'));
  const { getGrader } = require('skillgrade/dist/graders/index.js') as { getGrader(type: string): LlmGrader };
  const dir = mkdtempSync(path.join(tmpdir(), 'beeq-rubric-check-'));
  try {
    mkdirSync(path.join(dir, 'prompts'));
    writeFileSync(
      path.join(dir, 'prompts', 'quality.md'),
      'This checks the grader connection; there is no session. Score 1.0.',
    );
    const config = { type: 'llm_rubric', rubric: 'prompts/quality.md', weight: 1, ...judge };
    const result = await withJudgeRetries(() => getGrader('llm_rubric').grade(dir, undefined, config, dir, [], env));
    if (isRubricError(result.details))
      throw new Error(`The LLM rubric check failed, so no agent ran. ${result.details}`);
    return result;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

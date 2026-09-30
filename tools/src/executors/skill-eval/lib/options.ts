import path from 'node:path';

import type {
  SkillEvalAgent,
  SkillEvalExecutorSchema,
  SkillEvalGraderProvider,
  SkillEvalPreview,
  SkillEvalVariant,
} from '../schema.d.ts';

export type NormalizedOptions = {
  workspaceRoot: string;
  skillDir: string;
  evalsDir: string;
  outputDir: string;
  agent: SkillEvalAgent;
  model?: string;
  variants: SkillEvalVariant[];
  trials: number;
  parallel: number;
  timeout: number;
  eval: string[];
  filter: string[];
  /** `false` runs deterministic graders only. */
  llmRubric: boolean;
  graderProvider?: SkillEvalGraderProvider;
  graderModel?: string;
  threshold?: number;
  validate: boolean;
  list: boolean;
  preview?: SkillEvalPreview;
  iteration?: number;
  /** Variant → the iteration whose saved runs it replays instead of running the agent. */
  replay: Partial<Record<SkillEvalVariant, number>>;
  concurrent: boolean;
  /** Why the LLM rubric is off, when `grader` is `auto` and no key is set. */
  notice?: string;
};

const GRADER_KEYS: [SkillEvalGraderProvider, string][] = [
  ['anthropic', 'ANTHROPIC_API_KEY'],
  ['openai', 'OPENAI_API_KEY'],
  ['gemini', 'GEMINI_API_KEY'],
];

/** The first grader provider with an API key in `env`. */
export const detectGraderProvider = (env: NodeJS.ProcessEnv) => GRADER_KEYS.find(([, key]) => env[key]?.trim())?.[0];

/** Which variants replay which iteration, from `regrade` and `reuseBaseline`. */
function replayOptions(options: SkillEvalExecutorSchema, variants: SkillEvalVariant[]) {
  const { regrade, reuseBaseline } = options;
  if (regrade === undefined && reuseBaseline === undefined) return {};
  if (options.validate) throw new Error('validate grades the reference solutions; it cannot replay saved runs.');
  if (regrade !== undefined && reuseBaseline !== undefined) {
    throw new Error('Use regrade or reuseBaseline, not both: regrade already replays the baseline.');
  }
  if (regrade !== undefined) return Object.fromEntries(variants.map((variant) => [variant, regrade]));
  if (!variants.includes('baseline')) throw new Error('reuseBaseline needs the baseline variant in variants.');
  return { baseline: reuseBaseline };
}

export function normalizeOptions(
  options: SkillEvalExecutorSchema,
  workspaceRoot: string,
  env: NodeJS.ProcessEnv = process.env,
): NormalizedOptions {
  const validate = options.validate ?? false;
  const grader = validate ? 'deterministic' : (options.grader ?? 'auto');
  const graderProvider = options.graderProvider ?? detectGraderProvider(env);

  if (grader === 'all' && !graderProvider) {
    throw new Error(
      `grader "all" needs an LLM rubric key: set one of ${GRADER_KEYS.map(([, key]) => key).join(', ')}.`,
    );
  }

  const llmRubric = grader === 'all' || (grader === 'auto' && Boolean(graderProvider));
  const variants: SkillEvalVariant[] = validate ? ['baseline'] : (options.variants ?? ['with-skill', 'baseline']);

  return {
    workspaceRoot,
    skillDir: path.resolve(workspaceRoot, options.skill),
    evalsDir: path.resolve(workspaceRoot, options.evalsDir),
    outputDir: path.resolve(workspaceRoot, options.outputPath ?? 'tmp/skill-evals'),
    agent: options.agent ?? 'copilot',
    model: options.model,
    variants,
    trials: validate ? 1 : (options.trials ?? 1),
    parallel: options.parallel ?? 1,
    timeout: options.timeout ?? 600,
    eval: options.eval ?? [],
    filter: options.filter ?? [],
    llmRubric,
    graderProvider: llmRubric ? graderProvider : undefined,
    graderModel: options.graderModel,
    threshold: options.threshold,
    validate,
    list: options.list ?? false,
    preview: options.preview,
    iteration: options.iteration,
    replay: replayOptions(options, variants),
    concurrent: Boolean(options.concurrent),
    notice:
      grader === 'auto' && !llmRubric
        ? 'No grader API key is set, so only the deterministic graders run. Set ANTHROPIC_API_KEY, OPENAI_API_KEY, or GEMINI_API_KEY to add the LLM rubric.'
        : undefined,
  };
}

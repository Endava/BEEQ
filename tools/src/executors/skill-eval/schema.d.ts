/* -------------------------------------------------------------------------- */
/*                        BEEQ skill eval executor options                    */
/* -------------------------------------------------------------------------- */

type SkillEvalAgent = 'copilot' | 'claude' | 'codex';
type SkillEvalVariant = 'with-skill' | 'baseline';
type SkillEvalGrader = 'auto' | 'deterministic' | 'all';
type SkillEvalGraderProvider = 'anthropic' | 'openai' | 'gemini';
type SkillEvalPreview = 'cli' | 'browser';

/**
 * Input options for the `@beeq/tools:skill-eval` executor.
 *
 * Kept in sync with [`schema.json`](./schema.json), which Nx uses for runtime validation and defaults.
 */
type SkillEvalExecutorSchema = {
  /** Skill folder (relative to the workspace root) installed in the with-skill variant. */
  skill: string;

  /** Eval suite folder (relative to the workspace root). */
  evalsDir: string;

  /** @default 'copilot' */
  agent?: SkillEvalAgent;

  /** Model passed to the agent CLI. Omit to use the CLI default. */
  model?: string;

  /** @default ['with-skill', 'baseline'] */
  variants?: SkillEvalVariant[];

  /** @default 1 */
  trials?: number;

  /** @default 1 */
  parallel?: number;

  /** Agent time limit per trial, in seconds. @default 600 */
  timeout?: number;

  /** Task names to run. */
  eval?: string[];

  /** skillgrade metadata filters (`KEY=VALUE`). */
  filter?: string[];

  /** @default 'auto' */
  grader?: SkillEvalGrader;

  graderProvider?: SkillEvalGraderProvider;

  graderModel?: string;

  /** Fail when the with-skill mean reward is below this value. */
  threshold?: number;

  /** Run `solutions/<task>.sh` instead of an agent. @default false */
  validate?: boolean;

  /** @default false */
  list?: boolean;

  /** Show saved results instead of running. */
  preview?: SkillEvalPreview;

  /** Iteration to preview; the latest by default. */
  iteration?: number;

  /** @default 'tmp/skill-evals' */
  outputPath?: string;
};

export type {
  SkillEvalAgent,
  SkillEvalExecutorSchema,
  SkillEvalGrader,
  SkillEvalGraderProvider,
  SkillEvalPreview,
  SkillEvalVariant,
};

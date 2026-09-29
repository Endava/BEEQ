import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { parse } from 'yaml';

import type { SkillEvalAgent, SkillEvalGraderProvider, SkillEvalVariant } from '../schema.d.ts';

type Grader = { type: 'deterministic' | 'llm_rubric'; [key: string]: unknown };
type WorkspaceEntry = { src: string; dest: string; chmod?: string };

export type SuiteTask = {
  name: string;
  instruction: string;
  metadata?: Record<string, unknown>;
  expected?: unknown;
  workspace?: WorkspaceEntry[];
  graders?: Grader[];
  solution?: string;
  [key: string]: unknown;
};

export type Suite = {
  /** `eval.base.yaml`: skillgrade `version` and `defaults`, plus the `graders` every task uses by default. */
  base: { version?: string; defaults?: Record<string, unknown>; graders?: Grader[] };
  tasks: SuiteTask[];
  /** `footer.md`, appended to every instruction. */
  footer?: string;
  /** `prepare.ts` exists. */
  prepare: boolean;
  /** Task name → `solutions/<task>.sh`, relative to the suite. */
  solutions: Map<string, string>;
};

export const SUITE_FILES = {
  base: 'eval.base.yaml',
  tasks: 'tasks',
  footer: 'footer.md',
  prepare: 'prepare.ts',
  solutions: 'solutions',
} as const;

/** Placeholder for the absolute path of the suite's runtime copy. */
export const EVALS_TOKEN = '{{evals}}';

const MODEL_PATTERN = /^[\w.:/-]+$/;

/**
 * skillgrade runs graders in order and puts every earlier result in the LLM judge's prompt, where the
 * judge echoes it. Running `llm_rubric` graders first keeps the rubric an independent score.
 */
const rubricFirst = (a: Grader, b: Grader) => Number(b.type === 'llm_rubric') - Number(a.type === 'llm_rubric');

export function loadSuite(evalsDir: string): Suite {
  const basePath = path.join(evalsDir, SUITE_FILES.base);
  if (!existsSync(basePath)) throw new Error(`Missing ${SUITE_FILES.base} in ${evalsDir}.`);

  const tasksDir = path.join(evalsDir, SUITE_FILES.tasks);
  const taskFiles = existsSync(tasksDir)
    ? readdirSync(tasksDir)
        .filter((file) => /\.ya?ml$/.test(file))
        .sort((a, b) => a.localeCompare(b, 'en'))
    : [];
  if (taskFiles.length === 0) throw new Error(`No tasks in ${tasksDir}.`);

  const tasks = taskFiles.map((file) => {
    const task = parse(readFileSync(path.join(tasksDir, file), 'utf8')) as SuiteTask;
    const expectedName = file.replace(/\.ya?ml$/, '');
    if (task?.name !== expectedName) {
      throw new Error(`${SUITE_FILES.tasks}/${file}: "name" must be "${expectedName}".`);
    }
    if (typeof task.instruction !== 'string' || !task.instruction.trim()) {
      throw new Error(`${SUITE_FILES.tasks}/${file}: "instruction" is required.`);
    }
    return task;
  });

  const solutionsDir = path.join(evalsDir, SUITE_FILES.solutions);
  const solutions = new Map(
    (existsSync(solutionsDir) ? readdirSync(solutionsDir) : [])
      .filter((file) => file.endsWith('.sh'))
      .map((file) => [file.replace(/\.sh$/, ''), path.posix.join(SUITE_FILES.solutions, file)]),
  );

  const footerPath = path.join(evalsDir, SUITE_FILES.footer);

  return {
    base: parse(readFileSync(basePath, 'utf8')) ?? {},
    tasks,
    footer: existsSync(footerPath) ? readFileSync(footerPath, 'utf8').trim() : undefined,
    prepare: existsSync(path.join(evalsDir, SUITE_FILES.prepare)),
    solutions,
  };
}

/** Replaces `{{evals}}` in every string of `value` with `runtimeDir`. */
export function substitute<T>(value: T, runtimeDir: string): T {
  if (typeof value === 'string') return value.split(EVALS_TOKEN).join(runtimeDir) as T;
  if (Array.isArray(value)) return value.map((item) => substitute(item, runtimeDir)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, substitute(item, runtimeDir)])) as T;
  }
  return value;
}

/** The task instruction followed by the footer, with `{{metadata.KEY}}` filled from the task's metadata. */
export function renderInstruction(task: SuiteTask, footer?: string) {
  if (!footer) return task.instruction.trim();
  const rendered = footer.replace(/\{\{metadata\.([\w-]+)\}\}/g, (_, key) => {
    const value = task.metadata?.[key];
    if (value === undefined) throw new Error(`Task "${task.name}" has no metadata.${key} for the footer.`);
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
      throw new Error(`Task "${task.name}" metadata.${key} must be a string, number, or boolean for the footer.`);
    }
    return String(value);
  });
  return `${task.instruction.trim()}\n\n${rendered}`;
}

export type EvalConfigInput = {
  suite: Suite;
  runtimeDir: string;
  variant: SkillEvalVariant;
  skillDir: string;
  agent: SkillEvalAgent;
  model?: string;
  timeout: number;
  llmRubric: boolean;
  graderProvider?: SkillEvalGraderProvider;
  graderModel?: string;
  validate: boolean;
};

/** A complete skillgrade `eval.yaml` for one variant. */
export function buildEvalConfig(input: EvalConfigInput) {
  const { suite, runtimeDir, variant, agent, model, validate } = input;
  if (model && !MODEL_PATTERN.test(model)) throw new Error(`Invalid model id "${model}".`);

  const defaults = substitute({ ...suite.base.defaults }, runtimeDir);
  const command = typeof defaults.command === 'string' ? defaults.command : undefined;
  if (!command) throw new Error(`${SUITE_FILES.base} needs defaults.command: the agent command to run.`);
  const modelFlag = model ? ` --model ${model}` : '';

  const tasks = suite.tasks
    .filter((task) => !validate || suite.solutions.has(task.name))
    .map((source) => {
      const task = substitute(source, runtimeDir);
      const graders = (task.graders ?? substitute(suite.base.graders ?? [], runtimeDir))
        .filter((grader) => input.llmRubric || grader.type !== 'llm_rubric')
        .sort(rubricFirst);
      if (graders.length === 0) throw new Error(`Task "${task.name}" has no graders.`);

      const workspace = [...(task.workspace ?? [])];
      let solution: string | undefined;
      if (validate) {
        solution = path.join(runtimeDir, suite.solutions.get(task.name) ?? '');
        workspace.push({ src: solution, dest: path.basename(solution) });
      }

      return {
        ...task,
        instruction: renderInstruction(source, suite.footer),
        graders,
        ...(workspace.length ? { workspace } : {}),
        ...(solution ? { solution } : {}),
      };
    });

  return {
    version: suite.base.version ?? '1',
    ...(variant === 'with-skill' ? { skill: input.skillDir } : {}),
    defaults: {
      ...defaults,
      agent: 'command',
      provider: 'local',
      command: `${command} ${agent}${modelFlag}`,
      timeout: input.timeout,
      // biome-ignore lint/style/useNamingConvention: skillgrade eval.yaml field.
      ...(input.graderProvider ? { grader_provider: input.graderProvider } : {}),
      // biome-ignore lint/style/useNamingConvention: skillgrade eval.yaml field.
      ...(input.graderModel ? { grader_model: input.graderModel } : {}),
    },
    tasks,
  };
}

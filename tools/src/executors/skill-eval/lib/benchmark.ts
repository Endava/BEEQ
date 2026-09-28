// biome-ignore-all lint/style/useNamingConvention: snake_case fields are defined by the skillgrade and agentskills.io formats.
import type { SkillEvalVariant } from '../schema.d.ts';

/** The parts of a skillgrade `EvalReport` (one results/*.json file) the benchmark reads. */
export type EvalReport = {
  task: string;
  trials: {
    reward: number;
    duration_ms: number;
    input_tokens: number;
    output_tokens: number;
    grader_results: { grader_type: string; score: number }[];
  }[];
};

type Stat = { mean: number; stddev: number };

type VariantSummary = {
  trials: number;
  reward: Stat;
  pass_rate: Stat;
  time_seconds: Stat;
  tokens: Stat;
  graders: Record<string, number>;
};

type TaskSummary = { trials: number; reward: number; pass_rate: number };

export type Benchmark = {
  metadata: Record<string, unknown>;
  run_summary: Partial<Record<SkillEvalVariant, VariantSummary>> & {
    delta?: { reward: number; pass_rate: number; time_seconds: number; tokens: number };
  };
  tasks: ({ task: string; delta?: number } & Partial<Record<SkillEvalVariant, TaskSummary>>)[];
  notes: string[];
};

/** skillgrade counts a trial as passed at this reward. */
export const PASS_REWARD = 0.5;

const round = (value: number) => Math.round(value * 1000) / 1000;

export function stat(values: number[]): Stat {
  if (values.length === 0) return { mean: 0, stddev: 0 };
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return { mean: round(mean), stddev: round(Math.sqrt(variance)) };
}

function summarizeVariant(reports: EvalReport[]): VariantSummary {
  const trials = reports.flatMap((report) => report.trials);
  const graderScores = new Map<string, number[]>();
  for (const trial of trials) {
    for (const result of trial.grader_results) {
      graderScores.set(result.grader_type, [...(graderScores.get(result.grader_type) ?? []), result.score]);
    }
  }
  return {
    trials: trials.length,
    reward: stat(trials.map((trial) => trial.reward)),
    pass_rate: stat(trials.map((trial) => (trial.reward >= PASS_REWARD ? 1 : 0))),
    time_seconds: stat(trials.map((trial) => trial.duration_ms / 1000)),
    tokens: stat(trials.map((trial) => trial.input_tokens + trial.output_tokens)),
    graders: Object.fromEntries([...graderScores].map(([type, scores]) => [type, stat(scores).mean])),
  };
}

const summarizeTask = (report: EvalReport): TaskSummary => ({
  trials: report.trials.length,
  reward: stat(report.trials.map((trial) => trial.reward)).mean,
  pass_rate: stat(report.trials.map((trial) => (trial.reward >= PASS_REWARD ? 1 : 0))).mean,
});

/** Aggregates the per-variant reports into an agentskills.io-style benchmark with a with-skill − baseline delta. */
export function buildBenchmark(
  reports: Partial<Record<SkillEvalVariant, EvalReport[]>>,
  metadata: Record<string, unknown> = {},
): Benchmark {
  const variants = Object.keys(reports) as SkillEvalVariant[];
  const runSummary: Benchmark['run_summary'] = {};
  for (const variant of variants) runSummary[variant] = summarizeVariant(reports[variant] ?? []);

  const withSkill = runSummary['with-skill'];
  const baseline = runSummary.baseline;
  if (withSkill && baseline) {
    runSummary.delta = {
      reward: round(withSkill.reward.mean - baseline.reward.mean),
      pass_rate: round(withSkill.pass_rate.mean - baseline.pass_rate.mean),
      time_seconds: round(withSkill.time_seconds.mean - baseline.time_seconds.mean),
      tokens: round(withSkill.tokens.mean - baseline.tokens.mean),
    };
  }

  const names = [
    ...new Set(variants.flatMap((variant) => (reports[variant] ?? []).map((report) => report.task))),
  ].sort();
  const tasks = names.map((task) => {
    const row: Benchmark['tasks'][number] = { task };
    for (const variant of variants) {
      const report = reports[variant]?.find((candidate) => candidate.task === task);
      if (report) row[variant] = summarizeTask(report);
    }
    if (row['with-skill'] && row.baseline) row.delta = round(row['with-skill'].reward - row.baseline.reward);
    return row;
  });

  return {
    metadata,
    run_summary: runSummary,
    tasks,
    notes: [
      'reward is the weighted grader score per trial (0-1); pass_rate is the share of trials with reward >= 0.5.',
      'tokens are skillgrade estimates from text length, not billed usage.',
    ],
  };
}

const cell = (summary?: TaskSummary) => (summary ? `${summary.reward.toFixed(2)} (${summary.trials})` : '-');
const signed = (value?: number) => (value === undefined ? '-' : `${value >= 0 ? '+' : ''}${value.toFixed(2)}`);

/** A plain-text table of mean reward per task and variant. */
export function formatBenchmark(benchmark: Benchmark): string {
  const variants = (['with-skill', 'baseline'] as const).filter((variant) => benchmark.run_summary[variant]);
  const header = ['task', ...variants, ...(variants.length === 2 ? ['delta'] : [])];
  const rows = benchmark.tasks.map((row) => [
    row.task,
    ...variants.map((variant) => cell(row[variant])),
    ...(variants.length === 2 ? [signed(row.delta)] : []),
  ]);
  const total = [
    'mean reward',
    ...variants.map((variant) => benchmark.run_summary[variant]?.reward.mean.toFixed(2) ?? '-'),
    ...(variants.length === 2 ? [signed(benchmark.run_summary.delta?.reward)] : []),
  ];

  const widths = header.map((_, column) => Math.max(...[header, ...rows, total].map((row) => row[column].length)));
  const line = (row: string[]) => row.map((value, column) => value.padEnd(widths[column])).join('  ');
  const rule = widths.map((width) => '-'.repeat(width)).join('  ');
  return [line(header), rule, ...rows.map(line), rule, line(total)].join('\n');
}

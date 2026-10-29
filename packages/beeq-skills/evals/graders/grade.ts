#!/usr/bin/env node
// biome-ignore-all lint/style/useNamingConvention: snake_case fields are defined by the skillgrade and agentskills.io formats.
// skillgrade deterministic grader. Runs in the agent's workspace after the agent exits, reads the task's
// `expected` from SKILLGRADE_INPUT, and prints `{ score, details, checks }` on stdout.
import { readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { type BeeqIndex, findApiIssues, reviveIndex } from '../lib/beeq-index.ts';
import { findRuleViolations } from '../lib/beeq-rules.ts';
import { collectFiles, type WorkspaceFile } from '../lib/workspace.ts';

export type TaskCheck = { name: string; match?: string | string[]; absent?: string | string[]; flags?: string };

export type Expected = {
  checks?: TaskCheck[];
  /** Rule ids from beeq-rules.ts the task may break, e.g. `hex` for a brand colour. */
  allow_rules?: string[];
  /** `kind:name` API issues the task may raise. */
  allow_api?: string[];
};

export type CheckResult = { name: string; passed: boolean; message: string };

const LANGUAGES: Record<string, string> = { htm: 'html', html: 'html' };

const asList = <T>(value: T | T[] | undefined): T[] => {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
};

/** One task-specific check: every `match` pattern is present and every `absent` pattern is not. */
export function runCheck(check: TaskCheck, code: string): CheckResult {
  const flags = check.flags ?? '';
  const missing = asList(check.match).filter((pattern) => !new RegExp(pattern, flags).test(code));
  const forbidden = asList(check.absent).filter((pattern) => new RegExp(pattern, flags).test(code));
  const problems = [
    ...missing.map((pattern) => `missing /${pattern}/`),
    ...forbidden.map((pattern) => `found /${pattern}/`),
  ];
  return { name: check.name, passed: problems.length === 0, message: problems.join('; ') || 'ok' };
}

const describeHits = (bucket: Map<string, Set<string>>) =>
  [...bucket].map(([id, hits]) => `${id}: ${[...hits].slice(0, 3).join(', ')}`).join('; ');

/** The SKILL.md Verify searches, run per file so language-specific rules apply. */
function searchesCheck(files: WorkspaceFile[], allow: string[]): CheckResult {
  const errors = new Map<string, Set<string>>();
  const reviews = new Map<string, Set<string>>();
  for (const file of files) {
    for (const violation of findRuleViolations(file.content, { language: LANGUAGES[file.lang] ?? file.lang, allow })) {
      const bucket = violation.severity === 'review' ? reviews : errors;
      const hits = bucket.get(violation.id) ?? new Set<string>();
      for (const hit of violation.hits) hits.add(hit);
      bucket.set(violation.id, hits);
    }
  }
  const message = [
    errors.size ? describeHits(errors) : 'no hits',
    reviews.size ? `review: ${describeHits(reviews)}` : '',
  ]
    .filter(Boolean)
    .join(' | ');
  return { name: 'searches', passed: errors.size === 0, message };
}

function apiCheck(code: string, index: BeeqIndex, allow: string[]): CheckResult {
  const issues = findApiIssues(code, index, { allow });
  const unique = [...new Map(issues.map((issue) => [`${issue.kind}:${issue.name}`, issue])).values()];
  return {
    name: 'api',
    passed: unique.length === 0,
    message: unique.length ? unique.map((issue) => issue.message).join(' ') : 'every BEEQ name and prop value exists',
  };
}

/** Grades the agent's files against the task's `expected` block. Score is the fraction of checks passed. */
export function grade({
  files,
  expected = {},
  index,
}: {
  files: WorkspaceFile[];
  expected?: Expected;
  index: BeeqIndex;
}): { score: number; details: string; checks: CheckResult[] } {
  if (files.length === 0) {
    return {
      score: 0,
      details: 'The agent wrote no files.',
      checks: [{ name: 'wrote-code', passed: false, message: 'no files in the workspace' }],
    };
  }

  const code = files.map((file) => file.content).join('\n');
  const checks: CheckResult[] = [
    { name: 'wrote-code', passed: true, message: files.map((file) => file.path).join(', ') },
    searchesCheck(files, asList(expected.allow_rules)),
    apiCheck(code, index, asList(expected.allow_api)),
    ...asList(expected.checks).map((check) => runCheck(check, code)),
  ];

  const passed = checks.filter((check) => check.passed).length;
  return { score: passed / checks.length, details: `${passed}/${checks.length} checks passed`, checks };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(realpathSync(process.argv[1])).href;

if (isMain) {
  const input = JSON.parse(process.env.SKILLGRADE_INPUT ?? '{}');
  const index = reviveIndex(JSON.parse(readFileSync(path.join(import.meta.dirname, '../beeq-index.json'), 'utf8')));
  console.log(JSON.stringify(grade({ files: collectFiles(process.cwd()), expected: input.expected, index })));
}

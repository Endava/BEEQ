import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { TEMPORARY_CONTRIBUTOR_SKILLS } from './temporary-contributor-skills.ts';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const contributorSkillsDir = path.join(repoRoot, '.agents/skills');
const NESTED_AGENT_FILES = [
  'AGENTS.md',
  'packages/beeq/AGENTS.md',
  'packages/beeq-tailwindcss/AGENTS.md',
  'packages/beeq-angular/AGENTS.md',
  'packages/beeq-react/AGENTS.md',
  'packages/beeq-vue/AGENTS.md',
  'packages/beeq-skills/AGENTS.md',
  'apps/beeq-docs/AGENTS.md',
];

const markdownFiles = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return markdownFiles(full);
    return full.endsWith('.md') ? [full] : [];
  });

const agentFiles = [
  ...NESTED_AGENT_FILES.map((file) => path.join(repoRoot, file)),
  ...markdownFiles(path.join(repoRoot, '.agents')),
].filter((file) => !TEMPORARY_CONTRIBUTOR_SKILLS.has(path.relative(contributorSkillsDir, file).split(path.sep)[0]));

const relativeTargets = (file: string) => {
  const text = readFileSync(file, 'utf8').replace(/```[\s\S]*?```/g, '');
  return [...text.matchAll(/\]\(([^)\s]+)\)/g)]
    .map(([, target]) => target.split('#')[0])
    .filter((target) => target && !/^[a-z]+:|^\//i.test(target));
};

describe('agent instructions and skills', () => {
  it.each(agentFiles.map((file) => path.relative(repoRoot, file)))('%s should only link to existing files', (rel) => {
    // Arrange
    const file = path.join(repoRoot, rel);

    // Act
    const missing = relativeTargets(file).filter((target) => !existsSync(path.resolve(path.dirname(file), target)));

    // Assert
    expect(missing).toEqual([]);
  });
});

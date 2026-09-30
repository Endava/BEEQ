import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  diskFiles,
  type Frontmatter,
  parseFrontmatter,
  planSync,
  SYNC_CONFIG,
  validateSkill,
} from '../../../tools/src/generators/sync-skills/lib/index.ts';
import { RULES } from '../evals/lib/beeq-rules.ts';

const metadataOf = (data: Frontmatter['data']) => (typeof data?.metadata === 'object' ? data.metadata : undefined);

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const files = diskFiles(repoRoot);
const source = SYNC_CONFIG.sourceDir;
const read = (file: string) => readFileSync(path.join(repoRoot, file), 'utf8');
const skillFolders = (dir: string) =>
  readdirSync(path.join(repoRoot, dir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

describe('public skills (src/)', () => {
  it.each(skillFolders(source))('%s should pass validation', (folder) => {
    expect(validateSkill(files, `${source}/${folder}`)).toEqual([]);
  });

  it.each(skillFolders(source))('%s should not be marked internal', (folder) => {
    // Act
    const { data } = parseFrontmatter(read(`${source}/${folder}/SKILL.md`));

    // Assert
    expect(metadataOf(data)?.internal).not.toBe(true);
  });

  it('should have generated copies in sync with the source', () => {
    // Act
    const { write, remove } = planSync(files);

    // Assert: run `pnpm nx sync` if this fails.
    expect({ write, remove }).toEqual({ write: [], remove: [] });
  });
});

describe('contributor skills (.agents/skills/)', () => {
  it.each(skillFolders('.agents/skills'))('%s should be marked internal', (folder) => {
    // Act
    const { data } = parseFrontmatter(read(`.agents/skills/${folder}/SKILL.md`));

    // Assert
    expect(data?.name).toBe(folder);
    expect(metadataOf(data)?.internal).toBe(true);
  });

  it('should not reuse a public skill name', () => {
    // Arrange
    const publicNames = new Set(skillFolders(source));

    // Act
    const clashes = skillFolders('.agents/skills').filter((name) => publicNames.has(name));

    // Assert
    expect(clashes).toEqual([]);
  });
});

describe('SKILL.md searches', () => {
  it('should list exactly the rules the evals enforce', () => {
    // Arrange
    const skill = read(`${source}/beeq/SKILL.md`);
    const table = skill.slice(skill.indexOf('**Searches.**'), skill.indexOf('**Checklist.**'));

    // Act
    const labels = [...table.matchAll(/^\| ([^|]+?) \| `/gm)].map((match) => match[1]);

    // Assert
    expect(labels).toEqual(RULES.map((rule) => rule.label));
  });
});

describe('docs site skill.md', () => {
  // Without a custom skill.md, Mintlify generates its own skill from the docs and serves it at /skill.md.
  const pointer = read('apps/beeq-docs/skill.md');

  it('should point agents to the repository skill and its install command', () => {
    expect(pointer).toContain('npx skills add Endava/BEEQ --skill beeq');
    expect(pointer).toContain('https://raw.githubusercontent.com/Endava/BEEQ/main/skills/beeq/SKILL.md');
  });

  it('should keep the frontmatter of the beeq skill', () => {
    // Act
    const expected = parseFrontmatter(read(`${source}/beeq/SKILL.md`)).frontmatter;

    // Assert: copy the frontmatter of src/beeq/SKILL.md to apps/beeq-docs/skill.md if this fails.
    expect(parseFrontmatter(pointer).frontmatter).toBe(expected);
  });
});

import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { syncSkillsGenerator } from '../generator';
import {
  buildOutputs,
  DOCS_ORIGIN,
  findMdxUnsafe,
  findRelativeLinks,
  generatedNote,
  type LinkKind,
  parseFrontmatter,
  planSync,
  rewriteLinks,
  SYNC_CONFIG,
  toDocsUrl,
  treeFiles,
  validateSkill,
  validateSkills,
} from '../lib';

const SRC = SYNC_CONFIG.sourceDir;
const SKILL_DIR = `${SRC}/beeq`;

const SKILL = `---
name: beeq
description: >
  Builds UI with BEEQ.
  Use when code adds bq-* elements.
metadata:
  version: "1.3"
  internal: false
---

# Skill

Read [theming](references/theming.md) and [frameworks](references/frameworks.md#react).
See [the docs](https://www.beeq.design) and [below](#section).
`;

const THEMING = `---
title: Theming
description: How to theme.
---

Back to [the skill](../SKILL.md). Framework syntax: [frameworks](frameworks.md).
`;

const FRAMEWORKS = `---
title: Frameworks
description: Framework syntax.
---

Use \`<BqButton>\` in React.
`;

let tree: Tree;

const writeFixtureSkill = () => {
  tree.write(`${SKILL_DIR}/SKILL.md`, SKILL);
  tree.write(`${SKILL_DIR}/references/theming.md`, THEMING);
  tree.write(`${SKILL_DIR}/references/frameworks.md`, FRAMEWORKS);
  tree.write(`${SRC}/README.md`, '# Agent skills\n');
};

beforeEach(() => {
  tree = createTreeWithEmptyWorkspace();
});

describe('parseFrontmatter', () => {
  it('should parse scalars, folded blocks, and nested maps', () => {
    // Act
    const { data, body } = parseFrontmatter(SKILL);

    // Assert
    expect(data).toEqual({
      name: 'beeq',
      description: 'Builds UI with BEEQ. Use when code adds bq-* elements.',
      metadata: { version: '1.3', internal: false },
    });
    expect(body.startsWith('\n# Skill')).toBe(true);
  });

  it('should return null data when there is no frontmatter', () => {
    expect(parseFrontmatter('# Title').data).toBeNull();
  });
});

describe('toDocsUrl', () => {
  it.each<[string, LinkKind, string]>([
    ['references/theming.md', 'skill', `${DOCS_ORIGIN}/skill/references/theming.md`],
    ['references/theming.md#tokens', 'skill', `${DOCS_ORIGIN}/skill/references/theming.md#tokens`],
    ['frameworks.md', 'reference', `${DOCS_ORIGIN}/skill/references/frameworks.md`],
    ['./frameworks.md', 'reference', `${DOCS_ORIGIN}/skill/references/frameworks.md`],
    ['../SKILL.md', 'reference', `${DOCS_ORIGIN}/skill.md`],
  ])('should map %s from a %s file', (target, kind, expected) => {
    expect(toDocsUrl(target, kind)).toBe(expected);
  });

  it.each<[string, LinkKind]>([
    ['../README.md', 'reference'],
    ['theming.md', 'skill'],
    ['assets/template.md', 'skill'],
  ])('should reject %s from a %s file', (target, kind) => {
    expect(() => toDocsUrl(target, kind)).toThrow(/Cannot publish/);
  });
});

describe('rewriteLinks', () => {
  it('should rewrite relative links and keep absolute links and anchors', () => {
    // Act
    const result = rewriteLinks(parseFrontmatter(SKILL).body, 'skill');

    // Assert
    expect(result).toContain(`[theming](${DOCS_ORIGIN}/skill/references/theming.md)`);
    expect(result).toContain(`[frameworks](${DOCS_ORIGIN}/skill/references/frameworks.md#react)`);
    expect(result).toContain('[the docs](https://www.beeq.design)');
    expect(result).toContain('[below](#section)');
  });

  it('should leave links inside code untouched', () => {
    // Arrange
    const markdown = 'Inline `[a](references/x.md)` and\n\n```md\n[b](references/y.md)\n```\n';

    // Act & Assert
    expect(rewriteLinks(markdown, 'skill')).toBe(markdown);
  });
});

describe('findRelativeLinks', () => {
  it('should report relative targets with line numbers, ignoring code', () => {
    // Arrange
    const markdown = 'One [a](a.md)\n`[b](b.md)`\nThree [c](https://x.y) [d](../SKILL.md)';

    // Act & Assert
    expect(findRelativeLinks(markdown)).toEqual([
      { target: 'a.md', line: 1 },
      { target: '../SKILL.md', line: 3 },
    ]);
  });
});

describe('findMdxUnsafe', () => {
  it('should flag < and { in prose', () => {
    expect(findMdxUnsafe('Use <bq-input> here\nand {value}')).toEqual([
      { char: '<', line: 1 },
      { char: '{', line: 2 },
    ]);
  });

  it('should allow < and { inside inline code, fenced code, and indented fences', () => {
    // Arrange
    const markdown =
      'Use `<bq-input>` and `{x}`.\n\n```html\n<bq-input></bq-input>\n```\n\n1. Step\n\n   ```css\n   a { b: c; }\n   ```\n';

    // Act & Assert
    expect(findMdxUnsafe(markdown)).toEqual([]);
  });
});

describe('validateSkill', () => {
  it('should accept a valid skill', () => {
    // Arrange
    writeFixtureSkill();

    // Act & Assert
    expect(validateSkill(treeFiles(tree), SKILL_DIR)).toEqual([]);
  });

  it('should report a name that does not match the folder', () => {
    // Arrange
    writeFixtureSkill();
    tree.write(`${SKILL_DIR}/SKILL.md`, SKILL.replace('name: beeq', 'name: beeq-design-system'));

    // Act & Assert
    expect(validateSkill(treeFiles(tree), SKILL_DIR)).toContainEqual(expect.stringContaining('must match the folder'));
  });

  it('should report a description over 1,024 characters', () => {
    // Arrange
    writeFixtureSkill();
    tree.write(`${SKILL_DIR}/SKILL.md`, SKILL.replace('Builds UI with BEEQ.', 'x'.repeat(1030)));

    // Act & Assert
    expect(validateSkill(treeFiles(tree), SKILL_DIR)).toContainEqual(expect.stringContaining('max 1024'));
  });

  it('should report broken links, orphaned references, and missing reference frontmatter', () => {
    // Arrange
    writeFixtureSkill();
    tree.write(`${SKILL_DIR}/references/theming.md`, THEMING.replace('frameworks.md', 'missing.md'));
    tree.write(`${SKILL_DIR}/references/orphan.md`, '# No frontmatter\n');

    // Act
    const errors = validateSkill(treeFiles(tree), SKILL_DIR);

    // Assert
    expect(errors).toContainEqual(expect.stringContaining('link "missing.md" does not resolve'));
    expect(errors).toContainEqual(expect.stringContaining('orphan.md: not linked from SKILL.md'));
    expect(errors).toContainEqual(expect.stringContaining('orphan.md: "title" and "description"'));
  });

  it('should report links that leave the skill folder', () => {
    // Arrange
    writeFixtureSkill();
    tree.write(`${SKILL_DIR}/references/frameworks.md`, `${FRAMEWORKS}\nSee [readme](../../README.md).\n`);

    // Act & Assert
    expect(validateSkill(treeFiles(tree), SKILL_DIR)).toContainEqual(
      expect.stringContaining('points outside the skill folder'),
    );
  });

  it('should report MDX-unsafe prose only when MDX checks are on', () => {
    // Arrange
    writeFixtureSkill();
    tree.write(`${SKILL_DIR}/references/frameworks.md`, `${FRAMEWORKS}\nUse <BqButton> without backticks.\n`);

    // Act
    const withMdx = validateSkill(treeFiles(tree), SKILL_DIR);
    const withoutMdx = validateSkill(treeFiles(tree), SKILL_DIR, { mdx: false });

    // Assert
    expect(withMdx).toContainEqual(expect.stringContaining('breaks MDX'));
    expect(withoutMdx).toEqual([]);
  });

  it('should skip MDX checks for skills that are not published to the docs site', () => {
    // Arrange
    writeFixtureSkill();
    tree.write(`${SRC}/other/SKILL.md`, '---\nname: other\ndescription: Other skill.\n---\n\nUse <x> freely.\n');

    // Act & Assert
    expect(validateSkills(treeFiles(tree))).toEqual([]);
  });
});

describe('buildOutputs', () => {
  it('should copy the source to skills/ with a generated note after the frontmatter', () => {
    // Arrange
    writeFixtureSkill();

    // Act
    const output = buildOutputs(treeFiles(tree));
    const skill = output.get('skills/beeq/SKILL.md') ?? '';

    // Assert
    expect(parseFrontmatter(skill).data?.name).toBe('beeq');
    expect(parseFrontmatter(skill).body).toContain(`<!-- ${generatedNote(`${SKILL_DIR}/SKILL.md`)} -->`);
    expect(skill).toContain('[theming](references/theming.md)');
    expect(output.get('skills/README.md')).toBe(`<!-- ${generatedNote(`${SRC}/README.md`)} -->\n\n# Agent skills\n`);
  });

  it('should generate skill.md with a YAML note and absolute links', () => {
    // Arrange
    writeFixtureSkill();

    // Act
    const skill = buildOutputs(treeFiles(tree)).get('apps/beeq-docs/skill.md');

    // Assert
    expect(skill?.startsWith(`---\n# ${generatedNote(SKILL_DIR)}\nname: beeq\n`)).toBe(true);
    expect(skill).toContain(`${DOCS_ORIGIN}/skill/references/theming.md`);
  });

  it('should generate one hidden .mdx page per reference with an MDX comment', () => {
    // Arrange
    writeFixtureSkill();

    // Act
    const output = buildOutputs(treeFiles(tree));
    const theming = output.get('apps/beeq-docs/skill/references/theming.mdx');

    // Assert
    expect([...output.keys()].filter((file) => file.startsWith('apps/')).sort()).toEqual([
      'apps/beeq-docs/skill.md',
      'apps/beeq-docs/skill/references/frameworks.mdx',
      'apps/beeq-docs/skill/references/theming.mdx',
    ]);
    expect(theming).toMatch(/^---\n[\s\S]*\nhidden: true\n---\n/);
    expect(parseFrontmatter(theming ?? '').data?.hidden).toBe(true);
    expect(theming).toContain(`{/* ${generatedNote(SKILL_DIR)} */}`);
    expect(theming).toContain(`[the skill](${DOCS_ORIGIN}/skill.md)`);
    expect(theming).toContain(`[frameworks](${DOCS_ORIGIN}/skill/references/frameworks.md)`);
  });
});

describe('planSync', () => {
  it('should list every file as out of date before the first sync', () => {
    // Arrange
    writeFixtureSkill();

    // Act
    const { write, remove } = planSync(treeFiles(tree));

    // Assert
    expect(write).toHaveLength(7);
    expect(remove).toEqual([]);
  });

  it('should detect hand edits and stale generated files', () => {
    // Arrange
    writeFixtureSkill();
    for (const [file, content] of buildOutputs(treeFiles(tree))) tree.write(file, content);

    // Act
    const inSync = planSync(treeFiles(tree));
    tree.write('apps/beeq-docs/skill/references/theming.mdx', 'hand edit');
    tree.write('apps/beeq-docs/skill/references/removed.mdx', 'stale');
    tree.write('skills/beeq/references/removed.md', 'stale');
    const drifted = planSync(treeFiles(tree));

    // Assert
    expect(inSync.write).toEqual([]);
    expect(inSync.remove).toEqual([]);
    expect(drifted.write).toEqual(['apps/beeq-docs/skill/references/theming.mdx']);
    expect(drifted.remove).toEqual([
      'apps/beeq-docs/skill/references/removed.mdx',
      'skills/beeq/references/removed.md',
    ]);
  });
});

describe('syncSkillsGenerator', () => {
  it('should write the generated files and report them as out of sync', () => {
    // Arrange
    writeFixtureSkill();

    // Act
    const result = syncSkillsGenerator(tree);

    // Assert
    expect(result.outOfSyncMessage).toContain('write  skills/beeq/SKILL.md');
    expect(tree.exists('skills/beeq/references/theming.md')).toBe(true);
    expect(tree.exists('apps/beeq-docs/skill/references/theming.mdx')).toBe(true);
  });

  it('should delete stale files and return no message once in sync', () => {
    // Arrange
    writeFixtureSkill();
    tree.write('skills/old/SKILL.md', 'stale');
    syncSkillsGenerator(tree);

    // Act
    const result = syncSkillsGenerator(tree);

    // Assert
    expect(tree.exists('skills/old/SKILL.md')).toBe(false);
    expect(result).toEqual({});
  });

  it('should throw on an invalid source and leave the outputs untouched', () => {
    // Arrange
    writeFixtureSkill();
    tree.write(`${SKILL_DIR}/SKILL.md`, SKILL.replace('name: beeq', 'name: Beeq'));

    // Act & Assert
    expect(() => syncSkillsGenerator(tree)).toThrow(/Invalid skills[\s\S]*kebab-case/);
    expect(tree.exists('skills/beeq/SKILL.md')).toBe(false);
  });
});

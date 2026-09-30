import type { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { syncSkillsGenerator } from '../generator';
import {
  buildOutputs,
  findRelativeLinks,
  generatedNote,
  parseFrontmatter,
  planSync,
  SYNC_CONFIG,
  treeFiles,
  validateSkill,
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
});

describe('planSync', () => {
  it('should list every file as out of date before the first sync', () => {
    // Arrange
    writeFixtureSkill();

    // Act
    const { write, remove } = planSync(treeFiles(tree));

    // Assert
    expect(write).toHaveLength(4);
    expect(remove).toEqual([]);
  });

  it('should detect hand edits and stale generated files', () => {
    // Arrange
    writeFixtureSkill();
    for (const [file, content] of buildOutputs(treeFiles(tree))) tree.write(file, content);

    // Act
    const inSync = planSync(treeFiles(tree));
    tree.write('skills/beeq/references/theming.md', 'hand edit');
    tree.write('skills/beeq/references/removed.md', 'stale');
    const drifted = planSync(treeFiles(tree));

    // Assert
    expect(inSync.write).toEqual([]);
    expect(inSync.remove).toEqual([]);
    expect(drifted.write).toEqual(['skills/beeq/references/theming.md']);
    expect(drifted.remove).toEqual(['skills/beeq/references/removed.md']);
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

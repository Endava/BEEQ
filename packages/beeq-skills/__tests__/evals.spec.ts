// biome-ignore-all lint/style/useNamingConvention: snake_case fields are defined by the skillgrade and agentskills.io formats.
import { mkdtempSync, readdirSync, readFileSync, readlinkSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { parse } from 'yaml';

import { COMMANDS, codexHome, materializeBlocks } from '../evals/agents/run.ts';
import { grade, runCheck } from '../evals/graders/grade.ts';
import { loadBeeqIndex, reviveIndex, serializeIndex } from '../evals/lib/beeq-index.ts';
import {
  assertNoPersonalSkill,
  collectFiles,
  fixtureFiles,
  formatFiles,
  packageJson,
  STACKS,
} from '../evals/lib/workspace.ts';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const evalsDir = path.resolve(import.meta.dirname, '../evals');

type Check = { name: string; match?: string | string[]; absent?: string | string[]; flags?: string };
type Task = {
  name: string;
  instruction: string;
  metadata: { stack: string; tags: string[] };
  workspace?: { src: string; dest: string }[];
  expected: { criteria: string; checks: Check[]; allow_rules?: string[]; allow_api?: string[] };
};

const taskFiles = readdirSync(path.join(evalsDir, 'tasks')).filter((file) => file.endsWith('.yaml'));
const tasks: Task[] = taskFiles.map((file) => parse(readFileSync(path.join(evalsDir, 'tasks', file), 'utf8')));
const solutions = readdirSync(path.join(evalsDir, 'solutions')).map((file) => file.replace(/\.sh$/, ''));

let index: ReturnType<typeof loadBeeqIndex>;

beforeAll(() => {
  index = loadBeeqIndex(repoRoot);
});

describe('eval tasks', () => {
  it.each(taskFiles.map((file, i) => [file, tasks[i]] as const))('%s should be well formed', (file, task) => {
    // Assert
    expect(task.name).toBe(file.replace(/\.yaml$/, ''));
    expect(STACKS).toContain(task.metadata.stack);
    expect(task.expected.criteria.length).toBeGreaterThan(40);
    expect(task.expected.checks.length).toBeGreaterThan(0);
    expect(task.workspace).toEqual([{ src: `{{evals}}/fixtures/${task.metadata.stack}`, dest: '.' }]);
  });

  it.each(
    tasks.flatMap((task) => task.expected.checks.map((check) => [task.name, check] as const)),
  )('%s check %o should compile', (_, check) => {
    for (const pattern of [check.match ?? [], check.absent ?? []].flat()) {
      expect(() => new RegExp(pattern, check.flags)).not.toThrow();
    }
  });

  it('should tag exactly four smoke tasks, each with a solution', () => {
    // Act
    const smoke = tasks.filter((task) => task.metadata.tags.includes('smoke')).map((task) => task.name);

    // Assert
    expect(smoke.sort()).toEqual([
      'angular-select',
      'brand-button-override',
      'icon-only-toolbar',
      'tooltip-truncation',
    ]);
    expect(solutions.sort()).toEqual(smoke);
  });
});

describe('grade', () => {
  const file = (content: string, lang = 'tsx', filePath = `src/App.${lang}`) => ({ path: filePath, lang, content });

  it('should score zero when the agent wrote nothing', () => {
    expect(grade({ files: [], expected: {}, index }).score).toBe(0);
  });

  it('should pass wrote-code, searches, api, and task checks for clean code', () => {
    // Arrange
    const files = [file('<BqTooltip className="name">x</BqTooltip>\n.name { min-width: 0; }')];

    // Act
    const result = grade({ files, expected: { checks: [{ name: 'min-width', match: 'min-width:\\s*0' }] }, index });

    // Assert
    expect(result.checks.map((check) => [check.name, check.passed])).toEqual([
      ['wrote-code', true],
      ['searches', true],
      ['api', true],
      ['min-width', true],
    ]);
    expect(result.score).toBe(1);
  });

  it('should fail searches on a hex colour unless the task allows it', () => {
    // Arrange
    const files = [file(':root { --bq-ui--brand: #6B2FBA; }', 'css', 'src/brand.css')];

    // Act
    const strict = grade({ files, expected: {}, index });
    const allowed = grade({ files, expected: { allow_rules: ['hex'] }, index });

    // Assert
    expect(strict.checks.find((check) => check.name === 'searches')?.passed).toBe(false);
    expect(allowed.score).toBe(1);
  });

  it('should flag node_modules URLs in HTML but not in bundler config', () => {
    // Arrange
    const html = file(
      '<link rel="stylesheet" href="/node_modules/@beeq/core/dist/beeq/beeq.css" />',
      'html',
      'index.html',
    );
    const config = file(
      "viteStaticCopy({ targets: [{ src: 'node_modules/@beeq/core/dist/beeq/svg/*' }] })",
      'ts',
      'vite.config.ts',
    );

    // Act
    const fromHtml = grade({ files: [html], expected: {}, index });
    const fromConfig = grade({ files: [config], expected: {}, index });

    // Assert
    expect(fromHtml.checks.find((check) => check.name === 'searches')?.message).toContain('node-modules-url');
    expect(fromConfig.checks.find((check) => check.name === 'searches')?.passed).toBe(true);
  });

  it('should allow rem layout dimensions but flag px or rem spacing, stroke, and type', () => {
    // Arrange
    const css = file(
      [
        '.page { max-inline-size: 64rem; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); }',
        '.row { padding: 8px; border-width: 2px; line-height: 20px; }',
      ].join('\n'),
      'css',
      'src/app.css',
    );
    const tsx = file(`<main style={{ maxWidth: '22rem', padding: '4px' }}>x</main>`);

    // Act
    const messages = [css, tsx].map(
      (source) =>
        grade({ files: [source], expected: {}, index }).checks.find((check) => check.name === 'searches')?.message,
    );

    // Assert
    expect(messages[0]).toContain('8px');
    expect(messages[0]).toContain('2px');
    expect(messages[0]).toContain('20px');
    expect(messages[0]).not.toMatch(/64rem|14rem/);
    expect(messages[1]).toContain('4px');
    expect(messages[1]).not.toContain('22rem');
  });

  it('should flag !important and invented font tokens in any file', () => {
    // Arrange
    const files = [
      file(
        ':root { --bq-ui--brand: var(--bq-brand) !important; font-family: var(--bq-font-family-body); }',
        'css',
        'src/app.css',
      ),
    ];

    // Act
    const result = grade({ files, expected: {}, index });

    // Assert
    const searches = result.checks.find((check) => check.name === 'searches');
    expect(searches?.passed).toBe(false);
    expect(searches?.message).toContain('important');
    expect(searches?.message).toContain('font-family-token');
  });

  it('should flag single-dash role tokens but keep single-dash spacing, stroke, and colour variants', () => {
    // Arrange
    const flagged = file(
      '.a { font-size: var(--bq-font-size-s); color: var(--bq-text-secondary); }',
      'css',
      'src/a.css',
    );
    const clean = file(
      [
        '.b { gap: var(--bq-spacing-s); border: var(--bq-stroke-s) solid var(--bq-stroke--primary); }',
        '.c { color: var(--bq-danger-dark); font-size: var(--bq-font-size--s); border-radius: var(--bq-radius--m); }',
      ].join('\n'),
      'css',
      'src/b.css',
    );

    // Act
    const [flaggedSearches, cleanSearches] = [flagged, clean].map((source) =>
      grade({ files: [source], expected: {}, index }).checks.find((check) => check.name === 'searches'),
    );

    // Assert
    expect(flaggedSearches?.message).toContain('--bq-font-size-s');
    expect(flaggedSearches?.message).toContain('--bq-text-secondary');
    expect(cleanSearches?.passed).toBe(true);
  });

  it('should flag native tables without the bq-table class', () => {
    // Arrange
    const plain = file('<table className="users-table"><tbody /></table>');
    const styled = file('<table className="bq-table compact"><tbody /></table>');

    // Act
    const [plainSearches, styledSearches] = [plain, styled].map((source) =>
      grade({ files: [source], expected: {}, index }).checks.find((check) => check.name === 'searches'),
    );

    // Assert
    expect(plainSearches?.message).toContain('bq-table');
    expect(styledSearches?.passed).toBe(true);
  });

  it('should fail api on an invented prop', () => {
    // Act
    const result = grade({ files: [file('<BqButton iconOnly>x</BqButton>')], expected: {}, index });

    // Assert
    expect(result.checks.find((check) => check.name === 'api')?.message).toContain('iconOnly');
    expect(result.score).toBeCloseTo(2 / 3);
  });
});

describe('runCheck', () => {
  it('should require every match and reject every absent pattern', () => {
    // Arrange
    const check = { name: 'events', match: 'onBqChange=', absent: '\\sonChange=' };

    // Act & Assert
    expect(runCheck(check, '<BqSwitch onBqChange={f} />').passed).toBe(true);
    expect(runCheck(check, '<BqSwitch onBqChange={f} onChange={g} />')).toMatchObject({
      passed: false,
      message: 'found /\\sonChange=/',
    });
  });
});

describe('workspace helpers', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'beeq-skills-spec-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('should pin every BEEQ package to the given version', () => {
    // Act
    const { dependencies } = JSON.parse(packageJson('react', '1.2.3'));

    // Assert
    expect(dependencies).toMatchObject({ '@beeq/core': '1.2.3', '@beeq/react': '1.2.3', react: '^19.0.0' });
  });

  it('should collect only the agent files, and skip skillgrade and skill folders', () => {
    // Arrange
    materializeBlocks('```sh tests/test.sh\necho\n```', dir);
    materializeBlocks('```md .agents/skills/beeq/SKILL.md\nx\n```', dir);
    writeFileSync(path.join(dir, 'package.json'), '{}');
    materializeBlocks('```tsx src/App.tsx\nexport {};\n```\n```css src/app.css\na {}\n```', dir);

    // Act
    const files = collectFiles(dir, path.join(dir, 'no-fixtures'));

    // Assert
    expect(files.map((file) => file.path)).toEqual(['src/app.css', 'src/App.tsx']);
    expect(formatFiles(files)).toBe('```css src/app.css\na {}\n```\n\n```tsx src/App.tsx\nexport {};\n```');
  });

  it('should give the React fixture an app shell without BEEQ setup', () => {
    // Act
    const files = fixtureFiles('react', '1.2.3');

    // Assert
    expect(Object.keys(files).sort()).toEqual([
      'index.html',
      'package.json',
      'src/App.tsx',
      'src/index.css',
      'src/main.tsx',
    ]);
    expect(Object.values(files).join('\n')).not.toMatch(/beeq\.css|data-beeq|setBasePath/);
    expect(Object.keys(fixtureFiles('html', '1.2.3'))).toEqual(['package.json']);
  });

  it('should give the Angular fixture an app shell without BEEQ setup', () => {
    // Act
    const files = fixtureFiles('angular', '1.2.3');

    // Assert
    expect(Object.keys(files).sort()).toEqual([
      'angular.json',
      'package.json',
      'src/app/app.ts',
      'src/index.html',
      'src/main.ts',
      'src/styles.css',
    ]);
    expect(JSON.parse(files['angular.json']).projects.app.architect.build.options.styles).toEqual(['src/styles.css']);
    expect(Object.values(files).join('\n')).not.toMatch(/beeq\.css|data-beeq|setBasePath/);
  });

  it('should skip fixture files the agent left untouched', () => {
    // Arrange
    const workspace = path.join(dir, 'workspace');
    const fixtures = path.join(dir, 'fixtures');
    materializeBlocks('```tsx src/main.tsx\nshell\n```\n```html index.html\nshell\n```', path.join(fixtures, 'react'));
    materializeBlocks('```tsx src/main.tsx\nchanged\n```\n```html index.html\nshell\n```', workspace);
    materializeBlocks('```tsx src/List.tsx\nnew\n```', workspace);

    // Act
    const files = collectFiles(workspace, fixtures);

    // Assert
    expect(files.map((file) => file.path)).toEqual(['src/List.tsx', 'src/main.tsx']);
  });

  it('should not write fenced blocks outside the workspace', () => {
    // Act
    const written = materializeBlocks('```js ../escape.js\nx\n```', dir);

    // Assert
    expect(written).toEqual([]);
  });

  it('should detect a personal beeq skill', () => {
    // Arrange
    materializeBlocks('```md .claude/skills/beeq/SKILL.md\nx\n```', dir);

    // Act & Assert
    expect(() => assertNoPersonalSkill(dir)).toThrow(/contaminate the baseline/);
    expect(() => assertNoPersonalSkill(path.join(dir, 'nobody'))).not.toThrow();
  });
});

describe('agent commands', () => {
  let home: string;
  let codexDir: string;

  beforeEach(() => {
    home = mkdtempSync(path.join(tmpdir(), 'beeq-skills-home-'));
    codexDir = mkdtempSync(path.join(tmpdir(), 'beeq-skills-codex-'));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    rmSync(home, { recursive: true, force: true });
    rmSync(codexDir, { recursive: true, force: true });
  });

  it('should run Copilot without custom instructions and pass the model through', () => {
    // Act
    const { command, args } = COMMANDS.copilot({ prompt: 'Do it', model: 'gpt-5', home });

    // Assert
    expect(command).toBe('copilot');
    expect(args).toEqual(expect.arrayContaining(['-p', 'Do it', '--no-custom-instructions', '--model', 'gpt-5']));
  });

  it('should run Claude with a strict MCP config', () => {
    // Act
    const { args } = COMMANDS.claude({ prompt: 'Do it', home });

    // Assert
    expect(args).toEqual(expect.arrayContaining(['--strict-mcp-config', '--permission-mode', 'acceptEdits']));
    expect(args).not.toContain('--model');
  });

  it('should run Codex in a throwaway home that links the user login', () => {
    // Arrange
    writeFileSync(path.join(codexDir, 'auth.json'), '{}');
    vi.stubEnv('CODEX_HOME', codexDir);

    // Act
    const { command, args, env, stdin } = COMMANDS.codex({ prompt: 'Do it', model: 'gpt-5.5', home });

    // Assert
    expect(command).toBe('codex');
    expect(args).toEqual(expect.arrayContaining(['exec', '--skip-git-repo-check', '--model', 'gpt-5.5']));
    expect(args.at(-1)).toBe('-');
    expect(stdin).toBe('Do it');
    expect(env).toEqual({ CODEX_HOME: home });
    expect(readlinkSync(path.join(home, 'auth.json'))).toBe(path.join(codexDir, 'auth.json'));
  });

  it('should refuse to run Codex without a login or an API key', () => {
    // Act & Assert
    expect(() => codexHome(home, { CODEX_HOME: codexDir })).toThrow(/codex login/);
    expect(() => codexHome(home, { CODEX_HOME: codexDir, CODEX_API_KEY: 'k' })).not.toThrow();
  });
});

describe('serializeIndex', () => {
  it('should round-trip the BEEQ index through JSON', () => {
    // Act
    const revived = reviveIndex(JSON.parse(JSON.stringify(serializeIndex(index))));

    // Assert
    expect(revived.components.get('bq-button')?.props.has('onlyIcon')).toBe(true);
    expect(revived.pascalToTag.get('BqTooltip')).toBe('bq-tooltip');
    expect(revived.components.get('bq-alert')?.values.get('type')).toEqual(
      index.components.get('bq-alert')?.values.get('type'),
    );
    expect(revived.tokens).toEqual(index.tokens);
  });
});

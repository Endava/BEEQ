import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { beforeAll, describe, expect, it } from 'vitest';

import { findApiIssues, loadBeeqIndex } from '../evals/lib/beeq-index.ts';

const repoRoot = path.resolve(import.meta.dirname, '../../..');
const skillDir = path.join(repoRoot, 'packages/beeq-skills/src/beeq');
const files = ['SKILL.md', ...readdirSync(path.join(skillDir, 'references')).map((file) => `references/${file}`)];

// Names the skill mentions on purpose as mistakes to avoid.
const DELIBERATE_MISTAKES = ['element:bq-table', 'value:bq-alert.type=danger'];

let index: ReturnType<typeof loadBeeqIndex>;

beforeAll(() => {
  index = loadBeeqIndex(repoRoot);
});

describe('beeq skill API accuracy', () => {
  it('should index the component sources', () => {
    expect(index.components.size).toBeGreaterThan(30);
    expect(index.components.get('bq-button')?.props.has('variant')).toBe(true);
    expect(index.tokens.has('--bq-spacing-m')).toBe(true);
  });

  it('should index the allowed values of string literal props', () => {
    expect(index.components.get('bq-alert')?.values.get('type')).toContain('error');
    expect(index.components.get('bq-button')?.values.get('variant')).toContain('danger');
    expect(index.components.get('bq-input')?.values.has('placeholder')).toBe(false);
  });

  it.each(files)('%s should only name real elements, props, events, parts, and tokens', (file) => {
    // Act
    const issues = findApiIssues(readFileSync(path.join(skillDir, file), 'utf8'), index, {
      allow: DELIBERATE_MISTAKES,
    });

    // Assert
    expect(issues).toEqual([]);
  });
});

describe('findApiIssues', () => {
  it.each([
    ['element', '<bq-modal></bq-modal>'],
    ['prop', '<bq-input only-icon></bq-input>'],
    ['event', '<BqButton onBqChange={fn} />'],
    ['value', '<bq-alert type="danger"></bq-alert>'],
    ['part', 'bq-tooltip::part(content) { color: red; }'],
    ['token', '.a { color: var(--bq-text--made-up); }'],
  ])('should flag an unknown %s', (kind, code) => {
    expect(findApiIssues(code, index).map((issue) => issue.kind)).toEqual([kind]);
  });

  it('should accept real APIs across frameworks', () => {
    // Arrange
    const code = [
      '<bq-button variant="ghost" onclick="go()"></bq-button>',
      '<BqButton variant="ghost" onClick={go} onBqClick={go} />',
      '<bq-input (bqInput)="set($event)" [value]="name"></bq-input>',
      '<bq-input @bqInput="set" :value="name"></bq-input>',
      'bq-tooltip::part(trigger) { display: block; }',
      '.a { gap: var(--bq-spacing-m); }',
    ].join('\n');

    // Act & Assert
    expect(findApiIssues(code, index)).toEqual([]);
  });

  it('should flag literal values outside the prop type in every framework syntax', () => {
    // Arrange
    const code = [
      '<bq-input validation-status="invalid"></bq-input>',
      '<BqInput validationStatus="invalid" />',
      '<BqInput validationStatus={"invalid"} />',
      `<bq-input [validationStatus]="'invalid'"></bq-input>`,
      `<bq-input :validation-status="'invalid'"></bq-input>`,
    ].join('\n');

    // Act & Assert
    expect(findApiIssues(code, index).map((issue) => issue.kind)).toEqual(Array(5).fill('value'));
  });

  it('should accept computed values it cannot read', () => {
    // Arrange
    const code = [
      '<BqAlert type={status} />',
      `<bq-alert [type]="failed ? 'error' : 'success'"></bq-alert>`,
      '<bq-alert :type="kind"></bq-alert>',
      '<bq-alert type="{{ kind }}"></bq-alert>',
      `<bq-alert type="\${kind}"></bq-alert>`,
      '<bq-button variant="danger" size="small">Delete</bq-button>',
    ].join('\n');

    // Act & Assert
    expect(findApiIssues(code, index)).toEqual([]);
  });

  it('should skip strings inside JSX spreads and expressions', () => {
    // Arrange
    const code = '<BqButton {...{ label: "}" }} onBqClick={() => go("}")} made-up="x" />';

    // Act & Assert
    expect(findApiIssues(code, index).map((issue) => issue.name)).toEqual(['bq-button.made-up']);
  });

  it('should finish on an unterminated string inside an expression', () => {
    // Arrange
    const code = '<BqButton variant={"ghost}>Save</BqButton>';

    // Act & Assert
    expect(findApiIssues(code, index)).toEqual([]);
  });
});

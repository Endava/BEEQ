// @vitest-environment node
/** Temporary, test-only migration oracle: preset objects, not a runtime authority. */
import { describe, expect, it } from 'vitest';

import { compileFoundation, cssNames, declarations, selectors, whereArguments } from './parity-test-utils';
import { CSS_COLORS, DefaultRootTheme, EndavaRootTheme, modeObjects } from './theme-oracle';

const roots = { 'beeq-root': DefaultRootTheme, 'endava-root': EndavaRootTheme };
const oracle = { ...roots, ...modeObjects };
type BlockName = keyof typeof oracle;

const blocks = new Map<BlockName, { selector: string; values: Record<string, string>; order: number }>();
let order = 0;
compileFoundation('themes/index.scss').walkRules((rule) => {
  if (rule.parent?.type !== 'atrule' || rule.parent.name !== 'layer' || rule.parent.params !== 'bq.themes') return;
  const values = declarations(rule);
  const theme = rule.selector.includes('endava') ? 'endava' : 'beeq';
  const mode = rule.selector.includes('dark') ? 'dark' : 'light';
  if ('--bq-text--primary' in values)
    blocks.set(`${theme}-${mode}`, { selector: rule.selector, values, order: order++ });
  else if ('--bq-white' in values) blocks.set(`${theme}-root`, { selector: rule.selector, values, order: order++ });
});

const getBlock = (name: BlockName) => {
  const block = blocks.get(name);
  if (!block) throw new Error(`Missing ${name} block`);
  return block;
};

// Preset elevation shadows intentionally use the current mode's stroke role.
// All colour roles must still reference roots/primitives, rather than other modes.
const referencedRootNames = (values: Record<string, string>): string[] =>
  Object.entries(values).flatMap(([property, value]) =>
    [...value.matchAll(/var\((--bq-[\w-]+)/g)]
      .map((match) => match[1])
      .filter(
        (reference) =>
          !(property.startsWith('--bq-box-shadow--') && reference === '--bq-stroke--primary' && reference in values),
      ),
  );

// The old native BEEQ root also declares a focus default. S3 may remove it;
// it is allowed here, but all mode-level focus values must match the oracle.
const nativeOnlyNames: Partial<Record<BlockName, readonly string[]>> = { 'beeq-root': ['--bq-focus'] };
// Shared native aliases are deliberately outside the six theme/mode blocks.
const sharedNames = [
  '--bq-ring-width',
  '--bq-ring-offset-width',
  '--bq-ring-color-focus',
  '--bq-disabled-opacity',
  '--bq-state-mix-hover',
  '--bq-state-mix-active',
  '--bq-state--hover',
  '--bq-state--active',
];
const primitives: Record<string, string> = {};
compileFoundation('tokens/index.scss').walkRules((rule) => {
  Object.assign(primitives, declarations(rule));
});

describe('native theme parity (temporary preset oracle)', () => {
  it('should retain all primitive colour names and raw values', () => {
    expect(primitives).toMatchObject(cssNames(CSS_COLORS));
  });

  for (const [name, tokens] of Object.entries(oracle) as [BlockName, Record<string, string>][]) {
    it(`should preserve ${name} token names and raw references`, () => {
      const block = getBlock(name);
      const expected = cssNames(tokens);
      const actual = Object.fromEntries(
        Object.entries(block.values).filter(([key]) => !nativeOnlyNames[name]?.includes(key)),
      );
      expect(actual).toEqual(expected);
    });
  }

  for (const name of Object.keys(modeObjects) as (keyof typeof modeObjects)[]) {
    it(`should define every root/primitive name referenced by ${name}`, () => {
      const root = getBlock(name.startsWith('endava') ? 'endava-root' : 'beeq-root');
      // Endava roots extend the default root; they do not repeat spacing/font tokens.
      const available = new Set([
        ...Object.keys(primitives),
        ...Object.keys(getBlock('beeq-root').values),
        ...Object.keys(root.values),
      ]);
      const references = referencedRootNames(getBlock(name).values);
      expect([...new Set(references.filter((reference) => !available.has(reference)))].sort()).toEqual([]);
    });
  }

  it('should explicitly account for native-only shared interaction names', () => {
    const names: string[] = [];
    compileFoundation('themes/shared.scss').walkDecls((declaration) => {
      names.push(declaration.prop);
    });
    expect([...new Set(names)].sort()).toEqual([...sharedNames].sort());
  });

  for (const name of Object.keys(oracle) as BlockName[]) {
    it(`should wrap every ${name} selector in :where()`, () => {
      expect(selectors(getBlock(name).selector).every((part) => part.startsWith(':where(') && part.endsWith(')'))).toBe(
        true,
      );
    });
  }

  it('should give every root without a mode the generic light roles', () => {
    expect(whereArguments(getBlock('beeq-light').selector)).toContain(':root:not([bq-mode])');
  });

  it('should preserve preset source order, including Endava light after generic dark', () => {
    const sequence: BlockName[] = [
      'beeq-root',
      'beeq-light',
      'beeq-dark',
      'endava-root',
      'endava-light',
      'endava-dark',
    ];
    const ordered = [...blocks].sort((a, b) => a[1].order - b[1].order).map(([name]) => name);
    expect(ordered).toEqual(sequence);
  });
});

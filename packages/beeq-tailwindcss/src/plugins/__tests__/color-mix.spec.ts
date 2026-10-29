import postcss, { type Rule } from 'postcss';
import tailwindcss from 'tailwindcss';
import { describe, expect, it } from 'vitest';

import preset from '../../index';

type Declarations = Record<string, string>;

const compileUtilities = async (classes: string[]) => {
  const { root } = await postcss([
    tailwindcss({
      presets: [preset],
      content: [{ raw: `<div class="${classes.join(' ')}"></div>` }],
      corePlugins: { preflight: false },
    }),
  ]).process('@tailwind utilities;', { from: undefined });

  const rules: Record<string, Declarations> = {};
  root.walkRules((rule: Rule) => {
    const declarations: Declarations = {};
    rule.walkDecls((decl) => {
      declarations[decl.prop] = decl.value;
    });
    rules[rule.selector] = { ...rules[rule.selector], ...declarations };
  });
  return rules;
};

describe('ColorMix', () => {
  it.each([
    ['bg-hover-ui-brand', 'background-color', 'var(--bq-hover)'],
    ['bg-active-ui-brand', 'background-color', 'var(--bq-active)'],
    ['border-hover-brand', 'border-color', 'var(--bq-hover)'],
    ['border-active-brand', 'border-color', 'var(--bq-active)'],
    ['text-hover-brand', 'color', 'var(--bq-hover)'],
    ['text-active-brand', 'color', 'var(--bq-active)'],
    ['stroke-hover-brand', 'stroke', 'var(--bq-hover)'],
    ['stroke-active-brand', 'stroke', 'var(--bq-active)'],
  ])('should blend %s into %s with %s', async (className, property, base) => {
    // Arrange & Act
    const rules = await compileUtilities([className]);
    const declarations = rules[`.${className}`];

    // Assert
    expect(declarations).toBeDefined();
    expect(Object.keys(declarations)).toEqual([property]);
    expect(declarations[property]).toMatch(/^color-mix\(in srgb, /);
    expect(declarations[property]).toContain(`, ${base} 20%)`);
  });

  it('should emit each blend utility once', async () => {
    // Arrange & Act
    const { root } = await postcss([
      tailwindcss({
        presets: [preset],
        content: [{ raw: '<div class="bg-hover-ui-brand text-hover-brand border-hover-brand"></div>' }],
        corePlugins: { preflight: false },
      }),
    ]).process('@tailwind utilities;', { from: undefined });
    const selectors: string[] = [];
    root.walkRules((rule: Rule) => {
      selectors.push(rule.selector);
    });

    // Assert
    expect(selectors).toEqual([...new Set(selectors)]);
    expect(selectors).toHaveLength(3);
  });
});

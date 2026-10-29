import postcss, { type Rule } from 'postcss';
import tailwindcss from 'tailwindcss';
import type { PluginAPI } from 'tailwindcss/types/config';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import preset from '../../index';
import { clearThemeCache, createThemeSwapper, type ThemeConfig } from '../theme-swapper';

type CssRules = Record<string, Record<string, string>>;

const WHERE_PART = /^:where\(.+\)$/;

const THEME_TOKENS = ['--bq-background--primary', '--bq-ui--brand', '--bq-brand', '--bq-text--primary'];

const runSwapper = (themes: ThemeConfig[], prefix?: string): CssRules => {
  const addBase = vi.fn();
  createThemeSwapper({ themes, prefix })({ addBase } as unknown as Pick<PluginAPI, 'addBase'>);
  expect(addBase).toHaveBeenCalledTimes(1);
  return addBase.mock.calls[0][0] as CssRules;
};

const splitSelector = (selector: string) => selector.split(/,\s*/).map((part) => part.trim());

const isZeroSpecificity = (selector: string) => splitSelector(selector).every((part) => WHERE_PART.test(part));

const getThemeTokenSelectors = async () => {
  const { root } = await postcss([
    tailwindcss({
      presets: [preset],
      content: [{ raw: '<div></div>' }],
      corePlugins: { preflight: false },
    }),
  ]).process('@tailwind base;', { from: undefined });

  const selectors: string[] = [];
  root.walkRules((rule: Rule) => {
    if (rule.nodes.some((node) => node.type === 'decl' && THEME_TOKENS.includes(node.prop))) {
      selectors.push(rule.selector);
    }
  });
  return selectors;
};

describe('createThemeSwapper', () => {
  beforeEach(() => {
    clearThemeCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('selector specificity', () => {
    it('should wrap every theme selector in :where()', () => {
      // Arrange
      const themes: ThemeConfig[] = [{ name: 'base', selectors: [':root', '.beeq'], theme: { color: 'red' } }];

      // Act
      const rules = runSwapper(themes);

      // Assert
      expect(Object.keys(rules)).toEqual([':where(:root), :where(.beeq)']);
    });

    it('should wrap every mode selector in :where()', () => {
      // Arrange
      const themes: ThemeConfig[] = [
        { name: 'base', selectors: [':root'], theme: { color: 'red' } },
        { name: 'dark', selectors: ['[bq-mode="dark"]', '.dark'], theme: { color: 'black' }, mode: true },
      ];

      // Act
      const rules = runSwapper(themes);

      // Assert
      expect(Object.keys(rules)).toContain(':where([bq-mode="dark"]), :where(.dark)');
    });

    it('should emit only :where() selector parts for themes and modes alike', () => {
      // Arrange
      const themes: ThemeConfig[] = [
        { name: 'base', selectors: [':root'], theme: { color: 'red' } },
        {
          name: 'light',
          selectors: [':root:not([bq-theme]):not([bq-mode])', '[bq-mode="light"]', '.light'],
          theme: { color: 'white' },
          mode: true,
        },
        { name: 'dark', selectors: ['[bq-mode="dark"]', '.dark'], theme: { color: 'black' }, mode: true },
        { name: 'brand', selectors: ['[bq-theme="brand"]'], theme: { color: 'blue' } },
      ];

      // Act
      const selectors = Object.keys(runSwapper(themes));

      // Assert
      expect(selectors).toHaveLength(4);
      for (const selector of selectors) {
        expect(isZeroSpecificity(selector), selector).toBe(true);
      }
    });
  });

  describe('BEEQ preset output', () => {
    it('should declare theme tokens only inside zero-specificity :where() selectors', async () => {
      // Arrange & Act
      const selectors = await getThemeTokenSelectors();

      // Assert
      expect(selectors.length).toBeGreaterThan(0);
      for (const selector of selectors) {
        expect(isZeroSpecificity(selector), selector).toBe(true);
      }
    });

    it('should emit theme rules in order base → light → dark → endava → endava-light → endava-dark', async () => {
      // Arrange
      const selectors = await getThemeTokenSelectors();
      const indexOfPart = (part: string) => selectors.findIndex((selector) => splitSelector(selector).includes(part));

      // Act
      const order = [
        selectors.indexOf(':where(:root)'),
        indexOfPart(':where([bq-mode="light"])'),
        indexOfPart(':where([bq-mode="dark"])'),
        indexOfPart(':where([bq-theme="endava"])'),
        indexOfPart(':where([bq-theme="endava"][bq-mode="light"])'),
        indexOfPart(':where([bq-theme="endava"][bq-mode="dark"])'),
      ];

      // Assert
      for (const index of order) {
        expect(index).toBeGreaterThanOrEqual(0);
      }
      expect(new Set(order).size).toBe(order.length);
      expect(order).toEqual([...order].sort((a, b) => a - b));
    });

    it('should apply the default light mode to the root for any theme when no mode is set', async () => {
      // Arrange & Act
      const selectors = await getThemeTokenSelectors();
      const lightSelector = selectors.find((selector) => splitSelector(selector).includes(':where([bq-mode="light"])'));

      // Assert
      expect(lightSelector).toBeDefined();
      expect(splitSelector(lightSelector ?? '')).toContain(':where(:root:not([bq-mode]))');
    });
  });

  describe('validation', () => {
    it('should throw when no themes are provided', () => {
      // Arrange
      const addBase = vi.fn();
      const swapper = createThemeSwapper({ themes: [] });

      // Act & Assert
      expect(() => swapper({ addBase } as unknown as Pick<PluginAPI, 'addBase'>)).toThrow(
        'At least one theme required',
      );
      expect(addBase).not.toHaveBeenCalled();
    });

    it('should throw when a theme name is duplicated', () => {
      // Arrange
      const themes: ThemeConfig[] = [
        { name: 'base', selectors: [':root'], theme: {} },
        { name: 'base', selectors: ['.beeq'], theme: {} },
      ];

      // Act & Assert
      expect(() => runSwapper(themes)).toThrow('Duplicate theme: "base"');
    });

    it('should throw when a theme has no selectors', () => {
      // Arrange
      const themes: ThemeConfig[] = [{ name: 'base', selectors: [], theme: {} }];

      // Act & Assert
      expect(() => runSwapper(themes)).toThrow('Theme "base" needs selectors');
    });
  });

  describe('inheritance and prefix', () => {
    it('should merge variables from the extended theme and let the child override them', () => {
      // Arrange
      const themes: ThemeConfig[] = [
        { name: 'base', selectors: [':root'], theme: { color: 'red', size: '1px' } },
        { name: 'child', selectors: ['.child'], theme: { color: 'blue' }, extends: 'base', mode: true },
      ];

      // Act
      const rules = runSwapper(themes);

      // Assert
      expect(rules[':where(.child)']).toEqual({ '--color': 'blue', '--size': '1px' });
    });

    it('should throw when extending an unknown theme', () => {
      // Arrange
      const themes: ThemeConfig[] = [{ name: 'child', selectors: ['.child'], theme: {}, extends: 'missing' }];

      // Act & Assert
      expect(() => runSwapper(themes)).toThrow('Theme "missing" not found');
    });

    it('should apply the prefix to variables that do not already have it', () => {
      // Arrange
      const themes: ThemeConfig[] = [
        { name: 'base', selectors: [':root'], theme: { color: 'red', '--bq-size': '1px', '--other': '2px' } },
      ];

      // Act
      const rules = runSwapper(themes, 'bq');

      // Assert
      expect(rules[':where(:root)']).toEqual({ '--bq-color': 'red', '--bq-size': '1px', '--bq-other': '2px' });
    });
  });
});

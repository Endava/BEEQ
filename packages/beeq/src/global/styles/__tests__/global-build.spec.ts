// @vitest-environment node
import { fileURLToPath } from 'node:url';

import type { Plugin } from '@stencil/core/internal';
import postcss from 'postcss';
import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

import { config } from '../../../../stencil.config';

const cssPlugin = config.plugins?.find((plugin) => plugin.name === 'tailwind-hmr') as Plugin | undefined;
const transform = async (css: string, path: string): Promise<string> => {
  if (!cssPlugin?.transform) throw new Error('Missing Tailwind CSS transformer');
  const result = await cssPlugin.transform(css, path, {} as Parameters<NonNullable<Plugin['transform']>>[2]);
  if (typeof result === 'string') return result;
  if (!result?.code) throw new Error('CSS transformer returned no output');
  return result.code;
};

describe('global native foundations with the legacy Tailwind bridge', () => {
  it('should emit mode roles only inside bq.themes in the global CSS', async () => {
    const filename = fileURLToPath(new URL('../default.scss', import.meta.url));
    const source = compile(filename, { silenceDeprecations: ['import'] }).css;
    const css = await transform(source, filename.replace(/\.scss$/, '.css'));
    const stylesheet = postcss.parse(css);
    stylesheet.walkAtRules((rule) => {
      expect(['tailwind', 'apply'], `Unprocessed directive @${rule.name}`).not.toContain(rule.name);
    });
    stylesheet.walkDecls(/^--bq-/, (declaration) => {
      let inBeeqLayer = false;
      for (let parent: postcss.AnyNode | undefined = declaration.parent; parent; parent = parent.parent) {
        if (parent.type === 'atrule' && parent.name === 'layer' && parent.params.startsWith('bq.')) inBeeqLayer = true;
      }
      expect(inBeeqLayer, `Unlayered BEEQ token ${declaration.prop}`).toBe(true);
    });
    let modes = 0;
    stylesheet.walkDecls('--bq-text--primary', (declaration) => {
      modes++;
      let inThemes = false;
      for (let parent: postcss.AnyNode | undefined = declaration.parent; parent; parent = parent.parent) {
        if (parent.type === 'atrule' && parent.name === 'layer' && parent.params === 'bq.themes') inThemes = true;
      }
      expect(inThemes).toBe(true);
    });
    expect(modes).toBe(4);
  }, 15_000);

  it('should still generate global legacy classes from the shared input', async () => {
    const filename = fileURLToPath(new URL('../default.scss', import.meta.url));
    // These candidates exercise addComponents and utility generation without
    // depending on which utility classes the current component sources use.
    const css = await transform('/* focus text-xs */', filename);
    const stylesheet = postcss.parse(css);
    const classes: Record<string, Record<string, string>> = {};
    stylesheet.walkRules((rule) => {
      const values: Record<string, string> = {};
      rule.walkDecls((declaration) => {
        values[declaration.prop] = declaration.value;
      });
      classes[rule.selector] = values;
    });
    expect(classes['.focus']?.outline).toContain('var(--bq-ring-width');
    expect(classes['.text-xs']?.['font-size']).toBe('var(--bq-font-size--xs)');
    expect(css).not.toContain('@tailwind');
  });

  it('should retain the legacy component prelude required by @layer and @apply', async () => {
    const filename = fileURLToPath(new URL('../../../components/slider/scss/bq-slider.css', import.meta.url));
    const css = await transform(
      '@layer components { .legacy-probe { color: red; } } :host { @apply legacy-probe; }',
      filename,
    );
    const colors: string[] = [];
    postcss.parse(css).walkRules(':host', (rule) => {
      rule.walkDecls('color', (declaration) => {
        colors.push(declaration.value);
      });
    });
    expect(colors).toContain('red');
    expect(css).not.toContain('@apply');
  });
});

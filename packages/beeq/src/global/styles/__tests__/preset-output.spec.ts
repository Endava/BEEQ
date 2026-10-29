// @vitest-environment node
/** Temporary, test-only migration oracle; source files match pinned main 1e4f7b0e. */
import { readFileSync } from 'node:fs';

import postcss from 'postcss';
import type { PluginAPI } from 'tailwindcss/types/config';
import { expect, it } from 'vitest';

import preset from '../../../../../beeq-tailwindcss/src';
import { CSS_COLORS } from './theme-oracle';

it('should keep the browser oracle equal to actual preset theme-swapper output', () => {
  const stylesheet = postcss.root();
  const append = (selector: string, values: Record<string, string>): void => {
    const rule = postcss.rule({ selector });
    for (const [prop, value] of Object.entries(values)) {
      rule.append(postcss.decl({ prop: prop.startsWith('--') ? prop : `--${prop}`, value }));
    }
    stylesheet.append(rule);
  };
  append(':root', CSS_COLORS);
  const plugin = preset.plugins.at(-1) as { handler: (api: Pick<PluginAPI, 'addBase'>) => void };
  plugin.handler({
    addBase: (rules) => {
      for (const [selector, values] of Object.entries(rules)) append(selector, values as Record<string, string>);
    },
  });

  const fixture = readFileSync(new URL('./fixtures/pinned-preset.css.txt', import.meta.url), 'utf8');
  const header = '/* Temporary test-only oracle: pinned main 1e4f7b0e preset theme-swapper output. */\n';
  expect(fixture).toBe(`${header}${stylesheet.toString()}\n`);
});

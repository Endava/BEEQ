// @vitest-environment node
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import { compile } from 'sass';
import { describe, expect, it } from 'vitest';

const isInLayer = (node: postcss.AnyNode, match: (params: string) => boolean): boolean => {
  for (let parent: postcss.AnyNode | undefined = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && parent.name === 'layer' && match(parent.params)) return true;
  }
  return false;
};

describe('global native foundations', () => {
  it('should emit BEEQ tokens only inside bq.* layers and mode roles only inside bq.themes', () => {
    const filename = fileURLToPath(new URL('../default.scss', import.meta.url));
    const stylesheet = postcss.parse(compile(filename, { silenceDeprecations: ['import'] }).css);
    stylesheet.walkAtRules((rule) => {
      expect(['tailwind', 'apply'], `Unexpected directive @${rule.name}`).not.toContain(rule.name);
    });
    stylesheet.walkDecls(/^--bq-/, (declaration) => {
      expect(
        isInLayer(declaration, (params) => params.startsWith('bq.')),
        `Unlayered BEEQ token ${declaration.prop}`,
      ).toBe(true);
    });
    let modes = 0;
    stylesheet.walkDecls('--bq-text--primary', (declaration) => {
      modes++;
      expect(isInLayer(declaration, (params) => params === 'bq.themes')).toBe(true);
    });
    expect(modes).toBe(4);
  }, 15_000);
});

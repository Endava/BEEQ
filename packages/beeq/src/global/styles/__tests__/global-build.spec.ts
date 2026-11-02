// @vitest-environment node
import { fileURLToPath } from 'node:url';

import postcss from 'postcss';
import { compile } from 'sass';
import { beforeAll, describe, expect, it } from 'vitest';

const isInLayer = (node: postcss.AnyNode, match: (params: string) => boolean): boolean => {
  for (let parent: postcss.AnyNode | undefined = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && parent.name === 'layer' && match(parent.params)) return true;
  }
  return false;
};

describe('global native foundations', () => {
  let stylesheet: postcss.Root;

  beforeAll(() => {
    const filename = fileURLToPath(new URL('../default.scss', import.meta.url));
    stylesheet = postcss.parse(compile(filename, { silenceDeprecations: ['import'] }).css);
  }, 15_000);

  it('should emit BEEQ tokens only inside bq.* layers and mode roles only inside bq.themes', () => {
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
  });

  it('should leave only the documented exceptions outside the cascade layers', () => {
    // Unlayered rules beat every layer a consumer defines, utilities included, whatever the selector
    const unlayered = stylesheet.nodes.flatMap((node) => {
      if (node.type === 'rule') return [node.selectors.join(', ')];
      if (node.type === 'atrule' && node.name !== 'layer' && node.name !== 'font-face') {
        return [`@${node.name} ${node.params}`];
      }
      return [];
    });

    expect(
      unlayered,
      'New global rules belong in a bq.* layer. Add an exception only if it must beat consumer layers, and document it in getting-started/installation.mdx.',
    ).toEqual([
      ':where([hidden]:not([hidden=until-found]))',
      '@media (prefers-reduced-motion: reduce)',
      'body.bq-body--side-menu__collapse, body.bq-body--side-menu.bq-body--side-menu__collapse',
      'body.bq-body--side-menu__expand, body.bq-body--side-menu.bq-body--side-menu__expand',
    ]);
  });
});

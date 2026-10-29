// @vitest-environment node
/** Temporary, test-only migration oracle: the preset reset, not a runtime authority. */
import postcss, { type Root } from 'postcss';
import { describe, expect, it } from 'vitest';

import { reset } from '../../../../../beeq-tailwindcss/src/theme/reset';
import { compileFoundation, normalizeValue, selectors } from './parity-test-utils';

// Sass may remove optional quotes around an attribute's identifier value.
// Only unquote plain CSS identifiers; quoted whitespace/escapes stay significant.
const normalizeSelectorPart = (value: string): string =>
  normalizeValue(value).replace(/\[([\w-]+)='([a-zA-Z_][\w-]*)'\]/g, '[$1=$2]');

const normalizeSelector = (value: string): string =>
  selectors(value)
    .map((part) => {
      const normalized = part.startsWith(':where(')
        ? `:where(${selectors(part.slice(7, -1)).map(normalizeSelectorPart).sort().join(',')})`
        : normalizeSelectorPart(part);
      return normalized;
    })
    .sort()
    .join(',');

const logicalNames: Record<string, string> = {
  'min-height': 'min-block-size',
  'max-width': 'max-inline-size',
  top: 'inset-block-start',
  bottom: 'inset-block-end',
};

const ruleMap = (stylesheet: Root): Record<string, Record<string, string>> => {
  const result: Record<string, Record<string, string>> = {};
  stylesheet.walkRules((rule) => {
    const media: string[] = [];
    for (let parent: postcss.AnyNode | undefined = rule.parent; parent; parent = parent.parent) {
      if (parent.type === 'atrule' && parent.name === 'media') media.unshift(parent.params);
    }
    const key = `${media.join(' / ')} | ${normalizeSelector(rule.selector)}`;
    result[key] ??= {};
    const values = result[key];
    rule.walkDecls((declaration) => {
      const value = `${normalizeValue(declaration.value)}${declaration.important ? ' !important' : ''}`;
      if (declaration.prop === 'margin') {
        // The oracle only uses single-value margin shorthands (0 and auto).
        values['margin-block'] = value;
        values['margin-inline'] = value;
      } else values[logicalNames[declaration.prop] ?? declaration.prop] = value;
    });
  });
  return result;
};

// PostCSS builds the oracle AST directly; no source-text/regex selector comparison.
const buildOracle = (object: object, parent: Root | postcss.AtRule): void => {
  for (const [selector, values] of Object.entries(object)) {
    if (selector.startsWith('@media ')) {
      const media = postcss.atRule({ name: 'media', params: selector.slice(7) });
      parent.append(media);
      buildOracle(values, media);
    } else {
      const rule = postcss.rule({ selector });
      for (const [prop, value] of Object.entries(values as Record<string, string>)) {
        const important = value.endsWith(' !important');
        rule.append(postcss.decl({ prop, value: important ? value.slice(0, -11) : value, important }));
      }
      parent.append(rule);
    }
  }
};

const expectedRoot = postcss.root();
buildOracle(reset, expectedRoot);
// The native reset keeps these rules unlayered so they win over BEEQ layers without `!important`.
expectedRoot.walkDecls((declaration) => {
  declaration.important = false;
});
const expected = ruleMap(expectedRoot);
const actual = ruleMap(compileFoundation('reset.scss'));

describe('native reset parity (temporary preset oracle)', () => {
  it('should have the same selector/media coverage without legacy extra rules', () => {
    expect(Object.keys(actual).sort()).toEqual(Object.keys(expected).sort());
  });

  for (const [selector, values] of Object.entries(expected)) {
    it(`should preserve declarations for ${selector}`, () => {
      expect(actual[selector]).toEqual(values);
    });
  }
});

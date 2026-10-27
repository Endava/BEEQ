/**
 * Temporary test-only migration oracle. Native CSS is loaded by vitest-e2e-setup;
 * pinned preset CSS runs in an isolated iframe, never in the native fixture.
 */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { resolveColorToken } from '../../../shared/test-utils';
import presetCss from './fixtures/pinned-preset.css.txt?raw';
import { roleHex, roleNames, type ThemeMode } from './theme-oracle';

interface Fixture {
  name: string;
  theme?: string;
  mode?: string;
  classes?: string;
  expected: ThemeMode;
  nested?: boolean;
}

const rootFixtures: Fixture[] = [
  { name: 'no attributes', expected: 'beeq-light' },
  { name: 'unknown theme without mode', theme: 'acme', expected: 'beeq-light' },
  { name: 'BEEQ without mode', theme: 'beeq', expected: 'beeq-light' },
  { name: 'BEEQ light', theme: 'beeq', mode: 'light', expected: 'beeq-light' },
  { name: 'BEEQ dark', theme: 'beeq', mode: 'dark', expected: 'beeq-dark' },
  { name: 'Endava without mode', theme: 'endava', expected: 'endava-light' },
  { name: 'Endava light', theme: 'endava', mode: 'light', expected: 'endava-light' },
  { name: 'Endava dark', theme: 'endava', mode: 'dark', expected: 'endava-dark' },
  { name: '.beeq', classes: 'beeq', expected: 'beeq-light' },
  { name: '.beeq.light', classes: 'beeq light', expected: 'beeq-light' },
  { name: '.beeq.dark', classes: 'beeq dark', expected: 'beeq-dark' },
  { name: '.endava', classes: 'endava', expected: 'endava-light' },
  { name: '.endava.light', classes: 'endava light', expected: 'endava-light' },
  { name: '.endava.dark', classes: 'endava dark', expected: 'endava-dark' },
  { name: '.light', classes: 'light', expected: 'beeq-light' },
  { name: '.dark', classes: 'dark', expected: 'beeq-dark' },
  { name: 'BEEQ light + .dark', theme: 'beeq', mode: 'light', classes: 'dark', expected: 'beeq-dark' },
  { name: 'BEEQ dark + .light', theme: 'beeq', mode: 'dark', classes: 'light', expected: 'beeq-dark' },
  { name: 'Endava light + .dark', theme: 'endava', mode: 'light', classes: 'dark', expected: 'endava-light' },
  { name: 'Endava dark + .light', theme: 'endava', mode: 'dark', classes: 'light', expected: 'endava-dark' },
];

const nestedFixtures: Fixture[] = ['beeq', 'endava'].flatMap((theme) =>
  ['light', 'dark'].map((mode) => ({
    name: `nested ${theme} ${mode}`,
    theme,
    mode,
    expected: `${theme}-${mode}` as ThemeMode,
    nested: true,
  })),
);

const applyFixture = (element: HTMLElement, fixture: Fixture): void => {
  for (const name of ['bq-theme', 'bq-mode', 'class']) element.removeAttribute(name);
  if (fixture.theme) element.setAttribute('bq-theme', fixture.theme);
  if (fixture.mode) element.setAttribute('bq-mode', fixture.mode);
  if (fixture.classes) element.className = fixture.classes;
};

const concreteColor = (hex: string): string => {
  const probe = document.createElement('span');
  probe.style.setProperty('color', hex, 'important');
  document.body.appendChild(probe);
  try {
    return getComputedStyle(probe).color;
  } finally {
    probe.remove();
  }
};

describe('native theme runtime contract', () => {
  let frame: HTMLIFrameElement;
  let oracleRoot: HTMLElement;
  let originalAttributes: [string, string][];
  const inserted: HTMLElement[] = [];

  beforeAll(() => {
    frame = document.createElement('iframe');
    frame.hidden = true;
    document.body.appendChild(frame);
    const oracleDocument = frame.contentDocument;
    if (!oracleDocument) throw new Error('Could not create the isolated preset oracle');
    const style = oracleDocument.createElement('style');
    style.textContent = presetCss;
    oracleDocument.head.appendChild(style);
    oracleRoot = oracleDocument.documentElement;
  });

  beforeEach(() => {
    originalAttributes = [...document.documentElement.attributes].map(({ name, value }) => [name, value]);
    applyFixture(document.documentElement, { name: 'reset', expected: 'beeq-light' });
    applyFixture(oracleRoot, { name: 'reset', expected: 'beeq-light' });
  });

  afterEach(() => {
    for (const node of inserted.splice(0)) node.remove();
    for (const { name } of [...document.documentElement.attributes]) document.documentElement.removeAttribute(name);
    for (const [name, value] of originalAttributes) document.documentElement.setAttribute(name, value);
  });

  afterAll(() => frame.remove());

  const fixtureScopes = (fixture: Fixture): [HTMLElement, HTMLElement] => {
    if (!fixture.nested) {
      applyFixture(document.documentElement, fixture);
      applyFixture(oracleRoot, fixture);
      return [document.documentElement, oracleRoot];
    }
    const scope = document.createElement('div');
    const oracleScope = oracleRoot.ownerDocument.createElement('div');
    applyFixture(scope, fixture);
    applyFixture(oracleScope, fixture);
    document.body.appendChild(scope);
    oracleRoot.ownerDocument.body.appendChild(oracleScope);
    inserted.push(scope, oracleScope);
    return [scope, oracleScope];
  };

  for (const fixture of [...rootFixtures, ...nestedFixtures]) {
    describe(fixture.name, () => {
      for (const [index, name] of roleNames.entries()) {
        it(`should resolve ${name} to the preset's concrete colour`, () => {
          const [scope, oracleScope] = fixtureScopes(fixture);
          const expected = concreteColor(roleHex[fixture.expected][index]);
          // Validate the concrete expectation and conflicting selector outcome
          // against actual preset output before testing native CSS.
          expect(resolveColorToken(name, oracleScope), `preset ${fixture.name} ${name}`).toBe(expected);
          expect(getComputedStyle(scope).getPropertyValue(name).trim(), `raw ${fixture.name} ${name}`).not.toBe('');
          expect(resolveColorToken(name, scope), `native ${fixture.name} ${name}`).toBe(expected);
        });
      }
    });
  }

  for (const fixture of [...rootFixtures.slice(0, 8), ...nestedFixtures]) {
    for (const layered of [false, true]) {
      it(`should accept ${layered ? 'later-layer' : 'unlayered'} overrides on ${fixture.name}`, () => {
        const [scope] = fixtureScopes(fixture);
        if (fixture.nested) scope.setAttribute('data-parity-scope', '');
        const selector = fixture.nested ? '[data-parity-scope]' : ':root';
        const rule = `${selector} { --bq-text--primary: red; }`;
        const style = document.createElement('style');
        style.textContent = layered ? `@layer bq.themes, parityConsumer; @layer parityConsumer { ${rule} }` : rule;
        document.head.appendChild(style);
        inserted.push(style);
        expect(resolveColorToken('--bq-text--primary', scope)).toBe('rgb(255, 0, 0)');
      });
    }
  }

  for (const fixture of nestedFixtures) {
    it(`should keep ${fixture.name} declarations ahead of inherited root overrides`, () => {
      const [scope] = fixtureScopes(fixture);
      const style = document.createElement('style');
      style.textContent = ':root { --bq-text--primary: red; }';
      document.head.appendChild(style);
      inserted.push(style);
      expect(resolveColorToken('--bq-text--primary', document.documentElement)).toBe('rgb(255, 0, 0)');
      expect(resolveColorToken('--bq-text--primary', scope)).toBe(concreteColor(roleHex[fixture.expected][0]));
    });
  }
});

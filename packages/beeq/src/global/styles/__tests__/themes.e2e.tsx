import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { resolveColorToken } from '../../../shared/test-utils';

type ThemeMode = 'beeq-light' | 'beeq-dark' | 'endava-light' | 'endava-dark';

const roleNames = [
  '--bq-text--primary',
  '--bq-text--danger',
  '--bq-text--on-danger',
  '--bq-icon--brand',
  '--bq-stroke--info',
  '--bq-ui--info',
  '--bq-focus',
] as const;

// Concrete hex values per theme and mode, in `roleNames` order.
const roleHex: Record<ThemeMode, readonly string[]> = {
  'beeq-light': ['#2a2c35', '#b41226', '#ffffff', '#4f46e5', '#1158bc', '#156eeb', '#4f46e5'],
  'beeq-dark': ['#f1f2f4', '#f3a2ac', '#ffffff', '#b2c0fe', '#a1c5f7', '#156eeb', '#b2c0fe'],
  'endava-light': ['#192b37', '#a72925', '#ffffff', '#ff5640', '#3b6684', '#417191', '#ff5640'],
  'endava-dark': ['#ffffff', '#e84641', '#14222c', '#ff5640', '#9dcff0', '#9dcff0', '#ff5640'],
};

interface Fixture {
  name: string;
  theme?: string;
  mode?: string;
  classes?: string;
  expected: ThemeMode;
  nested?: boolean;
  body?: boolean;
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

const bodyFixtures: Fixture[] = nestedFixtures.map((fixture) => ({
  ...fixture,
  name: fixture.name.replace('nested', 'body'),
  nested: false,
  body: true,
}));

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

const renderThemedControls = async (fixture: Fixture) => {
  const { root } = await render(
    <div>
      <bq-button>Focus button</bq-button>
      <a class="bq-link" href="#focus-target">
        Focus link
      </a>
    </div>,
  );
  let scope = document.documentElement;
  if (fixture.nested) scope = root;
  if (fixture.body) scope = document.body;
  applyFixture(scope, fixture);
  await waitForStable(root);

  const button = root.querySelector('bq-button')?.shadowRoot?.querySelector<HTMLButtonElement>('[part="button"]');
  const link = root.querySelector<HTMLAnchorElement>('a');
  if (!button || !link) throw new Error('Could not render the focus controls');
  return { scope, button, link };
};

const expectFocusRing = (element: HTMLElement, color: string): void => {
  expect(element.matches(':focus-visible')).toBe(true);
  expect(getComputedStyle(element)).toMatchObject({
    outlineColor: color,
    outlineStyle: 'solid',
    outlineWidth: '2px',
    outlineOffset: '1px',
  });
};

describe('native theme runtime contract', () => {
  let originalAttributes: [string, string][];
  let originalBodyAttributes: [string, string][];
  const inserted: HTMLElement[] = [];

  beforeEach(() => {
    originalAttributes = [...document.documentElement.attributes].map(({ name, value }) => [name, value]);
    originalBodyAttributes = [...document.body.attributes].map(({ name, value }) => [name, value]);
    applyFixture(document.documentElement, { name: 'reset', expected: 'beeq-light' });
  });

  afterEach(() => {
    for (const node of inserted.splice(0)) node.remove();
    for (const { name } of [...document.documentElement.attributes]) document.documentElement.removeAttribute(name);
    for (const [name, value] of originalAttributes) document.documentElement.setAttribute(name, value);
    for (const { name } of [...document.body.attributes]) document.body.removeAttribute(name);
    for (const [name, value] of originalBodyAttributes) document.body.setAttribute(name, value);
  });

  const fixtureScope = (fixture: Fixture): HTMLElement => {
    if (!fixture.nested) {
      applyFixture(document.documentElement, fixture);
      return document.documentElement;
    }
    const scope = document.createElement('div');
    applyFixture(scope, fixture);
    document.body.appendChild(scope);
    inserted.push(scope);
    return scope;
  };

  for (const fixture of [...rootFixtures, ...nestedFixtures]) {
    describe(fixture.name, () => {
      for (const [index, name] of roleNames.entries()) {
        it(`should resolve ${name} to the theme's concrete colour`, () => {
          const scope = fixtureScope(fixture);
          const expected = concreteColor(roleHex[fixture.expected][index]);

          expect(getComputedStyle(scope).getPropertyValue(name).trim(), `raw ${fixture.name} ${name}`).not.toBe('');
          expect(resolveColorToken(name, scope), `${fixture.name} ${name}`).toBe(expected);
        });
      }
    });
  }

  for (const fixture of [...rootFixtures, ...nestedFixtures, ...bodyFixtures]) {
    describe(fixture.name, () => {
      it('should use the local theme focus colour for components and public links', async () => {
        const { button, link } = await renderThemedControls(fixture);
        const expected = concreteColor(roleHex[fixture.expected][roleNames.indexOf('--bq-focus')]);

        await userEvent.tab();
        expectFocusRing(button, expected);
        await userEvent.tab();
        expectFocusRing(link, expected);
      });

      it('should use the local theme font for components and public links', async () => {
        const { button, link } = await renderThemedControls(fixture);
        const family = fixture.expected.startsWith('endava') ? 'Poppins, sans-serif' : 'Outfit, sans-serif';

        expect(getComputedStyle(button).fontFamily).toBe(family);
        expect(getComputedStyle(link).fontFamily).toBe(family);
      });
    });
  }

  for (const initialFixture of [nestedFixtures[0], bodyFixtures[0]]) {
    it(`should update a focused control when ${initialFixture.name} changes theme or mode`, async () => {
      const { scope, button } = await renderThemedControls(initialFixture);
      await userEvent.tab();

      for (const fixture of [nestedFixtures[2], nestedFixtures[3], nestedFixtures[1], nestedFixtures[0]]) {
        applyFixture(scope, fixture);
        expectFocusRing(button, concreteColor(roleHex[fixture.expected][roleNames.indexOf('--bq-focus')]));
        expect(getComputedStyle(button).fontFamily).toBe(
          fixture.expected.startsWith('endava') ? 'Poppins, sans-serif' : 'Outfit, sans-serif',
        );
      }
    });
  }

  for (const token of ['--bq-focus', '--bq-ring-color-focus']) {
    it(`should honor a scoped ${token} override`, async () => {
      const { scope, button, link } = await renderThemedControls(nestedFixtures[2]);
      scope.style.setProperty(token, '#007a5e');

      await userEvent.tab();
      expectFocusRing(button, 'rgb(0, 122, 94)');
      await userEvent.tab();
      expectFocusRing(link, 'rgb(0, 122, 94)');
    });
  }

  it('should preserve an inherited explicit ring override inside a nested theme', async () => {
    document.documentElement.style.setProperty('--bq-ring-color-focus', '#007a5e');
    const { button, link } = await renderThemedControls(nestedFixtures[2]);

    await userEvent.tab();
    expectFocusRing(button, 'rgb(0, 122, 94)');
    await userEvent.tab();
    expectFocusRing(link, 'rgb(0, 122, 94)');
  });

  for (const property of ['--bq-font-family', 'font-family']) {
    it(`should honor a scoped ${property} override`, async () => {
      const { scope, button, link } = await renderThemedControls(nestedFixtures[2]);
      scope.style.setProperty(property, 'Georgia, serif');

      expect(getComputedStyle(button).fontFamily).toBe('Georgia, serif');
      expect(getComputedStyle(link).fontFamily).toBe('Georgia, serif');
    });
  }

  for (const fixture of [...rootFixtures.slice(0, 8), ...nestedFixtures]) {
    for (const layered of [false, true]) {
      it(`should accept ${layered ? 'later-layer' : 'unlayered'} overrides on ${fixture.name}`, () => {
        const scope = fixtureScope(fixture);
        if (fixture.nested) scope.setAttribute('data-override-scope', '');
        const selector = fixture.nested ? '[data-override-scope]' : ':root';
        const rule = `${selector} { --bq-text--primary: red; }`;
        const style = document.createElement('style');
        style.textContent = layered ? `@layer bq.themes, consumer; @layer consumer { ${rule} }` : rule;
        document.head.appendChild(style);
        inserted.push(style);
        expect(resolveColorToken('--bq-text--primary', scope)).toBe('rgb(255, 0, 0)');
      });
    }
  }

  for (const fixture of nestedFixtures) {
    it(`should keep ${fixture.name} declarations ahead of inherited root overrides`, () => {
      const scope = fixtureScope(fixture);
      const style = document.createElement('style');
      style.textContent = ':root { --bq-text--primary: red; }';
      document.head.appendChild(style);
      inserted.push(style);
      expect(resolveColorToken('--bq-text--primary', document.documentElement)).toBe('rgb(255, 0, 0)');
      expect(resolveColorToken('--bq-text--primary', scope)).toBe(concreteColor(roleHex[fixture.expected][0]));
    });
  }
});

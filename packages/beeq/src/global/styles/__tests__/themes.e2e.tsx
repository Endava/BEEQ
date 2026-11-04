import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

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

const endavaParity = [
  ['--bq-background--secondary', '#e8eaeb', '#47555f'],
  ['--bq-background--tertiary', '#babfc3', '#758087'],
  ['--bq-ui--secondary', '#e8eaeb', '#47555f'],
  ['--bq-ui--success', '#2d9c5b', '#3dd17b'],
  ['--bq-ui--warning', '#eb9410', '#f99c11'],
  ['--bq-text--warning', '#c77905', '#f99c11'],
  ['--bq-icon--warning', '#c77905', '#f99c11'],
  ['--bq-icon--info', '#192b37', '#ffffff'],
  ['--bq-stroke--primary', '#e8eaeb', '#30404b'],
  ['--bq-stroke--secondary', '#a3aaaf', '#758087'],
  ['--bq-stroke--tertiary', '#192b37', '#ffffff'],
  ['--bq-stroke--success', '#2d9c5b', '#3dd17b'],
  ['--bq-stroke--warning', '#eb9410', '#f99c11'],
] as const;

const endavaDarkShadows = [
  [
    'xs',
    '0 9.680214881896973px 30.9766845703125px -3.8720855712890625px rgb(0 0 0 / 10%), 0 5.808128833770752px 13.552299499511719px -5.808128833770752px rgb(0 0 0 / 15%)',
  ],
  [
    's',
    '0 11.616257667541504px 40.65690231323242px -3.8720855712890625px rgb(2.875000238418579% 10.149998962879181% 15.000000596046448% / 12%), 0 7.744171142578125px 17.42438507080078px -5.808128833770752px rgb(0 0 0 / 12%)',
  ],
  [
    'm',
    '0 13.552299499511719px 61.953369140625px -3.8720855712890625px rgb(0 0 0 / 12%), 0 7.744171142578125px 21.296472549438477px -5.808128833770752px rgb(0 0 0 / 12%)',
  ],
  [
    'l',
    '0 17.42438507080078px 85.1858901977539px -3.8720855712890625px rgb(0 0 0 / 14%), 0 7.744171142578125px 27.104598999023438px -5.808128833770752px rgb(0% 4.249999299645424% 7.083333283662796% / 12%)',
  ],
] as const;

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

const concreteShadow = (value: string): string => {
  const probe = document.createElement('span');
  probe.style.boxShadow = value;
  document.body.appendChild(probe);
  try {
    return getComputedStyle(probe).boxShadow;
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

  beforeEach(async () => {
    await cdp().send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: window.top.innerWidth - 1,
      y: window.top.innerHeight - 1,
    });
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
    if (fixture.body) {
      applyFixture(document.body, fixture);
      return document.body;
    }
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

  for (const fixture of [...rootFixtures, ...nestedFixtures, ...bodyFixtures].filter(
    ({ expected }) => expected === 'endava-dark',
  )) {
    it(`should paint all four exact Figma elevation effects on ${fixture.name}`, () => {
      const scope = fixtureScope(fixture);
      const probe = document.createElement('span');
      scope.appendChild(probe);
      inserted.push(probe);
      for (const [size, expected] of endavaDarkShadows) {
        probe.style.boxShadow = `var(--bq-box-shadow--${size})`;
        expect(getComputedStyle(probe).boxShadow, size).toBe(concreteShadow(expected));
      }
    });
  }

  it('should use the Endava dark elevation on a panel and preserve its component override', async () => {
    const { root } = await render(
      <div bq-theme="endava" bq-mode="dark">
        <bq-panel open>Elevated content</bq-panel>
      </div>,
    );
    await waitForStable(root);
    const host = root.querySelector('bq-panel');
    const panel = host?.shadowRoot?.querySelector<HTMLElement>('[part="panel"]');
    if (!host || !panel) throw new Error('Could not render the Endava elevation panel');
    expect(getComputedStyle(panel).boxShadow).toBe(concreteShadow(endavaDarkShadows[2][1]));
    host.style.setProperty('--bq-panel--box-shadow', 'none');
    expect(getComputedStyle(panel).boxShadow).toBe('none');
  });

  for (const [mode, surface, border, icon, infoColor] of [
    ['light', '#e8eaeb', '#eb9410', '#c77905', '#192b37'],
    ['dark', '#47555f', '#f99c11', '#f99c11', '#ffffff'],
  ]) {
    it(`should paint Endava ${mode} component surfaces and distinct validation/icon roles`, async () => {
      const { root } = await render(
        <div bq-theme="endava" bq-mode={mode}>
          <bq-button appearance="secondary">Secondary action</bq-button>
          <bq-input name="warning" validation-status="warning" />
          <bq-alert type="warning" open disableClose>
            Warning
          </bq-alert>
          <bq-alert type="info" open disableClose>
            Information
          </bq-alert>
        </div>,
      );
      await waitForStable(root);
      const button = root.querySelector('bq-button')?.shadowRoot?.querySelector<HTMLElement>('[part="button"]');
      const input = root.querySelector('bq-input')?.shadowRoot?.querySelector<HTMLElement>('[part="control"]');
      const warning = root.querySelector('bq-alert[type="warning"]')?.shadowRoot;
      const info = root.querySelector('bq-alert[type="info"]')?.shadowRoot;
      const warningBorder = warning?.querySelector<HTMLElement>('[part="wrapper"]');
      const warningIcon = warning?.querySelector<HTMLElement>('[part="icon-outline"]');
      const infoIcon = info?.querySelector<HTMLElement>('[part="icon-outline"]');
      if (!button || !input || !warningBorder || !warningIcon || !infoIcon) {
        throw new Error('Could not render the Endava parity controls');
      }
      expect(getComputedStyle(button).backgroundColor).toBe(concreteColor(surface));
      expect(getComputedStyle(input).borderTopColor).toBe(concreteColor(border));
      expect(getComputedStyle(warningBorder).borderTopColor).toBe(concreteColor(border));
      expect(getComputedStyle(warningIcon).color).toBe(concreteColor(icon));
      expect(getComputedStyle(infoIcon).color).toBe(concreteColor(infoColor));

      root.querySelector('bq-button')?.style.setProperty('--bq-button--secondary-background', '#007a5e');
      await Promise.all(button.getAnimations().map((animation) => animation.finished));
      expect(getComputedStyle(button).backgroundColor).toBe('rgb(0, 122, 94)');
    });
  }

  for (const fixture of [...rootFixtures, ...nestedFixtures, ...bodyFixtures].filter(({ expected }) =>
    expected.startsWith('endava'),
  )) {
    it(`should paint the approved Endava role matrix on ${fixture.name}`, () => {
      const scope = fixtureScope(fixture);
      const probe = document.createElement('span');
      scope.appendChild(probe);
      inserted.push(probe);
      for (const [role, light, dark] of endavaParity) {
        probe.style.borderColor = `var(${role})`;
        expect(getComputedStyle(probe).borderTopColor, role).toBe(
          concreteColor(fixture.expected === 'endava-light' ? light : dark),
        );
      }
      for (const [role, width] of [
        ['s', '1px'],
        ['m', '2px'],
        ['l', '3px'],
      ]) {
        probe.style.border = `var(--bq-stroke-${role}) solid var(--bq-stroke--tertiary)`;
        expect(getComputedStyle(probe).borderTopWidth).toBe(width);
      }
      probe.style.setProperty('--bq-stroke-s', '5px');
      probe.style.borderWidth = 'var(--bq-stroke-s)';
      expect(getComputedStyle(probe).borderTopWidth).toBe('5px');
    });
  }

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

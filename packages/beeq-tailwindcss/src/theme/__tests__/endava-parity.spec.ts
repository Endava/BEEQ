import { describe, expect, it } from 'vitest';

import { DefaultRootTheme, EndavaDarkTheme, EndavaLightTheme, EndavaRootTheme } from '../../generated/tokens';
import { CSS_COLORS, PRIMITIVE_COLORS } from '../colors';
import { createResolver, mergeTokenMaps } from './helpers/resolve-tokens';

// EWR Design Library (main), bfGWgYe1WjHL2HDMJLw8GQ, Colors 5253:40.
const parity = [
  ['brand', '#ff5640', '#ff5640', '5529:408'],
  ['background--primary', '#ffffff', '#192b37', '5529:463/576'],
  ['background--secondary', '#e8eaeb', '#47555f', '5529:466/579'],
  ['background--inverse', '#192b37', '#ffffff', '5529:465/578'],
  ['ui--primary', '#ffffff', '#192b37', '5529:505/618 (Figma UI inverse)'],
  ['ui--secondary', '#e8eaeb', '#47555f', '5529:466/579 (surface, not foreground)'],
  ['ui--inverse', '#192b37', '#ffffff', '5529:493/606 (Figma UI primary)'],
  ['ui--tertiary', '#8c959b', '#8c959b', '5529:502/615'],
  ['text--primary', '#192b37', '#ffffff', '5529:472/585'],
  ['text--secondary', '#5e6a73', '#a3aaaf', '5529:477/590'],
  ['text--inverse', '#ffffff', '#192b37', '5529:480/593 (inverse variables establish rest)'],
  ['text--warning', '#c77905', '#f99c11', '5529:489/602'],
  ['icon--primary', '#192b37', '#ffffff', '5529:520/633'],
  ['icon--secondary', '#5e6a73', '#a3aaaf', '5529:525/638'],
  ['icon--inverse', '#ffffff', '#192b37', '5529:528/641'],
  ['icon--info', '#192b37', '#ffffff', '5529:534/647'],
  ['icon--warning', '#c77905', '#f99c11', '5529:538/651'],
  ['ui--success', '#2d9c5b', '#3dd17b', '5529:513/626'],
  ['ui--warning', '#eb9410', '#f99c11', '5529:516/629'],
  ['stroke--primary', '#e8eaeb', '#30404b', '5529:547/660 (decorative)'],
  ['stroke--secondary', '#a3aaaf', '#758087', '5529:555/668 (subtle)'],
  ['stroke--tertiary', '#192b37', '#ffffff', '5529:542/655 (control boundary)'],
  ['stroke--inverse', '#ffffff', '#192b37', '5529:558/671'],
  ['stroke--success', '#2d9c5b', '#3dd17b', '5529:566/679'],
  ['stroke--warning', '#eb9410', '#f99c11', '5529:567/680'],
] as const;

const modes = [
  ['light', EndavaLightTheme, 1],
  ['dark', EndavaDarkTheme, 2],
] as const;

// Elevations 73:634, samples 4148:19170..173 reference the corresponding local effect styles.
const darkEffects = [
  [
    'xs',
    '9.680214881896973',
    '30.9766845703125',
    '5.808128833770752',
    '13.552299499511719',
    'rgb(0 0 0 / 10%)',
    'rgb(0 0 0 / 15%)',
  ],
  [
    's',
    '11.616257667541504',
    '40.65690231323242',
    '7.744171142578125',
    '17.42438507080078',
    'rgb(2.875000238418579% 10.149998962879181% 15.000000596046448% / 12%)',
    'rgb(0 0 0 / 12%)',
  ],
  [
    'm',
    '13.552299499511719',
    '61.953369140625',
    '7.744171142578125',
    '21.296472549438477',
    'rgb(0 0 0 / 12%)',
    'rgb(0 0 0 / 12%)',
  ],
  [
    'l',
    '17.42438507080078',
    '85.1858901977539',
    '7.744171142578125',
    '27.104598999023438',
    'rgb(0 0 0 / 14%)',
    'rgb(0% 4.249999299645424% 7.083333283662796% / 12%)',
  ],
] as const;

describe('Endava dark Figma elevations', () => {
  it.each(darkEffects)(
    '%s preserves both source layers without an additional stroke ring',
    (size, y1, blur1, y2, blur2, color1, color2) => {
      const expected = [
        `0 ${y1}px ${blur1}px -3.8720855712890625px ${color1}`,
        `0 ${y2}px ${blur2}px -5.808128833770752px ${color2}`,
      ].join(', ');
      expect(EndavaDarkTheme[`bq-box-shadow--${size}`].replace(/\s+/g, ' ')).toBe(expected);
    },
  );
});

describe.each(modes)('Endava %s Figma parity', (_, mode, index) => {
  const resolver = createResolver(mergeTokenMaps(CSS_COLORS, DefaultRootTheme, EndavaRootTheme, mode));

  it.each(parity)('%s follows %s / %s (source %s)', (role, light, dark) => {
    expect(resolver.resolve(`--bq-${role}`)).toBe(index === 1 ? light : dark);
  });

  it('keeps informational icons neutral without changing informational text or fills', () => {
    expect(resolver.trace('--bq-icon--info')).not.toContain('--bq-brand');
    expect(mode['bq-text--info']).toBe(index === 1 ? 'var(--bq-info-strong)' : 'var(--bq-info-bright)');
    expect(mode['bq-ui--info']).toBe(index === 1 ? 'var(--bq-info)' : 'var(--bq-info-bright)');
  });
});

describe('Endava palette boundary', () => {
  it('keeps only the established grey and orange primitive families', () => {
    const endavaPrimitives = Object.keys(CSS_COLORS).filter((key) => key.startsWith('--bq-endava-'));

    expect(endavaPrimitives).toHaveLength(22);
    expect(endavaPrimitives.every((key) => /^--bq-endava-(grey|orange)-/.test(key))).toBe(true);
    expect(JSON.stringify(PRIMITIVE_COLORS)).not.toContain('--bq-endava-');
  });

  it('stores feedback, information and data values at the semantic layer', () => {
    expect(EndavaRootTheme).toMatchObject({
      'bq-white': '#fff',
      'bq-success': '#2d9c5b',
      'bq-warning': '#eb9410',
      'bq-warning-strong': '#c77905',
      'bq-danger': '#d4403b',
      'bq-info': '#417191',
      'bq-data-02': '#5899c4',
    });
  });

  it('uses semantic aliases, with no text-step substitution for solid borders', () => {
    expect(EndavaRootTheme).toMatchObject({
      'bq-brand': 'var(--bq-endava-orange-600)',
      'bq-brand-strong': 'var(--bq-brand)',
      'bq-brand-bright': 'var(--bq-brand)',
      'bq-data-01': 'var(--bq-brand)',
      'bq-data-10': 'var(--bq-neutral-700)',
    });
    expect(EndavaLightTheme).toMatchObject({
      'bq-stroke--success': 'var(--bq-success)',
      'bq-stroke--warning': 'var(--bq-warning)',
    });
  });

  it('uses the uncontested dark tertiary background without changing blocked light Blue 30', () => {
    expect(EndavaDarkTheme['bq-background--tertiary']).toBe('var(--bq-neutral-600)');
    expect(EndavaLightTheme['bq-background--tertiary']).toBe('var(--bq-neutral-300)');
  });
});

describe('design approval holds (compatibility pins, not certified Figma matches)', () => {
  it('retains complete light shadows pending E1 opacity authority', () => {
    expect(EndavaLightTheme).toMatchObject({
      'bq-box-shadow--xs': '0 2px 0 rgb(0 0 0 / 1.6%)',
      'bq-box-shadow--s': '0 8px 24px rgb(0 0 0 / 4%)',
      'bq-box-shadow--m': '0 10px 48px -16px rgb(0 0 0 / 12%)',
      'bq-box-shadow--l': '0 20px 58px -16px rgb(0 0 0 / 16%)',
    });
  });

  it('retains the unresolved C2-C5 primitive and foreground mappings', () => {
    expect(EndavaRootTheme).toMatchObject({
      'bq-neutral-300': 'var(--bq-endava-grey-300)',
      'bq-success-strong': '#1d633a',
      'bq-danger-strong': '#a72925',
      'bq-brand-strong': 'var(--bq-brand)',
    });
    expect(EndavaLightTheme['bq-text--brand']).toBe('var(--bq-brand-strong)');
  });

  it('retains compatibility-only values without manufacturing primitive scales', () => {
    expect(EndavaRootTheme).toMatchObject({
      'bq-neutral-50': 'var(--bq-endava-grey-50)',
      'bq-neutral-1000': 'var(--bq-endava-grey-1000)',
      'bq-brand-light': 'var(--bq-endava-orange-100)',
      'bq-brand-dark': 'var(--bq-endava-orange-1000)',
      'bq-success-light': '#eaf5ef',
      'bq-success-dark': '#1f4943',
      'bq-info-light': '#ecf1f4',
      'bq-info-dark': '#29475a',
    });
  });

  it.each(modes)('retains %s state endpoints while C1/C4/C7/C8 and the fit remain unresolved', (_, mode) => {
    expect(mode['bq-hover']).toBe('#444546');
    expect(mode['bq-active']).toBe('#1f2026');
    expect(mode).not.toHaveProperty('bq-state-mix-hover');
    expect(mode).not.toHaveProperty('bq-state-mix-active');
  });

  it.each(modes)('retains %s focus treatment pending C9', (_, mode, index) => {
    expect(mode['bq-focus']).toBe(index === 1 ? 'var(--bq-brand-strong)' : 'var(--bq-brand)');
  });

  it('preserves the current dark danger decisions without certifying them as Figma parity', () => {
    expect(EndavaDarkTheme).toMatchObject({
      'bq-text--on-danger': 'var(--bq-white)',
      'bq-ui--danger': 'var(--bq-danger)',
    });
  });
});

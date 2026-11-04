import { describe, expect, it } from 'vitest';

import { DefaultRootTheme, EndavaDarkTheme, EndavaLightTheme, EndavaRootTheme } from '../../generated/tokens';
import { CSS_COLORS } from '../colors';
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
  ['ui--danger', '#d4403b', '#e84641', '5529:514/627'],
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

describe('uncontested primitive selection', () => {
  it('uses existing Figma primitives, with no text-step substitution for solid borders', () => {
    expect(EndavaRootTheme).toMatchObject({
      'bq-success': 'var(--bq-endava-positive-500)',
      'bq-warning': 'var(--bq-endava-warning-500)',
      'bq-warning-strong': 'var(--bq-endava-warning-700)',
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
  it('retains the unresolved C2-C5 primitive and foreground mappings', () => {
    expect(EndavaRootTheme).toMatchObject({
      'bq-neutral-300': 'var(--bq-endava-grey-300)',
      'bq-success-strong': 'var(--bq-endava-positive-800)',
      'bq-danger-strong': 'var(--bq-endava-negative-800)',
      'bq-brand-strong': 'var(--bq-endava-orange-600)',
    });
    expect(EndavaLightTheme['bq-text--brand']).toBe('var(--bq-brand-strong)');
  });

  it.each(modes)('retains %s state endpoints while C1/C4/C7/C8 and the fit remain unresolved', (_, mode) => {
    expect(mode['bq-hover']).toBe('#444546');
    expect(mode['bq-active']).toBe('#1f2026');
    expect(mode).not.toHaveProperty('bq-state-mix-hover');
    expect(mode).not.toHaveProperty('bq-state-mix-active');
  });

  it.each(modes)('retains %s focus treatment pending C9', (_, mode, index) => {
    expect(mode['bq-focus']).toBe(index === 1 ? 'var(--bq-brand-strong)' : 'var(--bq-brand-bright)');
  });
});

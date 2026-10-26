import { describe, expect, it } from 'vitest';

import { CSS_COLORS, DECLARATIVE_COLORS } from '../colors';
import { DefaultDarkTheme, DefaultLightTheme, DefaultRootTheme } from '../default';
import { EndavaDarkTheme, EndavaLightTheme, EndavaRootTheme } from '../endava';
import { DARK_BOX_SHADOWS, LIGHT_BOX_SHADOWS } from '../shadows';
import {
  apcaContrast,
  contrastRatio,
  createResolver,
  mergeTokenMaps,
  mix,
  normalizeHex,
  parseVar,
  type TokenMap,
  type TokenResolver,
} from './helpers/resolve-tokens';

/* -------------------------------------------------------------------------- */
/*                                   Setup                                    */
/* -------------------------------------------------------------------------- */

type ComboName = 'default-light' | 'default-dark' | 'endava-light' | 'endava-dark';
type Mode = 'light' | 'dark';

type Combo = {
  name: ComboName;
  theme: 'default' | 'endava';
  mode: Mode;
  /** Root semantic tokens available to the mode roles (normalized keys) */
  root: TokenMap;
  /** The raw mode object of the combination (normalized keys) */
  modeTokens: TokenMap;
  /** Effective token map following the cascade: base → light/dark → endava → endava light/dark */
  resolver: TokenResolver;
};

const INTENTS = ['brand', 'accent', 'info', 'success', 'warning', 'danger'] as const;
type Intent = (typeof INTENTS)[number];

const STATE_MIX_PERCENTAGE = 20;
const TEXT_MIN = 4.5;
const NON_TEXT_MIN = 3;
/** APCA Lc 60: minimum for regular-weight content text; WCAG 2 overrates light text on dark surfaces */
const APCA_TEXT_MIN = 60;

/** Elevation shadows live in the mode objects but are not colors; they are checked separately */
const isShadowToken = (key: string) => key.startsWith('--bq-box-shadow--');

const buildCombo = (
  name: ComboName,
  theme: Combo['theme'],
  mode: Mode,
  roots: Record<string, string>[],
  modeObjects: Record<string, string>[],
): Combo => ({
  name,
  theme,
  mode,
  root: mergeTokenMaps(...roots),
  modeTokens: Object.fromEntries(
    Object.entries(mergeTokenMaps(modeObjects[modeObjects.length - 1])).filter(([key]) => !isShadowToken(key)),
  ),
  resolver: createResolver(
    mergeTokenMaps(CSS_COLORS, roots[0], modeObjects[0], ...roots.slice(1), ...modeObjects.slice(1)),
  ),
});

const COMBOS: Combo[] = [
  buildCombo('default-light', 'default', 'light', [DefaultRootTheme], [DefaultLightTheme]),
  buildCombo('default-dark', 'default', 'dark', [DefaultRootTheme], [DefaultDarkTheme]),
  buildCombo(
    'endava-light',
    'endava',
    'light',
    [DefaultRootTheme, EndavaRootTheme],
    [DefaultLightTheme, EndavaLightTheme],
  ),
  buildCombo('endava-dark', 'endava', 'dark', [DefaultRootTheme, EndavaRootTheme], [DefaultDarkTheme, EndavaDarkTheme]),
];

const MODE_OBJECTS: Record<ComboName, Record<string, string>> = {
  'default-light': DefaultLightTheme,
  'default-dark': DefaultDarkTheme,
  'endava-light': EndavaLightTheme,
  'endava-dark': EndavaDarkTheme,
};

const cssVar = (role: string) => `--bq-${role}`;

const formatPair = (fg: string, fgHex: string, bg: string, bgHex: string) =>
  `${fg} (${fgHex}) on ${bg} (${bgHex}) = ${contrastRatio(fgHex, bgHex).toFixed(2)}`;

/* -------------------------------------------------------------------------- */
/*                              Contrast pairs                                */
/* -------------------------------------------------------------------------- */

type Pair = { fg: string; bg: string };

/** Surfaces every foreground role must be legible on */
const TEXT_SURFACES = ['background--primary', 'background--secondary', 'ui--primary', 'ui--secondary'];

/** WCAG 1.4.3: text ≥ 4.5:1 */
const TEXT_PAIRS: Pair[] = [
  ...['text--primary', 'text--secondary'].flatMap((fg) => TEXT_SURFACES.map((bg) => ({ fg, bg }))),
  ...INTENTS.flatMap((intent) => [...TEXT_SURFACES, `ui--${intent}-alt`].map((bg) => ({ fg: `text--${intent}`, bg }))),
  ...['ui--inverse', 'background--inverse'].map((bg) => ({ fg: 'text--inverse', bg })),
];

/** APCA Lc ≥ 60 for dark-mode intent text (`-bright`), on neutral surfaces and on the intent's own tint */
const DARK_INTENT_TEXT_PAIRS: Pair[] = INTENTS.flatMap((intent) =>
  [...TEXT_SURFACES, `ui--${intent}-alt`].map((bg) => ({ fg: `text--${intent}`, bg })),
);

/** WCAG 1.4.3: content on solid intent fills ≥ 4.5:1, at rest, hover and active */
const ON_FILL_PAIRS: Pair[] = INTENTS.map((intent) => ({ fg: `text--on-${intent}`, bg: `ui--${intent}` }));
const FILL_STATES = ['rest', 'hover', 'active'] as const;
type FillState = (typeof FILL_STATES)[number];

/** WCAG 1.4.11: non-text ≥ 3:1 */
const NON_TEXT_SURFACES = ['background--primary', 'ui--primary'];
const NON_TEXT_PAIRS: Pair[] = [
  ...['primary', 'secondary', ...INTENTS].map((variant) => `icon--${variant}`),
  'stroke--tertiary',
  ...INTENTS.map((intent) => `stroke--${intent}`),
  'focus',
]
  .flatMap((fg) => NON_TEXT_SURFACES.map((bg) => ({ fg, bg })))
  .concat({ fg: 'ui--tertiary', bg: 'ui--primary' });

/**
 * Exempt pairs (intentionally NOT tested):
 * - `stroke--primary`: decorative dividers and separators (WCAG 1.4.11 does not apply).
 * - `stroke--secondary`: subtle or disabled borders (disabled controls are exempt).
 * - Solid fills (`ui--{intent}`, `background--brand`) against page backgrounds: fills always carry text and/or an
 *   accessible name, so 1.4.11 is met through the text contrast checked in the on-fill pairs.
 * - Endava `text--secondary` on `background--tertiary` (light 2.99, dark 3.27) and on light `background--alt` (3.75):
 *   a documented "not allowed" pairing, secondary text is only used on primary/secondary surfaces.
 */

/**
 * Accepted contrast exceptions. Each entry lowers the minimum for one text pair, or one on-fill pair (rest, hover and active).
 * The list is pinned by `EXPECTED_EXCEPTION_COUNT` so it cannot grow silently. A minimum below the 3:1 non-text floor
 * needs `belowFloor`, and those entries are pinned by `EXPECTED_BELOW_FLOOR_COUNT`.
 */
type ContrastException = {
  combo: ComboName;
  fg: string;
  bg: string;
  min: number;
  reason: string;
  belowFloor?: boolean;
};

const ENDAVA_WHITE_ON_RED_ORANGE =
  'Endava brand fidelity: white on Red Orange #FF5640 (≈3.15:1). Passes AA for large text only; decided with the user and documented in the Endava theme docs.';

const ENDAVA_DARK_RED_ORANGE_TEXT =
  'Endava brand fidelity: dark brand text is Red Orange #FF5640, as on endava.com. 4.62:1 on the base surface, but 3.40:1 on raised surfaces and 3.77:1 on the brand tint (AA for large text only). Decided with the user and documented in the Endava deviation log.';

const ENDAVA_LIGHT_RED_ORANGE_TEXT =
  'Endava brand fidelity: light brand text, icons, strokes and focus are Red Orange #FF5640 (`--bq-brand-strong`), so they match the brand fill side by side. 3.15:1 on white, 2.81:1 on the brand tint and 2.61:1 on Blue 10, so AA for large text only on white and below the 3:1 floor on the other surfaces. Decided with the user and documented in the Endava deviation log; override `--bq-brand-strong` with #C33600 for 4.5:1 on every light surface.';

const ENDAVA_DARK_DANGER_FILL =
  'Endava brand fidelity: the dark danger fill is the brand Negative #E84641. Solid Blue on it is 3.73:1, so `--bq-black` is the darker #14222C (grey-1000), which reaches 4.16:1 at rest. Passes AA for large text and UI components only. Decided with the user and documented in the Endava deviation log.';

const ENDAVA_DARK_DANGER_TEXT =
  'Endava brand fidelity: dark danger text is the brand Negative #E84641 (`--bq-danger-bright`). 3.73:1 on the base surface, 3.19:1 on the danger tint and 2.75:1 on raised surfaces, so it misses AA for normal text and the 3:1 large-text floor on raised surfaces (APCA Lc 27–33). Decided with the user and documented in the Endava deviation log; override `--bq-danger-bright` with #F6B5B3 for 4.5:1 on every dark surface.';

const CONTRAST_EXCEPTIONS: ContrastException[] = [
  { combo: 'endava-light', fg: 'text--on-brand', bg: 'ui--brand', min: 3, reason: ENDAVA_WHITE_ON_RED_ORANGE },
  { combo: 'endava-light', fg: 'text--on-accent', bg: 'ui--accent', min: 3, reason: ENDAVA_WHITE_ON_RED_ORANGE },
  { combo: 'endava-dark', fg: 'text--on-brand', bg: 'ui--brand', min: 3, reason: ENDAVA_WHITE_ON_RED_ORANGE },
  { combo: 'endava-dark', fg: 'text--on-accent', bg: 'ui--accent', min: 3, reason: ENDAVA_WHITE_ON_RED_ORANGE },
  { combo: 'endava-dark', fg: 'text--on-danger', bg: 'ui--danger', min: 3, reason: ENDAVA_DARK_DANGER_FILL },
  ...(
    [
      ['background--primary', 3.7],
      ['ui--primary', 3.7],
      ['ui--danger-alt', 3.1],
      ['background--secondary', 2.7, true],
      ['ui--secondary', 2.7, true],
    ] as const
  ).map(([bg, min, belowFloor]) => ({
    combo: 'endava-dark' as const,
    fg: 'text--danger',
    bg,
    min,
    reason: ENDAVA_DARK_DANGER_TEXT,
    belowFloor,
  })),
  ...(['brand', 'accent'] as const).flatMap((intent) =>
    ['background--secondary', 'ui--secondary', `ui--${intent}-alt`].map((bg) => ({
      combo: 'endava-dark' as const,
      fg: `text--${intent}`,
      bg,
      min: 3,
      reason: ENDAVA_DARK_RED_ORANGE_TEXT,
    })),
  ),
  ...(['brand', 'accent'] as const).flatMap((intent) =>
    (
      [
        ['background--primary', 3.1],
        ['ui--primary', 3.1],
        [`ui--${intent}-alt`, 2.8, true],
        ['background--secondary', 2.6, true],
        ['ui--secondary', 2.6, true],
      ] as const
    ).map(([bg, min, belowFloor]) => ({
      combo: 'endava-light' as const,
      fg: `text--${intent}`,
      bg,
      min,
      reason: ENDAVA_LIGHT_RED_ORANGE_TEXT,
      belowFloor,
    })),
  ),
];
const EXPECTED_EXCEPTION_COUNT = 26;
const EXPECTED_BELOW_FLOOR_COUNT = 8;

const findException = (combo: ComboName, { fg, bg }: Pair) =>
  CONTRAST_EXCEPTIONS.find((entry) => entry.combo === combo && entry.fg === fg && entry.bg === bg);

/**
 * Accepted APCA exceptions. Each entry lowers the dark-mode Lc minimum for one intent text role on every surface.
 * WCAG 1.4.3 is still enforced for these roles by the text pairs (and their contrast exceptions).
 */
type ApcaException = { combo: ComboName; fg: string; min: number; reason: string };

const ENDAVA_DARK_SIGNAL_TEXT =
  'Endava brand fidelity: the brand guide reserves Positive #3DD17B and Warning #F99C11 for dark backgrounds and forbids other values. Both pass WCAG 4.5:1 on every dark surface, but reach only APCA Lc 51–57 (above the Lc 45 large-text floor). Decided with the user and documented in the Endava deviation log.';

const DEFAULT_DARK_RAISED_SURFACE_TEXT =
  'Default dark raised surfaces (`ui--secondary`, grey-800) are lifted for visible layering. Accent (purple-300) and danger (red-300) text reach Lc 59.5 and 59.8 there (about 7:1 WCAG); a lighter 200 tint would wash out the hue.';

const APCA_EXCEPTIONS: ApcaException[] = [
  { combo: 'default-dark', fg: 'text--accent', min: 59, reason: DEFAULT_DARK_RAISED_SURFACE_TEXT },
  { combo: 'default-dark', fg: 'text--danger', min: 59, reason: DEFAULT_DARK_RAISED_SURFACE_TEXT },
  { combo: 'endava-dark', fg: 'text--brand', min: 35, reason: ENDAVA_DARK_RED_ORANGE_TEXT },
  { combo: 'endava-dark', fg: 'text--accent', min: 35, reason: ENDAVA_DARK_RED_ORANGE_TEXT },
  { combo: 'endava-dark', fg: 'text--danger', min: 27, reason: ENDAVA_DARK_DANGER_TEXT },
  { combo: 'endava-dark', fg: 'text--success', min: 50, reason: ENDAVA_DARK_SIGNAL_TEXT },
  { combo: 'endava-dark', fg: 'text--warning', min: 50, reason: ENDAVA_DARK_SIGNAL_TEXT },
];
const EXPECTED_APCA_EXCEPTION_COUNT = 7;

const findApcaException = (combo: ComboName, fg: string) =>
  APCA_EXCEPTIONS.find((entry) => entry.combo === combo && entry.fg === fg);

const resolveFill = (resolver: TokenResolver, bg: string, state: FillState) => {
  const fill = resolver.resolve(cssVar(bg));
  return state === 'rest' ? fill : mix(fill, resolver.resolve(cssVar(state)), STATE_MIX_PERCENTAGE);
};

/* -------------------------------------------------------------------------- */
/*                               Role catalog                                 */
/* -------------------------------------------------------------------------- */

/** Every mode role listed in the plan's §6.3 tables */
const REQUIRED_MODE_ROLES = [
  ...['primary', 'secondary', 'tertiary', 'alt', 'inverse', 'brand', 'overlay'].map((v) => `background--${v}`),
  ...['primary', 'secondary', 'inverse', 'alt', ...INTENTS].map((v) => `text--${v}`),
  ...INTENTS.map((intent) => `text--on-${intent}`),
  ...['primary', 'secondary', 'inverse', 'alt', ...INTENTS].map((v) => `icon--${v}`),
  ...['primary', 'secondary', 'tertiary', 'inverse', 'alt', 'brand-alt', ...INTENTS].map((v) => `stroke--${v}`),
  ...['primary', 'secondary', 'tertiary', 'inverse', 'alt'].map((v) => `ui--${v}`),
  ...INTENTS.flatMap((intent) => [`ui--${intent}`, `ui--${intent}-alt`]),
  'hover',
  'active',
  'focus',
];

const ROOT_INTENT_SUFFIXES = ['-light', '', '-dark', '-strong', '-bright'];

/** Expected raw `text--on-{intent}` per combination (plan §4.1 rule 3, §6.3) */
const ON_COLOR: Record<ComboName, Record<Intent, 'white' | 'black'>> = {
  'default-light': {
    brand: 'white',
    accent: 'white',
    info: 'white',
    success: 'black',
    warning: 'black',
    danger: 'white',
  },
  'default-dark': {
    brand: 'white',
    accent: 'white',
    info: 'white',
    success: 'black',
    warning: 'black',
    danger: 'white',
  },
  'endava-light': {
    brand: 'white',
    accent: 'white',
    info: 'white',
    success: 'white',
    warning: 'black',
    danger: 'white',
  },
  'endava-dark': {
    brand: 'white',
    accent: 'white',
    info: 'black',
    success: 'black',
    warning: 'black',
    danger: 'black',
  },
};

/** Endava dark fills use `-bright` for these intents (plan §4.1 rule 3) */
const ENDAVA_DARK_BRIGHT_FILLS: Intent[] = ['info', 'success', 'warning', 'danger'];

/** Expected raw mode-role references per combination (plan §4.1 rule 3) */
const expectedIntentRoles = ({ name, mode }: Combo): [string, string][] => [
  ...INTENTS.flatMap((intent): [string, string][] => {
    const foreground = `var(--bq-${intent}-${mode === 'light' ? 'strong' : 'bright'})`;
    const fill =
      name === 'endava-dark' && ENDAVA_DARK_BRIGHT_FILLS.includes(intent)
        ? `var(--bq-${intent}-bright)`
        : `var(--bq-${intent})`;
    return [
      [`text--${intent}`, foreground],
      [`icon--${intent}`, foreground],
      [`stroke--${intent}`, foreground],
      [`ui--${intent}`, fill],
      [`ui--${intent}-alt`, `var(--bq-${intent}-${mode})`],
      [`text--on-${intent}`, `var(--bq-${ON_COLOR[name][intent]})`],
    ];
  }),
  ['stroke--brand-alt', `var(--bq-brand-${mode})`],
  ['focus', `var(--bq-brand-${mode === 'light' ? 'strong' : 'bright'})`],
];

/** Literal values allowed in mode objects (state bases, mixed at 20%) */
const ALLOWED_MODE_LITERALS: Record<string, string[]> = {
  '--bq-hover': ['#444546'],
  '--bq-active': ['#1f2026'],
};

const INFO_ROLES = ['text--info', 'icon--info', 'stroke--info', 'ui--info', 'ui--info-alt', 'text--on-info'];

/* -------------------------------------------------------------------------- */
/*                            Declarative colors                              */
/* -------------------------------------------------------------------------- */

type Leaf = { path: string; value: string };

const flattenLeaves = (node: unknown, path: string[] = []): Leaf[] =>
  typeof node === 'string'
    ? [{ path: path.join('.'), value: node }]
    : Object.entries(node as Record<string, unknown>).flatMap(([key, child]) => flattenLeaves(child, [...path, key]));

const DECLARATIVE_LEAVES = flattenLeaves(DECLARATIVE_COLORS);
/** `state.*` maps to `--bq-state--*`, which is only backed once the native SCSS migration (#1744) lands */
const BACKED_DECLARATIVE_LEAVES = DECLARATIVE_LEAVES.filter(({ path }) => !path.startsWith('state.'));

const EXPECTED_DECLARATIVE_KEYS: [string, string][] = [
  ['ui.info', 'ui--info'],
  ['ui.info-alt', 'ui--info-alt'],
  ['ui.accent', 'ui--accent'],
  ['ui.accent-alt', 'ui--accent-alt'],
  ['stroke.info', 'stroke--info'],
  ['stroke.accent', 'stroke--accent'],
  ['stroke.brand-alt', 'stroke--brand-alt'],
  ['text.accent', 'text--accent'],
  ['icon.accent', 'icon--accent'],
  ...INTENTS.map((intent): [string, string] => [`text.on-${intent}`, `text--on-${intent}`]),
];

/* -------------------------------------------------------------------------- */
/*                               Brand pins                                   */
/* -------------------------------------------------------------------------- */

/** Endava brand portal values (plan §5.2.1); a refactor must not drift from these */
const ENDAVA_PINS: [string, string][] = [
  ['--bq-brand', '#FF5640'], // Red Orange
  ['--bq-white', '#FFFFFF'], // Pure White
  ['--bq-black', '#14222C'], // Deliberately darker than Solid Blue #192B37: 4.16:1 (not 3.73:1) on the dark danger fill
  ['--bq-neutral-100', '#E8EAEB'], // Blue 10
  ['--bq-neutral-200', '#D1D5D7'], // Blue 20
  ['--bq-neutral-300', '#BABFC3'], // Blue 30
  ['--bq-neutral-400', '#A3AAAF'], // Blue 40
  ['--bq-neutral-500', '#8C959B'], // Blue 50
  ['--bq-neutral-600', '#758087'], // Blue 60
  ['--bq-neutral-700', '#5E6A73'], // Blue 70
  ['--bq-neutral-800', '#47555F'], // Blue 80
  ['--bq-neutral-900', '#30404B'], // Blue 90
  ['--bq-neutral-950', '#192B37'], // Solid Blue
];

const DEFAULT_LIGHT_PINS: [string, string][] = [
  ['--bq-hover', '#444546'],
  ['--bq-active', '#1f2026'],
];

/* -------------------------------------------------------------------------- */
/*                                   Tests                                    */
/* -------------------------------------------------------------------------- */

describe('token resolver helpers', () => {
  it('should compute WCAG contrast ratios', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFF', '#FF5640')).toBeCloseTo(3.15, 2);
    expect(contrastRatio('#ff5640', '#ffffff')).toBeCloseTo(contrastRatio('#ffffff', '#ff5640'), 10);
  });

  it('should compute APCA lightness contrast (Lc)', () => {
    expect(apcaContrast('#888888', '#ffffff')).toBeCloseTo(63.06, 1);
    expect(apcaContrast('#ffffff', '#888888')).toBeCloseTo(-68.54, 1);
    expect(apcaContrast('#000000', '#ffffff')).toBeCloseTo(106.04, 1);
    expect(apcaContrast('#ffffff', '#000000')).toBeCloseTo(-107.88, 1);
    expect(apcaContrast('#123456', '#123456')).toBe(0);
  });

  it('should mix colors like color-mix(in srgb, fill, base pct%)', () => {
    expect(mix('#ffffff', '#000000', 20)).toBe('#cccccc');
    expect(mix('#FFF', '#000', 0)).toBe('#ffffff');
    expect(mix('#ffffff', '#000000', 100)).toBe('#000000');
  });

  it('should resolve and trace var() chains, including fallbacks', () => {
    const resolver = createResolver({
      'bq-a': 'var(--bq-b)',
      '--bq-b': 'var(--bq-missing, var(--bq-c))',
      'bq-c': '#ABC',
    });

    expect(resolver.resolve('--bq-a')).toBe('#aabbcc');
    expect(resolver.trace('bq-a')).toEqual(['--bq-a', '--bq-b', '--bq-c']);
  });

  it('should throw on cycles, unresolved references and non-hex values', () => {
    const resolver = createResolver({
      'bq-a': 'var(--bq-b)',
      'bq-b': 'var(--bq-a)',
      'bq-c': 'var(--bq-x)',
      'bq-d': 'red',
    });

    expect(() => resolver.resolve('bq-a')).toThrow(/Cycle/);
    expect(() => resolver.resolve('bq-c')).toThrow(/Unresolved/);
    expect(() => resolver.resolve('bq-d')).toThrow(/Not a hex color/);
    expect(() => resolver.resolve('bq-unknown')).toThrow(/not defined/);
  });
});

describe('contrast exception allowlist', () => {
  it('should not grow silently', () => {
    expect(CONTRAST_EXCEPTIONS).toHaveLength(EXPECTED_EXCEPTION_COUNT);
  });

  it('should keep the exceptions below the 3:1 floor to a minimum', () => {
    expect(CONTRAST_EXCEPTIONS.filter(({ belowFloor }) => belowFloor)).toHaveLength(EXPECTED_BELOW_FLOOR_COUNT);
  });

  it.each(CONTRAST_EXCEPTIONS)('$combo: $fg on $bg should be a tested text or on-fill pair with a reason', (entry) => {
    expect([...TEXT_PAIRS, ...ON_FILL_PAIRS]).toContainEqual({ fg: entry.fg, bg: entry.bg });
    expect(entry.reason.length).toBeGreaterThan(0);
    if (entry.belowFloor) expect(entry.min).toBeLessThan(NON_TEXT_MIN);
    else expect(entry.min).toBeGreaterThanOrEqual(NON_TEXT_MIN);
  });

  it.each(CONTRAST_EXCEPTIONS)('$combo: $fg on $bg should still need the exception at rest', (entry) => {
    const { resolver } = COMBOS.find(({ name }) => name === entry.combo)!;
    const fgHex = resolver.resolve(cssVar(entry.fg));
    const bgHex = resolver.resolve(cssVar(entry.bg));

    expect(
      contrastRatio(fgHex, bgHex),
      `${formatPair(entry.fg, fgHex, entry.bg, bgHex)} passes 4.5:1, remove the exception`,
    ).toBeLessThan(TEXT_MIN);
  });
});

describe('APCA exception allowlist', () => {
  it('should not grow silently', () => {
    expect(APCA_EXCEPTIONS).toHaveLength(EXPECTED_APCA_EXCEPTION_COUNT);
  });

  it.each(APCA_EXCEPTIONS)('$combo: $fg should be a tested dark intent text role with a reason', (entry) => {
    expect(DARK_INTENT_TEXT_PAIRS.map(({ fg }) => fg)).toContain(entry.fg);
    expect(entry.reason.length).toBeGreaterThan(0);
  });

  it.each(APCA_EXCEPTIONS)('$combo: $fg should still need the exception on a tested surface', (entry) => {
    const { resolver } = COMBOS.find(({ name }) => name === entry.combo)!;
    const fgHex = resolver.resolve(cssVar(entry.fg));
    const lowestLc = Math.min(
      ...DARK_INTENT_TEXT_PAIRS.filter(({ fg }) => fg === entry.fg).map(({ bg }) =>
        Math.abs(apcaContrast(fgHex, resolver.resolve(cssVar(bg)))),
      ),
    );

    expect(lowestLc, `${entry.fg} reaches Lc ${APCA_TEXT_MIN}, remove the exception`).toBeLessThan(APCA_TEXT_MIN);
  });
});

describe.each(COMBOS)('$name', (combo) => {
  const { resolver } = combo;

  describe(`text ≥ ${TEXT_MIN}:1`, () => {
    it.each(TEXT_PAIRS)('$fg on $bg', ({ fg, bg }) => {
      const fgHex = resolver.resolve(cssVar(fg));
      const bgHex = resolver.resolve(cssVar(bg));
      const min = findException(combo.name, { fg, bg })?.min ?? TEXT_MIN;

      expect(contrastRatio(fgHex, bgHex), formatPair(fg, fgHex, bg, bgHex)).toBeGreaterThanOrEqual(min);
    });
  });

  describe.runIf(combo.mode === 'dark')(`intent text APCA Lc ≥ ${APCA_TEXT_MIN}`, () => {
    it.each(DARK_INTENT_TEXT_PAIRS)('$fg on $bg', ({ fg, bg }) => {
      const fgHex = resolver.resolve(cssVar(fg));
      const bgHex = resolver.resolve(cssVar(bg));
      const lc = Math.abs(apcaContrast(fgHex, bgHex));
      const min = findApcaException(combo.name, fg)?.min ?? APCA_TEXT_MIN;

      expect(lc, `${fg} (${fgHex}) on ${bg} (${bgHex}) = Lc ${lc.toFixed(1)}`).toBeGreaterThanOrEqual(min);
    });
  });

  describe(`on-fill ≥ ${TEXT_MIN}:1 at rest, hover and active`, () => {
    const cases = ON_FILL_PAIRS.flatMap((pair) => FILL_STATES.map((state) => ({ ...pair, state })));

    it.each(cases)('$fg on $bg ($state)', ({ fg, bg, state }) => {
      const min = findException(combo.name, { fg, bg })?.min ?? TEXT_MIN;
      const fgHex = resolver.resolve(cssVar(fg));
      const bgHex = resolveFill(resolver, bg, state);

      expect(
        contrastRatio(fgHex, bgHex),
        `${formatPair(fg, fgHex, `${bg} (${state})`, bgHex)}, min ${min}`,
      ).toBeGreaterThanOrEqual(min);
    });
  });

  describe(`non-text ≥ ${NON_TEXT_MIN}:1`, () => {
    it.each(NON_TEXT_PAIRS)('$fg on $bg', ({ fg, bg }) => {
      const fgHex = resolver.resolve(cssVar(fg));
      const bgHex = resolver.resolve(cssVar(bg));

      expect(contrastRatio(fgHex, bgHex), formatPair(fg, fgHex, bg, bgHex)).toBeGreaterThanOrEqual(NON_TEXT_MIN);
    });
  });

  describe('semantic integrity', () => {
    it.each(expectedIntentRoles(combo))('%s should reference %s', (role, expected) => {
      expect(combo.modeTokens[cssVar(role)]).toBe(expected);
    });
  });

  describe('info never resolves through brand', () => {
    it.each(INFO_ROLES)('%s', (role) => {
      const chain = resolver.trace(cssVar(role));

      expect(
        chain.filter((name) => name === '--bq-brand' || name.startsWith('--bq-brand-')),
        chain.join(' → '),
      ).toEqual([]);
    });
  });

  describe('mode roles only reference root semantics', () => {
    it.each(Object.entries(combo.modeTokens))('%s: %s', (key, value) => {
      const ref = parseVar(value);

      if (!ref) {
        expect(ALLOWED_MODE_LITERALS[key], `literal "${value}" is not allowed in ${key}`).toBeDefined();
        expect(ALLOWED_MODE_LITERALS[key]).toContain(normalizeHex(value));
        return;
      }

      expect(Object.keys(CSS_COLORS), `${key} references the primitive ${ref.name}`).not.toContain(ref.name);
      expect(combo.root[ref.name], `${key} references ${ref.name}, which is not a root semantic`).toBeDefined();
    });
  });

  describe('every mode role resolves to a color', () => {
    it.each(Object.keys(combo.modeTokens))('%s', (key) => {
      expect(() => resolver.resolve(key)).not.toThrow();
    });
  });

  describe('declarative colors resolve', () => {
    it.each(BACKED_DECLARATIVE_LEAVES)('$path → $value', ({ value }) => {
      const ref = parseVar(value);

      expect(ref, `${value} should be a var()`).toBeDefined();
      expect(() => resolver.resolve(ref!.name)).not.toThrow();
    });
  });
});

describe('mode role parity', () => {
  const sortedKeys = (combo: ComboName) => Object.keys(MODE_OBJECTS[combo]).sort();

  it.each(COMBOS.slice(1))('$name should define the same roles as default-light', ({ name }) => {
    expect(sortedKeys(name)).toEqual(sortedKeys('default-light'));
  });

  it.each(COMBOS.flatMap(({ name, modeTokens }) => REQUIRED_MODE_ROLES.map((role) => ({ name, role, modeTokens }))))(
    '$name should define $role',
    ({ role, modeTokens }) => {
      expect(modeTokens[cssVar(role)]).toBeDefined();
    },
  );
});

describe('mode box shadows', () => {
  it.each(COMBOS)('$name should use the $mode shadow set', ({ name, mode }) => {
    const expected = mode === 'dark' ? DARK_BOX_SHADOWS : LIGHT_BOX_SHADOWS;

    for (const [key, value] of Object.entries(expected)) {
      expect(MODE_OBJECTS[name][key]).toBe(value);
    }
  });

  it('should keep the light shadows as the root fallback', () => {
    for (const [key, value] of Object.entries(LIGHT_BOX_SHADOWS)) {
      expect(DefaultRootTheme[key as keyof typeof DefaultRootTheme]).toBe(value);
    }
  });

  it('should give dark elevated shadows an edge ring from the decorative stroke', () => {
    for (const key of ['bq-box-shadow--s', 'bq-box-shadow--m', 'bq-box-shadow--l'] as const) {
      expect(DARK_BOX_SHADOWS[key]).toMatch(/^0 0 0 1px var\(--bq-stroke--primary\), /);
    }
  });
});

describe('root semantic tokens', () => {
  const roots: [string, Record<string, string>][] = [
    ['DefaultRootTheme', DefaultRootTheme],
    ['EndavaRootTheme', EndavaRootTheme],
  ];
  const intentTokens = INTENTS.flatMap((intent) => ROOT_INTENT_SUFFIXES.map((suffix) => `bq-${intent}${suffix}`));

  it.each(roots.flatMap(([name, root]) => intentTokens.map((token) => ({ name, token, root }))))(
    '$name should define $token',
    ({ token, root }) => {
      expect(root[token]).toBeDefined();
    },
  );

  it.each(roots)('%s should not define bq-focus (it lives at mode level)', (_, root) => {
    expect(root).not.toHaveProperty('bq-focus');
  });
});

describe('DECLARATIVE_COLORS', () => {
  const leaves = Object.fromEntries(DECLARATIVE_LEAVES.map(({ path, value }) => [path, value]));
  const referencedVars = new Set(DECLARATIVE_LEAVES.map(({ value }) => parseVar(value)?.name));

  it.each(EXPECTED_DECLARATIVE_KEYS)('%s should map to var(--bq-%s)', (path, role) => {
    expect(leaves[path]).toBe(`var(${cssVar(role)})`);
  });

  it.each(REQUIRED_MODE_ROLES.filter((role) => role !== 'hover' && role !== 'active'))(
    'should expose the %s role',
    (role) => {
      expect(referencedVars.has(cssVar(role))).toBe(true);
    },
  );
});

describe('brand pins', () => {
  const endavaCombos = COMBOS.filter(({ theme }) => theme === 'endava');

  it.each(
    endavaCombos.flatMap(({ name, resolver }) => ENDAVA_PINS.map(([token, hex]) => ({ name, token, hex, resolver }))),
  )('$name: $token should be $hex', ({ token, hex, resolver }) => {
    expect(resolver.resolve(token)).toBe(normalizeHex(hex));
  });

  it.each(DEFAULT_LIGHT_PINS)('default-light: %s should be %s', (token, hex) => {
    const { resolver } = COMBOS.find(({ name }) => name === 'default-light')!;

    expect(resolver.resolve(token)).toBe(normalizeHex(hex));
  });
});

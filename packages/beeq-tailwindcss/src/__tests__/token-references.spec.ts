import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import { describe, expect, it } from 'vitest';

import { SHARED_TOKENS } from '../generated/tokens';
import preset, {
  CSS_COLORS,
  DECLARATIVE_COLORS,
  DefaultDarkTheme,
  DefaultLightTheme,
  DefaultRootTheme,
  EndavaDarkTheme,
  EndavaLightTheme,
  EndavaRootTheme,
  PRIMITIVE_COLORS,
  TYPOGRAPHY_DEFAULT,
} from '../index';
import { reset } from '../theme';

const THEMES = [
  DefaultRootTheme,
  DefaultLightTheme,
  DefaultDarkTheme,
  EndavaRootTheme,
  EndavaLightTheme,
  EndavaDarkTheme,
];

/** Every custom property the generated tokens define */
const DEFINED = new Set([
  ...Object.keys(CSS_COLORS),
  ...Object.keys(SHARED_TOKENS),
  ...THEMES.flatMap((theme) => Object.keys(theme).map((key) => `--${key}`)),
]);

/**
 * Legacy `font-outfit` / `font-poppins` aliases: no theme declares these variables, but the utilities stay for backward
 * compatibility (see `packages/beeq-skills/src/beeq/references/design-language.md`).
 */
const LEGACY_UNDEFINED = new Set(['--bq-font-family--outfit', '--bq-font-family--poppins']);

/** `var(--bq-*)` references without a fallback, which must resolve to a defined token */
const requiredRefs = (source: string): string[] => {
  const refs = [...source.matchAll(/var\(\s*(--bq-[\w-]+)\s*\)/g)].map(([, name]) => name);
  return [...new Set(refs)].filter((ref) => !LEGACY_UNDEFINED.has(ref)).sort();
};

describe('token references', () => {
  it.each([
    ['preset theme scales', preset.theme],
    ['DECLARATIVE_COLORS', DECLARATIVE_COLORS],
    ['PRIMITIVE_COLORS', PRIMITIVE_COLORS],
    ['theme and mode tokens', THEMES],
    ['shared tokens', SHARED_TOKENS],
    ['reset', reset],
    ['TYPOGRAPHY_DEFAULT', TYPOGRAPHY_DEFAULT],
  ])('%s should only reference defined tokens', (_, source) => {
    const refs = requiredRefs(JSON.stringify(source));

    expect(refs.length).toBeGreaterThan(0);
    expect(refs.filter((ref) => !DEFINED.has(ref))).toEqual([]);
  });

  it('should emit every token that the compiled base, components and utilities reference', async () => {
    // Arrange & Act
    const { css } = await postcss([
      tailwindcss({
        presets: [preset],
        content: [{ raw: '<div class="focus bg-hover-ui-brand text-active-brand bg-ui-primary text-primary">' }],
        corePlugins: { preflight: false },
      }),
    ]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
    const emitted = new Set([...css.matchAll(/(--bq-[\w-]+)\s*:/g)].map(([, name]) => name));

    // Assert
    expect(requiredRefs(css).filter((ref) => !emitted.has(ref))).toEqual([]);
  });
});

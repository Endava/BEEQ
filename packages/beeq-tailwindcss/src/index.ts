import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { CSS_COLORS_SELECTOR, SHARED_TOKENS, SHARED_TOKENS_SELECTOR, THEME_SELECTORS } from './generated/tokens';
import { BeeqThemeSwapper, ColorMix, LogicalProperties } from './plugins';
import {
  CSS_COLORS,
  DECLARATIVE_COLORS,
  DefaultDarkTheme,
  DefaultLightTheme,
  DefaultRootTheme,
  EndavaDarkTheme,
  EndavaLightTheme,
  EndavaRootTheme,
  PRIMITIVE_COLORS,
  reset,
  TYPOGRAPHY_DEFAULT,
} from './theme';

const inherit: string = 'inherit';

const preset = {
  theme: {
    colors: {
      inherit,
      current: 'currentColor',
      transparent: 'transparent',
      /* ------------------- Extended palette color (Primitive) ------------------- */
      ...PRIMITIVE_COLORS,
      /* ------------------- Specific Theme Colors (Declarative) ------------------ */
      focus: DECLARATIVE_COLORS.focus,
      data: { ...DECLARATIVE_COLORS.data },
      icon: { ...DECLARATIVE_COLORS.icon },
      ui: { ...DECLARATIVE_COLORS.ui },
    },
    borderRadius: {
      none: 'var(--bq-radius--none)',
      xs2: 'var(--bq-radius--xs2)',
      xs: 'var(--bq-radius--xs)',
      s: 'var(--bq-radius--s)',
      m: 'var(--bq-radius--m)',
      l: 'var(--bq-radius--l)',
      full: 'var(--bq-radius--full)',
    },
    borderWidth: {
      0: '0',
      s: 'var(--bq-stroke-s)',
      m: 'var(--bq-stroke-m)',
      l: 'var(--bq-stroke-l)',
      // Tailwind CSS v4 also matches `border-s` and `border-l` as its own side utilities, so use these keys there
      'stroke-s': 'var(--bq-stroke-s)',
      'stroke-m': 'var(--bq-stroke-m)',
      'stroke-l': 'var(--bq-stroke-l)',
    },
    boxShadow: {
      xs: 'var(--bq-box-shadow--xs)',
      s: 'var(--bq-box-shadow--s)',
      m: 'var(--bq-box-shadow--m)',
      l: 'var(--bq-box-shadow--l)',
    },
    fontFamily: {
      inherit,
      default: 'var(--bq-font-family)',
      outfit: 'var(--bq-font-family--outfit)',
      poppins: 'var(--bq-font-family--poppins)',
    },
    fontSize: {
      xs: 'var(--bq-font-size--xs)',
      s: 'var(--bq-font-size--s)',
      m: 'var(--bq-font-size--m)',
      l: 'var(--bq-font-size--l)',
      xl: 'var(--bq-font-size--xl)',
      xxl: 'var(--bq-font-size--xxl)',
      xxl2: 'var(--bq-font-size--xxl2)',
      xxl3: 'var(--bq-font-size--xxl3)',
      xxl4: 'var(--bq-font-size--xxl4)',
      xxl5: 'var(--bq-font-size--xxl5)',
    },
    fontWeight: {
      thin: 'var(--bq-font-weight--thin)',
      light: 'var(--bq-font-weight--light)',
      regular: 'var(--bq-font-weight--regular)',
      medium: 'var(--bq-font-weight--medium)',
      semibold: 'var(--bq-font-weight--semibold)',
      bold: 'var(--bq-font-weight--bold)',
    },
    lineHeight: {
      inherit,
      small: 'var(--bq-font-line-height--small)',
      regular: 'var(--bq-font-line-height--regular)',
      large: 'var(--bq-font-line-height--large)',
    },
    strokeWidth: {
      inherit,
      none: '0',
      s: 'var(--bq-stroke-s)',
      m: 'var(--bq-stroke-m)',
      l: 'var(--bq-stroke-l)',
    },
    extend: {
      /* ------------------ Extend colors with declarative colors ----------------- */
      backgroundColor: { ...DECLARATIVE_COLORS.bg },
      borderColor: { ...DECLARATIVE_COLORS.stroke },
      stroke: { ...DECLARATIVE_COLORS.stroke },
      textColor: { ...DECLARATIVE_COLORS.text },
      fill: { ...DECLARATIVE_COLORS.icon },
      /* --------------------------- End: Extend colors --------------------------- */
      content: {
        empty: "''",
      },
      cursor: {
        inherit,
      },
      height: {
        inherit,
        // Details: https://web.dev/viewport-units/#the-need-for-new-viewport-units
        'dynamic-vh': '100dvh',
      },
      spacing: {
        xs3: 'var(--bq-spacing-xs3)',
        xs2: 'var(--bq-spacing-xs2)',
        xs: 'var(--bq-spacing-xs)',
        s: 'var(--bq-spacing-s)',
        m: 'var(--bq-spacing-m)',
        l: 'var(--bq-spacing-l)',
        xl: 'var(--bq-spacing-xl)',
        xxl: 'var(--bq-spacing-xxl)',
        xxl2: 'var(--bq-spacing-xxl2)',
        xxl3: 'var(--bq-spacing-xxl3)',
        xxl4: 'var(--bq-spacing-xxl4)',
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents, theme }) => {
      addBase({
        // CSS variables
        [CSS_COLORS_SELECTOR]: { ...CSS_COLORS },
        // CSS reset
        ...reset,
      });
      // Interaction aliases shared by every theme and mode (ring, disabled opacity, state mixes)
      addBase({ [SHARED_TOKENS_SELECTOR]: { ...SHARED_TOKENS } });
      addComponents({
        /**
         * Common `FOCUS` state that should be used within `focus-visible` Tailwind CSS utility
         * Examples of usage:
         *
         *  class="focus-visible:focus"
         *
         *  @apply focus-visible:focus
         *
         *  &:focus-visible {
         *    @apply focus;
         *  }
         */
        '.focus': {
          outline: `var(--bq-ring-width, 2px) solid var(--bq-ring-color-focus, ${String(theme('colors.focus'))})`,
          outlineOffset: 'var(--bq-ring-offset-width, 1px)',
        },
      });
    }),
    // Local Custom Plugins
    ColorMix,
    LogicalProperties,
    BeeqThemeSwapper({
      // Selectors come from the SCSS theme files. Each one is wrapped in :where() (zero specificity),
      // so source order decides precedence: Endava's blocks come later and win for bq-theme="endava".
      themes: [
        // Base theme
        { name: 'base', selectors: THEME_SELECTORS.base, theme: { ...DefaultRootTheme } },
        // Light mode - default mode when no other mode is specified, for any theme (including custom ones)
        { name: 'light', selectors: THEME_SELECTORS.light, theme: { ...DefaultLightTheme }, mode: true },
        // Dark mode - only when explicitly set
        { name: 'dark', selectors: THEME_SELECTORS.dark, theme: { ...DefaultDarkTheme }, mode: true },
        // Endava base theme
        { name: 'endava', selectors: THEME_SELECTORS.endava, theme: { ...EndavaRootTheme } },
        // Endava light mode - default mode for Endava theme
        {
          name: 'endava-light',
          selectors: THEME_SELECTORS['endava-light'],
          theme: { ...EndavaLightTheme },
          mode: true,
        },
        // Endava dark mode - only when explicitly set
        {
          name: 'endava-dark',
          selectors: THEME_SELECTORS['endava-dark'],
          theme: { ...EndavaDarkTheme },
          mode: true,
        },
      ],
    }),
  ],
} satisfies Partial<Config>;

/**
 * The default export works both as a Tailwind CSS v3 preset (`presets: [beeqPreset]`, or v4 `@config`)
 * and as a Tailwind CSS v4 plugin (`@plugin "@beeq/tailwindcss"`), which expects `{ handler, config }`.
 */
export default Object.assign(
  plugin(() => {}, preset),
  preset,
);

export {
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
};

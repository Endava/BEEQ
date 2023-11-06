/* eslint-disable import/no-unresolved */
import plugin from 'tailwindcss/plugin';
import { Config } from 'tailwindcss/types/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ThemeSwapper from 'tailwindcss-theme-swapper';

import {
  DECLARATIVE_COLORS,
  DefaultDarkTheme,
  DefaultLightTheme,
  DefaultRootTheme,
  EndavaDarkTheme,
  EndavaLightTheme,
  EndavaRootTheme,
  PRIMITIVE_COLORS,
} from './theme';

export default {
  theme: {
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      /* -------------------------------------------------------------------------- */
      /*                         Default Theme (Declarative)                        */
      /* -------------------------------------------------------------------------- */
      ...DECLARATIVE_COLORS,
      /* -------------------------------------------------------------------------- */
      /*                         Extended colors (Primitive)                        */
      /* -------------------------------------------------------------------------- */
      ...PRIMITIVE_COLORS,
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
    boxShadow: {
      xs: 'var(--bq-box-shadow--xs)',
      s: 'var(--bq-box-shadow--s)',
      m: 'var(--bq-box-shadow--m)',
      l: 'var(--bq-box-shadow--l)',
    },
    fontFamily: {
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
      small: 'var(--bq-font-line-height--small)',
      regular: 'var(--bq-font-line-height--regular)',
      large: 'var(--bq-font-line-height--large)',
    },
    extend: {
      height: {
        // Details: https://web.dev/viewport-units/#the-need-for-new-viewport-units
        'dynamic-vh': '100dvh',
      },
      content: {
        empty: "''",
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
    ThemeSwapper({
      themes: [
        {
          name: 'root',
          selectors: [':root'],
          theme: { ...DefaultRootTheme },
        },
        {
          name: 'light',
          selectors: [':root', '.light', '.beeq.light', '[bq-mode="light"]'],
          theme: { ...DefaultLightTheme },
        },
        {
          name: 'dark',
          selectors: ['.dark', '.beeq.dark', '[bq-mode="dark"]'],
          theme: { ...DefaultDarkTheme },
        },
        {
          name: 'endava',
          selectors: ['.endava', '[bq-theme="endava"]'],
          theme: { ...EndavaRootTheme },
        },
        {
          name: 'endava-light',
          selectors: ['.endava.light', '[bq-theme="endava"][bq-mode="light"]'],
          theme: { ...EndavaLightTheme },
        },
        {
          name: 'endava-dark',
          selectors: ['.endava.dark', '[bq-theme="endava"][bq-mode="dark"]'],
          theme: { ...EndavaDarkTheme },
        },
      ],
    }),
    plugin(function ({ addComponents, theme }) {
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
  ],
} satisfies Partial<Config>;

export { DefaultRootTheme, DefaultLightTheme, DefaultDarkTheme, EndavaRootTheme, EndavaLightTheme, EndavaDarkTheme };

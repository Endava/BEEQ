import plugin from 'tailwindcss/plugin';
import lineClampPlugin from '@tailwindcss/line-clamp';
import { DECLARATIVE_COLORS, PRIMITIVE_COLORS } from './config';

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['packages/bee-q/**/*.{jsx,js,tsx,ts}'],
  theme: {
    borderRadius: {
      none: 'var(--bq-radius--none)',
      xs2: 'var(--bq-radius--xs2)',
      xs: 'var(--bq-radius--xs)',
      s: 'var(--bq-radius--s)',
      m: 'var(--bq-radius--m)',
      l: 'var(--bq-radius--l)',
      xl: 'var(--bq-radius--xl)',
      base: 'var(--bq-radius--m)',
      card: 'var(--bq-radius--l)',
      full: 'var(--bq-radius--xl)',
    },
    boxShadow: {
      xs: 'var(--bq-box-shadow--xs)',
      s: 'var(--bq-box-shadow--s)',
      m: 'var(--bq-box-shadow--m)',
      l: 'var(--bq-box-shadow--l)',
    },
    colors: {
      current: 'currentColor',
      focus: 'var(--bq-stroke--brand-focus)',
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
    fontFamily: {
      outfit: 'var(--bq-font-family--outfit)',
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
      regular: 'var(--bq-font-line-height--regular)',
      large: 'var(--bq-font-line-height--large)',
    },
    extend: {
      content: {
        empty: "''",
      },
    },
  },
  plugins: [
    lineClampPlugin,
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
          '--tw-ring-width': '2px',
          '--tw-ring-offset-width': '1px',
          '--tw-ring-color': theme('colors.focus'),
          outline: `var(--tw-ring-width) solid ${theme('colors.focus')}`,
          outlineOffset: 'var(--tw-ring-offset-width)',
        },
      });
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};

export default config;

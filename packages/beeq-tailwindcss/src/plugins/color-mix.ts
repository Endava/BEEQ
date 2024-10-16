import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

import { blendColor } from '../helpers';

// NOTE: https://github.com/tailwindlabs/tailwindcss/discussions/6925#discussioncomment-1919382
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

export const ColorMix: Partial<Config> = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      // Background `hover` state blend color
      'bg-hover': (value) => blendColor({ color: value, base: 'var(--bq-hover)' }),
      // Background `active` state blend color
      'bg-active': (value) => blendColor({ color: value, base: 'var(--bq-active)' }),
      // Border `hover` state blend color
      'border-hover': (value) => blendColor({ color: value, base: 'var(--bq-hover)', property: 'border-color' }),
      // Border `active` state blend color
      'border-active': (value) => blendColor({ color: value, base: 'var(--bq-active)', property: 'border-color' }),
      // Text `hover` state blend color
      'text-hover': (value) => blendColor({ color: value, base: 'var(--bq-hover)', property: 'color' }),
      // Text `active` state blend color
      'text-active': (value) => blendColor({ color: value, base: 'var(--bq-active)', property: 'color' }),
    },
    { values: flattenColorPalette(theme('colors')) },
  );
  matchUtilities(
    {
      // Background `hover` state blend color
      'bg-hover': (value) => blendColor({ color: value, base: 'var(--bq-hover)' }),
      // Background `active` state blend color
      'bg-active': (value) => blendColor({ color: value, base: 'var(--bq-active)' }),
    },
    { values: flattenColorPalette(theme('backgroundColor')) },
  );
  matchUtilities(
    {
      // Border `hover` state blend color
      'border-hover': (value) => blendColor({ color: value, base: 'var(--bq-hover)', property: 'border-color' }),
      // Border `active` state blend color
      'border-active': (value) => blendColor({ color: value, base: 'var(--bq-active)', property: 'border-color' }),
    },
    { values: flattenColorPalette(theme('borderColor')) },
  );
  matchUtilities(
    {
      // Text `hover` state blend color
      'text-hover': (value) => blendColor({ color: value, base: 'var(--bq-hover)', property: 'color' }),
      // Text `active` state blend color
      'text-active': (value) => blendColor({ color: value, base: 'var(--bq-active)', property: 'color' }),
    },
    { values: flattenColorPalette(theme('textColor')) },
  );
  matchUtilities(
    {
      // Stroke `hover` state blend color
      'stroke-hover': (value) => blendColor({ color: value, base: 'var(--bq-hover)', property: 'color' }),
      // Stroke `active` state blend color
      'stroke-active': (value) => blendColor({ color: value, base: 'var(--bq-active)', property: 'color' }),
    },
    { values: flattenColorPalette(theme('stroke')) },
  );
});

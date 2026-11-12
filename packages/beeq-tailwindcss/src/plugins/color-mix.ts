import plugin from 'tailwindcss/plugin';

import { blendColor, flattenColorPalette } from '../helpers';

export const ColorMix = plugin(({ matchUtilities, theme }) => {
  const hover = { base: 'var(--bq-hover)', percentage: 'var(--bq-state-mix-hover, 20%)' } as const;
  const active = { base: 'var(--bq-active)', percentage: 'var(--bq-state-mix-active, 20%)' } as const;
  matchUtilities(
    {
      // Background `hover` state blend color
      'bg-hover': (value) => blendColor({ color: value, ...hover }),
      // Background `active` state blend color
      'bg-active': (value) => blendColor({ color: value, ...active }),
    },
    { values: flattenColorPalette(theme('backgroundColor')) },
  );
  matchUtilities(
    {
      // Border `hover` state blend color
      'border-hover': (value) => blendColor({ color: value, ...hover, property: 'border-color' }),
      // Border `active` state blend color
      'border-active': (value) => blendColor({ color: value, ...active, property: 'border-color' }),
    },
    { values: flattenColorPalette(theme('borderColor')) },
  );
  matchUtilities(
    {
      // Text `hover` state blend color
      'text-hover': (value) => blendColor({ color: value, ...hover, property: 'color' }),
      // Text `active` state blend color
      'text-active': (value) => blendColor({ color: value, ...active, property: 'color' }),
    },
    { values: flattenColorPalette(theme('textColor')) },
  );
  matchUtilities(
    {
      // Stroke `hover` state blend color
      'stroke-hover': (value) => blendColor({ color: value, ...hover, property: 'stroke' }),
      // Stroke `active` state blend color
      'stroke-active': (value) => blendColor({ color: value, ...active, property: 'stroke' }),
    },
    { values: flattenColorPalette(theme('stroke')) },
  );
});

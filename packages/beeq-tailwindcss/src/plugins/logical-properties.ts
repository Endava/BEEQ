import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

// NOTE: https://github.com/tailwindlabs/tailwindcss/discussions/6925#discussioncomment-1919382
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

export const LogicalProperties: Partial<Config> = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      // Logical Border Width properties
      'border-bl': (value) => ({ 'border-block-width': value }),
      'border-bs': (value) => ({ 'border-block-start-width': value }),
      'border-be': (value) => ({ 'border-block-end-width': value }),
      'border-i': (value) => ({ 'border-inline-width': value }),
      'border-is': (value) => ({ 'border-inline-start-width': value }),
      'border-ie': (value) => ({ 'border-inline-end-width': value }),
    },
    { values: theme('borderWidth') },
  );
  matchUtilities(
    {
      // Logical Border Color properties
      'border-bl': (value) => ({ 'border-block-color': value }),
      'border-bs': (value) => ({ 'border-block-start-color': value }),
      'border-be': (value) => ({ 'border-block-end-color': value }),
      'border-i': (value) => ({ 'border-inline-color': value }),
      'border-is': (value) => ({ 'border-inline-start-color': value }),
      'border-ie': (value) => ({ 'border-inline-end-color': value }),
    },
    { values: flattenColorPalette(theme('colors')) },
  );
  matchUtilities(
    {
      // Logical Height and Width properties
      bs: (value) => ({ 'block-size': value }),
      'max-bs': (value) => ({ 'max-block-size': value }),
      'min-bs': (value) => ({ 'min-block-size': value }),
      is: (value) => ({ 'inline-size': value }),
      'max-is': (value) => ({ 'max-inline-size': value }),
      'min-is': (value) => ({ 'min-inline-size': value }),
    },
    { values: theme('width') },
  );
  matchUtilities(
    {
      // Logical Border properties
      'border-bl': (value) => ({ 'border-block': value }),
      'border-bs': (value) => ({ 'border-block-start': value }),
      'border-be': (value) => ({ 'border-block-end': value }),
      'border-i': (value) => ({ 'border-inline': value }),
      'border-is': (value) => ({ 'border-inline-start': value }),
      'border-ie': (value) => ({ 'border-inline-end': value }),
      // Logical Padding properties (only those not covered by Tailwind CSS)
      'p-b': (value) => ({ 'padding-block': value }),
      'p-bs': (value) => ({ 'padding-block-start': value }),
      'p-be': (value) => ({ 'padding-block-end': value }),
      'p-i': (value) => ({ 'padding-inline': value }),
    },
    {
      values: theme('spacing'),
    },
  );
  matchUtilities(
    {
      // Logical Top, Right, Bottom, and Left properties
      'inset-b': (value) => ({ 'inset-block': value }),
      'inset-bs': (value) => ({ 'inset-block-start': value }),
      'inset-be': (value) => ({ 'inset-block-end': value }),
      'inset-i': (value) => ({ 'inset-inline': value }),
      'inset-is': (value) => ({ 'inset-inline-start': value }),
      'inset-ie': (value) => ({ 'inset-inline-end': value }),
      // Logical Margin properties (only those not covered by Tailwind CSS)
      'm-b': (value) => ({ 'margin-block': value }),
      'm-bs': (value) => ({ 'margin-block-start': value }),
      'm-be': (value) => ({ 'margin-block-end': value }),
      'm-i': (value) => ({ 'margin-inline': value }),
    },
    {
      values: theme('spacing'),
      supportsNegativeValues: true,
    },
  );
});

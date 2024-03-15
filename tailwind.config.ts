// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as beeqPreset } from './dist/beeq-tailwindcss';
import type { Config } from 'tailwindcss';

export default {
  content: ['packages/beeq/src/**/*.{html,mdx,tsx,ts}'],
  presets: [beeqPreset],
  variants: {
    extend: {
      backgroundColor: ['active', 'disabled'],
      borderColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
    },
  },
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'empty',
    'read-only',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'disabled',
  ],
  corePlugins: {
    preflight: false,
    // Disables usage of rgb/opacity
    textOpacity: false,
    backgroundOpacity: false,
    borderOpacity: false,
  },
  experimental: {
    // Prevents Tailwind from generating that wall of empty custom properties
    optimizeUniversalDefaults: true,
  },
} satisfies Config;

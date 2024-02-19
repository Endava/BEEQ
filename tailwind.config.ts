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
  corePlugins: {
    preflight: false,
  },
} satisfies Config;

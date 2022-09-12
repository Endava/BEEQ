import addons from '@storybook/addons';
import { create } from '@storybook/theming/create';

const theme = create({
  base: 'light',

  colorPrimary: '#009bb4',
  colorSecondary: '#4F46E5',

  // BRAND
  brandTitle: 'Bee-Q Design System',
  brandImage: './assets/bee-q_logo.svg',

  // UI
  appBg: '#F9FAFB',
  appContentBg: '#FFFFFF',

  // Typography
  fontBase: '"Inter", sans-serif',

  // Text colors
  textColor: '#1F2937',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#1F2937',
  barSelectedColor: '#6366F1',
  barBg: '#F9FAFB',
});

addons.setConfig({
  theme,
  enableShortcuts: false,
  selectedPanel: 'controls',
  sidebar: {
    showRoots: true,
  },
});

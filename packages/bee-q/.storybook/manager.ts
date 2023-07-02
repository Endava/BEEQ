import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const theme = create({
  base: 'light',

  colorPrimary: '#f0f1f2',
  colorSecondary: '#4f46e5',

  // BRAND
  brandTarget: '_self',
  brandTitle: 'Bee-Q Design System',
  brandImage: './assets/beeq-logo.svg',

  // UI
  appBg: '#f0f1f2',
  appContentBg: '#fff',

  // Typography
  fontBase: '"Outfit", sans-serif',

  // Text colors
  textColor: '#2b2e33',
  textInverseColor: '#fff',

  // Toolbar default and active colors
  barTextColor: '#2b2e33',
  barSelectedColor: '#6366F1',
  barBg: '#f0f1f2',
});

addons.setConfig({
  theme,
  enableShortcuts: false,
  selectedPanel: 'controls',
  sidebar: {
    showRoots: true,
  },
});

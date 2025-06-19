import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',

  colorPrimary: '#f7f8f9',
  colorSecondary: '#4f46e5',

  // BRAND
  brandTarget: '_self',
  brandTitle: 'BEEQ Design System',
  brandImage: './assets/beeq-logo.svg',

  // UI
  appBg: '#f7f8f9',
  appContentBg: '#fff',
  appBorderRadius: 12,

  // Typography
  fontBase: '"Outfit", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#25282d',
  textInverseColor: '#fff',

  // Toolbar default and active colors
  barTextColor: '#25282d',
  barSelectedColor: '#4f46e5',
  barBg: '#f7f8f9',
});

addons.setConfig({
  theme,
  enableShortcuts: false,
  selectedPanel: 'controls',
  sidebar: {
    showRoots: true,
  },
});

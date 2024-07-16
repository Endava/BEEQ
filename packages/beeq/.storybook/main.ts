import { join } from 'path';
import type { StorybookConfig } from '@storybook/web-components-vite';

export default {
  framework: {
    name: '@storybook/web-components-vite',
    options: {
      builder: {
        viteConfigPath: join(__dirname, '../vite.config.mts').replace(/\\/g, '/'),
      },
    },
  },
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@beeq/storybook-addon-html',
    '@chromatic-com/storybook',
  ],
  staticDirs: [
    { from: '../../../dist/beeq/www/assets', to: '/assets' },
    { from: '../../../dist/beeq/www/scripts', to: '/scripts' },
    { from: '../../../dist/beeq/dist/beeq', to: '/beeq' },
    { from: './assets/css', to: '/css' },
  ],
  docs: {
    defaultName: 'Overview',
  },
  managerHead: (head) => `
    ${head}
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="robots" content="noindex" />
    <link rel="stylesheet" type="text/css" href="css/font.css" />
    <link rel="stylesheet" type="text/css" href="css/storybook.css" />
  `,
  previewHead: (head) => `
    ${head}
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" type="text/css" href="css/font.css" />
    <link rel="stylesheet" type="text/css" href="css/preview.css" />
    <link rel="stylesheet" type="text/css" href="beeq/beeq.css" />
    <script type="module" src="beeq/beeq.esm.js"></script>
    <script type="text/javascript">
      document.addEventListener('touchstart', function () {}, false);
    </script>
  `,
} satisfies StorybookConfig;

import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/web-components-vite';

// biome-ignore-start lint/style/useNamingConvention: Storybook has become fully ESM, thus CJS constants (require, __dirname, __filename) will not be defined.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// biome-ignore-end lint/style/useNamingConvention: Storybook has become fully ESM, thus CJS constants (require, __dirname, __filename) will not be defined.
const require = createRequire(import.meta.url);

export default {
  framework: {
    name: getAbsolutePath('@storybook/web-components-vite'),
    options: {
      builder: {
        viteConfigPath: join(__dirname, '../vite.config.mts').replace(/\\/g, '/'),
      },
    },
  },
  stories: ['../src/_storybook/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    // getAbsolutePath('@beeq/storybook-addon-html'),
    getAbsolutePath('@chromatic-com/storybook'),
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

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

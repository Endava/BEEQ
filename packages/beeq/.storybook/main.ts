import { join } from 'path';
import { mergeConfig } from 'vite';
import turbosnap from 'vite-plugin-turbosnap';

import type { StorybookConfig } from '@storybook/web-components-vite';
import type { InlineConfig } from 'vite';

const config: StorybookConfig = {
  addons: ['@storybook/addon-essentials', '@whitespace/storybook-addon-html', '@storybook/addon-a11y'],
  core: {
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: join(__dirname, '../vite.config.ts').replace(/\\/g, '/'),
      },
    },
  },
  docs: {
    autodocs: true,
    defaultName: 'Overview',
  },
  features: {
    // @see https://github.com/storybookjs/storybook/blob/main/docs/configure/overview.md#feature-flags
    buildStoriesJson: true,
  },
  framework: '@storybook/web-components-vite',
  stories: ['../src/_storybook/**/*.mdx', '../src/**/*.stories.@(mdx|ts|tsx)'],
  staticDirs: ['../../../dist/beeq/www', { from: '../../../dist/beeq/dist/bee-q', to: '/beeq' }],
  viteFinal: async (config: InlineConfig, { configType }) => {
    // Add your own config tweaks if needed and return the modified config
    return mergeConfig(config, {
      plugins: [configType === 'PRODUCTION' && turbosnap({ rootDir: config.root ?? process.cwd() })].filter(Boolean),
    });
  },
};

export default config;

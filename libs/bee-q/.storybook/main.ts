import type { Configuration } from 'webpack';
import type { StorybookConfig, Options } from '@storybook/core-common';
import { config as rootMain } from '../../../.storybook/main';

export default {
  core: {
    builder: {
      name: 'webpack5',
      options: {
        lazyCompilation: true,
      },
    },
  },
  features: {
    postcss: true,
  },
  framework: '@storybook/web-components',
  stories: [...rootMain.stories, '../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [...(rootMain.addons || []), '@pbutlewski/storybook-html'],
  staticDirs: [
    {
      from: '../../../dist/bee-q/dist/bee-q/svg/',
      to: '/svg',
    },
    {
      from: '../../../dist/bee-q/dist/bee-q',
      to: '/bee-q',
    },
    {
      from: '../../../dist/bee-q/www/assets',
      to: '/assets',
    },
  ],
  webpackFinal: async (config: Configuration, options: Options) => {
    // apply any global webpack configs that might have been specified in .storybook/main.ts
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, options);
    }

    // add your own webpack tweaks if needed
    return config;
  },
} as StorybookConfig;

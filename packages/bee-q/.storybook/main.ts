import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { config as rootMain } from '../../../.storybook/main';

import type { StorybookConfig, Options } from '@storybook/core-common';
import type { Configuration } from 'webpack';

export default {
  ...rootMain,
  framework: '@storybook/web-components',
  stories: [...rootMain.stories, '../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [...(rootMain.addons || []), '@whitespace/storybook-addon-html', '@storybook/addon-a11y'],
  staticDirs: [
    {
      from: '../../../dist/bee-q/www/assets',
      to: '/assets',
    },
    {
      from: '../../../dist/bee-q/www/scripts',
      to: '/scripts',
    },
  ],
  webpackFinal: async (config: Configuration, options: Options) => {
    // apply any global webpack configs that might have been specified in .storybook/main.ts
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, options);
    }

    if (config.optimization) {
      config.optimization.minimize = true;
      config.optimization.minimizer = [new TerserPlugin()];
    }

    config.plugins?.push(
      new CopyPlugin({
        patterns: [
          { from: './dist/bee-q/dist/bee-q', to: './bee-q', globOptions: { ignore: ['**/svg/**'] } },
          { from: './dist/bee-q/dist/bee-q/svg', to: './svg' },
        ],
      }),
    );

    return config;
  },
} as StorybookConfig;

import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

import { config as rootMain } from '../../../.storybook/main';

import type { StorybookConfig } from '@storybook/web-components-webpack5';

const config: StorybookConfig = {
  ...rootMain,
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {
      builder: { fsCache: false, lazyCompilation: true },
    },
  },
  features: {
    // @see https://github.com/storybookjs/storybook/blob/main/docs/configure/overview.md#feature-flags
    buildStoriesJson: true,
    storyStoreV7: true,
  },
  stories: [...rootMain.stories, '../src/**/*.stories.@(mdx|ts|tsx)'],
  addons: [
    ...(rootMain.addons || []),
    '@whitespace/storybook-addon-html',
    '@storybook/addon-a11y',
    '@storybook/addon-mdx-gfm',
  ],
  staticDirs: [
    { from: '../../../dist/bee-q/www/assets', to: '/assets' },
    { from: '../../../dist/bee-q/www/scripts', to: '/scripts' },
  ],
  docs: {
    autodocs: true,
  },
  webpackFinal: async (config, options) => {
    // apply any global webpack configs that might have been specified in .storybook/main.ts
    if (rootMain.webpackFinal) {
      config = await rootMain.webpackFinal(config, options);
    }

    if (config.optimization && options.configType === 'PRODUCTION') {
      config.optimization.minimize = true;
      config.optimization.minimizer = [new TerserPlugin()];
    }

    config.plugins!.push(
      new CopyPlugin({
        patterns: [{ from: './dist/bee-q/dist/bee-q', to: './bee-q' }],
      }),
    );

    return config;
  },
};

export default config;

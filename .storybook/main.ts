import type { Configuration } from 'webpack';
import type { StorybookConfig } from '@storybook/core-common';

export const config: StorybookConfig = {
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  core: {
    builder: {
      name: 'webpack5',
      options: {
        fsCache: false,
        lazyCompilation: false,
      },
    },
  },
  // @see https://github.com/storybookjs/storybook/blob/main/docs/configure/overview.md#feature-flags
  features: {
    babelModeV7: true,
    storyStoreV7: true,
  },
  stories: [],
  webpackFinal: async (config: Configuration) => {
    // `options.configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    const { resolve } = config;
    if (!resolve) throw new Error(`No resolve object assigned to Webpack's config. This is needed for Storybook.`);

    // Return the altered config
    return config;
  },
};

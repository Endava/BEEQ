import type { Configuration, RuleSetRule } from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { logger } from '@storybook/node-logger';
import { filterByLoaderName } from './utils/webpack-module-rules';

/**
 * @see https://github.com/storybookjs/storybook/blob/main/docs/configure/overview.md#using-storybook-api
 */
export const config = {
  addons: ['@storybook/addon-essentials'],
  stories: [],
  webpackFinal: async (config: Configuration, options) => {
    // `options.configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    const { resolve, module } = config;
    if (!resolve) throw new Error(`No resolve object assigned to Webpack's config. This is needed for Storybook.`);

    // Make whatever fine-grained changes you need
    const tsPaths = new TsconfigPathsPlugin({
      configFile: './tsconfig.base.json',
      extensions: resolve.extensions,
      mainFields: resolve.mainFields as string[],
    });
    resolve.plugins ? resolve.plugins.push(tsPaths as any) : (resolve.plugins = [tsPaths] as any);
    module!.rules!.forEach((rule: RuleSetRule | '...') => {
      // modify all 'babel-loader' occurrences by setting rootMode to 'upward'. this is needed in
      // babel 7+ to include any Nx projects having a `.babelrc.json` file to be processed. these files
      // must enable `onlyRemoveTypeImports` for stencil's 'h' module is not removed in stories.
      filterByLoaderName(rule, 'babel-loader')?.forEach(
        (ele) =>
          (ele.options = {
            ...ele.options,
            rootMode: 'upward',
          }),
      );
    });
    const instance = (await options.presets.apply('webpackInstance')) as any;
    logger.info(`=> Running in webpack instance: ${instance?.version}`);

    // Return the altered config
    return config;
  },
};

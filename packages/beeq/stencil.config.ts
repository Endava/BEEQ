import { resolve } from 'path';

import { angularOutputTarget as angular } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { vueOutputTarget as vue } from '@stencil/vue-output-target';
import tailwind, { PluginConfigOpts, tailwindHMR } from 'stencil-tailwind-plugin';

import { angularValueAccessorBindings, generateCustomElementsJson, vueComponentModels } from './src/tools';
import tailwindConf from '../../tailwind.config';

const tailwindOpts: PluginConfigOpts = {
  postcss: resolve(__dirname, '../../postcss.config.js').replace(/\\/g, '/'),
  tailwindConf: tailwindConf,
  stripComments: true,
};

const namespace = 'beeq';
const componentCorePackage = `@${namespace}/core`;
const customElementsDir = 'dist/components';

export const config: Config = {
  namespace,
  taskQueue: 'async',
  buildDist: true,
  enableCache: true,
  env: {
    BEEQ_ASSETS_BASE_PATH: process.env.BEEQ_ASSETS_BASE_PATH,
  },
  globalScript: resolve(__dirname, './src/global/scripts/global.ts').replace(/\\/g, '/'),
  globalStyle: resolve(__dirname, './src/global/styles/default.scss').replace(/\\/g, '/'),
  plugins: [
    sass({
      includePaths: [
        resolve(__dirname, '../../node_modules').replace(/\\/g, '/'),
        resolve(__dirname, 'src/global/styles').replace(/\\/g, '/'),
      ],
      injectGlobalPaths: [resolve(__dirname, 'src/global/styles/mixins/index.scss').replace(/\\/g, '/')],
      outputStyle: 'compressed',
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true,
    }),
    tailwind(tailwindOpts),
    tailwindHMR({ tailwindConf }),
  ],
  outputTargets: [
    { type: 'docs-readme' },
    /**
     * The output custom-elements.json file is used by Storybook to generate the documentation.
     * @see packages/beeq/.storybook/custom-elements.json
     */
    { type: 'docs-custom', generator: generateCustomElementsJson },
    {
      type: 'dist',
      copy: [
        { src: '../README.md', dest: '../../.', warn: true },
        { src: '../cem/*.*', dest: '../', warn: true },
      ],
    },
    { type: 'dist-hydrate-script', dir: 'dist/hydrate' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'single-export-module',
      externalRuntime: false,
      dir: customElementsDir,
      minify: true,
    },
    {
      type: 'www',
      copy: [
        { src: 'global/assets', dest: 'assets' },
        { src: 'global/scripts', dest: 'scripts' },
      ],
      serviceWorker: null, // disable service workers
    },
    angular({
      componentCorePackage,
      outputType: 'component', // Generate many component wrappers tied to a single Angular module (lazy/hydrated approach)
      directivesProxyFile: resolve(__dirname, '../beeq-angular/src/directives/components.ts').replace(/\\/g, '/'),
      directivesArrayFile: resolve(__dirname, '../beeq-angular/src/directives/index.ts').replace(/\\/g, '/'),
      valueAccessorConfigs: angularValueAccessorBindings,
      inlineProperties: true,
      customElementsDir,
    }),
    angular({
      componentCorePackage,
      outputType: 'standalone', // Generate a component with the standalone flag set to true.
      directivesProxyFile: resolve(__dirname, '../beeq-angular/standalone/src/directives/components.ts').replace(
        /\\/g,
        '/',
      ),
      directivesArrayFile: resolve(__dirname, '../beeq-angular/standalone/src/directives/index.ts').replace(/\\/g, '/'),
      valueAccessorConfigs: angularValueAccessorBindings,
      customElementsDir,
    }),
    react({
      outDir: resolve(__dirname, '../beeq-react/src/').replace(/\\/g, '/'),
      customElementsDir,
    }),
    react({
      outDir: resolve(__dirname, '../beeq-react/ssr').replace(/\\/g, '/'),
      hydrateModule: '@beeq/core/dist/hydrate',
      customElementsDir,
    }),
    vue({
      componentCorePackage,
      proxiesFile: resolve(__dirname, '../beeq-vue/src/components.ts').replace(/\\/g, '/'),
      includeImportCustomElements: true,
      includePolyfills: false,
      includeDefineCustomElements: false,
      componentModels: vueComponentModels,
      // hydrateModule: '@beeq/core/dist/hydrate',
      customElementsDir,
    }),
  ],
  extras: {
    /**
     * Details:
     * https://stenciljs.com/docs/config-extras
     */
    enableImportInjection: true,
    experimentalScopedSlotChanges: true,
    experimentalSlotFixes: true,
  },
  preamble: 'Built by Endavans\n© https://beeq.design - Apache 2 License.',
  watchIgnoredRegex: /(custom-elements\.)((d\.ts)|(json))$/g,
  devServer: {
    openBrowser: false,
    port: 8001,
    reloadStrategy: 'pageReload',
  },
};

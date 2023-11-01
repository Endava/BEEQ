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

export const config: Config = {
  namespace: 'bee-q',
  taskQueue: 'async',
  globalStyle: resolve(__dirname, './src/global/styles/default.scss').replace(/\\/g, '/'),
  plugins: [
    sass({
      includePaths: [
        resolve(__dirname, '../../node_modules').replace(/\\/g, '/'),
        resolve(__dirname, 'src/global/styles').replace(/\\/g, '/'),
      ],
      injectGlobalPaths: [
        resolve(__dirname, 'src/global/styles/mixins/index.scss').replace(/\\/g, '/'),
        resolve(__dirname, 'src/global/styles/variables/index.scss').replace(/\\/g, '/'),
      ],
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
    { type: 'docs-custom', generator: generateCustomElementsJson },
    { type: 'docs-vscode', file: 'custom-elements.json' },
    { type: 'dist', copy: [{ src: '../README.md' }] },
    { type: 'dist-hydrate-script', dir: 'dist/hydrate' },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
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
      componentCorePackage: '@bee-q/core',
      directivesProxyFile: resolve(__dirname, '../beeq-angular/src/directives/components.ts').replace(/\\/g, '/'),
      directivesArrayFile: resolve(__dirname, '../beeq-angular/src/directives/index.ts').replace(/\\/g, '/'),
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
    react({
      componentCorePackage: '@bee-q/core',
      proxiesFile: resolve(__dirname, '../beeq-react/src/components.ts').replace(/\\/g, '/'),
      includeDefineCustomElements: true,
    }),
    vue({
      componentCorePackage: '@bee-q/core',
      proxiesFile: resolve(__dirname, '../beeq-vue/src/components.ts').replace(/\\/g, '/'),
      componentModels: vueComponentModels,
    }),
  ],
  extras: {
    experimentalImportInjection: true,
    /**
     * Details:
     * https://stenciljs.com/docs/config-extras#experimentalslotfixes
     * https://discord.com/channels/520266681499779082/1108109881870925875/1143196247730176040
     */
    experimentalSlotFixes: true,
  },
  watchIgnoredRegex: /(custom-elements\.)((d\.ts)|(json))$/g,
  devServer: {
    openBrowser: false,
    port: 8001,
  },
};

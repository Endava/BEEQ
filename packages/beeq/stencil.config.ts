import { resolve } from 'path';

import { angularOutputTarget as angular } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { vueOutputTarget as vue } from '@stencil/vue-output-target';
import tailwind, { PluginConfigOpts, tailwindHMR } from 'stencil-tailwind-plugin';

import { angularValueAccessorBindings, generateCustomElementsJson, vueComponentModels } from './src/tools';
import tailwindConf from '../../tailwind.config';

const namespace = 'beeq';
const componentCorePackage = `@${namespace}/core`;
const customElementsDir = 'dist/components';
const resolvePath = (path: string) => resolve(__dirname, path).replace(/\\/g, '/');

const tailwindOpts: PluginConfigOpts = {
  postcss: resolvePath('../../postcss.config.js'),
  tailwindConf: tailwindConf,
  stripComments: true,
};

export const config: Config = {
  namespace,
  taskQueue: 'async',
  buildDist: true,
  enableCache: true,
  env: {
    BEEQ_ASSETS_BASE_PATH: process.env.BEEQ_ASSETS_BASE_PATH,
  },
  globalStyle: resolvePath('./src/global/styles/default.scss'),
  plugins: [
    sass({
      includePaths: [resolvePath('../../node_modules'), resolvePath('src/global/styles')],
      injectGlobalPaths: [resolvePath('src/global/styles/mixins/index.scss')],
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
        { src: '../README.md', dest: '../../README.md', warn: true },
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
      /* --------------------------- Angular output target -------------------------- */
      componentCorePackage,
      outputType: 'component', // Generate many component wrappers tied to a single Angular module (lazy/hydrated approach)
      directivesProxyFile: resolvePath('../beeq-angular/src/directives/components.ts'),
      directivesArrayFile: resolvePath('../beeq-angular/src/directives/index.ts'),
      valueAccessorConfigs: angularValueAccessorBindings,
      inlineProperties: true,
      customElementsDir,
    }),
    angular({
      /* -------------------- Angular Standalone output target -------------------- */
      componentCorePackage,
      outputType: 'standalone', // Generate a component with the standalone flag set to true.
      directivesProxyFile: resolvePath('../beeq-angular/standalone/src/directives/components.ts'),
      directivesArrayFile: resolvePath('../beeq-angular/standalone/src/directives/index.ts'),
      valueAccessorConfigs: angularValueAccessorBindings,
      customElementsDir,
    }),
    react({
      /* --------------------------- React output target -------------------------- */
      outDir: resolvePath('../beeq-react/src/'),
      customElementsDir,
    }),
    react({
      /* ------------------------- React SSR output target ------------------------ */
      outDir: resolvePath('../beeq-react/ssr'),
      hydrateModule: '@beeq/core/dist/hydrate',
      customElementsDir,
    }),
    vue({
      /* ---------------------------- Vue output target --------------------------- */
      componentCorePackage,
      proxiesFile: resolvePath('../beeq-vue/src/components.ts'),
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
  testing: {
    browserHeadless: 'shell',
  },
  preamble: 'Built by Endavans\n© https://beeq.design - Apache 2 License.',
  watchIgnoredRegex: /(custom-elements\.)((d\.ts)|(json))$/g,
  devServer: {
    openBrowser: false,
    port: 8001,
    reloadStrategy: 'pageReload',
  },
};

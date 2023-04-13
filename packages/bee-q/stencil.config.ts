import autoprefixer from 'autoprefixer';
import { resolve } from 'path';
import tailwind, { tailwindGlobal, tailwindHMR } from 'stencil-tailwind-plugin';
import tailwindcss from 'tailwindcss';

import { Config } from '@stencil/core';
import { angularOutputTarget as angular } from '@stencil/angular-output-target';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';

import { angularValueAccessorBindings, generateCustomElementsJson } from './src/tools';
import tailwindConf from '../../tailwind.config';

const tailwindOpts = {
  postcss: {
    plugins: [tailwindcss(), autoprefixer()],
  },
  stripComments: true,
  tailwindCssPath: resolve(__dirname, 'src/global/styles/tailwind.pcss').replace(/\\/g, '/'),
  tailwindConf: tailwindConf,
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
      injectGlobalPaths: [resolve(__dirname, 'src/global/styles/variables/index.scss').replace(/\\/g, '/')],
      outputStyle: 'compressed',
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true,
    }),
    tailwindGlobal(tailwindOpts),
    tailwind(tailwindOpts),
    tailwindHMR({
      tailwindConf: tailwindConf,
    }),
  ],
  outputTargets: [
    { type: 'docs-readme' },
    {
      type: 'dist-hydrate-script',
      dir: 'dist/hydrate',
    },
    {
      type: 'docs-custom',
      generator: generateCustomElementsJson,
    },
    {
      type: 'dist-custom-elements',
      customElementsExportBehavior: 'auto-define-custom-elements',
    },
    {
      type: 'docs-vscode',
      file: 'custom-elements.json',
    },
    {
      type: 'dist',
      copy: [{ src: '../README.md' }],
    },
    {
      type: 'www',
      copy: [
        { src: 'global/assets', dest: 'assets' },
        { src: 'global/scripts/esm-loader.js', dest: 'scripts/esm-loader.js' },
      ],
      serviceWorker: null, // disable service workers
    },
    angular({
      componentCorePackage: '@bee-q/core',
      directivesProxyFile: resolve(__dirname, '../bee-q-angular/src/directives/components.ts').replace(/\\/g, '/'),
      directivesArrayFile: resolve(__dirname, '../bee-q-angular/src/directives/index.ts').replace(/\\/g, '/'),
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
    react({
      componentCorePackage: '@bee-q/core',
      proxiesFile: resolve(__dirname, '../bee-q-react/src/components.ts').replace(/\\/g, '/'),
      includeDefineCustomElements: true,
    }),
  ],
  extras: {
    experimentalImportInjection: true,
  },
  watchIgnoredRegex: /(custom-elements\.)((d\.ts)|(json))$/g,
  devServer: {
    openBrowser: false,
    port: 8001,
  },
};

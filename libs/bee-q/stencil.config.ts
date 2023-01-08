import path from 'path';
import tailwindcss from 'tailwindcss';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { angularOutputTarget as angular } from '@stencil/angular-output-target';
import { angularValueAccessorBindings, generateCustomElementsJson } from './src/tools';

import tailwindConf from './tailwind.config.js';

export const config: Config = {
  namespace: 'bee-q',
  taskQueue: 'async',
  sourceMap: true,
  globalStyle: './src/global/styles/default.scss',
  testing: {
    browserArgs: ['--single-process'],
  },
  plugins: [
    sass({
      includePaths: [
        path.resolve(__dirname, '../../node_modules').replace(/\\/g, '/'),
        path.resolve(__dirname, 'src/global/styles').replace(/\\/g, '/'),
      ],
      injectGlobalPaths: [
        path.resolve(__dirname, 'src/global/styles/variables/index.scss').replace(/\\/g, '/'),
        path.resolve(__dirname, 'src/global/styles/mixins/index.scss').replace(/\\/g, '/'),
      ],
      outputStyle: 'compressed',
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true,
    }),
    tailwind({
      stripComments: true,
      tailwindCssPath: path.resolve(__dirname, 'src/global/styles/tailwind.pcss').replace(/\\/g, '/'),
      tailwindConf: tailwindConf,
      postcss: {
        plugins: [tailwindcss()],
      },
    }),
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
      autoDefineCustomElements: true,
      includeGlobalScripts: false,
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
      copy: [{ src: 'global/assets', dest: 'assets' }],
      serviceWorker: null, // disable service workers
    },
    angular({
      componentCorePackage: '@bee-q/core',
      directivesProxyFile: path
        .resolve(__dirname, '../../libs/bee-q-angular/src/directives/components.ts')
        .replace(/\\/g, '/'),
      directivesArrayFile: path
        .resolve(__dirname, '../../libs/bee-q-angular/src/directives/index.ts')
        .replace(/\\/g, '/'),
      valueAccessorConfigs: angularValueAccessorBindings,
    }),
    react({
      componentCorePackage: '@bee-q/core',
      proxiesFile: path.resolve(__dirname, '../../libs/bee-q-react/src/components.ts').replace(/\\/g, '/'),
      includeDefineCustomElements: true,
    }),
  ],
  extras: {
    experimentalImportInjection: true,
  },
  watchIgnoredRegex: /(custom-elements\.)((d\.ts)|(json))$/g,
  devServer: {
    port: 8001,
    openBrowser: false,
  },
};

import path from 'path';
import tailwindcss from 'tailwindcss';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { reactOutputTarget as react } from '@stencil/react-output-target';
import { generateCustomElementsJson } from './src/tools/generate-custom-elements-json';

import tailwindConf from './tailwind.config.js';

export const config: Config = {
  namespace: 'bee-q',
  taskQueue: 'async',
  sourceMap: true,
  globalStyle: './src/global/styles/default.scss',
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
    tailwindHMR(),
  ],
  outputTargets: [
    react({
      componentCorePackage: '@bee-q/core',
      proxiesFile: path.resolve(__dirname, '../../libs/bee-q-react/src/components.ts').replace(/\\/g, '/'),
      includeDefineCustomElements: true,
    }),
    { type: 'dist-custom-elements' },
    { type: 'docs-readme' },
    {
      type: 'docs-custom',
      generator: generateCustomElementsJson,
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
  ],
  watchIgnoredRegex: /(custom-elements\.)((d\.ts)|(json))$/g,
  devServer: {
    port: 8001,
    openBrowser: false,
  },
};

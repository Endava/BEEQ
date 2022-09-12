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
      outputStyle: 'compressed',
      sourceMap: true,
      sourceMapEmbed: true,
      sourceMapContents: true,
    }),
    tailwind({
      stripComments: true,
      tailwindCssPath: `${__dirname}/src/global/styles/tailwind.pcss`,
      tailwindConf: tailwindConf,
      postcss: {
        plugins: [tailwindcss()],
      },
    }),
    tailwindHMR(),
  ],
  outputTargets: [
    react({
      componentCorePackage: '@bee-q/chore',
      proxiesFile: `${__dirname}/../../libs/bee-q-react/src/components.ts`,
      includeDefineCustomElements: true,
    }),
    { type: 'dist' },
    { type: 'dist-custom-elements' },
    { type: 'docs-readme' },
    {
      type: 'docs-custom',
      generator: generateCustomElementsJson,
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

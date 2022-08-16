import tailwindcss from 'tailwindcss';
import tailwind, { tailwindHMR } from 'stencil-tailwind-plugin';
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

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
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};

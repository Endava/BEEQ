/* -------------------------------------------------------------------------- */
/*                 Custom Elements Manifest configuration file                */
/* -------------------------------------------------------------------------- */

/**
 * This file is a configuration file for the Custom Elements Manifest (CEM) tool.
 * It allows you to specify how your components are analyzed and what plugins are used.
 *
 * For more information on how to configure CEM, please visit:
 * https://custom-elements-manifest.open-wc.org/analyzer/
 */

import { expandTypesPlugin, getTsProgram } from 'cem-plugin-expanded-types';
import { customElementVsCodePlugin } from 'custom-element-vs-code-integration';

export default {
  /** Files to analyze */
  globs: ['packages/beeq/src/components/**/*.tsx'],
  /** Files to exclude */
  exclude: [
    'packages/beeq/src/components/**/*.types.tsx',
    'packages/beeq/src/components/**/_storybook/**/*',
    'packages/beeq/src/components/**/__test__/**/*',
  ],
  /** Directory to write the output to */
  outdir: 'packages/beeq/.cem',
  /** Run in dev mode, provides extra logging */
  dev: false,
  /** Enable special handling for Stencil.js compiler */
  stencil: true,
  /** Custom plugins to run */
  plugins: [
    expandTypesPlugin(),
    customElementVsCodePlugin({
      outdir: 'packages/beeq/.cem',
      htmlFileName: 'beeq.html-custom-data.json',
      cssFileName: 'beeq.css-custom-data.json',
      descriptionSrc: 'description',
    }),
  ],
  /** Overrides default module creation: */
  overrideModuleCreation: ({ ts, globs }) => {
    const program = getTsProgram(ts, globs, 'packages/beeq/tsconfig.lib.json');
    return program.getSourceFiles().filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
};

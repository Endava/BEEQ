/* -------------------------------------------------------------------------- */
/*                 Custom Elements Manifest configuration file                */
/* -------------------------------------------------------------------------- */

/**
 * This is the configuration file for the Custom Elements Manifest (CEM) tool.
 * It allows you to specify how your components are analyzed and what plugins are used.
 *
 * For more information on how to configure CEM, please visit:
 * https://custom-elements-manifest.open-wc.org/analyzer/
 */

import { customJSDocTagsPlugin } from 'cem-plugin-custom-jsdoc-tags';
import { expandTypesPlugin, getTsProgram } from 'cem-plugin-expanded-types';
import { jsdocExamplePlugin } from 'cem-plugin-jsdoc-example';
import { customElementVsCodePlugin } from 'custom-element-vs-code-integration';

const replace = (str, terms) => {
  terms.forEach(({ from, to }) => {
    str = str.replace(from, to);
  });
  return str;
};

const applyReplacements = (path, terms) => replace(path, terms);

/** Custom plugin to rename module paths in the custom-elements.json manifest */
const beeqCemModulePaths = {
  name: 'beeq-cem-module-paths',
  packageLinkPhase({ customElementsManifest }) {
    const terms = [
      // Rename `packages/beeq/src/` and intermediate directories to `components/`
      { from: /^packages\/beeq\/src\/components\/[^/]+\//, to: 'components/' },
      // Change the file extension to .js
      { from: /\.[tj]sx?$/, to: '.js' },
    ];

    customElementsManifest?.modules?.forEach((mod) => {
      mod.path = applyReplacements(mod.path, terms);

      mod.exports?.forEach((ex) => {
        ex.declaration.module = applyReplacements(ex.declaration.module, terms);
      });

      mod.declarations?.forEach((dec) => {
        if (dec.kind === 'class') {
          dec.members?.forEach((member) => {
            if (member.inheritedFrom) {
              member.inheritedFrom.module = applyReplacements(member.inheritedFrom.module, terms);
            }
          });
        }
      });
    });
  },
};

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
  outdir: 'packages/beeq/cem',
  /** Run in dev mode, provides extra logging */
  dev: false,
  /** Enable special handling for Stencil.js compiler */
  stencil: true,
  /** Custom plugins to run */
  plugins: [
    expandTypesPlugin(),
    jsdocExamplePlugin(),
    customJSDocTagsPlugin({
      tags: {
        dependency: {
          mappedName: 'dependencies',
          isArray: true,
        },
        part: {
          mappedName: 'csspart',
        },
      },
    }),
    customElementVsCodePlugin({
      outdir: 'packages/beeq/cem',
      htmlFileName: 'beeq.html-custom-data.json',
      cssFileName: null,
    }),
    beeqCemModulePaths,
  ],
  /** Overrides default module creation: */
  overrideModuleCreation: ({ ts, globs }) => {
    const program = getTsProgram(ts, globs, 'packages/beeq/tsconfig.lib.json');
    return program.getSourceFiles().filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
  },
};

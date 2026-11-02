#!/usr/bin/env node

import { mkdirSync, readFileSync, watch, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import * as sass from 'sass';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const workspaceRoot = resolve(projectRoot, '../..');
const sourceRoot = resolve(projectRoot, 'src/global/styles');
const outputRoot = resolve(workspaceRoot, 'dist/beeq/dist/beeq');
const optionalCssOutputRoot = resolve(outputRoot, 'css');
const injectedMixins = resolve(sourceRoot, 'mixins/index.scss');
const args = new Set(process.argv.slice(2));

const entries = [
  ['tokens.scss', 'tokens.css'],
  ['reset.scss', 'reset.css'],
  ['typography.scss', 'typography.css'],
];

const sassOptions = {
  loadPaths: [resolve(workspaceRoot, 'node_modules'), sourceRoot],
  silenceDeprecations: ['import'],
  style: 'compressed',
};

const compileSass = (source, { injectMixins = false } = {}) => {
  if (!injectMixins) {
    return sass.compile(source, sassOptions).css;
  }

  const sourceContent = readFileSync(source, 'utf8');
  const mixinsPath = injectedMixins.replaceAll('\\', '/');

  // Mirrors Stencil's injectGlobalPaths (`@use ... as *`) for standalone Sass builds.
  return sass.compileString(`@use '${mixinsPath}' as *;\n${sourceContent}`, {
    ...sassOptions,
    url: pathToFileURL(source),
  }).css;
};

const compileEntrypoints = () => {
  for (const [sourceFile, outputFile] of entries) {
    const source = resolve(sourceRoot, sourceFile);
    const output = resolve(optionalCssOutputRoot, outputFile);
    const css = compileSass(source);

    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, `${css}\n`);
    console.log(`Compiled ${sourceFile} -> ${outputFile}`);
  }
};

const compileStorybook = () => {
  const source = resolve(sourceRoot, 'default.scss');
  const output = resolve(projectRoot, '.storybook/assets/css/stories.css');
  const css = compileSass(source, { injectMixins: true });

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${css}\n`);
  console.log(`Compiled default.scss -> ${output}`);
};

const watchStorybook = () => {
  let timeout;

  const rebuild = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      try {
        compileStorybook();
      } catch (error) {
        console.error(error);
      }
    }, 100);
  };

  compileStorybook();
  console.log('Watching BEEQ sources for Storybook CSS changes...');

  watch(sourceRoot, { recursive: true }, rebuild);
};

if (args.has('--storybook')) {
  if (args.has('--watch')) {
    watchStorybook();
  } else {
    compileStorybook();
  }
} else {
  compileEntrypoints();
}

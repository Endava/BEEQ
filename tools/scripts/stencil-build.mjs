/**
 * Stencil build runner for the `beeq` package.
 *
 * Replaces the `@nxext/stencil:build` / `@nxext/stencil:serve` executors, which were
 * dropped because upstream v23 regressed output-target path handling (the `dist`
 * output target stopped emitting `beeq.css`, breaking the e2e suite).
 *
 * The Stencil CLI alone is not sufficient here: `@nxext/stencil` mutated the config
 * *after* `loadConfig()` had validated it, which the CLI cannot do. That post-load
 * mutation is what keeps the build emitting into `<workspaceRoot>/dist/beeq/…`
 * while `srcDir`, `tsconfig` and readme output stay anchored to `packages/beeq/`.
 *
 * Concretely this script reproduces the three things the executor did:
 *   1. Point `rootDir` + `packageJsonFilePath` at the dist directory, so Stencil
 *      validates the *published* manifest rather than the source one.
 *   2. Rewrite output-target path variables from the project root to the dist
 *      directory (`@nxext/stencil` v21 `calculateOutputTargetPathVariables`).
 *   3. Seed `dist/beeq/package.json` before the build so publishing works.
 *
 * Usage: node tools/scripts/stencil-build.mjs [--dev] [--prod] [--watch] [--serve] [--docs]
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseFlags, runTask } from '@stencil/core/cli';
import { loadConfig } from '@stencil/core/compiler';
import { createNodeLogger, createNodeSys } from '@stencil/core/sys/node';

/** Convert Windows backslash paths to slash paths, matching Stencil's own normalization. */
const normalizePath = (path) => path.replaceAll('\\', '/');

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const projectRoot = normalizePath(join(workspaceRoot, 'packages/beeq'));
const distDir = normalizePath(join(workspaceRoot, 'dist/beeq'));
const configPath = normalizePath(join(projectRoot, 'stencil.config.ts'));
const srcPkgJson = join(projectRoot, 'package.json');

/**
 * Output-target properties that hold a filesystem path. Any of these still pointing
 * inside the project root need to be redirected into the dist directory.
 */
const PATH_VARIABLES = [
  'dir',
  'appDir',
  'buildDir',
  'indexHtml',
  'esmDir',
  'systemDir',
  'systemLoaderFile',
  'file',
  'esmLoaderPath',
  'collectionDir',
  'typesDir',
  'legacyLoaderFile',
  'esmEs5Dir',
  'cjsDir',
  'cjsIndexFile',
  'esmIndexFile',
  'componentDts',
];

/**
 * Redirect output-target paths from `packages/beeq/…` to `dist/beeq/…`.
 *
 * Framework wrapper targets (`custom`) are skipped because they intentionally write
 * back into sibling packages, and `src`-suffixed paths are skipped so that the
 * `docs-readme` target keeps writing readmes next to their components.
 */
function redirectOutputTargetPaths(outputTargets) {
  return outputTargets.map((outputTarget) => {
    if (outputTarget.type === 'custom') return outputTarget;

    for (const pathVar of PATH_VARIABLES) {
      const original = outputTarget[pathVar];
      if (original == null || original.endsWith('src')) continue;

      outputTarget[pathVar] = original.replace(projectRoot, distDir);
    }
    return outputTarget;
  });
}

/** Seed `dist/beeq/package.json` so Stencil validates (and npm publishes) the real manifest. */
function prepareDistPackageJson() {
  mkdirSync(distDir, { recursive: true });
  if (!existsSync(srcPkgJson)) {
    throw new Error(`Expected a package.json at ${srcPkgJson}`);
  }
  copyFileSync(srcPkgJson, join(distDir, 'package.json'));
}

const logger = createNodeLogger();
const sys = createNodeSys({ process, logger });
sys.getCompilerExecutingPath ??= () => fileURLToPath(import.meta.resolve('@stencil/core/compiler'));

const flags = parseFlags(['build', ...process.argv.slice(2)]);
if (flags.ci) logger.enableColors(false);

const { config: loadedConfig, diagnostics } = await loadConfig({
  config: { flags, tsconfig: join(projectRoot, 'tsconfig.lib.json') },
  configPath,
  logger,
  sys,
});

if (diagnostics.some(({ level }) => level === 'error')) {
  logger.printDiagnostics(diagnostics);
  process.exit(1);
}

prepareDistPackageJson();

const config = {
  ...loadedConfig,
  flags,
  logger,
  sys,
  outputTargets: redirectOutputTargetPaths(loadedConfig.outputTargets ?? []),
  rootDir: distDir,
  packageJsonFilePath: normalizePath(join(distDir, 'package.json')),
};

if (config.devServer?.root) {
  config.devServer = { ...config.devServer, root: config.devServer.root.replace(projectRoot, distDir) };
}

globalThis.stencil ??= await sys.dynamicImport(sys.getCompilerExecutingPath());

await runTask(globalThis.stencil, config, config.flags.task);

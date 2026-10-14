/**
 * Bumps every publishable package to the next `X.Y.Z-beta.N` version.
 *
 * `X.Y.Z` is the version `nx release` would pick for the next stable release (git tags and
 * conventional commits). `N` is the next free beta number on npm, because betas are never tagged in git.
 * Nothing is committed or tagged: the manifests are updated in the working tree only.
 *
 * Usage: node tools/scripts/beta-release.mjs [--dry-run]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const workspaceRoot = path.resolve(import.meta.dirname, '../..');
const nxJsonPath = path.join(workspaceRoot, 'nx.json');
const dryRun = process.argv.includes('--dry-run');
const PREID = 'beta';
const CORE_PACKAGE = '@beeq/core';

const run = (command, args) =>
  execFileSync(command, args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0', NX_TUI: 'false' },
    stdio: ['ignore', 'pipe', 'inherit'],
  });

const getPublishedVersions = () => {
  try {
    const output = run('npm', ['view', CORE_PACKAGE, 'versions', '--json']).trim();
    const versions = output ? JSON.parse(output) : [];

    return Array.isArray(versions) ? versions : [versions];
  } catch (error) {
    // A package that was never published has no versions yet
    if (String(error.stderr ?? error.message).includes('E404')) return [];
    throw error;
  }
};

const nextBetaNumber = (baseVersion, publishedVersions) => {
  const pattern = new RegExp(`^${baseVersion.replaceAll('.', '\\.')}-${PREID}\\.(\\d+)$`);
  const numbers = publishedVersions
    .map((version) => pattern.exec(version)?.[1])
    .filter(Boolean)
    .map(Number);

  return numbers.length ? Math.max(...numbers) + 1 : 0;
};

const originalNxJson = fs.readFileSync(nxJsonPath, 'utf8');

// `nx release version` rejects the top-level `release.git` setting that the manual `nx release` flow needs,
// so the git options are moved to `release.version.git` (disabled) for this run only.
const patchNxJson = () => {
  const config = JSON.parse(originalNxJson);
  delete config.release.git;
  config.release.version = { ...config.release.version, git: { commit: false, tag: false, stageChanges: false } };
  fs.writeFileSync(nxJsonPath, `${JSON.stringify(config, null, 2)}\n`);
};

try {
  patchNxJson();

  const preview = run('pnpm', ['exec', 'nx', 'release', 'version', '--preid', PREID, '--dry-run']);
  const baseVersion = /new version (\d+\.\d+\.\d+)-beta\.0\b/.exec(preview)?.[1];
  if (!baseVersion) {
    throw new Error(
      `Nx did not resolve a "${PREID}" version. There are probably no releasable commits since the last release tag.\n${preview}`,
    );
  }

  const betaNumber = nextBetaNumber(baseVersion, getPublishedVersions());
  const version = `${baseVersion}-${PREID}.${betaNumber}`;

  const versionArgs = ['exec', 'nx', 'release', 'version', version, ...(dryRun ? ['--dry-run'] : [])];
  console.log(run('pnpm', versionArgs));
  console.log(`Beta version: ${version}${dryRun ? ' (dry run)' : ''}`);

  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
} finally {
  fs.writeFileSync(nxJsonPath, originalNxJson);
}

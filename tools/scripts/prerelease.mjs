/**
 * Bumps every publishable package to the next `X.Y.Z-<preid>.N` prerelease version.
 *
 * `X.Y.Z` is the version `nx release` would pick for the next stable release (git tags and
 * conventional commits), and it must be newer than every stable version on npm.
 * `N` is the next free number for that preid on npm, because prereleases are never tagged in git.
 * Nothing is committed or tagged: the manifests are updated in the working tree only.
 * Internal dependencies are pinned exactly for prereleases; stable release ranges are unchanged.
 *
 * Usage: node tools/scripts/prerelease.mjs --preid <beta|preview> [--dry-run]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';

const PREIDS = ['beta', 'preview'];
const USAGE = `Usage: node tools/scripts/prerelease.mjs --preid <${PREIDS.join('|')}> [--dry-run]`;
const CORE_PACKAGE = '@beeq/core';

const parseCliArgs = () => {
  try {
    return parseArgs({
      options: {
        preid: { type: 'string' },
        'dry-run': { type: 'boolean', default: false },
      },
    }).values;
  } catch (error) {
    console.error(`${error.message}\n${USAGE}`);
    process.exit(1);
  }
};

const { preid: PREID, 'dry-run': dryRun } = parseCliArgs();

if (!PREIDS.includes(PREID)) {
  console.error(USAGE);
  process.exit(1);
}

const workspaceRoot = path.resolve(import.meta.dirname, '../..');
const nxJsonPath = path.join(workspaceRoot, 'nx.json');

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

const nextPrereleaseNumber = (baseVersion, publishedVersions) => {
  const escapedBase = baseVersion.replaceAll('.', String.raw`\.`);
  const pattern = new RegExp(String.raw`^${escapedBase}-${PREID}\.(\d+)$`);
  const numbers = publishedVersions
    .map((version) => pattern.exec(version)?.[1])
    .filter(Boolean)
    .map(Number);

  return numbers.length ? Math.max(...numbers) + 1 : 0;
};

const STABLE_VERSION = /^(\d+)\.(\d+)\.(\d+)$/;

const compareStableVersions = (a, b) => {
  const [aParts, bParts] = [a, b].map((version) => STABLE_VERSION.exec(version).slice(1).map(Number));
  return aParts.reduce((result, part, index) => result || part - bParts[index], 0);
};

const latestStableVersion = (publishedVersions) =>
  publishedVersions
    .filter((version) => STABLE_VERSION.test(version))
    .sort(compareStableVersions)
    .at(-1);

const originalNxJson = fs.readFileSync(nxJsonPath, 'utf8');

// `nx release version` rejects the top-level `release.git` setting that the manual `nx release` flow needs,
// so the git options are moved to `release.version.git` (disabled) for this run only.
const patchNxJson = () => {
  const config = JSON.parse(originalNxJson);
  delete config.release.git;
  config.release.version = {
    ...config.release.version,
    versionPrefix: '',
    git: { commit: false, tag: false, stageChanges: false },
  };
  fs.writeFileSync(nxJsonPath, `${JSON.stringify(config, null, 2)}\n`);
};

try {
  patchNxJson();

  const plan = run('pnpm', ['exec', 'nx', 'release', 'version', '--preid', PREID, '--dry-run']);
  const baseVersion = new RegExp(String.raw`new version (\d+\.\d+\.\d+)-${PREID}\.0\b`).exec(plan)?.[1];
  if (!baseVersion) {
    throw new Error(
      `Nx did not resolve a "${PREID}" version. There are probably no releasable commits since the last release tag.\n${plan}`,
    );
  }

  const publishedVersions = getPublishedVersions();
  const latestStable = latestStableVersion(publishedVersions);
  // A branch without the latest release tag would publish a prerelease that sorts below that release
  if (latestStable && compareStableVersions(baseVersion, latestStable) <= 0) {
    throw new Error(
      `${baseVersion} is not newer than the latest release ${latestStable}. Merge main into the branch and run again.`,
    );
  }

  const prereleaseNumber = nextPrereleaseNumber(baseVersion, publishedVersions);
  const version = `${baseVersion}-${PREID}.${prereleaseNumber}`;

  const versionArgs = ['exec', 'nx', 'release', 'version', version, ...(dryRun ? ['--dry-run'] : [])];
  console.log(run('pnpm', versionArgs));
  console.log(`${PREID} version: ${version}${dryRun ? ' (dry run)' : ''}`);

  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${version}\n`);
} finally {
  fs.writeFileSync(nxJsonPath, originalNxJson);
}

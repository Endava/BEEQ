import { spawnSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  execFileSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  appendFileSync: vi.fn(),
}));

vi.mock('node:child_process', async (importOriginal) => ({
  ...(await importOriginal<typeof import('node:child_process')>()),
  execFileSync: mocks.execFileSync,
}));

vi.mock('node:fs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, default: { ...actual.default, ...mocks } };
});

const originalConfig = `${JSON.stringify({
  release: {
    git: { commit: true, tag: true, stageChanges: true },
    version: { conventionalCommits: true, preserveMatchingDependencyRanges: false, versionPrefix: '^' },
  },
})}\n\n`;
const scriptPath = resolve(import.meta.dirname, '../../scripts/prerelease.mjs');
const workspaceRoot = resolve(import.meta.dirname, '../../..');

describe('prerelease script', () => {
  const originalArgv = process.argv;
  let currentConfig: string;

  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();
    process.argv = [process.execPath, scriptPath, '--preid', 'beta'];
    vi.stubEnv('GITHUB_OUTPUT', '');
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    currentConfig = originalConfig;
    mocks.readFileSync.mockImplementation(() => currentConfig);
    mocks.writeFileSync.mockImplementation((_path, content) => {
      currentConfig = content;
    });
    mocks.execFileSync
      .mockReturnValueOnce('new version 1.18.0-beta.0')
      .mockReturnValueOnce('["1.17.1", "1.18.0-beta.2"]')
      .mockReturnValueOnce('Versioned packages');
  });

  afterEach(() => {
    process.argv = originalArgv;
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  const runScript = () => import(/* @vite-ignore */ scriptPath);

  it.each(['beta', 'preview'])(
    'uses exact internal versions for %s and restores the original config',
    async (preid) => {
      process.argv = [process.execPath, scriptPath, '--preid', preid];
      vi.stubEnv('GITHUB_OUTPUT', '/test/github-output');
      mocks.execFileSync.mockReset().mockImplementation((command, args) => {
        const config = JSON.parse(currentConfig);
        expect(config.release.git).toBeUndefined();
        expect(config.release.version).toEqual({
          conventionalCommits: true,
          preserveMatchingDependencyRanges: false,
          versionPrefix: '',
          git: { commit: false, tag: false, stageChanges: false },
        });
        if (command === 'npm') return JSON.stringify(['1.17.1', `1.18.0-${preid}.2`]);
        return args.includes('--preid') ? `new version 1.18.0-${preid}.0` : 'Versioned packages';
      });

      await runScript();

      expect(mocks.execFileSync.mock.calls.map(([command, args]) => [command, args])).toEqual([
        ['pnpm', ['exec', 'nx', 'release', 'version', '--preid', preid, '--dry-run']],
        ['npm', ['view', '@beeq/core', 'versions', '--json']],
        ['pnpm', ['exec', 'nx', 'release', 'version', `1.18.0-${preid}.3`]],
      ]);
      expect(mocks.appendFileSync).toHaveBeenCalledWith('/test/github-output', `version=1.18.0-${preid}.3\n`);
      expect(currentConfig).toBe(originalConfig);
    },
  );

  it('passes dry-run through to final versioning and restores the config', async () => {
    process.argv.push('--dry-run');

    await runScript();

    expect(mocks.execFileSync.mock.calls[2][1]).toEqual([
      'exec',
      'nx',
      'release',
      'version',
      '1.18.0-beta.3',
      '--dry-run',
    ]);
    expect(console.log).toHaveBeenCalledWith('beta version: 1.18.0-beta.3 (dry run)');
    expect(currentConfig).toBe(originalConfig);
  });

  it.each([
    { step: 'Nx planning', failAt: 0, message: 'planning failed' },
    { step: 'registry lookup', failAt: 1, message: 'registry unavailable' },
    { step: 'Nx versioning', failAt: 2, message: 'versioning failed' },
  ])('restores the original config when $step fails', async ({ failAt, message }) => {
    mocks.execFileSync.mockReset().mockImplementation(() => {
      if (mocks.execFileSync.mock.calls.length === failAt + 1) throw new Error(message);
      return failAt === 2 && mocks.execFileSync.mock.calls.length === 2 ? '["1.17.1"]' : 'new version 1.18.0-beta.0';
    });

    await expect(runScript()).rejects.toThrow(message);

    expect(currentConfig).toBe(originalConfig);
    expect(mocks.execFileSync).toHaveBeenCalledTimes(failAt + 1);
    expect(mocks.appendFileSync).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it.each([
    {
      step: 'unparseable plan',
      plan: 'No releasable commits',
      versions: '[]',
      message: 'Nx did not resolve',
      calls: 1,
    },
    {
      step: 'stale base version',
      plan: 'new version 1.18.0-beta.0',
      versions: '["1.18.0"]',
      message: 'not newer than the latest release',
      calls: 2,
    },
  ])('restores the original config after rejecting a $step', async ({ plan, versions, message, calls }) => {
    mocks.execFileSync.mockReset().mockReturnValueOnce(plan).mockReturnValueOnce(versions);

    await expect(runScript()).rejects.toThrow(message);

    expect(currentConfig).toBe(originalConfig);
    expect(mocks.execFileSync).toHaveBeenCalledTimes(calls);
    expect(mocks.appendFileSync).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
  });

  it('restores the config and propagates an output-write failure', async () => {
    vi.stubEnv('GITHUB_OUTPUT', '/test/github-output');
    mocks.appendFileSync.mockImplementation(() => {
      throw new Error('output unavailable');
    });

    await expect(runScript()).rejects.toThrow('output unavailable');

    expect(currentConfig).toBe(originalConfig);
  });

  it.each([[], ['--preid', 'latest']])('rejects invalid arguments before changing config: %j', async (...args) => {
    process.argv = [process.execPath, scriptPath, ...args.flat()];
    vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('exit');
    });

    await expect(runScript()).rejects.toThrow('exit');

    expect(process.exit).toHaveBeenCalledWith(1);
    expect(mocks.writeFileSync).not.toHaveBeenCalled();
    expect(mocks.execFileSync).not.toHaveBeenCalled();
  });
});

describe('installed Nx dependency versioning', () => {
  const require = createRequire(import.meta.url);
  const nxCli = join(require.resolve('nx/package.json'), '../dist/bin/nx.js');
  const dependencyTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  let root: string;

  beforeEach(async () => {
    root = await mkdtemp(join(tmpdir(), 'beeq-prerelease-'));
    await symlink(join(workspaceRoot, 'node_modules'), join(root, 'node_modules'), 'dir');
    await mkdir(join(root, 'packages/core'), { recursive: true });
    await mkdir(join(root, 'packages/wrapper'), { recursive: true });
    await writeFile(join(root, 'package.json'), JSON.stringify({ private: true, workspaces: ['packages/*'] }));
    await writeFile(
      join(root, 'packages/core/package.json'),
      JSON.stringify({ name: '@beeq/core', version: '1.17.1' }),
    );
    await writeFile(
      join(root, 'packages/wrapper/package.json'),
      JSON.stringify({
        name: '@beeq/react',
        version: '1.17.1',
        ...Object.fromEntries(
          dependencyTypes.map((type) => [type, { '@beeq/core': '^1.17.1', 'external-control': '^2.0.0' }]),
        ),
      }),
    );
  });

  afterEach(async () => {
    await rm(root, { recursive: true, force: true });
  });

  it.each([
    { version: '1.18.0-beta.0', prefix: '' },
    { version: '1.18.0-preview.1', prefix: '' },
    { version: '1.18.0', prefix: '^' },
  ])(
    'writes $prefix$version for internal dependencies only',
    async ({ version, prefix }) => {
      await writeFile(
        join(root, 'nx.json'),
        JSON.stringify({
          release: {
            projects: ['@beeq/core', '@beeq/react'],
            version: {
              versionPrefix: prefix,
              preserveMatchingDependencyRanges: false,
              currentVersionResolver: 'disk',
              versionActionsOptions: { skipLockFileUpdate: true },
              git: { commit: false, tag: false, stageChanges: false },
            },
          },
        }),
      );
      const wrapperPath = join(root, 'packages/wrapper/package.json');
      const corePath = join(root, 'packages/core/package.json');
      const before = await Promise.all([readFile(corePath, 'utf8'), readFile(wrapperPath, 'utf8')]);
      const runNx = (args: string[]) =>
        spawnSync(process.execPath, [nxCli, 'release', 'version', version, ...args], {
          cwd: root,
          encoding: 'utf8',
          timeout: 30_000,
          env: {
            ...process.env,
            NX_DAEMON: 'false',
            NX_NO_CLOUD: 'true',
            NX_TUI: 'false',
            NX_ISOLATE_PLUGINS: 'false',
          },
        });

      const dryRun = runNx(['--dry-run']);
      expect(dryRun.error).toBeUndefined();
      expect(dryRun.status, dryRun.stdout + dryRun.stderr).toBe(0);
      expect(await Promise.all([readFile(corePath, 'utf8'), readFile(wrapperPath, 'utf8')])).toEqual(before);

      const result = runNx([]);
      expect(result.error).toBeUndefined();
      expect(result.status, result.stdout + result.stderr).toBe(0);
      const wrapper = JSON.parse(await readFile(wrapperPath, 'utf8'));
      expect(wrapper.version).toBe(version);
      expect(JSON.parse(await readFile(corePath, 'utf8')).version).toBe(version);
      for (const type of dependencyTypes) {
        expect(wrapper[type]).toEqual({ '@beeq/core': `${prefix}${version}`, 'external-control': '^2.0.0' });
      }
    },
    60_000,
  );

  it('prevents a beta dependency from selecting a preview release', () => {
    const { satisfies }: { satisfies: (version: string, range: string) => boolean } = createRequire(
      require.resolve('@nx/js/package.json'),
    )('semver');
    expect(satisfies('1.18.0-preview.1', '^1.18.0-beta.0')).toBe(true);
    expect(satisfies('1.18.0-preview.1', '1.18.0-beta.0')).toBe(false);
  });
});

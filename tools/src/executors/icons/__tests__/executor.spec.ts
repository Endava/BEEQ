import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  buildArchiveUrl,
  buildFingerprintKey,
  computeIconsHash,
  deriveFileName,
  isTargetIconEntry,
  isUpToDate,
  listSvgFiles,
  normalizeOptions,
  normalizeRefForFolder,
  PINNED_CHECKSUM_HINT,
  repoNameFromUrl,
  toPosix,
  writeMetadata,
} from '../lib';
import type { IconsExecutorSchema } from '../schema';

// -------------------------------------------------------------------------- //
//                                   Fixtures                                 //
// -------------------------------------------------------------------------- //

const COMMIT_SHA = '2b75f3ad12b420c9504ef05df8d2564a28f8500e';

const baseCommitOptions: IconsExecutorSchema = {
  assetsFolder: 'assets',
  downloadPath: 'tmp',
  extractToPath: 'svg-out',
  sourceRef: COMMIT_SHA,
  sourceRefType: 'commit',
  sourceUrl: 'https://github.com/phosphor-icons/core',
};

const makeContext = (root: string) => ({ root });

// -------------------------------------------------------------------------- //
//                            URL / ref derivation                            //
// -------------------------------------------------------------------------- //

describe('repoNameFromUrl()', () => {
  it('extracts the last non-empty path segment', () => {
    expect(repoNameFromUrl('https://github.com/phosphor-icons/core')).toBe('core');
    expect(repoNameFromUrl('https://github.com/phosphor-icons/core/')).toBe('core');
  });

  it('strips the .git suffix', () => {
    expect(repoNameFromUrl('git@github.com:phosphor-icons/core.git')).toBe('core');
  });

  it('returns the host label when only a host is given', () => {
    expect(repoNameFromUrl('https://github.com')).toBe('github.com');
  });
});

describe('normalizeRefForFolder()', () => {
  it('strips a leading v for tags', () => {
    expect(normalizeRefForFolder('v2.0.8', 'tag')).toBe('2.0.8');
    expect(normalizeRefForFolder('2.0.8', 'tag')).toBe('2.0.8');
  });

  it('replaces slashes with dashes for branches', () => {
    expect(normalizeRefForFolder('release/1.x', 'branch')).toBe('release-1.x');
  });

  it('lowercases commit SHAs', () => {
    expect(normalizeRefForFolder('ABCDEF1234', 'commit')).toBe('abcdef1234');
  });
});

describe('buildArchiveUrl()', () => {
  const url = 'https://github.com/phosphor-icons/core';
  it('builds a commit archive URL', () => {
    expect(buildArchiveUrl(url, COMMIT_SHA, 'commit')).toBe(`${url}/archive/${COMMIT_SHA}.zip`);
  });
  it('builds a tag archive URL', () => {
    expect(buildArchiveUrl(url, 'v2.0.8', 'tag')).toBe(`${url}/archive/refs/tags/v2.0.8.zip`);
  });
  it('builds a branch archive URL', () => {
    expect(buildArchiveUrl(url, 'main', 'branch')).toBe(`${url}/archive/refs/heads/main.zip`);
  });
  it('strips trailing slashes on the base URL', () => {
    expect(buildArchiveUrl(`${url}///`, 'main', 'branch')).toBe(`${url}/archive/refs/heads/main.zip`);
  });
});

describe('deriveFileName()', () => {
  it('uses a short SHA for commits', () => {
    expect(deriveFileName(COMMIT_SHA, 'commit')).toBe(`${COMMIT_SHA.slice(0, 12)}.zip`);
  });
  it('sanitizes ref characters', () => {
    expect(deriveFileName('release/1.x', 'branch')).toBe('release-1.x.zip');
    expect(deriveFileName('v2.0.8', 'tag')).toBe('v2.0.8.zip');
  });
});

// -------------------------------------------------------------------------- //
//                             normalizeOptions()                             //
// -------------------------------------------------------------------------- //

describe('normalizeOptions()', () => {
  it('derives archiveUrl, fileName and svgFolder for commit refs', () => {
    const result = normalizeOptions(baseCommitOptions, makeContext('/workspace'));
    expect(result.archiveUrl).toBe(`https://github.com/phosphor-icons/core/archive/${COMMIT_SHA}.zip`);
    expect(result.fileName).toBe(`${COMMIT_SHA.slice(0, 12)}.zip`);
    expect(result.svgFolder).toBe(`core-${COMMIT_SHA}`);
    expect(result.sourceRefType).toBe('commit');
  });

  it('derives archiveUrl and svgFolder for tag refs and strips leading v', () => {
    const result = normalizeOptions(
      { ...baseCommitOptions, sourceRef: 'v2.0.8', sourceRefType: 'tag' },
      makeContext('/w'),
    );
    expect(result.archiveUrl).toBe('https://github.com/phosphor-icons/core/archive/refs/tags/v2.0.8.zip');
    expect(result.svgFolder).toBe('core-2.0.8');
    expect(result.fileName).toBe('v2.0.8.zip');
  });

  it('derives archiveUrl for branch refs', () => {
    const result = normalizeOptions(
      { ...baseCommitOptions, sourceRef: 'main', sourceRefType: 'branch' },
      makeContext('/w'),
    );
    expect(result.archiveUrl).toBe('https://github.com/phosphor-icons/core/archive/refs/heads/main.zip');
    expect(result.svgFolder).toBe('core-main');
  });

  it('honors explicit fileName and svgFolder overrides', () => {
    const result = normalizeOptions(
      { ...baseCommitOptions, fileName: 'custom.zip', svgFolder: 'custom-root' },
      makeContext('/w'),
    );
    expect(result.fileName).toBe('custom.zip');
    expect(result.svgFolder).toBe('custom-root');
  });

  it('rejects invalid commit SHA shape', () => {
    expect(() => normalizeOptions({ ...baseCommitOptions, sourceRef: 'not-a-sha' }, makeContext('/w'))).toThrow(
      /sourceRef/,
    );
  });

  it('accepts non-SHA refs when sourceRefType is tag or branch', () => {
    expect(() =>
      normalizeOptions({ ...baseCommitOptions, sourceRef: 'v2.0.8', sourceRefType: 'tag' }, makeContext('/w')),
    ).not.toThrow();
  });

  it('rejects invalid sourceRefType', () => {
    expect(() =>
      normalizeOptions({ ...baseCommitOptions, sourceRefType: 'bogus' as never }, makeContext('/w')),
    ).toThrow(/sourceRefType/);
  });

  it('rejects invalid checksum pattern', () => {
    expect(() =>
      normalizeOptions({ ...baseCommitOptions, sourceChecksum: 'not-a-checksum' }, makeContext('/w')),
    ).toThrow(/sourceChecksum/);
  });

  it('rejects minSvgCount < 1', () => {
    expect(() => normalizeOptions({ ...baseCommitOptions, minSvgCount: 0 }, makeContext('/w'))).toThrow(/minSvgCount/);
  });
});

// -------------------------------------------------------------------------- //
//                                   toPosix()                                //
// -------------------------------------------------------------------------- //

describe('toPosix()', () => {
  it('normalizes backslashes to forward slashes', () => {
    expect(toPosix('core-2.1.0\\assets\\regular\\check.svg')).toBe('core-2.1.0/assets/regular/check.svg');
  });

  it('leaves posix paths intact', () => {
    expect(toPosix('a/b/c.svg')).toBe('a/b/c.svg');
  });

  it('collapses mixed separators', () => {
    expect(toPosix('a\\b/c\\\\d.svg')).toBe('a/b/c/d.svg');
  });
});

// -------------------------------------------------------------------------- //
//                             isTargetIconEntry()                            //
// -------------------------------------------------------------------------- //

describe('isTargetIconEntry()', () => {
  const prefix = `core-${COMMIT_SHA}/assets`;

  it('accepts svg files under any weight subfolder', () => {
    expect(isTargetIconEntry(`${prefix}/regular/check.svg`, 'file', prefix)).toBe(true);
    expect(isTargetIconEntry(`${prefix}/thin/check-thin.svg`, 'file', prefix)).toBe(true);
    expect(isTargetIconEntry(`${prefix}/bold/check-bold.svg`, 'file', prefix)).toBe(true);
    expect(isTargetIconEntry(`${prefix}/duotone/check-duotone.svg`, 'file', prefix)).toBe(true);
  });

  it('accepts windows-style paths', () => {
    expect(isTargetIconEntry(prefix.replace(/\//g, '\\') + '\\regular\\check.svg', 'file', prefix)).toBe(true);
  });

  it('rejects paths outside the assets folder', () => {
    expect(isTargetIconEntry(`core-${COMMIT_SHA}/README.md`, 'file', prefix)).toBe(false);
    expect(isTargetIconEntry(`core-${COMMIT_SHA}/src/index.ts`, 'file', prefix)).toBe(false);
  });

  it('rejects directories', () => {
    expect(isTargetIconEntry(`${prefix}/regular/`, 'directory', prefix)).toBe(false);
  });

  it('rejects non-svg files under assets', () => {
    expect(isTargetIconEntry(`${prefix}/regular/readme.md`, 'file', prefix)).toBe(false);
  });
});

// -------------------------------------------------------------------------- //
//                            buildFingerprintKey()                           //
// -------------------------------------------------------------------------- //

describe('buildFingerprintKey()', () => {
  const fp = {
    assetsFolder: 'assets',
    fileName: 'v.zip',
    sourceRef: COMMIT_SHA,
    sourceRefType: 'commit' as const,
    sourceUrl: 'https://x',
    svgFolder: `core-${COMMIT_SHA}`,
  };

  it('is stable regardless of property order', () => {
    const a = buildFingerprintKey(fp);
    const b = buildFingerprintKey({
      svgFolder: fp.svgFolder,
      sourceUrl: fp.sourceUrl,
      sourceRefType: fp.sourceRefType,
      sourceRef: fp.sourceRef,
      fileName: fp.fileName,
      assetsFolder: fp.assetsFolder,
    });
    expect(a).toBe(b);
  });

  it('changes when sourceRef changes', () => {
    const base = buildFingerprintKey(fp);
    const bumped = buildFingerprintKey({ ...fp, sourceRef: 'abcdef1234567890abcdef1234567890abcdef12' });
    expect(base).not.toBe(bumped);
  });

  it('changes when sourceRefType changes', () => {
    const base = buildFingerprintKey(fp);
    const withTag = buildFingerprintKey({ ...fp, sourceRefType: 'tag' });
    expect(base).not.toBe(withTag);
  });
});

// -------------------------------------------------------------------------- //
//                       isUpToDate() + metadata roundtrip                    //
// -------------------------------------------------------------------------- //

describe('isUpToDate() with real filesystem', () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await mkdtemp(join(tmpdir(), 'icons-executor-test-'));
  });

  afterEach(async () => {
    await rm(workDir, { recursive: true, force: true });
  });

  const seedIcons = async (dir: string, files: Record<string, string>) => {
    for (const [name, content] of Object.entries(files)) {
      await writeFile(join(dir, name), content, 'utf8');
    }
  };

  const expected = {
    assetsFolder: 'assets',
    fileName: `${COMMIT_SHA.slice(0, 12)}.zip`,
    sourceRef: COMMIT_SHA,
    sourceRefType: 'commit' as const,
    sourceUrl: 'https://github.com/phosphor-icons/core',
    svgFolder: `core-${COMMIT_SHA}`,
  };

  const seedMetadata = async (dir: string, iconsHash: string, iconCount: number, checksum = 'sha256-abc') => {
    await writeMetadata(join(dir, '.icons-meta.json'), {
      ...expected,
      iconCount,
      iconsHash,
      generatedAt: new Date().toISOString(),
      observedChecksum: checksum,
    });
  };

  it('returns true when metadata + files match', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />', 'close.svg': '<svg />' });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    await seedMetadata(workDir, iconsHash, files.length);
    await expect(
      isUpToDate({
        expected,
        extractToPath: workDir,
        metadataFilePath: join(workDir, '.icons-meta.json'),
        minSvgCount: 1,
      }),
    ).resolves.toBe(true);
  });

  it('returns false when no metadata exists', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />' });
    await expect(
      isUpToDate({
        expected,
        extractToPath: workDir,
        metadataFilePath: join(workDir, '.icons-meta.json'),
        minSvgCount: 1,
      }),
    ).resolves.toBe(false);
  });

  it('returns false when a file content changes after metadata was written', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />' });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    await seedMetadata(workDir, iconsHash, files.length);
    await writeFile(join(workDir, 'check.svg'), '<svg data-tampered />', 'utf8');
    await expect(
      isUpToDate({
        expected,
        extractToPath: workDir,
        metadataFilePath: join(workDir, '.icons-meta.json'),
        minSvgCount: 1,
      }),
    ).resolves.toBe(false);
  });

  it('returns false when source ref changes', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />' });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    await seedMetadata(workDir, iconsHash, files.length);
    await expect(
      isUpToDate({
        expected: { ...expected, sourceRef: 'abcdef1234567890abcdef1234567890abcdef12' },
        extractToPath: workDir,
        metadataFilePath: join(workDir, '.icons-meta.json'),
        minSvgCount: 1,
      }),
    ).resolves.toBe(false);
  });

  it('returns false when sourceRefType changes even with same ref', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />' });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    await seedMetadata(workDir, iconsHash, files.length);
    await expect(
      isUpToDate({
        expected: { ...expected, sourceRefType: 'tag' },
        extractToPath: workDir,
        metadataFilePath: join(workDir, '.icons-meta.json'),
        minSvgCount: 1,
      }),
    ).resolves.toBe(false);
  });

  it('returns false when icon count falls below minimum', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />' });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    await seedMetadata(workDir, iconsHash, files.length);
    await expect(
      isUpToDate({
        expected,
        extractToPath: workDir,
        metadataFilePath: join(workDir, '.icons-meta.json'),
        minSvgCount: 10,
      }),
    ).resolves.toBe(false);
  });
});

// -------------------------------------------------------------------------- //
//                     runExecutor() — orchestration flow                     //
// -------------------------------------------------------------------------- //

describe('runExecutor() orchestration', () => {
  let workDir: string;

  beforeEach(async () => {
    workDir = await mkdtemp(join(tmpdir(), 'icons-executor-run-'));
    vi.resetModules();
  });

  afterEach(async () => {
    await rm(workDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  const runOptions = (): IconsExecutorSchema => ({ ...baseCommitOptions });

  it('short-circuits when cache is valid', async () => {
    vi.doMock('../lib/download', () => ({
      downloadArchive: vi.fn(() => {
        throw new Error('downloadArchive should not be called on cache hit');
      }),
    }));
    vi.doMock('../lib/extract', async () => {
      const actual = await vi.importActual<typeof import('../lib/extract')>('../lib/extract');
      return {
        ...actual,
        extractIcons: vi.fn(() => {
          throw new Error('extractIcons should not be called on cache hit');
        }),
      };
    });

    const { computeIconsHash: hash, listSvgFiles: list, writeMetadata: write } = await import('../lib/metadata');
    const outDir = join(workDir, 'svg-out');
    await mkdir(outDir, { recursive: true });
    await writeFile(join(outDir, 'check.svg'), '<svg />', 'utf8');
    const files = await list(outDir);
    const iconsHash = await hash(outDir, files);
    await write(join(outDir, '.icons-meta.json'), {
      assetsFolder: 'assets',
      fileName: `${COMMIT_SHA.slice(0, 12)}.zip`,
      sourceRef: COMMIT_SHA,
      sourceRefType: 'commit',
      sourceUrl: 'https://github.com/phosphor-icons/core',
      svgFolder: `core-${COMMIT_SHA}`,
      iconCount: files.length,
      iconsHash,
      generatedAt: new Date().toISOString(),
      observedChecksum: 'sha256-abc',
    });

    const runExecutor = (await import('../executor')).default;
    const result = await runExecutor(runOptions(), makeContext(workDir) as never);
    expect(result).toEqual({ success: true });
  });

  it('returns { success: false } on normalization error', async () => {
    const runExecutor = (await import('../executor')).default;
    const result = await runExecutor({ ...runOptions(), sourceRef: '' }, makeContext(workDir) as never);
    expect(result).toEqual({ success: false });
  });

  it('captures observedChecksum + hint in metadata when no sourceChecksum pinned', async () => {
    const fakeZip = Buffer.from('fake-zip-payload');
    vi.doMock('../lib/download', () => ({
      downloadArchive: vi.fn(async ({ archiveFilePath }: { archiveFilePath: string }) => {
        await mkdir(join(archiveFilePath, '..'), { recursive: true });
        await writeFile(archiveFilePath, fakeZip);
        return { buffer: fakeZip, checksum: `sha256-${'a'.repeat(64)}` };
      }),
    }));
    vi.doMock('../lib/extract', async () => {
      const actual = await vi.importActual<typeof import('../lib/extract')>('../lib/extract');
      return {
        ...actual,
        extractIcons: vi.fn(async ({ extractToPath }: { extractToPath: string }) => {
          await mkdir(extractToPath, { recursive: true });
          await writeFile(join(extractToPath, 'check.svg'), '<svg />', 'utf8');
          return { count: 1, fileNames: ['check.svg'] };
        }),
      };
    });

    const runExecutor = (await import('../executor')).default;
    const result = await runExecutor(runOptions(), makeContext(workDir) as never);
    expect(result).toEqual({ success: true });

    const metadataRaw = await readFile(join(workDir, 'svg-out', '.icons-meta.json'), 'utf8');
    const metadata = JSON.parse(metadataRaw) as Record<string, unknown>;
    expect(metadata.observedChecksum).toBe(`sha256-${'a'.repeat(64)}`);
    expect(metadata.pinnedChecksumHint).toBe(PINNED_CHECKSUM_HINT);
    expect(metadata.sourceChecksum).toBeUndefined();
  });

  describe('BEEQ_SKIP_ICONS escape hatch', () => {
    const originalValue = process.env.BEEQ_SKIP_ICONS;

    afterEach(() => {
      if (originalValue === undefined) {
        delete process.env.BEEQ_SKIP_ICONS;
      } else {
        process.env.BEEQ_SKIP_ICONS = originalValue;
      }
    });

    for (const value of ['1', 'true', 'TRUE', 'True']) {
      it(`short-circuits before options validation when BEEQ_SKIP_ICONS="${value}"`, async () => {
        process.env.BEEQ_SKIP_ICONS = value;

        vi.doMock('../lib/download', () => ({
          downloadArchive: vi.fn(() => {
            throw new Error('downloadArchive should not be called when skipped');
          }),
        }));
        vi.doMock('../lib/extract', async () => {
          const actual = await vi.importActual<typeof import('../lib/extract')>('../lib/extract');
          return {
            ...actual,
            extractIcons: vi.fn(() => {
              throw new Error('extractIcons should not be called when skipped');
            }),
          };
        });

        const runExecutor = (await import('../executor')).default;
        // Pass invalid options on purpose: the skip must fire BEFORE
        // normalization, so returning success proves the short-circuit.
        const result = await runExecutor({ ...runOptions(), sourceRef: '' }, makeContext(workDir) as never);
        expect(result).toEqual({ success: true });
      });
    }

    for (const value of ['0', 'false', '', 'yes', 'no', 'anything-else']) {
      it(`does NOT short-circuit when BEEQ_SKIP_ICONS="${value}"`, async () => {
        process.env.BEEQ_SKIP_ICONS = value;

        const runExecutor = (await import('../executor')).default;
        // Invalid options must fail normally when the skip is not honored.
        const result = await runExecutor({ ...runOptions(), sourceRef: '' }, makeContext(workDir) as never);
        expect(result).toEqual({ success: false });
      });
    }
  });
});

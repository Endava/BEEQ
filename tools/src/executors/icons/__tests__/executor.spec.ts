import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  DEFAULTS,
  IconsExecutorError,
  buildFingerprintKey,
  computeIconsHash,
  isTargetIconEntry,
  isUpToDate,
  listSvgFiles,
  normalizeOptions,
  toPosix,
  writeMetadata,
} from '../lib';
import type { IconsExecutorSchema } from '../schema';

// -------------------------------------------------------------------------- //
//                                   Fixtures                                 //
// -------------------------------------------------------------------------- //

const baseOptions: IconsExecutorSchema = {
  assetsFolder: 'assets',
  downloadPath: 'tmp',
  extractToPath: 'svg-out',
  fileName: 'v2.1.0.zip',
  sourceRef: 'v2.1.0',
  sourceUrl: 'https://example.com/tags',
  svgFolder: 'core-2.1.0',
};

const makeContext = (root: string) => ({ root });

// -------------------------------------------------------------------------- //
//                             normalizeOptions()                             //
// -------------------------------------------------------------------------- //

describe('normalizeOptions()', () => {
  it('applies defaults and resolves paths against context.root', () => {
    const context = makeContext('/workspace');
    const result = normalizeOptions(baseOptions, context);

    expect(result.weight).toBe(DEFAULTS.weight);
    expect(result.metadataFile).toBe(DEFAULTS.metadataFile);
    expect(result.force).toBe(DEFAULTS.force);
    expect(result.skipIfUpToDate).toBe(DEFAULTS.skipIfUpToDate);
    expect(result.keepDownload).toBe(DEFAULTS.keepDownload);
    expect(result.minSvgCount).toBe(DEFAULTS.minSvgCount);
    expect(result.absoluteDownloadPath.endsWith('/workspace/tmp')).toBe(true);
    expect(result.absoluteExtractToPath.endsWith('/workspace/svg-out')).toBe(true);
    expect(result.archiveFilePath.endsWith('/workspace/tmp/v2.1.0.zip')).toBe(true);
    expect(result.metadataFilePath.endsWith(`/workspace/svg-out/${DEFAULTS.metadataFile}`)).toBe(true);
  });

  it('rejects invalid weight', () => {
    expect(() =>
      normalizeOptions({ ...baseOptions, weight: 'ultra' as never }, makeContext('/w')),
    ).toThrow(IconsExecutorError);
  });

  it('rejects invalid checksum pattern', () => {
    expect(() =>
      normalizeOptions({ ...baseOptions, sourceChecksum: 'not-a-checksum' }, makeContext('/w')),
    ).toThrow(/sourceChecksum/);
  });

  it('rejects minSvgCount < 1', () => {
    expect(() =>
      normalizeOptions({ ...baseOptions, minSvgCount: 0 }, makeContext('/w')),
    ).toThrow(/minSvgCount/);
  });

  it('rejects empty required string', () => {
    expect(() =>
      normalizeOptions({ ...baseOptions, sourceRef: '' }, makeContext('/w')),
    ).toThrow(/sourceRef/);
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
  const prefix = 'core-2.1.0/assets/regular';

  it('accepts matching svg file in target weight folder', () => {
    expect(isTargetIconEntry('core-2.1.0/assets/regular/check.svg', 'file', prefix)).toBe(true);
  });

  it('accepts windows-style paths', () => {
    expect(isTargetIconEntry('core-2.1.0\\assets\\regular\\check.svg', 'file', prefix)).toBe(true);
  });

  it('rejects wrong weight folder', () => {
    expect(isTargetIconEntry('core-2.1.0/assets/bold/check.svg', 'file', prefix)).toBe(false);
  });

  it('rejects directories', () => {
    expect(isTargetIconEntry('core-2.1.0/assets/regular/', 'directory', prefix)).toBe(false);
  });

  it('rejects non-svg files', () => {
    expect(isTargetIconEntry('core-2.1.0/assets/regular/readme.md', 'file', prefix)).toBe(false);
  });
});

// -------------------------------------------------------------------------- //
//                            buildFingerprintKey()                           //
// -------------------------------------------------------------------------- //

describe('buildFingerprintKey()', () => {
  it('is stable regardless of property order', () => {
    const a = buildFingerprintKey({
      assetsFolder: 'assets',
      fileName: 'v.zip',
      sourceRef: 'v1',
      sourceUrl: 'https://x',
      svgFolder: 'core',
      weight: 'regular',
    });
    const b = buildFingerprintKey({
      weight: 'regular',
      svgFolder: 'core',
      sourceUrl: 'https://x',
      sourceRef: 'v1',
      fileName: 'v.zip',
      assetsFolder: 'assets',
    });
    expect(a).toBe(b);
  });

  it('changes when any tuple field changes', () => {
    const base = buildFingerprintKey({
      assetsFolder: 'assets',
      fileName: 'v.zip',
      sourceRef: 'v1',
      sourceUrl: 'https://x',
      svgFolder: 'core',
      weight: 'regular',
    });
    const withRef = buildFingerprintKey({
      assetsFolder: 'assets',
      fileName: 'v.zip',
      sourceRef: 'v2',
      sourceUrl: 'https://x',
      svgFolder: 'core',
      weight: 'regular',
    });
    expect(base).not.toBe(withRef);
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
    fileName: 'v2.1.0.zip',
    sourceRef: 'v2.1.0',
    sourceUrl: 'https://example.com/tags',
    svgFolder: 'core-2.1.0',
    weight: 'regular' as const,
  };

  it('returns true when metadata + files match', async () => {
    await seedIcons(workDir, {
      'check.svg': '<svg />',
      'close.svg': '<svg />',
    });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    const metadataFilePath = join(workDir, '.icons-meta.json');
    await writeMetadata(metadataFilePath, {
      ...expected,
      iconCount: files.length,
      iconsHash,
      generatedAt: new Date().toISOString(),
    });

    await expect(
      isUpToDate({ expected, extractToPath: workDir, metadataFilePath, minSvgCount: 1 }),
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
    const metadataFilePath = join(workDir, '.icons-meta.json');
    await writeMetadata(metadataFilePath, {
      ...expected,
      iconCount: files.length,
      iconsHash,
      generatedAt: new Date().toISOString(),
    });

    await writeFile(join(workDir, 'check.svg'), '<svg data-tampered />', 'utf8');

    await expect(
      isUpToDate({ expected, extractToPath: workDir, metadataFilePath, minSvgCount: 1 }),
    ).resolves.toBe(false);
  });

  it('returns false when source ref changed', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />' });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    const metadataFilePath = join(workDir, '.icons-meta.json');
    await writeMetadata(metadataFilePath, {
      ...expected,
      iconCount: files.length,
      iconsHash,
      generatedAt: new Date().toISOString(),
    });

    await expect(
      isUpToDate({
        expected: { ...expected, sourceRef: 'v2.2.0' },
        extractToPath: workDir,
        metadataFilePath,
        minSvgCount: 1,
      }),
    ).resolves.toBe(false);
  });

  it('returns false when icon count falls below minimum', async () => {
    await seedIcons(workDir, { 'check.svg': '<svg />' });
    const files = await listSvgFiles(workDir);
    const iconsHash = await computeIconsHash(workDir, files);
    const metadataFilePath = join(workDir, '.icons-meta.json');
    await writeMetadata(metadataFilePath, {
      ...expected,
      iconCount: files.length,
      iconsHash,
      generatedAt: new Date().toISOString(),
    });

    await expect(
      isUpToDate({ expected, extractToPath: workDir, metadataFilePath, minSvgCount: 10 }),
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

  const runOptions = (): IconsExecutorSchema => ({
    assetsFolder: 'assets',
    downloadPath: 'tmp',
    extractToPath: 'svg-out',
    fileName: 'v2.1.0.zip',
    sourceRef: 'v2.1.0',
    sourceUrl: 'https://example.com/tags',
    svgFolder: 'core-2.1.0',
  });

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

    // Seed valid cache
    const { computeIconsHash: hash, listSvgFiles: list, writeMetadata: write } = await import('../lib/metadata');
    const outDir = join(workDir, 'svg-out');
    await writeFile(join(await ensure(outDir), 'check.svg'), '<svg />', 'utf8');
    const files = await list(outDir);
    const iconsHash = await hash(outDir, files);
    await write(join(outDir, '.icons-meta.json'), {
      assetsFolder: 'assets',
      fileName: 'v2.1.0.zip',
      sourceRef: 'v2.1.0',
      sourceUrl: 'https://example.com/tags',
      svgFolder: 'core-2.1.0',
      weight: 'regular',
      iconCount: files.length,
      iconsHash,
      generatedAt: new Date().toISOString(),
    });

    const runExecutor = (await import('../executor')).default;
    const result = await runExecutor(runOptions(), makeContext(workDir) as never);
    expect(result).toEqual({ success: true });
  });

  it('returns { success: false } on normalization error', async () => {
    const runExecutor = (await import('../executor')).default;
    const result = await runExecutor(
      { ...runOptions(), sourceRef: '' },
      makeContext(workDir) as never,
    );
    expect(result).toEqual({ success: false });
  });
});

// Helper used above — ensures a dir exists and returns it.
async function ensure(dir: string): Promise<string> {
  const { mkdir } = await import('node:fs/promises');
  await mkdir(dir, { recursive: true });
  return dir;
}

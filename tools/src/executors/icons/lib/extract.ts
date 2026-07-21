import { basename, join, posix } from 'node:path';

import decompress, { type File as DecompressFile } from 'decompress';
import fsExtra from 'fs-extra';

import { asIconsError, IconsExecutorError } from './errors.ts';

/** Inputs for {@link extractIcons}. */
type ExtractOptions = {
  /** Absolute path to the previously downloaded zip. */
  archiveFilePath: string;
  /** Assets directory name inside the archive root (e.g. `"assets"`). */
  assetsFolder: string;
  /**
   * Absolute destination directory. Emptied before new files are written
   * to guarantee a clean set.
   */
  extractToPath: string;
  /** Archive root folder name (e.g. `"core-<sha>"`). */
  svgFolder: string;
};

/** Result of a successful extraction. */
type ExtractResult = {
  /** Number of SVG files written. */
  count: number;
  /**
   * Base names of every written SVG, sorted alphabetically so downstream
   * fingerprinting is deterministic.
   */
  fileNames: string[];
};

/** Maximum number of concurrent `writeFile` calls during flattening. */
const CONCURRENCY = 16;

/**
 * Convert any mix of `\` and `/` separators to POSIX-style `/`. Archive
 * entries produced on Windows toolchains occasionally include backslashes,
 * so we normalize once before doing prefix comparisons.
 *
 * @param value - Any file path.
 * @returns The path with every separator normalized to `/`.
 */
const toPosix = (value: string): string => value.split(/[\\/]+/).join('/');

/**
 * Run an array of async writes with a bounded concurrency window. Uses a
 * simple shared cursor so slow writes don't block the whole pipeline.
 *
 * @param writes - Thunks producing the individual write promises.
 * @param concurrency - Maximum number of writes in flight at once.
 * @returns A promise that resolves once every write has settled.
 */
const writeInBatches = async (writes: Array<() => Promise<void>>, concurrency = CONCURRENCY): Promise<void> => {
  let cursor = 0;
  const worker = async (): Promise<void> => {
    while (cursor < writes.length) {
      const index = cursor++;
      await writes[index]();
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, writes.length) }, worker));
};

/**
 * Predicate for `decompress`'s `filter` option. Accepts only regular files
 * whose posix-normalized path lives under `matchPrefix/` and ends in `.svg`
 * (case-insensitive).
 *
 * @param entryPath - Path as reported by the archive entry.
 * @param entryType - Archive entry type (`"file"`, `"directory"`, etc.).
 * @param matchPrefix - Prefix to enforce, e.g. `"core-<sha>/assets"`.
 * @returns `true` when the entry should be extracted.
 */
const isTargetIconEntry = (entryPath: string, entryType: string, matchPrefix: string): boolean => {
  if (entryType !== 'file') return false;
  const posixPath = toPosix(entryPath);
  if (!posixPath.startsWith(`${matchPrefix}/`)) return false;
  return posixPath.toLowerCase().endsWith('.svg');
};

/**
 * Extract every SVG under `<svgFolder>/<assetsFolder>/**` from the archive
 * at `archiveFilePath` and write them flat into `extractToPath`. Uses
 * basename as the destination filename.
 *
 * Guarantees, in order:
 * 1. All matching entries are enumerated up front (streaming isn't worth
 *    the complexity at ~9k small files).
 * 2. Basename collisions across weight subfolders throw before anything is
 *    written — Phosphor's filenames encode the weight suffix, so a real
 *    collision means the upstream layout changed and must be reviewed.
 * 3. `extractToPath` is emptied, then files are written with bounded
 *    concurrency (`CONCURRENCY = 16`).
 *
 * @param options - See {@link ExtractOptions}.
 * @returns The number of extracted files plus their sorted base names.
 * @throws {IconsExecutorError} On archive read failures, basename
 *   collisions, destination prep failures, or write failures. All errors
 *   are tagged with the `extract` `IconsPhase`.
 */
const extractIcons = async ({
  archiveFilePath,
  assetsFolder,
  extractToPath,
  svgFolder,
}: ExtractOptions): Promise<ExtractResult> => {
  const matchPrefix = posix.join(svgFolder, assetsFolder);

  let entries: DecompressFile[];
  try {
    entries = await decompress(archiveFilePath, {
      filter: (entry: DecompressFile) => isTargetIconEntry(entry.path, entry.type, matchPrefix),
    });
  } catch (error) {
    throw asIconsError('extract', `Failed to read archive "${archiveFilePath}"`, error, { archiveFilePath });
  }

  const sortedEntries = [...entries].sort((a, b) => a.path.localeCompare(b.path));

  const seen = new Map<string, string>();
  const collisions: Array<{ name: string; existing: string; incoming: string }> = [];

  for (const entry of sortedEntries) {
    const name = basename(entry.path);
    const existing = seen.get(name);
    if (existing) {
      collisions.push({ name, existing, incoming: entry.path });
      continue;
    }
    seen.set(name, entry.path);
  }

  if (collisions.length > 0) {
    throw new IconsExecutorError(
      'extract',
      `Detected ${collisions.length} icon filename collision(s) inside "${matchPrefix}". This indicates the archive layout changed and must be reviewed.`,
      { context: { collisions: collisions.slice(0, 5) } },
    );
  }

  try {
    await fsExtra.ensureDir(extractToPath);
    await fsExtra.emptyDir(extractToPath);
  } catch (error) {
    throw asIconsError('extract', `Failed to prepare destination "${extractToPath}"`, error, { extractToPath });
  }

  const writes = sortedEntries.map((entry) => async () => {
    const name = basename(entry.path);
    await fsExtra.writeFile(join(extractToPath, name), entry.data);
  });

  try {
    await writeInBatches(writes);
  } catch (error) {
    throw asIconsError('extract', `Failed to write icons to "${extractToPath}"`, error, { extractToPath });
  }

  const fileNames = sortedEntries.map((entry) => basename(entry.path)).sort((a, b) => a.localeCompare(b));
  return { count: fileNames.length, fileNames };
};

export type { ExtractOptions, ExtractResult };
export { extractIcons, isTargetIconEntry, toPosix };

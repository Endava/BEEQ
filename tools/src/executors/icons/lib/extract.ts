import { basename, join, posix } from 'node:path';

import * as decompress from 'decompress';
import { emptyDir, ensureDir, writeFile } from 'fs-extra';

import { IconsExecutorError, asIconsError } from './errors';

export interface ExtractOptions {
  archiveFilePath: string;
  assetsFolder: string;
  extractToPath: string;
  svgFolder: string;
}

export interface ExtractResult {
  count: number;
  fileNames: string[];
}

const CONCURRENCY = 16;

export const toPosix = (value: string): string => value.split(/[\\/]+/).join('/');

const writeInBatches = async (
  writes: Array<() => Promise<void>>,
  concurrency = CONCURRENCY,
): Promise<void> => {
  let cursor = 0;
  const worker = async (): Promise<void> => {
    while (cursor < writes.length) {
      const index = cursor++;
      await writes[index]();
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, writes.length) }, worker));
};

export const isTargetIconEntry = (
  entryPath: string,
  entryType: string,
  matchPrefix: string,
): boolean => {
  if (entryType !== 'file') return false;
  const posixPath = toPosix(entryPath);
  if (!posixPath.startsWith(`${matchPrefix}/`)) return false;
  return posixPath.toLowerCase().endsWith('.svg');
};

export const extractIcons = async ({
  archiveFilePath,
  assetsFolder,
  extractToPath,
  svgFolder,
}: ExtractOptions): Promise<ExtractResult> => {
  const matchPrefix = posix.join(svgFolder, assetsFolder);

  let entries: decompress.File[];
  try {
    entries = await decompress(archiveFilePath, {
      filter: (entry) => isTargetIconEntry(entry.path, entry.type, matchPrefix),
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
    await ensureDir(extractToPath);
    await emptyDir(extractToPath);
  } catch (error) {
    throw asIconsError('extract', `Failed to prepare destination "${extractToPath}"`, error, { extractToPath });
  }

  const writes = sortedEntries.map((entry) => async () => {
    const name = basename(entry.path);
    await writeFile(join(extractToPath, name), entry.data);
  });

  try {
    await writeInBatches(writes);
  } catch (error) {
    throw asIconsError('extract', `Failed to write icons to "${extractToPath}"`, error, { extractToPath });
  }

  const fileNames = sortedEntries.map((entry) => basename(entry.path));
  return { count: fileNames.length, fileNames };
};

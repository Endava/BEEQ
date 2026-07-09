import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { pathExists, readJson, writeJson } from 'fs-extra';

import type { SourceRefType } from '../schema';
import { asIconsError } from './errors';

export interface FingerprintInput {
  assetsFolder: string;
  fileName: string;
  sourceChecksum?: string;
  sourceRef: string;
  sourceRefType: SourceRefType;
  sourceUrl: string;
  svgFolder: string;
}

export interface IconsMetadata extends FingerprintInput {
  iconCount: number;
  iconsHash: string;
  generatedAt: string;
  /** Actual sha256 of the downloaded archive, always captured. */
  observedChecksum: string;
  /** Human-readable hint written only when `sourceChecksum` is not pinned. */
  pinnedChecksumHint?: string;
}

const sha256Buffer = (buffer: Buffer): string => `sha256-${createHash('sha256').update(buffer).digest('hex')}`;
const sha256String = (value: string): string => `sha256-${createHash('sha256').update(value).digest('hex')}`;

export const PINNED_CHECKSUM_HINT =
  'To make future runs fail-fast on upstream drift, copy `observedChecksum` above into your project.json under `sourceChecksum`.';

export const buildFingerprintKey = (input: FingerprintInput): string =>
  JSON.stringify({
    assetsFolder: input.assetsFolder,
    fileName: input.fileName,
    sourceChecksum: input.sourceChecksum ?? null,
    sourceRef: input.sourceRef,
    sourceRefType: input.sourceRefType,
    sourceUrl: input.sourceUrl,
    svgFolder: input.svgFolder,
  });

export const listSvgFiles = async (extractToPath: string): Promise<string[]> => {
  if (!(await pathExists(extractToPath))) return [];
  const entries = await readdir(extractToPath);
  return entries.filter((name) => name.toLowerCase().endsWith('.svg')).sort((a, b) => a.localeCompare(b));
};

export const computeIconsHash = async (extractToPath: string, fileNames: string[]): Promise<string> => {
  const digests: string[] = [];
  for (const name of fileNames) {
    const buffer = await readFile(join(extractToPath, name));
    digests.push(`${name}\t${sha256Buffer(buffer)}`);
  }
  return sha256String(digests.join('\n'));
};

export const readMetadata = async (metadataFilePath: string): Promise<IconsMetadata | null> => {
  if (!(await pathExists(metadataFilePath))) return null;
  try {
    const data = (await readJson(metadataFilePath)) as unknown;
    if (!data || typeof data !== 'object') return null;
    return data as IconsMetadata;
  } catch (error) {
    throw asIconsError('metadata', `Failed to read metadata "${metadataFilePath}"`, error, { metadataFilePath });
  }
};

export const writeMetadata = async (metadataFilePath: string, metadata: IconsMetadata): Promise<void> => {
  try {
    await writeJson(metadataFilePath, metadata, { spaces: 2 });
  } catch (error) {
    throw asIconsError('metadata', `Failed to write metadata "${metadataFilePath}"`, error, { metadataFilePath });
  }
};

export interface UpToDateInput {
  expected: FingerprintInput;
  extractToPath: string;
  metadataFilePath: string;
  minSvgCount: number;
}

export const isUpToDate = async ({
  expected,
  extractToPath,
  metadataFilePath,
  minSvgCount,
}: UpToDateInput): Promise<boolean> => {
  const metadata = await readMetadata(metadataFilePath);
  if (!metadata) return false;
  if (buildFingerprintKey(metadata) !== buildFingerprintKey(expected)) return false;

  const files = await listSvgFiles(extractToPath);
  if (files.length < minSvgCount) return false;
  if (files.length !== metadata.iconCount) return false;

  const currentHash = await computeIconsHash(extractToPath, files);
  return currentHash === metadata.iconsHash;
};

import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import fsExtra from 'fs-extra';

import type { SourceRefType } from '../schema.d.ts';
import { asIconsError } from './errors.ts';

/**
 * Stable subset of {@link IconsMetadata} that fully identifies a source
 * archive. Two runs with the same fingerprint are considered equivalent
 * and short-circuited by {@link isUpToDate}.
 */
type FingerprintInput = {
  assetsFolder: string;
  fileName: string;
  sourceChecksum?: string;
  sourceRef: string;
  sourceRefType: SourceRefType;
  sourceUrl: string;
  svgFolder: string;
};

/**
 * Full metadata marker written to `<extractToPath>/<metadataFile>` after a
 * successful extraction. Consumed on subsequent runs to decide whether the
 * cache is still valid.
 */
type IconsMetadata = FingerprintInput & {
  /** Number of SVG files present in `extractToPath`. */
  iconCount: number;
  /**
   * Rollup sha256 of the extracted directory:
   * `sha256(join('\n', map(f => `${name}\t${sha256(bytes)}`)))`. Detects
   * out-of-band edits to individual SVGs.
   */
  iconsHash: string;
  /** ISO 8601 timestamp of the extraction that produced this file. */
  generatedAt: string;
  /** Actual sha256 of the downloaded archive, always captured. */
  observedChecksum: string;
  /** Human-readable hint written only when `sourceChecksum` is not pinned. */
  pinnedChecksumHint?: string;
};

/**
 * Compute `sha256-<hex>` of a raw buffer.
 *
 * @param buffer - Bytes to hash.
 * @returns The `sha256-<hex>` string.
 */
const sha256Buffer = (buffer: Buffer): string => `sha256-${createHash('sha256').update(buffer).digest('hex')}`;

/**
 * Compute `sha256-<hex>` of a UTF-8 string.
 *
 * @param value - UTF-8 string to hash.
 * @returns The `sha256-<hex>` string.
 */
const sha256String = (value: string): string => `sha256-${createHash('sha256').update(value).digest('hex')}`;

/**
 * Human-readable instruction embedded in metadata (and printed to CI logs)
 * whenever a run completes without a pinned `sourceChecksum`. Kept as an
 * exported constant so tests can assert on its exact wording.
 */
const PINNED_CHECKSUM_HINT =
  'To make future runs fail-fast on upstream drift, copy `observedChecksum` above into your project.json under `sourceChecksum`.';

/**
 * Serialize a {@link FingerprintInput} into a stable JSON string suitable
 * for direct equality comparison. Uses a fixed key order and coerces a
 * missing `sourceChecksum` to `null` so pinned/unpinned runs produce
 * strictly comparable output.
 *
 * @param input - The fingerprint fields to serialize.
 * @returns A stable JSON string.
 */
const buildFingerprintKey = (input: FingerprintInput): string =>
  JSON.stringify({
    assetsFolder: input.assetsFolder,
    fileName: input.fileName,
    sourceChecksum: input.sourceChecksum ?? null,
    sourceRef: input.sourceRef,
    sourceRefType: input.sourceRefType,
    sourceUrl: input.sourceUrl,
    svgFolder: input.svgFolder,
  });

/**
 * List the alphabetically sorted `.svg` basenames currently present in
 * `extractToPath`. Returns an empty array when the directory does not
 * exist. The sort ensures {@link computeIconsHash} is deterministic.
 *
 * @param extractToPath - Absolute directory to scan.
 * @returns Sorted `.svg` basenames, or `[]` when the directory is missing.
 */
const listSvgFiles = async (extractToPath: string): Promise<string[]> => {
  if (!(await fsExtra.pathExists(extractToPath))) return [];
  const entries = await readdir(extractToPath);
  return entries.filter((name) => name.toLowerCase().endsWith('.svg')).sort((a, b) => a.localeCompare(b));
};

/**
 * Compute the rollup `iconsHash` stored in {@link IconsMetadata}. The
 * per-file digest tuples (`<name>\t<sha256>`) are joined by `\n` then
 * hashed once more, giving a compact identifier that flips on any single
 * icon change.
 *
 * `fileNames` MUST be pre-sorted and MUST match what will land in
 * `extractToPath`; callers get this by reusing the sorted list returned
 * from the extraction step (or from {@link listSvgFiles}).
 *
 * @param extractToPath - Directory containing the SVGs to hash.
 * @param fileNames - Pre-sorted basenames of the SVGs to include.
 * @returns The `sha256-<hex>` rollup digest.
 */
const computeIconsHash = async (extractToPath: string, fileNames: string[]): Promise<string> => {
  const digests: string[] = [];
  for (const name of fileNames) {
    const buffer = await readFile(join(extractToPath, name));
    digests.push(`${name}\t${sha256Buffer(buffer)}`);
  }
  return sha256String(digests.join('\n'));
};

/**
 * Read and validate the metadata marker file. Returns `null` when the
 * marker is missing or its top-level shape is not an object. Any JSON
 * parse failure surfaces as an {@link IconsExecutorError} tagged
 * `metadata` so callers can distinguish "no cache" from "corrupted cache".
 *
 * @param metadataFilePath - Absolute path to the marker file.
 * @returns The parsed metadata, or `null` when the file is absent.
 * @throws {IconsExecutorError} When the file exists but cannot be parsed.
 */
const readMetadata = async (metadataFilePath: string): Promise<IconsMetadata | null> => {
  if (!(await fsExtra.pathExists(metadataFilePath))) return null;
  try {
    const data = (await fsExtra.readJson(metadataFilePath)) as unknown;
    if (!data || typeof data !== 'object') return null;
    return data as IconsMetadata;
  } catch (error) {
    throw asIconsError('metadata', `Failed to read metadata "${metadataFilePath}"`, error, { metadataFilePath });
  }
};

/**
 * Write the metadata marker file as pretty-printed JSON (2-space indent).
 *
 * @param metadataFilePath - Absolute path to the marker file.
 * @param metadata - The metadata payload to persist.
 * @throws {IconsExecutorError} On filesystem write failure.
 */
const writeMetadata = async (metadataFilePath: string, metadata: IconsMetadata): Promise<void> => {
  try {
    await fsExtra.writeJson(metadataFilePath, metadata, { spaces: 2 });
  } catch (error) {
    throw asIconsError('metadata', `Failed to write metadata "${metadataFilePath}"`, error, { metadataFilePath });
  }
};

/** Inputs for {@link isUpToDate}. */
type UpToDateInput = {
  /** Fingerprint the executor wants to satisfy. */
  expected: FingerprintInput;
  /** Directory that would hold the extracted SVGs. */
  extractToPath: string;
  /** Path to the marker file inside `extractToPath`. */
  metadataFilePath: string;
  /** Minimum SVG count enforced as a sanity check. */
  minSvgCount: number;
};

/**
 * Return `true` when a previous run's output can be reused as-is. All of
 * the following must hold:
 *
 * 1. A metadata marker exists and its {@link buildFingerprintKey} matches
 *    `expected`.
 * 2. The on-disk SVG count is `>= minSvgCount` **and** equal to
 *    `metadata.iconCount`.
 * 3. A freshly computed {@link computeIconsHash} of the on-disk files
 *    equals the stored `iconsHash` (catches out-of-band edits).
 *
 * Any negative result is silent — the caller falls back to a full refresh.
 *
 * @param input - See {@link UpToDateInput}.
 * @returns `true` when the cache can be reused, `false` otherwise.
 */
const isUpToDate = async ({
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

export type { FingerprintInput, IconsMetadata, UpToDateInput };
export {
  buildFingerprintKey,
  computeIconsHash,
  isUpToDate,
  listSvgFiles,
  PINNED_CHECKSUM_HINT,
  readMetadata,
  writeMetadata,
};

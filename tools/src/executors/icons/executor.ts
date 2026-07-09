import type { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { remove } from 'fs-extra';

import {
  computeIconsHash,
  createIconsLogger,
  downloadArchive,
  extractIcons,
  type FingerprintInput,
  IconsExecutorError,
  type IconsLogger,
  type IconsMetadata,
  isUpToDate,
  type NormalizedOptions,
  normalizeOptions,
  PINNED_CHECKSUM_HINT,
  writeMetadata,
} from './lib';
import type { IconsExecutorSchema } from './schema';

/**
 * Project a {@link NormalizedOptions} onto the {@link FingerprintInput}
 * subset used by both the cache-lookup and metadata-write paths, so both
 * sites always see the same fields in the same shape.
 *
 * @param options - Fully normalized executor options.
 * @returns The fingerprint fields extracted from `options`.
 */
const toFingerprint = (options: NormalizedOptions): FingerprintInput => ({
  assetsFolder: options.assetsFolder,
  fileName: options.fileName,
  sourceChecksum: options.sourceChecksum,
  sourceRef: options.sourceRef,
  sourceRefType: options.sourceRefType,
  sourceUrl: options.sourceUrl,
  svgFolder: options.svgFolder,
});

/**
 * Best-effort cleanup of the downloaded archive. Skipped when the user
 * opts in to `keepDownload`; any I/O error is swallowed so a stale
 * archive file never breaks an otherwise successful run.
 *
 * @param options - Fully normalized executor options.
 */
const cleanupDownload = async (options: NormalizedOptions): Promise<void> => {
  if (options.keepDownload) return;
  try {
    await remove(options.archiveFilePath);
  } catch {
    /* best-effort cleanup */
  }
};

/**
 * Run {@link normalizeOptions} inside a `try/catch` and translate any
 * validation error into a `[options] ...` log line, returning `null`.
 * Lets the top-level executor keep a linear happy path.
 *
 * @param rawOptions - Raw options as passed by Nx.
 * @param context - The Nx executor context.
 * @param log - The active logger.
 * @returns Normalized options, or `null` when validation failed.
 */
const safeNormalize = (
  rawOptions: IconsExecutorSchema,
  context: ExecutorContext,
  log: IconsLogger,
): NormalizedOptions | null => {
  try {
    return normalizeOptions(rawOptions, context);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.fail(`[options] ${message}`);
    return null;
  }
};

/**
 * Decide whether the executor can short-circuit. Wraps
 * {@link isUpToDate} with the guard rails for `--force` and
 * `skipIfUpToDate: false` so the caller doesn't have to.
 *
 * @param options - Fully normalized executor options.
 * @param expected - The fingerprint the executor wants to satisfy.
 * @returns `true` when the cache is valid and reuse is allowed.
 */
const isCacheHit = async (options: NormalizedOptions, expected: FingerprintInput): Promise<boolean> => {
  if (options.force || !options.skipIfUpToDate) return false;
  return isUpToDate({
    expected,
    extractToPath: options.absoluteExtractToPath,
    metadataFilePath: options.metadataFilePath,
    minSvgCount: options.minSvgCount,
  });
};

/**
 * Pure factory for the {@link IconsMetadata} marker written to disk after
 * a refresh. Kept separate so the surrounding orchestration stays free of
 * conditional spreads.
 *
 * @param expected - Fingerprint fields carried over into the metadata.
 * @param count - Number of SVGs written to `extractToPath`.
 * @param iconsHash - Rollup hash of the extracted directory.
 * @param observedChecksum - Actual `sha256-<hex>` of the downloaded archive.
 * @param sourceChecksumPinned - When `false`, embeds a
 *   {@link PINNED_CHECKSUM_HINT} so the operator sees how to lock the
 *   observed checksum on the next run.
 * @returns The metadata payload ready to be persisted.
 */
const buildMetadata = (
  expected: FingerprintInput,
  count: number,
  iconsHash: string,
  observedChecksum: string,
  sourceChecksumPinned: boolean,
): IconsMetadata => ({
  ...expected,
  iconCount: count,
  iconsHash,
  generatedAt: new Date().toISOString(),
  observedChecksum,
  ...(sourceChecksumPinned ? {} : { pinnedChecksumHint: PINNED_CHECKSUM_HINT }),
});

/**
 * Perform the full refresh pipeline: download → extract → hash →
 * metadata write → optional hint → best-effort cleanup. Any thrown
 * {@link IconsExecutorError} bubbles up to {@link runExecutor}, which
 * turns it into a phase-tagged log line and `{ success: false }`.
 *
 * @param options - Fully normalized executor options.
 * @param expected - The fingerprint fields to persist alongside the icons.
 * @param log - The active logger.
 */
const refreshIcons = async (
  options: NormalizedOptions,
  expected: FingerprintInput,
  log: IconsLogger,
): Promise<void> => {
  log.start(`Downloading Phosphor icon archive (${options.sourceRefType}: ${options.sourceRef})`);
  const { checksum } = await downloadArchive({
    archiveFilePath: options.archiveFilePath,
    archiveUrl: options.archiveUrl,
    expectedChecksum: options.sourceChecksum,
  });
  log.success(`Downloaded ${options.fileName} (${checksum.slice(0, 15)}…)`);

  log.start('Extracting Phosphor icons (all weights) into BeeQ assets');
  const { count, fileNames } = await extractIcons({
    archiveFilePath: options.archiveFilePath,
    assetsFolder: options.assetsFolder,
    extractToPath: options.absoluteExtractToPath,
    svgFolder: options.svgFolder,
  });

  if (count < options.minSvgCount) {
    throw new IconsExecutorError(
      'extract',
      `Extracted ${count} icon(s) but at least ${options.minSvgCount} were required. Check "svgFolder" and "assetsFolder".`,
      { context: { count, minSvgCount: options.minSvgCount } },
    );
  }
  log.success(`Extracted ${count} SVG icon(s) across all weights`);

  log.start('Writing icons metadata fingerprint');
  const iconsHash = await computeIconsHash(options.absoluteExtractToPath, fileNames);
  const metadata = buildMetadata(expected, count, iconsHash, checksum, Boolean(options.sourceChecksum));
  await writeMetadata(options.metadataFilePath, metadata);
  log.success('Metadata fingerprint written');

  if (!options.sourceChecksum) {
    log.info(`No "sourceChecksum" pinned. Observed: ${checksum}. ${PINNED_CHECKSUM_HINT}`);
  }

  await cleanupDownload(options);
};

/**
 * Entry point invoked by Nx when `nx run <project>:icons` (or any target
 * that resolves to this executor) is executed.
 *
 * Reads as a thin pipeline:
 * 1. Normalize + validate options ({@link safeNormalize}).
 * 2. Short-circuit on cache hit ({@link isCacheHit}).
 * 3. Otherwise, refresh from source ({@link refreshIcons}).
 *
 * Errors are converted to `{ success: false }` with a `[<phase>] ...`
 * log line; the finally block guarantees the logger is torn down cleanly.
 *
 * @param rawOptions - Raw options as read from `project.json`.
 * @param context - The Nx executor context.
 * @returns `{ success: true }` on success, `{ success: false }` otherwise.
 */
const runExecutor: PromiseExecutor<IconsExecutorSchema> = async (rawOptions, context: ExecutorContext) => {
  const log = createIconsLogger();
  const options = safeNormalize(rawOptions, context, log);
  if (!options) return { success: false };

  try {
    log.start('Preparing BeeQ SVG icon files');
    const expected = toFingerprint(options);

    if (await isCacheHit(options, expected)) {
      log.success('BeeQ SVG icon files are already up to date. Skipping download and extraction.');
      return { success: true };
    }

    await refreshIcons(options, expected, log);
    return { success: true };
  } catch (error) {
    const phase = error instanceof IconsExecutorError ? error.phase : 'extract';
    const message = error instanceof Error ? error.message : String(error);
    log.fail(`[${phase}] ${message}`);
    return { success: false };
  } finally {
    log.stop();
  }
};

export default runExecutor;

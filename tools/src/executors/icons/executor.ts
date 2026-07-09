import type { ExecutorContext, PromiseExecutor } from '@nx/devkit';
import { remove } from 'fs-extra';

import {
  computeIconsHash,
  createIconsLogger,
  downloadArchive,
  extractIcons,
  type FingerprintInput,
  IconsExecutorError,
  type IconsMetadata,
  isUpToDate,
  type NormalizedOptions,
  normalizeOptions,
  PINNED_CHECKSUM_HINT,
  writeMetadata,
} from './lib';
import type { IconsExecutorSchema } from './schema';

const toFingerprint = (options: NormalizedOptions): FingerprintInput => ({
  assetsFolder: options.assetsFolder,
  fileName: options.fileName,
  sourceChecksum: options.sourceChecksum,
  sourceRef: options.sourceRef,
  sourceRefType: options.sourceRefType,
  sourceUrl: options.sourceUrl,
  svgFolder: options.svgFolder,
});

const cleanupDownload = async (options: NormalizedOptions): Promise<void> => {
  if (options.keepDownload) return;
  try {
    await remove(options.archiveFilePath);
  } catch {
    /* best-effort cleanup */
  }
};

const runExecutor: PromiseExecutor<IconsExecutorSchema> = async (rawOptions, context: ExecutorContext) => {
  const log = createIconsLogger();

  let options: NormalizedOptions;
  try {
    options = normalizeOptions(rawOptions, context);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.fail(`[options] ${message}`);
    return { success: false };
  }

  try {
    log.start('Preparing BeeQ SVG icon files');

    const expected = toFingerprint(options);

    if (!options.force && options.skipIfUpToDate) {
      const cached = await isUpToDate({
        expected,
        extractToPath: options.absoluteExtractToPath,
        metadataFilePath: options.metadataFilePath,
        minSvgCount: options.minSvgCount,
      });
      if (cached) {
        log.success('BeeQ SVG icon files are already up to date. Skipping download and extraction.');
        return { success: true };
      }
    }

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
    const metadata: IconsMetadata = {
      ...expected,
      iconCount: count,
      iconsHash,
      generatedAt: new Date().toISOString(),
      observedChecksum: checksum,
      ...(options.sourceChecksum ? {} : { pinnedChecksumHint: PINNED_CHECKSUM_HINT }),
    };

    await writeMetadata(options.metadataFilePath, metadata);
    log.success('Metadata fingerprint written');

    if (!options.sourceChecksum) {
      log.info(`No "sourceChecksum" pinned. Observed: ${checksum}. ${PINNED_CHECKSUM_HINT}`);
    }

    await cleanupDownload(options);
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

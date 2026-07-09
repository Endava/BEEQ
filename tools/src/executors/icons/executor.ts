import { remove } from 'fs-extra';

import type { ExecutorContext, PromiseExecutor } from '@nx/devkit';

import {
  IconsExecutorError,
  computeIconsHash,
  createIconsLogger,
  downloadArchive,
  extractIcons,
  isUpToDate,
  normalizeOptions,
  writeMetadata,
  type FingerprintInput,
  type IconsMetadata,
  type NormalizedOptions,
} from './lib';
import type { IconsExecutorSchema } from './schema';

const toFingerprint = (options: NormalizedOptions): FingerprintInput => ({
  assetsFolder: options.assetsFolder,
  fileName: options.fileName,
  sourceChecksum: options.sourceChecksum,
  sourceRef: options.sourceRef,
  sourceUrl: options.sourceUrl,
  svgFolder: options.svgFolder,
  weight: options.weight,
});

const cleanupDownload = async (options: NormalizedOptions): Promise<void> => {
  if (options.keepDownload) return;
  try {
    await remove(options.archiveFilePath);
  } catch {
    /* best-effort cleanup */
  }
};

const runExecutor: PromiseExecutor<IconsExecutorSchema> = async (
  rawOptions,
  context: ExecutorContext,
) => {
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

    log.start(`Downloading Phosphor icon archive (${options.sourceRef})`);
    const { checksum } = await downloadArchive({
      archiveFilePath: options.archiveFilePath,
      expectedChecksum: options.sourceChecksum,
      fileName: options.fileName,
      sourceUrl: options.sourceUrl,
    });
    log.success(`Downloaded ${options.fileName} (${checksum.slice(0, 15)}…)`);

    log.start(`Extracting "${options.weight}" icons into BeeQ assets`);
    const { count, fileNames } = await extractIcons({
      archiveFilePath: options.archiveFilePath,
      assetsFolder: options.assetsFolder,
      extractToPath: options.absoluteExtractToPath,
      svgFolder: options.svgFolder,
      weight: options.weight,
    });

    if (count < options.minSvgCount) {
      throw new IconsExecutorError(
        'extract',
        `Extracted ${count} icon(s) but at least ${options.minSvgCount} were required. Check "svgFolder", "assetsFolder", and "weight".`,
        { context: { count, minSvgCount: options.minSvgCount, weight: options.weight } },
      );
    }
    log.success(`Extracted ${count} SVG icon(s)`);

    log.start('Writing icons metadata fingerprint');
    const iconsHash = await computeIconsHash(options.absoluteExtractToPath, fileNames);
    const metadata: IconsMetadata = {
      ...expected,
      sourceChecksum: options.sourceChecksum ?? checksum,
      iconCount: count,
      iconsHash,
      generatedAt: new Date().toISOString(),
    };

    await writeMetadata(options.metadataFilePath, metadata);
    log.success('Metadata fingerprint written');

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

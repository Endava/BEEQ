import { join } from 'node:path';

import { createSpinner } from 'nanospinner';
import { pathExists, readJson, readdir, writeJson } from 'fs-extra';

import { downloadIcons, extractIcons } from './helpers';
import type { IconsExecutorSchema } from './schema';

interface IIconsMetadata {
  assetsFolder: string;
  fileName: string;
  minSvgCount: number;
  sourceRef: string;
  sourceUrl: string;
  svgFolder: string;
}

const DEFAULT_METADATA_FILE = '.icons-meta.json';
const DEFAULT_MIN_SVG_COUNT = 1;

const buildExpectedMetadata = ({
  assetsFolder,
  fileName,
  minSvgCount,
  sourceRef,
  sourceUrl,
  svgFolder,
}: IIconsMetadata): IIconsMetadata => ({
  assetsFolder,
  fileName,
  minSvgCount,
  sourceRef,
  sourceUrl,
  svgFolder,
});

const getSvgCount = async (extractToPath: string) => {
  if (!(await pathExists(extractToPath))) return 0;

  const files = await readdir(extractToPath);
  return files.filter((fileName) => fileName.endsWith('.svg')).length;
};

const isUpToDate = async ({
  extractToPath,
  expectedMetadata,
  metadataFilePath,
}: {
  expectedMetadata: IIconsMetadata;
  extractToPath: string;
  metadataFilePath: string;
}) => {
  if (!(await pathExists(metadataFilePath))) return false;

  const svgCount = await getSvgCount(extractToPath);
  if (svgCount < expectedMetadata.minSvgCount) return false;

  const currentMetadata = await readJson(metadataFilePath);
  if (!currentMetadata || typeof currentMetadata !== 'object') return false;

  return Object.entries(expectedMetadata).every(([key, value]) => currentMetadata[key] === value);
};

export default async function runExecutor({
  assetsFolder,
  downloadPath,
  extractToPath,
  fileName,
  force = false,
  metadataFile = DEFAULT_METADATA_FILE,
  minSvgCount = DEFAULT_MIN_SVG_COUNT,
  skipIfUpToDate = true,
  sourceRef,
  sourceUrl,
  svgFolder,
}: IconsExecutorSchema) {
  let success = true;
  const expectedMetadata = buildExpectedMetadata({
    assetsFolder,
    fileName,
    minSvgCount,
    sourceRef,
    sourceUrl,
    svgFolder,
  });
  const metadataFilePath = join(extractToPath, metadataFile);
  const logSpinner = createSpinner('Preparing BeeQ SVG icon files').start();

  try {
    if (!force && skipIfUpToDate && (await isUpToDate({ expectedMetadata, extractToPath, metadataFilePath }))) {
      logSpinner.success({ text: 'BeeQ SVG icon files are already up to date. Skipping download and extraction.' });
      return { success };
    }

    // First step will download the Phosphor-icon library from Github
    logSpinner.start({ text: 'Downloading the Phosphor icon package from GitHub' });
    await downloadIcons({ downloadPath, fileName, sourceUrl });
    logSpinner.success();

    // Once downloaded, it will extract the content of the .zip file and copy the SVG folder
    // into the `svg` assets of bee-q icon folder
    logSpinner.start({ text: 'Extracting and copying SVG icon files to BeeQ icon assets' });
    const copiedIcons = await extractIcons({ assetsFolder, downloadPath, extractToPath, fileName, svgFolder });
    if (copiedIcons < minSvgCount) {
      throw new Error(`Expected at least ${minSvgCount} SVG files, but extracted ${copiedIcons}`);
    }

    await writeJson(
      metadataFilePath,
      {
        ...expectedMetadata,
        generatedAt: new Date().toISOString(),
      },
      { spaces: 2 },
    );
    logSpinner.success();
  } catch (error) {
    success = false;
    const message = error instanceof Error ? error.message : String(error);
    logSpinner.error({ text: `Could not generate BeeQ SVG icon files. ${message}` });
  }

  return { success };
}

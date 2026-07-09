import { basename, join } from 'node:path';

import * as decompress from 'decompress';
import { copy, ensureDir, remove } from 'fs-extra';

interface IExtractIcons {
  assetsFolder: string;
  downloadPath: string;
  extractToPath: string;
  fileName: string;
  svgFolder: string;
}

export const extractIcons = async ({
  assetsFolder,
  downloadPath,
  extractToPath,
  fileName,
  svgFolder,
}: IExtractIcons) => {
  try {
    await ensureDir(downloadPath);

    const files = await decompress(join(downloadPath, fileName), downloadPath);
    // Remove all existing files under the `/svg/` folder (if there's any) to create a clean copy
    await remove(extractToPath);
    await ensureDir(extractToPath);

    let copiedIcons = 0;
    // Copy the SVG assets to the extractToPath (eg: `packages/beeq/src/components/icon/svg/`) folder.
    // We copy the icons in a flat structure, the Phosphor icons are under the `/assets/` folder,
    // and subfolders (bold, duotone, fill, light, regular) are not needed.
    for (const file of files) {
      if (file.type === 'file' && (file.path as string).includes(join(svgFolder, assetsFolder))) {
        const oldPath = join(downloadPath, file.path);
        const newPath = join(extractToPath, basename(file.path));
        await copy(oldPath, newPath, { overwrite: true });
        copiedIcons++;
      }
    }

    return copiedIcons;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not extract icons into "${extractToPath}": ${message}`);
  }
};

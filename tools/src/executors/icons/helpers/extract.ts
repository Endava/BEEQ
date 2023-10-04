import * as decompress from 'decompress';
import { copy, remove } from 'fs-extra';
import { join } from 'node:path';

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
    await decompress(join(downloadPath, fileName), downloadPath);
    // Remove all existing files under the `/svg/` folder (if there's any) to create a clean copy
    await remove(extractToPath);
    // Move the SVG assets to the icon component `/svg/` folder
    await copy(join(downloadPath, svgFolder, assetsFolder), extractToPath, {
      overwrite: true,
    });
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

import * as fs from 'fs-extra';
import * as path from 'path';
import * as decompress from 'decompress';

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
    const files = await decompress(path.join(downloadPath, fileName), downloadPath);
    // Remove all existing files under the `/svg/` folder (if there's any) to create a clean copy
    await fs.remove(extractToPath);
    // Move the SVG assets to the icon component `/svg/` folder in a flat structure
    for (const file of files) {
      if (file.type === 'file' && (file.path as string).includes(path.join(svgFolder, assetsFolder))) {
        const oldPath = path.join(downloadPath, file.path);
        const newPath = path.join(extractToPath, path.basename(file.path));
        await fs.copy(oldPath, newPath, { overwrite: true });
      }
    }
    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};

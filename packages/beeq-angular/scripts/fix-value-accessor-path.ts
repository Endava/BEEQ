import { resolve } from 'path';
import { promises as fs } from 'fs';

['module', 'standalone'].forEach((type) => {
  fixValueAccessorPath(type);
});

/**
 * Fix the value accessor path by moving the file to the correct path
 *
 * @param {string} type - The type of the Angular project (module or standalone)
 */
async function fixValueAccessorPath(type: string): Promise<void> {
  const angularProjectPath = type === 'module' ? '.' : 'standalone';

  // Define the folders and files paths
  const basePath = resolve(__dirname, `../${angularProjectPath}/src/directives`).replace(/\\/g, '/');
  const wrongFolderPath = `${basePath}/value-accessor.ts`;
  const backupFolderPath = `${basePath}/value-accessor`;
  const sourceFilePath = `${basePath}/value-accessor/value-accessor.ts`;
  const destinationFilePath = wrongFolderPath;

  // Check if the wrong file exists
  if (await isDirectory(wrongFolderPath)) {
    console.info(`Renaming wrong Value Accessor file for angular ${type} project...`);
    await renameDirectory(wrongFolderPath, backupFolderPath);
  } else {
    console.info(`No changes required! Wrong folder does not exist for angular ${type} project`);
    return;
  }

  // Move the file to the correct path
  if (await isDirectory(backupFolderPath)) {
    console.info(`Moving wrong Value Accessor file for angular ${type} project to the correct path...`);

    try {
      await moveFile(sourceFilePath, destinationFilePath);
      await removeDirectory(backupFolderPath);
      console.info(`File moved successfully for angular ${type} project to the correct path.`);
    } catch (err) {
      console.error(`Error moving the file for angular ${type} project`, err);
      process.exit(1); // Exit the process with a failure code
    }
  } else {
    console.warn(`No changes required! Source folder does not exist for angular ${type} project`);
  }
}

/**
 * Check if a path exists and is a directory
 *
 * @param {string} path - The path to check
 * @returns {Promise<boolean>}
 */
async function isDirectory(path: string): Promise<boolean> {
  try {
    const stat = await fs.stat(path);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Rename a directory
 *
 * @param {string} oldPath - The current path of the directory
 * @param {string} newPath - The new path of the directory
 * @returns {Promise<void>}
 */
async function renameDirectory(oldPath: string, newPath: string): Promise<void> {
  await fs.rename(oldPath, newPath);
}

/**
 * Move a file
 *
 * @param {string} source - The source file path
 * @param {string} destination - The destination file path
 * @returns {Promise<void>}
 */
async function moveFile(source: string, destination: string): Promise<void> {
  await fs.rename(source, destination);
}

/**
 * Remove a directory
 *
 * @param {string} path - The path of the directory to remove
 * @returns {Promise<void>}
 */
async function removeDirectory(path: string): Promise<void> {
  await fs.rmdir(path);
}

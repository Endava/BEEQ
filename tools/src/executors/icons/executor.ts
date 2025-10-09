import { createSpinner } from 'nanospinner';

import { downloadIcons, extractIcons } from './helpers';
import type { IconsExecutorSchema } from './schema';

export default async function runExecutor({
  assetsFolder,
  downloadPath,
  extractToPath,
  fileName,
  sourceUrl,
  svgFolder,
}: IconsExecutorSchema) {
  let success = true;
  const logSpinner = createSpinner('Download the Phosphor-icon library').start();

  try {
    // First step will download the Phosphor-icon library from Github
    await downloadIcons({ downloadPath, fileName, sourceUrl });
    logSpinner.success();

    // Once downloaded, it will extract the content of the .zip file and copy the SVG folder
    // into the `svg` assets of bee-q icon folder
    logSpinner.start({ text: 'Extract and copy all the SVG icon files into the icon component assets folder' });
    await extractIcons({ assetsFolder, downloadPath, extractToPath, fileName, svgFolder });
    logSpinner.success();
  } catch (error) {
    success = false;
    logSpinner.error({ text: `Ups! Something went wrong while generating the Bee-Q SVG icon files. ${error}` });
  }

  return { success };
}

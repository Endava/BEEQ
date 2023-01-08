'use strict';

const admZip = require('adm-zip');
const fs = require('fs-extra');
const request = require('superagent');
const rimraf = require('rimraf');
const { join } = require('path');

const href = `https://github.com/phosphor-icons/phosphor-icons/archive/refs/heads`;
const zipFileName = 'master.zip';
// File URL source to download
const fileSource = `${href}/${zipFileName}`;

request
  .get(fileSource)
  .on('error', (error) => {
    console.error('❌ Something went wrong while downloading the file:', error);
  })
  .pipe(fs.createWriteStream(zipFileName))
  .on('finish', () => {
    // Read the downloaded zip file
    const zipFile = new admZip(join(__dirname, `../../../${zipFileName}`));
    // Path folders to work with while extracting and moving the SVG files
    const extractToFolder = join(__dirname);
    const assetsFolderName = 'assets';
    const sourceSvgFolder = join(__dirname, '/web-master/');
    const destSvgFolder = join(__dirname, '../../../libs/bee-q/src/components/icon/svg/');

    try {
      zipFile.getEntries().forEach((zipFileEntry) => {
        if (zipFileEntry.entryName.includes(assetsFolderName)) {
          // Extract only the SVG assets files (there are other files and folder that we do not need)
          zipFile.extractEntryTo(zipFileEntry.entryName, extractToFolder, true, true);
        }
      });
      // Remove all existing files under the `/svg/` folder (if there's any) to create a clean copy
      rimraf.sync(`${destSvgFolder}/{*}`);
      // Move the SVG assets to the icon component `/svg/` folder
      fs.copySync(`${sourceSvgFolder}/${assetsFolderName}/`, destSvgFolder, {
        overwrite: true,
      });
      // Remove the source folder
      rimraf.sync(sourceSvgFolder);
    } catch (error) {
      console.error('❌ Something went wrong while extracting and moving the SVG files:', error);
    } finally {
      console.log('✅ Phosphor-icon library have been extracted successfully!! 🎉 ');
    }
  });

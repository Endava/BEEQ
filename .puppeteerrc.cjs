const { join } = require('path');

/** @type {import("puppeteer").Configuration} */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  skipDownload: process.env.PUPPETEER_SKIP_DOWNLOAD ?? false,
};

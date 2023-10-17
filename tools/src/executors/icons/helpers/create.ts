import { readdirSync, writeFileSync } from 'fs-extra';
import { join, parse } from 'path';
import { format } from 'prettier';

interface ICreateIconsSetFile {
  fileName: string;
  outputDir: string;
  sourceDir: string;
}

export const createIconsSetFile = async ({ fileName, outputDir, sourceDir }: ICreateIconsSetFile) => {
  try {
    const files = readdirSync(sourceDir).sort();
    const svgArrayNames = files.map((filename) => parse(filename).name);
    const fileContent = `
      /**
       * ❗️❗️ This file gets autogenerated from the command line by running:
       * "npx nx run bee-q:generateIcons"
       *
       * ❌ Please do not modify it manually, always use "npx nx run bee-q:generateIcons"
       * and commit any change resulted after running the build command.
       */

      export const ICONS_SET=${JSON.stringify(svgArrayNames)}
    `;

    const formattedContent = await format(fileContent, {
      parser: 'babel',
      bracketSpacing: true,
      endOfLine: 'auto',
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
    });
    writeFileSync(join(outputDir, fileName), formattedContent);

    Promise.resolve();
  } catch (error) {
    Promise.reject(error);
  }
};
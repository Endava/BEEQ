/// <reference types="node" />

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Patches Stencil-generated Angular ControlValueAccessor host listeners for Angular 22.
 *
 * `@stencil/angular-output-target` currently emits host expressions such as
 * `$event.target?.["value"]`. Angular strict template checking types `$event.target`
 * as `EventTarget`, so indexing into `value` or `checked` fails during ng-packagr
 * compilation. `$any(...)` is Angular's scoped template escape hatch for generated
 * expressions we cannot strongly type here.
 *
 * Keep this script in the Angular wrapper prebuild step until the Stencil output
 * target emits Angular 22-compatible value accessor expressions.
 */

type AngularProject = {
  /** Human-readable project flavor used in log messages. */
  name: 'module' | 'standalone';
  /** Directory containing the generated value accessor directives. */
  directivesPath: string;
};

const angularProjects: AngularProject[] = [
  {
    name: 'module',
    directivesPath: resolve(__dirname, '../src/directives').replace(/\\/g, '/'),
  },
  {
    name: 'standalone',
    directivesPath: resolve(__dirname, '../standalone/src/directives').replace(/\\/g, '/'),
  },
];

/** Value accessor files generated for both module and standalone Angular wrappers. */
const valueAccessorFiles = [
  'boolean-value-accessor.ts',
  'number-value-accessor.ts',
  'radio-value-accessor.ts',
  'select-value-accessor.ts',
  'text-value-accessor.ts',
];

const eventTargetExpressionPattern = /\$event\.target\?\.\["/g;
const patchedEventTargetExpression = '$any($event.target)?.["';

void patchValueAccessors().catch((error) => {
  console.error('Error patching Angular value accessor event target expressions', error);
  process.exit(1);
});

/**
 * Patches every generated Angular value accessor project in place.
 *
 * Stencil regenerates these files before the Angular wrapper is packaged, so the
 * script is intentionally used in the prebuild step even if the files are already patched.
 */
async function patchValueAccessors(): Promise<void> {
  for (const project of angularProjects) {
    let patchedFiles = 0;

    for (const fileName of valueAccessorFiles) {
      const filePath = `${project.directivesPath}/${fileName}`;
      const content = await readFile(filePath);

      if (!content) {
        continue;
      }

      const updatedContent = content.replace(eventTargetExpressionPattern, patchedEventTargetExpression);

      if (updatedContent !== content) {
        await fs.writeFile(filePath, updatedContent);
        patchedFiles += 1;
      }
    }

    if (patchedFiles > 0) {
      console.info(`Patched ${patchedFiles} Angular ${project.name} value accessor event target expression(s).`);
    } else {
      console.info(`No Angular ${project.name} value accessor event target changes required.`);
    }
  }
}

/**
 * Reads a file if it exists.
 *
 * Missing generated files are skipped so the script can run against partially
 * generated wrapper trees without failing the whole prebuild step.
 *
 * @param path - Absolute path to the generated value accessor file.
 * @returns The file contents, or `undefined` when the file is not present.
 */
async function readFile(path: string): Promise<string | undefined> {
  try {
    return await fs.readFile(path, 'utf8');
  } catch {
    return undefined;
  }
}

import type { Tree } from '@nx/devkit';
import type { SyncGeneratorResult } from 'nx/src/utils/sync-generators';

import { planSync, SYNC_CONFIG, treeFiles, validateSkills } from './lib/index.ts';

/**
 * Sync generator that keeps the published skill copies in step with `packages/beeq-skills/src`.
 *
 * - `nx sync` (or any target listing it in `syncGenerators`) writes the changes.
 * - `nx sync:check` fails when a generated file is stale, which is how CI enforces it.
 *
 * Invalid sources throw, so a broken skill never reaches `skills/`.
 */
export function syncSkillsGenerator(tree: Tree): SyncGeneratorResult {
  const files = treeFiles(tree);

  const errors = validateSkills(files, SYNC_CONFIG);
  if (errors.length > 0) {
    const list = errors.map((error) => `  - ${error}`).join('\n');
    throw new Error(`Invalid skills in ${SYNC_CONFIG.sourceDir}:\n${list}`);
  }

  const { expected, write, remove } = planSync(files, SYNC_CONFIG);
  if (write.length === 0 && remove.length === 0) return {};

  for (const file of write) tree.write(file, expected.get(file) ?? '');
  for (const file of remove) tree.delete(file);

  const changed = [...write.map((file) => `  write  ${file}`), ...remove.map((file) => `  delete ${file}`)];
  return {
    outOfSyncMessage: `Generated skill files are out of date with ${SYNC_CONFIG.sourceDir}:\n${changed.join('\n')}`,
  };
}

export default syncSkillsGenerator;

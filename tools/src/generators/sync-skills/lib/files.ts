import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import type { Tree } from '@nx/devkit';

/** Read-only view of the workspace, so the same sync logic runs on the disk and on an Nx `Tree`. */
export type SkillFiles = {
  /** Contents of a workspace-relative file, or `null` when it does not exist. */
  read(file: string): string | null;
  /** Entry names directly inside a workspace-relative directory; empty when it does not exist. */
  list(dir: string): string[];
  isFile(file: string): boolean;
};

export const diskFiles = (root: string): SkillFiles => ({
  read: (file) => {
    const absolute = path.join(root, file);
    return existsSync(absolute) && statSync(absolute).isFile() ? readFileSync(absolute, 'utf8') : null;
  },
  list: (dir) => {
    const absolute = path.join(root, dir);
    return existsSync(absolute) && statSync(absolute).isDirectory() ? readdirSync(absolute).sort() : [];
  },
  isFile: (file) => {
    const absolute = path.join(root, file);
    return existsSync(absolute) && statSync(absolute).isFile();
  },
});

export const treeFiles = (tree: Tree): SkillFiles => ({
  read: (file) => (tree.exists(file) && tree.isFile(file) ? (tree.read(file, 'utf-8') ?? null) : null),
  list: (dir) => (tree.exists(dir) && !tree.isFile(dir) ? tree.children(dir).sort() : []),
  isFile: (file) => tree.exists(file) && tree.isFile(file),
});

/** Every file below `dir`, as workspace-relative POSIX paths. */
export function walkFiles(files: SkillFiles, dir: string): string[] {
  const out: string[] = [];
  for (const entry of files.list(dir)) {
    const child = path.posix.join(dir, entry);
    if (files.isFile(child)) out.push(child);
    else out.push(...walkFiles(files, child));
  }
  return out;
}

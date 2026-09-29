import path from 'node:path';

import { type SkillFiles, walkFiles } from './files.ts';
import { type FrontmatterValue, findRelativeLinks, parseFrontmatter } from './markdown.ts';

export type SyncConfig = {
  /** Source folder: one sub-folder per skill, plus loose files such as README.md. */
  sourceDir: string;
  /** Generated folder that `npx skills` installs from. */
  publicDir: string;
};

export const SYNC_CONFIG: SyncConfig = {
  sourceDir: 'packages/beeq-skills/src',
  publicDir: 'skills',
};

export const SKILL_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MAX_DESCRIPTION_LENGTH = 1024;

export const generatedNote = (source: string) => `Generated from ${source}. Edit the source, not this file.`;

const posix = path.posix;

/** Skill folders in the source: sub-folders that contain a SKILL.md. */
export const listSkills = (files: SkillFiles, config: SyncConfig = SYNC_CONFIG) =>
  files.list(config.sourceDir).filter((entry) => files.isFile(posix.join(config.sourceDir, entry, 'SKILL.md')));

export const listReferences = (files: SkillFiles, skillDir: string) =>
  files.list(posix.join(skillDir, 'references')).filter((file) => file.endsWith('.md'));

const nameErrors = (skillFile: string, name: FrontmatterValue | undefined, folder: string) => {
  if (typeof name !== 'string' || !name) return [`${skillFile}: "name" is required.`];
  if (!SKILL_NAME_PATTERN.test(name)) return [`${skillFile}: "name" must be lowercase kebab-case.`];
  if (name !== folder) return [`${skillFile}: "name" (${name}) must match the folder (${folder}).`];
  return [];
};

const descriptionErrors = (skillFile: string, description: FrontmatterValue | undefined) => {
  if (typeof description !== 'string' || !description) return [`${skillFile}: "description" is required.`];
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return [`${skillFile}: "description" is ${description.length} characters (max ${MAX_DESCRIPTION_LENGTH}).`];
  }
  return [];
};

type SkillCheck = { files: SkillFiles; skillDir: string; skillFile: string };

/** Why a link that resolves to `resolved` is broken, or `null` when it points to a file inside the skill. */
function linkProblem({ files, skillDir, skillFile }: SkillCheck, resolved: string) {
  if (resolved !== skillFile && !resolved.startsWith(`${skillDir}/`)) return 'points outside the skill folder';
  if (files.read(resolved) === null) return 'does not resolve';
  return null;
}

/** Checks one SKILL.md or reference file. Links found in SKILL.md are added to `linkedFromSkill`. */
function docFileErrors(check: SkillCheck, file: string, linkedFromSkill: Set<string>) {
  const errors: string[] = [];
  const parsed = parseFrontmatter(check.files.read(file) ?? '');
  const isSkill = file === check.skillFile;

  if (!isSkill && (!parsed.data?.title || !parsed.data?.description)) {
    errors.push(`${file}: "title" and "description" frontmatter are required.`);
  }

  for (const { target, line } of findRelativeLinks(parsed.body)) {
    const resolved = posix.normalize(posix.join(posix.dirname(file), target.split('#')[0]));
    const problem = linkProblem(check, resolved);
    if (problem) errors.push(`${file}:${line}: link "${target}" ${problem}.`);
    if (isSkill) linkedFromSkill.add(resolved);
  }
  return errors;
}

/** Validates one skill folder (workspace-relative). Returns human-readable errors; empty means valid. */
export function validateSkill(files: SkillFiles, skillDir: string): string[] {
  const skillFile = posix.join(skillDir, 'SKILL.md');
  const skillText = files.read(skillFile);

  if (skillText === null) return [`${skillFile} is missing.`];

  const { data } = parseFrontmatter(skillText);
  const errors = data
    ? [...nameErrors(skillFile, data.name, posix.basename(skillDir)), ...descriptionErrors(skillFile, data.description)]
    : [`${skillFile}: missing frontmatter.`];

  const references = listReferences(files, skillDir).map((file) => posix.join(skillDir, 'references', file));
  const check: SkillCheck = { files, skillDir, skillFile };
  const linkedFromSkill = new Set<string>();

  for (const file of [skillFile, ...references]) errors.push(...docFileErrors(check, file, linkedFromSkill));
  for (const file of references) {
    if (!linkedFromSkill.has(file)) errors.push(`${file}: not linked from SKILL.md.`);
  }

  return errors;
}

/** Validates every skill in the source. */
export const validateSkills = (files: SkillFiles, config: SyncConfig = SYNC_CONFIG) =>
  listSkills(files, config).flatMap((skill) => validateSkill(files, posix.join(config.sourceDir, skill)));

/** Adds an HTML comment after the frontmatter (or at the top) of a markdown file. */
function withMarkdownNote(text: string, note: string) {
  const { frontmatter, body } = parseFrontmatter(text);
  const rest = body.startsWith('\n') ? body : `\n${body}`;
  return `${frontmatter}<!-- ${note} -->\n${rest}`;
}

/** Every generated file, keyed by workspace-relative path: the published copy of the source folder, for `npx skills`. */
export function buildOutputs(files: SkillFiles, config: SyncConfig = SYNC_CONFIG) {
  const output = new Map<string, string>();
  for (const source of walkFiles(files, config.sourceDir)) {
    const target = posix.join(config.publicDir, posix.relative(config.sourceDir, source));
    const text = files.read(source) ?? '';
    output.set(target, source.endsWith('.md') ? withMarkdownNote(text, generatedNote(source)) : text);
  }
  return output;
}

/** Compares the generated files with the workspace: files to write, and stale files to delete. */
export function planSync(files: SkillFiles, config: SyncConfig = SYNC_CONFIG) {
  const expected = buildOutputs(files, config);
  const write = [...expected].filter(([file, content]) => files.read(file) !== content).map(([file]) => file);

  const remove = walkFiles(files, config.publicDir)
    .filter((file) => !expected.has(file))
    .sort((a, b) => a.localeCompare(b, 'en'));

  return { expected, write, remove };
}

import path from 'node:path';

import { type SkillFiles, walkFiles } from './files.ts';
import { type Frontmatter, findMdxUnsafe, findRelativeLinks, parseFrontmatter, rewriteLinks } from './markdown.ts';

export type SyncConfig = {
  /** Source folder: one sub-folder per skill, plus loose files such as README.md. */
  sourceDir: string;
  /** Generated folder that `npx skills` installs from. */
  publicDir: string;
  /** The skill mirrored to the Mintlify docs site with absolute links. */
  docs: { skill: string; skillFile: string; referencesDir: string };
};

export const SYNC_CONFIG: SyncConfig = {
  sourceDir: 'packages/beeq-skills/src',
  publicDir: 'skills',
  docs: {
    skill: 'beeq',
    skillFile: 'apps/beeq-docs/skill.md',
    referencesDir: 'apps/beeq-docs/skill/references',
  },
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

/**
 * Validates one skill folder (workspace-relative). Returns human-readable errors; empty means valid.
 * `mdx` also checks that prose is safe to publish as MDX.
 */
export function validateSkill(files: SkillFiles, skillDir: string, { mdx = true } = {}): string[] {
  const errors: string[] = [];
  const skillFile = posix.join(skillDir, 'SKILL.md');
  const skillText = files.read(skillFile);

  if (skillText === null) return [`${skillFile} is missing.`];

  const { data } = parseFrontmatter(skillText);
  const folder = posix.basename(skillDir);

  if (!data) {
    errors.push(`${skillFile}: missing frontmatter.`);
  } else {
    if (typeof data.name !== 'string' || !data.name) {
      errors.push(`${skillFile}: "name" is required.`);
    } else if (!SKILL_NAME_PATTERN.test(data.name)) {
      errors.push(`${skillFile}: "name" must be lowercase kebab-case.`);
    } else if (data.name !== folder) {
      errors.push(`${skillFile}: "name" (${data.name}) must match the folder (${folder}).`);
    }

    if (typeof data.description !== 'string' || !data.description) {
      errors.push(`${skillFile}: "description" is required.`);
    } else if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push(
        `${skillFile}: "description" is ${data.description.length} characters (max ${MAX_DESCRIPTION_LENGTH}).`,
      );
    }
  }

  const docFiles = [
    skillFile,
    ...listReferences(files, skillDir).map((file) => posix.join(skillDir, 'references', file)),
  ];
  const linkedFromSkill = new Set<string>();

  for (const file of docFiles) {
    const parsed = parseFrontmatter(files.read(file) ?? '');
    const isSkill = file === skillFile;

    if (!isSkill && (!parsed.data?.title || !parsed.data?.description)) {
      errors.push(`${file}: "title" and "description" frontmatter are required.`);
    }

    for (const { target, line } of findRelativeLinks(parsed.body)) {
      const resolved = posix.normalize(posix.join(posix.dirname(file), target.split('#')[0]));
      if (resolved !== skillFile && !resolved.startsWith(`${skillDir}/`)) {
        errors.push(`${file}:${line}: link "${target}" points outside the skill folder.`);
      } else if (files.read(resolved) === null) {
        errors.push(`${file}:${line}: link "${target}" does not resolve.`);
      }
      if (isSkill) linkedFromSkill.add(resolved);
    }

    if (mdx) {
      for (const { char, line } of findMdxUnsafe(parsed.body)) {
        errors.push(`${file}:${line}: "${char}" outside code breaks MDX; wrap it in backticks.`);
      }
    }
  }

  for (const file of docFiles.slice(1)) {
    if (!linkedFromSkill.has(file)) errors.push(`${file}: not linked from SKILL.md.`);
  }

  return errors;
}

/** Validates every skill in the source. Only the docs skill must be MDX-safe. */
export const validateSkills = (files: SkillFiles, config: SyncConfig = SYNC_CONFIG) =>
  listSkills(files, config).flatMap((skill) =>
    validateSkill(files, posix.join(config.sourceDir, skill), { mdx: skill === config.docs.skill }),
  );

/** Adds an HTML comment after the frontmatter (or at the top) of a markdown file. */
function withMarkdownNote(text: string, note: string) {
  const { frontmatter, body } = parseFrontmatter(text);
  const rest = body.startsWith('\n') ? body : `\n${body}`;
  return `${frontmatter}<!-- ${note} -->\n${rest}`;
}

/** The published copy of the source folder, for `npx skills`. */
function buildPublic(files: SkillFiles, config: SyncConfig, output: Map<string, string>) {
  for (const source of walkFiles(files, config.sourceDir)) {
    const target = posix.join(config.publicDir, posix.relative(config.sourceDir, source));
    const text = files.read(source) ?? '';
    output.set(target, source.endsWith('.md') ? withMarkdownNote(text, generatedNote(source)) : text);
  }
}

/**
 * Marks a reference page `hidden` so Mintlify keeps it out of search, sitemaps, and its AI context.
 * The page must still exist: Mintlify only serves the raw `<page>.md` URL the skill links to for pages.
 */
function asHiddenPage(ref: Frontmatter) {
  if (ref.data?.hidden !== undefined) return ref.frontmatter;
  return ref.frontmatter.replace(/\n---\n?$/, '\nhidden: true\n---\n');
}

/** The docs-site copy of the docs skill: absolute links, and hidden MDX pages for references. */
function buildDocs(files: SkillFiles, config: SyncConfig, output: Map<string, string>) {
  const skillDir = posix.join(config.sourceDir, config.docs.skill);
  const note = generatedNote(skillDir);

  const skill = parseFrontmatter(files.read(posix.join(skillDir, 'SKILL.md')) ?? '');
  const skillFrontmatter = skill.frontmatter.replace(/^---\n/, `---\n# ${note}\n`);
  output.set(config.docs.skillFile, skillFrontmatter + rewriteLinks(skill.body, 'skill'));

  for (const file of listReferences(files, skillDir)) {
    const ref = parseFrontmatter(files.read(posix.join(skillDir, 'references', file)) ?? '');
    const body = rewriteLinks(ref.body, 'reference').replace(/^\n+/, '');
    const target = posix.join(config.docs.referencesDir, file.replace(/\.md$/, '.mdx'));
    output.set(target, `${asHiddenPage(ref)}\n{/* ${note} */}\n\n${body}`);
  }
}

/** Every generated file, keyed by workspace-relative path. */
export function buildOutputs(files: SkillFiles, config: SyncConfig = SYNC_CONFIG) {
  const output = new Map<string, string>();
  buildPublic(files, config, output);
  if (listSkills(files, config).includes(config.docs.skill)) buildDocs(files, config, output);
  return output;
}

/** Compares the generated files with the workspace: files to write, and stale files to delete. */
export function planSync(files: SkillFiles, config: SyncConfig = SYNC_CONFIG) {
  const expected = buildOutputs(files, config);
  const write = [...expected].filter(([file, content]) => files.read(file) !== content).map(([file]) => file);

  const generated = [
    ...walkFiles(files, config.publicDir),
    ...files
      .list(config.docs.referencesDir)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => posix.join(config.docs.referencesDir, file)),
  ];
  const remove = generated.filter((file) => !expected.has(file)).sort();

  return { expected, write, remove };
}

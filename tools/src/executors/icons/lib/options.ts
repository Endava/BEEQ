import { isAbsolute, join, resolve } from 'node:path';

import type { ExecutorContext } from '@nx/devkit';

import type { IconsExecutorSchema, SourceRefType } from '../schema.d.ts';
import { IconsExecutorError } from './errors.ts';

/** All valid values of {@link SourceRefType}, in the order surfaced to users. */
const SOURCE_REF_TYPES: readonly SourceRefType[] = ['commit', 'tag', 'branch'] as const;

/** Default values applied when an option is omitted from `project.json`. */
const DEFAULTS = {
  force: false,
  keepDownload: false,
  metadataFile: '.icons-meta.json',
  minSvgCount: 1,
  skipIfUpToDate: true,
  sourceRefType: 'commit' as SourceRefType,
} as const;

/** Number of hex characters used in the auto-derived commit archive filename. */
const SHORT_SHA_LENGTH = 12;

/**
 * Fully resolved and validated executor options. Every field is guaranteed
 * to be non-empty (except optional `sourceChecksum`) and all paths are
 * absolute against the workspace root.
 */
type NormalizedOptions = {
  absoluteDownloadPath: string;
  absoluteExtractToPath: string;
  archiveFilePath: string;
  archiveUrl: string;
  assetsFolder: string;
  fileName: string;
  force: boolean;
  keepDownload: boolean;
  metadataFile: string;
  metadataFilePath: string;
  minSvgCount: number;
  skipIfUpToDate: boolean;
  sourceChecksum?: string;
  sourceRef: string;
  sourceRefType: SourceRefType;
  sourceUrl: string;
  svgFolder: string;
};

/**
 * Resolve a possibly-relative path against `root`, leaving absolute paths
 * untouched.
 *
 * @param root - Absolute workspace root.
 * @param value - Path to resolve.
 * @returns The absolute form of `value`.
 */
const resolveWithinRoot = (root: string, value: string): string => (isAbsolute(value) ? value : resolve(root, value));

/**
 * Assert that a required schema field is a non-empty string. Throws on
 * failure.
 *
 * @param name - The option name (used in the error message).
 * @param value - The raw value from the schema.
 * @returns The value, guaranteed non-empty.
 * @throws {IconsExecutorError} When `value` is missing or blank.
 */
const assertNonEmpty = (name: keyof IconsExecutorSchema, value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new IconsExecutorError('options', `Option "${String(name)}" is required and must be a non-empty string.`);
  }
  return value;
};

/**
 * Validate `sourceRefType` and apply the default (`'commit'`) when
 * omitted.
 *
 * @param value - The raw `sourceRefType` from the schema.
 * @returns The validated {@link SourceRefType}.
 * @throws {IconsExecutorError} When `value` is not a supported ref type.
 */
const assertRefType = (value: IconsExecutorSchema['sourceRefType']): SourceRefType => {
  const refType = value ?? DEFAULTS.sourceRefType;
  if (!SOURCE_REF_TYPES.includes(refType)) {
    throw new IconsExecutorError(
      'options',
      `Option "sourceRefType" must be one of ${SOURCE_REF_TYPES.join(', ')}. Received "${refType}".`,
    );
  }
  return refType;
};

/**
 * Validate `sourceChecksum`. Accepts `undefined` and any string matching
 * `sha256-<64 hex chars>` (case-insensitive). Returns the lower-cased form
 * so downstream comparisons are safe.
 *
 * @param value - The raw `sourceChecksum` from the schema.
 * @returns The normalized checksum, or `undefined` when unset.
 * @throws {IconsExecutorError} When the value is set but malformed.
 */
const assertChecksum = (value: string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  if (!/^sha256-[a-f0-9]{64}$/i.test(value)) {
    throw new IconsExecutorError('options', `Option "sourceChecksum" must match the pattern "sha256-<64 hex chars>".`, {
      context: { received: value },
    });
  }
  return value.toLowerCase();
};

/**
 * Validate `minSvgCount` and apply its default. Must be a positive
 * integer.
 *
 * @param value - The raw `minSvgCount` from the schema.
 * @returns The validated integer.
 * @throws {IconsExecutorError} When the value is not an integer `>= 1`.
 */
const assertMinSvgCount = (value: number | undefined): number => {
  const count = value ?? DEFAULTS.minSvgCount;
  if (!Number.isInteger(count) || count < 1) {
    throw new IconsExecutorError('options', `Option "minSvgCount" must be an integer >= 1. Received "${count}".`);
  }
  return count;
};

/**
 * Shape-check `sourceRef` when `sourceRefType === 'commit'`. Accepts 7–40
 * hex characters (matches GitHub's short/long SHA range) without a network
 * call — an invalid SHA fails fast rather than surfacing as a 404.
 *
 * @param ref - The raw `sourceRef`.
 * @throws {IconsExecutorError} When `ref` is not a hex SHA of valid length.
 */
const assertCommitShaShape = (ref: string): void => {
  if (!/^[a-f0-9]{7,40}$/i.test(ref)) {
    throw new IconsExecutorError(
      'options',
      `Option "sourceRef" with "sourceRefType: commit" must be a hex SHA (7–40 chars). Received "${ref}".`,
    );
  }
};

/**
 * Extract the repository name from a Git URL: strips query/fragment,
 * trailing slashes, and any `.git` suffix, then returns the last path
 * segment (e.g. `"phosphor-icons/core"` → `"core"`).
 *
 * @param sourceUrl - A Git repo URL.
 * @returns The repository name segment.
 * @throws {IconsExecutorError} When `sourceUrl` doesn't yield a usable
 *   segment. Callers can work around this by passing an explicit
 *   `svgFolder`.
 */
const repoNameFromUrl = (sourceUrl: string): string => {
  const cleaned = sourceUrl.replace(/[?#].*$/, '').replace(/\/+$/, '');
  const segment = cleaned.split('/').pop() ?? '';
  const withoutGit = segment.replace(/\.git$/i, '').trim();
  if (!withoutGit) {
    throw new IconsExecutorError(
      'options',
      `Could not derive a repository name from sourceUrl "${sourceUrl}". Pass an explicit "svgFolder".`,
      { context: { sourceUrl } },
    );
  }
  return withoutGit;
};

/**
 * Produce the archive root folder name GitHub uses inside `<repo>-<ref>`
 * archives, following ref-specific rules:
 *
 * - `tag`    → strip a single leading `v` (`v2.0.8` → `2.0.8`)
 * - `branch` → replace `/` with `-` (`release/1.x` → `release-1.x`)
 * - `commit` → lowercased SHA
 *
 * @param ref - The raw `sourceRef` value.
 * @param refType - The associated {@link SourceRefType}.
 * @returns The folder segment as GitHub would name it.
 */
const normalizeRefForFolder = (ref: string, refType: SourceRefType): string => {
  switch (refType) {
    case 'tag':
      return ref.replace(/^v/, '');
    case 'branch':
      return ref.replace(/\//g, '-');
    default:
      return ref.toLowerCase();
  }
};

/**
 * Build the fully-qualified GitHub archive URL:
 *
 * - `commit` → `<sourceUrl>/archive/<sha>.zip`
 * - `tag`    → `<sourceUrl>/archive/refs/tags/<ref>.zip`
 * - `branch` → `<sourceUrl>/archive/refs/heads/<ref>.zip`
 *
 * Trailing slashes on `sourceUrl` are collapsed so the result is always
 * canonical.
 *
 * @param sourceUrl - Base repo URL (e.g. `https://github.com/owner/repo`).
 * @param sourceRef - The commit SHA, tag, or branch name.
 * @param refType - The associated {@link SourceRefType}.
 * @returns The canonical archive URL.
 */
const buildArchiveUrl = (sourceUrl: string, sourceRef: string, refType: SourceRefType): string => {
  const base = sourceUrl.replace(/\/+$/, '');
  switch (refType) {
    case 'tag':
      return `${base}/archive/refs/tags/${sourceRef}.zip`;
    case 'branch':
      return `${base}/archive/refs/heads/${sourceRef}.zip`;
    default:
      return `${base}/archive/${sourceRef.toLowerCase()}.zip`;
  }
};

/**
 * Derive a human-friendly archive file name for on-disk caching:
 *
 * - `commit` → `<first 12 hex chars>.zip`
 * - `tag`/`branch` → sanitized `<ref>.zip` (non-alphanumeric characters
 *   collapse to `-`, empty results fall back to `archive.zip`).
 *
 * @param sourceRef - The commit SHA, tag, or branch name.
 * @param refType - The associated {@link SourceRefType}.
 * @returns The derived filename (always ends in `.zip`).
 */
const deriveFileName = (sourceRef: string, refType: SourceRefType): string => {
  if (refType === 'commit') {
    return `${sourceRef.slice(0, SHORT_SHA_LENGTH).toLowerCase()}.zip`;
  }
  const safe = sourceRef.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return `${safe || 'archive'}.zip`;
};

/**
 * Validate raw executor options and return a fully normalized structure
 * ready for the download/extract pipeline. Applies all defaults, runs all
 * assertions, auto-derives `fileName`/`svgFolder`/`archiveUrl` from
 * `sourceUrl` + `sourceRef` + `sourceRefType`, and resolves every path
 * against `context.root`.
 *
 * @param options - Raw options as read from `project.json`.
 * @param context - Nx executor context (only `root` is used).
 * @returns The fully normalized options.
 * @throws {IconsExecutorError} Tagged with the `options` phase on any
 *   validation failure.
 */
const normalizeOptions = (options: IconsExecutorSchema, context: Pick<ExecutorContext, 'root'>): NormalizedOptions => {
  const assetsFolder = assertNonEmpty('assetsFolder', options.assetsFolder);
  const downloadPath = assertNonEmpty('downloadPath', options.downloadPath);
  const extractToPath = assertNonEmpty('extractToPath', options.extractToPath);
  const sourceRef = assertNonEmpty('sourceRef', options.sourceRef);
  const sourceUrl = assertNonEmpty('sourceUrl', options.sourceUrl);

  const sourceRefType = assertRefType(options.sourceRefType);
  if (sourceRefType === 'commit') assertCommitShaShape(sourceRef);

  const metadataFile = options.metadataFile ?? DEFAULTS.metadataFile;
  const sourceChecksum = assertChecksum(options.sourceChecksum);
  const minSvgCount = assertMinSvgCount(options.minSvgCount);

  const fileName = options.fileName?.trim() ? options.fileName : deriveFileName(sourceRef, sourceRefType);
  const svgFolder = options.svgFolder?.trim()
    ? options.svgFolder
    : `${repoNameFromUrl(sourceUrl)}-${normalizeRefForFolder(sourceRef, sourceRefType)}`;
  const archiveUrl = buildArchiveUrl(sourceUrl, sourceRef, sourceRefType);

  const absoluteDownloadPath = resolveWithinRoot(context.root, downloadPath);
  const absoluteExtractToPath = resolveWithinRoot(context.root, extractToPath);
  const archiveFilePath = join(absoluteDownloadPath, fileName);
  const metadataFilePath = join(absoluteExtractToPath, metadataFile);

  return {
    absoluteDownloadPath,
    absoluteExtractToPath,
    archiveFilePath,
    archiveUrl,
    assetsFolder,
    fileName,
    force: options.force ?? DEFAULTS.force,
    keepDownload: options.keepDownload ?? DEFAULTS.keepDownload,
    metadataFile,
    metadataFilePath,
    minSvgCount,
    skipIfUpToDate: options.skipIfUpToDate ?? DEFAULTS.skipIfUpToDate,
    sourceChecksum,
    sourceRef,
    sourceRefType,
    sourceUrl,
    svgFolder,
  };
};

export type { NormalizedOptions };
export {
  buildArchiveUrl,
  DEFAULTS,
  deriveFileName,
  normalizeOptions,
  normalizeRefForFolder,
  repoNameFromUrl,
  SOURCE_REF_TYPES,
};

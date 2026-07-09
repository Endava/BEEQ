import { isAbsolute, join, resolve } from 'node:path';

import type { ExecutorContext } from '@nx/devkit';

import type { IconsExecutorSchema, SourceRefType } from '../schema';
import { IconsExecutorError } from './errors';

export const SOURCE_REF_TYPES: readonly SourceRefType[] = ['commit', 'tag', 'branch'] as const;

export const DEFAULTS = {
  force: false,
  keepDownload: false,
  metadataFile: '.icons-meta.json',
  minSvgCount: 1,
  skipIfUpToDate: true,
  sourceRefType: 'commit' as SourceRefType,
} as const;

const SHORT_SHA_LENGTH = 12;

export interface NormalizedOptions {
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
}

const resolveWithinRoot = (root: string, value: string): string => (isAbsolute(value) ? value : resolve(root, value));

const assertNonEmpty = (name: keyof IconsExecutorSchema, value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new IconsExecutorError('options', `Option "${String(name)}" is required and must be a non-empty string.`);
  }
  return value;
};

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

const assertChecksum = (value: string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  if (!/^sha256-[a-f0-9]{64}$/i.test(value)) {
    throw new IconsExecutorError('options', `Option "sourceChecksum" must match the pattern "sha256-<64 hex chars>".`, {
      context: { received: value },
    });
  }
  return value.toLowerCase();
};

const assertMinSvgCount = (value: number | undefined): number => {
  const count = value ?? DEFAULTS.minSvgCount;
  if (!Number.isInteger(count) || count < 1) {
    throw new IconsExecutorError('options', `Option "minSvgCount" must be an integer >= 1. Received "${count}".`);
  }
  return count;
};

const assertCommitShaShape = (ref: string): void => {
  if (!/^[a-f0-9]{7,40}$/i.test(ref)) {
    throw new IconsExecutorError(
      'options',
      `Option "sourceRef" with "sourceRefType: commit" must be a hex SHA (7–40 chars). Received "${ref}".`,
    );
  }
};

/** Extract the last non-empty path segment from a URL, stripping any `.git` suffix. */
export const repoNameFromUrl = (sourceUrl: string): string => {
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

/** Produce the archive root folder name that GitHub uses for `<repo>-<ref>` archives. */
export const normalizeRefForFolder = (ref: string, refType: SourceRefType): string => {
  switch (refType) {
    case 'tag':
      return ref.replace(/^v/, '');
    case 'branch':
      return ref.replace(/\//g, '-');
    case 'commit':
    default:
      return ref.toLowerCase();
  }
};

/** Build the GitHub archive URL based on the ref type. */
export const buildArchiveUrl = (sourceUrl: string, sourceRef: string, refType: SourceRefType): string => {
  const base = sourceUrl.replace(/\/+$/, '');
  switch (refType) {
    case 'tag':
      return `${base}/archive/refs/tags/${sourceRef}.zip`;
    case 'branch':
      return `${base}/archive/refs/heads/${sourceRef}.zip`;
    case 'commit':
    default:
      return `${base}/archive/${sourceRef.toLowerCase()}.zip`;
  }
};

/** Derive a human-friendly archive file name for on-disk caching. */
export const deriveFileName = (sourceRef: string, refType: SourceRefType): string => {
  if (refType === 'commit') {
    return `${sourceRef.slice(0, SHORT_SHA_LENGTH).toLowerCase()}.zip`;
  }
  const safe = sourceRef.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  return `${safe || 'archive'}.zip`;
};

export const normalizeOptions = (
  options: IconsExecutorSchema,
  context: Pick<ExecutorContext, 'root'>,
): NormalizedOptions => {
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

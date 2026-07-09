import { isAbsolute, join, resolve } from 'node:path';

import type { ExecutorContext } from '@nx/devkit';

import { IconsExecutorError } from './errors';
import type { IconsExecutorSchema, PhosphorWeight } from '../schema';

export const PHOSPHOR_WEIGHTS: readonly PhosphorWeight[] = [
  'thin',
  'light',
  'regular',
  'bold',
  'fill',
  'duotone',
] as const;

export const DEFAULTS = {
  force: false,
  keepDownload: false,
  metadataFile: '.icons-meta.json',
  minSvgCount: 1,
  skipIfUpToDate: true,
  weight: 'regular' as PhosphorWeight,
} as const;

export interface NormalizedOptions {
  absoluteDownloadPath: string;
  absoluteExtractToPath: string;
  archiveFilePath: string;
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
  sourceUrl: string;
  svgFolder: string;
  weight: PhosphorWeight;
}

const resolveWithinRoot = (root: string, value: string): string =>
  isAbsolute(value) ? value : resolve(root, value);

const assertNonEmpty = (name: keyof IconsExecutorSchema, value: unknown): string => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new IconsExecutorError('options', `Option "${String(name)}" is required and must be a non-empty string.`);
  }
  return value;
};

const assertWeight = (value: IconsExecutorSchema['weight']): PhosphorWeight => {
  const weight = value ?? DEFAULTS.weight;
  if (!PHOSPHOR_WEIGHTS.includes(weight)) {
    throw new IconsExecutorError(
      'options',
      `Option "weight" must be one of ${PHOSPHOR_WEIGHTS.join(', ')}. Received "${weight}".`,
    );
  }
  return weight;
};

const assertChecksum = (value: string | undefined): string | undefined => {
  if (value === undefined) return undefined;
  if (!/^sha256-[a-f0-9]{64}$/i.test(value)) {
    throw new IconsExecutorError(
      'options',
      `Option "sourceChecksum" must match the pattern "sha256-<64 hex chars>".`,
      { context: { received: value } },
    );
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

export const normalizeOptions = (
  options: IconsExecutorSchema,
  context: Pick<ExecutorContext, 'root'>,
): NormalizedOptions => {
  const assetsFolder = assertNonEmpty('assetsFolder', options.assetsFolder);
  const downloadPath = assertNonEmpty('downloadPath', options.downloadPath);
  const extractToPath = assertNonEmpty('extractToPath', options.extractToPath);
  const fileName = assertNonEmpty('fileName', options.fileName);
  const sourceRef = assertNonEmpty('sourceRef', options.sourceRef);
  const sourceUrl = assertNonEmpty('sourceUrl', options.sourceUrl);
  const svgFolder = assertNonEmpty('svgFolder', options.svgFolder);

  const metadataFile = options.metadataFile ?? DEFAULTS.metadataFile;
  const weight = assertWeight(options.weight);
  const sourceChecksum = assertChecksum(options.sourceChecksum);
  const minSvgCount = assertMinSvgCount(options.minSvgCount);

  const absoluteDownloadPath = resolveWithinRoot(context.root, downloadPath);
  const absoluteExtractToPath = resolveWithinRoot(context.root, extractToPath);
  const archiveFilePath = join(absoluteDownloadPath, fileName);
  const metadataFilePath = join(absoluteExtractToPath, metadataFile);

  return {
    absoluteDownloadPath,
    absoluteExtractToPath,
    archiveFilePath,
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
    sourceUrl,
    svgFolder,
    weight,
  };
};

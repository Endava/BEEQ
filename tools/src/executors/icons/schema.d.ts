/* -------------------------------------------------------------------------- */
/*                       BEEQ icons executor properties                       */
/* -------------------------------------------------------------------------- */

export type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export interface IconsExecutorSchema {
  assetsFolder: string;
  downloadPath: string;
  extractToPath: string;
  fileName: string;
  force?: boolean;
  keepDownload?: boolean;
  metadataFile?: string;
  minSvgCount?: number;
  skipIfUpToDate?: boolean;
  sourceChecksum?: string;
  sourceRef: string;
  sourceUrl: string;
  svgFolder: string;
  weight?: PhosphorWeight;
}

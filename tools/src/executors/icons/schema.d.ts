/* -------------------------------------------------------------------------- */
/*                       BEEQ icons executor properties                       */
/* -------------------------------------------------------------------------- */

export interface IconsExecutorSchema {
  assetsFolder: string;
  downloadPath: string;
  extractToPath: string;
  fileName: string;
  force?: boolean;
  metadataFile?: string;
  minSvgCount?: number;
  skipIfUpToDate?: boolean;
  sourceRef: string;
  sourceUrl: string;
  svgFolder: string;
}

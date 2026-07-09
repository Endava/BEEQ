/* -------------------------------------------------------------------------- */
/*                       BEEQ icons executor properties                       */
/* -------------------------------------------------------------------------- */

export type PhosphorWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';

export type SourceRefType = 'commit' | 'tag' | 'branch';

export interface IconsExecutorSchema {
  assetsFolder: string;
  downloadPath: string;
  extractToPath: string;
  /**
   * Optional archive file name. When omitted, it is derived from `sourceRef`
   * (e.g. `<shortSha>.zip` for commits, `<ref>.zip` otherwise).
   */
  fileName?: string;
  force?: boolean;
  keepDownload?: boolean;
  metadataFile?: string;
  minSvgCount?: number;
  skipIfUpToDate?: boolean;
  sourceChecksum?: string;
  sourceRef: string;
  /**
   * Kind of `sourceRef`. Drives the GitHub archive URL shape:
   *  - `commit` -> `<sourceUrl>/archive/<sha>.zip`     (fully immutable, recommended)
   *  - `tag`    -> `<sourceUrl>/archive/refs/tags/<ref>.zip`
   *  - `branch` -> `<sourceUrl>/archive/refs/heads/<ref>.zip` (moves with every push)
   */
  sourceRefType?: SourceRefType;
  /**
   * Repository root URL (e.g. `https://github.com/phosphor-icons/core`).
   * The `archive/...` suffix is appended automatically based on `sourceRefType`.
   */
  sourceUrl: string;
  /**
   * Optional archive root folder name (as seen inside the downloaded zip).
   * When omitted, it is derived as `<repoName>-<normalizedRef>` where
   * `repoName` is the last segment of `sourceUrl` and `normalizedRef` is the
   * SHA for commits, the ref with a leading `v` stripped for tags, or the
   * ref with `/` replaced by `-` for branches.
   */
  svgFolder?: string;
  weight?: PhosphorWeight;
}

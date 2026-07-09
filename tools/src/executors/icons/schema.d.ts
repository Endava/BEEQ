/* -------------------------------------------------------------------------- */
/*                       BEEQ icons executor properties                       */
/* -------------------------------------------------------------------------- */

/**
 * Kind of Git ref passed as `sourceRef`. Drives the shape of the GitHub
 * archive URL the executor downloads:
 *
 * - `commit` → `<sourceUrl>/archive/<sha>.zip` (fully immutable, recommended)
 * - `tag`    → `<sourceUrl>/archive/refs/tags/<ref>.zip`
 * - `branch` → `<sourceUrl>/archive/refs/heads/<ref>.zip` (moves on every push)
 */
type SourceRefType = 'commit' | 'tag' | 'branch';

/**
 * Input options for the `beeq:icons` local Nx executor.
 *
 * The executor downloads a pinned Phosphor icon archive from GitHub, extracts
 * every weight (thin, light, regular, bold, fill, duotone) into a flat SVG
 * folder, and writes a metadata fingerprint so subsequent runs short-circuit
 * when nothing has changed.
 *
 * Kept in sync with [`schema.json`](./schema.json) — any addition/removal
 * here must be reflected there too (the JSON schema is the source of truth
 * for runtime validation performed by Nx).
 */
type IconsExecutorSchema = {
  /** Assets directory inside the downloaded archive root (e.g. `"assets"`). */
  assetsFolder: string;

  /** Directory (relative to workspace root) where the archive is downloaded. */
  downloadPath: string;

  /** Destination directory (relative to workspace root) for flattened SVG files. */
  extractToPath: string;

  /**
   * Optional archive file name.
   *
   * When omitted, it is derived from `sourceRef`:
   * - `commit` → `<shortSha>.zip` (first 12 characters, lower-cased)
   * - `tag` / `branch` → sanitized `<ref>.zip`
   */
  fileName?: string;

  /**
   * Always refresh icons even when metadata matches.
   *
   * @default false
   */
  force?: boolean;

  /**
   * Keep the downloaded archive on disk after a successful extraction.
   *
   * @default false
   */
  keepDownload?: boolean;

  /**
   * Metadata marker file written inside `extractToPath`. Used by the
   * up-to-date check to decide whether to skip work.
   *
   * @default '.icons-meta.json'
   */
  metadataFile?: string;

  /**
   * Minimum number of SVG files required for a run to be considered valid.
   * Guards against silent upstream layout changes that would ship an empty
   * icon set.
   *
   * @default 1
   */
  minSvgCount?: number;

  /**
   * Skip download and extraction when the existing icons and metadata match
   * the expected fingerprint (source tuple + on-disk hash).
   *
   * @default true
   */
  skipIfUpToDate?: boolean;

  /**
   * Optional expected sha256 checksum of the archive (format:
   * `sha256-<64 hex chars>`). When set, a mismatch aborts the run before
   * extraction; when absent, the observed checksum is captured in the
   * metadata for later pinning.
   */
  sourceChecksum?: string;

  /**
   * Pinned source ref (commit SHA, tag, or branch name). Participates in
   * the cache fingerprint — changing it invalidates the cache.
   */
  sourceRef: string;

  /**
   * Kind of `sourceRef`. Drives the GitHub archive URL shape:
   *
   * - `commit` → `<sourceUrl>/archive/<sha>.zip` (fully immutable, recommended)
   * - `tag`    → `<sourceUrl>/archive/refs/tags/<ref>.zip`
   * - `branch` → `<sourceUrl>/archive/refs/heads/<ref>.zip` (moves on every push)
   *
   * @default 'commit'
   */
  sourceRefType?: SourceRefType;

  /**
   * Repository root URL (e.g. `https://github.com/phosphor-icons/core`).
   * The `archive/...` suffix is appended automatically based on
   * `sourceRefType`.
   */
  sourceUrl: string;

  /**
   * Optional archive root folder name (as seen inside the downloaded zip).
   *
   * When omitted, it is derived as `<repoName>-<normalizedRef>` where
   * `repoName` is the last segment of `sourceUrl` (stripping `.git`) and
   * `normalizedRef` is the SHA (lower-cased) for commits, the ref with a
   * leading `v` stripped for tags, or the ref with `/` replaced by `-` for
   * branches.
   */
  svgFolder?: string;
};

export type { IconsExecutorSchema, SourceRefType };

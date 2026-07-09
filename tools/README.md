# BEEQ Icons: Custom Nx executor

The `icons` local executor downloads a **pinned** [Phosphor icons](https://phosphoricons.com/) archive, extracts a single weight into the BeeQ icon assets folder, and stores a **fingerprint marker** so subsequent runs short-circuit when nothing has changed.

## Design goals

- **Pinned & reproducible** — `sourceRef` (tag or SHA) participates in the cache fingerprint.
- **Idempotent** — a metadata marker (`.icons-meta.json`) plus a strong `iconsHash` (sha256 of sorted per-file digests) lets the executor skip work when the destination already matches the expected state.
- **Deterministic selection** — extracts exactly one Phosphor weight (default `regular`) with basename-collision detection.
- **CI-safe** — uses `@nx/devkit` `logger` and resolves paths against `context.root`; TTY-only spinner locally.
- **Integrity** — optional `sourceChecksum` verifies the downloaded archive against a pinned sha256.

## Running the executor

Although the executor runs as part of `beeq:build-ci`, it can also be triggered directly:

```bash
pnpm exec nx run beeq:icons
```

On subsequent runs with an unchanged source, output looks like:

```
[icons] ✔ BeeQ SVG icon files are already up to date. Skipping download and extraction.
```

Force a refresh regardless of cache state:

```bash
pnpm exec nx run beeq:icons --force
```

## Options

The source of truth is [`schema.d.ts`](./src/executors/icons/schema.d.ts).

```ts
assetsFolder: string;    // Assets directory inside the archive root (e.g. "assets")
downloadPath: string;    // Directory (relative to workspace root) for the archive
extractToPath: string;   // Destination directory for flattened SVGs
fileName: string;        // Archive file name (e.g. "v2.1.0.zip")
sourceUrl: string;       // Base URL used to fetch the archive
sourceRef: string;       // Pinned immutable ref (tag or commit SHA) — part of the fingerprint
svgFolder: string;       // Archive root folder (e.g. "core-2.1.0")

weight?:          'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'; // default: 'regular'
sourceChecksum?:  string;  // Optional expected archive sha256, format: sha256-<64 hex chars>
metadataFile?:    string;  // Marker file inside extractToPath, default: '.icons-meta.json'
force?:           boolean; // Bypass cache, always refresh, default: false
skipIfUpToDate?:  boolean; // Skip work when fingerprint matches, default: true
keepDownload?:    boolean; // Keep archive on disk after success, default: false
minSvgCount?:     number;  // Minimum extracted SVGs required for a valid run, default: 1
```

## Fingerprint metadata

After a successful run, `.icons-meta.json` is written under `extractToPath`:

```jsonc
{
  "assetsFolder": "assets",
  "fileName": "v2.1.0.zip",
  "sourceChecksum": "sha256-…",
  "sourceRef": "v2.1.0",
  "sourceUrl": "https://github.com/phosphor-icons/core/archive/refs/tags",
  "svgFolder": "core-2.1.0",
  "weight": "regular",
  "iconCount": 1234,
  "iconsHash": "sha256-…",
  "generatedAt": "2026-07-09T00:00:00.000Z"
}
```

A run is considered **up to date** when:

1. Metadata exists and matches the expected source tuple (`sourceUrl`, `sourceRef`, `fileName`, `svgFolder`, `assetsFolder`, `weight`, and — when provided — `sourceChecksum`).
2. On-disk SVG count matches `iconCount` and is `>= minSvgCount`.
3. A freshly computed `iconsHash` of the on-disk files matches the stored one.

If any of these fail, the executor refreshes everything.

## Configuration example

Set in [`packages/beeq/project.json`](../packages/beeq/project.json):

```jsonc
"icons": {
  "executor": "../../tools:icons",
  "outputs": ["{options.extractToPath}"],
  "options": {
    "assetsFolder": "assets",
    "downloadPath": "tmp",
    "extractToPath": "packages/beeq/src/components/icon/svg",
    "fileName": "v2.1.0.zip",
    "sourceRef": "v2.1.0",
    "svgFolder": "core-2.1.0",
    "sourceUrl": "https://github.com/phosphor-icons/core/archive/refs/tags",
    "weight": "regular"
  }
}
```

## Testing

Unit tests live under [`src/executors/icons/__tests__/`](./src/executors/icons/__tests__/) and run via Vitest:

```bash
pnpm exec nx run tools:test
```

📖 More about Nx local executors: https://nx.dev/extending-nx/recipes/local-executors

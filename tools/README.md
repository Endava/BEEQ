# BEEQ Icons: Custom Nx executor

The `icons` local executor downloads a **pinned** [Phosphor icons](https://phosphoricons.com/) archive from GitHub, extracts a single weight into the BeeQ icon assets folder, and stores a **fingerprint marker** so subsequent runs short-circuit when nothing has changed.

## Design goals

- **Pinned & reproducible** — the source tuple (`sourceUrl` + `sourceRef` + `sourceRefType`) participates in the cache fingerprint.
- **Fresh & immutable** — pin to a commit SHA to get the latest icons on `main` without relying on upstream tag cadence (Phosphor's last tag is often months behind `main`).
- **Idempotent** — a metadata marker (`.icons-meta.json`) plus a strong `iconsHash` (sha256 of sorted per-file digests) lets the executor skip work when the destination already matches the expected state.
- **Deterministic selection** — extracts exactly one Phosphor weight (default `regular`) with basename-collision detection.
- **CI-safe** — uses `@nx/devkit`'s `logger` and resolves paths against `context.root`; TTY-only spinner locally.
- **Integrity** — optional `sourceChecksum` verifies the downloaded archive against a pinned sha256; observed checksum is always captured in metadata for easy pinning.

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

## Choosing a `sourceRefType`

| `sourceRefType` | GitHub archive URL | Immutable? | Fresh? | When to use |
|---|---|---|---|---|
| `commit` (default) | `<sourceUrl>/archive/<sha>.zip` | ✅ Content-addressed | ✅ Any commit | **Recommended.** Any icon added to `main` is available immediately. |
| `tag` | `<sourceUrl>/archive/refs/tags/<ref>.zip` | ⚠️ Mostly (tags can be force-moved) | ❌ Only as fresh as the last release | You explicitly want to track upstream releases. |
| `branch` | `<sourceUrl>/archive/refs/heads/<ref>.zip` | ❌ Moves on every push | ✅ Always latest | Short-lived experiments only. Not recommended in `main`. |

## Options

The source of truth is [`schema.d.ts`](./src/executors/icons/schema.d.ts).

```ts
// Required
assetsFolder: string;   // Assets directory inside the archive root (e.g. "assets")
downloadPath: string;   // Directory (relative to workspace root) for the archive
extractToPath: string;  // Destination directory for flattened SVGs
sourceUrl: string;      // Repository root URL, e.g. "https://github.com/phosphor-icons/core"
sourceRef: string;      // Commit SHA (default), tag, or branch name — part of the fingerprint

// Optional
sourceRefType?:  'commit' | 'tag' | 'branch';                              // default: 'commit'
weight?:         'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'; // default: 'regular'
fileName?:       string;   // Derived from sourceRef when omitted (e.g. "<shortSha>.zip")
svgFolder?:      string;   // Derived from sourceUrl + sourceRef when omitted (e.g. "core-<ref>")
sourceChecksum?: string;   // Optional expected archive sha256, format: sha256-<64 hex chars>
metadataFile?:   string;   // Marker file inside extractToPath, default: '.icons-meta.json'
force?:          boolean;  // Bypass cache, always refresh, default: false
skipIfUpToDate?: boolean;  // Skip work when fingerprint matches, default: true
keepDownload?:   boolean;  // Keep archive on disk after success, default: false
minSvgCount?:    number;   // Minimum extracted SVGs required for a valid run, default: 1
```

### Auto-derivation rules

When `fileName` or `svgFolder` are omitted, they are derived deterministically:

- `fileName`:
  - `commit` → `<sourceRef.slice(0,12)>.zip` (short SHA for readability)
  - `tag` / `branch` → sanitized `<sourceRef>.zip`
- `svgFolder` = `<repoName>-<normalizedRef>` where:
  - `repoName` = last segment of `sourceUrl` (stripping any `.git` suffix)
  - `normalizedRef` = tag with leading `v` stripped, branch with `/` → `-`, commit lowercased

You can always override either field explicitly for custom mirrors or archives.

## Fingerprint metadata

After a successful run, `.icons-meta.json` is written under `extractToPath`:

```jsonc
{
  "assetsFolder": "assets",
  "fileName": "2b75f3ad12b4.zip",
  "sourceRef": "2b75f3ad12b420c9504ef05df8d2564a28f8500e",
  "sourceRefType": "commit",
  "sourceUrl": "https://github.com/phosphor-icons/core",
  "svgFolder": "core-2b75f3ad12b420c9504ef05df8d2564a28f8500e",
  "weight": "regular",
  "iconCount": 1512,
  "iconsHash": "sha256-…",
  "generatedAt": "2026-07-09T00:00:00.000Z",
  "observedChecksum": "sha256-…",
  "pinnedChecksumHint": "To make future runs fail-fast on upstream drift, copy `observedChecksum` above into your project.json under `sourceChecksum`."
}
```

A run is considered **up to date** when:

1. Metadata exists and matches the expected fingerprint (`sourceUrl`, `sourceRef`, `sourceRefType`, `fileName`, `svgFolder`, `assetsFolder`, `weight`, and — when provided — `sourceChecksum`).
2. On-disk SVG count matches `iconCount` and is `>= minSvgCount`.
3. A freshly computed `iconsHash` of the on-disk files matches the stored one.

If any of these fail, the executor refreshes everything.

### Pinning the archive checksum

`observedChecksum` is always captured on a successful run. To harden the pipeline against silent upstream re-archives, copy it into `project.json`:

```jsonc
"options": {
  "sourceRef": "2b75f3ad12b420c9504ef05df8d2564a28f8500e",
  "sourceRefType": "commit",
  "sourceChecksum": "sha256-…" // paste from observedChecksum
}
```

Once pinned, any checksum mismatch aborts the run before anything is extracted.

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
    "sourceUrl": "https://github.com/phosphor-icons/core",
    "sourceRef": "2b75f3ad12b420c9504ef05df8d2564a28f8500e",
    "sourceRefType": "commit",
    "weight": "regular"
  }
}
```

## Bumping the pinned SHA

1. Pick a commit from https://github.com/phosphor-icons/core/commits/main.
2. Replace `sourceRef` in `packages/beeq/project.json`.
3. Run `pnpm exec nx run beeq:icons` locally.
4. If pinning: copy `observedChecksum` from `.icons-meta.json` into `sourceChecksum`.
5. Commit both `project.json` and the refreshed `packages/beeq/src/components/icon/svg/*.svg` changes.

### Automating with Renovate

Add a custom manager in `renovate.json` to keep the SHA fresh:

```jsonc
{
  "customManagers": [
    {
      "customType": "regex",
      "fileMatch": ["^packages/beeq/project\\.json$"],
      "matchStrings": [
        "\"sourceRef\":\\s*\"(?<currentDigest>[a-f0-9]{40})\""
      ],
      "currentValueTemplate": "main",
      "depNameTemplate": "phosphor-icons/core",
      "packageNameTemplate": "https://github.com/phosphor-icons/core",
      "datasourceTemplate": "git-refs"
    }
  ]
}
```

## Testing

Unit tests live under [`src/executors/icons/__tests__/`](./src/executors/icons/__tests__/) and run via Vitest:

```bash
pnpm exec nx run tools:test
```

📖 More about Nx local executors: https://nx.dev/extending-nx/recipes/local-executors

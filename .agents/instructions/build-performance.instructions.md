---
description: When to use the `BEEQ_SKIP_ICONS` escape hatch and the `:fast` scripts for local builds and e2e runs. Read before running any `:fast` script.
---

# Local build performance: `BEEQ_SKIP_ICONS` and `:fast` scripts

`beeq:build` depends on the `icons` target, and `beeq:storybook-build` and `beeq:e2e` depend on `beeq:build`. The flattened Phosphor SVG assets are therefore always on disk before those targets run. The icons executor is idempotent: a warm run is a sub-second fingerprint check.

The executor honors `BEEQ_SKIP_ICONS=1`, and the repo exposes matching `:fast` scripts for fast local iteration.

## Default

Run the target normally so the icons dependency cache-hits or refreshes. Never break the dependency chain by hand.

```bash
pnpm build            # build:beeq + build:storybook
pnpm build:beeq
pnpm build:storybook
pnpm test:e2e
```

> **Fresh checkout.** `pnpm start` does **not** depend on `beeq:build` or `beeq:icons`, so it 404s on `/svg/*.svg` until the SVG folder is populated. After cloning or running `pnpm clean`, run `pnpm build:beeq` (or `pnpm exec nx run beeq:icons`) once before `pnpm start`.

## `:fast` variants

They set `BEEQ_SKIP_ICONS=1` and skip the icons executor.

```bash
pnpm build:beeq:fast
pnpm build:storybook:fast
pnpm test:e2e:fast
BEEQ_SKIP_ICONS=1 pnpm build
BEEQ_SKIP_ICONS=1 pnpm exec nx run <project>:<target>
```

Use them only when:

- you are iterating on unrelated code (component, styles, docs, tests) and a previous full run populated the SVG folder;
- the pinned `sourceRef` / `sourceChecksum` in `packages/beeq/project.json` has not changed since the last successful icons run;
- you are running many build/test/e2e invocations back-to-back.

## Rules for AI agents

- Prefer `:fast` for iterative local runs when the SVG folder exists and the pinned source is unchanged. Announce the choice (e.g. "running `pnpm build:beeq:fast` — icons unchanged since last run") so a reviewer can catch a wrong assumption.
- Never use `:fast` or set `BEEQ_SKIP_ICONS` when:
  - `sourceRef` / `sourceChecksum` in `packages/beeq/project.json` was just changed;
  - the task involves `bq-icon`, adding or removing icons, or verifying icon rendering;
  - you cannot confirm the SVG folder is populated (fresh checkout, after `pnpm clean`, or after deleting `packages/beeq/src/components/icon/svg/`);
  - the run will be shipped or committed (CI, publish, deploy). `BEEQ_SKIP_ICONS` must never be set in CI or workflow files.
- When in doubt, run the non-`:fast` variant.
- If a build log that is later shipped or deployed contains `Skipped via BEEQ_SKIP_ICONS ...`, that is a bug. Surface it.

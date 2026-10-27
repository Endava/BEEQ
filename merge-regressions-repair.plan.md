# Repair main → migration-branch merge regressions

> **Read first:** [`AGENTS.md`](./AGENTS.md), [`tailwlindcss-migration.plan.md`](./tailwlindcss-migration.plan.md), [`.agents/instructions/tailwind-to-native-scss.instructions.md`](./.agents/instructions/tailwind-to-native-scss.instructions.md), [`.agents/instructions/styles.instructions.md`](./.agents/instructions/styles.instructions.md), [`.agents/instructions/testing.instructions.md`](./.agents/instructions/testing.instructions.md), and the skills `migrate-tailwind-to-scss`, `review-tailwind-migration`, `write-e2e-tests`.

```yaml
agent: devin-local
session: cliff-purpose
created: 2026-10-26T09:12:09Z
consolidated: 2026-10-26 (original plan + independent review + verification pass)
```

The 2026-10-16 merge (`66219508`) resolved most conflicts by keeping the branch side. That dropped #1846, #1862 and `03cd6344` work in migrated components and in the native global foundations.

This plan:

1. records a baseline;
2. adds regression tests that cannot pass on broken tokens;
3. repairs foundations first and components second;
4. verifies every published CSS output.

**Guiding principle:** restore upstream *behaviour* in the native architecture. Don't restore upstream source text, and don't treat a green suite as proof. Every public name must be accounted for (S10).

## Status

Tick each box when the step lands. Keep the red/green evidence next to the step.

- [x] S0. Plan copied into the repo (this file)
- [x] S1. Baseline recorded — fresh build/styles passed; expected 13 e2e failures confirmed
- [x] S2-pre. Spike: parity spec proven runnable (per-file Node environment)
- [x] S2a. Structural token parity spec (red: 13 failing / 20)
- [x] S2b. Runtime token and selector e2e (red: 12 failing / 196)
- [x] S2c. Reset parity spec (red: 12 failing / 16)
- [x] S2d. Scoped `resolveColorToken` helper (7 unit + 7 browser tests pass)
- [x] S3. Native themes — full build confirmed; compiled CSS checks and all 203 focused browser tests pass
- [x] S4. Native reset — 16/16 parity checks and standalone reset build pass
- [x] S5. Table — published CSS verified; all 15 table e2e tests pass
- [x] S6. Tag — published bundle verified; all 34 Tag e2e tests pass
- [ ] S7. Badge
- [ ] S8. Other components (empty-state, page-title, tab-group, spinner, avatar, steps, button)
- [ ] S9. Progress tests
- [ ] S10. Public API reconciliation
- [ ] S11. Generated artifacts and full validation

## Handoff

- **Branch:** `refactor/migrate-tailwindcss-to-native-css`.
- **Pinned baseline:**
  - `main` = `1e4f7b0e45a392684cb82cfb771f0317fa06fcf5` (verified equal to `origin/main` when this plan was written).
  - Don't re-fetch mid-task. If `main` moves, finish first and reconcile separately.
  - Merge under review: `66219508`.
- **Uncommitted work to keep and build on:**
  - `packages/beeq/src/components/button/scss/{bq-button,bq-button.variables}.scss`
  - `packages/beeq/src/global/styles/foundations/themes/{beeq,endava}.scss`
  - `.gitignore` (`.vitest`)
  - `packages/beeq/src/components.d.ts` and `packages/beeq/src/components/badge/readme.md` are generated. Review them before committing; they will change again.
- **Untracked, not part of this work:** `.devin/`, `.zed/`, `packages/beeq/.vitest/` (ignored after the `.gitignore` change). **Stage explicit paths, never `git add -A`.**
- **Commit and push only when the user asks.**
  - Conventional Commits with PascalCase scopes, no `Co-authored-by` trailer.
  - Leave `git stash` alone; back up with `cp`.
  - Never start paid LLM runs.
- **A dev server (`pnpm start`) runs separately.** Don't start another dev server or watcher.
- **Evidence commands:**
  - `git show --remerge-diff 66219508 -- packages/beeq packages/beeq-tailwindcss`: how each conflict was resolved.
  - `git show 5bc728c2 -- <path>` (#1846); `git show 03cd6344 d842c209 3ce5d7cd`.
  - `git show 1e4f7b0e:<path>`: main's current version.
- **Environment pitfalls:**
  - The sandbox blocks the Vitest browser runner (`listen EPERM`). e2e needs an unsandboxed run with user approval: `cd packages/beeq && BEEQ_SKIP_ICONS=true pnpm exec vitest run --project e2e <paths>` (quick iteration only; S1/S11 use the full build).
  - The terminal tool rejects `$VAR`, `$()` and backticks. Use literal commands or `node -e`.
  - Use `git --no-optional-locks status`.

### Disclosure: state of the uncommitted theme work

The earlier theme sync rewrote the four mode blocks in `beeq.scss` and `endava.scss` from `main`'s `{default,endava}/{light,dark}.ts`. That sync was reported as "matches main exactly", but it covered the mode blocks only.

In `beeq.scss`, light and dark now reference 38 `-strong`/`-bright` tokens that the default `:where(:root)` never defines. Role tokens such as `--bq-text--danger` and `--bq-icon--brand` therefore resolve to nothing in the default theme.

The 13 e2e failures are identical with or without that sync, so the sync didn't cause them. Until S3 lands, **colour tests built on `resolveColor('var(--bq-…)')` can pass falsely**, so don't trust them.

## Findings

### How `main` came in

8 merges of `origin/main`. Only two matter:

- `66219508` (2026-10-16) brought #1846, #1855, #1862 and #1864–#1878. #1862 contains every commit in the user's screenshot.
- `6a49b606` (2026-10-26) brought deps and docs. Its only conflicts were `package.json` and `packages/beeq/project.json`, both resolved correctly.

`66219508` had about 30 conflicted files. The pattern:

- The branch side was kept wherever a component had been migrated, dropping main's new public API: custom properties, JSDoc, and the `@import` of new variables files.
- Tests were resolved hunk by hunk, so some files mix main's Tailwind class assertions with branch markup.
- `_table.scss` was a modify/delete conflict and was deleted without porting main's edits.

### Why the 13 e2e tests fail

Verified against git and the code. S1 reproduces the list.

| Test | Cause |
|---|---|
| badge: non-first slotted node | The auto-merged #1797 test still checks the Tailwind classes `digit`/`p-i-xs2`. The branch renders `is-populated`/`is-multiple`. |
| empty-state: custom text colour | The merge dropped `@import './bq-empty-state.variables'` and the `@cssprop`. |
| page-title: custom divider colour | The merge dropped `--bq-page-title--divider-color`. |
| tab-group: border variable | The merge dropped `@import './bq-tab-group.variables'`. |
| table: custom text colour | `--bq-table--text-color` was never ported to `public/_table.scss`. The test still sets it. |
| spinner ×2 | **Only the two colour tests** (`bq-spinner.e2e.tsx` ~lines 167–168 and 186–187) still query the old `.bq-spinner--loader`/`--text` selectors. The other tests already use `__loader`/`__text`. The merge also dropped `--bq-spinner--text-color` and the `--bq-icon--brand` default. |
| progress ×4 | Main's assertions (`invisible` at line 65, `progress-bar__error` at 122, inline `--bq-progress-bar--height` at 172, `progress-bar__border-shape` at 201 and 208) sit on top of branch markup (`bq-progress__*`). |
| tag ×2 | One stale branch test (`closeIconColor`, removed on main). One public-vs-private inline variable conflict. **Decision: main's public inline vars win.** |

### Silent regressions (no failing test)

- **Tag:**
  - 28 `@cssprop` entries lost.
  - The selected state hard-codes `--bq-ui--brand`/`--bq-text--alt`, so `--bq-tag--background-selected` and `--bq-tag--text-selected` are unused.
  - Close-button `:active` mixes with `--bq-hover` instead of `--bq-active`.
  - `--bq-tag--icon-prefix-size` and `--bq-tag--border-radius` are no longer set inline.
  - Private `--_tag-*` are declared on `:host`.
  - The layer prelude uses `bq.utilities`, but `foundations/layers.scss` declares `bq.public`. `@import './bq-tag.variables'` sits outside any `bq-tag.tokens` layer.
- **Badge:**
  - The default text colour reverted to `--bq-text--alt` (main: `--bq-text--on-danger`).
  - The `backgroundColor` JSDoc was lost.
  - `size` became required in the typings (main: `size?`).
- **Avatar:** `@cssprop --bq-avatar--text-color` dropped from the TSX. The variable still exists, so this is a docs loss only.
- **Steps:** divider colour reverted to `--bq-stroke--secondary` (main: `--bq-stroke--primary`).
- **Button:** 12 public variant variables dropped. The uncommitted tree restores them.
- **Native foundations** (what e2e and consumers load through `dist/beeq/beeq.css`):
  - `themes/beeq.scss` root lacks `-strong`/`-bright` and `accent`. Info still resolves to iris (brand) instead of blue. `*-dark` still points at `*-1000` (main: `*-950`).
  - The light selector was not ported from `3ce5d7cd`. The branch uses `:root:not([bq-theme], [bq-mode])` plus `[bq-theme='beeq']:not([bq-mode])`.
  - **Theme and mode selectors are not wrapped in `:where()`**, so they carry specificity (`beeq.scss:100-177`, `endava.scss:67-145`). The preset's theme-swapper wraps every selector in `:where()`, so consumer overrides win at any specificity. The repaired native CSS must preserve that contract; correct source order alone doesn't.
  - `foundations/reset.scss` predates `d842c209`: no `:where()` wrapping, and it lacks `optgroup`, the code/sub/sup rules and `dialog, [popover]` margin. It still has smooth scroll and `text-rendering`.

### Reconciliation inventory

Every upstream change touching migrated files.

Status values:
- `lost`: missing at HEAD
- `partial`: some of it present
- `wip`: in the uncommitted tree
- `ok`: nothing to do
- `ok?`: confirmed by S10

| Upstream | File / API | Current state | Repair | Test | Status |
|---|---|---|---|---|---|
| 5bc728c2 #1846 | `themes/beeq.scss` root: `--bq-{brand,accent,info,success,warning,danger}-{strong,bright}`, info on blue, `*-dark` on `*-950` | Not defined. WIP mode roles reference them, so they resolve to nothing | S3 | S2a/S2b | lost |
| 5bc728c2 #1846 | `themes/endava.scss` root vs `endava/root.ts`, including Endava's later brand-colour correction | Not independently verified; don't assume the WIP is complete | S3 | S2a/S2b | partial |
| 5bc728c2 #1846 | `themes/{beeq,endava}.scss` light/dark roles (`--bq-text--on-*`, accent, strong/bright roles, `--bq-focus`, hover/active) | Mode blocks synced in WIP; root they reference is incomplete for beeq | S3 | S2a/S2b | wip |
| 5bc728c2 / 66219508 | `primitives.scss` Endava palette | Ported in the merge | check only | S2a | ok? |
| 3ce5d7cd | Light selector `:root:not([bq-mode])` for any theme | Native still uses `:root:not([bq-theme],[bq-mode])` + `[bq-theme=beeq]` | S3 | S2b | lost |
| theme-swapper | `:where()` on every theme/mode selector | Plain selectors | S3 | S2b | lost |
| d842c209 | `foundations/reset.scss` | Pre-d842c209 | S4 | S2c | lost |
| f02072b4 #1852 | Keep raw Tailwind directives out of published CSS; separate the Storybook input | `default.scss` is native-only; Stencil global CSS and Storybook share `legacy-tailwind.scss` (components/utilities only) | S3 follow-up | Build-path, Storybook and fresh published Stencil CSS checks pass | verified in S3 |
| 5b684d17, 4029dbe, b27db72, e015c34, 3bb07f5 | Preset plugins only | Merge took main's files; native mixins are generic | none | none | ok |
| 5bc728c2 | `public/_table.scss` `--bq-table--text-color`, bordered `border-color` | Text variable restored; bordered mapping was already present and is retained | S5 | table e2e | verified in S5 |
| 5bc728c2, 03cd6344 | Tag: 28 public vars, selected vars, close-button hover/active, inline public vars | Docs dropped, selected vars unused, active uses hover, private inline | S6 | tag e2e | lost |
| 5bc728c2, a2eb405b #1797 | Badge: `--bq-badge--text-color: on-danger`, `backgroundColor` JSDoc, `size?`, slot test | Reverted / stale test | S7 | badge e2e | lost |
| 5bc728c2 | Empty state `--bq-empty-state--text-color` | Import and `@cssprop` dropped | S8 | e2e | lost |
| 5bc728c2 | Page title `--bq-page-title--divider-color` | Dropped | S8 | e2e | lost |
| 5bc728c2 | Tab group `--bq-tab-group--border-color` | Import dropped | S8 | e2e | lost |
| 5bc728c2 | Spinner `--bq-spinner--text-color`, `--bq-spinner--color: icon--brand` | Dropped / reverted | S8 | e2e | lost |
| 5bc728c2 | Progress `--bq-progress-bar--{indicatorColor-error,label-color,label-color-error}` | Ported | tests only | S9 | partial |
| 5bc728c2 | Avatar `@cssprop --bq-avatar--text-color` | Dropped from TSX JSDoc | S8 | S10 | lost |
| 5bc728c2 | Steps `--bq-steps--divider-color: stroke--primary` | Reverted to `stroke--secondary` | S8 | S10 | lost |
| 5bc728c2 | Button public variant vars `--bq-button--{primary,secondary,link,text}-*` | Dropped; WIP restores them (26/26 button e2e passed on the WIP) | S8 | button e2e | wip |
| 5bc728c2 | Status `--bq-status--dot-color-*`, `--bq-status-circ` alias | Ported in merge | check only | S10 | ok? |
| 5bc728c2 | Card, Divider, Panel, Breadcrumb, Option/Select readmes | Ported in merge | check only | S10 | ok? |

## Implementation order

1. Baseline.
2. Failing tests.
3. Tokens, selectors and reset.
4. Components.
5. Button verification, generated artifacts and full validation.

### S1. Baseline

- Run a fresh full build: `pnpm exec nx run beeq:build --skip-nx-cache` (not `:fast`). Then run `pnpm exec nx run beeq:build-styles --skip-nx-cache` and `pnpm exec nx run beeq:e2e --skip-nx-cache` so the baseline reflects the current working tree, not replayed results.
- Record the failing list in this file. Confirm the 13 failures and note any extras.
- Also record `pnpm exec nx run beeq:test` and `pnpm exec nx run beeq-tailwindcss:test` status, so later reds are attributable.

#### S1 run evidence — 2026-10-26 (Australia/Brisbane)

[Certain] **Initial attempt; superseded by the successful user terminal build below.** Both unit suites and the standalone styles build passed. The diagnostic browser run reproduced exactly the expected 13 failures, with no extras. These initial browser results used existing global CSS. No repairs or new tests were made.

[Certain] Checkout at the start of the run:

- Branch: `refactor/migrate-tailwindcss-to-native-css`.
- HEAD: `6a49b606437da3990773a36354f4e24f558389ab`.
- Local `main` and `origin/main`: `1e4f7b0e45a392684cb82cfb771f0317fa06fcf5`; no fetch performed.
- The tracked WIP paths matched the handoff. The tracked binary diff was identical before and after the commands (`cmp` exit 0), before this evidence edit.

[Certain] Commands and observed results (`--output-style=stream` only exposes task logs):

| Command | Observed result |
|---|---|
| `pnpm exec nx run beeq:build --skip-nx-cache` | Did not finish; interrupted, exit 130. Retried outside the sandbox, then with streamed output, then with stdin closed; each retry also needed interruption (130). |
| `pnpm exec nx run beeq:build-styles --skip-nx-cache --output-style=stream` | PASS, exit 0. Compiled `tokens.scss`, `reset.scss`, and `typography.scss` to their standalone CSS outputs. |
| `pnpm exec nx run beeq:test --skip-nx-cache --output-style=stream` | PASS, exit 0. 46 files, 579 tests passed; coverage enabled. |
| `pnpm exec nx run beeq-tailwindcss:test --skip-nx-cache --output-style=stream` | PASS, exit 0. 4 files; 1,955 passed, 60 skipped (2,015 total). |
| `pnpm exec nx run beeq:e2e --skip-nx-cache --excludeTaskDependencies --output-style=stream` | Diagnostic FAIL, exit 1. 8 files failed, 36 passed (44); 13 tests failed, 1,112 passed (1,125). Build dependency explicitly excluded after the initial full-build attempts did not finish before interruption. |

[Certain] **Initial full-build attempts (not proof of a build defect):** the streamed attempts finished transpilation, generated the custom-elements manifest, and reported hydrate and lazy output completion before interruption. The manifest analyzer process remained alive at 0% CPU in process snapshots after printing `Created new manifest`. Closing stdin did not make that attempt finish. The observed `dist/beeq/dist/beeq/beeq.css` modification time was then **18:27**. The earlier process/plugin lifecycle diagnosis was unsupported and is withdrawn: the user's subsequent terminal build completed successfully.

[Certain] The initial diagnostic run excluded build dependencies and used the existing global CSS, so its passing tests were not proof of current global-token parity. The later user terminal run below completed the normal build dependency chain. All completed validation runs used `--skip-nx-cache`; no `:fast` script or `BEEQ_SKIP_ICONS` override was used. The full-build icon target verified the assets were already up to date.

[Certain] Exact diagnostic failure list:

| Component | Failing test |
|---|---|
| badge | `should update content length when a non-first slotted node changes` |
| empty-state | `should apply a custom text colour` |
| page-title | `should apply a custom divider colour` |
| tab-group | `should use the border color variable for the divider` |
| table | `should apply a custom text colour` |
| spinner | `should use the colour custom properties` |
| spinner | `should apply custom colour overrides` |
| progress | `should render the progress bar without label` |
| progress | `should render the error type styles` |
| progress | `should render the large thickness styles` |
| progress | `should render the rounded border shape` |
| tag | `should render the close icon with alt text color for custom color removable tags` |
| tag | `should set the tag text color variable (not the global token) for custom colors` |

[Certain] Browser summary:

```text
Test Files  8 failed | 36 passed (44)
     Tests  13 failed | 1112 passed (1125)
  Start at  21:02:18
  Duration  52.09s
```

[Certain] Full command logs and the pre/post tracked-diff snapshots are retained locally in `/tmp/beeq-s1-baseline-20261026/`: `build.log`, `build-retry.log`, `build-stream.log`, `build-closed-stdin.log`, `build-styles.log`, `core-test.log`, `preset-test.log`, `preset-test-stream.log`, `e2e-diagnostic.log`, `pre-build.patch`, and `post-build.patch`. These are temporary local evidence, not repository artifacts.

[Certain] **Initial remaining gate (updated below):** the first attempt lacked a successful fresh full build and subsequent styles/e2e results.

#### S1 follow-up — full publishable build

[Certain] Ran the user's full publishable build command without changes:

```bash
pnpm exec nx run-many -t build --exclude='*,!tag:publishable' --parallel --output-style=static --skip-nx-cache
```

[Certain] The icon target reported its assets were already up to date, and the preset build completed. The overall command remained running for several minutes without a final result. A process snapshot at 3m49s showed the core build and manifest analyzer still alive at 0% CPU. This does not establish the cause or prove the build would never finish; the earlier attempts were interrupted too soon to establish a stall conclusively.

[Certain] The user then requested that the process be stopped and said they would run it in a separate terminal and report back. Sent Ctrl-C; the command exited 130. That interrupted agent run did not produce a successful full-build result. Log: `/tmp/beeq-s1-baseline-20261026/publishable-build.log`.

#### S1 final status — baseline complete

[Certain] **User-supplied terminal evidence:** the user ran the full publishable build command above and supplied the complete success output. Nx reported `Successfully ran target build for 5 projects and 2 tasks they depend on`, duration **2m48s**, cache skipped. Core compilation finished in **145.62s**, including a **110.34s** copy of **27,238 files**. React, Vue and both Angular entrypoints built successfully. This is user-provided execution evidence, not an agent-run success claim.

[Certain] **Local artifact check:** `dist/beeq/dist/beeq/beeq.css` modification time was **2026-10-26 21:16:13**, consistent with the supplied build log. The initial assertion of a build blocker is withdrawn; the earlier interrupted attempts did not establish a defect.

[Certain] **Agent-run styles check after that build:** `pnpm exec nx run beeq:build-styles --skip-nx-cache --output-style=static` passed (exit 0, 1.9s), compiling tokens, reset and typography. Log: `/tmp/beeq-s1-baseline-20261026/build-styles-after-user-build.log`.

[Certain] Started `pnpm exec nx run beeq:e2e --skip-nx-cache --output-style=static` with its build dependencies intact. The user then asked to run e2e in their own terminal. Interrupted the agent run with Ctrl-C (exit 130) before any browser test result was reported. Log: `/tmp/beeq-s1-baseline-20261026/e2e-after-user-build.log`.

[Certain] **Fresh e2e evidence supplied by the user:** the terminal output for `pnpm exec nx run beeq:e2e --skip-nx-cache --output-style=static` includes all three build dependencies, a successful full core build (**75.41s**), and the completed Chromium test run. Nx reports the e2e target failed, with cache skipped and an overall duration of **2m38s**. The browser tests started at **21:22:29** and took **64.19s**. This is user-provided terminal evidence, not an agent-run result.

```text
Test Files  8 failed | 36 passed (44)
     Tests  13 failed | 1112 passed (1125)
  Start at  21:22:29
  Duration  64.19s
```

[Certain] Compared all 13 `FAIL` entries against the component/test-name pairs in the diagnostic failure table above: **no unexpected failures and no missing expected failures**. That table is now confirmed as the fresh-build baseline failure list as well.

[Certain] Source evidence: `/Users/dramos/.codex/attachments/2dae5073-fd86-4712-a288-f92ec88ccb58/Pasted text.txt`. The attachment includes the successful dependency build, individual assertion errors and screenshot paths, final Vitest totals, and Nx's failed-target summary. These results supersede the initial diagnostic-only browser evidence.

[Certain] **S1 is complete:** full uncached build and standalone styles passed; fresh uncached e2e reproduced exactly the expected 13 failures; core unit tests passed **579/579** across 46 files; preset unit tests passed **1,955**, with **60 skipped**, across 4 files. The baseline is recorded, not green. No repairs or S2 work have started.

### S2-pre. Spike: prove the parity spec can run

Do this before building the rest of the plan around it. An implicit Nx dependency doesn't prove the import works in the `spec` environment.

- Create a throwaway spec in `packages/beeq/src/global/styles/__tests__/` that:
  - imports one preset file by relative path (`packages/beeq-tailwindcss/src/theme/default/root.ts`) or from the built package;
  - compiles `foundations/themes/index.scss` with `sass` (root dependency `1.101.0`);
  - parses the result with `postcss` (root dependency `8.5.23`).
- Run it with `pnpm exec nx run beeq:test`.
- If it can't run in the `stencil` environment, choose between a node-environment spec (via a per-file environment override) or a standalone script run by an Nx target. Record the decision here.

#### S2-pre evidence — 2026-10-26 (Australia/Brisbane)

[Certain] Added the temporary `packages/beeq/src/global/styles/__tests__/parity-spike.spec.ts`. It imports `DefaultRootTheme` directly from `packages/beeq-tailwindcss/src/theme/default/root.ts` using a relative source path, compiles `foundations/themes/index.scss` with the existing `sass` dependency, and parses the resulting CSS with `postcss`. A PostCSS declaration walk finds `--bq-radius--full` and checks its value against the imported preset token (`9999px`). This proves executable infrastructure, not theme/reset parity.

[Certain] First ran the full suite in the default Stencil environment:

```bash
pnpm exec nx run beeq:test --skip-nx-cache --output-style=static
```

```text
TypeError: compile is not a function
Test Files  1 failed | 46 passed (47)
     Tests  1 failed | 579 passed (580)
```

[Certain] **Decision:** use `// @vitest-environment node` on the filesystem-based parity specs. With that per-file override, the same full uncached Nx command passed (exit 0): **47 files, 580 tests passed**, including the spike; coverage remained enabled. No Vitest/Nx configuration, dependencies, or existing component test environments were changed. A standalone script or new Nx target is unnecessary for this spike.

[Certain] Biome checked the spike file successfully (`Checked 1 file`); `git diff --check` passed. Full run logs are retained locally at `/tmp/beeq-s2-pre-20261026/spec.log` (Stencil failure) and `/tmp/beeq-s2-pre-20261026/node-spec.log` (Node success).

[Certain] **S2-pre is complete.** Keep the spike temporarily as the runnable example, then replace it with S2a/S2c, retaining the per-file Node override. The initial infrastructure failure is not S2a–S2c red proof. No parity regression specs, helper changes, or production repairs were made in this step.

### S2. Regression tests (must be red before S3/S4)

**S2a. Structural token parity** (`packages/beeq/src/global/styles/__tests__/theme-parity.spec.ts`, `spec` project)

- Compile `foundations/tokens` + `foundations/themes` with `sass`. Parse with the `postcss` AST and walk rules inside `@layer`. No regex selector splitting.
- Normalise values: whitespace, hex case, `#fff` vs `#ffffff`, `var()` spacing.
- **Oracle:** the preset token objects.
  - `packages/beeq-tailwindcss/src/theme/colors/base.ts`
  - `default/{root,light,dark}.ts`
  - `endava/{root,light,dark}.ts`
  - Label it in the file header as a **temporary, test-only migration oracle**. It must not make the preset the runtime authority, and it can be dropped once the preset is retired.
- Compare per block (beeq root/light/dark, endava root/light/dark): the **names** declared and the **raw reference value** (e.g. `var(--bq-danger-strong)`).
  - Keep an explicit allowlist of native-only names (interaction aliases such as `--bq-state-mix-*`, ring vars, `::backdrop` shared tokens). Don't require identical sets.
  - Assert that every `var(--bq-…)` referenced in a mode block is defined in the matching root or primitives scope. This is a name-level reachability check.
- **Do not build a CSS-variable resolver** (inheritance, cascade, fallbacks, cycles). Resolution is verified in the browser (S2b).
- Assert **selector coverage and order** structurally:
  - every theme/mode selector is wrapped in `:where()`;
  - the light selector set includes `:root:not([bq-mode])`;
  - the Endava light block comes after the generic light block;
  - dark comes after light.

**S2b. Runtime token resolution and selector contract**

Browser e2e, e.g. `packages/beeq/src/global/styles/__tests__/themes.e2e.tsx`. It loads `dist/beeq/dist/beeq/beeq.css`.

- **Fixtures:**
  - Apply each fixture below to `document.documentElement` for the root contract. Restore attributes, classes and injected styles after each test.
  - no attributes;
  - `bq-theme="acme"` without `bq-mode`;
  - `bq-theme="beeq"` light and dark;
  - `bq-theme="endava"` without mode, light and dark;
  - class selectors `.beeq`/`.endava`/`.light`/`.dark`.
  - Repeat representative explicit BEEQ/Endava light/dark cases on a nested theme container to verify scoped theming independently of the root.
- **Per fixture**, read the key role tokens raw: `--bq-text--primary`, `--bq-text--danger`, `--bq-text--on-danger`, `--bq-icon--brand`, `--bq-stroke--info`, `--bq-ui--info`, `--bq-focus`.
  - Assert non-empty.
  - Assert the resolved concrete colour equals the expected hex from the oracle, normalised to browser colour serialization. Use `resolveColorToken(name, scope)` from S2d with the root or nested container as appropriate; the probe must inherit from that scope, not an unrelated `document.body`.
- **Precedence:**
  - For root fixtures, `:root { --bq-text--primary: red }` in an unlayered consumer sheet, and separately in a consumer `@layer` declared after `bq.themes`, wins over BEEQ declarations on that same root.
  - For nested fixtures, target the theme container itself with the consumer override. A root override is inherited only where the container does not declare its own value; it is not expected to beat a declaration directly on that container.
  - The Endava light block wins over the generic light block when `bq-theme="endava"`.
- **Conflicting selectors:** preserve the pinned preset's winning values rather than introducing a universal "dark wins" rule. Assert representative role colours for these root fixtures:

  | Root attributes | Root class | Expected mode roles |
  |---|---|---|
  | `bq-theme="beeq" bq-mode="light"` | `dark` | BEEQ dark |
  | `bq-theme="beeq" bq-mode="dark"` | `light` | BEEQ dark |
  | `bq-theme="endava" bq-mode="light"` | `dark` | Endava light |
  | `bq-theme="endava" bq-mode="dark"` | `light` | Endava dark |

  The Endava-light block follows generic dark, so it wins in the third case. Verify these expectations against the pinned preset output before asserting native parity.
- Test observable behaviour, not "import order proves parity".

**S2c. Reset parity**

A spec comparing the compiled `foundations/reset.scss` rules (selector + declarations, via the postcss AST) with `packages/beeq-tailwindcss/src/theme/reset.ts`. Allow logical-property equivalents (`max-inline-size` for `max-width`, and so on).

**S2d. Shared test helper hardening**

- Add the colour-specific helper `resolveColorToken(name: string, scope: HTMLElement = document.documentElement): string` in `packages/beeq/src/shared/test-utils/` (next to `computedStyle.ts`, exported from `index.ts`).
- Read the custom property from `getComputedStyle(scope)` and throw if empty. Resolve it through a temporary probe inheriting from that scope with `color: var(--x, rgb(1, 2, 3))`; throw if the computed result is the sentinel. Return the computed colour and always remove the probe. This helper is for colour tokens, not spacing or other token types.
- Use it in new and updated colour tests instead of bare `resolveColor('var(--…)')`.
- Add a unit test in `shared/test-utils/__tests__/`. Verify actual CSS resolution in browser tests: root and scoped values, a nested value different from the root, and missing/unresolved tokens. Use expected fixture colours distinct from the sentinel.
- Note in the follow-ups that the remaining component tests still use the bare helper.

**Gate:** run S2a–S2c and paste the red output here. They must fail on the current tree. S2d is a helper, so it has no red proof.

#### S2 implementation and red proof — 2026-10-26 (Australia/Brisbane)

[Certain] **S2 is complete; S3/S4 repairs have not started.** Replaced the temporary spike with `theme-parity.spec.ts` and `reset-parity.spec.ts`, both using the per-file Node environment. Added `themes.e2e.tsx`, the exported `shared/test-utils/resolveColorToken.ts`, and its unit/browser tests.

[Certain] Structural checks compile the native foundations with Sass and inspect PostCSS AST nodes within the theme layers. They compare all six blocks against the preset objects, check primitive coverage and reference-name reachability, account explicitly for native interaction aliases, and check selector wrapping, generic light coverage and source order. Values normalize whitespace, hex forms, `var()` spacing and equivalent legacy/modern RGB notation. Reset checks compare selector/media coverage and declarations, accepting the logical equivalents used by native CSS. No CSS-variable resolver was introduced.

[Certain] Browser checks cover 20 root fixtures (including all four conflicting-selector cases), four nested theme/mode fixtures, all seven specified role colours per fixture, unlayered and later-layer consumer overrides, and nested declarations versus inherited root overrides. Attributes, classes, styles and fixture nodes are restored or removed after each test.

[Certain] **Oracle validation:** the relevant preset source files have no diff against pinned main `1e4f7b0e`. The temporary `fixtures/pinned-preset.css` contains actual theme-swapper output plus primitive colours. `preset-output.spec.ts` independently rebuilds that output from the source plugin and checks the fixture matches. Browser tests render it in an isolated iframe and validate each concrete hex expectation and selector-conflict outcome before checking native CSS. This oracle remains test-only and can be removed when the preset is retired.

[Certain] Full uncached spec run (agent-run, exit 1 as expected):

```bash
pnpm exec nx run beeq:test --skip-nx-cache --output-style=static
```

```text
reset-parity.spec.ts (16 tests | 12 failed)
theme-parity.spec.ts (20 tests | 13 failed)
Test Files  2 failed | 48 passed (50)
     Tests  25 failed | 598 passed (623)
  Start at  22:52:35
  Duration  2.70s
```

[Certain] All 25 failures are in the two new parity specs. The existing 579 unit tests, the seven new helper unit tests and the preset-output verification passed. The other passing new assertions are structural checks that already match the oracle.

[Certain] Focused browser run against the successfully built S1 global stylesheet (agent-run, exit 1 as expected; no full build was rerun):

```bash
pnpm --dir packages/beeq exec vitest run --project e2e \
  src/global/styles/__tests__/themes.e2e.tsx \
  src/shared/test-utils/__tests__/resolveColorToken.e2e.tsx --reporter=verbose
```

```text
Test Files  1 failed | 1 passed (2)
     Tests  12 failed | 191 passed (203)
  Start at  22:52:10
  Duration  5.25s
```

[Certain] All 12 browser failures are later-layer overrides: eight root fixtures and four nested fixtures. Each expected `rgb(255, 0, 0)` for `--bq-text--primary`, but received the BEEQ/Endava mode default. All 168 per-role comparisons, all unlayered consumer overrides, all four nested-versus-inherited override checks and the seven helper browser tests passed.

[Certain] **Additional gaps exposed by S2 (carry into S3/S11):**

- `foundations/tokens/primitives.scss` lacks the six preset `-950` primitives for blue, gold, iris, purple, red and teal. These must accompany the repaired BEEQ dark root aliases.
- All four mode blocks lack `--bq-box-shadow--{xs,s,m,l}`. The preset defines them at mode level, including dark shadows that reference the current `--bq-stroke--primary`. The name-reachability check explicitly allows that preset shadow reference while still requiring colour roles to reference roots/primitives.
- The built `beeq.css` contains unlayered preset mode declarations in addition to the native declarations inside `bq.themes` (verified by walking the built CSS AST). Those unlayered declarations supply the currently missing tokens and make the runtime colour assertions pass, but beat consumer overrides in later layers. Repairing native theme sources alone will not satisfy the published full-bundle layer contract. Preserve the intentional legacy components/utilities while addressing that output; no build pipeline change was made in S2.

[Certain] **S2d green evidence:** an isolated spec run of `resolveColorToken.spec.ts` and `preset-output.spec.ts` passed **8/8** tests across two files. The helper reads the token from its requested scope, rejects empty/unresolved values, rejects defined non-colours using `CSS.supports`, uses a sentinel fallback probe, and removes it even on failure. Browser tests verify root resolution, a different nested value and scoped reference, missing/unresolved/cyclic values, the sentinel, invalid colour values and probe cleanup.

[Certain] Biome passed on all **10** new/changed TypeScript files. A focused `tsc --noEmit` check of the new specs, browser tests and helper (with the repository's non-strict setting and Node/Vite/DOM types) passed. `git diff --check` passed. The pre-existing tracked WIP diff was byte-identical before/after this step, excluding the intentional new helper export. No component tests were rewritten and no commits or pushes were made.

[Certain] Full local logs: `/tmp/beeq-s2-20261026/spec-final-red.log`, `browser-final-red.log`, `helper-and-oracle-green.log`, and `typecheck-final.log`. An initial browser launch from the package directory failed before testing because it selected a fallback pnpm without Node on PATH; launching from the repository root with `pnpm --dir packages/beeq` resolved it. That launch failure is not regression red proof.

[Certain] **Follow-up remains:** existing component colour tests still use bare `resolveColor`; switch touched tests to `resolveColorToken(name, host)` in the later repair steps, and migrate the rest separately. S2 did not rerun the full component e2e suite; its 13-failure baseline remains the separately recorded S1 evidence.

### S3. Native themes (`foundations/themes/{beeq,endava,shared,index}.scss`), building on the WIP

- **Roots, both of them.**
  - `beeq.scss` `:where(:root)` against `default/root.ts`: `-strong`/`-bright` for brand/accent/success/danger/warning/info, info on the blue palette, accent aliases, `*-dark` on `*-950`.
  - `endava.scss` root against `endava/root.ts`, including Endava's later brand-colour correction. Check the latest commit touching that file and don't assume the WIP is complete.
- **Modes:**
  - Finish all four blocks against `{default,endava}/{light,dark}.ts`.
  - Every mode object defines the same roles.
  - Mode roles reference root semantics only, never primitives (preset `AGENTS.md` rule).
- **Selectors (match the preset, including `:where()`):**
  - Wrap every theme and mode selector in `:where()`.
  - Light: `:where(:root:not([bq-mode]), .beeq:not([bq-mode]), [bq-mode='light'], .light)`.
  - Endava light after the generic light.
  - Dark after light.
  - Keep the preset's source order.
- S2a/S2b turn green. Verify the compiled `beeq.css`, not only the SCSS.

### S4. Native reset (`foundations/reset.scss`)

Mirror `d842c209` rule by rule, with logical properties and `:where()` as in `reset.ts`:

- drop the `* { font: inherit }` rule, html smooth scroll and body `text-rendering`;
- add `optgroup`, `code/kbd/samp/pre`, `sub/sup` and `dialog, [popover] { margin: auto }`.

S2c turns green.

#### S3/S4 implementation and validation — 2026-10-26/27 (Australia/Brisbane)

[Certain] **At this initial validation point, S4 was complete and S3 awaited full-build/browser verification. S3 is now complete; see the final verification below.** No S5+ component repairs have started.

[Certain] Native foundation changes:

- `themes/beeq.scss`: restored strong/bright intent aliases, corrected info to blue, pointed dark aliases at `-950`, removed the obsolete root focus default, and restored the generic `:root:not([bq-mode])` light selector. Both modes use `:where()` and declare mode-specific shadow tokens.
- `themes/endava.scss`: preserved the root values matching the latest upstream change (`4fa2c487`, Red Orange correction), wrapped both mode selector sets in `:where()`, and added the same four mode-specific shadow names. Native source order remains BEEQ root/light/dark, Endava root/light/dark.
- `themes/shared.scss`: wrapped the shared root selector in `:where()` while retaining the standalone `::backdrop` selector and all interaction aliases.
- `tokens/primitives.scss`: restored the six missing blue/gold/iris/purple/red/teal `-950` literals. Root/backdrop primitive coverage is retained.
- `foundations/reset.scss`: matches the pinned preset reset with logical dimensions/insets/margins, zero-specificity element groups, optgroup inheritance, code and sub/sup rules, and dialog/popover centering. Removed legacy smooth scrolling, reduced-motion `html:focus-within` duplication, and body `text-rendering`.

[Certain] **Initial global CSS build correction (superseded by the shared-input follow-up below):** the first implementation used an empty implicit prelude for `src/global/styles/default.{scss,css}`, retaining explicit legacy directives in `default.scss`. The approved follow-up moves those directives to a shared build-only input. Component CSS continues using the original bridge configuration, including its prelude required by legacy `@layer components`/`@apply` (Slider demonstrated that dependency). The regular component transformer, preset package, dependency versions and Nx build targets were not changed.

[Certain] Added two `global-build.spec.ts` checks using the actual configured CSS transformer: compiled global CSS has exactly four primary-text mode declarations, all inside `bq.themes`; a synthetic legacy component still resolves `@layer components` + `@apply` correctly. Both pass. This is build-path evidence, not a substitute for the pending full Stencil build/browser verification.

[Certain] **S2 infrastructure corrections caught during the full build/lint checks:**

- Added `**/__tests__/**` to `tsconfig.lib.json` exclusions. The S2 support modules otherwise entered the production composite project and pulled preset source files outside its file list (TS6307). Vitest's test selection remains unchanged.
- Reset selector normalization now treats quoted and unquoted plain identifier attribute values as equivalent: Sass serializes `[role='list']` as `[role=list]`. This does not change the required selector semantics or declarations.
- Renamed the exact oracle fixture to `fixtures/pinned-preset.css.txt` and updated its two consumers, so package-wide Stylelint treats it as literal test data. Its contents and byte-for-byte source-plugin verification are unchanged; lint rules were not weakened.

[Certain] Validation completed by the agent:

| Check | Result |
|---|---|
| `pnpm exec nx run beeq:test --skip-nx-cache --output-style=static` | PASS, exit 0: **51 files, 625 tests**. Includes S2a **20/20**, S2c **16/16**, and both new build-path tests. |
| `pnpm exec nx run beeq-tailwindcss:test --skip-nx-cache --output-style=static` | PASS, exit 0: **1,955 passed / 60 skipped**, four files. |
| Scoped strict Stylelint on the five touched native SCSS files | PASS; no diagnostics. |
| `pnpm exec nx run beeq:stylelint --skip-nx-cache --output-style=static` | PASS, exit 0: normal migration-tolerant package gate. |
| Biome on the configuration/test changes | PASS; final check selected **9 files**. |
| Focused `tsc --noEmit` on configuration and new/changed tests | PASS, exit 0. |
| `pnpm exec nx run beeq:build-styles --skip-nx-cache --output-style=static` | PASS, exit 0: tokens/reset/typography compiled. |
| Standalone CSS AST checks | PASS: tokens.css **8 rules / 681 token declarations**; reset.css **15 rules / zero tokens**, including optgroup and no `optimizeSpeed`; typography.css **11 rules / zero tokens**, with public font token references. |
| `git diff --check` | PASS. |

```text
Test Files  51 passed (51)
     Tests  625 passed (625)
```

[Certain] **Full-build handoff:** the first attempt exposed the test-support compiler inclusion issue; the next exposed the legacy component prelude dependency. Both were corrected as described above. Subsequent attempts with the corrected code produced no final build result after several minutes, including a terminal-transcript retry. The user requested to run the full build in their own terminal. Stopped the agent terminal run with Ctrl-C (exit 130). No successful full build or green S2b result is claimed for these repairs yet.

[Certain] Remaining S3 verification after the user's successful build:

1. Re-run standalone styles if the full build cleared those outputs.
2. Inspect refreshed `dist/beeq/dist/beeq/beeq.css`: native roles must remain layered, with no unlayered duplicate preset theme declarations. Confirm the expected public legacy classes remain present.
3. Run the focused browser suite against that refreshed bundle:

```bash
pnpm --dir packages/beeq exec vitest run --project e2e \
  src/global/styles/__tests__/themes.e2e.tsx \
  src/shared/test-utils/__tests__/resolveColorToken.e2e.tsx --reporter=verbose
```

[Certain] All **203** focused browser checks must pass before ticking S3. The S2 red proof remains recorded above. The broader component failure baseline is still separate S1 evidence; S3/S4 has not yet rerun it.

[Certain] Local evidence directory: `/tmp/beeq-s3-s4-20261026/` (the run crossed midnight). Key logs: `spec-final.log`, `preset-tests.log`, `global-build-spec.log`, `stylelint-strict-final.log`, `stylelint-package.log`, `biome-final.log`, `typecheck.log`, `build-styles.log`, and `full-build-terminal.log`. No commits or pushes were made.

#### S3 approved follow-up — shared legacy input (2026-10-27)

[Certain] The user approved revising the temporary migration boundary to preserve the intent of upstream #1852 (`f02072b4`): keep `default.scss` native-only and isolate the remaining Tailwind generation. This supersedes the earlier instruction to retain explicit directives in `default.scss`; it does not remove legacy generation.

[Certain] Implemented:

- Moved the two components/utilities directives into `src/global/styles/legacy-tailwind.scss`, a build-only input with no Tailwind base. `default.scss` now contains native imports only, including the public styles.
- Configured the existing global-only Stencil transformer to read that input through `tailwindCssPath`. The legacy component transformer remains unchanged.
- Updated `scripts/build-styles.mjs` to prepend that same input to its compiled native CSS before Storybook's Tailwind processing. Its native-only tokens/reset/typography path is unchanged; the existing source watcher also covers the shared input.
- Updated the migration plan's build architecture and final cleanup tasks to account for the shared input, and added #1852 to this plan's reconciliation inventory.

[Certain] The build-path tests now reject residual `@tailwind`/`@apply` directives and any unlayered `--bq-*` declaration in processed global CSS. They also confirm global `.focus` and `.text-xs` generation from the shared input, plus the existing legacy component `@layer`/`@apply` scenario.

[Certain] Validation:

| Check | Observed result |
|---|---|
| Full uncached `beeq:test` | PASS, exit 0: **51 files, 626 tests**. |
| Final focused build-path spec after strengthening the unlayered-token assertion | PASS, exit 0: **3/3** tests. |
| Uncached `beeq:storybook-build-css` before and after relocation | Both PASS, exit 0. |
| Storybook output comparison | All **451 selector/context declaration maps**, font-face blocks and the layer prelude are unchanged. Output ordering differs due to prepending the shared input. No raw Tailwind/apply directives or unlayered primary-text mode declarations remain. |
| Uncached `beeq:build-styles` | PASS, exit 0; all three standalone native entrypoints still compile. |
| Uncached `beeq:stylelint` | PASS, exit 0. |
| Strict Stylelint on `default.scss` | PASS, exit 0. |
| Migration-tolerant Stylelint on `legacy-tailwind.scss` | PASS, exit 0; strict rules were not weakened. |
| Biome | Configuration/spec pass; the `.mjs` script was checked via Biome stdin with a `.js` filename because repository file selection excludes `.mjs`. |
| Focused TypeScript check | PASS, exit 0. |
| `git diff --check` | PASS. |

[Certain] Logs and the before-output snapshot are in `/tmp/beeq-legacy-input-20261027/`: `storybook-before.log`, `storybook-before.css`, `storybook-after.log`, `artifact-comparison.log`, `build-path-final.log`, `spec-final.log`, `stylelint.log`, `standalone-styles.log`, `typecheck.log`, and `biome-script-final.log`.

[Certain] **At the end of this follow-up, S3 still awaited the user's full build and fresh-bundle checks. Those checks are now complete, as recorded below.** No S5+ repairs, commits or pushes were made.

#### S3 final verification — 2026-10-27 (Australia/Brisbane)

[Certain] **S3 and S4 are complete.** The user supplied the successful uncached full publishable build output after the shared-input change. Nx reported success for all five projects and their two dependent tasks, cache skipped, duration **1m43s**. Core compilation finished in **72.39s**, including a **37.85s** copy of **27,238 files**; React, Vue and both Angular entrypoints completed successfully. This is user-provided terminal execution evidence, distinct from the agent-run checks below.

[Certain] The local published `dist/beeq/dist/beeq/beeq.css` modification time was **2026-10-27 10:59:12**, consistent with that build log. The agent checked the refreshed artifact using PostCSS:

```text
beeq.css PASS: 949 BEEQ declarations all layered; 4 primary-text mode blocks; no raw Tailwind/apply
Public BEEQ class names unchanged: 9
```

[Certain] The public class-name comparison used the pre-S3 `beeq.css` snapshot. No unlayered `--bq-*` declarations remain, and no `@tailwind` or `@apply` at-rules remain. This verifies the published-bundle portion of #1852's reconciliation alongside the native layer contract.

[Certain] The agent refreshed the standalone styles with `pnpm exec nx run beeq:build-styles --skip-nx-cache --output-style=static` (PASS, exit 0) and checked the resulting CSS:

```text
tokens.css PASS: 8 rules; 681 BEEQ declarations
reset.css PASS: 15 rules; 0 BEEQ declarations
typography.css PASS: 11 rules; 0 BEEQ declarations
```

[Certain] The agent then ran the focused browser command recorded above against the refreshed full bundle (PASS, exit 0):

```text
Test Files  2 passed (2)
     Tests  203 passed (203)
  Start at  10:59:52
  Duration  4.52s
```

[Certain] This includes all **196** native theme/selector/consumer-override checks and all **7** colour-helper browser checks. The **12** later-layer override failures captured in S2 are now green. Combined with the previously recorded **626 passing specs**, the S2a/S2b/S2c red-to-green gates for S3/S4 are satisfied.

[Certain] Local logs: `/tmp/beeq-s3-final-20261027/browser.log`, `build-styles.log`, and `artifact-checks.log`. The complete component e2e suite was not rerun in this verification; its S1 failure baseline remains separate evidence for S5–S9. No S5+ implementation work, commits or pushes were made.

### S5. Table (`global/styles/public/_table.scss`)

- Add `--bq-table--text-color: var(--bq-text--primary)` with `@prop`. Use it for `th` and `td` `color`.
- Bordered `border-color` uses `var(--bq-table--border-color)`.
- Check against `git show 1e4f7b0e:packages/beeq/src/global/styles/_table.scss`.

#### S5 implementation — 2026-10-27 (Australia/Brisbane)

[Certain] **S5 is complete; final build/browser evidence is recorded below.** Added `--bq-table--text-color: var(--bq-text--primary)` and its `@prop` entry to `public/_table.scss`; both `th` and `td` now consume that variable. The existing bordered table/cell rules already used `--bq-table--border-color`, so no border repair was needed. The public class selectors, logical properties and `bq.public` layer are unchanged.

[Certain] Compared against pinned main `1e4f7b0e`: all **13 public table variable declarations** now match. The existing table colour tests now use `resolveColorToken(name, root)` while retaining the original semantic-role expectations. The default text test additionally checks that the public table token resolves to the primary text colour. The custom-text test now checks both header and body cells after a blue override.

[Certain] Before editing, the agent reran the original table tests against the S3/S4 bundle:

```text
Test Files  1 failed (1)
     Tests  1 failed | 14 passed (15)
  Start at  11:17:06
  Duration  2.14s
```

[Certain] The sole failure was the expected `should apply a custom text colour` regression. This is pre-repair red evidence, not a post-repair result.

[Certain] Completed checks: strict Stylelint on `public/_table.scss`, uncached package `beeq:stylelint`, Biome on the table e2e file, a focused TypeScript check using the repository's legacy-decorator settings, and `git diff --check` all pass. Uncached `beeq:storybook-build-css` also passes; PostCSS checks confirm the compiled table default, header/cell text-variable references, and all three bordered table/header/cell colour references. Unrelated tracked WIP is byte-identical to its pre-S5 snapshot.

[Certain] The agent ran `CI=true pnpm exec nx run beeq:build --skip-nx-cache --output-style=stream` to refresh the published CSS. It still had no final result after **10m57s** (process snapshot; build and analyzer at 0% CPU), so the agent stopped this verification attempt with Ctrl-C (**exit 130**). That attempt produced no build/browser success result, and no production build configuration was changed for it. At that point, a successful terminal build and the following test were still required; the user's subsequent results below now satisfy that gate:

```bash
pnpm --dir packages/beeq exec vitest run --project e2e \
  src/components/table/__tests__/bq-table.e2e.tsx --reporter=verbose
```

[Certain] Local evidence is in `/tmp/beeq-s5-20261027/`: `table-before.log`, `build.log`, `storybook-css.log`, `storybook-artifact-checks.log`, `public-api-check.log`, `stylelint-package.log`, `typecheck.log`, and the unrelated-WIP snapshots. The initial standalone TypeScript command omitted the legacy-decorator flags; its diagnostics were corrected by rerunning with the repository settings, with no component changes. No S6+ work, commits or pushes were made.

#### S5 final verification — 2026-10-27 (Australia/Brisbane)

[Certain] **User-run full build:** the user supplied the complete successful uncached publishable build output. Nx reported success for **five projects and two dependent tasks**, cache skipped, duration **2m5s**. Core compilation finished in **103.60s**, including a **70.36s** copy of **27,238 files**. React, Vue and both Angular entrypoints completed successfully.

[Certain] **User-run table e2e:** the user supplied the completed Chromium output for the table file, including every individual test result:

```text
Test Files  1 passed (1)
     Tests  15 passed (15)
  Start at  11:42:07
  Duration  1.82s
```

[Certain] The custom-text-colour regression is now green, including both header and body assertions. Default text, selected-row colours, bordered colour overrides, compact spacing, corner radii and overflow checks also pass. This is user-provided execution evidence, not an agent-run browser result.

[Certain] **Independent artifact check:** the agent verified `dist/beeq/dist/beeq/beeq.css` with PostCSS. Its modification time was **2026-10-27 11:36:49**, consistent with the user's build log. The full published stylesheet contains the restored table text default and both header/cell references, retains the bordered colour-variable mappings, and contains no raw Tailwind/apply directives. Log: `/tmp/beeq-s5-20261027/published-css-check.log`.

[Certain] With the pre-repair **1 failed / 14 passed** run and the final **15 passed** result, S5's red-to-green verification is complete. The earlier lint, type, upstream API comparison and Storybook compilation evidence remains valid. The broader component e2e suite was not rerun here. No S6+ changes, commits or pushes were made.

### S6. Tag (`bq-tag.tsx`, `scss/bq-tag.scss`, `scss/bq-tag.variables.scss`, test)

**Layers**
- Align the prelude with `foundations/layers.scss`: `bq.reset, bq.tokens, bq.themes, bq.base, bq.public, bq.overrides`. This replaces `bq.utilities`. Then `bq-tag.tokens, bq-tag.base, bq-tag.structure, bq-tag.variants, bq-tag.states, bq-tag.parts`.
- Move `@import './bq-tag.variables'` inside `@layer bq-tag.tokens { … }`. Check how other layered components do it.

**Prop-to-public-variable mapping (TSX)**
- Restore main's inline host styles:
  - `--bq-tag--icon-prefix-size`
  - `--bq-tag--border-radius` (from `border`)
  - `--bq-tag--background-color` and `--bq-tag--text-color: var(--bq-text--alt)` (custom colour)
- This is prop-to-public-variable mapping, the same as Badge's `backgroundColor`. It is not internal mutation of public variables for variant/state styling, which stays prohibited.
- Custom-colour and border mappings must disappear when those props change or are removed. Changing or removing `size` must replace its old icon-size mapping; existing prop validation restores `medium` (`24px`) when size is removed. Verify these transitions through Stencil re-renders.

**Private locals**
- Move every `--_tag-*` declaration from `:host` into the `.bq-tag` rule (`bq-tag.base`), each mapped from its public variable.
- This stops them being set on the host and keeps the inline public vars feeding them.
- **They are unsupported implementation details, not private.** `::part(wrapper)` can still reach them. Don't document them and don't claim they can't be overridden. Test public customisation, not inaccessibility.

**Variants and states**
- Variants: `:host([color='…'][variant='…']) .bq-tag { --_tag-…: var(--bq-tag--…) }`.
- Size: `:host([size='small']:not([border])) .bq-tag` for the radius (main's `.has-border` rule). Same for `xsmall`. `border` is a reflected prop, so the selector works.
- Selected: `:host([selected][clickable]:not([color], [removable])) .bq-tag` uses `--bq-tag--background-selected`/`--bq-tag--text-selected`. Hover mixes that selected background.

**Interaction**
- Focus: `@include bq-focus-ring` / `bq-focus-visible` instead of a hand-written outline.
- Hover: `@include bq-color-mix(background-color, var(--_tag-background-color), hover)`.
- Close button `::part(button)`: hover uses `hover`, active uses `active` (`03cd6344`). The icon uses `--_tag-text-color`.

**Docs:** restore the 28 `@cssprop` entries (TSX) and `@prop` entries (variables).

**Tests (behavioural)**
- Main's custom-colour test stays unchanged.
- Replace the stale `closeIconColor` test with a **computed-colour** test: on a custom-colour removable tag, the close icon's computed colour equals the resolved `--bq-text--alt`. This keeps the legibility scenario.
- Setting each public variable on the host changes the wrapper's computed style:
  - `--bq-tag--background-color`
  - `--bq-tag--text-color`
  - `--bq-tag--border-radius`
  - `--bq-tag--background-selected` and `--bq-tag--text-selected` on a selected clickable tag
- **Size/border regression (small and xsmall):**
  - default radius is the size's radius;
  - an explicit `border` overrides it;
  - removing `border` after render restores the size's radius, with no stale inline `--bq-tag--border-radius`.
- Changing `color` from custom to `info`, or removing `border` or `size`, leaves no stale inline public vars and gives the expected computed colours and radius.
- Don't assert `--_tag-*` emptiness on the host as a privacy guarantee. If kept, label it a regression check on where the locals are declared.

#### S6 implementation — 2026-10-27 (Australia/Brisbane)

[Certain] **S6 is complete; final build/browser evidence is recorded below.** Restored the inline public mappings for custom colour, border radius and prefix-icon size. Internal `--_tag-*` declarations now live on the wrapper; variant and selected-state selectors update those wrapper locals through public variables. Small/xsmall radius defaults apply only without an explicit reflected `border`. Public variable defaults are inside `bq-tag.tokens`, and the global layer prelude uses `bq.public`.

[Certain] Focus and hover use the shared mixins. The close button now uses the active mix for its pressed state, and its icon consumes the wrapper text colour. Restored the 28 dropped `@cssprop` and `@prop` entries; both files' full sets of 40 documented variable names match pinned main (`1e4f7b0e`). No prop defaults, reflected props, events, slots or parts were changed.

[Certain] The Tag browser suite now has 34 tests. The custom-colour public-variable test is unchanged. The stale close-icon attribute assertion now checks the rendered icon's computed colour, and colour expectations use scoped `resolveColorToken`. Added host public-variable overrides, selected overrides, both small/xsmall border precedence and removal, custom→info→default colour transitions, and size removal/prefix-icon sizing. Radius expectations resolve their scoped tokens to browser pixel values.

[Certain] **Plan clarification:** removing `size` invokes the existing validator and restores the `medium` default, so the old small prefix-size mapping must become `24px`, rather than disappear. The new test preserves that existing contract. Removing custom colour or border must clear its respective inline public variables.

| Check | Result |
|---|---|
| Original Tag suite against the existing S5-built bundle | 2 failed / 26 passed; stale icon-attribute and missing public custom-colour mappings reproduced |
| Expanded suite against that same pre-S6 bundle | 6 failed / 28 passed; public custom-colour mapping, selected overrides, both size/border cases, colour transition, and public prefix-size mapping fail |
| Strict Stylelint scoped to Tag SCSS | Passed |
| Uncached package `beeq:stylelint` | Passed, 2 tasks succeeded |
| Biome on Tag TSX and e2e tests | Passed |
| Focused TypeScript check with repo decorator/strict settings and Playwright provider types | Passed |
| Sass compilation with injected shared mixins; PostCSS checks | Passed; all 42 internal declarations target the wrapper, layer prelude is native, close active mix uses active tokens |
| Pinned-main documentation API comparison | Passed; 40 names each in TSX and variables docs |
| Full publishable build and Tag e2e against refreshed bundle | Passed; user-run uncached build (2m 12s), then 34/34 Tag browser tests (6.17s) |

[Certain] Local logs and the compiled Sass inspection artifact are in `/tmp/beeq-s6-20261027/`: `baseline.log`, `regressions-before-build.log`, `typecheck.log`, `stylelint-package.log`, and `tag.css`. The initial standalone TypeScript invocation picked stricter defaults and omitted provider type augmentation; the final command uses the repo's `strict: false` and `@vitest/browser-playwright` types and passes. At that initial validation point, no production bundle had been rebuilt and no green result was claimed. The final verification below supersedes that pending status. Unrelated WIP is preserved; no S7+ repairs, commits or pushes were made.

#### S6 final verification — 2026-10-27 (Australia/Brisbane)

[Certain] The user ran the full publishable build with `--skip-nx-cache`, `--parallel`, and static output. All five publishable projects and their two dependency tasks succeeded in **2m 12s**. Stencil completed in **78.15s**, including copying 27,238 files in 37.55s; React, Vue and both Angular entrypoints built successfully. Existing Rollup and Tailwind warnings remained non-failing.

[Certain] The user's fresh-bundle Chromium run passed **34/34 Tag tests**, starting at **12:12:56**, with a total duration of **6.17s**. This includes the public custom-colour mapping, computed close-icon colours, selected overrides, small/xsmall border removal, colour transitions and prefix sizing. The size-removal test emits the expected existing validation warning before restoring `medium`; the test passes. The expanded suite's pre-repair **6 failed / 28 passed** result now has a verified green result.

[Certain] Independently inspected refreshed lazy bundle `dist/beeq/dist/beeq/p-55a8ebf9.entry.js` (mtime **12:06:57.035 AEST**). It contains the public inline mappings, selected-variable mappings, small-size border guard, native layer prelude and active-state mix. Evidence is in `/tmp/beeq-s6-20261027/fresh-artifact-check.log`. The build refreshed `components.d.ts`: compared with the pre-S6 snapshot, its only new content is the restored Tag documentation in all three generated API sections. Other generated WIP remains, and the other tracked unrelated WIP is unchanged.

[Certain] S6 is complete. The full component e2e suite and S11's broader artifact gates were not rerun for this step. No S7+ repairs, commits or pushes were made.

### S7. Badge

- Restore the `backgroundColor` JSDoc, `--bq-badge--text-color: var(--bq-text--on-danger)` and `size?: TBadgeSize`.
- Keep the #1797 mutation scenario: two slotted spans, then clear the second.
  - Assert `is-populated`.
  - Poll `is-multiple` → false.
  - Assert the computed inline padding returns to the single-digit value.
- `--bq-text--on-danger` exists in the current mode blocks (`beeq.scss` lines 153 and 226). Confirm it resolves via S2b.

### S8. Other components

- **Empty state:** `@import` variables (inside a tokens layer if the component is layered). Title and body use `color: var(--bq-empty-state--text-color)`. Add the `@cssprop`.
- **Page title:** `--bq-page-title--divider-color: var(--bq-stroke--primary)` with `@prop`. `--subtitle-borderBlockEnd: 1px solid var(--bq-page-title--divider-color)`. Keep the legacy variable chain.
- **Tab group:** `@import` variables. The `::after` background uses `var(--bq-tab-group--border-color)`.
- **Spinner:**
  - Add `--bq-spinner--text-color` (variable, `@prop`, `@cssprop`), used by `.bq-spinner__text`.
  - Set `--bq-spinner--color: var(--bq-icon--brand)`.
  - Fix **only the two colour tests** (lines ~167–168 and ~186–187) to use `.bq-spinner__loader`/`.bq-spinner__text` and `resolveColorToken` with the tested host as scope. Leave the other tests alone.
- **Avatar:** restore the `@cssprop --bq-avatar--text-color`.
- **Steps:** `--bq-steps--divider-color: var(--bq-stroke--primary)`.
- **Button: implementation present, verification pending.**
  - The variables and rules are in the WIP, and the button e2e passed 26/26 when the WIP was written.
  - Re-run it after S3, because the tokens it consumes change.
  - Compare against `git show 1e4f7b0e:packages/beeq/src/components/button/scss/bq-button.scss`: primary/secondary/danger/ghost/link/text, and hover and active mixes.
  - Add or confirm a consumer-override check for the restored public variables.
  - Mark done only after that.

### S9. Progress tests (visible behaviour)

Confirm each assertion is feasible against the real element structure (`.bq-progress__*`) before writing it. If a pseudo-element query isn't reliable, assert on the resolved custom property or the nearest element instead.

- **No label:** label computed `visibility: hidden`, `inline-size: 0px`.
- **Error:**
  - `type="error"` is reflected.
  - The indicator colour equals the resolved `--bq-progress-bar--indicatorColor-error`.
  - The label colour equals the resolved `--bq-progress-bar--label-color-error`.
- **Indeterminate + error:** `.bq-progress__indeterminate` background is the error colour.
- **Large:** bar `blockSize: 8px`.
- **Rounded:** `border-radius: 9999px`. **Square:** `0px`.

### S10. Public API reconciliation

Write a one-off script (or an Nx target if useful). For every migrated component in the inventory, compare the **sets** of public names between `1e4f7b0e` and the **working tree** (not HEAD, so uncommitted repairs count):

- `@cssprop`/`@prop` names
- `@part`/`@slot` names
- `@Prop` names, defaults and optionality
- public `--bq-*` declared in variables files

Every difference must be an intentional migration change listed in the inventory. Update the Status column, and resolve each `ok?`.

Keep the script's output as the **upstream-change reconciliation checklist**, so "all tests pass" can't hide silent API losses.

### S11. Generated artifacts and full validation

- Run the full `pnpm exec nx run beeq:build`, then `pnpm exec nx run beeq:build-styles`.
- Verify each refreshed output under `dist/beeq/dist/beeq/` against its own responsibility; standalone entrypoints must remain independently consumable:

  | Output | Required content | Content excluded from standalone output |
  |---|---|---|
  | `beeq.css` | Updated foundations and public styles, plus temporary legacy output | Not applicable: this is the full global stylesheet |
  | `css/tokens.css` | Primitives, theme/mode selectors and shared interaction tokens | Reset and typography rules |
  | `css/reset.css` | Updated reset rules | Theme token declarations and typography utility rules |
  | `css/typography.css` | Typography rules referencing public tokens | Bundled reset and theme token definitions |

  Check each file separately; successful component compilation does not prove the standalone outputs were refreshed.
- Run `pnpm exec nx run beeq:storybook-build-css` (`--storybook --minify`). Spot-check Tag, Progress and theme switching in Storybook.
- Run `pnpm docs:generate-beeq-mintlify-css` (it reads `dist/beeq/dist/beeq/beeq.css`). Review the `apps/beeq-docs/beeq-mintlify.css` diff.
- Review the regenerated `components.d.ts`, readmes and `cem/` before staging. Stage explicit paths.

## Verification

- `pnpm exec nx run beeq:e2e`: all pass, including the new S2b/S6/S7/S9 tests. No baseline failure remains.
- `pnpm exec nx run beeq:test`: S2a/S2c green, with red-proof output recorded from S2.
- `pnpm exec nx run beeq-tailwindcss:test` (contrast and theme-swapper).
- Run strict Stylelint from `packages/beeq`, once per touched component: `pnpm exec stylelint "src/components/<component>/scss/**/*.{css,scss}" --config .stylelintrc.strict.json`.
- From the same directory, run strict Stylelint on an explicit list of touched native foundation files, public partials and mixins: `pnpm exec stylelint <touched-native-files> --config .stylelintrc.strict.json`. Expand the placeholder to actual file paths; do not use a whole-global-directory glob that includes `default.scss`.
- Keep the normal migration-tolerant `pnpm exec nx run beeq:stylelint` gate for the package. `default.scss` is native-only and must also pass scoped strict Stylelint. The temporary `@tailwind components`/`utilities` directives live only in the shared build input `legacy-tailwind.scss`; keep that input outside the strict native-files gate until final Tailwind cleanup. Do not weaken lint rules to make this repair pass.
- Don't use the full `nx run beeq:stylelint-strict` as a component gate while legacy styles remain.
- `pnpm exec nx affected -t check --exclude='*,!tag:core' --parallel=3`; Biome.
- S10 reconciliation: no unexplained differences.
- `git diff 1e4f7b0e -- 'packages/beeq/src/components/*/bq-*.tsx' | grep '^-.*@cssprop'`: nothing missing. This is a quick sanity check; S10 is the real gate.

## Risks and follow-ups

- Colour tests that passed on fallback or inherited colours may start failing after S3. Treat them as real.
- With prop-to-public-variable mapping on Tag, a consumer's stylesheet override of `--bq-tag--background-color` loses to the `color` prop's inline value (same as `main`).
- The preset oracle in S2a/S2c is temporary. Delete or replace it when the preset stops being the token source.
- Follow-up: migrate the remaining component colour tests from bare `resolveColor` to scoped `resolveColorToken`.
- Follow-up: a merge checklist for future `main` merges. Run S10 plus the parity specs after every merge.
- Follow-up: Storybook Tailwind utilities remain out of scope unless this work claims Storybook has been migrated.

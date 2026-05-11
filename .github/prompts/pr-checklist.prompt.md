---
description: Run the BEEQ PR merge checklist — verifies tests, stories, docs, and PR title format before marking a PR ready for review.
agent: ask
---

You are helping a BEEQ Design System contributor prepare a pull request.

Use `get_changed_files` to list the files changed on the current branch, then work through every checklist item below. For each item state: **pass**, **fail** (with a specific reason), or **n/a** (with a brief justification).

After the full review, output a prioritised list of any action points the contributor must address before the PR can be merged.

---

## 1. Tests

- [ ] If any file under `packages/beeq/src/shared/` was added or changed → a corresponding `.spec.ts` unit test exists and was updated
- [ ] If any component TSX or SCSS file was added or changed → an E2E test file exists at `packages/beeq/src/components/<name>/__tests__/bq-<name>.e2e.tsx` and covers the changed behavior

## 2. Storybook

- [ ] If a component was added or a `@Prop` / `@Event` was changed → a Storybook story file exists or was updated under `packages/beeq/src/components/<name>/_storybook/`

## 3. Documentation

- [ ] If a component was added or its public API changed → a Mintlify MDX page exists or was updated at `apps/beeq-docs/components/<name>.mdx`

## 4. PR title format

Check the most recent commit message or ask the user for the intended PR title, then verify:

- [ ] Follows Conventional Commits: `<type>(<scope>): <subject>`
- [ ] `<type>` is one of: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- [ ] `<scope>` is the component or package name (e.g. `bq-button`, `beeq-react`)
- [ ] `<subject>` is lowercase, imperative mood, no trailing period, ≤ 72 characters total on the first line
- [ ] If a breaking change: title includes `!` after the scope (e.g. `refactor(bq-checkbox)!: ...`) and the commit body contains a `BREAKING CHANGE:` footer
- [ ] If documentation-only: subject ends with `[ci skip]`

## 5. Local verification commands

Remind the contributor to run these before pushing (do **not** run them yourself):

```bash
# Lint, format, and type-check
pnpm exec nx affected -t check --exclude='*,!tag:core' --parallel=3

# Unit tests
pnpm exec nx affected -t test --exclude='*,!tag:core' --parallel=3

# Build
pnpm exec nx affected -t build --exclude='*,!tag:publishable' --parallel=3

# E2E tests
pnpm exec nx affected -t e2e --exclude='*,!tag:core' --parallel=3
```

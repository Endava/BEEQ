---
name: pr-checklist
description: 'Run the BEEQ PR merge checklist on the current branch and report pass, fail or n/a per item: tests, stories, docs, consumer skill, PR title format. Use before marking a PR ready for review. To write the code or docs themselves use the component, test or doc skills.'
argument-hint: 'Optional intended PR title'
metadata:
  internal: true
---

# BEEQ PR Checklist

Review the current branch against the merge checklist. The rules live in [git workflow](../../instructions/git-workflow.instructions.md) (PR merge checklist, PR rules, breaking changes). Do not restate them here.

## Procedure

1. List the files changed on the current branch (`git diff --name-only $(git merge-base HEAD main)`).
2. Work through every item of the **PR merge checklist** in the git workflow instructions. Mark each **pass**, **fail** (with a specific reason) or **n/a** (with a brief justification). Typical mappings:
   - `packages/beeq/src/shared/` changed: a `.spec.ts` exists and was updated.
   - Component TSX or SCSS changed: `packages/beeq/src/components/<name>/__tests__/bq-<name>.e2e.tsx` covers the change.
   - Component added or `@Prop` / `@Event` changed: a story exists under `__storybook__/`, and `apps/beeq-docs/components/<name>.mdx` is updated.
   - Public API, pattern or design rule changed: `packages/beeq-skills/src/beeq/` is updated, and `skills/` was regenerated with `pnpm skills:sync`.
3. Check the PR title (use the argument, otherwise the latest commit message) against the **PR rules** and **Breaking changes** sections: Conventional Commits format, type allowed by `.commitlintrc.ts`, lowercase subject of at most 72 characters, `!` and `BREAKING CHANGE:` footer when breaking, `[ci skip]` when docs-only.
4. Remind the contributor to run the verification commands listed in the checklist. Do **not** run them yourself.
5. Finish only when every checklist item and every title rule has a verdict. Output the per-item results, then a prioritised list of action points that must be fixed before merge.

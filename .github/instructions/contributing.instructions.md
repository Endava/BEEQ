---
description: BEEQ contribution conventions — branching strategy, commit message format, PR rules, merge checklist, and breaking change / deprecation patterns. Apply when writing commits, drafting PRs, or generating changelogs.
applyTo: '**/*,!{.nx,.stencil,.volta,node_modules,dist,tmp}/**/*'
---

# Contributing to BEEQ

Full details are in [CONTRIBUTING.md](../../CONTRIBUTING.md). This file distils the rules the AI needs to enforce or apply automatically.

---

## Branch naming

Branch directly from `main`. Prefix must match the commit type:

| Prefix | When to use |
|---|---|
| `feat/<name>` | New feature or component |
| `fix/<name>` | Bug fix |
| `hotfix/<name>` | Production hotfix |
| `docs/<name>` | Documentation-only changes |
| `test/<name>` | Test additions or fixes |
| `refactor/<name>` | Code change with no behavior change |
| `perf/<name>` | Performance improvement |
| `chore/<name>` | Build process, tooling, or auxiliary changes |
| `style/<name>` | Formatting or whitespace — no logic change |

Use kebab-case for `<name>`. Examples: `feat/bq-slider`, `fix/bq-input-validation`.

---

## Commit message format

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Rules

- **type**: one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- **scope**: the component or package affected — use the `bq-<name>` or `<component name>` or `<package name>` (e.g. `bq-button`, `beeq-react`, `beeq-tailwindcss`)
- **subject**: imperative mood, lowercase first letter, no trailing period, ≤ 72 characters total for the first line
- For documentation-only commits, append `[ci skip]` to the subject
- Reference issues and PRs in the body or footer, not the subject

### Examples

```
feat(bq-slider): add range selection support
feat(Slider): add range selection support

fix(bq-input): prevent value change event firing on programmatic updates
fix(Input): prevent value change event firing on programmatic updates

docs(bq-badge): add Mintlify MDX page [ci skip]
docs(Badge): add Mintlify MDX page [ci skip]

test(bq-checkbox): add e2e coverage for indeterminate state
test(Checkbox): add e2e coverage for indeterminate state

chore(deps): update @stencil/core to 4.x
```

---

## PR rules

- The **PR title must follow the same commit message format** as above — it becomes the squash-merge commit message
- Always use **Squash and merge**; never merge commits or rebase-merge
- PR description must include the linked issue (`Fixes #NUMBER`) when one exists

### PR merge checklist

Before marking a PR ready for review, verify all applicable items:

- [ ] Unit tests added or updated (for shared utils in `packages/beeq/src/shared/`)
- [ ] E2E tests added or updated (for component behavior changes)
- [ ] Storybook stories added or updated
- [ ] Mintlify MDX documentation page added or updated (`apps/beeq-docs/components/`)
- [ ] Code reviewed locally; no linter or type errors (`pnpm exec nx affected -t check --exclude='*,!tag:core' --parallel=3`)
- [ ] Test suite passes (`pnpm exec nx affected -t test --exclude='*,!tag:core' --parallel=3`)
- [ ] Build succeeds (`pnpm exec nx affected -t build --exclude='*,!tag:publishable' --parallel=3`)
- [ ] E2E tests pass (`pnpm exec nx affected -t e2e --exclude='*,!tag:core' --parallel=3`)

---

## Breaking changes

A PR that introduces a breaking change **must**:

1. Add `!` after the type/scope in the commit/PR title: `refactor(bq-checkbox)!: rename isChecked to checked`
2. Include a `BREAKING CHANGE:` footer in the commit body with:
   - A one-sentence summary
   - A blank line
   - A full description with migration instructions

```
refactor(bq-checkbox)!: rename `isChecked` property to `checked`

BREAKING CHANGE: the `isChecked` property has been renamed to `checked`.

The `isChecked` property (`is-checked` attribute) is no longer supported
and has been removed. Update all usages to the `checked` property/attribute.
```

3. Update the adapter packages (`beeq-angular`, `beeq-react`, `beeq-vue`) if the prop name or event signature changed
4. Add a migration entry to `CHANGELOG.md`

---

## Deprecations

Use `DEPRECATED:` in the commit footer:

```
feat(bq-button): add `variant` prop as replacement for `appearance`

DEPRECATED: the `appearance` prop is deprecated and will be removed in the next major release.

Use the `variant` prop instead. The `appearance` prop still works in this release but
will be removed in v2.0. Example: replace `appearance="primary"` with `variant="primary"`.
```

Also add `@deprecated` JSDoc on the old prop in the component source:

```typescript
/**
 * @deprecated Use `variant` instead. Will be removed in the next major release.
 */
@Prop() appearance: string;
```

---

## CHANGELOG format

The `CHANGELOG.md` file in the root of the monorepo is auto-generated during NX releases. So do not edit it directly. Instead, ensure that all breaking changes and noteworthy features are properly marked in the commit messages and PR titles as described above, so they are included in the generated changelog.

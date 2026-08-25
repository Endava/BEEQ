---
name: review-tailwind-migration
description: Review BEEQ @beeq/core Tailwind CSS to native SCSS/CSS migration work done by another contributor or agent. Use for PR/branch audits that need findings about migration-plan adherence, public API drift, visual or behavioral parity regressions, remaining Tailwind usage, logical CSS, scoped strict Stylelint, host-state styling, cascade layers, and technical improvements without making code changes.
---

# Review Tailwind Migration

## Before You Start

1. Read the migration plan: [tailwlindcss-migration.plan.md](../../../tailwlindcss-migration.plan.md).
2. Read the migration instructions: [tailwind-to-native-scss.instructions.md](../../instructions/tailwind-to-native-scss.instructions.md).
3. Read related repo instructions when relevant:
   - [Styles instructions](../../instructions/styles.instructions.md)
   - [StencilJS instructions](../../instructions/stenciljs.instructions.md)
   - [Testing instructions](../../instructions/testing.instructions.md)
4. Treat the task as a code review. Do not edit files unless the user explicitly asks for fixes.

## Review Scope

- Identify the base branch or merge base. If the user does not provide one, infer it from the current branch, upstream, or recent branch context.
- Review affected files only unless the user asks for a whole-workspace audit.
- Do not fail a component PR because unrelated, untouched files still contain legacy Tailwind.
- Classify changed files by area: component TSX, component SCSS, variables, tests, stories, generated readmes/typings, global styles, build config, or Stylelint config.
- Treat `packages/beeq/src/components/table` as global table style/story/test coverage, not as a Stencil component.

Useful orientation commands:

```bash
git branch --show-current
git status --short
git diff --name-only <base>...HEAD
git diff --stat <base>...HEAD
```

## Required Checks

For each migrated component, check only that component's files:

```bash
rg "@apply|theme\\(" packages/beeq/src/components/<component>/scss
rg "class=.*(flex|grid|gap-|items-|justify-|p-|m-|w-|h-|text-|bg-|border-|rounded-|absolute|relative)" packages/beeq/src/components/<component> --glob "*.tsx"
cd packages/beeq
pnpm exec stylelint "src/components/<component>/scss/**/*.{css,scss}" --config .stylelintrc.strict.json
```

Run the scoped strict Stylelint command once per migrated component. Do not use full `pnpm exec nx run beeq:stylelint-strict` as a component PR review gate while other components still use legacy Tailwind styles.

For migrated global styles, run checks scoped to the touched global area:

```bash
rg "@tailwind|@apply|theme\\(" packages/beeq/src/global/styles
cd packages/beeq
pnpm exec stylelint "src/global/styles/**/*.{css,scss}" --config .stylelintrc.strict.json
```

Use full strict Stylelint only for final migration cleanup or when the user asks for a whole-workspace strict audit:

```bash
pnpm exec nx run beeq:stylelint-strict
```

## Public API And Parity Review

Compare before and after for each affected component:

- Prop defaults and reflected attributes.
- Events, methods, slots, and documented parts.
- Public CSS custom properties, including legacy naming quirks.
- Generated `components.d.ts` and component `readme.md` changes.
- Storybook stories and tests that may have been changed to accept new behavior.

Flag any public API or parity drift unless it is explicitly called out as an intentional non-migration change.

High-signal diff searches:

```bash
git diff --unified=0 <base>...HEAD -- packages/beeq/src/components \
  | rg "^[+-].*(Prop|Event|Listen|Method|@slot|@part|@cssprop|Default|default|expect\\(|toEqual|toBe)"
git diff --unified=0 <base>...HEAD -- packages/beeq/src/components \
  | rg "^[+-].*(fontSize|lineHeight|width|height|class=|class\\{|part=|slot=)"
```

When a suspicious behavior change appears, inspect the old implementation with:

```bash
git show <base>:packages/beeq/src/components/<component>/bq-<component>.tsx
git show <base>:packages/beeq/src/components/<component>/scss/bq-<component>.scss
```

## Styling Architecture Review

Check that migrated styles follow the plan:

- No `@apply`, `@tailwind`, or Tailwind `theme(...)` in touched style files.
- No visual Tailwind utility strings in Shadow DOM render output.
- CSS logical properties are used for layout, sizing, spacing, positioning, borders, and radii.
- Physical properties appear only for documented exceptions.
- Nesting depth is `2` or less.
- Sass-only selector concatenation such as `&__label` is avoided.
- Public variants and states use reflected host attributes where possible, such as `:host([size='small']) .bq-avatar`.
- Render classes are limited to root hooks, meaningful internal elements, and private `.is-*` states.
- `.is-*` is not used when a public host attribute already exists.
- Component-local `@layer` is used only for components listed in the migration plan.
- Layer names match the strict Stylelint pattern.
- Public `--bq-*` custom properties are preserved; private implementation variables use `--_property`.
- Direct use of public component variables is acceptable and often clearer for simple mappings.
- Do not require private `--_` variables unless they reduce meaningful repetition, combine several public values into one internal value, or keep variant/state selectors focused on value changes.
- Flag internal mutation of public component variables when it is used to model private variant or state behavior.
- Focus, hover, and active states use shared SCSS mixins or documented interaction tokens.

Storybook Tailwind utilities are follow-up unless the PR includes Storybook/build cleanup or claims Storybook has been migrated.

## Review Output

Lead with findings, ordered by severity, and include file/line references.

For each finding:

- State the issue and why it violates the migration plan or introduces technical risk.
- Identify whether it is a blocker, parity/API drift, migration-rule miss, or improvement.
- Keep the suggested fix specific.

Then include:

- Open questions or assumptions.
- Short migration-adherence summary.
- Validation run and anything that could not be run.

If there are no issues, say that clearly and mention residual risk or test gaps.

Do not spend review space summarizing every successful mechanical replacement unless it helps the user decide whether to approve the PR.

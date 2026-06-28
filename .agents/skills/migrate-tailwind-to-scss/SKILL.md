---
name: migrate-tailwind-to-scss
description: 'Migrate BEEQ @beeq/core styles from Tailwind CSS to native SCSS/CSS. Use for: removing @apply, replacing Tailwind theme(...) calls, moving visual Tailwind class strings out of Stencil render() output, migrating public global classes/mixins/table styles, applying logical CSS properties, adding selective @layer usage, validating Stylelint/build checks, and following the Tailwind migration plan.'
argument-hint: 'Component or area to migrate, e.g. "button", "public global classes", "stylelint", "build cleanup"'
---

# Migrate Tailwind To Native SCSS

## Before You Start

1. Read the migration plan: [tailwlindcss-migration.plan.md](../../../tailwlindcss-migration.plan.md).
2. Read the migration instructions: [tailwind-to-native-scss.instructions.md](../../instructions/tailwind-to-native-scss.instructions.md).
3. Read related repo instructions when relevant:
   - [Styles instructions](../../instructions/styles.instructions.md)
   - [StencilJS instructions](../../instructions/stenciljs.instructions.md)
   - [Accessibility instructions](../../instructions/accessibility.instructions.md)
   - [Testing instructions](../../instructions/testing.instructions.md)
4. Inspect current files before editing. Do not rely on naming assumptions.

## Scope Detection

- For a component, migrate `bq-<name>.tsx`, `scss/bq-<name>.scss`, `scss/bq-<name>.variables.scss`, stories, and tests as one unit.
- For global foundations, migrate tokens, reset, typography, fonts, and interaction/mixin structure according to the plan.
- For public global classes, migrate `.bq-table`, `.bq-link`, portals, body state classes, root defaults, typography classes, and scrollbar mixins while preserving public class APIs.
- For build cleanup, remove Tailwind from the `packages/beeq` Stencil/Storybook/PostCSS path only after component/global styles no longer depend on it.
- For Stylelint, keep migration-tolerant config until the final strict flip.
- For review-only requests, report remaining Tailwind usage, public API risks, and missing validation.

## Component Procedure

1. Read the component TSX, SCSS, variables, stories, and tests.
2. Identify public attributes, reflected props, private states, slots, parts, CSS custom properties, and visual variants.
3. Replace `theme(...)` in variables with CSS custom properties, literals, or calculations from `var(--bq-*)`.
4. Preserve every existing public `--bq-*` variable name. Add aliases only if the plan or task explicitly asks for them.
5. Remove every `@apply` by writing native SCSS declarations.
6. Move visual Tailwind utility class strings out of `render()` into semantic BEEQ styling hooks only where needed.
7. Use CSS logical properties for layout, sizing, spacing, positioning, borders, and radii.
8. Replace focus, hover, and active Tailwind plugin utilities with the shared SCSS mixins from the plan.
9. Replace group/peer variants with explicit selectors.
10. Expand `before:*` and `after:*` utilities into `::before` and `::after` rules.
11. Keep nesting depth at `2` or less and avoid Sass-only selector concatenation.
12. Use component-local `@layer` only for components listed in the migration plan.
13. Do not change component behavior while migrating styles. Preserve prop defaults, reflected attributes, events, slots, parts, CSS custom property names, generated docs behavior, and visual parity unless the user explicitly asks for a separate behavior change.
14. Do not update tests to bless a new visual or behavioral result caused by the migration. If a real bug is discovered, call it out and split the fix or make the non-migration change explicit.

## Component CSS Variables

- Use public component variables directly when that keeps the CSS explicit and readable.
- Preserve public `--bq-*` variables as the consumer override API. Do not rename them and do not mutate them internally to model private variant or state changes.
- Use private `--_property` variables only as optional internal composition helpers.
- Introduce private `--_` variables when they reduce meaningful declaration repetition, combine several public tokens into one internal value, or let variants/states update values while base selectors own the declarations.
- Do not wrap every public component variable in a private variable by default.
- Do not document private `--_` variables.

## Component Class Rules

- Use `.bq-<component>` as the root class when a root styling hook exists.
- Add `.bq-<component>__<element>` only for stable internal styling hooks.
- Use `.is-*` only for internal state that is not already reflected on the host.
- Prefer host attributes for public variants and states.
- For reflected public variants, prefer selectors such as `:host([size='small']) .bq-avatar` over render-time classes such as `.size--small`.
- Do not add classes to every DOM node.
- Do not create visual utility aliases such as `.row-center`, `.gap-small`, or `.text-primary`.
- Do not treat internal classes as public API unless they are documented.

## Global Procedure

1. Keep the global style structure from the migration plan.
2. Keep primitive tokens on `:root, ::backdrop` until dialog/drawer top-layer QA proves otherwise.
3. Place emitted global declarations inside the documented global cascade layers.
4. Keep `.bq-table`, `.bq-table--container`, `.bq-link`, portal, scroll-lock, and typography public APIs stable.
5. Remove `@apply` from globally injected mixins before removing Tailwind from the build.
6. Keep mixins runtime-layer-free unless their declarations are emitted at include sites.

## Build And Stylelint Rules

- Do not add `stencil-tailwind-plugin`, Tailwind CLI, or Tailwind PostCSS usage back into `packages/beeq`.
- Use Stencil `autoprefixCss: true` for Stencil-built CSS after Tailwind/PostCSS removal.
- Use the dedicated Sass styles build for token/reset/typography CSS entrypoints.
- Keep shared BEEQ mixins available through `mixins/index.scss` injection; do not add local mixin imports to individual SCSS partials unless the file is compiled outside the BEEQ style pipeline.
- Ensure standalone Sass paths, especially Storybook `default.scss` compilation, mirror Stencil's mixin injection.
- Use Stylelint built-in `property-layout-mappings`, not `stylelint-use-logical`.
- Keep `packages/beeq-tailwindcss` functional but separate from the `@beeq/core` runtime styling path.
- Keep `beeq:stylelint` migration-tolerant until the final strict flip.
- `beeq:stylelint-strict` is the final full-workspace gate and is expected to fail while unmigrated files still contain Tailwind.
- During component migration, run strict Stylelint scoped to each migrated component, one component at a time.

## Validation

Run focused checks for the area you touched. For every migrated component, run:

```bash
rg "@apply|theme\\(" packages/beeq/src/components/<component>/scss
rg "class=.*(flex|grid|gap-|items-|justify-|p-|m-|w-|h-|text-|bg-|border-|rounded-|absolute|relative)" packages/beeq/src/components/<component> --glob "*.tsx"
cd packages/beeq
pnpm exec stylelint "src/components/<component>/scss/**/*.{css,scss}" --config .stylelintrc.strict.json
pnpm exec nx run beeq:build
```

Run the scoped strict Stylelint command per component migrated. Do not use full `pnpm exec nx run beeq:stylelint-strict` as a component PR gate while other components still use legacy Tailwind styles.

For global/build work, also run:

```bash
rg "@tailwind|@apply|theme\\(" packages/beeq/src
rg "stencil-tailwind-plugin|tailwindHMR|tailwind\\(" packages/beeq
cd packages/beeq
pnpm exec stylelint "src/global/styles/**/*.{css,scss}" --config .stylelintrc.strict.json
pnpm exec nx run beeq:styles
```

Run full strict Stylelint only for final migration cleanup:

```bash
pnpm exec nx run beeq:stylelint-strict
```

Run relevant tests and Storybook checks based on the component risk. Always include table E2E after migrating global table styles and dialog/drawer backdrop checks before changing `::backdrop` token coverage.

## Final Review Before Handoff

- Check `git diff` for accidental public API changes: prop defaults, reflected attributes, events, slots, parts, CSS custom properties, generated readmes, and generated typings.
- Check test diffs for expectation changes that merely accept new behavior caused by the migration.
- Check that public variants use host attributes where possible, and render classes are limited to stable internal structure or private state.
- Mention any validation that could not run and why.

## Hard Rules

- Do not rename public CSS custom properties.
- Do not remove theme/mode selector support.
- Do not remove documented slots or parts.
- Do not remove `::backdrop` primitive token coverage without dedicated QA.
- Do not use relative color syntax as the default parity migration.
- Do not adopt full BEM or expose new internal classes as public API by accident.
- Do not migrate all variables first and all SCSS later; migrate variables, SCSS, and TSX together per component.

---
description: Guides the Tailwind CSS to native SCSS/CSS migration for @beeq/core, including tokens, cascade layers, logical properties, component class naming, Stylelint, and validation rules.
applyTo: packages/beeq/src/**/*.{scss,tsx},packages/beeq/stencil.config.ts,packages/beeq/project.json,tailwlindcss-migration.plan.md
---

# Tailwind To Native SCSS Migration

Use [tailwlindcss-migration.plan.md](../../tailwlindcss-migration.plan.md) as the source of truth for the full migration plan, phases, mapping tables, and acceptance checks.

## Core Rules

- `packages/beeq` is migrating away from Tailwind CSS for runtime component styles.
- Do not add `@tailwind`, `@apply`, Tailwind `theme(...)`, or Tailwind utility class strings in Stencil render output.
- Keep SCSS as the authoring language and native CSS as the runtime output.
- Preserve public CSS custom properties, theme/mode selectors, host attributes, slots, and documented parts.
- Keep `packages/beeq-tailwindcss` separate and functional; do not use it as the runtime style source for `@beeq/core`.

## Tokens And Themes

- Use the cascade `primitive values -> theme root aliases -> mode semantic tokens -> component variables`.
- Source raw primitive values from `packages/beeq-tailwindcss/src/theme/colors/base.ts`.
- Treat `colors/primitive.ts` and `colors/declarative.ts` as Tailwind-facing adapter/reference maps.
- Components should consume semantic tokens or component variables, not raw primitive colors, unless defining a documented exception.
- Keep default behavior: no theme/mode means BEEQ light.
- Keep existing selectors for `bq-theme`, `bq-mode`, `.beeq`, `.endava`, `.light`, and `.dark`.
- Keep primitive token coverage on `:root, ::backdrop` until dialog/drawer top-layer QA proves it can be removed.

## CSS Custom Properties

- Do not rename existing public `--bq-*` variables during migration.
- Public component variables remain the consumer override API.
- Private implementation variables use `--_property`.
- Do not document private `--_` variables.
- Variants and states may change private variables, not public API variables.

## Logical CSS

- Use logical properties for layout, sizing, spacing, positioning, borders, and radii.
- Prefer `inline-size`/`block-size` over `width`/`height`.
- Prefer `padding-inline`/`padding-block` and `margin-inline`/`margin-block`.
- Prefer logical insets and logical border/radius properties.
- Physical properties are allowed only for public variable names, SVG styling, transforms, vendor pseudo-elements, third-party APIs, or documented browser exceptions.
- Use this exception format:

```scss
/* stylelint-disable-next-line property-layout-mappings -- vendor pseudo-element requires physical width */
width: 100%;
```

## Classes And Render Output

- Do not adopt full BEM as a methodology.
- Use BEEQ semantic classes only where a stable styling hook is needed.
- Use `.bq-<component>` for root styling hooks.
- Use `.bq-<component>__<element>` only for meaningful internal elements.
- Use `.is-*` only for internal state not already reflected on the host.
- Prefer host attributes for public variants and states.
- Do not create visual helper classes such as `.row-center`, `.gap-small`, or `.text-primary`.
- Do not add classes to every DOM node.

## Nesting

- Keep nesting native-compatible.
- Preferred nesting depth is `1`; maximum depth is `2`.
- Flatten depth `3+`.
- Nest states, pseudo-elements, and tightly coupled child selectors only.
- Do not use Sass-only selector concatenation such as `&__label`.

## Cascade Layers

- Use global layers for global styles:

```scss
@layer bq.reset, bq.tokens, bq.themes, bq.base, bq.utilities, bq.overrides;
```

- Place emitted global declarations inside a layer.
- Avoid unlayered global declarations because they override layered component declarations.
- Use component-local layers only for components listed in the migration plan.
- Layered component stylesheets must declare the full layer order, with global layers first and component layers after them.
- Do not mix layered and unlayered declarations in the same complex component unless the unlayered declaration is an annotated escape hatch.

## Mixins And Interactions

- Replace Tailwind focus utilities with `@include bq-focus-ring`.
- Replace Tailwind hover/active color-mix utilities with shared SCSS mixins.
- Use `color-mix()` for parity with the current Tailwind plugin.
- Do not use relative color syntax such as `oklch(from ...)` during the parity migration.
- Keep the focus-ring utility class separate from the focus-ring mixin.

## Stylelint

- Use Stylelint built-in `property-layout-mappings: "flow-relative"` for logical-property enforcement.
- Do not add `stylelint-use-logical`.
- Keep migration-tolerant Stylelint config until the final strict flip.
- Strict `packages/beeq` Stylelint must eventually reject `@tailwind`, `@apply`, and `theme(...)`.

## Validation

For migrated component styles:

```bash
rg "@apply|theme\\(" packages/beeq/src/components/<component>/scss
rg "class=.*(flex|grid|gap-|items-|justify-|p-|m-|w-|h-|text-|bg-|border-|rounded-|absolute|relative)" packages/beeq/src/components/<component> --glob "*.tsx"
```

For global/build cleanup:

```bash
rg "@tailwind|@apply|theme\\(" packages/beeq/src
rg "stencil-tailwind-plugin|tailwindHMR|tailwind\\(" packages/beeq
```

Run the relevant Nx targets from the plan for the area being migrated.

# Tailwind To Native SCSS/CSS Migration Plan For `@beeq/core`

## Summary

Migrate `packages/beeq` away from Tailwind CSS while keeping SCSS as the authoring language and shipping native CSS at runtime.

Core decisions:

- Keep SCSS for mixins, shared interaction patterns, and migration ergonomics.
- Remove Tailwind from the `@beeq/core` Stencil build path.
- Preserve public CSS variables, theme/mode selectors, component attributes, slots, and documented parts.
- Use CSS custom properties as the consumer customization API.
- Use CSS logical properties by default.
- Use global `@layer`, and use component-local `@layer` only for complex components.
- Keep native-compatible nesting, capped at depth `2`.
- Add token-only CSS entrypoints from `@beeq/core`; do not create `@beeq/tokens` in this migration.
- Keep `packages/beeq-tailwindcss` functional but treat Tailwind preset modernization as a later phase.
- Use Stylelint progressively, then flip `packages/beeq` to strict rules once migration is complete.
- Treat `packages/beeq/src/components/table` as Storybook/E2E coverage for global `.bq-table`, not as a Stencil component.
- Enable Stencil `autoprefixCss: true` for Stencil-generated CSS after removing Tailwind/PostCSS.

References for implementation decisions:

- Stencil `globalStyle`, constructable stylesheets, and `autoprefixCss`: [Stencil styling docs](https://stenciljs.com/docs/styling#constructable-stylesheets)
- Cascade layers: [MDN `@layer`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer)
- `color-mix()`: [MDN `color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix)
- Stylelint logical-property enforcement: [Stylelint `property-layout-mappings`](https://stylelint.io/user-guide/rules/property-layout-mappings/)

## Public API

Keep these theme/mode selectors working:

```html
<html bq-theme="beeq" bq-mode="light">
<html bq-theme="endava" bq-mode="dark">
<body bq-theme="beeq" bq-mode="light">
<div class="beeq light">
<div class="endava dark">
```

Keep existing public custom property names, including current naming quirks:

```css
--bq-ui--brand
--bq-text--primary
--bq-background--primary
--bq-radius--s
--bq-spacing-m
--bq-button--border-radius
--bq-button--medium-paddingX
--bq-button--medium-paddingY
--bq-side-menu--width
--bq-table--header-height
```

Do not rename public variables during this migration. If better names are desired, add aliases in a later token cleanup phase.

Add these built CSS entrypoints:

```text
@beeq/core/dist/beeq/beeq.css          full global stylesheet
@beeq/core/dist/beeq/tokens.css        primitives + themes + modes + interaction tokens
@beeq/core/dist/beeq/reset.css         reset only
@beeq/core/dist/beeq/typography.css    typography only
```

Do not add a new `package.json` `exports` map unless every existing import path is mapped, to avoid accidental consumer breakage.

## Global Style Structure

Create or normalize this structure under `packages/beeq/src/global/styles`:

```text
default.scss
tokens.scss
reset.scss
typography.scss

foundations/
  _layers.scss
  _reset.scss
  _typography.scss
  tokens/
    _primitives.scss
    _theme-beeq.scss
    _theme-endava.scss
    _modes.scss
    _interaction.scss
    index.scss

fonts/
  _outfit.scss
  _poppins.scss

public/
  _defaults.scss
  _link.scss
  _body.scss
  _portals.scss
  _table.scss
  index.scss

mixins/
  _breakpoints.scss
  _color-mix.scss
  _focus-ring.scss
  _keyframes.scss
  _logical.scss
  _scrollbar.scss
  index.scss
```

Responsibilities:

| File | Responsibility |
|---|---|
| `default.scss` | Full global stylesheet used by Stencil `globalStyle` |
| `tokens.scss` | Token-only public CSS entrypoint |
| `reset.scss` | Reset-only public CSS entrypoint |
| `typography.scss` | Typography-only public CSS entrypoint |
| `_layers.scss` | Global cascade layer order |
| `_primitives.scss` | Raw palette, spacing, radius, typography scale, elevation, stroke tokens |
| `_theme-beeq.scss` | BEEQ theme root aliases |
| `_theme-endava.scss` | Endava theme root aliases |
| `_modes.scss` | Light/dark semantic tokens |
| `_interaction.scss` | Focus, hover, active, disabled, state-mix tokens |
| `public/_defaults.scss` | Public root defaults needed by BEEQ classes and components |
| `public/_link.scss` | Public `.bq-link` class |
| `public/_body.scss` | Library-managed public body state classes |
| `public/_portals.scss` | Public notification/toast portal classes |
| `public/_table.scss` | Public `.bq-table` and `.bq-table--container` classes |
| `mixins/_focus-ring.scss` | `@mixin bq-focus-ring` only |
| `mixins/_color-mix.scss` | Hover/active color, background, and border mixins |
| `mixins/_scrollbar.scss` | Native scrollbar mixins; no `@apply` |
| `mixins/_logical.scss` | Optional repeated logical-size/inset patterns |

Keep the current Sass `@import` model during this migration. Do not make a full `@use`/`@forward` migration a blocker.

## Token Organization

Use this runtime token cascade:

```text
primitive values -> theme root aliases -> mode semantic tokens -> component variables
```

Token ownership:

| Current Source | New Role |
|---|---|
| `packages/beeq-tailwindcss/src/theme/colors/base.ts` | Source for raw primitive values in `_primitives.scss` |
| `packages/beeq-tailwindcss/src/theme/colors/primitive.ts` | Tailwind-facing adapter/reference map, not the raw runtime source |
| `packages/beeq-tailwindcss/src/theme/colors/declarative.ts` | Migration reference for semantic utility mapping |
| `packages/beeq-tailwindcss/src/theme/default/root.ts` | Source for `_theme-beeq.scss` aliases |
| `packages/beeq-tailwindcss/src/theme/endava/root.ts` | Source for `_theme-endava.scss` aliases |
| `default/light.ts`, `default/dark.ts`, `endava/light.ts`, `endava/dark.ts` | Source for `_modes.scss` |
| `packages/beeq-tailwindcss/src/theme/reset.ts` | Source for `foundations/_reset.scss` |

Components should consume semantic or component variables:

```scss
.bq-button {
  color: var(--bq-text--inverse);
  background-color: var(--bq-ui--brand);
}
```

Avoid primitive tokens inside components unless defining a theme alias or handling a documented exception.

Default behavior:

- No theme/mode means BEEQ light.
- `bq-theme="beeq"` with no mode means BEEQ light.
- `bq-theme="endava"` with no mode means Endava light.
- Explicit `bq-mode="dark"` wins over default light.
- `.beeq`, `.endava`, `.light`, and `.dark` remain supported.

For primitive tokens, keep current `:root, ::backdrop` behavior during migration:

```scss
@layer bq.tokens {
  :root,
  ::backdrop {
    --bq-blue-600: #156eeb;
    --bq-spacing-m: 1rem;
    --bq-radius--s: 0.5rem;
  }
}
```

Do not remove `::backdrop` until dialog/drawer top-layer smoke tests prove it is unnecessary.

## Cascade Layers

Global layer order:

```scss
@layer bq.reset, bq.tokens, bq.themes, bq.base, bq.public, bq.overrides;
```

Every global partial must place emitted declarations inside a layer. Avoid unlayered declarations in global styles because unlayered author styles override layered styles.

Global placement:

| Style Area | Layer |
|---|---|
| Reset | `bq.reset` |
| Primitives | `bq.tokens` |
| Theme aliases | `bq.themes` |
| Mode semantic tokens | `bq.themes` |
| Typography foundations | `bq.base` |
| Public global classes: `.bq-link`, body states, portals, `.bq-table` | `bq.public` |
| Intentional consumer-facing escape hatches | `bq.overrides` |

For complex components, declare the full shadow-root order at the top of the component stylesheet:

```scss
@layer bq.reset, bq.tokens, bq.themes, bq.base, bq.public, bq.overrides,
  bq-button.tokens, bq-button.base, bq-button.structure, bq-button.variants,
  bq-button.states, bq-button.parts;
```

Then place component sections inside their layers:

```scss
@layer bq-button.tokens {
  @import './bq-button.variables';
}

@layer bq-button.base {
  .bq-button {
    display: inline-flex;
  }
}
```

This makes global layers lower priority and component layers deterministic inside each shadow root.

Use component layers for:

| Component | Layers |
|---|---|
| `accordion` | `tokens`, `base`, `structure`, `variants`, `states` |
| `alert` | `tokens`, `base`, `structure`, `variants`, `states` |
| `breadcrumb-item` | `tokens`, `base`, `states` |
| `button` | `tokens`, `base`, `structure`, `variants`, `states`, `parts` |
| `checkbox` | `tokens`, `base`, `structure`, `states`, `parts` |
| `date-picker` | `tokens`, `base`, `structure`, `validation`, `states`, `vendor-parts` |
| `dialog` | `tokens`, `base`, `structure`, `states`, `parts` |
| `drawer` | `tokens`, `base`, `placement`, `states`, `parts` |
| `input` | `tokens`, `base`, `structure`, `validation`, `states`, `native` |
| `notification` | `tokens`, `base`, `structure`, `variants`, `states` |
| `option` | `tokens`, `base`, `states`, `parts` |
| `radio` | `tokens`, `base`, `structure`, `states` |
| `select` | `tokens`, `base`, `structure`, `validation`, `states`, `parts` |
| `side-menu` | `tokens`, `base`, `structure`, `variants`, `states`, `parts` |
| `side-menu-item` | `tokens`, `base`, `structure`, `states` |
| `slider` | `tokens`, `base`, `native`, `states` |
| `step-item` | `tokens`, `base`, `structure`, `variants`, `states` |
| `switch` | `tokens`, `base`, `structure`, `states`, `parts` |
| `tab` | `tokens`, `base`, `structure`, `states`, `pseudo` |
| `tag` | `tokens`, `base`, `structure`, `variants`, `states`, `parts` |
| `textarea` | `tokens`, `base`, `structure`, `validation`, `states`, `native` |
| `toast` | `tokens`, `base`, `structure`, `variants`, `states` |
| `tooltip` | `tokens`, `base`, `structure`, `states`, `pseudo` |

Keep simple components unlayered initially:

```text
accordion-group, avatar, badge, breadcrumb, card, divider, dropdown,
empty-state, icon, option-group, option-list, page-title, panel,
progress, radio-group, spinner, status, steps
```

Unlayered component styles are acceptable for simple components, but do not mix layered and unlayered declarations inside the same complex component unless an escape hatch is annotated.

## Logical CSS Rule

Use logical properties for layout, sizing, spacing, positioning, borders, and radii.

| Avoid | Use |
|---|---|
| `width` | `inline-size` |
| `height` | `block-size` |
| `min-width` | `min-inline-size` |
| `max-width` | `max-inline-size` |
| `min-height` | `min-block-size` |
| `max-height` | `max-block-size` |
| `left` | `inset-inline-start` |
| `right` | `inset-inline-end` |
| `top` | `inset-block-start` |
| `bottom` | `inset-block-end` |
| `padding-left/right` | `padding-inline-start/end` |
| `padding-top/bottom` | `padding-block-start/end` |
| `margin-left/right` | `margin-inline-start/end` |
| `margin-top/bottom` | `margin-block-start/end` |
| `border-left/right-*` | `border-inline-start/end-*` |
| `border-top/bottom-*` | `border-block-start/end-*` |
| physical corner radii | logical corner radii |

Allowed exceptions:

- Existing public custom property names.
- SVG-specific styling.
- Transform coordinates.
- Vendor pseudo-elements.
- Third-party APIs with physical-only selectors.
- Browser compatibility exceptions with a short comment.

Exception format:

```scss
/* stylelint-disable-next-line property-layout-mappings -- vendor pseudo-element requires physical width */
width: 100%;
```

## Interaction Tokens And Mixins

Replace Tailwind interaction plugins with CSS variables and SCSS mixins.

Use `color-mix()` for parity with the current Tailwind plugin. Do not use relative color syntax such as `oklch(from ...)` in the parity migration.

```scss
@layer bq.themes {
  :root {
    --bq-ring-width: 2px;
    --bq-ring-offset-width: 1px;
    --bq-ring-color-focus: var(--bq-focus);

    --bq-disabled-opacity: 0.6;

    --bq-state-mix-hover: 20%;
    --bq-state-mix-active: 20%;

    --bq-hover: #bcbfc5;
    --bq-active: #444546;
  }

  :where([bq-mode='dark'], .dark) {
    --bq-hover: #444546;
    --bq-active: #1f2026;
  }
}
```

```scss
@mixin bq-focus-ring {
  outline: var(--bq-ring-width, 2px) solid var(--bq-ring-color-focus, var(--bq-focus));
  outline-offset: var(--bq-ring-offset-width, 1px);
}

@mixin bq-hover-background($base) {
  background-color: color-mix(in srgb, #{$base}, var(--bq-hover) var(--bq-state-mix-hover));
}

@mixin bq-active-background($base) {
  background-color: color-mix(in srgb, #{$base}, var(--bq-active) var(--bq-state-mix-active));
}

@mixin bq-hover-border($base) {
  border-color: color-mix(in srgb, #{$base}, var(--bq-hover) var(--bq-state-mix-hover));
}

@mixin bq-active-border($base) {
  border-color: color-mix(in srgb, #{$base}, var(--bq-active) var(--bq-state-mix-active));
}

@mixin bq-hover-color($base) {
  color: color-mix(in srgb, #{$base}, var(--bq-hover) var(--bq-state-mix-hover));
}

@mixin bq-active-color($base) {
  color: color-mix(in srgb, #{$base}, var(--bq-active) var(--bq-state-mix-active));
}
```

Document the browser support baseline before merging this phase. Recommended baseline for the migration: Chrome 111+, Firefox 113+, Safari 16.2+ for `color-mix()` support. Relative color syntax remains a later enhancement.

## Component Variables

Keep component variables colocated:

```text
packages/beeq/src/components/button/scss/bq-button.variables.scss
packages/beeq/src/components/button/scss/bq-button.scss
```

Rules:

- Public variables use existing `--bq-component--property` names.
- Use public component variables directly when that is the clearest expression of the style.
- Private variables use `--_property`.
- Private `--_` variables are optional composition helpers, not a mandatory wrapper around every public component variable.
- Introduce private `--_` variables only when they reduce meaningful repetition, combine multiple public tokens into one internal value, or keep variant/state selectors focused on value changes.
- Do not document private `--_` variables.
- Public variables remain the consumer override API.
- Variants and states may update private variables, not public API variables.
- Do not mutate public component variables internally to model private variant or state behavior.
- Use logical declarations even when consuming legacy variable names.

Example:

```scss
:host {
  --bq-button--border-radius: var(--bq-radius--s);
  --bq-button--medium-paddingX: var(--bq-spacing-m);
  --bq-button--medium-paddingY: var(--bq-spacing-s);

  --_button-background: var(--bq-ui--brand);
  --_button-color: var(--bq-text--inverse);
}

.bq-button {
  border-radius: var(--bq-button--border-radius);
  padding-block: var(--bq-button--medium-paddingY);
  padding-inline: var(--bq-button--medium-paddingX);
  background-color: var(--_button-background);
  color: var(--_button-color);
}
```

## Component Class Naming

Do not adopt full BEM as a methodology.

Use BEEQ semantic component classes only where a stable styling hook is needed:

```text
Root class:        .bq-button
Element hook:      .bq-button__content
Internal state:    .is-loading
Public state:      host attribute/property
```

Rules:

- Do not add a class to every DOM node.
- Do not replace Tailwind utilities with visual class names such as `.row-center`, `.gap-small`, or `.text-primary`.
- Prefer host attributes for public variants and states.
- Use `.is-*` only for internal state not already reflected on the host.
- Internal classes are not public API unless documented.

## Native-Compatible Nesting

Allow CSS nesting, but keep it shallow and native-compatible.

Rules:

- Preferred nesting depth: `1`.
- Maximum nesting depth: `2`.
- Depth `3+` must be flattened.
- Nest states, pseudo-elements, and tightly coupled child selectors.
- Do not nest to mirror the DOM tree.
- Do not use Sass-only selector concatenation.

Good:

```scss
.bq-button {
  display: inline-flex;

  &:hover {
    @include bq-hover-background(var(--_button-background));
  }

  &::before {
    content: '';
  }
}
```

Avoid:

```scss
.bq-button {
  &__label {
    color: currentColor;
  }
}
```

Prefer:

```scss
.bq-button__label {
  color: currentColor;
}
```

## Tailwind Mapping Rules

Replace `theme(...)`:

| Tailwind | Native |
|---|---|
| `theme(spacing.xs)` | `var(--bq-spacing-xs)` |
| `theme(borderRadius.m)` | `var(--bq-radius--m)` |
| `theme(borderWidth.s)` | `var(--bq-stroke-s)` |
| `theme(fontSize.m)` | `var(--bq-font-size--m)` |
| `theme(lineHeight.regular)` | `var(--bq-font-line-height--regular)` |
| `theme(colors.text.primary)` | `var(--bq-text--primary)` |
| `theme(colors.ui.brand)` | `var(--bq-ui--brand)` |
| `theme(borderColor.transparent)` | `transparent` |

Replace common utilities:

| Tailwind | Native |
|---|---|
| `flex` | `display: flex` |
| `inline-flex` | `display: inline-flex` |
| `block` | `display: block` |
| `hidden` | `display: none` |
| `items-center` | `align-items: center` |
| `justify-center` | `justify-content: center` |
| `gap-s` | `gap: var(--bq-spacing-s)` |
| `w-full` | `inline-size: 100%` |
| `h-full` | `block-size: 100%` |
| `max-w-full` | `max-inline-size: 100%` |
| `px-s` | `padding-inline: var(--bq-spacing-s)` |
| `py-s` | `padding-block: var(--bq-spacing-s)` |
| `ps-s` | `padding-inline-start: var(--bq-spacing-s)` |
| `pe-s` | `padding-inline-end: var(--bq-spacing-s)` |
| `top-0` | `inset-block-start: 0` |
| `right-0` | `inset-inline-end: 0` |
| `bottom-0` | `inset-block-end: 0` |
| `left-0` | `inset-inline-start: 0` |
| `focus-visible:focus` | `&:focus-visible { @include bq-focus-ring; }` |
| `hover:bg-hover-*` | `@include bq-hover-background(...)` |
| `active:bg-active-*` | `@include bq-active-background(...)` |

Replace BEEQ custom logical utilities:

| Tailwind Plugin Utility | Native |
|---|---|
| `is-full` | `inline-size: 100%` |
| `is-auto` | `inline-size: auto` |
| `bs-full` | `block-size: 100%` |
| `min-bs-*` | `min-block-size: *` |
| `max-bs-*` | `max-block-size: *` |
| `min-is-*` | `min-inline-size: *` |
| `max-is-*` | `max-inline-size: *` |
| `p-b-*` | `padding-block: *` |
| `p-i-*` | `padding-inline: *` |
| `m-b-*` | `margin-block: *` |
| `m-i-*` | `margin-inline: *` |
| `inset-b-*` | `inset-block: *` |
| `inset-i-*` | `inset-inline: *` |
| `border-bl-*` | `border-block-width: *` |
| `border-i-*` | `border-inline-width: *` |
| `content-empty` | `content: ''` |

Expand `before:*` and `after:*` utilities into explicit `::before` and `::after` rules.

Replace Tailwind group/peer variants with explicit selectors.

## Stylelint Strategy

Keep root Stylelint generic and make `packages/beeq` progressively strict.

Do not add `stylelint-use-logical`. Use Stylelint’s built-in `property-layout-mappings`.

Config files:

```text
.stylelintrc.json
packages/beeq/.stylelintrc.json
packages/beeq/.stylelintrc.strict.json
```

Root config responsibilities:

- General CSS/SCSS correctness.
- Native CSS nesting limit.
- No repo-wide Tailwind ban, because `packages/beeq-tailwindcss` remains Tailwind-aware.
- Directionality config for logical-property autofix.

Root shape:

```json
{
  "ignoreFiles": ["**/*.{js,json,ts,tsx}", "./dist/**/*", "./node_modules/**/*"],
  "languageOptions": {
    "directionality": {
      "block": "top-to-bottom",
      "inline": "left-to-right"
    }
  },
  "overrides": [
    {
      "files": ["**/*.css"],
      "extends": ["stylelint-config-standard"]
    },
    {
      "files": ["**/*.scss"],
      "extends": ["stylelint-config-standard-scss"],
      "rules": {
        "max-nesting-depth": [
          2,
          {
            "ignore": ["blockless-at-rules"],
            "ignoreAtRules": ["layer", "media", "supports", "container"]
          }
        ],
        "declaration-no-important": true,
        "no-descending-specificity": null,
        "selector-class-pattern": null
      }
    }
  ]
}
```

Migration config for `packages/beeq/.stylelintrc.json`:

```json
{
  "extends": ["../../.stylelintrc.json"],
  "overrides": [
    {
      "files": ["**/*.scss"],
      "extends": ["stylelint-config-standard-scss"],
      "rules": {
        "property-layout-mappings": null,
        "at-rule-disallowed-list": null,
        "function-disallowed-list": null
      }
    }
  ]
}
```

Strict config for `packages/beeq/.stylelintrc.strict.json`:

```json
{
  "extends": ["./.stylelintrc.json"],
  "overrides": [
    {
      "files": ["src/**/*.scss"],
      "rules": {
        "property-layout-mappings": "flow-relative",
        "at-rule-disallowed-list": ["tailwind", "apply", "screen", "responsive", "variants"],
        "function-disallowed-list": ["theme"],
        "layer-name-pattern": [
          "^(bq\\.[a-z0-9-]+|bq-[a-z0-9-]+\\.(tokens|base|structure|variants|validation|placement|states|parts|native|pseudo|vendor-parts|overrides))$"
        ],
        "custom-property-pattern": [
          "^(?:bq(?:(?:-{1,2})[a-zA-Z0-9]+)+|_[a-z][a-z0-9]*(?:-[a-z0-9]+)*)$"
        ],
        "max-nesting-depth": [
          2,
          {
            "ignore": ["blockless-at-rules"],
            "ignoreAtRules": ["layer", "media", "supports", "container"]
          }
        ],
        "scss/at-rule-no-unknown": [
          true,
          {
            "ignoreAtRules": ["include", "mixin", "use", "forward"]
          }
        ]
      }
    }
  ]
}
```

Final `packages/beeq` Stylelint must enforce:

- No `@tailwind`.
- No `@apply`.
- No Tailwind `theme(...)`.
- Logical properties via `property-layout-mappings: "flow-relative"`.
- Max nesting depth `2`.
- Valid BEEQ layer names.
- Valid public/private custom property names.
- No undocumented `!important`.

Add target:

```json
"stylelint-strict": {
  "executor": "nx:run-commands",
  "options": {
    "command": "pnpm exec stylelint \"src/**/*.{css,scss}\" --config .stylelintrc.strict.json",
    "cwd": "packages/beeq"
  }
}
```

During migration, keep `beeq:stylelint` tolerant and run `beeq:stylelint-strict` on migrated areas. After all Tailwind usage is removed from `packages/beeq`, make strict config the default.

## Build And Config Changes

Update `packages/beeq/stencil.config.ts`:

- Remove `stencil-tailwind-plugin` imports.
- Remove `tailwind(...)`.
- Remove `tailwindHMR(...)`.
- Remove Tailwind `postcss` config from Stencil.
- Add `autoprefixCss: true`.
- Keep `sass(...)`.
- Keep `globalStyle: './src/global/styles/default.scss'`.
- Keep `injectGlobalPaths` pointing at `src/global/styles/mixins/index.scss`; add new mixins through that index.
- Keep component/global SCSS partials free of local mixin imports when they rely on shared BEEQ mixins; Stencil injects `mixins/index.scss`.

Stencil only handles one `globalStyle`, so add a dedicated styles build.

Add:

```text
packages/beeq/scripts/build-styles.mjs
```

Add `sass` as an explicit root dev dependency. Do not rely on transitive Sass from Vite/Storybook.

The script compiles:

```text
packages/beeq/src/global/styles/tokens.scss
  -> dist/beeq/dist/beeq/tokens.css

packages/beeq/src/global/styles/reset.scss
  -> dist/beeq/dist/beeq/reset.css

packages/beeq/src/global/styles/typography.scss
  -> dist/beeq/dist/beeq/typography.css

packages/beeq/src/global/styles/default.scss
  -> packages/beeq/.storybook/assets/css/stories.css
```

For the Storybook/default.scss path, `build-styles.mjs` must mirror Stencil's `injectGlobalPaths` behavior by prepending `src/global/styles/mixins/index.scss` before compiling. The standalone token/reset/typography entrypoints should not receive that mixin prelude unless they start using mixins.

Stencil remains responsible for:

```text
packages/beeq/src/global/styles/default.scss
  -> dist/beeq/dist/beeq/beeq.css
```

Script modes:

```bash
node packages/beeq/scripts/build-styles.mjs
node packages/beeq/scripts/build-styles.mjs --watch
node packages/beeq/scripts/build-styles.mjs --storybook
node packages/beeq/scripts/build-styles.mjs --storybook --watch
```

Do not add PostCSS back for these extra CSS entrypoints unless a concrete prefixing need is found. `autoprefixCss` covers Stencil-built component/global CSS, not Sass CLI outputs.

Preferred Nx target strategy:

- Rename current Stencil `build` target to `build-stencil`.
- Add new `build` target that runs:
  - `pnpm exec nx run beeq:build-stencil`
  - `pnpm exec nx run beeq:styles`
- Keep output paths compatible with current package publishing.

Alternative if target renaming creates too much churn:

- Keep current `build`.
- Add `styles`.
- Make CI/release run both `beeq:build` and `beeq:styles`.

Replace Storybook Tailwind CSS commands with `build-styles.mjs`.

Remove PostCSS from the core BEEQ style pipeline:

- Delete root `postcss.config.js` if nothing else references it.
- Or move Tailwind-specific PostCSS config under `packages/beeq-tailwindcss` later.
- Remove `postcss-import`, `postcss-preset-env`, and `postcss-url` if no remaining target uses them directly.
- Remove `stencil-tailwind-plugin` after no imports remain.
- Keep `tailwindcss` while `packages/beeq-tailwindcss` still builds against it.

## Agent Guardrails

Before component migration begins, update AI-facing guidance so tools do not follow stale Tailwind rules.

Update or replace:

```text
.github/instructions/styles.instructions.md
```

It must say:

- `packages/beeq` styles are migrating away from Tailwind.
- Do not add `@apply`.
- Do not add `theme(...)`.
- Do not add visual Tailwind classes in component render output.
- Use SCSS mixins for repeated focus and color-mix patterns.
- Use CSS logical properties.
- Use BEEQ semantic classes only where stable hooks are needed.
- Keep public variables and attributes stable.
- Use component layers only for listed complex components.

Add migration-specific files:

```text
.github/skills/migrate-tailwind-to-scss/SKILL.md
.github/instructions/tailwind-to-native-scss.instructions.md
```

Recommended skill shape:

- One general migration skill, not one skill per component.
- The skill should guide a single component or global area migration.
- It should require reading TSX, SCSS, variables, stories, and tests before changes.
- It should include grep acceptance checks and Stylelint strict checks.
- It should point to the mapping tables and layer rules.

## Migration Phases

### Phase 0 — Inventory, Browser Baseline, And Guardrails

Do first, before component work.

Tasks:

- Generate a checklist of all component SCSS/TSX files.
- Record baseline counts for `@apply`, `theme(...)`, `@tailwind`, visual utility class strings, and physical properties.
- Include `packages/beeq/src/global/styles/mixins` in scans.
- Include `packages/beeq/stencil.config.ts` and `packages/beeq/project.json` in Tailwind build scans.
- Record existing inconsistent layers: `button`/`slider` use `@layer components`, `progress` uses `@layer component`.
- Scan for `.focus`, `focus-visible:focus`, hover, active, group, peer, before, and after utility patterns.
- Add Tailwind-to-native mapping tables.
- Add logical-property rules.
- Add Stylelint migration and strict configs.
- Update `.github/instructions/styles.instructions.md`.
- Add migration skill/instructions.
- Document browser baseline for `color-mix()` and `@layer`.
- Confirm relative color syntax is out of scope.

Acceptance:

```bash
rg "@apply|theme\\(" packages/beeq/src packages/beeq/stencil.config.ts packages/beeq/project.json
rg "@tailwind" packages/beeq/src packages/beeq/stencil.config.ts packages/beeq/project.json
rg "stencil-tailwind-plugin|tailwindHMR|tailwind\\(" packages/beeq
rg "@layer" packages/beeq/src --glob "*.scss"
```

### Phase 1 — Global Tokens And Foundations

Tasks:

- Create the new global style structure.
- Port raw primitive values from `colors/base.ts`.
- Port BEEQ and Endava root aliases.
- Port light/dark semantic tokens.
- Keep `:root, ::backdrop` for primitives until backdrop QA says otherwise.
- Add interaction tokens using `color-mix()` parity.
- Add `tokens.scss`, `reset.scss`, and `typography.scss`.
- Add `build-styles.mjs`.
- Add Nx `styles` target.
- Migrate `_scrollbar.scss` to remove `@apply hidden`.
- Add `.bq-focus-ring` only as a light DOM utility, separate from the mixin.
- Keep existing font declarations.

Acceptance:

- `tokens.css` contains only tokens.
- `reset.css` contains only reset.
- `typography.css` contains only typography foundations.
- `beeq.css` remains the full global stylesheet.
- BEEQ light works with no attributes.
- BEEQ dark, Endava light, and Endava dark work with existing selectors.
- `node packages/beeq/scripts/build-styles.mjs` produces extra CSS entrypoints.
- `_scrollbar.scss` contains no `@apply`.

### Phase 2 — Public Global Classes, Mixins, And Table

Rewrite without Tailwind:

```text
packages/beeq/src/global/styles/public/_defaults.scss
packages/beeq/src/global/styles/public/_link.scss
packages/beeq/src/global/styles/public/_body.scss
packages/beeq/src/global/styles/public/_portals.scss
packages/beeq/src/global/styles/public/_table.scss
packages/beeq/src/global/styles/mixins/_scrollbar.scss
```

Tasks:

- Keep `.bq-table` and `.bq-table--container` API stable.
- Keep `.bq-link`, library-managed body state classes, portals, scroll lock, and typography APIs stable.
- Place emitted public class declarations in `bq.public`.
- Keep mixins layer-free unless emitted at include sites.
- Run table stories/E2E after `public/_table.scss` migration.

Acceptance:

```bash
rg "@apply|theme\\(" packages/beeq/src/global/styles
```

returns no matches.

### Phase 3 — Component Pilot

Migrate one representative complex component first.

Recommended pilot:

```text
button
```

Alternative:

```text
input
```

Pilot scope:

- Variables file.
- Component SCSS.
- TSX render class cleanup.
- Component-local full `@layer` order declaration.
- Logical properties.
- Focus/hover/active mixins.
- Storybook visual pass.
- Strict Stylelint pass.
- Shadow DOM `@layer` verification.
- Global and per-component variable override smoke test.

Acceptance:

```bash
rg "@apply|theme\\(" packages/beeq/src/components/button/scss
pnpm exec nx run beeq:stylelint-strict
pnpm exec nx run beeq:build
```

Verify BEEQ light/dark and Endava light/dark in Storybook.

### Phase 4 — Component Migration Batches

For each component, migrate variables + SCSS + TSX cleanup together in the same PR.

Do not migrate all variables first and all SCSS later.

Per component:

- Read TSX, SCSS, variables, stories, and tests.
- Identify host attributes, public states, private states, slots, and parts.
- Replace `theme(...)` in variables.
- Preserve public variable names.
- Remove all `@apply`.
- Convert utilities to native CSS.
- Use logical properties.
- Use component layers only if listed.
- Replace Tailwind focus/color-mix utilities with mixins.
- Replace group/peer variants with explicit selectors.
- Expand pseudo-element utilities into real `::before` / `::after`.
- Move visual Tailwind utility class strings out of `render()`.
- Keep public customization through CSS variables.
- Keep nesting depth `2` or less.

Acceptance per component:

```bash
rg "@apply|theme\\(" packages/beeq/src/components/<component>/scss
rg "class=.*(flex|grid|gap-|items-|justify-|p-|m-|w-|h-|text-|bg-|border-|rounded-|absolute|relative)" packages/beeq/src/components/<component> --glob "*.tsx"
```

The second command should return no visual Tailwind styling for the migrated component.

### Phase 5 — Build Cleanup

Tasks:

- Remove Tailwind plugins from Stencil config.
- Add `autoprefixCss: true`.
- Replace Storybook CSS Tailwind commands with `build-styles.mjs`.
- Remove `stencil-tailwind-plugin`.
- Remove the core PostCSS path.
- Remove `beeq-tailwindcss:build` from `beeq:build` once core no longer depends on Tailwind.
- Keep `tailwindcss` only for `packages/beeq-tailwindcss`.
- Keep `packages/beeq-tailwindcss` functionally unchanged.

Acceptance:

```bash
rg "stencil-tailwind-plugin|tailwindHMR|tailwind\\(" packages/beeq
rg "@tailwind|@apply|theme\\(" packages/beeq/src
rg "beeq-tailwindcss:build" packages/beeq/project.json
```

returns no matches.

### Phase 6 — Final Stylelint Flip

Tasks:

- Make strict Stylelint config the default for `packages/beeq`.
- Remove migration-only Tailwind allowances.
- Run strict Stylelint on all BEEQ CSS/SCSS.
- Keep root Stylelint config generic.

Acceptance:

```bash
pnpm exec nx run beeq:stylelint
pnpm exec nx run beeq:stylelint-strict
```

both pass.

### Phase 7 — Verification

Run:

```bash
pnpm exec nx run beeq:stylelint
pnpm exec nx run beeq:stylelint-strict
pnpm exec nx run beeq:build
pnpm exec nx run beeq:styles
pnpm exec nx run beeq:test
pnpm exec nx run beeq:e2e
pnpm exec nx run beeq:storybook-build
pnpm exec nx run beeq-tailwindcss:build
```

Visual checks:

- Storybook all components in BEEQ light.
- Storybook all components in BEEQ dark.
- Critical components in Endava light/dark.
- RTL pass for side-menu, side-menu-item, alert, switch, tabs, date-picker, drawer, tooltip, and table.
- Dialog and drawer backdrop/top-layer checks.
- Global token override smoke test.
- Per-component variable override smoke test.
- Shadow DOM layer smoke test on pilot and at least one additional complex component.

## Work Split

| Level | Components / Work Items |
|---|---|
| Global utilities | `table` global styles, table stories/E2E, portals, link utility, scroll lock, typography utilities, scrollbar mixin |
| 1 — Display/simple | `avatar`, `badge`, `breadcrumb`, `card`, `divider`, `empty-state`, `icon`, `page-title`, `panel`, `spinner`, `status` |
| 2 — Simple interactive | `button`, `checkbox`, `radio`, `radio-group`, `switch`, `slider`, `progress`, `tag` |
| 3 — Compound | `accordion`, `accordion-group`, `tab`, `tab-group`, `steps`, `step-item`, `breadcrumb-item`, `side-menu`, `side-menu-item` |
| 4 — Complex/floating/vendor | `alert`, `dialog`, `drawer`, `dropdown`, `notification`, `toast`, `tooltip`, `select`, `option`, `option-group`, `option-list`, `input`, `textarea`, `date-picker` |

PR guidance:

- One PR for agent guardrails and migration instructions.
- One PR for global token/style infrastructure.
- One PR for Stylelint config and migration guardrails.
- One PR for public global classes, table, and scrollbar mixin.
- One pilot PR for `button` or `input`.
- One PR per complex component.
- One PR per small group of simple components.
- One PR for build cleanup.
- One PR for final strict Stylelint flip.
- One docs/CHANGELOG PR for consumer import guidance.

`date-picker` is the highest-risk component because it wraps a third-party vendor calendar. Give it a dedicated PR and use `vendor-parts` for vendor override styles.

## Consumer Documentation And Wrapper Packages

`packages/beeq-angular`, `packages/beeq-react`, and `packages/beeq-vue` do not need their own style migration because they wrap `@beeq/core`.

Update docs/CHANGELOG:

- Full component usage should import `@beeq/core/dist/beeq/beeq.css`.
- Token-only consumers can import `@beeq/core/dist/beeq/tokens.css`.
- Wrapper consumers still need the core CSS import unless their framework integration already includes it.
- Tailwind is no longer required for components to render correctly.
- `@beeq/tailwindcss` remains optional for Tailwind consumers.

## Definition Of Done

Global:

- No Tailwind directives in `packages/beeq` global styles.
- No Tailwind plugin in Stencil config.
- No `@apply` in global styles or mixins.
- `@beeq/core` works without Tailwind.
- Existing theme/mode APIs work.
- Token-only CSS is available from core package output.
- Storybook CSS is generated without Tailwind CLI.
- Consumers can override global variables with ordinary CSS.
- Consumers can override component variables on `bq-*` host selectors.
- Strict Stylelint passes.

Per component:

- No `@apply`.
- No `theme(...)`.
- No visual Tailwind utility strings in Shadow DOM render output.
- Logical CSS properties are used.
- Nesting depth does not exceed `2`.
- Public component variables remain overridable.
- Internal state/variant behavior matches current behavior.
- Focus, hover, active, disabled, selected, checked, expanded, validation, and loading states match current behavior.
- Storybook visual output is equivalent.

## Non-Goals

- Do not create `@beeq/tokens` yet.
- Do not redesign the token system.
- Do not rename existing public CSS variables.
- Do not rewrite all Sass to `@use/@forward`.
- Do not update the Tailwind preset in the main migration.
- Do not expose new internal classes as public API unless intentionally documented.
- Do not adopt relative color syntax as the default interaction strategy during parity migration.
- Do not remove `::backdrop` token coverage without dedicated backdrop QA.

## Follow-Up After Main Migration

Update `packages/beeq-tailwindcss` separately:

- Make it consume or mirror the new CSS variable/token model.
- Support Tailwind v4 as the default.
- Keep Tailwind v3 compatibility only if needed.
- Keep Tailwind optional for consumers.
- Do not let Tailwind become the runtime styling source for `@beeq/core` again.

Possible later enhancements:

- Evaluate `oklab`/relative color syntax after browser baseline review.
- Consider `@beeq/tokens` only after validating demand for token-only consumption outside `@beeq/core`.
- Consider Sass `@use/@forward` migration as a separate maintenance refactor.
- Consider removing `::backdrop` primitive emission if dialog/drawer tests prove it is redundant.

## Assumptions

- SCSS remains the authoring language.
- Native CSS remains the runtime output.
- Existing CSS custom property names are preserved.
- Existing theme/mode selectors are preserved.
- `@beeq/core` ships token-only CSS entrypoints before considering a separate `@beeq/tokens` package.
- Stylelint strict mode is introduced progressively, then made default after migration.
- `table/` remains a global CSS utility with stories/tests, not a Stencil component.
- Browser support is allowed to be constrained by `color-mix()` for this migration.

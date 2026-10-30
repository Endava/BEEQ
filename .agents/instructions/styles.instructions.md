---
description: SCSS/CSS and CSS custom property rules for component stylesheets.
applyTo: packages/beeq/src/components/**/*.{tsx,scss}
---

# Component Styling

- CSS custom properties follow `--bq-<component>--<property>` (double dash), e.g. `--bq-avatar--border-color`. `--bq-avatar-background`, `--bq-dialog-z-index` and `--bq-panel-z-index` are legacy exceptions; do not copy them.
- When possible, prefer CSS solutions over JavaScript solutions
- The BEEQ components use native CSS and SCSS. Use the existing design tokens and component-scoped styles.
- You can abstract components styles to a separated SCSS file if necessary, associated with the component.
- Avoid using global styles, prefer component-scoped styles.
- Avoid using `!important` unless absolutely necessary.
- The global style foundations define the design tokens (colors, spacing, typography, etc.) that should be used consistently across components.
- Ensure accessibility: color contrast, focus styles and reduced motion (see the accessibility instructions).
- Structure code for responsiveness: breakpoints, fluid typography, responsive images, container queries.
- When using CSS class name, apply BEM naming, block/element/modifier/state patterns.

## Implementation variable scope

- Declare internal `--_` custom properties on the component's internal root (for example, `.bq-tag`), or on the nearest internal element that owns the value. Descendants can inherit them from that element.
- Target that same element in variant and state overrides: `:host([size='small']) .bq-tag { --_tag-gap: ...; }`. Moving defaults off the host requires moving their overrides too; a value declared on the wrapper takes precedence over an inherited host value.
- Keep a local on `:host` only when a host declaration or host pseudo-element needs it. Add a brief SCSS comment explaining the host-level requirement. Use existing DOM structure; this rule does not require adding a wrapper.
- Keep public `--bq-*` component defaults on `:host` and preserve existing prop-to-public-variable mappings. Use public variables directly for simple mappings; internal locals remain optional composition helpers.
- Internal `--_` names are unsupported implementation details, not a CSS privacy boundary. Exposed parts may still override them. Verify computed behaviour and public customisation rather than asserting that consumers cannot reach them.

## Color tokens

Colors resolve through four layers: primitive (`--bq-iris-600`) → root semantic (`--bq-brand`) → mode role (`--bq-ui--brand`) → component variable (`--bq-button--primary-background`). Consumers rebrand at the root layer and tune one component at the component layer; both only work if components stay on this chain.

- Default every component color variable in `bq-<name>.variables.scss` to a mode role: `--bq-background--*`, `--bq-ui--*`, `--bq-text--*`, `--bq-icon--*`, `--bq-stroke--*` or `--bq-focus`. Never point it at a primitive or a root semantic; those do not flip between light and dark.
- Pick the role by meaning, not by current hue. Info UI uses the `*--info` roles even when info and brand look alike, so a rebrand does not recolor alerts, notifications, toasts, tags or status dots.
- Text on a solid fill uses the matching `--bq-text--on-{intent}`; text on a tint (`--bq-ui--{intent}-alt`) uses `--bq-text--{intent}`.
- Hover and pressed states have no tokens of their own. Mix at the point of use with the `bg-hover-*`/`border-hover-*`/`text-hover-*` (and `active`) utilities, or `color-mix(in srgb, var(--bq-<component>--background), var(--bq-hover) 20%)` (`--bq-active` for pressed). Component variables hold the resting color; add a separate `-hover` variable only when hover starts from a different base, and still mix it.
- If no role expresses the meaning, add one in `packages/beeq-tailwindcss` instead of hard-coding a value; see [its AGENTS.md](../../packages/beeq-tailwindcss/AGENTS.md).

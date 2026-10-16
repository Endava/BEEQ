---
description: SCSS/CSS and CSS custom property rules for component stylesheets.
applyTo: packages/beeq/src/components/**/*.{tsx,scss}
---

# Component Styling

- CSS custom properties follow `--bq-<component>--<property>` (double dash), e.g. `--bq-avatar--border-color`. `--bq-avatar-background`, `--bq-dialog-z-index` and `--bq-panel-z-index` are legacy exceptions; do not copy them.
- When possible, prefer CSS solutions over JavaScript solutions
- The BEEQ design system is built with Tailwind CSS. Use Tailwind CSS where possible for utility-first styling.
- You can abstract components styles to a separated SCSS file if necessary, associated with the component.
- It is ok using `apply` directive from Tailwind CSS to compose utility classes in SCSS files.
- Avoid using global styles, prefer component-scoped styles.
- Avoid using `!important` unless absolutely necessary.
- The tailwind.config.js file defines the design tokens (colors, spacing, typography, etc.) that should be used consistently across the application. It uses an opinionated preset generated from the beeq-tailwindcss packages (packages/beeq-tailwindcss).
- Ensure accessibility: color contrast, focus styles and reduced motion (see the accessibility instructions).
- Structure code for responsiveness: breakpoints, fluid typography, responsive images, container queries.
- When using CSS class name, apply BEM naming, block/element/modifier/state patterns.

## Color tokens

Colors resolve through four layers: primitive (`--bq-iris-600`) → root semantic (`--bq-brand`) → mode role (`--bq-ui--brand`) → component variable (`--bq-button--primary-background`). Consumers rebrand at the root layer and tune one component at the component layer; both only work if components stay on this chain.

- Default every component color variable in `bq-<name>.variables.scss` to a mode role: `--bq-background--*`, `--bq-ui--*`, `--bq-text--*`, `--bq-icon--*`, `--bq-stroke--*` or `--bq-focus`. Never point it at a primitive or a root semantic; those do not flip between light and dark.
- Pick the role by meaning, not by current hue. Info UI uses the `*--info` roles even when info and brand look alike, so a rebrand does not recolor alerts, notifications, toasts, tags or status dots.
- Text on a solid fill uses the matching `--bq-text--on-{intent}`; text on a tint (`--bq-ui--{intent}-alt`) uses `--bq-text--{intent}`.
- Hover and pressed states have no tokens of their own. Mix at the point of use with the `bg-hover-*`/`border-hover-*`/`text-hover-*` (and `active`) utilities, or `color-mix(in srgb, var(--bq-<component>--background), var(--bq-hover) 20%)` (`--bq-active` for pressed). Component variables hold the resting color; add a separate `-hover` variable only when hover starts from a different base, and still mix it.
- If no role expresses the meaning, add one in `packages/beeq-tailwindcss` instead of hard-coding a value; see [its AGENTS.md](../../packages/beeq-tailwindcss/AGENTS.md).

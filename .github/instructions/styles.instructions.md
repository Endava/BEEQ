---
description: Enforces modern, maintainable, and accessible SCSS/CSS practices for all component stylesheets.
applyTo: packages/beeq/src/components/**/*.{tsx,scss}
---

# Component Styling

- When possible, prefer CSS solutions over JavaScript solutions
- `packages/beeq` is migrating from Tailwind CSS to native SCSS/CSS. Follow [Tailwind to native SCSS instructions](./tailwind-to-native-scss.instructions.md) for migration work.
- Use native SCSS/CSS for component styling in `@beeq/core`.
- Do not add Tailwind `@apply`, `@tailwind`, Tailwind `theme(...)`, or visual Tailwind class strings in render output.
- Keep component styles in the component `scss/` directory and associated with the component.
- Avoid using global styles, prefer component-scoped styles.
- Avoid using `!important` unless absolutely necessary.
- Use BEEQ CSS custom properties and semantic tokens consistently. Do not rename public `--bq-*` custom properties during migration.
- Follow modern SCSS/CSS best practices for maintainable, scalable, and accessible styles.
- Follow proper shadow DOM styling.
- Optimize for performance: selector specificity, reflow/repaint, and animation.
- Ensure accessibility: color contrast, focus styles, reduced motion, print/high contrast support.
- Structure code for responsiveness: breakpoints, fluid typography, responsive images, container queries.
- Use proper CSS custom properties.
- Use public component CSS variables directly when that is clearest; use private `--_` variables only for internal composition, repeated derived values, or variant/state value switching.
- Use CSS Grid/Flexbox, mobile-first, and dark mode support.
- Use CSS logical properties for layout, sizing, spacing, positioning, borders, and radii.
- Use BEEQ semantic classes only where stable styling hooks are needed. Do not adopt full BEM as a methodology or add classes to every DOM node.
- Use host attributes for public variants and states; use `.is-*` only for internal state not already reflected on the host.
- Use SCSS mixins for repeated patterns such as focus rings and hover/active color mixing.
- Keep native-compatible nesting shallow: preferred depth `1`, maximum depth `2`.
- Use global `@layer` and selective component-local `@layer` only as defined in the migration plan.
- For migrated component PRs, run strict Stylelint scoped to each migrated component instead of the full `beeq:stylelint-strict` target until the workspace migration is complete.

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

---
description: Enforces modern, maintainable, and accessible SCSS/CSS practices for all component stylesheets.
applyTo: packages/beeq/src/components/**/*.{tsx,scss}
---

# Component Styling

- When possible, prefer CSS solutions over JavaScript solutions
- The BEEQ design system is built with Tailwind CSS. Use Tailwind CSS where possible for utility-first styling.
- You can abstract components styles to a separated SCSS file if necessary, associated with the component.
- It is ok using `apply` directive from Tailwind CSS to compose utility classes in SCSS files.
- Avoid using global styles, prefer component-scoped styles.
- Avoid using `!important` unless absolutely necessary.
- The tailwind.config.js file defines the design tokens (colors, spacing, typography, etc.) that should be used consistently across the application. It uses an opinionated preset generated from the beeq-tailwindcss packages (packages/beeq-tailwindcss).
- Follow modern SCSS/CSS best practices for maintainable, scalable, and accessible styles.
- Follow proper shadow DOM styling
- Optimize for performance: selector specificity, reflow/repaint, and animation.
- Ensure accessibility: color contrast, focus styles, reduced motion, print/high contrast support.
- Structure code for responsiveness: breakpoints, fluid typography, responsive images, container queries.
- Use proper CSS custom properties
- Use CSS Grid/Flexbox, mobile-first, and dark mode support.
- When using CSS class name, apply BEM naming, block/element/modifier/state patterns.
- Use SCSS mixins, functions, variables, maps, nesting, and extends for DRY, modular code.

---
name: BEEQ
description: Use when building, integrating, styling, theming, or reviewing UI with BEEQ components, tokens, themes, and framework wrappers.
license: Apache-2.0
compatibility: Works with BEEQ documentation, Storybook, @beeq/core, and official React, Angular, and Vue wrappers.
metadata:
  version: "1.0"
  docs: "https://www.beeq.design"
  storybook: "https://storybook.beeq.design"
  source: "https://github.com/Endava/BEEQ"
---

# BEEQ Agent Skill

## What BEEQ is

BEEQ is Endava's open-source design system. It provides production-ready web components, design tokens, themes, framework wrappers, and practical guidance for building consistent, accessible digital products.

BEEQ components are standard custom elements from `@beeq/core`. React, Angular, and Vue wrapper packages improve framework ergonomics without changing the underlying component APIs.

## When to use this skill

Use this skill when a user asks for help with:

- choosing or using BEEQ components
- integrating BEEQ in HTML, React, Angular, Vue, Next.js, or another web stack
- configuring icons, global styles, themes, or modes
- styling components with props, CSS custom properties, `::part()`, or BEEQ tokens
- using BEEQ foundations such as color, typography, spacing, grid guidance, radius, stroke, or shadows
- reviewing BEEQ examples for API accuracy, accessibility, or design-system alignment
- troubleshooting component props, events, slots, overlays, forms, icons, or framework wrappers

Do not use this skill as a substitute for the current documentation or source code. Use it to decide where to look, what constraints apply, and how to avoid common incorrect answers.

## First steps for agents

1. Identify the target framework or runtime: HTML/Web Components, React, Angular, Vue, Next.js, or another stack.
2. Identify the task type: component usage, setup, styling, theming, accessibility, troubleshooting, or migration.
3. Open the most specific BEEQ documentation page before answering.
4. Verify props, events, slots, methods, CSS custom properties, and shadow parts against the component page (`/components/<component-name>`) or source.
5. State assumptions when the user's project setup is unknown.
6. Cite the BEEQ page, Storybook entry, or source area used.

Never invent component names, props, events, slots, methods, CSS custom properties, `::part()` names, design tokens, utility classes, or package exports.

## Documentation lookup order

Use the most specific source available:

1. Component docs: `https://www.beeq.design/components/<component-name>`
2. Framework guides: `https://www.beeq.design/guides/frameworks/react`, `/angular`, `/vue`, `/next`, or `/html-web-components`
3. Styling guide: `https://www.beeq.design/guides/styles`
4. Theming docs: `https://www.beeq.design/theming/themes-and-modes`, `/global-css-variables`, `/component-css-variables`, and `/custom-theme`
5. Foundation docs: `https://www.beeq.design/foundations/colors`, `/typography`, `/spacing`, `/grid`, `/radius`, `/stroke`, and `/shadows`
6. Storybook: `https://storybook.beeq.design`
7. Documentation index: `https://www.beeq.design/llms.txt`
8. Full documentation context: `https://www.beeq.design/llms-full.txt`
9. MCP server for compatible tools: `https://www.beeq.design/mcp`
10. Source code, when repository access is available: `packages/beeq/src/components`, `packages/beeq-tailwindcss/src`, and `packages/beeq/cem/custom-elements.json`

Current source and component API references are canonical when docs, examples, or generated summaries disagree.

## Framework implementation rules

### React

- Prefer `@beeq/react` in React applications; follow the React guide (`/guides/frameworks/react`).
- Import PascalCase components, such as `BqButton` or `BqInput`.
- Use camelCase props, such as `onlyIcon`, `debounceTime`, and `justifyContent`.
- Use `onBq...` event handlers, such as `onBqClick` or `onBqInput`.
- Read component event data from `event.detail`.
- Use raw `bq-*` custom elements in React only when there is a deliberate reason and custom events are handled manually; compare against the HTML/Web Components guide (`/guides/frameworks/html-web-components`).

### Angular

- Prefer Standalone imports from `@beeq/angular/standalone`; follow the Angular guide (`/guides/frameworks/angular`).
- Do not generate NgModule examples unless the user is maintaining an existing module-based Angular app.
- Use Angular event binding syntax, such as `(bqClick)` or `(bqChange)`.
- Use BEEQ value accessors from the Standalone package for supported form integrations; check the Angular forms guidance (`/guides/frameworks/angular`).

### Vue

- Prefer `@beeq/vue` in Vue applications; follow the Vue guide (`/guides/frameworks/vue`).
- Import PascalCase components from `@beeq/vue`.
- Use Vue event syntax, such as `@bqClick` or `@bqChange`.
- Use `v-model` only for components and patterns documented as supporting it; check the Vue usage patterns (`/guides/frameworks/vue`).
- For Nuxt or SSR, run browser-only setup in a client-only plugin; check the Vue SSR guidance (`/guides/frameworks/vue`).

### HTML and Web Components

- Use raw `bq-*` elements, kebab-case attributes, and native `addEventListener`; follow the HTML/Web Components guide (`/guides/frameworks/html-web-components`).
- Load BEEQ styles once; check installation guidance (`/getting-started/installation`) and the framework guide for the target stack.
- Configure icons with the documented `data-beeq` script path or `setBasePath()` approach; check icon setup in the target framework guide.
- Use this path for static HTML, legacy apps, micro-frontends, and unsupported frameworks.

### Next.js and SSR

- Follow the Next.js guide (`/guides/frameworks/next`) rather than the generic React setup.
- Prefer SSR-ready imports from `@beeq/react/ssr` when rendering BEEQ components in Next.js server-rendered apps; check the `@beeq/react/ssr` section (`/guides/frameworks/next`).
- Run browser-only initialization, such as icon base path setup, on the client.
- Do not call browser-dependent BEEQ setup during server rendering.

## Styling and theming rules

Choose styling approaches in this order:

1. Use component props for supported visual variants and behavior; check the relevant component page (`/components/<component-name>`).
2. Use documented component CSS custom properties for local component customization; check Component CSS variables (`/theming/component-css-variables`).
3. Use documented `::part()` selectors when structural styling is required; check the styling guide (`/guides/styles`).
4. Use global `--bq-*` tokens and theme or mode attributes for system-wide changes; check Global CSS variables (`/theming/global-css-variables`) and Themes and modes (`/theming/themes-and-modes`).
5. Use custom CSS only when the requirement is outside the BEEQ design language.

Prefer BEEQ tokens for color, typography, spacing, radius, stroke, and shadows; check the foundation pages (`/foundations/colors`, `/typography`, `/spacing`, `/radius`, `/stroke`, and `/shadows`). Avoid arbitrary values unless the user has a specific product requirement.

Use BEEQ Tailwind utilities only when the consuming app has installed and configured the BEEQ Tailwind preset; check the Tailwind setup in the relevant framework guide. Do not imply that guidance-only foundations, such as grid layout patterns (`/foundations/grid`), are shipped as ready-made BEEQ classes.

Use `bq-theme` for brand/theme identity and `bq-mode` for light or dark mode; check Themes and modes (`/theming/themes-and-modes`). BEEQ does not replace the consuming app's responsibility for mode persistence, user preference handling, or product-specific theme switching.

## Component usage rules

- Start with the simplest valid component example, then add variants or advanced behavior.
- Include required labels, accessible names, and slots.
- Match documented framework syntax to the user's target framework.
- Explain whether an example uses a component prop, slot, event, method, CSS variable, or shadow part.
- Keep examples realistic and copy-pasteable, but do not overbuild app state unless the interaction requires it.
- For overlays, popovers, dialogs, drawers, notifications, toasts, dropdowns, and portals, verify placement, open/close behavior, events, and focus behavior against the relevant component docs (`/components/dialog`, `/drawer`, `/notification`, `/toast`, `/dropdown`, and related pages).
- For forms, verify value, validation, labels, helper text, events, and supported framework form bindings against the relevant component docs and framework guide.

## Accessibility rules

- Icon-only buttons must have an accessible `label`.
- Interactive controls need visible labels or accessible names.
- Preserve meaningful DOM/source order when layouts reflow.
- Preserve keyboard access, focus visibility, and semantic structure.
- Do not use color, shadow, stroke, radius, placement, or motion as the only state indicator.
- Avoid hiding disabled actions without explaining how the user can proceed.
- Ask the user to test keyboard behavior, screen reader output, forms, overlays, and error states in the consuming app.

## Common gotchas

- Components look unstyled when BEEQ global styles are missing or loaded in the wrong place; check installation (`/getting-started/installation`) and the target framework guide.
- Icons do not render when SVG files are not served or the icon base path does not match the public URL; check icon setup in the target framework guide.
- React event handlers should use wrapper props like `onBqClick`; raw custom element events need manual handling.
- React props use camelCase, not kebab-case attributes.
- Angular examples should use Standalone components unless legacy NgModule support is explicitly requested.
- Vue examples should not assume `v-model` support without checking the component guide.
- Theme and mode are separate concerns: use `bq-theme` for identity and `bq-mode` for light/dark.
- Component CSS variables are component-scoped; global tokens affect broader theming. Check Component CSS variables (`/theming/component-css-variables`) and Global CSS variables (`/theming/global-css-variables`).
- `::part()` only works for parts the component exposes and documents; check the styling guide (`/guides/styles`) and the component API.
- BEEQ Tailwind utilities require the BEEQ Tailwind preset; check the relevant framework guide before using them.

## Verification checklist

Before finalizing an answer or generated code:

- The target framework is identified.
- The relevant BEEQ docs page or source area was checked.
- Component names, props, events, slots, methods, CSS variables, and parts are documented.
- Framework syntax matches the selected stack.
- Global styles and icon setup are accounted for when components or icons are used.
- Theme and mode assumptions are stated.
- Styling uses BEEQ props, tokens, CSS variables, or documented parts before arbitrary CSS.
- Interactive components have accessible labels and keyboard/focus considerations.
- Generated code is described as a starting point that should be tested in the consuming app.

## Resources

- Documentation: `https://www.beeq.design`
- AI tools guide: `https://www.beeq.design/getting-started/ai-tools`
- Documentation index: `https://www.beeq.design/llms.txt`
- Full documentation context: `https://www.beeq.design/llms-full.txt`
- MCP server: `https://www.beeq.design/mcp`
- Components overview: `https://www.beeq.design/components/overview`
- Framework guides: `https://www.beeq.design/getting-started/for-developers`
- Styling guide: `https://www.beeq.design/guides/styles`
- Theming: `https://www.beeq.design/theming/themes-and-modes`
- Storybook: `https://storybook.beeq.design`
- Source: `https://github.com/Endava/BEEQ`

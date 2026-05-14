---
description: Guidelines for writing and maintaining Mintlify MDX documentation pages for BEEQ Design System components. Covers page structure, tone, Mintlify components, code examples, live previews, CSS isolation, and accessibility documentation.
applyTo: apps/beeq-docs/**/*.{mdx,md,jsx}
---

# Documentation Guidelines

## Audience and Tone

Documentation is read by developers, designers, product managers, and other stakeholders — not just engineers. Write for all of them.

- Use plain, direct language. Avoid internal jargon or references to internal tooling (e.g., "this comes from the original design guidance").
- Prefer active voice and short sentences.
- Explain *why* a pattern exists, not just *what* it does.
- Use second-person ("you") when addressing the reader directly.
- Avoid filler phrases such as "simply", "just", "easily", "note that", or "please".

---

## Page Structure

Every component documentation page must follow this section order:

1. **Frontmatter** — `title` and `description`
2. **Imports** — all MDX snippet imports at the top
3. **Overview Frame** — light/dark image pair with caption
4. **Introduction paragraph** — one or two sentences describing the component and its primary purpose
5. **Note** (optional) — a key requirement or gotcha that affects all uses (e.g., accessibility requirement)
6. **When to use** — two-column `CardGroup` with a Do card and a Don't card using bullet lists
7. **Patterns** (optional) — common real-world contexts where the component adds value
8. **Anatomy** — light/dark anatomy image in a `Frame`, followed by a parts table
9. **Design guidelines** — shape, sizing rules, visual behavior guidance using `CardTile`, `Steps`, and `Note`
10. **Usage** — primary variants (Text, Image, etc.) with `CodeLivePreview` + `CodeGroup`
11. **Options** — additional configurations and combination patterns with `CodeLivePreview` + `CodeGroup`
12. **Best practices** — four-column (2×2) `CardGroup` with Do/Don't pairs
13. **Accessibility** — built-in behaviors and requirements; do not repeat the API reference
14. **API reference** — Properties, Slots, Shadow parts, CSS custom properties tables
15. **Resources** — two-column `CardGroup` linking to Storybook and GitHub source

---

## Frontmatter

```mdx
---
title: Component Name
description: One sentence that captures what the component is and its primary purpose.
---
```

---

## Imports

Place all imports at the very top, immediately after frontmatter, using absolute paths.

```mdx
import { CardTile } from '/snippets/CardTile.jsx';
import { CodeLivePreview } from "/snippets/CodeLivePreview.jsx";
```

Only import what is used on the page.

---

## Overview Frame

Use a `Frame` with light and dark image variants:

```mdx
<Frame className="px-4 py-4" caption="[Component] component overview">
  <img className="block dark:hidden" src="/components/images/[component]/[component]-overview-light.svg" alt="BEEQ [Component] component overview" />
  <img className="hidden dark:block" src="/components/images/[component]/[component]-overview-dark.svg" alt="BEEQ [Component] component overview" />
</Frame>
```

---

## Anatomy Section

Use anatomy-specific images (not the overview image):

```mdx
<Frame className="px-4 py-4" caption="[Component] component anatomy">
  <img className="block dark:hidden" src="/components/images/[component]/[component]-anatomy-light.svg" alt="BEEQ [Component] component anatomy" />
  <img className="hidden dark:block" src="/components/images/[component]/[component]-anatomy-dark.svg" alt="BEEQ [Component] component anatomy" />
</Frame>
```

Follow with a brief description and a parts table with columns: **Part**, **Element**, **Description**.

---

## Design Guidelines Section

Use `CardTile` for visual shape/style guidance:

```mdx
<CardGroup cols={2}>
  <CardTile
    title="Descriptive title"
    imageLightSrc="/components/images/[component]/[image]-light.svg"
    imageDarkSrc="/components/images/[component]/[image]-dark.svg"
  >
    Explanation of when and why to use this variant.
  </CardTile>
</CardGroup>
```

Use `Steps` for sequential rules such as size-based trimming:

```mdx
<Steps>
  <Step title="xsmall">Shows **1 character**.</Step>
  <Step title="small">Shows **2 characters**.</Step>
</Steps>
```

Use `Note` for automatic or fallback behaviors that require no user action:

```mdx
<Note>
  Brief statement of the automatic behavior and what it means for the developer.
</Note>
```

---

## CodeLivePreview

`CodeLivePreview` injects the `code` prop into a **shadow root** attached to the `.preview` div. The shadow root provides full CSS isolation — Mintlify and Tailwind styles cannot reach inside it. `beeq.css` is loaded inside the shadow root automatically, so all BEEQ components and raw HTML elements render correctly without any extra setup.

CSS custom properties (`--bq-*`) inherit through the shadow boundary, so design tokens and dark/light mode work without changes.

### CSS inside the `code` prop — use `:host`

The shadow root's host element is the `.preview` div. The `CodeLivePreview` stylesheet sets the following properties on it by default: `display: flex`, `align-items: center`, `justify-content: center`, `flex-direction: column` (switching to `row` at ≥40rem via container query), `gap: var(--bq-spacing-m)`, and `padding: var(--bq-spacing-l)`.

To override host layout, use `:host` inside a `<style>` block:

```html
<style>
  :host {
    /* Override the shadow host (.preview) flex defaults */
    flex-direction: column !important;
    gap: var(--bq-spacing-m) !important;
  }

  .my-wrapper {
    /* Target descendants inside the shadow root — no isolation needed */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
</style>
```

**Rules:**

- Use `:host` to target the `.preview` container itself. All layout overrides on `:host` require `!important` to beat the `CodeLivePreview` stylesheet's specificity.
- Use any other selector (`.my-class`, `bq-button`, `h1`, etc.) to target elements inside the preview — no scoping wrapper needed; the shadow boundary isolates everything automatically.
- **Do not use `@scope`** — it was the previous approach for light-DOM isolation and is no longer needed. All existing `@scope { :scope {} }` blocks have been migrated to `:host {}`.
- `@media` and `@supports` can be used normally inside `<style>`.

**Correct:**
```html
<style>
  :host { flex-direction: column !important; gap: var(--bq-spacing-m) !important; }

  .avatar--group { display: flex; }

  @media (min-width: 640px) {
    .avatar--group { flex-direction: row; }
  }
</style>
```

**Incorrect:**
```html
<!-- Old approach — do not use -->
<style>
  @scope { :scope { flex-direction: column !important; } }
</style>

<!-- Not a real browser feature -->
<style scoped> ... </style>
```

### JavaScript in `code` prop

Inline `<script>` blocks are executed via `new Function('previewRoot', ...)`. The shadow root is passed as the `previewRoot` parameter — use it to query elements inside the preview. Do **not** use `document.currentScript` (always `null` for dynamically created scripts) or `document.querySelector` (cannot cross shadow boundaries).

Wrap logic in an IIFE to avoid variable leakage across multiple re-renders:

```html
<script>
  (() => {
    const btn = previewRoot.querySelector('bq-button');
    btn?.addEventListener('bqClick', () => { /* ... */ });
  })();
</script>
```

### Wrapper divs and layout

The `.preview` shadow host already applies `display: flex`, `align-items: center`, `justify-content: center`, `flex-direction: column` (switching to `row` at ≥40rem via container query), `gap: var(--bq-spacing-m)`, and `padding: var(--bq-spacing-l)`. Do **not** add a wrapper `<div>` around the example just to achieve alignment, centering, or spacing between sibling components — the host handles all of it.

If you only need to tweak alignment or spacing, override `:host` directly (with `!important`):

```html
<style>
  :host {
    justify-content: space-around !important;
    gap: var(--bq-spacing-l) !important;
  }
</style>
```

Only add a wrapper element when the layout the example needs is fundamentally different from the default `.preview` flex behavior, such as:
- `position: relative` for absolutely positioned children (e.g., a badge layered on top of an icon)
- Negative margins for an overlapping group effect (e.g., stacked avatars)
- A grid, multi-row, or wrapping layout that flex cannot express
- A dimension constraint (fixed width, aspect ratio) that must apply to a specific subtree

When a wrapper is genuinely needed:

- Give it a BEM-style class name (e.g., `.avatar--group`, `.badge--icon`, `.dropdown-custom`).
- Style it inside a `<style>` block via a normal selector (`.avatar--group { ... }`).
- Keep the wrapper class name consistent between the `code` prop and the framework code tabs.
- Drop the CSS code tab entirely from the `CodeGroup` if the wrapper exists only for preview isolation and carries no educational value for users.

---

## CSS Code Tab

The CSS tab in a `CodeGroup` is for **copy-paste documentation** — it shows users how to style the component in their own project. Apply these rules:

- Use plain CSS selectors, **not** `@scope`. Users control their own scope naturally.
- Use modern CSS nesting (`& child`, `&::part(x)`, `&:hover`) for readability.
- Prefer `--bq-*` CSS custom properties and design tokens over hardcoded values.
- Always use CSS logical properties (e.g., `margin-inline-start` instead of `margin-left`) for better internationalization support.
- Be aware of component-specific CSS variables and shadow parts by checking the source code before writing examples.

**Correct:**
```css
.avatar--group {
  display: flex;

  & bq-avatar {
    margin-inline-start: calc(var(--bq-spacing-xs) * -1);

    &::part(base):hover {
      scale: 1.2;
    }
  }
}
```

**Incorrect:**
```css
@scope (.avatar--group) {
  /* Don't use @scope in the CSS code tab */
}
```

---

## CodeGroup Framework Tabs

Every `CodeLivePreview` must include a `CodeGroup` with tabs for all four frameworks in this order:

1. `HTML`
2. `React`
3. `Angular`
4. `Vue`

Add an optional `CSS` tab first when custom styles are part of the example and it's important for users to see them in context.

### Prop naming by framework

| Framework | Convention | Example |
|---|---|---|
| HTML | kebab-case attributes | `alt-text`, `background-color` |
| Angular | kebab-case attributes | `alt-text`, `background-color` |
| React | camelCase props | `altText`, `backgroundColor` |
| Vue | camelCase props | `altText`, `backgroundColor` |

Vue component wrappers use camelCase — **never** copy HTML attribute names into Vue tabs.

---

## Mintlify Component Reference

| Component | Use for |
|---|---|
| `Frame` | Wrapping images with captions |
| `CardGroup` | Side-by-side card layouts |
| `Card` | Text-only cards (When to use, Best practices, Resources) |
| `CardTile` | Image-bearing cards in Design guidelines |
| `Steps` / `Step` | Sequential, ordered guidance (e.g., size rules) |
| `Note` | Neutral important information; automatic behaviors |
| `Tip` | Actionable suggestions; customization hints |
| `Warning` | Behavior that may surprise or break things |
| `Expandable` | Collapsible sections (e.g., CSS variables table when >5 variables) |
| `Icon` | Inline icons in card headings |
| `CodeGroup` | Multi-tab code blocks |
| `Tabs` / `Tab` | Tabbed content sections |
| `Tiles` | Grid of image tiles with captions |
| `Badge` | Inline status or label pill |
| `Visibility` | Show different content to humans on the web UI vs. AI agents in Markdown output |

More components are available in the [Mintlify documentation](https://www.mintlify.com/docs/components/index).

!Important: Mintlify allows you to style components with Tailwind classes v3 or custom CSS. Always check the documentation for the specific component to see what styling options are available and recommended.

### Do / Don't card pattern

```mdx
<Card>
  <span className="flex items-center mr-2 text-lg font-medium" role="heading">
    <Icon className="mr-2" icon="check" iconType="solid" size={20} color="var(--bq-stroke--success)" />
    Do
  </span>
  Positive guidance as a complete sentence.
</Card>

<Card>
  <span className="flex items-center mr-2 text-lg font-medium" role="heading">
    <Icon className="mr-2" icon="xmark" iconType="solid" size={20} color="var(--bq-stroke--danger)" />
    Don't
  </span>
  What to avoid and briefly why.
</Card>
```

---

## When to Use Section

Always use a two-column `CardGroup` with exactly two cards — one "Use when" and one "Do not use when":

- Use `thumbs-up` + `var(--bq-stroke--success)` for the Do card
- Use `thumbs-down` + `var(--bq-stroke--danger)` for the Don't card
- Use bullet lists inside each card, not prose

---

## Best Practices Section

Use a 2×2 `CardGroup` (4 pairs minimum, 8 cards total). Each pair must contain:

- A **Do** card with a `check` icon
- A **Don't** card with an `xmark` icon

Cover different aspects: layout, content, accessibility, consistency.

---

## Accessibility Section

Document what the component does automatically and what the developer must do:

- List built-in ARIA attributes (`role`, `aria-label`, `aria-*`) applied by the component
- State what props feed those attributes (e.g., "`label` prop maps to `aria-label`")
- List what the developer is responsible for (e.g., providing meaningful `label`, wrapping interactive patterns)
- Do **not** repeat API property descriptions already in the reference table

---

## API Reference Section

Use four subsections in this order:

1. **Properties** — columns: Property, Attribute, Description, Type, Default
2. **Slots** — columns: Slot, Description
3. **Shadow parts** — columns: Part, Description
4. **CSS custom properties** — if the component has **more than 5 variables**, wrap in `<Expandable title="CSS variables" defaultOpen={true}>` (use `defaultOpen={false}` when the list is very long, e.g. 20+); if **5 or fewer**, display the markdown table directly without an `<Expandable>` wrapper. Columns: Variable, Description, Default

   **Default values must use `var(--bq-*)` CSS custom properties** — never Tailwind `theme()` function calls. Use the values from `bq-<name>.variables.scss` as the source of truth and map them to their underlying `var(--bq-*)` equivalents. Hardcoded values (e.g. `transparent`, `none`, `solid`, `unset`, plain numbers like `0` or `10`, pixel values like `24px`) are kept as-is.

Follow with a `Tip` linking to theming guides:

```mdx
<Tip>
  Learn more about [styling with shadow parts](/theming/styles) and [CSS custom properties](/theming/global-css-variables).
</Tip>
```

---

## Resources Section

Always end with a two-column `CardGroup`:

```mdx
<CardGroup cols={2}>
  <Card horizontal title="Interactive playground" icon="code" href="https://storybook.beeq.design/?path=/story/components-[component]--[story]">
    Explore [component] variants and states in Storybook
  </Card>
  <Card horizontal title="Source code" icon="github" href="https://github.com/Endava/BEEQ/tree/main/packages/beeq/src/components/[component]">
    View the component source on GitHub
  </Card>
</CardGroup>
```

---

## Image Paths

All component images follow this convention:

```
/components/images/[component]/[component]-[variant]-[theme].svg
```

Examples:
- `/components/images/avatar/avatar-overview-light.svg`
- `/components/images/avatar/avatar-anatomy-dark.svg`
- `/components/images/avatar/avatar-shape-circle-light.svg`

Always provide both `-light` and `-dark` variants using `className="block dark:hidden"` and `className="hidden dark:block"` respectively.

---

## CSS Custom Property Naming

BEEQ CSS variables follow this pattern: `--bq-[component]-[property]` or `--bq-[component]--[property]`.

- Single dash after component name for top-level properties (e.g., `--bq-avatar-background`)
- Double dash before sub-properties or modifiers (e.g., `--bq-avatar--border-color`, `--bq-avatar--size-small`)

Always verify against the component's `*.variables.scss` source before documenting.

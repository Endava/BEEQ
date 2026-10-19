---
description: Mandatory structure and sections for BEEQ component documentation pages: overview, anatomy, design guidelines, when to use, best practices, accessibility, API reference, resources, images and CSS custom property naming.
applyTo: apps/beeq-docs/**/*.{mdx,md,jsx}
---

# Component Documentation Pages

See [documentation guidelines](documentation.instructions.md) for tone, frontmatter, imports and Mintlify components, and [code examples](code-examples.instructions.md) for previews and tabs.

## Page Structure

Every component documentation page must follow this section order:

1. **Frontmatter** — `title` and `description`
2. **Imports** — all MDX snippet imports at the top
3. **Overview Frame** — light/dark image pair with caption
4. **Introduction paragraph** — one or two sentences describing the component and its primary purpose
5. **Note** (optional) — a key requirement or gotcha that affects all uses (e.g., accessibility requirement)
6. **When to use** — two-column `CardGroup` with a Do card and a Don't card using bullet lists, followed by a [related-components](#related-components-in-when-to-use) sentence
7. **Patterns** (optional) — common real-world contexts where the component adds value
8. **Anatomy** — light/dark anatomy image in a `Frame`, followed by a parts table
9. **Design guidelines** — shape, sizing rules, visual behavior guidance using `CardTile`, `Steps`, and `Note`
10. **Usage** — primary variants (Text, Image, etc.) with `CodeLivePreview` + `CodeGroup`
11. **Options** — additional configurations and combination patterns with `CodeLivePreview` + `CodeGroup`, with [allowed values](#allowed-values-in-options) written as text
12. **Best practices** — four-column (2×2) `CardGroup` with Do/Don't pairs
13. **Accessibility** — built-in behaviors and requirements, a keyboard interaction table and a rules table; do not repeat the API reference
14. **API reference** — Properties (plus Invalid combinations), Slots, Shadow parts, CSS custom properties tables
15. **Resources** — two-column `CardGroup` linking to Storybook and GitHub source

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

## Related Components (in When to use)

Components that look alike MUST name each other. Right after the When to use cards, add one sentence on **both** pages naming the sibling and the deciding condition, wrapped in a `<Tip>`:

```mdx
<Tip>
  Choose [`bq-textarea`](/components/textarea) instead of `bq-input` when users enter more than one line of text.
</Tip>
```

- Name only siblings that have a page in `docs.json`, and link them.
- State the condition that picks between them, never a bare "see also".
- Typical pairs: Input/Textarea, Select/Radio/Dropdown, Checkbox/Switch/Radio, Date picker/Time picker, Tooltip/Dialog/Drawer, Alert/Notification/Toast, Tab/Steps.

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

## When to Use Section

Always use a two-column `CardGroup` with exactly two cards — one "Use when" and one "Do not use when":

- Use `thumbs-up` + `var(--bq-stroke--success)` for the Do card
- Use `thumbs-down` + `var(--bq-stroke--danger)` for the Don't card
- Use bullet lists inside each card, not prose

```mdx
<CardGroup cols={2}>
  <Card>
    <span className="flex items-center mr-2 text-lg font-medium" role="heading">
      <Icon className="mr-2" icon="thumbs-up" iconType="solid" size={20} color="var(--bq-stroke--success)" />
      Use [component] when
    </span>
    - bullet 1
  </Card>
  <Card>
    <span className="flex items-center mr-2 text-lg font-medium" role="heading">
      <Icon className="mr-2" icon="thumbs-down" iconType="solid" size={20} color="var(--bq-stroke--danger)" />
      Do not use [component] when
    </span>
    - bullet 1
  </Card>
</CardGroup>
```

---

## Allowed Values (in Options)

Whenever a page uses a word that names a dimension (variants, sizes, types, placements, statuses), write its allowed values as text, not only as rendered examples. Add one line under the matching Options heading, or a table when there are several dimensions:

```mdx
**Allowed `size` values:** `small`, `medium` (default), `large`.
```

- Take values and defaults from the source types (`bq-<name>.types.ts`), not from memory.
- If a value only works with another prop, say which.

---

## Best Practices Section

Use a 2×2 `CardGroup` (4 pairs minimum, 8 cards total). Each pair must contain:

- A **Do** card with a `check` icon
- A **Don't** card with an `xmark` icon

Cover different aspects: layout, content, accessibility, consistency. Each card is a complete sentence or clear imperative, not a label.

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

## Accessibility Section

Document what the component does automatically and what the developer must do:

- List built-in ARIA attributes (`role`, `aria-label`, `aria-*`) applied by the component
- State what props feed those attributes (e.g., "`label` prop maps to `aria-label`")
- List what the developer is responsible for (e.g., providing meaningful `label`, wrapping interactive patterns)
- Do **not** repeat API property descriptions already in the reference table
- Write every requirement in this section with a plain lowercase [rule strength keyword](documentation.instructions.md#rule-strength-rfc-2119) ("must", "should"); capitals live only in the Rules table
- Restate each requirement as a row of the page's `### Rules` table (see [Rules and verification](#rules-and-verification)). Update the table whenever the bullets change

### Keyboard interaction

Every interactive component has a `### Keyboard interaction` table with one row per key. Never write "supports keyboard navigation" without the table.

```mdx
| Key | Context | Action |
|---|---|---|
| `Tab` | Trigger focused | Moves focus to the next focusable element |
| `Escape` | Panel open | Closes the panel and returns focus to the trigger |
```

- **Context** is the state in which the key applies (for example "Panel open", "Any"). Use "Any" when none.
- Verify each row against the component's key handlers and e2e tests; list a key only if the component handles it or the native element does.
- A non-interactive component states "No keyboard interaction: the component is not focusable." instead of a table.

### Rules and verification

Every component page ends its Accessibility section, after Keyboard interaction, with a `### Rules` table that says how strongly each requirement applies and how it is verified. The table is visible HTML, so readers and crawlers both get the capitalised strength:

```mdx
| Rule | Strength | Verified by |
|---|---|---|
| Provide a visible label in the `label` slot | MUST | manual |
| Set `name` for form submission | MUST | automated: `bq-input.e2e.tsx` |
```

- **Verified by** is `automated` (name the test file that asserts it), `assisted` (a tool or lint rule helps, name it) or `manual` (review or screen reader check).
- Use `automated` only when a test in the repo asserts the behavior. When unsure, use `manual`.
- Write "Do not X" rows for `MUST NOT` / `SHOULD NOT`. Don't use `<Visibility for="agents">` for rules: crawlers that read the rendered HTML don't see it, so the table is the only copy.

---

## API Reference Section

Use four subsections in this order:

1. **Properties** — columns: Property, Attribute, Description, Type, Default
2. **Slots** — columns: Slot, Description
3. **Shadow parts** — columns: Part, Description
4. **CSS custom properties** — if the component has **more than 5 variables**, wrap in `<Expandable title="CSS variables" defaultOpen={true}>` (use `defaultOpen={false}` when the list is very long, e.g. 20+); if **5 or fewer**, display the markdown table directly without an `<Expandable>` wrapper. Columns: Variable, Description, Default

   **Default values must use `var(--bq-*)` CSS custom properties** — never Tailwind `theme()` function calls. Use the values from `bq-<name>.variables.scss` as the source of truth and map them to their underlying `var(--bq-*)` equivalents. Hardcoded values (e.g. `transparent`, `none`, `solid`, `unset`, plain numbers like `0` or `10`, pixel values like `24px`) are kept as-is.

Every component page adds an `### Invalid combinations` subsection right after Properties (or after the properties of the last component on multi-component pages), listing props that cannot be used together and what happens when they are. Pages with no source-backed combinations say so:

```mdx
| Combination | Strength | Result |
|---|---|---|
| `time` without `auto-dismiss` | SHOULD NOT | `time` is ignored |
```

Use MUST NOT when the combination breaks behavior, logs a console warning or error, or removes accessibility. Use SHOULD NOT when one prop is simply ignored. State only combinations verified in the source or tests. If the component has none, write "No invalid prop combinations." Skip invalid enum values, which fall back to defaults and are not combinations.

Follow with a `Tip` linking to theming guides:

```mdx
<Tip>
  Learn more about [styling with shadow parts](/guides/styles#component-shadow-dom-parts) and [CSS custom properties](/guides/styles#global-css-custom-properties).
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

BEEQ CSS variables follow this pattern: `--bq-[component]--[property]` (e.g., `--bq-avatar--border-color`, `--bq-avatar--size-small`).

- Always use a double dash between the component name and the property.
- Legacy exceptions that use a single dash: `--bq-avatar-background`, `--bq-dialog-z-index` and `--bq-panel-z-index`. Document them as they are; do not use them as a pattern for new variables.

Always verify against the component's `*.variables.scss` source before documenting.

---
name: doc-component
description: Generate or complete a Mintlify MDX documentation page for a BEEQ component. Reads the component source to extract props, events, slots, shadow parts, and CSS variables, and follows the mandatory page structure from the documentation guidelines.
argument-hint: Component name (e.g. "card") or path to the component tsx file, link to the component source file, or link to an existing incomplete documentation page.
---

# Write documentation for BEEQ components

## When to use

- When creating a new MDX page in [apps/beeq-docs/components/](../../../apps/beeq-docs/components/) for an existing `bq-*` component.
- When migrating a Zeroheight docs page to Mintlify.
- When refilling missing sections on a partially-written page.
- Before merging a new or migrated MDX page in [apps/beeq-docs/components/](../../../apps/beeq-docs/components/).
- When normalizing pages for consistency across the docs site.
- When a docs reviewer flags structure or tone issues.

## When NOT to use this skill

- When the page already exists and only needs an audit → use [review-doc](../review-doc/SKILL.md).
- When the component itself is missing or incomplete — finish the component first with [create-component](../create-component/SKILL.md) and [review-component](../review-component/SKILL.md).
- For non-component pages (getting-started, guides, framework integrations).

## Before You Start

1. Read the instructions files for this task, in full before writing a single line:
   - [Documentation instructions](../../instructions/documentation.instructions.md). It defines the mandatory page structure, all component usage patterns, CSS isolation rules, and framework tab ordering.
2. Read the component source
   - These files are the ground truth for the API reference. Do not  document any prop, event, slot, part, or CSS variable that does not exist in the source:
      - `packages/beeq/src/components/<name>/bq-<name>.tsx` — `@Prop`, `@Event`, `@Method`, class-level JSDoc (`@slot`, `@part`, `@cssprop`, `@attr`)
      - `packages/beeq/src/components/<name>/bq-<name>.types.ts` — prop type unions and constants
      - `packages/beeq/src/components/<name>/scss/bq-<name>.variables.scss` — all `--bq-<name>-*` CSS custom properties with their defaults
   - Cross-check against the Custom Elements Manifest output in [packages/beeq/cem/](../../../packages/beeq/cem/) — it is the canonical machine-readable description of every component's public API and should match what you put in the API tables.
   - Also read an existing complete documentation page as a structural reference:
    [apps/beeq-docs/components/icon.mdx](../../../apps/beeq-docs/components/icon.mdx) or [apps/beeq-docs/components/badge.mdx](../../../apps/beeq-docs/components/badge.mdx).

## Procedure

### 1. Mandatory page structure (exact order)

Write the page in this section order — do not skip or reorder:

1. **Frontmatter** (`title`, `description`)
2. **Imports** (at top, after frontmatter; only import what is used)
3. **Overview Frame** (light + dark SVG pair, using `block dark:hidden` / `hidden dark:block`)
4. **Introduction paragraph** (1–2 sentences: what the component is and its primary purpose)
5. **Note** (optional — only for a gotcha that affects all uses)
6. **When to use** (2-column `CardGroup` with Do / Don't cards using bullet lists)
7. **Patterns** (optional — common real-world contexts)
8. **Anatomy** (light + dark anatomy SVG in a `Frame`, followed by a parts table)
9. **Design guidelines** (`CardTile`, `Steps`, `Note` as appropriate)
10. **Usage** (primary variants with `CodeLivePreview` + `CodeGroup`)
11. **Options** (additional configurations with `CodeLivePreview` + `CodeGroup`)
12. **Best practices** (2×2 `CardGroup`, 4 Do/Don't pairs minimum)
13. **Accessibility** (built-in behaviors + developer responsibilities)
14. **API reference** (Properties, Slots, Shadow parts, CSS custom properties)
15. **Resources** (2-column `CardGroup` with Storybook + GitHub source links)

## 2. Key patterns to apply

### Image paths
All images follow: `/components/images/<name>/<name>-[variant]-[light|dark].svg`

Every image appears twice — once with `className="block dark:hidden"` and once with `className="hidden dark:block"`.

### When to use cards

```mdx
<CardGroup cols={2}>
  <Card>
    <span className="flex items-center mr-2 text-lg font-medium" role="heading">
      <Icon className="mr-2" icon="thumbs-up" iconType="solid" size={20} color="var(--bq-stroke--success)" />
      Use [component] when
    </span>
    - bullet 1
    - bullet 2
  </Card>
  <Card>
    <span className="flex items-center mr-2 text-lg font-medium" role="heading">
      <Icon className="mr-2" icon="thumbs-down" iconType="solid" size={20} color="var(--bq-stroke--danger)" />
      Do not use [component] when
    </span>
    - bullet 1
    - bullet 2
  </Card>
</CardGroup>
```

### CodeLivePreview CSS isolation

`CodeLivePreview` injects code into a **shadow root** — Mintlify/Tailwind styles cannot reach inside it. `beeq.css` is loaded automatically. CSS custom properties (`--bq-*`) still inherit through the boundary.

To override the host (`.preview`) layout, use `:host` inside a `<style>` block. Override properties require `!important` to beat the `CodeLivePreview` stylesheet:
```html
<style>
  :host { flex-direction: column !important; gap: var(--bq-spacing-m) !important; }
  .my-wrapper { display: flex; gap: 1rem; }
</style>
```
Do **not** use `@scope` — it was the old light-DOM approach and is no longer needed.
Do **not** use `<style scoped>` — not a real browser feature.

Every <script> block must use `previewRoot` to query elements — `document.currentScript` is always `null` for dynamically created scripts, and `document.querySelector` cannot cross shadow boundaries. Wrap in an IIFE to prevent variable leakage:
```html
<script>
  (() => {
    const btn = previewRoot.querySelector('bq-button');
    btn?.addEventListener('bqClick', () => { /* ... */ });
  })();
</script>
```

Do not wrap examples in unnecessary `<div>`s for alignment purposes — use `:scope` overrides instead.

### CodeGroup tab order

Every `CodeLivePreview` must be followed by a `CodeGroup` with tabs in this order:
1. `HTML` (kebab-case attributes)
2. `React` (camelCase props, `onBqEventName` for events)
3. `Angular` (**`ts` code block**; full standalone `@Component`; `import { BqX } from "@beeq/angular/standalone"`; `(bqEventName)` for events; empty class body `{}` when no logic)
4. `Vue` (camelCase props, `@bqEventName` for events)

Add a `CSS` tab first only when custom styles are educationally relevant.

### Do / Don't card pattern (Best practices)

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

### Anatomy parts table

| Part | Element | Description |
|---|---|---|
| **1** | Name | What this part does |

### API reference — Properties table

| Property | Attribute | Description | Type | Default |
|---|---|---|---|---|
| `propName` | `prop-name` | Description from JSDoc | `'option1' \| 'option2'` | `'option1'` |

### API reference — CSS custom properties

If the component has **more than 5 variables**, wrap in `<Expandable title="CSS variables" defaultOpen={true}>` (use `defaultOpen={false}` when the list is very long, e.g. 20+). If **5 or fewer variables**, display the table directly — no `<Expandable>` wrapper needed. Columns: **Variable**, **Description**, **Default**.

Extract all variables from `bq-<name>.variables.scss`. **Default values must use `var(--bq-*)` CSS custom properties** — never Tailwind `theme()` function calls. Map each `theme(...)` value to its underlying `var(--bq-*)` equivalent. Hardcoded values (e.g. `transparent`, `none`, `solid`, `unset`, plain numbers like `0` or `10`, pixel values like `24px`) are kept as-is.

### Resources section

```mdx
<CardGroup cols={2}>
  <Card horizontal title="Interactive playground" icon="code" href="https://storybook.beeq.design/?path=/story/components-<name>--default">
    Explore <name> variants and states in Storybook
  </Card>
  <Card horizontal title="Source code" icon="github" href="https://github.com/Endava/BEEQ/tree/main/packages/beeq/src/components/<name>">
    View the component source on GitHub
  </Card>
</CardGroup>
```

## 3. Writing standards

- Write for all audiences: developers, designers, PMs. Use plain language.
- Active voice, short sentences, second-person ("you").
- No filler: no "simply", "just", "easily", "note that", "please", "for clarity".
- Explain *why* a pattern exists, not just *what* it does.

### Avoid these anti-patterns

**1. Defining terms the reader already knows** — use the correct term and trust the reader. Do not add "also known as" aliases.

❌ `CSS custom properties, also known as CSS variables, let you…`  
✅ `CSS custom properties follow the --bq-* naming convention…`

**2. "Once X is Y, you can Z"** — go straight to the action. Avoid dependent clauses that restate what was just explained.

❌ `Once the part is exposed, you can style it with ::part().`  
✅ `Style it using ::part() from your own stylesheet:`

**3. Hedged observations** — lead with outcomes, not "works well together when you want to…" constructions.

❌ `These two approaches work well together when you need more control.`  
✅ `Combine CSS variables and ::part() when token overrides alone aren't enough.`

**4. Callouts that disclaim** — `<Note>`, `<Tip>`, and `<Warning>` should give the reader a useful constraint or shortcut, not justify a documentation choice.

❌ `The examples use inline CSS for clarity.`  
✅ `The examples use inline <style> tags so you can run them directly.`

- Output path: `apps/beeq-docs/components/<name>.mdx`.

After writing, run [review-doc](../review-doc/SKILL.md) on the new page to verify compliance.

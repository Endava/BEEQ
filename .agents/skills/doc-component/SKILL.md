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
- For non-component pages such as foundations, theming, getting started, guides, framework integrations, or migration docs. Follow the shared documentation instructions and use [review-doc](../review-doc/SKILL.md) for review.

## Before You Start

1. Read the instructions files for this task, in full before writing a single line:
   - [Documentation instructions](../../../.github/instructions/documentation.instructions.md). It defines the mandatory component page structure, non-component page guidance, component usage patterns, CSS isolation rules, and code tab ordering.
2. Read the component source
   - These files are the ground truth for the API reference. Do not document any prop, event, slot, part, or CSS variable that does not exist in the source:
      - `packages/beeq/src/components/<name>/bq-<name>.tsx` — `@Prop`, `@Event`, `@Method`, class-level JSDoc (`@slot`, `@part`, `@cssprop`, `@attr`)
      - `packages/beeq/src/components/<name>/bq-<name>.types.ts` — prop type unions and constants
      - `packages/beeq/src/components/<name>/scss/bq-<name>.variables.scss` — all `--bq-<name>-*` CSS custom properties with their defaults
   - Cross-check against the Custom Elements Manifest output in [packages/beeq/cem/](../../../packages/beeq/cem/) — it is the canonical machine-readable description of every component's public API and should match what you put in the API tables.
   - Do not infer props, events, slots, shadow parts, or CSS custom properties from Zeroheight or old docs. Migrated content is reference material for tone and concepts, not API truth.
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

### CodeLivePreview isolation

Prefer `mode="iframe"` for new `CodeLivePreview` examples. Iframe mode gives the example a full document sandbox, so Mintlify layout, CSS, and page scripts cannot influence the preview, and preview scripts cannot disrupt the docs page.

Always pass the mode explicitly:

```mdx
<CodeLivePreview mode="iframe" height="12rem" code={`...`} />
```

Use iframe mode whenever an example includes layout behavior, scripts, overlays, popovers, fixed or absolute positioning, responsive containers, page-like composition, or anything that could conflict with the Mintlify documentation shell. Always include an explicit `height`; use `removePadding` when preview padding would hide the real layout behavior.

Shadow mode is still allowed for small, component-local examples that will not disrupt the Mintlify page and do not need full document isolation. In shadow mode, `CodeLivePreview` injects code into a **shadow root**. `beeq.css` is loaded automatically, and CSS custom properties (`--bq-*`) still inherit through the boundary.

In shadow mode, override the host (`.preview`) layout with `:host` inside a `<style>` block. Override properties require `!important` to beat the `CodeLivePreview` stylesheet:
```html
<style>
  :host { flex-direction: column !important; gap: var(--bq-spacing-m) !important; }
  .my-wrapper { display: flex; gap: 1rem; }
</style>
```
Do **not** use `@scope` — it was the old light-DOM approach and is no longer needed.
Do **not** use `<style scoped>` — not a real browser feature.

Every <script> block must use `previewRoot` to query elements inside the preview. In iframe mode, `previewRoot` is the iframe document. In shadow mode, `previewRoot` is the shadow root. `document.currentScript` is always `null` for dynamically created scripts. Wrap in an IIFE to prevent variable leakage:
```html
<script>
  (() => {
    const btn = previewRoot.querySelector('bq-button');
    btn?.addEventListener('bqClick', () => { /* ... */ });
  })();
</script>
```

Do not wrap examples in unnecessary `<div>`s for alignment purposes. In shadow mode, use `:host` overrides for preview layout. In iframe mode, use normal document CSS inside the preview.

### CodeGroup tab order

Every `CodeLivePreview` must be followed by a `CodeGroup`. The code shown in the tabs must align with what the preview renders.

Use this tab order:
1. `CSS` — only when the styles are essential for understanding or reusing the example
2. `JavaScript` — only when the script is long enough to deserve its own tab
3. `HTML` (kebab-case attributes)
4. `React` (camelCase props, `onBqEventName` for events)
5. `Angular` (`ts` code block; standalone `@Component`; `import { BqX } from "@beeq/angular/standalone"`; `(bqEventName)` for events; empty class body `{}` when no logic)
6. `Vue` (camelCase props, `@bqEventName` for events)

Every fenced code block used as a Mintlify tab must include `expandable` and the correct icon:

| Tab | Opening fence |
|---|---|
| CSS | `css styles.css icon="css" expandable` |
| JavaScript | `javascript script.js icon="js" expandable` |
| HTML | `html HTML icon="html5" expandable` |
| React | `jsx React icon="react" expandable` |
| React with TypeScript | `tsx React icon="react" expandable` |
| Angular | `ts Angular icon="angular" expandable` |
| Vue | `vue Vue icon="vuejs" expandable` |

Keep one empty line between each fenced code block inside a `CodeGroup`.

CSS tabs are required only when the styles are essential for understanding or reusing the example. Do not add a CSS tab for incidental preview layout. React examples must import the CSS filename shown in the CSS tab when one exists, for example `import "./styles.css";`.

HTML tabs should include JavaScript inline when the behavior belongs to the HTML example. Add a separate JavaScript tab only when the script is too long to keep the HTML readable.

Angular examples must use the standalone implementation approach, not Angular modules. Angular and Vue examples should use inline styles unless external CSS is critical to the example and appears in a CSS tab.

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
- When migrating from Zeroheight, remove visible `Keywords` sections, rewrite stale language for Mintlify, and verify values against current source before documenting them.

After writing, run [review-doc](../review-doc/SKILL.md) on the new page to verify compliance.

---
name: review-doc
description: 'Audit a BEEQ Mintlify MDX documentation page against the documentation guidelines — section order, CodeLivePreview CSS isolation, framework tab order, image paths, When-to-Use and Best-Practices card patterns, API reference completeness, tone, and CSS code tab rules. Also supports Zeroheight-to-Mintlify migration audits when explicitly requested or confirmed.'
argument-hint: 'Component name (e.g. "card") or path to an .mdx file in apps/beeq-docs/components/'
---

# Review a BEEQ Documentation Page

## When to Use

- Before merging a new or migrated MDX page in [apps/beeq-docs/components/](../../../apps/beeq-docs/components/)
- When normalizing pages for consistency across the docs site
- When a docs reviewer flags structure or tone issues
- When migrating a page from Zeroheight to Mintlify and you want to verify the result _(see Step 0)_

## When NOT to Use

- For component code review → use [review-component](../review-component/SKILL.md)
- For generating a brand-new page from scratch → use [doc-component](../doc-component/SKILL.md)
- For non-component pages (getting-started, guides) — these follow looser conventions; review manually

---

## Step 0 — Check for Zeroheight migration context (optional)

**Only proceed with this step if the user explicitly mentions a Zeroheight migration, or if you detect that the page under review was recently migrated from Zeroheight.**

If either condition is met, ask for confirmation before proceeding:

> "This looks like a migrated Zeroheight page. Do you want me to cross-check against the original Zeroheight source as part of this review?"

If the user confirms, use the `mcp_beeq_zeroheig` tools to fetch the original page content before starting Step 3:

```
mcp_beeq_zeroheig_list-pages        → find the page by component name
mcp_beeq_zeroheig_get-page          → fetch the original content
mcp_beeq_zeroheig_get-page-images   → fetch image references
```

Use the Zeroheight content to:
- Cross-check that all **When to use**, **Anatomy**, **Design guidelines**, and **Best practices** content has been migrated — not silently dropped
- Verify that image descriptions and anatomy part labels are preserved
- Flag any content present in Zeroheight that has no equivalent in the new MDX page

Add a **Zeroheight Migration** section to the report (see Step 4) if this step is executed.

---

## 1. Load the authoritative rules

Read [.github/instructions/documentation.instructions.md](../../instructions/documentation.instructions.md) in full before starting any checks. Every checklist item below maps to a rule in that file.

---

## 2. Locate and read the files

Resolve the target file:
- If `$ARGUMENTS` is a component name → `apps/beeq-docs/components/$ARGUMENTS.mdx`
- If `$ARGUMENTS` is a file path → read it directly

Read the full MDX file before running any checks.

Also read the component source to verify API table accuracy:
- `packages/beeq/src/components/$ARGUMENTS/bq-$ARGUMENTS.tsx` — `@Prop`, `@Event`, `@slot`, `@part`, `@cssprop`
- `packages/beeq/src/components/$ARGUMENTS/scss/bq-$ARGUMENTS.variables.scss` — CSS custom properties and defaults
- `packages/beeq/cem/` — Custom Elements Manifest as canonical API reference

---

## 3. Audit checklist

### A. Page structure and section order

- [ ] Frontmatter present with `title` and `description`
- [ ] All imports immediately after frontmatter, using absolute paths (e.g. `/snippets/…`); no unused imports
- [ ] Overview `Frame` with light + dark image pair is the first content after imports
- [ ] Introduction paragraph (1–2 sentences, no `##` heading) immediately follows the overview frame
- [ ] Optional `Note` present only when there is a gotcha that affects **all** uses
- [ ] **When to use** section present as a 2-column `CardGroup`
- [ ] Optional **Patterns** section present only when real-world contexts genuinely add value
- [ ] **Anatomy** section present with `Frame` + parts table (Part / Element / Description columns)
- [ ] **Design guidelines** section present using `CardTile`, `Steps`, or `Note` as appropriate
- [ ] **Usage** section present with at least one `CodeLivePreview` + `CodeGroup`
- [ ] **Options** section present for additional configurations
- [ ] **Best practices** section present as a 2×2 `CardGroup` (minimum 4 Do/Don't pairs = 8 cards)
- [ ] **Accessibility** section present
- [ ] **API reference** section present with all four subsections
- [ ] **Resources** section is the **last** section with Storybook + GitHub source links

### B. Images

- [ ] All image paths follow `/components/images/[component]/[component]-[variant]-[light|dark].svg`
- [ ] Every image appears **twice**: `className="block dark:hidden"` (light) and `className="hidden dark:block"` (dark)
- [ ] Overview `Frame` uses the `-overview-` variant; anatomy `Frame` uses the `-anatomy-` variant
- [ ] No overview image re-used in the anatomy section

### C. When to use section

- [ ] 2-column `CardGroup` with exactly one Do card and one Don't card
- [ ] Do card: `thumbs-up` icon, `color="var(--bq-stroke--success)"`
- [ ] Don't card: `thumbs-down` icon, `color="var(--bq-stroke--danger)"`
- [ ] Both cards use bullet lists, not prose paragraphs

### D. CodeLivePreview — CSS isolation

- [ ] Every `<style>` inside a `code` prop uses `:host { ... }` to override the shadow host layout — **not** `@scope`
- [ ] `:host` overrides use `!important` for properties that the `CodeLivePreview` stylesheet already defines (e.g., `flex-direction`, `justify-content`, `gap`, `padding`)
- [ ] Descendant selectors (`.my-class`, `bq-button`, etc.) are plain selectors at the top level of `<style>` — no wrapper at-rule needed
- [ ] No `@scope { :scope {} }` — this is the old light-DOM approach; flag any remaining instances as errors
- [ ] No `@scope (.class-name)` — same reason
- [ ] No `<style scoped>` — not a real browser feature
- [ ] `@media` and `@supports` used normally inside `<style>` (no nesting restriction)
- [ ] Every `<script>` inside a `code` prop wrapped in an IIFE: `(() => { ... })()`
- [ ] Scripts use `previewRoot` to query elements, **not** `document.currentScript` (always `null`) or `document.querySelector` (cannot cross shadow boundary)
- [ ] No unnecessary wrapper `<div>` added only for alignment — use `:host` overrides instead
- [ ] When a wrapper `<div>` is genuinely needed, it has a BEM-style class name and is styled via a plain selector inside `<style>`

### E. CodeGroup framework tabs

- [ ] Every `CodeLivePreview` is immediately followed by a `CodeGroup`
- [ ] Tab order: `HTML` → `React` → `Angular` → `Vue` (optional `CSS` tab comes **first** if present)
- [ ] HTML: kebab-case attributes (e.g. `alt-text`, `only-icon`)
- [ ] Angular: kebab-case attributes; events use `(bqEventName)` binding syntax
- [ ] React: camelCase props (e.g. `altText`, `onlyIcon`); events use `onBqEventName` handler props
- [ ] Vue: camelCase props (e.g. `altText`); events use `@bqEventName` binding syntax — **never** HTML attribute names

### F. CSS code tab

Only applies when a `CSS` tab is present in the `CodeGroup`:

- [ ] Uses plain CSS selectors — **not** `@scope` (users manage their own scope)
- [ ] Uses modern CSS nesting: `& child`, `&::part(x)`, `&:hover`
- [ ] Uses `--bq-*` CSS custom properties and design tokens, not hardcoded values
- [ ] Uses CSS logical properties (`margin-inline-start`, not `margin-left`)
- [ ] CSS tab omitted when the wrapper exists only for preview isolation (no copy-paste value for users)

### G. Best practices section

- [ ] 2×2 `CardGroup` with minimum 4 pairs (8 cards)
- [ ] Do cards: `check` icon, `color="var(--bq-stroke--success)"`
- [ ] Don't cards: `xmark` icon, `color="var(--bq-stroke--danger)"`
- [ ] Pairs cover distinct aspects: layout, content, accessibility, consistency
- [ ] Cards use a complete sentence or clear imperative — not just a label

### H. Accessibility section

- [ ] Documents what the component handles automatically (built-in `role`, `aria-*` attributes)
- [ ] States which props feed each ARIA attribute (e.g. "`label` prop maps to `aria-label`")
- [ ] Lists developer responsibilities (e.g. providing meaningful labels, managing focus)
- [ ] Does **not** repeat API property descriptions already in the reference table

### I. API reference

- [ ] **Properties** table: columns `Property`, `Attribute`, `Description`, `Type`, `Default`
- [ ] **Slots** table: columns `Slot`, `Description`
- [ ] **Shadow parts** table: columns `Part`, `Description`
- [ ] **CSS custom properties** wrapped in `<Expandable title="CSS variables" defaultOpen={true}>` (use `defaultOpen={false}` for long lists); columns `Variable`, `Description`, `Default`
- [ ] CSS variables table is accurate — cross-checked against `bq-*.variables.scss`
- [ ] `<Expandable>` is followed by a `<Tip>` linking to `/theming/styles` and `/theming/global-css-variables`
- [ ] No undocumented props, events, slots, or shadow parts relative to the component source

### J. Resources section

- [ ] 2-column `CardGroup` with exactly two horizontal `Card` components
- [ ] First card: `icon="code"`, links to `https://storybook.beeq.design/?path=/story/components-[component]--default`
- [ ] Second card: `icon="github"`, links to `https://github.com/Endava/BEEQ/tree/main/packages/beeq/src/components/[component]`

### K. Tone and language

- [ ] Plain, direct language — no internal jargon or Zeroheight/internal tool references
- [ ] Active voice; short sentences
- [ ] Second-person ("you") when addressing the reader
- [ ] No filler phrases: "simply", "just", "easily", "note that", "please"
- [ ] Sections explain *why* a pattern exists, not only *what* it does

---

## 4. Report format

```markdown
## Documentation Review: [component]

### Summary
<1–2 sentence overall quality assessment and top priority items>

### Results

| Category | Status | Issues |
|---|---|---|
| Page structure | ✅/⚠️/❌ | … |
| Images | ✅/⚠️/❌ | … |
| When to use | ✅/⚠️/❌ | … |
| CodeLivePreview CSS | ✅/⚠️/❌ | … |
| Framework tabs | ✅/⚠️/❌ | … |
| CSS code tab | ✅/⚠️/❌ | … |
| Best practices | ✅/⚠️/❌ | … |
| Accessibility | ✅/⚠️/❌ | … |
| API reference | ✅/⚠️/❌ | … |
| Resources | ✅/⚠️/❌ | … |
| Tone & language | ✅/⚠️/❌ | … |

### Issues

For each problem:
- **Location** — section heading or approximate line, as a markdown link where possible
- **Severity** — `error` (missing required section or broken behavior) | `warning` (inconsistency) | `suggestion` (improvement)
- **Rule** — the specific guideline from `documentation.instructions.md`
- **Fix** — the concrete, ready-to-apply change

### Zeroheight Migration (only if Step 0 was executed)
List any content present in Zeroheight that is absent from the new MDX page, and flag any images or labels that differ.
```

---

## Example invocations

```
/review-doc card
/review-doc apps/beeq-docs/components/dropdown.mdx
/review-doc badge     ← I just migrated this from Zeroheight, please cross-check
```

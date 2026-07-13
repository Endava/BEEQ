---
name: review-doc
description: 'Audit a BEEQ Mintlify MDX documentation page against the documentation guidelines — component docs, non-component docs, CodeLivePreview behavior, code tab rules, source accuracy, tone, and accessibility guidance. Also supports temporary Zeroheight-to-Mintlify migration audits when explicitly requested or confirmed.'
argument-hint: 'Component name (e.g. "card") or path to an .mdx file in apps/beeq-docs/'
---

# Review a BEEQ Documentation Page

## When to Use

- Before merging a new or migrated MDX page in [apps/beeq-docs/components/](../../../apps/beeq-docs/components/)
- Before merging a non-component MDX page in [apps/beeq-docs/](../../../apps/beeq-docs/) such as foundations, theming, setup, framework integrations, or usage guides
- When normalizing pages for consistency across the docs site
- When a docs reviewer flags structure or tone issues
- When migrating a page from Zeroheight to Mintlify and you want to verify the result _(see Step 0)_

## When NOT to Use

- For component code review → use [review-component](../review-component/SKILL.md)
- For generating a brand-new page from scratch → use [doc-component](../doc-component/SKILL.md)

---

## Step 0 — Temporary Zeroheight migration check (optional)

This is a temporary migration-only check. Use it only when the user explicitly mentions a Zeroheight migration or when the current task context references Zeroheight. Do not run this check for ordinary docs reviews after the migration work is complete.

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
- Flag stale values or wording that conflict with current source

Add a **Zeroheight Migration** section to the report (see Step 4) if this step is executed.

---

## 1. Load the authoritative rules

Read [.github/instructions/documentation.instructions.md](../../../.github/instructions/documentation.instructions.md) in full before starting any checks. Every checklist item below maps to a rule in that file.

---

## 2. Locate and read the files

Resolve the target file:
- If `$ARGUMENTS` is a component name → `apps/beeq-docs/components/$ARGUMENTS.mdx`
- If `$ARGUMENTS` is a file path → read it directly

Read the full MDX file before running any checks.

If the target is a component page in `apps/beeq-docs/components/`, read the component source to verify API table accuracy:
- `packages/beeq/src/components/$ARGUMENTS/bq-$ARGUMENTS.tsx` — `@Prop`, `@Event`, `@slot`, `@part`, `@cssprop`
- `packages/beeq/src/components/$ARGUMENTS/scss/bq-$ARGUMENTS.variables.scss` — CSS custom properties and defaults
- `packages/beeq/cem/` — Custom Elements Manifest as canonical API reference

If the target is a non-component page, read the source files that define the documented behavior, values, or utilities. Examples include Tailwind theme files, reset styles, global CSS variables, integration setup files, or snippets used by the page. Current repo source is canonical over older docs.

---

## 3. Audit checklist

### A. Page structure and section order — component pages

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

### A2. Page structure and flow — non-component pages

- [ ] Frontmatter present with `title` and `description`
- [ ] Imports immediately after frontmatter, using absolute paths; no unused imports
- [ ] Introduction clearly states what the page helps the reader understand or do
- [ ] Page explains what BEEQ provides, recommends, or deliberately leaves to the consuming app
- [ ] Core concepts are source-backed and written in a practical order
- [ ] Values, utilities, classes, tokens, or setup steps match current source
- [ ] Practical examples match the rendered `CodeLivePreview`
- [ ] Usage guidelines are concise and scannable, using `AccordionGroup`, `CardTile`, or prose where appropriate
- [ ] Accessibility, constraints, or implementation gotchas are included when relevant
- [ ] Resources section appears last and links to relevant docs or source files
- [ ] No visible `Keywords` section remains in migrated content

### B. Images

- [ ] Component image paths follow `/components/images/[component]/[component]-[variant]-[light|dark].svg`
- [ ] Every image appears **twice**: `className="block dark:hidden"` (light) and `className="hidden dark:block"` (dark)
- [ ] Overview `Frame` uses the `-overview-` variant; anatomy `Frame` uses the `-anatomy-` variant
- [ ] No overview image re-used in the anatomy section
- [ ] Non-component images are present only when they support a clear visualization; intentionally deferred placeholder assets are called out but not treated as content failures

### C. When to use section

- [ ] 2-column `CardGroup` with exactly one Do card and one Don't card
- [ ] Do card: `thumbs-up` icon, `color="var(--bq-stroke--success)"`
- [ ] Don't card: `thumbs-down` icon, `color="var(--bq-stroke--danger)"`
- [ ] Both cards use bullet lists, not prose paragraphs

### D. CodeLivePreview isolation

- [ ] Every `CodeLivePreview` passes `mode` explicitly
- [ ] New examples prefer `mode="iframe"` for full isolation from Mintlify CSS, scripts, and layout
- [ ] Every iframe preview includes an explicit `height`
- [ ] Iframe examples use `removePadding` when default preview padding would hide the real layout behavior
- [ ] Shadow mode is used only for small, component-local examples that will not disrupt or be affected by the Mintlify page
- [ ] Iframe examples use normal document CSS selectors inside the preview, not `:host` for preview layout
- [ ] Shadow-mode examples use `:host { ... }` to override the shadow host layout — **not** `@scope`
- [ ] Shadow-mode `:host` overrides use `!important` for properties that the `CodeLivePreview` stylesheet already defines (e.g., `flex-direction`, `justify-content`, `gap`, `padding`)
- [ ] Descendant selectors (`.my-class`, `bq-button`, etc.) are plain selectors at the top level of `<style>` — no wrapper at-rule needed
- [ ] No `@scope { :scope {} }` — this is the old light-DOM approach; flag any remaining instances as errors
- [ ] No `@scope (.class-name)` — same reason
- [ ] No `<style scoped>` — not a real browser feature
- [ ] `@media` and `@supports` used normally inside `<style>` (no nesting restriction)
- [ ] Every `<script>` inside a `code` prop wrapped in an IIFE: `(() => { ... })()`
- [ ] Scripts use `previewRoot` to query elements, **not** `document.currentScript`
- [ ] Scripts avoid `document.querySelector` in shadow mode because it cannot cross the shadow boundary; iframe mode may use `document` only when the script intentionally targets the isolated iframe document
- [ ] No unnecessary wrapper `<div>` added only for alignment — use the preview mode's layout tools instead
- [ ] When a wrapper `<div>` is genuinely needed, it has a BEM-style class name and is styled via a plain selector inside `<style>`

### E. CodeGroup framework tabs

- [ ] Every `CodeLivePreview` is immediately followed by a `CodeGroup`
- [ ] Tab order: `CSS` when needed → `JavaScript` when needed → `HTML` → `React` → `Angular` → `Vue`
- [ ] Fenced code blocks used as Mintlify tabs include `expandable` only when they have more than 7 lines; short snippets and all `apps/beeq-docs/index.mdx` code tabs stay open
- [ ] Icons are correct: CSS `icon="css"`, JavaScript `icon="js"`, HTML `icon="html5"`, React `icon="react"`, Angular `icon="angular"`, Vue `icon="vuejs"`
- [ ] One empty line separates each fenced code block inside a `CodeGroup`
- [ ] Code tabs match the rendered `CodeLivePreview` structure, state, and behavior
- [ ] HTML: kebab-case attributes (e.g. `alt-text`, `only-icon`)
- [ ] HTML includes JavaScript inline when applicable, unless the script is long enough to justify a separate JavaScript tab
- [ ] Angular: **`ts` code block** (not `html`); full standalone `@Component`; imports from `@beeq/angular/standalone`; all BEEQ components used in the template listed in `imports`; events use `(bqEventName)` binding syntax; no Angular modules — flag any plain `html Angular` blocks as errors
- [ ] Angular examples use inline styles unless external CSS is critical to the example and appears in a CSS tab
- [ ] React: camelCase props (e.g. `altText`, `onlyIcon`); events use `onBqEventName` handler props
- [ ] React imports the CSS filename shown in the CSS tab when a CSS tab exists, for example `import "./styles.css";`
- [ ] Vue: camelCase props (e.g. `altText`); events use `@bqEventName` binding syntax — **never** HTML attribute names
- [ ] Vue examples use inline styles unless external CSS is critical to the example and appears in a CSS tab
- [ ] Non-component pages omit framework tabs when they do not add value

### F. CSS code tab

Only applies when a `CSS` tab is present in the `CodeGroup`:

- [ ] CSS tab exists only when the styles are essential for understanding or reusing the example, not for incidental preview layout
- [ ] CSS tab uses an explicit filename when React imports it, e.g. `styles.css`
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
- [ ] **CSS custom properties**: if >5 variables, wrapped in `<Expandable title="CSS variables" defaultOpen={true}>` (use `defaultOpen={false}` for very long lists, e.g. 20+); if ≤5 variables, displayed as a plain table with no `<Expandable>` wrapper. Columns `Variable`, `Description`, `Default`
- [ ] CSS variables **Default** values use `var(--bq-*)` CSS custom properties — not Tailwind `theme()` function calls; hardcoded values (`transparent`, `none`, `solid`, `unset`, `0`, `24px`, etc.) are kept as-is
- [ ] CSS variables table is accurate — cross-checked against `bq-*.variables.scss`
- [ ] CSS variables section is followed by a `<Tip>` linking to `/usage-guides/customizations/styles#component-shadow-dom-parts` and `/usage-guides/customizations/styles#global-css-custom-properties`
- [ ] No undocumented props, events, slots, or shadow parts relative to the component source

### J. Resources section

- [ ] 2-column `CardGroup` with exactly two horizontal `Card` components
- [ ] First card: `icon="code"`, links to `https://storybook.beeq.design/?path=/story/components-[component]--default`
- [ ] Second card: `icon="github"`, links to `https://github.com/Endava/BEEQ/tree/main/packages/beeq/src/components/[component]`

### K. Tone and language

- [ ] Plain, direct language — no internal jargon or Zeroheight/internal tool references
- [ ] Active voice; short sentences
- [ ] Second-person ("you") when addressing the reader
- [ ] No filler phrases: "simply", "just", "easily", "note that", "please", "for clarity"
- [ ] Sections explain *why* a pattern exists, not only *what* it does
- [ ] No "also known as" alias definitions — use the correct term and trust the reader (anti-pattern 1)
- [ ] No "once X is Y, you can Z" constructions — go straight to the action (anti-pattern 2)
- [ ] Outcomes stated directly, not as hedged observations ("works well together when…") (anti-pattern 3)
- [ ] `<Note>`, `<Tip>`, and `<Warning>` callouts give useful constraints or shortcuts — not disclaimers about documentation choices (anti-pattern 4)
- [ ] Voice matches content type: reference pages (API, tables) are precise and scannable; guide pages are task-oriented and conversational
- [ ] Non-component pages distinguish what BEEQ ships from what BEEQ recommends
- [ ] Non-component pages do not imply BEEQ ships unavailable APIs, utilities, classes, tokens, or components

---

## 4. Report format

```markdown
## Documentation Review: [page]

### Summary
<1–2 sentence overall quality assessment and top priority items>

### Results

For non-component pages, mark component-only categories such as API reference or When to use as `N/A` unless the page intentionally includes them.

| Category | Status | Issues |
|---|---|---|
| Page structure | ✅/⚠️/❌ | … |
| Images | ✅/⚠️/❌ | … |
| When to use | ✅/⚠️/❌ | … |
| CodeLivePreview isolation | ✅/⚠️/❌ | … |
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
List any content present in Zeroheight that is absent from the new MDX page, and flag any stale values, images, labels, or wording that conflict with current source.
```

---

## Example invocations

```
/review-doc card
/review-doc apps/beeq-docs/components/dropdown.mdx
/review-doc apps/beeq-docs/foundations/grid.mdx
/review-doc badge     ← I just migrated this from Zeroheight, please cross-check
```

---
name: review-doc
description: 'Audit a BEEQ Mintlify MDX page (component or non-component) against the documentation guidelines and return a structured report: structure, code examples, source accuracy, tone and accessibility guidance. To write a page use doc-component.'
argument-hint: 'Component name (e.g. "card") or path to an .mdx file in apps/beeq-docs/'
metadata:
  internal: true
---

# Review a BEEQ Documentation Page

## When to Use

- Before merging a new or changed MDX page in [apps/beeq-docs/](../../../apps/beeq-docs/): component pages, or foundations, theming, setup, framework integrations and usage guides.
- When normalizing pages for consistency, or when a docs reviewer flags structure or tone issues.
## When NOT to Use

- For component code review use [review-component](../review-component/SKILL.md).
- For writing a new page use [doc-component](../doc-component/SKILL.md).

---

## 1. Load the authoritative rules

Read the [documentation](../../instructions/documentation.instructions.md), [component-docs](../../instructions/component-docs.instructions.md) and [code-examples](../../instructions/code-examples.instructions.md) instructions in full. They are the only source of rules; this skill adds no rules of its own.

---

## 2. Locate and read the files

- `$ARGUMENTS` is a component name: read `apps/beeq-docs/components/$ARGUMENTS.mdx`.
- `$ARGUMENTS` is a path: read it directly.

Read the full MDX file before running any checks.

For a component page, read the component source to verify the API tables: `packages/beeq/src/components/$ARGUMENTS/bq-$ARGUMENTS.tsx`, `scss/bq-$ARGUMENTS.variables.scss` and the Custom Elements Manifest in `packages/beeq/cem/`.

For a non-component page, read the source that defines the documented behavior: Tailwind theme files, reset styles, global CSS variables, setup files or the snippets the page uses. Current repo source is canonical over older docs.

---

## 3. Audit

Check the page against every rule of each instruction section below. Record each violated rule with its location.

| Category | Rules to apply |
|---|---|
| Page structure | Component pages: page structure in component-docs (section order, optional sections, Resources last). Non-component pages: the non-component section in documentation, plus the checks below |
| Images | Image paths in component-docs; light and dark pair; overview and anatomy variants |
| When to use | When to Use and Related Components in component-docs; both siblings name each other with the deciding condition |
| CodeLivePreview isolation | `CodeLivePreview` in code-examples (mode, height, `:host`, `previewRoot`, IIFE, wrappers) |
| Framework tabs | `CodeGroup` in code-examples (tab order, icons, `expandable`, per-framework syntax) |
| CSS code tab | CSS Code Tab in code-examples |
| Best practices | Best Practices in component-docs |
| Accessibility | Accessibility in component-docs: keyboard table with one row per key; for form controls the Rules table (Verified by) followed by a `<Visibility for="agents">` block that mirrors it |
| Rule strength | Rule strength in documentation: requirements in Accessibility, Keyboard, Rules and Invalid combinations use MUST / SHOULD / MUST NOT / SHOULD NOT / MAY; prose and Do/Don't cards stay lowercase |
| Allowed values | Allowed Values in component-docs: every variant, size, type or placement dimension lists its values as text |
| API reference | API Reference in component-docs, cross-checked against the source from step 2; Invalid combinations for form controls |
| Resources | Resources in component-docs |
| Tone & language | Tone and anti-patterns in documentation |

Additional checks for non-component pages:

- The introduction states what the page helps the reader understand or do.
- The page distinguishes what BEEQ ships from what it recommends or leaves to the consuming app, and never implies unavailable APIs, utilities, classes, tokens or components.
- Values, utilities, classes, tokens and setup steps match current source, and examples match the rendered `CodeLivePreview`.

Additional check for every page: no documented prop, event, slot, part or CSS variable is absent from the source, and none in the source is missing from the docs.

Done when every row of the table has a status and every violation is listed.

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
| Rule strength | ✅/⚠️/❌ | … |
| Allowed values | ✅/⚠️/❌ | … |
| API reference | ✅/⚠️/❌ | … |
| Resources | ✅/⚠️/❌ | … |
| Tone & language | ✅/⚠️/❌ | … |

### Issues

For each problem:
- **Location** — section heading or approximate line, as a markdown link where possible
- **Severity** — `error` (missing required section or broken behavior) | `warning` (inconsistency) | `suggestion` (improvement)
- **Rule** — the specific guideline from the documentation instruction files
- **Fix** — the concrete, ready-to-apply change
```

---

## Example invocations

```
/review-doc card
/review-doc apps/beeq-docs/components/dropdown.mdx
/review-doc apps/beeq-docs/foundations/grid.mdx
```

---
description: Shared rules for Mintlify MDX pages in apps/beeq-docs: audience, tone, anti-patterns, non-component pages, frontmatter, imports and Mintlify components. Links to the component-page and code-example guidelines.
applyTo: apps/beeq-docs/**/*.{mdx,md,jsx}
---

# Documentation Guidelines

Shared rules for every page in `apps/beeq-docs`. Topic files:

- [Component pages](component-docs.instructions.md): mandatory page structure, sections, images, CSS variable naming.
- [Code examples](code-examples.instructions.md): `CodeLivePreview`, CSS tab and `CodeGroup` framework tabs.

## Audience and Tone

Documentation is read by developers, designers, product managers, and other stakeholders — not just engineers. Write for all of them.

- Use plain, direct language. Avoid internal jargon or references to internal tooling (e.g., "this comes from the original design guidance").
- Prefer active voice and short sentences.
- Explain *why* a pattern exists, not just *what* it does.
- Use second-person ("you") when addressing the reader directly.
- Avoid filler phrases such as "simply", "just", "easily", "note that", or "please".

### Rule strength (RFC 2119)

Requirements in the structured spec sections of a component page (Accessibility, Keyboard interaction, Rules, Invalid combinations) carry a strength keyword in capitals, so readers and agents can tell a hard requirement from advice. Prose, Do/Don't cards, Tips and Notes use plain lowercase wording ("should", "avoid"); capitals there read as shouting.

| Keyword | Meaning |
|---|---|
| **MUST** / **MUST NOT** | Hard requirement. Breaking it breaks accessibility, form behavior or the component. |
| **SHOULD** / **SHOULD NOT** | Strong recommendation. Deviate only with a reason. |
| **MAY** | Optional behavior. |

- Capitalise the keyword in the spec sections only. Descriptions of what the component does ("The component sets `role="switch"`") need no keyword.
- Pick the strength from intent: WCAG failures and functional breakage are MUST / MUST NOT; stylistic and UX guidance is SHOULD / SHOULD NOT.
- Best practices cards keep the Do/Don't structure in plain lowercase wording; the same rule appears with its capitalised strength in the Rules table when it is verifiable.

### Reference pages vs guide pages

Match the voice to the content type:

- **Reference pages** (API tables, property lists, token references) — precise and scannable. Readers dip in and out; factual statements are appropriate.
- **Guide pages** (getting started, framework guides, usage guides) — task-oriented and conversational. Readers follow steps in order. Write as if a senior developer who has used these components is explaining the trade-offs, not reciting a specification. Acknowledge decisions, hint at consequences, and anticipate confusion.

### Anti-patterns — avoid these in all pages

**1. Defining terms the reader already knows**

Do not add "also known as" aliases or glossary-style definitions for terms your audience is expected to know. Use the correct term and trust the reader.

❌ `CSS custom properties, also known as CSS variables, let you define a value once…`  
✅ `BEEQ relies on CSS custom properties to maintain a consistent visual system…`

**2. Front-loading a condition the reader just read ("Once X is Y, you can Z")**

Avoid dependent clauses that restate what was just explained before reaching the useful instruction. Go straight to the action.

❌ `Once a part is exposed, you can style it with the ::part() pseudo-element selector.`  
✅ `Style it using ::part() from your own stylesheet:`

**3. Hedged observations instead of direct outcomes**

Replace "works well together when you want to…" with outcome-first sentences that tell the reader what they *get*.

❌ `Component-level CSS variables and ::part() selectors work well together when you want to adjust spacing.`  
✅ `Combine CSS variables and ::part() when token overrides alone aren't enough — you get scoped sizing control and structural styling from a single class.`

**4. Callouts that disclaim instead of help**

`<Note>`, `<Tip>`, and `<Warning>` callouts should give the reader a useful constraint, shortcut, or important gotcha — not justify a documentation choice or soften an instruction with filler like "for clarity".

❌ `The examples on this page use inline CSS for clarity. In your application, keep overrides in your own stylesheets.`  
✅ `The examples use inline <style> tags so you can run them directly. In a real project, place these overrides in your own stylesheet.`

---

## Non-component documentation pages

Non-component pages include foundations, theming, setup, framework integration, usage guides, migration docs, and conceptual pages. These pages are less rigid than component API pages, but they must still be source-backed, practical, and easy to scan.

Recommended flow:

1. **Frontmatter** — `title` and `description`
2. **Imports** — all MDX snippet imports at the top
3. **Overview or visual frame** (optional) — only when an image helps explain the topic
4. **Introduction paragraph** — what the page helps the reader understand or do
5. **Context** — what BEEQ provides, recommends, or deliberately leaves to the consuming app
6. **Core concepts** — the design or implementation model behind the topic
7. **Source-backed values or references** — tokens, utilities, classes, or source files where relevant
8. **Practical examples** — live examples and code that match what is rendered
9. **Usage guidelines** — concise guidance using prose, `AccordionGroup`, or `CardTile`
10. **Accessibility or constraints** (when relevant) — source order, contrast, motion, zoom, semantics, or implementation gotchas
11. **Resources** — related docs, source files, or external references

Rules:

- Current repo source is canonical over older docs.
- State clearly whether BEEQ ships a component, utility, class, token, or API, or whether the page is documenting guidance that users implement in their own app.
- Do not keep stale language, filler, or values that conflict with source.
- Use BEEQ tokens, semantic utilities, and logical CSS properties when they are relevant to the topic.
- Avoid framework examples on non-component pages when they do not teach anything beyond the HTML or CSS example.

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

## Mintlify Component Reference

| Component | Use for |
|---|---|
| `Frame` | Wrapping images with captions |
| `CardGroup` | Side-by-side card layouts |
| `Card` | Text-only cards (When to use, Best practices, Resources) |
| `CardTile` | Visual option sets, conceptual groups, and image-supported guidance |
| `AccordionGroup` / `Accordion` | Progressive guidance, usage guidelines, and scannable non-component content |
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

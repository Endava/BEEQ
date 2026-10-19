---
name: doc-component
description: 'Write or complete the Mintlify MDX page for a BEEQ component, extracting props, events, slots, parts and CSS variables from the component source. Use when documenting a new component or filling missing sections. To audit an existing page use review-doc.'
argument-hint: Component name (e.g. "card") or path to the component tsx file, link to the component source file, or link to an existing incomplete documentation page.
metadata:
  internal: true
---

# Write documentation for BEEQ components

## When to use

- Creating a new MDX page in [apps/beeq-docs/components/](../../../apps/beeq-docs/components/) for an existing `bq-*` component.
- Filling missing sections on a partially written page.

## When NOT to use this skill

- The page exists and only needs an audit: use [review-doc](../review-doc/SKILL.md).
- The component itself is missing or incomplete: finish it with [create-component](../create-component/SKILL.md) and [review-component](../review-component/SKILL.md).
- Non-component pages (foundations, theming, getting started, guides, framework integrations, migration docs): follow the [documentation instructions](../../instructions/documentation.instructions.md) and review with [review-doc](../review-doc/SKILL.md).

## Procedure

### 1. Load the rules

Read in full before writing a line:

- [Documentation instructions](../../instructions/documentation.instructions.md): tone, rule strength keywords, anti-patterns, frontmatter, imports, Mintlify components.
- [Component docs instructions](../../instructions/component-docs.instructions.md): page structure and section order, related components, allowed values, keyboard and rules tables, invalid combinations, image paths, Do/Don't cards, anatomy, API tables, CSS variable naming, resources.
- [Code examples instructions](../../instructions/code-examples.instructions.md): `CodeLivePreview` isolation, `CodeGroup` tab order, icons, CSS tab.

Done when you can name the section order and the tab order without looking.

### 2. Read the component source

The source is the ground truth for the API reference. Document only what exists in it:

- `packages/beeq/src/components/<name>/bq-<name>.tsx`: `@Prop`, `@Event`, `@Method`, class-level JSDoc (`@slot`, `@part`, `@cssprop`, `@attr`)
- `packages/beeq/src/components/<name>/bq-<name>.types.ts`: prop type unions and constants
- `packages/beeq/src/components/<name>/__tests__/*.e2e.tsx`: what is asserted, for keyboard rows and "Verified by" values
- `packages/beeq/src/components/<name>/scss/bq-<name>.variables.scss`: every `--bq-<name>--*` custom property and its default
- [packages/beeq/cem/](../../../packages/beeq/cem/): the Custom Elements Manifest; the API tables must match it

Treat old docs as reference for tone and concepts, never for API facts. Read [icon.mdx](../../../apps/beeq-docs/components/icon.mdx) or [badge.mdx](../../../apps/beeq-docs/components/badge.mdx) as a structural reference.

Done when every prop, event, slot, part and CSS variable you plan to document is traced to the source.

### 3. Write the page

Write `apps/beeq-docs/components/<name>.mdx` following the component docs and code examples instructions. Verify every value against the source.

Done when every section of the component docs instructions is present, in order, or explicitly marked optional and skipped.

### 4. Review

Run [review-doc](../review-doc/SKILL.md) on the new page and fix every finding.

Done when the review report has no failures.

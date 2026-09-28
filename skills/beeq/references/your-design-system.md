---
title: "Skill reference: your design system on BEEQ"
description: How agents find a consuming project's BEEQ decisions, where customizations belong, and how to extend BEEQ without forking it.
---
<!-- Generated from packages/beeq-skills/src/beeq/references/your-design-system.md. Edit the source, not this file. -->

This reference supports the [BEEQ agent skill](../SKILL.md). Read it in any existing project, and whenever someone asks you to "match our design system" or "make this consistent with the rest of the app".

## Context

BEEQ ships components, tokens, two themes (`beeq` and `endava`), light and dark modes, and framework wrappers. A consuming product usually adds its own layer on top: a theme override file, wrapper components, form-field layouts, and page patterns. That layer is the product's design system. Your output should look like it came from the same team.

## Discover before you build

Search the project before writing markup or CSS. Record what you find and follow it.

| Look for | Where | What it tells you |
| --- | --- | --- |
| Installed versions | `package.json`, lockfile | Which props and events exist. The public docs describe the latest release. |
| Theme and mode | `bq-theme` and `bq-mode` on `html`, `body`, or a scoped container | The active identity and colour scheme. |
| Theme overrides | CSS that sets `--bq-*` tokens, often inside `[bq-theme="…"]` selectors | The project's brand decisions. Add to this file; do not create a competing one. |
| Global stylesheet | An import of `@beeq/core/dist/beeq/beeq.css` | Where BEEQ styles load. Never load them twice. |
| Icon setup | `setBasePath(...)` or a `data-beeq` script attribute | Where SVG icons are served from. |
| Tailwind preset | `@beeq/tailwindcss` in a Tailwind config or `@plugin` rule | Whether BEEQ utility classes such as `gap-m` or `bg-primary` are available. |
| Wrapper components | Files that import `Bq*` and re-export them (`AppButton`, `styled(BqInput)`) | House defaults such as size, appearance, and analytics hooks. Use the wrapper. |
| Form conventions | Form library bindings, shared `FormField` layouts, validation helpers | How labels, helper text, and errors are wired. |
| Routing | The router's link component and any BEEQ integration | How navigation is intercepted without losing real links. |
| Agent briefs | `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` | Written decisions that override this skill's defaults. |
| Existing screens | A page similar to the one you are building | Layout, spacing rhythm, action placement, empty and error states. |

Useful searches from the project root:

```bash
grep -rn "bq-theme\|bq-mode" --include=*.html --include=*.tsx --include=*.vue --include=*.css .
grep -rln "@beeq/react\|@beeq/angular\|@beeq/vue" src
grep -rn -- "--bq-[a-z0-9-]*:" --include=*.css --include=*.scss src
grep -rn "setBasePath\|data-beeq" src public index.html
```

## Precedence

**Project conventions > the skill's defaults > your own taste.**

If a project convention conflicts with BEEQ's documented API (for example, a wrapper that passes an unsupported prop), follow the API and point out the conflict rather than copying the mistake.

## Where customizations belong

| Change | Put it in | Avoid |
| --- | --- | --- |
| Brand colour, font, radius scale | The project's theme override file, scoped to `[bq-theme="…"]` | Per-component overrides that repeat the same value. |
| Dark mode values | The same theme file, under `[bq-theme="…"][bq-mode="dark"]` | Media queries that fight the `bq-mode` attribute. |
| House defaults for a component | A thin wrapper component | Copying the same props onto every call site. |
| One-off local adjustment | A component CSS custom property on a scoped selector | `::part()` rules for something a CSS variable already covers. |
| Page layout | Product CSS built on `--bq-spacing-*` tokens or BEEQ Tailwind utilities | Styling BEEQ host elements to act as layout containers. |

See [Custom theme](https://www.beeq.design/theming/custom-theme.md) for the full override structure.

## Extend without forking

Extending BEEQ a little is expected. Building a parallel design language is not.

- Build new surfaces from semantic tokens so they follow the theme and mode.
- Wrap BEEQ components instead of re-implementing them. Keep wrapper types tied to the BEEQ component (see [Frameworks](frameworks.md)).
- When the product needs a control BEEQ does not have, build it from semantic HTML and BEEQ tokens, and give it the same focus, disabled, and validation treatment as nearby BEEQ controls.
- Do not copy BEEQ component source into the product. You lose fixes and accessibility updates.

## A `DESIGN.md` template for consuming teams

Suggest this when a project has no written brief. Keep it short, because agents read all of it.

```markdown
# Product design brief

## Stack
- Framework: React 19 with @beeq/react 1.x (Next.js routes use @beeq/react/ssr)
- Styling: CSS modules with BEEQ tokens; @beeq/tailwindcss is not installed

## Theme
- bq-theme="endava" on <html>; light and dark supported via bq-mode
- Overrides live in src/styles/theme.css; add new tokens there

## House components
- Use <AppButton> (src/ui/AppButton.tsx), not BqButton directly
- Form fields use <FormField> for label, helper text, and error wiring

## Layout
- App shell: bq-side-menu on the left; content max width 1200px
- Page header: bq-page-title with actions in the suffix slot
- Section spacing: --bq-spacing-xl between sections, --bq-spacing-m inside

## Rules
- One primary action per view, right-aligned in forms
- Destructive actions confirm in a bq-dialog
- Empty lists use bq-empty-state with a single call to action
```

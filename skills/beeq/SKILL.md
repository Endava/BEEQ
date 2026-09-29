---
name: beeq
description: >
  Builds, styles, and reviews UI with BEEQ, Endava's web-component design system. Use when code adds or
  changes `bq-*` elements or `@beeq/react`, `@beeq/angular`, or `@beeq/vue` components; sets up BEEQ in a
  project; applies a BEEQ theme, mode, or `--bq-*` token; customizes a component with props, CSS custom
  properties, or `::part()`; troubleshoots a BEEQ component that looks unstyled or misbehaves; or reviews
  BEEQ code for API accuracy, accessibility, and design-system fit.
license: Apache-2.0
compatibility: Works with @beeq/core and the official React, Angular, and Vue wrappers in modern browsers, with or without a bundler.
metadata:
  version: "1.4"
  docs: "https://www.beeq.design"
  storybook: "https://storybook.beeq.design"
  source: "https://github.com/Endava/BEEQ"
---
<!-- Generated from packages/beeq-skills/src/beeq/SKILL.md. Edit the source, not this file. -->

# Designing with BEEQ

BEEQ ships standard custom elements from `@beeq/core`, design tokens, themes, and wrappers for React, Angular, and Vue. The wrappers change framework ergonomics, not component APIs.

Teams build **their** product on top of BEEQ. Every run follows the same four steps: discover, scope, build down the ladder, verify. Building with the system brings theming, dark mode, accessibility, and consistency for free; each hand-rolled control or literal value gives one of them back.

Every component name, prop, event, slot, method, CSS custom property, `::part()`, token, utility class, and package export you write is **verified**: it appears on the component's `https://www.beeq.design/components/<component-name>.md` page or in the installed package. An unverified name is a bug, even when it looks plausible.

Three sources, three jobs:

| Source | Owns |
| --- | --- |
| This skill and its references | Workflow, framework syntax, pitfalls, and checks |
| [design-language.md](references/design-language.md) | Visual language: tokens, themes, type, layout, shape, elevation, motion, states, sizes, icons, and tone |
| Component pages and the installed package | Exact APIs |

---

## 1. Discover what the project already decided

"The agent ignored our design system" almost always means "the agent never looked." In an existing project, find:

- **Installed versions**: the `@beeq/*` versions in `package.json`. The public docs describe the latest release.
- **Theme and mode**: `bq-theme` and `bq-mode` on `<html>` or a scoped container, and any stylesheet overriding `--bq-*` tokens. That stylesheet **is** the project's theme; extend it.
- **Setup**: where the BEEQ stylesheet is imported and the icon base path is set. When either is missing, adding it is part of the task: import `@beeq/core/dist/beeq/beeq.css` once, and add `<script data-beeq="https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/svg/"></script>` to the HTML entry. A plain HTML page with no build step links `beeq.css` and `beeq.esm.js` from the CDN; with a bundler, the entry files import them. HTML never links `/node_modules/` URLs. Self-hosted SVGs with `setBasePath()` are for projects that need control over them. All paths: [Setup](references/frameworks.md#setup).
- **House recipes**: wrapper components (`<AppButton>`, `styled(BqButton)`), shared form-field layouts, router-link patterns, and form-library bindings.
- **Agent briefs**: the project's own `DESIGN.md`, `AGENTS.md`, `CLAUDE.md`, or `.github/copilot-instructions.md`.
- **The nearest existing screen**: how it handles layout, navigation, spacing, and action placement.

Precedence: **project conventions > BEEQ design language > this skill's defaults > your taste.**

**Done when** you can name each item above, or state that it is absent. On a greenfield project, follow [Installation](https://www.beeq.design/getting-started/installation.md) and the target framework guide instead. Search commands, where customizations belong, and extending BEEQ without forking: [your-design-system.md](references/your-design-system.md).

## 2. Name the stack and the scope

The stack decides imports, prop casing, and event syntax (see [Framework essentials](#framework-essentials)). Then name the scope:

- **A whole screen or app shell.** BEEQ ships no page-layout component or layout classes; the consumer owns the page grid. Build it with semantic HTML and CSS on BEEQ spacing and colour tokens, and place BEEQ components inside it (`bq-side-menu` for navigation, `bq-page-title` for the heading). Start from [patterns.md](references/patterns.md).
- **A piece of a screen**: a section, form, card, dialog body, or widget. Compose inside the existing layout and match the size, density, and emphasis of neighbouring controls.

List the states that change a component's footprint: helper text, validation messages, loading, multiple selected values, open overlays. Spacing rhythm, host sizing, and the polish checklist: [layout-and-composition.md](references/layout-and-composition.md).

Then list every UI piece the request names or implies, and write down each piece's **job**: what people do with it and what it does to the page. It navigates, holds a value, runs an action, reports on content still on screen, stands in for a region with nothing to show, or blocks until a decision. The job picks the component through [choosing-components.md](references/choosing-components.md#name-each-pieces-job); the request's words are only clues. "Dropdown", "panel", "toggle", and "error" each name different components in different contexts, and a piece nobody named, such as the state after a failed save, still needs one. A job no component covers is semantic HTML on tokens; name it as such.

**Done when** the stack, the scope, the footprint-changing states, and every piece with its job and its component (or "semantic HTML") are written down.

## 3. Build down the ladder

For every custom class, literal value, or hand-built control, walk down this ladder and stop at the first rung that does the job:

1. **A house recipe** from step 1.
2. **A BEEQ component**, chosen by the piece's job from step 2 rather than by its name or its look. Compare the "When to use" guidance on the [component overview](https://www.beeq.design/components/overview.md). Jobs agents most often hand-build: grouping related content in the page flow (`bq-card`); the page's heading with its context and actions (`bq-page-title`); an item's state (`bq-status`), count (`bq-badge`), or removable category (`bq-tag`); separating regions (`bq-divider`); a region with nothing to show, whether empty or failed to load (`bq-empty-state`); a message about content still on screen (`bq-alert`); rows that take people to another section (`bq-side-menu-item` inside `bq-side-menu`). The job questions, words that change meaning with context, and required parent and child structures: [choosing-components.md](references/choosing-components.md).
3. **A documented prop** (`variant`, `appearance`, `size`, `disabled`, `validation-status`). Start from defaults and omit props that repeat them.
4. **A semantic token** for everything around the component: `--bq-spacing-*`, `--bq-background--*`, `--bq-text--*`, `--bq-stroke--*`, `--bq-radius--*`, `--bq-box-shadow--*`, `--bq-font-size--*`, `--bq-stroke-s` for border widths, and `--bq-font-family`, the only font-family token. Copy names from the exact list in [theming.md](references/theming.md#semantic-tokens-first); a guessed name resolves to nothing. `beeq.css` already sets the font, text colour, and background on `html` and `body`, so product CSS starts at layout. Layout dimensions have no token: size containers, grid tracks, and breakpoints as the [grid foundations](https://www.beeq.design/foundations/grid.md) do, in `rem`, with `ch` for a text measure; details in [layout-and-composition.md](references/layout-and-composition.md#layout-dimensions). BEEQ Tailwind utilities (`gap-m`, `bg-primary`) only when the project configures `@beeq/tailwindcss`. Safe pairings and brand overrides: [theming.md](references/theming.md).
5. **A documented component CSS custom property** on the host, such as `--bq-button--border-radius` or `--bq-card--padding`. Padding, background, border, and radius are usually variables; check the component's CSS custom properties table first.
6. **A documented `::part()`** for a property no variable covers. Slotted children stay consumer-owned; style them as ordinary elements.
7. **Scoped custom CSS** on tokens, only for requirements the API does not cover, leaving BEEQ's states and theme behaviour intact.

When BEEQ has no suitable component, use semantic native HTML styled with BEEQ tokens, and say so.

**What is fixed and what is yours.** Fixed: component names and APIs, parent/child structure, token names, theme and mode attributes, framework syntax, and the project's conventions. Yours: which component fits, composition and hierarchy, where on the spacing scale a gap sits, which action is primary, and copy.

### The rules that matter most

Each row pairs the common mistake with its replacement and the reason. Use the reason to extend the rule to cases the table does not list.

| Instead of… | Do this | Why |
| --- | --- | --- |
| `<bq-input />` in HTML | `<bq-input></bq-input>` | Custom elements never self-close; the parser makes the following markup their children. |
| Hex colours, or `px` and `rem` for spacing, radius, type, or border width | Semantic colour tokens, `--bq-spacing-*`, `--bq-radius--*`, `--bq-font-size--*`, `--bq-stroke-s` | Literals drift off the scale and ignore the active theme and mode. Layout dimensions (container widths, track minimums, breakpoints) have no token and stay in `rem`. |
| Palette primitives (`--bq-blue-600`) in product CSS | Semantic tokens (`--bq-background--secondary`, `--bq-text--secondary`) | Semantic tokens re-resolve for dark mode and the Endava theme; primitives stay fixed. |
| Guessing text colour on a coloured surface | A documented pairing, such as `--bq-background--inverse` with `--bq-text--inverse` | Mixed roles lose contrast in at least one theme. |
| `background`, `color`, `border`, or `padding` on a `bq-*` host | A prop, then the component's CSS custom properties, then a documented `::part()` | The host is a wrapper; the visible surface lives in the shadow root. |
| `::part()` overrides to fix truncation or flex sizing | `min-width: 0` (and a width, if needed) on the host; truncate the slotted element | Layout belongs to the host and the consumer's content. |
| An icon-only `bq-button` with no name | `only-icon` plus `label` | An unnamed control is silent to screen readers; BEEQ warns in the console. |
| Emojis or ad-hoc SVGs as icons | `bq-icon` with a [Phosphor](https://phosphoricons.com/) name; a `label` when the icon alone carries meaning, `aria-hidden="true"` on the host when visible text beside it says the same | Icons then follow size, colour, and theme. Without a `label`, `bq-icon` still announces `<name> icon`. |
| Several primary buttons in one region | One `appearance="primary"`; others `secondary` or `text` | Equal emphasis erases hierarchy. |
| `variant="danger"` for emphasis | `variant="danger"` for destructive actions only | Colour carries meaning. |
| A value borrowed from another component or a token name, such as `<bq-alert type="danger">` | A value the prop's type lists on the component page. Status and feedback props take `error` (`type` on `bq-alert`, `bq-notification`, `bq-toast`, and `bq-progress`; `color` on `bq-tag`; `validation-status`); only `bq-button` `variant` and `bq-status` `type` take `danger` | An unlisted value falls back with only a console warning, so a failed save shows as an info alert. `--bq-*danger` tokens name colours, not prop values. |
| A native `onClick` on `bq-button` or `bq-breadcrumb-item` that routes, or a routing button with no `href` | Keep `href`; in the `bqClick` handler call `event.preventDefault()`, then route. Per-stack handlers: [frameworks.md](references/frameworks.md#client-side-routing) | `bqClick` is cancelable, and preventing it stops the link navigation. The kept `href` serves middle-click, open in new tab, and assistive technology. A native click is for a gap `bqClick` cannot cover, such as modifier-key clicks. |
| `!important` or `::part()` to override a token or component variable | A normal declaration at the scope the change covers: `:root` or the theme for the app, a container for a region, the host for one component | Page CSS already beats the component's `:host` defaults, and custom properties inherit into the shadow root. `!important` blocks later theme and mode rules. |
| `/node_modules/…` URLs in HTML | CDN links for a page with no build step; entry-file imports with a bundler | The production build does not ship `node_modules`. |
| `readonly` on `bq-select` to block typing | `disable-search`, when the installed version has it | `readonly` is deprecated for that purpose. |
| `<bq-table>`, or a native `<table>` without the `bq-table` class | `<table class="bq-table">` on every table, with `compact` or `bordered` when the data calls for it | BEEQ has no table element; the class carries the theme's header, row, and selected-row styles. Sorting and pagination stay with the consumer. |
| Swapping stylesheets for themes | `bq-theme` for identity, `bq-mode` for light or dark | Separate attributes; persisting the choice is the app's job. |

The most common layout complaint, a tooltip around truncated text in a flex row the consumer builds (a card header, a table cell), resolved on the host and the slotted content:

```html
<div class="card-header">
  <bq-tooltip>
    <span class="truncate" slot="trigger">A very long report title that must truncate</span>
    A very long report title that must truncate
  </bq-tooltip>
</div>

<style>
  .card-header {
    display: flex;
    gap: var(--bq-spacing-s);
  }

  .card-header bq-tooltip {
    min-width: 0;
  }

  .card-header .truncate {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
```

Navigation rows skip this recipe: `bq-side-menu-item` truncates its own label, so put the icon in `slot="prefix"` and the count in `slot="suffix"`.

The same boundary holds for every `bq-*` element: consumer CSS positions and sizes the host; everything visual goes through the documented API.

### Framework essentials

| Stack | Import from | Props and events | Must know |
| --- | --- | --- | --- |
| HTML | `bq-*` elements from `@beeq/core` | kebab-case attributes; `addEventListener('bqChange', …)` | No build step: link `beeq.css` and `beeq.esm.js` from the CDN. With a bundler: import the stylesheet and call `defineCustomElements()` in the entry files. Icons via `data-beeq` either way. Also the path for legacy apps and unsupported frameworks. |
| React | `@beeq/react` | camelCase props (`onlyIcon`); `onBqChange` | Wrappers set **properties**, so reflected attributes appear only where the component reflects them. Type styled wrappers with `styled(BqTooltip)` and `ComponentProps<typeof BqTooltip>`, never a cast to `ElementType`. |
| Next.js | `@beeq/react/ssr` | as React | The plain wrapper renders empty shells on the server. Run browser-only setup on the client. |
| Angular | `@beeq/angular/standalone` | `(bqChange)` | `beeq.css` goes in the global styles (`src/styles.css` or the `styles` array in `angular.json`), not a component's `styles`. Forms need the matching value accessor. NgModule only in existing module-based apps. |
| Vue and Nuxt | `@beeq/vue` | `@bqChange` | `v-model` only on documented components. Nuxt setup goes in a client-only plugin. |

Bind each event on the element whose Events table lists it. Composite components split their events across parts: in a dropdown, `bqSelect` comes from `bq-option-list`, and `bq-dropdown` itself emits only `bqOpen`. A framework wrapper binds only the events its own component declares. Read `event.detail` only when the component documents a payload. Forms bindings, method refs, routing, Angular and Vue examples, and setup troubleshooting: [frameworks.md](references/frameworks.md).

## 4. Verify

The generated markup is a first draft. Models state these rules and then break them halfway through a long file; this pass is what catches it. If your tool can dispatch a subagent, hand it your output and this file and ask it to find violations independently.

**Searches.** Run each over your output:

| Search for | Pattern | A hit means |
| --- | --- | --- |
| Hex colours | `#[0-9a-fA-F]{3,8}\b` | Replace with a semantic token. Only a theme override file keeps hex. |
| Pixel or rem literals | `\d(px\|rem)\b` | On spacing, radius, type, or border width, use the token. Widths, heights, and grid tracks may keep `rem`. |
| Palette primitives | `--bq-(blue\|grey\|red\|green\|orange\|yellow\|purple\|endava-[a-z]+)-\d` | Replace with a semantic role token. |
| Self-closed custom elements (HTML) | `<bq-[a-z-]+[^>]*/>` | Add the closing tag. |
| Shadow parts | `::part\(` | Confirm the part is on the component's page; move layout fixes to the host. |
| Host visual rules | `^\s*bq-[a-z-]+[^{:]*\{` | Custom properties, margin, width, and `min-width` are fine; move `background`, `color`, `border`, and `padding` to the API. |
| Emojis | `[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]` | Replace with `bq-icon`. |
| Type-erasing casts | `as ElementType` | Wrap the BEEQ component directly. |
| Deprecated select usage | `<(bq-select\|BqSelect)[^>]*\sreadonly` | Use `disable-search` or `disableSearch`. |
| Table markup | `<(bq-)?table\b` | `<bq-table` does not exist; every native `<table>` carries `class="bq-table"`. |
| Important declarations | `!important` | Remove it; set the value with a normal declaration at the scope the change covers. |
| node_modules URLs (HTML) | `["'(]/?node_modules/` | Link the CDN when the page has no build step; import from the entry files with a bundler. |
| Invented font tokens | `--bq-font-family-` | Use `--bq-font-family`, the only font-family token. |
| Token separators | `--bq-(background\|text\|icon\|ui\|radius\|box-shadow\|font-size\|font-weight\|font-line-height)-[a-z0-9]` | Add the double dash: `--bq-font-size--s`, `--bq-text--secondary`. |

**Checklist.** Judgment the searches cannot make:

- [ ] Step 1's findings are honoured: version, theme files, house recipes, nearby screens.
- [ ] Every piece, named or implied, uses the component its job calls for, even where the request's word suggests another. Anything hand-built is named in your reply with the reason.
- [ ] The stylesheet is imported and the icon base path is set, each exactly once. You added them if the project lacked them.
- [ ] Every name and literal prop value is **verified** against the component page, including which element emits each event, `event.detail` shapes, and parent/child structure.
- [ ] Framework syntax matches the stack.
- [ ] One primary action per region; `danger` only for destructive actions.
- [ ] Every control has a visible label or accessible name.
- [ ] Keyboard access, visible focus, and source order survive layout reflow.
- [ ] Every state has a text or icon cue alongside its colour.
- [ ] Overlays (dialog, drawer, dropdown, tooltip, toast) match their docs for placement, open and close, and focus handling.

If you can render the page, check a wide and a narrow width in light and dark modes: hierarchy, alignment, wrapping, contrast, focus rings, and overlay clipping.

**Done when** every search hit is fixed or explained as a deliberate exception, every checklist item holds, and your reply states the theme and mode you assumed, anything you could not verify in the consuming app (including visual fit if you could not render it), and the BEEQ pages or source you used.

---

## Starting points

A form in HTML, with consumer CSS on BEEQ tokens:

```html
<h2 id="contact-title">Contact us</h2>
<form class="contact-form" aria-labelledby="contact-title">
  <bq-input name="name" required>
    <label slot="label">Name</label>
  </bq-input>
  <bq-input name="email" type="email" required>
    <label slot="label">Email</label>
  </bq-input>
  <div class="contact-form__actions">
    <bq-button appearance="text">Cancel</bq-button>
    <bq-button type="submit">Send</bq-button>
  </div>
</form>

<style>
  .contact-form {
    display: grid;
    gap: var(--bq-spacing-m);
    max-inline-size: 60ch;
  }

  .contact-form__actions {
    display: flex;
    gap: var(--bq-spacing-s);
    justify-content: flex-end;
  }
</style>
```

The same actions in React:

```tsx
import { BqButton } from '@beeq/react';

export function FormActions({ onCancel }: { onCancel: () => void }) {
  return (
    <div className="contact-form__actions">
      <BqButton appearance="text" onBqClick={onCancel}>
        Cancel
      </BqButton>
      <BqButton type="submit">Send</BqButton>
    </div>
  );
}
```

Angular and Vue equivalents are in [frameworks.md](references/frameworks.md).

## Documentation lookup order

Use the most specific source. Current source and component API references win over docs, examples, generated summaries, and these references.

1. [Component overview](https://www.beeq.design/components/overview.md), then `https://www.beeq.design/components/<component-name>.md`. Related elements share a page, such as `bq-tab-group` and `bq-tab` on `tab.md`.
2. The framework guide for the stack: [React](https://www.beeq.design/guides/frameworks/react.md), [Next.js](https://www.beeq.design/guides/frameworks/next.md), [Angular](https://www.beeq.design/guides/frameworks/angular.md), [Vue](https://www.beeq.design/guides/frameworks/vue.md), [HTML](https://www.beeq.design/guides/frameworks/html-web-components.md).
3. [Styling guide](https://www.beeq.design/guides/styles.md), [theming](https://www.beeq.design/theming/themes-and-modes.md) (with its global CSS variables, component CSS variables, and custom theme pages), and [foundations](https://www.beeq.design/foundations/colors.md).
4. [Storybook](https://storybook.beeq.design) for each component's states.
5. [llms.txt](https://www.beeq.design/llms.txt), then [llms-full.txt](https://www.beeq.design/llms-full.txt), or the [MCP server](https://www.beeq.design/mcp) in compatible tools.
6. The installed package: wrapper type definitions, and the Custom Elements Manifest named by the `customElements` field of `node_modules/@beeq/core/package.json` when that file is present.
7. Source, with repository access: `packages/beeq/src/components/<name>/` and `packages/beeq-tailwindcss/src/`.

---
title: "Skill reference: BEEQ design language"
description: The visual language of BEEQ web components — runtime CSS-variable contract, themes, type, layout, shape, elevation, motion, states, and component-level visual guidance.
---
<!-- Generated from packages/beeq-skills/src/beeq/references/design-language.md. Edit the source, not this file. -->

# BEEQ Design System

## Overview

BEEQ is a token-led web-component system. Its components use Shadow DOM and inherit a common CSS custom-property contract, so consumer layouts can share themes without reaching into component internals.

Use the active BEEQ theme, semantic tokens, and documented component APIs as the implementation contract. Use native CSS for application layout around components.

The visual priority is readable content, clear actions, and consistent spacing. Start with each component's default look; choose a variant only when the action or state needs a different level of emphasis. Let the surrounding layout provide structure rather than restyling every component.

### What this file owns

| Source | Owns |
| --- | --- |
| This file | Visual language: tokens, themes, typography, layout, shape, elevation, motion, states, and visual composition |
| [BEEQ agent skill](../SKILL.md) | Implementation workflow: discovery, framework syntax, API verification, pitfalls, and checks |
| [Component docs](https://www.beeq.design/components/overview.md) and the Custom Elements Manifest | Exact APIs: properties, events, slots, methods, parts, and CSS variables |

When these disagree, the current component source and API reference win.

## Colors

Use BEEQ semantic color tokens for layouts, text, icons, feedback, borders, and component overrides. This document deliberately references runtime CSS variables rather than resolved hex values: the active BEEQ theme supplies the correct light or dark value.

Use primitive hue tokens only when defining a custom theme or a genuinely missing semantic role. System colors communicate feedback and must not become decorative accents. Use data tokens in sequence for chart series.

| Role | CSS variables |
| --- | --- |
| Brand and accent | `--bq-brand-light`, `--bq-brand`, `--bq-brand-dark`; `--bq-accent-light`, `--bq-accent`, `--bq-accent-dark` |
| Feedback | `--bq-info-light`, `--bq-info`, `--bq-info-dark`; `--bq-success-light`, `--bq-success`, `--bq-success-dark`; `--bq-warning-light`, `--bq-warning`, `--bq-warning-dark`; `--bq-danger-light`, `--bq-danger`, `--bq-danger-dark` |
| Backgrounds | `--bq-background--primary`, `--bq-background--secondary`, `--bq-background--tertiary`, `--bq-background--alt`, `--bq-background--inverse`, `--bq-background--brand`, `--bq-background--overlay` |
| Text and icons | `--bq-text--{primary,secondary,inverse,alt,brand,info,success,warning,danger}`; `--bq-icon--{primary,secondary,inverse,alt,brand,info,success,warning,danger}` |
| Strokes | `--bq-stroke--{primary,secondary,tertiary,inverse,alt,brand,brand-alt,info,success,warning,danger}` |
| UI surfaces | `--bq-ui--{primary,secondary,tertiary,inverse,alt,brand,brand-alt,info,info-alt,success,success-alt,warning,warning-alt,danger,danger-alt}` |
| Focus and interaction | `--bq-focus`, `--bq-hover`, `--bq-active`; the `focus` helper from `@beeq/tailwindcss` accepts optional `--bq-ring-width`, `--bq-ring-color-focus`, and `--bq-ring-offset-width` overrides |
| Data visualisation | `--bq-data-01` through `--bq-data-12`, in sequence |

### Common color pairings

| Situation | Start with |
| --- | --- |
| Main page content | `var(--bq-background--primary)` with `var(--bq-text--primary)`; use `var(--bq-text--secondary)` for supporting copy |
| Grouped or nested content | `var(--bq-background--secondary)` for panels or sidebars, then `var(--bq-background--tertiary)` for nested sections |
| Inverted region | `var(--bq-background--inverse)` with `var(--bq-text--inverse)` |
| Feedback | Matching `--bq-ui--*-alt`, `--bq-text--*`, and `--bq-icon--*` roles; include a written state label |

These are starting pairs, not a guarantee for arbitrary overrides. Check contrast in every active theme, especially after changing a semantic token. Do not use `--bq-text--brand` as small body text on a light background.

### Primitive palette escape hatch

Do not hard-code the underlying values. If a semantic token cannot express the intended meaning, use one of these existing BEEQ primitive CSS variables and add a semantic token for the product or theme where appropriate. Primitives do not change between light and dark mode.

| Palette | Available CSS variables |
| --- | --- |
| Blue, Corai, Cyan, Gold, Green, Indigo, Iris, Lime, Magenta, Orange, Purple, Red, Sky, Teal, Volcano, Yellow | `--bq-<palette>-100` through `--bq-<palette>-1000` in 100-step increments |
| Grey | `--bq-grey-50`, `--bq-grey-100` through `--bq-grey-900`, `--bq-grey-950`, `--bq-grey-1000` |
| Neutral | `--bq-neutral-white`, `--bq-neutral-black` |
| Endava orange | `--bq-endava-orange-100` through `--bq-endava-orange-1000` in 100-step increments |
| Endava grey | `--bq-endava-grey-50`, `--bq-endava-grey-100` through `--bq-endava-grey-900`, `--bq-endava-grey-950`, `--bq-endava-grey-1000` |
| Endava neutral | `--bq-endava-neutral-white`, `--bq-endava-neutral-black` |

## Themes

Theme selectors resolve the same semantic token names to a different runtime value. Do not create component-specific light or dark overrides when a semantic token already exists.

Identity and colour scheme are separate decisions: `bq-theme` sets the brand, `bq-mode` sets light or dark. Set both on `<html>`; `bq-mode` can also be scoped to a region.

| Theme | Apply | Typeface |
| --- | --- | --- |
| BEEQ light (default) | No attribute, or `bq-theme="beeq"` | Outfit |
| BEEQ dark | `bq-mode="dark"` | Outfit |
| Endava light | `bq-theme="endava"` | Poppins |
| Endava dark | `bq-theme="endava"` with `bq-mode="dark"` | Poppins |

Class equivalents (`.beeq`, `.endava`, `.light`, `.dark`) work the same way. BEEQ does not read `prefers-color-scheme` or persist the user's choice; the consuming app sets the initial mode, offers a toggle, and remembers it.

For a custom brand, scope overrides to a new theme name, as described in [Custom theme](https://www.beeq.design/theming/custom-theme.md). Always set `bq-mode` explicitly with a custom theme name, or define the full light role set for the no-mode case, because BEEQ's default light roles only apply without a theme attribute or with `bq-theme="beeq"`.

## Typography

Use semantic HTML headings for document hierarchy. Apply BEEQ visual heading classes only when visual scale must differ from the semantic heading level.

Use the active theme font token instead of declaring a font family in consumer styles. Use regular body text by default; apply semibold or bold only when hierarchy requires it.

| Role | CSS variables |
| --- | --- |
| Active typeface | `--bq-font-family` — Outfit in the BEEQ theme, Poppins in the Endava theme |
| Type scale | `--bq-font-size--xs`, `--bq-font-size--s`, `--bq-font-size--m`, `--bq-font-size--l`, `--bq-font-size--xl`, `--bq-font-size--xxl`, `--bq-font-size--xxl2`, `--bq-font-size--xxl3`, `--bq-font-size--xxl4`, `--bq-font-size--xxl5` |
| Weight | `--bq-font-weight--thin`, `--bq-font-weight--light`, `--bq-font-weight--regular`, `--bq-font-weight--medium`, `--bq-font-weight--semibold`, `--bq-font-weight--bold` |
| Line height | `--bq-font-line-height--small`, `--bq-font-line-height--regular`, `--bq-font-line-height--large` |

`--bq-font-family` is the only font-family token. The Tailwind `font-outfit` and `font-poppins` aliases point to variables that the themes do not declare, so they are not part of the runtime contract. `beeq.css` already applies the font family and `--bq-font-size--m` on `html`, and the text colour, background, and line height on `body`, so a page inherits the theme without restating them.

### Type hierarchy in use

| Use | Style | Size token | Line-height token |
| --- | --- | --- | --- |
| Standalone display statement | `.display` | `--bq-font-size--xxl5` | `--bq-font-line-height--small` |
| Page and section headings | `h1`–`h4` or `.h1`–`.h4` | `--bq-font-size--xxl4` through `--bq-font-size--xxl` | `--bq-font-line-height--small` |
| Smaller headings | `h5`–`h6` or `.h5`–`.h6` | `--bq-font-size--xl`, `--bq-font-size--l` | `--bq-font-line-height--regular` |
| Reading and form copy | Default body text | `--bq-font-size--m` | `--bq-font-line-height--regular` |
| Supporting annotation | `.caption` / `figcaption`, `.overline` | `--bq-font-size--s`, `--bq-font-size--xs` | `--bq-font-line-height--regular` |

Keep long-form text to roughly 50–90 characters per line. Choose heading size by the space and hierarchy available; do not change heading level just to get a smaller visual treatment.

## Layout

Use the shared spacing scale for padding, margins, and gaps. Keep related content close and separate regions with larger scale values. Prefer logical spacing properties when a layout should follow writing direction.

Use native CSS Grid for page structure and BEEQ spacing tokens for gutters and margins. Grid guidance is framework-agnostic: choose responsive breakpoints when content needs a different structure, not because a breakpoint range exists.

| Layout role | CSS variables or utility |
| --- | --- |
| Spacing | `--bq-spacing-xs3`, `--bq-spacing-xs2`, `--bq-spacing-xs`, `--bq-spacing-s`, `--bq-spacing-m`, `--bq-spacing-l`, `--bq-spacing-xl`, `--bq-spacing-xxl`, `--bq-spacing-xxl2`, `--bq-spacing-xxl3`, `--bq-spacing-xxl4` |
| Viewport-height layout | Tailwind `h-dynamic-vh` maps to `100dvh` |
| Direction-aware layout | Use `bs-*`, `is-*`, `border-{bl,bs,be,i,is,ie}-*`, `p-{b,bs,be,i}-*`, `m-{b,bs,be,i}-*`, and `inset-{b,bs,be,i,is,ie}-*` rather than physical left/right values when direction can change |
| Hover and active blends | Use `bg-{hover,active}-*`, `border-{hover,active}-*`, `text-{hover,active}-*`, and `stroke-{hover,active}-*`; they blend the selected token with `--bq-hover` or `--bq-active` |

The utilities in this table require the `@beeq/tailwindcss` preset. Without it, use the CSS variables directly.

### Page rhythm and responsive structure

- BEEQ spacing uses a 4px-based scale. Use `xs`–`m` for related labels, controls, and content inside a region; use `l` and above to separate cards, panels, and page sections. Repeat the same gap for repeated patterns.
- Use a column grid when regions need to align or be compared. A 12-column grid is a useful option for product screens, but BEEQ does not ship that grid as a component. Keep gutters empty and place content within columns.
- Start with a meaningful DOM reading order. Stack regions when space is tight, then add columns when content fits; preserve keyboard focus order as the layout reflows.
- BEEQ's phone, tablet, and desktop ranges are design guidance, not generated breakpoints. Implement media or container queries in the consumer app when the content needs them. Use a fluid container for broad product screens and a constrained reading width for forms or long text.

### Components inside layouts

The component host is what participates in consumer layout. Size and position the host; leave its internals to the component.

- `bq-input`, `bq-select`, and `bq-card` hosts are block-level and fill their container. Constrain the container rather than the component.
- `bq-button` is inline by default. Use its `block` property for a full-width button.
- A `bq-*` host that is a flex or grid item and must shrink below its content width needs `min-width: 0` on the host. Grid columns that hold such content need `minmax(0, 1fr)` or `min-inline-size: 0`.
- Slotted content belongs to the consumer. Truncate, wrap, or style it as an ordinary element, rather than overriding a component part to fix layout.

```css
.row {
  display: flex;
  gap: var(--bq-spacing-s);
}

.row bq-tooltip {
  flex: 1;
  min-width: 0;
}

.row .truncate {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

Truncated text needs a way to read it in full, such as a tooltip or a detail view. Components that own a label, such as `bq-side-menu-item`, truncate it themselves; this recipe is for rows the consumer builds.

## Elevation & Depth

Use the smallest BEEQ shadow that communicates the required layer relationship. A stable surface, panel, and temporary floating surface should have progressively stronger separation.

Prefer documented component shadow variables when changing a BEEQ component. Use global shadow tokens only for custom application surfaces. Shadows communicate elevation, not interactive state or decoration.

| Elevation | CSS variable | Typical use |
| --- | --- | --- |
| Flat | None | Dense data and page sections; separate with spacing, background, or stroke |
| Extra-small | `--bq-box-shadow--xs` | Subtle interactive lift |
| Small | `--bq-box-shadow--s` | Card or stable elevated surface |
| Medium | `--bq-box-shadow--m` | Dropdown, panel, or raised container |
| Large | `--bq-box-shadow--l` | Dialog, toast, or other floating attention layer |

Overlay components manage their own stacking. When an app layer (for example a sticky header) competes with a BEEQ overlay, adjust the component's documented variable, such as `--bq-dialog-z-index`, `--bq-panel-z-index` on `bq-dropdown`, or `--bq-tooltip--z-index`, rather than raising `z-index` on the host.

## Shapes

Use the shared radius scale for custom surfaces and documented component overrides. Components already provide their default shape treatment; align surrounding application UI to the same scale rather than creating local radii.

Use the smallest stroke for ordinary separation, a stronger stroke for focused or selected states, and larger emphasis only where the surface warrants it.

| Shape role | CSS variables |
| --- | --- |
| Radius | `--bq-radius--none`, `--bq-radius--xs2`, `--bq-radius--xs`, `--bq-radius--s`, `--bq-radius--m`, `--bq-radius--l`, `--bq-radius--full` |
| Stroke width | `--bq-stroke-s`, `--bq-stroke-m`, `--bq-stroke-l`; Tailwind exposes them as `border-s`, `border-m`, and `border-l` |

For custom surfaces, start with `--bq-radius--s` on compact controls, `--bq-radius--m` on cards or buttons, and `--bq-radius--l` only when a larger surface has enough padding. Use `--bq-radius--full` for circular or pill shapes. Use `--bq-stroke-s` with a semantic stroke color for ordinary separation; reserve stronger widths and colors for focus, selection, or state. Do not replace a component's built-in focus indicator with a border alone.

## Motion

BEEQ does not publish motion tokens. Components own their transitions — overlays opening, accordions expanding, toasts entering — and consumers should not restyle them.

- BEEQ's global stylesheet reduces animations and transitions to near zero when the user sets `prefers-reduced-motion: reduce`. Keep that behaviour for any custom motion in the consuming app.
- Use motion in custom UI only to explain a change of state or position, and keep it short. Do not animate layout on page load or loop decorative motion.
- Never rely on motion alone to communicate a state change; pair it with a visible change in text, icon, or colour.

## States

Components ship their own treatment for each state. Use the documented property to set the state rather than restyling it, so every theme and mode stays consistent.

| State | How to express it | Guidance |
| --- | --- | --- |
| Disabled | The component's `disabled` property | Explain what the user needs to do to enable it. Do not use disabled styling for read-only information. |
| Loading | `loading` on `bq-button`; `bq-spinner` or `bq-progress` for regions | Keep the layout stable while loading. Use progress when the amount of work is known. |
| Validation | `validation-status` (`error`, `warning`, `success`, `none`) on `bq-input`, `bq-select`, and `bq-textarea`, with a message in the `helper-text` slot | Always pair the colour with a written message that says how to fix the problem. |
| Selected or active | `selected` on `bq-tag` and `bq-option`; `active` on `bq-tab` and `bq-side-menu-item`; `checked` on checkboxes, radios, and switches | Show one current item per navigation group. |
| Non-searchable select | `disable-search` on `bq-select` | Use when people must pick from the list without typing. Do not use the deprecated `readonly` property for this. |
| Empty | `bq-empty-state` | Say what is missing and offer one next step. |
| A region failed to load | `bq-empty-state` with a warning icon in `slot="thumbnail"` and a Retry button in `slot="footer"` | Say what failed and how to recover. |
| Error about content still on screen | `bq-alert` inline, next to the content it is about | Do not rely on a toast for errors people must act on. |

Hover, focus, and pressed states are built into interactive components. Do not override one of them without restyling the others, and never remove the focus indicator.

## Size and density

Start every component at its default size. Change size to match density across a region, not to adjust a single control.

| Component | Sizes | Default |
| --- | --- | --- |
| `bq-button`, `bq-tab-group`, `bq-spinner` | `small`, `medium`, `large` | `medium` |
| `bq-dialog`, `bq-empty-state` | `small`, `medium`, `large` | `medium` |
| `bq-tag` | `xsmall`, `small`, `medium` | `medium` |
| `bq-avatar` | `xsmall`, `small`, `medium`, `large` | `medium` |
| `bq-badge` | `small`, `medium` | `small` |
| `bq-side-menu` | `small`, `medium` | `medium` |

- Use `small` in dense surfaces such as toolbars, table rows, and filter bars, and keep neighbouring controls at the same size.
- Use `large` sparingly, for a single prominent action or an onboarding surface.
- Form controls (`bq-input`, `bq-select`, `bq-textarea`) have one size. Align their widths at the layout level.
- Keep interactive targets at least 24 by 24 CSS pixels, and larger on touch-first screens. Do not shrink icon-only buttons below their small size.

## Icons

- `bq-icon` renders [Phosphor](https://phosphoricons.com/) icons by name. Its `weight` property selects the Phosphor style.
- The default size is 24px. Use 16–20px beside small text, 24px beside body text and in standard controls, and larger sizes only for illustrative use such as empty states.
- Colour icons with semantic roles. The `color` property takes a token name without the `--bq-` prefix, such as `icon--secondary` or `icon--danger`.
- An icon that carries meaning on its own needs a `label`. Every other icon is decorative, including one beside text that says the same thing; hide it from assistive technology with `aria-hidden="true"` on the `bq-icon` host. An unlabelled `bq-icon` still announces `<name> icon`, and only `aria-hidden` removes it.
- Icon-only buttons need a `label` on the `bq-button`.
- Use one icon style (weight) across a product surface. Do not mix emojis, icon fonts, or unrelated SVG sets with Phosphor icons.

## Accessibility

BEEQ components ship with keyboard support, focus management, and ARIA roles. The consuming layout has to preserve them.

- **Contrast.** Aim for WCAG 2.1 AA: 4.5:1 for body text and 3:1 for large text, icons, and control boundaries. Recheck after any token override, in every theme and mode.
- **Focus.** Keep the built-in focus indicator visible. For custom focusable elements, use the `--bq-focus` colour so focus looks the same everywhere.
- **Names.** Every control needs a visible label or an accessible name.
- **Order.** Keep DOM order equal to reading and focus order when layouts reflow.
- **Non-colour cues.** Pair every colour-coded state with text or an icon.
- **Motion.** Respect `prefers-reduced-motion` in custom UI.
- **Zoom and text size.** Layouts should reflow at 400% zoom and with larger browser text, without clipping labels or hiding actions.

## Content and tone

- **Be direct.** Use short, plain sentences and the words people use for the task.
- **Label actions with verbs.** "Save profile" and "Delete project", not "OK" or "Submit". Repeat the action on the confirm button of a dialog.
- **Use sentence case** for labels, buttons, headings, and menu items.
- **Write errors that help.** Say what went wrong and how to fix it, next to the field or region. Do not blame the user or show raw error codes alone.
- **Write empty states with a next step.** State what is missing and offer one clear action.
- **Keep tooltips supplementary.** Anything the user needs to complete a task belongs in visible text or helper text.
- **Plan for longer text.** Translated strings can be much longer; let labels wrap or truncate deliberately.

## Components

Use BEEQ elements for standard controls, navigation, feedback, overlays, and content surfaces before composing an equivalent control from native markup. Use native HTML and CSS for application layout, page regions, and content that BEEQ does not own.

Set component customization variables on the custom-element host. Use documented properties, slots, events, and `::part(...)` contracts only; ordinary consumer CSS does not cross a component's Shadow DOM boundary.

### Composition and visual fit

- For a page shell, use [`bq-page-title`](https://www.beeq.design/components/page-title.md) for identity and [`bq-side-menu`](https://www.beeq.design/components/side-menu.md) with Side menu items when the product needs persistent navigation. Let the app own the surrounding grid.
- For forms, pair the relevant BEEQ controls with their documented labels, help, and validation states. Align control widths and gaps at the layout level.
- For actions, [`bq-button`](https://www.beeq.design/components/button.md) defaults to `appearance="primary"`, `variant="standard"`, and medium size. Keep one clear primary action per region; use `secondary`, `link`, or `text` appearance, or the `ghost` variant, for supporting actions, and the `danger` variant only for destructive actions.
- For feedback, choose inline, persistent, or temporary presentation based on the message's duration and importance. Do not stack several competing attention layers.
- For custom layouts, check the selected component's documented default appearance, properties, slots, parts, and CSS variables before styling around it. Preview the composition at narrow and wide widths, in light and dark modes, and with real text lengths.

### Quick component selection guide

A short visual-composition guide, not an API inventory. Follow each linked page for properties, slots, events, parts, and framework examples.

| Need | BEEQ elements | When to use them |
| --- | --- | --- |
| Trigger an action | [`bq-button`](https://www.beeq.design/components/button.md) | Trigger a user action. For navigation, use `href` with the link appearance, or a native link. |
| Collect free-form text | [`bq-input`](https://www.beeq.design/components/input.md), [`bq-textarea`](https://www.beeq.design/components/textarea.md) | Input for a single line; Textarea when the value spans multiple lines. |
| Choose from a set | [`bq-select`](https://www.beeq.design/components/select.md), [`bq-radio-group`](https://www.beeq.design/components/radio.md) with `bq-radio` | Select for compact single or multiple choice; Radio group when every option should remain visible. |
| Set a binary value | [`bq-checkbox`](https://www.beeq.design/components/checkbox.md), [`bq-switch`](https://www.beeq.design/components/switch.md) | Checkbox for selections submitted with a form; Switch for an immediate on/off setting. |
| Pick a date or bounded value | [`bq-date-picker`](https://www.beeq.design/components/date-picker.md), [`bq-slider`](https://www.beeq.design/components/slider.md) | Date picker instead of building a calendar; Slider for a bounded continuous or discrete value. |
| Navigate | [`bq-breadcrumb`](https://www.beeq.design/components/breadcrumb.md), [`bq-side-menu`](https://www.beeq.design/components/side-menu.md) | Breadcrumb for hierarchy; Side menu for product navigation. |
| Switch views or show a sequence | [`bq-tab-group`](https://www.beeq.design/components/tab.md), [`bq-steps`](https://www.beeq.design/components/steps.md) | Tabs for peer content; Steps for a defined multi-stage sequence. |
| Reveal, group, or separate content | [`bq-accordion-group`](https://www.beeq.design/components/accordion.md), [`bq-card`](https://www.beeq.design/components/card.md), [`bq-divider`](https://www.beeq.design/components/divider.md) | Accordion group for related disclosures, Card to group content, Divider to separate regions. |
| Show a temporary layer or contextual menu | [`bq-dialog`](https://www.beeq.design/components/dialog.md), [`bq-drawer`](https://www.beeq.design/components/drawer.md), [`bq-dropdown`](https://www.beeq.design/components/dropdown.md), [`bq-tooltip`](https://www.beeq.design/components/tooltip.md) | Dialog for a blocking decision, Drawer for supporting task content, Dropdown for contextual actions or options, Tooltip for brief supplementary help. |
| Communicate feedback or progress | [`bq-alert`](https://www.beeq.design/components/alert.md), [`bq-notification`](https://www.beeq.design/components/notification.md), [`bq-toast`](https://www.beeq.design/components/toast.md), [`bq-progress`](https://www.beeq.design/components/progress.md), [`bq-spinner`](https://www.beeq.design/components/spinner.md) | Inline Alert, persistent Notification, temporary Toast; Progress when the amount of work is known, Spinner when it is not. |
| Show state, metadata, or absence | [`bq-status`](https://www.beeq.design/components/status.md), [`bq-badge`](https://www.beeq.design/components/badge.md), [`bq-tag`](https://www.beeq.design/components/tag.md), [`bq-avatar`](https://www.beeq.design/components/avatar.md), [`bq-empty-state`](https://www.beeq.design/components/empty-state.md) | Status for an item's state, Badge for counts, Tag for labels that can be selected or removed, Avatar for a person or entity, Empty state for missing content or a region that failed to load. |
| Establish page identity | [`bq-page-title`](https://www.beeq.design/components/page-title.md) | Page heading with optional back action, subtitle, and actions. |
| Present tabular values | [`.bq-table`](https://www.beeq.design/components/table.md) | Apply the documented class to semantic native table markup. It is not a data-grid abstraction. |

`bq-select` and `bq-dropdown` build on lower-level elements (`bq-option-list`, `bq-option`, `bq-option-group`, and the floating `bq-panel`). Use the higher-level component; reach for `bq-option-list` directly only when building a custom listbox-based control. `bq-panel` has no public documentation page, so do not use it directly in product UI.

## Do's and Don'ts

- Do use semantic tokens for component and layout styling.
- Do use the shared spacing, radius, stroke, and shadow scales when creating application UI around BEEQ components.
- Do pair meaningful color with text, icons, or another non-color cue.
- Do use documented component APIs and host-level custom properties.
- Do set state through component properties (`disabled`, `loading`, `validation-status`, `selected`) rather than CSS.
- Do fix layout on the host (`min-width: 0`, width, placement) and on your own slotted content.
- Don't hard-code hex colors in component or layout styles when a BEEQ semantic token exists.
- Don't use brand or system feedback colors as decoration.
- Don't use arbitrary spacing values when the shared scale has a suitable value.
- Don't use heavy shadows on every surface.
- Don't override `::part()` internals to solve a layout problem that belongs to the surrounding container.
- Don't mix component sizes within one row or toolbar.
- Don't recreate a BEEQ component with custom markup when its documented contract fits the interaction.

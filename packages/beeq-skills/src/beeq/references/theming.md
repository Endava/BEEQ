---
title: "Skill reference: theming BEEQ"
description: How agents apply BEEQ themes and modes, choose semantic tokens, pair colours safely, and add product brand overrides without breaking dark mode.
---

This reference supports the [BEEQ agent skill](../SKILL.md). Read it when a task mentions a theme, brand colour, dark mode, or any `--bq-*` token.

## The model

BEEQ separates two decisions:

| Decision | Attribute | Values | Class alternative |
| --- | --- | --- | --- |
| Identity | `bq-theme` | `beeq` (default), `endava`, or a custom theme name | `.beeq`, `.endava`, or your theme class |
| Colour scheme | `bq-mode` | `light` (default), `dark` | `.light`, `.dark` |

Set both on `html`. Modes can also be scoped to a region, for example a light section inside a dark page:

```html
<html bq-theme="endava" bq-mode="dark">
  <body>
    <section bq-mode="light">…</section>
  </body>
</html>
```

BEEQ does not read `prefers-color-scheme` and does not remember the user's choice. The app decides the default, offers a toggle, and persists the choice. See [Themes and modes](https://www.beeq.design/theming/themes-and-modes.md) for a working toggle.

## Semantic tokens first

Semantic tokens describe a role and resolve differently per theme and mode. Use them for everything in product CSS. These are the exact names; a name not listed here or on the component page resolves to nothing, silently.

| Role | Tokens |
| --- | --- |
| Intents | `--bq-{brand,accent,info,success,warning,danger}`, each with `-light`, `-dark`, `-strong`, and `-bright` |
| Backgrounds | `--bq-background--{primary,secondary,tertiary,alt,inverse,brand,overlay}` |
| Text | `--bq-text--{primary,secondary,inverse,brand,accent,info,success,warning,danger}` |
| Text on a solid fill | `--bq-text--on-{brand,accent,info,success,warning,danger}` |
| Icons | `--bq-icon--{primary,secondary,inverse,brand,accent,info,success,warning,danger}` |
| Strokes (colour) | `--bq-stroke--{primary,secondary,tertiary,alt,inverse,brand,brand-alt,accent,info,success,warning,danger}` |
| UI fills | `--bq-ui--{primary,secondary,tertiary,alt,inverse}`, and `--bq-ui--{brand,accent,info,success,warning,danger}`, each with `-alt` |
| Interaction | `--bq-focus`, `--bq-hover`, `--bq-active` |
| Data visualisation | `--bq-data-01` to `--bq-data-12`, used in order |
| Font | `--bq-font-family`, the only font-family token; `--bq-font-size--{xs,s,m,l,xl,xxl,xxl2,xxl3,xxl4,xxl5}`; `--bq-font-weight--{thin,light,regular,medium,semibold,bold}`; `--bq-font-line-height--{small,regular,large}` |
| Spacing | `--bq-spacing-{xs3,xs2,xs,s,m,l,xl,xxl,xxl2,xxl3,xxl4}` |
| Shape | `--bq-radius--{none,xs2,xs,s,m,l,full}`; stroke widths `--bq-stroke-s`, `--bq-stroke-m`, `--bq-stroke-l` |
| Elevation | `--bq-box-shadow--{xs,s,m,l}` |

Role and scale tokens take a double dash before the role or step: `--bq-text--secondary`, `--bq-font-size--s`, `--bq-radius--m`. A single dash belongs to spacing, stroke widths, data colours, and the intents with their `-light`, `-dark`, `-strong`, and `-bright` steps. A border is `var(--bq-stroke-s) solid var(--bq-stroke--primary)`.

`--bq-text--alt` and `--bq-icon--alt` are deprecated. They are always white, so they fail on light fills; use `--bq-text--on-{intent}` for content on a solid fill.

The full list lives in [Global CSS variables](https://www.beeq.design/theming/global-css-variables.md) and [Colors](https://www.beeq.design/foundations/colors.md).

Palette primitives such as `--bq-blue-600` or `--bq-grey-100` do not change with the mode. Use them only inside a theme definition, to set an intent.

### How the colour layers connect

Colour flows through four layers, and each one reads only the layer before it:

1. **Primitives** (`--bq-blue-600`): fixed hues. Only intents read them.
2. **Intents** (`--bq-info`, `--bq-info-strong`): set per theme, the same in both modes.
3. **Roles** (`--bq-text--info`, `--bq-ui--info-alt`): set per mode, from the intents.
4. **Component variables** (`--bq-alert--background-info`): set on each component's host, from the roles.

Every intent has the same five steps:

| Step | Use |
| --- | --- |
| `--bq-{intent}-light` | Subtle tint in light mode, read by `--bq-ui--{intent}-alt` |
| `--bq-{intent}` | Solid fill, read by `--bq-ui--{intent}`. Endava dark mode fills info, success, warning, and danger with `-bright` instead. |
| `--bq-{intent}-dark` | Subtle tint in dark mode, read by `--bq-ui--{intent}-alt` |
| `--bq-{intent}-strong` | Text, icons, and strokes on light surfaces; read in light mode by `--bq-text--{intent}`, `--bq-icon--{intent}`, `--bq-stroke--{intent}`, and (for brand) `--bq-focus` |
| `--bq-{intent}-bright` | Text, icons, and strokes on dark surfaces; read in dark mode by `--bq-text--{intent}`, `--bq-icon--{intent}`, `--bq-stroke--{intent}`, and (for brand) `--bq-focus` |

Change an intent to re-colour every role and component that reads it, in both modes. Info is its own intent: informational states read `--bq-info*`, never `--bq-brand*`, so a re-brand leaves them alone.

## What beeq.css already styles

The stylesheet sets `font-family: var(--bq-font-family)` and `font-size: var(--bq-font-size--m)` on `html`, and `background-color: var(--bq-background--primary)`, `color: var(--bq-text--primary)`, and `line-height: var(--bq-font-line-height--regular)` on `body`. Pages inherit the active theme and mode from these rules, so product CSS starts at layout. Set a different surface or text role only on the element that needs it.

## Safe pairings

Each colour family has one job. Pair a fill with the foreground made for it.

| Family | Use for | Pair with | Never use for |
| --- | --- | --- | --- |
| `--bq-background--*` | Page and region surfaces | `--bq-text--primary` or `--bq-text--secondary`; `--bq-text--inverse` on `--bq-background--inverse` | Component fills |
| `--bq-ui--{intent}` | Solid component fills | `--bq-text--on-{intent}`, for text and icons | Text or borders |
| `--bq-ui--{intent}-alt` | Subtle intent tints | `--bq-text--{intent}`, `--bq-icon--{intent}`, `--bq-stroke--{intent}` | Text without its matching role |
| `--bq-ui--inverse` | Inverted fills such as tooltips | `--bq-text--inverse` | — |
| `--bq-text--*`, `--bq-icon--*` | Text, glyphs, status dots | Neutral surfaces, or the matching `-alt` tint | Fills |
| `--bq-text--on-{intent}` | Content on `--bq-ui--{intent}` | Its own fill only; change both together | Anything on a neutral surface |
| `--bq-stroke--*` | Borders and separators | `--bq-stroke--tertiary` for interactive boundaries (3:1); `--bq-stroke--primary` for decorative lines | Fills or text |
| `--bq-hover`, `--bq-active` | Mixing state colours | See [Hover and pressed states](#hover-and-pressed-states) | Direct paint |
| `--bq-focus` | Focus outlines | — | Brand decoration |

Feedback also needs a written label, never colour alone. These pairs pass WCAG AA in the built-in themes; check contrast in every active theme and mode after an override.

**Endava exception.** In the Endava theme, `--bq-text--on-brand` and `--bq-text--on-accent` are white on Red Orange: 3.15:1. That meets 3:1 for large text (24px, or 18.66px bold) and UI glyphs, not 4.5:1 for normal text. Keep text on Endava brand fills large, or override the pair if the product needs 4.5:1.

## Hover and pressed states

BEEQ mixes hover and pressed colours where they are used: `color-mix(in srgb, <base>, var(--bq-hover) 20%)`, and the same with `--bq-active`. Component variables hold only the resting colour, so overriding one re-colours its hover and pressed states too. A component has a separate `-hover` variable, such as `--bq-option--background-hover`, only when hover starts from a different colour than rest; it holds that base, and BEEQ still mixes it.

Follow the same rule in custom CSS. Mix at the point of use, and never store a pre-mixed colour in a variable:

```css
.chip:hover {
  background-color: color-mix(in srgb, var(--bq-ui--secondary), var(--bq-hover) 20%);
}
```

## Brand a product

### Change only the brand colour

Set the brand intent once, on `:root`: all five steps and the text that sits on the fill. Every brand role (`--bq-ui--brand`, `--bq-text--brand`, `--bq-stroke--brand`, `--bq-background--brand`, and the `-alt` roles) reads them, and so does `--bq-focus`, through `-strong` in light mode and `-bright` in dark mode. Hover and pressed fills are mixed from those roles, so every component follows in both modes.

```css
:root {
  --bq-brand: #00857c;
  --bq-brand-light: color-mix(in srgb, var(--bq-brand) 15%, white);
  --bq-brand-dark: color-mix(in srgb, var(--bq-brand) 60%, black);
  --bq-brand-strong: color-mix(in srgb, var(--bq-brand) 80%, black);
  --bq-brand-bright: color-mix(in srgb, var(--bq-brand) 50%, white);
  --bq-text--on-brand: var(--bq-white);
}
```

This file is the one place hex values belong. Before you ship a new brand, check:

- `--bq-brand-strong` reaches 4.5:1 on `--bq-background--primary`, `--bq-ui--secondary`, and `--bq-brand-light`.
- `--bq-brand-bright` reaches 4.5:1 on the dark-mode surfaces and on `--bq-brand-dark`.
- `--bq-text--on-brand` reaches 4.5:1 on `--bq-brand`, and on its hover and pressed mixes.

### A custom theme

For a full identity (font, brand, surfaces), create one theme file and scope it to a theme name. Set the intents from primitives; the roles already read them, so they follow.

```css
[bq-theme="acme"],
.acme {
  --bq-font-family: "Inter", sans-serif;
  --bq-brand-light: var(--bq-blue-100);
  --bq-brand: var(--bq-blue-600);
  --bq-brand-dark: var(--bq-blue-1000);
  --bq-brand-strong: var(--bq-blue-700);
  --bq-brand-bright: var(--bq-blue-400);
  --bq-text--on-brand: var(--bq-white);
}
```

```html
<html bq-theme="acme" bq-mode="light">
```

Two consequences to plan for:

- **Set `bq-mode` explicitly with a custom theme.** BEEQ applies its default light roles when there is no theme attribute or when `bq-theme="beeq"`. With a custom theme name and no mode, the light roles are yours to define. Either always set `bq-mode`, or define the full light role set under `[bq-theme="acme"]:not([bq-mode])`.
- **Scope role overrides to a mode.** A role set on `[bq-theme="acme"]` applies in both modes. To change `--bq-background--primary` for light mode only, set it under `[bq-theme="acme"][bq-mode="light"]` and leave dark mode alone, or set a dark value under `[bq-theme="acme"][bq-mode="dark"]` too.

The [Custom theme](https://www.beeq.design/theming/custom-theme.md) guide lists every token to cover, including the selectors for class-based themes and the Tailwind setup.

## Override scope

BEEQ wraps every theme and mode selector in `:where()`, so its token declarations have zero specificity, and a component's `:host` defaults lose to page CSS too. Any normal declaration wins, without `!important` and without `::part()`. Custom properties inherit into every shadow root, so set a token at the scope the change should cover:

| Scope | Example | Effect |
| --- | --- | --- |
| The whole app | `:root { --bq-brand: …; --bq-brand-strong: …; --bq-text--on-brand: …; }` | Every role and component that reads the intent, in both modes |
| One mode | `[bq-mode="dark"] { --bq-text--secondary: …; }` | One role in dark mode. A role set on `:root` applies in both modes. |
| One region | `.promo { --bq-ui--brand: …; --bq-text--on-brand: …; }` | Roles inside the region |
| One component | `.cta-button { --bq-button--primary-background: …; --bq-button--primary-text-color: …; }` | That component only |

Two details decide the level:

- **Roles resolve where they are declared.** Mode selectors declare roles on `html`, or on the nearest element with `bq-mode`. An intent changed on a container does not reach roles already computed above it, so in a region set the role itself. A nested `bq-mode` region re-declares every role from the intents it inherits: intent overrides on `:root` reach it, role overrides on `:root` do not.
- **Recolour one component through its own variables.** Every colour a component paints has a `--bq-{component}--*` variable, listed in the CSS custom properties table on its page. Set those on the host, not a role such as `--bq-text--primary` or `--bq-ui--brand`: a role on the host also reaches every nested component and slotted child. Change a fill and its foreground together, for example `--bq-badge--background-color` with `--bq-badge--text-color`.

Colour variables worth knowing:

| Component | Variables |
| --- | --- |
| `bq-button` | `--bq-button--primary-background`, `--bq-button--primary-text-color`, `--bq-button--primary-background-danger`, `--bq-button--secondary-background`, and the `-ghost` border and text variables |
| `bq-checkbox`, `bq-radio`, `bq-switch` | `--bq-checkbox--background-color-checked`, `--bq-checkbox--icon-color-checked`, `--bq-radio--dot-color-checked`, `--bq-switch--track-color-checked`, `--bq-switch--dot-color-checked` |
| `bq-input`, `bq-select`, `bq-textarea` | `--bq-input--border-color-{danger,success,warning}`, `--bq-input--helper-text-color-{danger,success,warning}`, with the same names on the other two |
| `bq-tag` | `--bq-tag--background-color` and `--bq-tag--text-color`; per colour and variant, `--bq-tag--background-{color}-{variant}`, `--bq-tag--text-{color}-{variant}`, `--bq-tag--border-{color}-outline` |
| `bq-status`, `bq-step-item`, `bq-tab` | `--bq-status--dot-color-{success,danger,alert,info,neutral}`, `--bq-step-item--prefix-num-bg-color-current`, `--bq-tab--indicator-color`, `--bq-tab--text-color-active` |

`!important` on a token blocks the theme and mode rules that should still apply later.

## Common mistakes

| Mistake | Fix |
| --- | --- |
| Swapping stylesheets to change theme | Change the `bq-theme` attribute. |
| Using `@media (prefers-color-scheme: dark)` to restyle components | Set `bq-mode` from the preference in JavaScript. |
| Hard-coding `#fff` or `white` for a card background | `--bq-background--primary`, which becomes dark in dark mode. |
| `--bq-text--alt`, or hard-coded white, for text on a solid fill | `--bq-text--on-{intent}`, paired with `--bq-ui--{intent}`. |
| Brand tokens for informational UI | The info roles: `--bq-ui--info-alt`, `--bq-text--info`, `--bq-icon--info`. |
| Changing only `--bq-brand` for a re-brand | Set all five brand steps and `--bq-text--on-brand`, then check contrast. |
| Overriding a role in one mode and forgetting the other | A role on `:root` covers both modes; add a `[bq-mode="dark"]` rule only where dark needs its own value. |
| A custom `bq-theme` with no `bq-mode` | Set `bq-mode`, or define the full light role set for the no-mode case. |
| Overriding `--bq-text--primary` or another role on a host to recolour one component | The component's own colour variables, such as `--bq-tag--text-color`. |
| A variable that stores a pre-mixed hover colour | The resting colour in the variable, mixed with `--bq-hover` where it is used. |
| Overriding the same token in many component rules | Override it once in the theme file. |
| `!important` on a token or component variable | A normal declaration at the scope in [Override scope](#override-scope). |
| `::part()` rules to recolour a component | The component's colour variables, or the intents; `::part()` is for structure the variables cannot reach. |
| Restating `font-family`, `color`, or `background-color` on `body` | Nothing; `beeq.css` already sets them from the active theme. |
| Invented token names, such as a `-body` or `-heading` suffix on the font family | The exact names in [Semantic tokens first](#semantic-tokens-first). |
| Using the Endava theme without the Endava brand requirement | Default to `beeq` unless the project already uses `endava`. |

# BEEQ TailwindCSS Preset

BEEQ TailwindCSS is a preset that adds BEEQ's opinionated TailwindCSS configuration to your application. It works with Tailwind CSS v3 and v4.

Its design tokens, base reset and typography styles are generated from the `@beeq/core` style foundations, so they always match the BEEQ components. The preset is standalone: it has no runtime dependency on `@beeq/core`.

## Prerequisites 🧰

Before starting to use BEEQ TailwindCSS, you need to have installed:

- [TailwindCSS](https://tailwindcss.com/docs/installation)

With Tailwind CSS v3, make sure that the Tailwind CSS directives are added to your main CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Installation 📦

```bash
npm i -D @beeq/tailwindcss
```

## Usage 🚀

### Tailwind CSS v4

Load the preset with `@plugin` in your CSS entry file:

```css
@import "tailwindcss";
@plugin "@beeq/tailwindcss";
```

> Note: `@beeq/tailwindcss` 1.16.2 and earlier fail with `@plugin` (`b is not a function`). On those versions, use `@config "@beeq/tailwindcss";` instead.

> Note: If you also import `@beeq/core/dist/beeq/beeq.css`, import it into Tailwind's `base` layer: `@import "@beeq/core/dist/beeq/beeq.css" layer(base);`. `beeq.css` is unlayered, and unlayered styles override Tailwind CSS v4 utilities, so its reset would turn `mx-auto` into `margin: 0`.

> Note: For stroke widths, use `border-stroke-s`, `border-stroke-m`, and `border-stroke-l`. Tailwind CSS v4 also reads `border-s` and `border-l` as its own inline-start and left border utilities, so those classes add a `1px` side border on top of the BEEQ stroke width.

### Tailwind CSS v3

```js
const beeqPreset = require('@beeq/tailwindcss');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [beeqPreset],
  ...
}
```

or with TypeScript:

```ts
import { default as beeqPreset } from '@beeq/tailwindcss';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [beeqPreset],
  ...
}
```

## CSS reset 🧹

The preset includes an opinionated CSS reset, the same one `@beeq/core` ships in `beeq.css`. Most of its selectors use `:where()`, so they have zero specificity and your own styles override them. See the [full list of rules](https://www.beeq.design/getting-started/installation#css-reset).

To add your own reset rules on top, put them in Tailwind's `base` layer.

Tailwind CSS v4:

```css
@import "tailwindcss";
@plugin "@beeq/tailwindcss";
@layer base {
  /* Your CSS reset code */
}
```

Tailwind CSS v3:

```css
@tailwind base;
@layer base {
  /* Your CSS reset code */
}
@tailwind components;
@tailwind utilities;
```

## Fonts 🖋

The preset does not include the fonts by default, but you can add them in your CSS entry file or use your own custom fonts:

```css
/* BEEQ Outfit font */
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@100;300;400;600;700&display=swap");
/* ENDAVA Roboto */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
```

## Typography 📝

The preset includes a typography plugin that adds a set of default typography styles to your application. It is not enabled by default, so you need to add it to your `tailwind.config.js` file:

```js
const beeqPreset = require('@beeq/tailwindcss');
const { TYPOGRAPHY_DEFAULT } = require('@beeq/tailwindcss');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require('@beeq/tailwindcss')],
  ...
  plugins: [
    plugin(function ({ addBase }) {
      // Use the default typography styles
      addBase({ ...TYPOGRAPHY_DEFAULT });
    }),
  ],
}
```

or via TypeScript:

```ts
import plugin from "tailwindcss/plugin";
import { default as beeqPreset, TYPOGRAPHY_DEFAULT } from "@beeq/tailwindcss";
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [beeqPreset],
  theme: {},
  plugins: [
    plugin(function ({ addBase }) {
      // Use the default typography styles
      addBase({ ...TYPOGRAPHY_DEFAULT });
    }),
  ],
  corePlugins: {
    preflight: false,
  },
} satisfies Config;
```

> Note: you can always override this styles by adding your own CSS code to the `@base` layer of TailwindCSS.

## Complete example

[CodeSandbox](https://codesandbox.io/p/sandbox/beeq-tailwind-css-preset-swrtfk?file=%2Ftailwind.config.ts)

## Documentation 📙

Your can find more details about TailwindCSS presets in [the official documentation](https://tailwindcss.com/docs/presets).

## Maintaining the preset

The source of truth is `packages/beeq/src/global/styles/foundations/`: primitives, themes, shared tokens, reset and typography. After editing those SCSS files, run this from the repository root and commit the regenerated files with the source change:

```bash
pnpm exec nx run beeq-tailwindcss:generate
pnpm exec nx run beeq-tailwindcss:test --skip-nx-cache
```

Do not edit `src/generated/` by hand. The staleness test checks it against the SCSS, and utility mappings remain curated in TypeScript so adding a foundation token does not automatically add a utility. Sass and PostCSS are used only during generation, not by consumers of the published preset.

The SCSS-derived preset retains the existing exports, utility names and Tailwind v3/v4 entrypoints. Compared with the former hand-maintained values, its base styles intentionally align with the foundations:

- White and shadow colors use the SCSS spellings (`#fff` and `rgb()`).
- The reset uses logical properties for margins, sizing and subscript/superscript offsets. Hidden-state and reduced-motion rules carry `!important` to retain precedence inside Tailwind's base layer.
- Shared ring, disabled-opacity and interaction-state tokens are now emitted.
- `TYPOGRAPHY_DEFAULT` follows the SCSS selector groupings and adds a theme-scoped font-family rule. Inject it with `addBase` as shown above rather than relying on its internal selector keys.

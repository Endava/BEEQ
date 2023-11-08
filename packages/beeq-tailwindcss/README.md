# BEEQ TailwindCSS Preset

BEEQ TailwindCSS is a preset that adds BEEQ's opinionated TailwindCSS configuration to your application.

## Prerequisites 🧰

Before starting to use BEEQ TailwindCSS, you need to have installed:

- [TailwindCSS](https://tailwindcss.com/docs/installation)

Make sure that Tailwind CSS directives are added to your main CSS file:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Installation 📦

```bash
npm i -D @bee-q/tailwindcss
```

## Usage 🚀

```js
const beeqPreset = require('@bee-q/tailwindcss');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [beeqPreset],
  ...
}
```

or with TypeScript:

```ts
import { default as beeqPreset } from '@bee-q/tailwindcss';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [beeqPreset],
  ...
}
```

## CSS reset 🧹

The preset includes a CSS reset that removes all the default browser styles. If you want to use your own reset, you can add your own CSS reset code to the `@base` layer of TailwindCSS:

```css
@tailwind base;
@layer base {
  /* Your CSS reset code */
}
@tailwind components;
@tailwind utilities;
```

## Typography 📝

The preset includes a typography plugin that adds a set of default typography styles to your application. It is not enabled by default, so you need to add it to your `tailwind.config.js` file:

```js
const beeqPreset = require('@bee-q/tailwindcss');
const { TYPOGRAPHY_DEFAULT } = require('@bee-q/tailwindcss');

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require('@bee-q/tailwindcss')],
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
import { default as beeqPreset, TYPOGRAPHY_DEFAULT } from "@bee-q/tailwindcss";
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

[CodeSandbox](https://codesandbox.io/s/beeq-tailwindcss-preset-example-1x2x2?file=/tailwind.config.js)

## Documentation 📙

Your can find more details about TailwindCSS presets in [the official documentation](https://tailwindcss.com/docs/presets).

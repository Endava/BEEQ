# BEEQ TailwindCSS Preset

BEEQ TailwindCSS is a preset that adds BEEQ's opinionated TailwindCSS configuration to your application.

## Prerequisites 🧰

Before starting to use BEEQ TailwindCSS, you need to have installed:

- [@bee-q/core](../beeq/README.md)
- [TailwindCSS](https://tailwindcss.com/docs/installation)

Make sure that BEEQ main styles are added to your application's main style file before Tailwind CSS directives:

```css
@import "@bee-q/core/dist/bee-q/bee-q.css";

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
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require('@bee-q/tailwindcss')],
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

## Complete example

[CodeSandbox](https://codesandbox.io/s/beeq-tailwindcss-preset-example-1x2x2?file=/tailwind.config.js)

## Documentation 📙

Your can find more details about TailwindCSS presets in [the official documentation](https://tailwindcss.com/docs/presets).

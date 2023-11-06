# BEEQ TailwindCSS Preset

BEEQ TailwindCSS is a preset that adds BEEQ's opinionated TailwindCSS configuration to your application.

## Installation 📦

```bash
npm i -D @bee-q/tailwindcss
```

## Usage 🚀

```js
module.exports = {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  presets: [require('@bee-q/tailwindcss')],
  ...
}
```

or with TypeScript:

```ts
import { default as beeqPreset } from '@bee-q/tailwindcss';

export default {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
  ],
  presets: [beeqPreset],
  ...
}
```

## Documentation 📙
Your can find more details about TailwindCSS presets in [the official documentation](https://tailwindcss.com/docs/presets).

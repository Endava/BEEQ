# React Wrapper for BEEQ

A lightweight utility that wraps BEEQ custom elements ("web components") so they can be used like native React components.

## Why is this necessary?

React and custom elements don't play nicely together. The problem is best described by [Custom Elements Everywhere](https://custom-elements-everywhere.com/#react):

> **Handling data**
>
> React passes all data to Custom Elements in the form of HTML attributes. For primitive data this is fine, but the system breaks down when passing rich data, like objects or arrays. In these instances you end up with stringified values like some-attr="[object Object]" which can't actually be used.
>
> **Handling events**
>
> Because React implements its own synthetic event system, it cannot listen for DOM events coming from Custom Elements without the use of a workaround. Developers will need to reference their Custom Elements using a ref and manually attach event listeners with addEventListener. This makes working with Custom Elements cumbersome.

This utility solves these problems by exposing a native React component that maps properties and events to the underlying custom element. ✨

## Package installation

> [!TIP]
> Please always refer to the [official BEEQ documentation](https://www.beeq.design/3d466e231/p/359a26-for-developers/b/28e01f) for more information about the installation.

- install the package

```
npm install @beeq/{core,react}
```

> [!NOTE]
> Make sure that you have installed the `@beeq/core` package.

### Add BEEQ styles and assets

Import BEEQ styles into your application's main style file:

```css
@import "@beeq/core/dist/beeq/beeq.css";
```

> [!TIP]
> BEEQ uses SVG icons and these assets are shipped in a separate folder. You can use the `setBasePath` method to set the path to the icons. Make sure that your project bundle the icons in a way that they are accessible from the browser.

You can move the icons from the node_modules folder to your assets folder and set the path like this:

```js
// vite.config.js
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/@beeq/core/dist/beeq/svg/*',
          dest: 'icons/svg',
        },
        // add more targets if needed
      ],
    }),
  ],
  // other configurations
});
```

```js
// main.ts
import { setBasePath } from "@beeq/core/dist/components";

setBasePath('icons/svg');
```

> Please, notice the path 👆

But you can also use a different icons library or a CDN:

```js
import { setBasePath } from "@beeq/core/dist/components";

// Using heroicons library
setBasePath('https://cdn.jsdelivr.net/npm/heroicons@2.1.5/24/outline');
```

> [!CAUTION]
> When using a different icons library, make sure you use the correct icon names provided by the library or the CDN.

## Usage

```jsx
import React from 'react';
import { BqButton } from '@beeq/react';

function App() {
  const handleButtonClick = (ev: CustomEvent) => {
    console.log(ev.detail);
  };

  return (
    <BqButton appearance="primary" onBqClick={handleButtonClick}>
      Click Me
    </BqButton>
  );
}

export default App;
```

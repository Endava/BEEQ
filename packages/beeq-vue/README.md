# Vue.js Wrapper for BEEQ

A lightweight utility that wraps BEEQ custom elements ("web components") so they can be seamlessly integrated into Vue applications.

## Why is this necessary?

BEEQ can generate Vue component wrappers for your web components. This allows BEEQ components to be used within a Vue 3 application. The benefits of using BEEQ's component wrappers over the standard web components include:

- Type checking with your components.
- Integration with the router link and Vue router.
- Optionally, form control web components can be used with `v-model`.

(*Adapted from the [Stencil official documentation](https://stenciljs.com/docs/vue)*)

## Package installation

> [!TIP]
> Please always refer to the [official BEEQ documentation](https://www.beeq.design/3d466e231/p/359a26-for-developers/b/53475d) for more information about the installation.

- install the package

```
npm install @beeq/{core,vue}
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
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all BEEQ tags as custom elements
          isCustomElement: (tag) => tag.includes("bq-"),
        },
      },
    }),
    vueJsx(),
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/@beeq/core/dist/beeq/svg/*",
          dest: "assets/svg",
        },
        // other assets
      ],
    }),
  ],
  // other configurations
});
```

```js
// main.ts
import { setBasePath } from '@beeq/core';

setBasePath('icons/svg');
```

But you can also use a different icons library or a CDN:

```js
import { setBasePath } from '@beeq/core';

// Using heroicons library
setBasePath('https://cdn.jsdelivr.net/npm/heroicons@2.1.5/24/outline');
```

> [!CAUTION]
> When using a different icons library, make sure you use the correct icon names provided by the library or the CDN.

## Usage

```jsx
<script setup lang="ts">
const name = ref('John Doe');
</script>

<template>
  <h1>Hello {{ name }}</h1>
  <bq-input
    name="name"
    placeholder="Please type your name..."
    v-model="name"
    @bqClear="name = ''"
  >
    <label slot="label">Your name</label>
    <bq-icon name="user" slot="prefix"></bq-icon>
  </bq-input>
</template>
```

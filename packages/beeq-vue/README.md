# Vue.js Wrapper for BEEQ

A lightweight utility that wraps BEEQ custom elements ("web components") so they can be seamlessly integrated into Vue applications.

## Package installation

- install the package

```
npm install @bee-q/vue
```

- update the package

```
npm install @bee-q/vue@latest
```

if `@bee-q/core` package is installed you should update both

```
npm install @bee-q/{core,vue}
```

### Add BEEQ styles and assets

Make sure that BEEQ main style is imported into your application's main style file:

```css
@import "@bee-q/core/dist/bee-q/bee-q";
```

> ❗️The icons SVG are shipped in a separate folder. Depending on your stack, your project will need to include `node_modules/@bee-q/core/dist/bee-q/svg` in the build in such a way that it respond to: `http://<domain>/svg`

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

## Why is this necessary?

BEEQ can generate Vue component wrappers for your web components. This allows BEEQ components to be used within a Vue 3 application. The benefits of using BEEQ's component wrappers over the standard web components include:

- Type checking with your components.
- Integration with the router link and Vue router.
- Optionally, form control web components can be used with `v-model`.

(*Adapted from the [Stencil official documentation](https://stenciljs.com/docs/vue)*)

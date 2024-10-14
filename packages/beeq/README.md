# BEEQ, a web component library initiative

The elements and components provided by BEEQ are being implemented with [Stencil](https://stenciljs.com/), a compiler that generates Web Components (more specifically, Custom Elements), combining the best concepts of the most popular frameworks into a simple build-time tool. You can read more about Stencil on their [official ](https://stenciljs.com/)website.

## Installation

> [!TIP]
> Please always refer to the [official BEEQ documentation](https://www.beeq.design/3d466e231/p/359a26-for-developers) for more information about the installation.

BEEQ elements, components, patterns, utilities, etc., are available as an npm package.

```bash
$ npm i @beeq/core
```

## Usage

BEEQ components are regular HTML elements, or custom elements (often referred to as "web components"). If you're using a simple HTML page, you can use them like any other element.

```html
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/beeq.css" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/@beeq/core/dist/beeq/beeq.esm.js"></script>
  </head>
  <body>
    <bq-button>Click me!</bq-button>
  </body>
</html>
```

> [!CAUTION]
> The icons SVG are shipped in a separate folder. Projects will need to include `node_modules/@beeq/core/dist/beeq/svg` in their build and try to make it in a certain way that it respond to: `http://<domain>/svg`

### Events

You can listen for standard events such as click, mouseover, etc. as you normally would. Most of the BEEQ components emit custom events, we highly recommend the use of those instead. They work the same way as standard events but are prefixed with `bq` to prevent collisions with standard events and other libraries.

```html
<bq-checkbox>Checkbox label</bq-checkbox>

<script>
  const checkbox = document.querySelector('bq-checkbox');
  button.addEventListener('bqChange', (event) => {
    console.log('Is checked?', event.detail.checked);
  });
</script>
```

# Bee-Q, a web component library initiative

The elements and components provided by Bee-Q are being implemented with [Stencil](https://stenciljs.com/), a compiler that generates Web Components (more specifically, Custom Elements), combining the best concepts of the most popular frameworks into a simple build-time tool. You can read more about Stencil on their [official web site](https://stenciljs.com/).

## Installation

Bee-Q elements, components, patterns, utilities, etc., are available as an npm package.

### For `stable` releases

```bash
$ npm i @bee-q/core
```

### For `beta` releases

```bash
$ npm i @bee-q/core@beta
```

## Usage

Bee-Q components are regular HTML elements, or custom elements (often referred to as "web components"). If you're using a simple HTML page, you can use them like any other element.

```html
<html>
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@bee-q/core/dist/bee-q/bee-q.css" />
    <script type="module" src="https://cdn.jsdelivr.net/npm/@bee-q/core/dist/bee-q/bee-q.esm.js"></script>
  </head>
  <body>
    <bq-button>Click me!</bq-button>
  </body>
</html>
```

### Events

You can listen for standard events such as click, mouseover, etc. as you normally would. Most of the Bee-Q components emit custom events, we highly recommend the use of those instead. They work the same way as standard events but are prefixed with `bq` to prevent collisions with standard events and other libraries.

```html
<bq-checkbox>Checkbox label</bq-checkbox>

<script>
  const checkbox = document.querySelector('bq-checkbox');
  button.addEventListener('bqChange', (event) => {
    console.log('Is checked?', event.detail.checked);
  });
</script>
```
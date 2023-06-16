# bq-dialog



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description              | Type                             | Default      |
| ----------------- | ------------------ | ------------------------ | -------------------------------- | ------------ |
| `footerApperance` | `footer-apperance` | The appearance of footer | `"highlight" \| "standard"`      | `'standard'` |
| `size`            | `size`             | The size of the dialog   | `"large" \| "medium" \| "small"` | `'medium'`   |


## Methods

### `close() => Promise<void>`

Hides  the dialog

#### Returns

Type: `Promise<void>`



### `open() => Promise<void>`

Shows the dialog

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `"base"`         | The component wrapper container inside the shadow DOM |
| `"button-close"` | The button that close the dialog on click             |
| `"container"`    | The `<div>` container that holds the dialog content   |
| `"footer"`       | The `<footer>` that holds footer content              |


## Dependencies

### Depends on

- [bq-button](../button)
- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-dialog --> bq-button
  bq-dialog --> bq-icon
  bq-button --> bq-icon
  style bq-dialog fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

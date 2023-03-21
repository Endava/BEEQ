# bq-dialog



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                             | Type                             | Default      |
| --------- | --------- | ------------------------------------------------------- | -------------------------------- | ------------ |
| `size`    | `size`    | The size of the dialog                                  | `"large" \| "medium" \| "small"` | `'large'`    |
| `variant` | `variant` | The variant of button to apply on top of the appearance | `"light" \| "standard"`          | `'standard'` |


## Methods

### `close() => Promise<void>`



#### Returns

Type: `Promise<void>`



### `open() => Promise<void>`

Method to be called to open the dialog

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"button-close"` |             |
| `"icon-close"`   |             |


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

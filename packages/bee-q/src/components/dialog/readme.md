# bq-dialog



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description            | Type                             | Default    |
| -------- | --------- | ---------------------- | -------------------------------- | ---------- |
| `isOpen` | `is-open` |                        | `boolean`                        | `false`    |
| `size`   | `size`    | The size of the dialog | `"large" \| "medium" \| "small"` | `'medium'` |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"icon-on"` |             |


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

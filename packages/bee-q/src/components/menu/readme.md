# bq-menu



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description               | Type                  | Default    |
| ------------- | ------------- | ------------------------- | --------------------- | ---------- |
| `collapsible` | `collapsible` | Toggle menu               | `boolean`             | `true`     |
| `size`        | `size`        | The size of the menu item | `"medium" \| "small"` | `'medium'` |
| `theme`       | `theme`       |                           | `"dark" \| "light"`   | `'light'`  |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"content"` |             |
| `"group"`   |             |
| `"header"`  |             |


## Dependencies

### Depends on

- [bq-icon](../icon)
- [bq-button](../button)

### Graph
```mermaid
graph TD;
  bq-menu --> bq-icon
  bq-menu --> bq-button
  bq-button --> bq-icon
  style bq-menu fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

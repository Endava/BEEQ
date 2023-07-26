# bq-accordion



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description | Type                  | Default    |
| ------------ | ------------ | ----------- | --------------------- | ---------- |
| `appearance` | `appearance` |             | `"filled" \| "ghost"` | `'filled'` |
| `expanded`   | `expanded`   |             | `boolean`             | `false`    |
| `size`       | `size`       |             | `"medium" \| "small"` | `'medium'` |


## Shadow Parts

| Part       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `"base"`   | The `<details>` that holds the accordion content        |
| `"header"` | The `<summary>` that holds the accordion header content |
| `"text"`   | The `<span>` that holds the accordion header text       |


## Dependencies

### Depends on

- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-accordion --> bq-icon
  style bq-accordion fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

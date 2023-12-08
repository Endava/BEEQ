# bq-accordion



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute    | Description                                                  | Type                  | Default    |
| ------------ | ------------ | ------------------------------------------------------------ | --------------------- | ---------- |
| `appearance` | `appearance` | The appearance style of accordion                            | `"filled" \| "ghost"` | `'filled'` |
| `disabled`   | `disabled`   | If true accordion is disabled                                | `boolean`             | `false`    |
| `expanded`   | `expanded`   | If true accordion is expanded                                | `boolean`             | `false`    |
| `rotate`     | `rotate`     | If true accordion expand icon is rotate 180deg when expanded | `boolean`             | `false`    |
| `size`       | `size`       | The size of accordion                                        | `"medium" \| "small"` | `'medium'` |


## Events

| Event     | Description                                         | Type                                  |
| --------- | --------------------------------------------------- | ------------------------------------- |
| `bqBlur`  | Handler to be called when the accordion loses focus | `CustomEvent<HTMLBqAccordionElement>` |
| `bqClick` | Handler to be called when the accordion is clicked  | `CustomEvent<HTMLBqAccordionElement>` |
| `bqFocus` | Handler to be called when the accordion gets focus  | `CustomEvent<HTMLBqAccordionElement>` |


## Shadow Parts

| Part       | Description                                                    |
| ---------- | -------------------------------------------------------------- |
| `"base"`   | The `<details>` that holds the accordion content               |
| `"header"` | The `<summary>` that holds the accordion header content        |
| `"panel"`  | The `<div>` that holds the accordion panel content             |
| `"prefix"` | The `<div>` that holds the accordion text prefix icon / avatar |
| `"suffix"` | The `<div>` that holds the accordion text suffix icon          |
| `"text"`   | The `<div>` that holds the accordion header text               |


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

# bq-alert



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                            | Type                                                      | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| `disableClose` | `disable-close` | If true, the close button at the top right of the alert won't be shown | `boolean`                                                 | `undefined` |
| `hideIcon`     | `hide-icon`     | If true, the alert icon won't be shown                                 | `boolean`                                                 | `undefined` |
| `open`         | `open`          | If true, the alert will be shown                                       | `boolean`                                                 | `undefined` |
| `type`         | `type`          | Type of Alert                                                          | `"custom" \| "error" \| "info" \| "success" \| "warning"` | `'info'`    |


## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"btn-close"`    |             |
| `"content"`      |             |
| `"icon"`         |             |
| `"icon-outline"` |             |
| `"main"`         |             |
| `"title"`        |             |
| `"wrapper"`      |             |


## Dependencies

### Depends on

- [bq-button](../button)
- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-alert --> bq-button
  bq-alert --> bq-icon
  bq-button --> bq-icon
  style bq-alert fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

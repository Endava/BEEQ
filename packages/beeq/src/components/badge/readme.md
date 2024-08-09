# bq-badge



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                                                    | Type                               | Default           |
| ----------------- | ------------------ | ------------------------------------------------------------------------------ | ---------------------------------- | ----------------- |
| `backgroundColor` | `background-color` | Badge background color. The value should be a valid value of the palette color | `string \| undefined`              | `'ui--danger'`    |
| `size`            | `size`             | The size of the badge. Relevant if badge has no content.                       | `"medium" \| "small" \| undefined` | `'small'`         |
| `textColor`       | `text-color`       | Badge number color. The value should be a valid value of the palette color     | `string \| undefined`              | `'text--inverse'` |


## Shadow Parts

| Part       | Description                                            |
| ---------- | ------------------------------------------------------ |
| `"base"`   | The component's internal wrapper that holds the count. |
| `"number"` | The component's internal wrapper that holds the slot.  |


## Dependencies

### Used by

 - [bq-status](../status)

### Graph
```mermaid
graph TD;
  bq-status --> bq-badge
  style bq-badge fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

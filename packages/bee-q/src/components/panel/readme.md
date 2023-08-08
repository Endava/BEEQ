# bq-panel



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                           | Type                                                                                                                                                                 | Default          |
| ----------- | ------------ | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `distance`  | `distance`   | Represents the distance (gutter or margin) between the panel and the trigger element. | `number`                                                                                                                                                             | `4`              |
| `open`      | `open`       | If true, the panel will be visible.                                                   | `boolean`                                                                                                                                                            | `false`          |
| `placement` | `placement`  | Position of the panel                                                                 | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom-start'` |
| `sameWidth` | `same-width` | Whether the panel should have the same width as the trigger element                   | `boolean`                                                                                                                                                            | `false`          |
| `skidding`  | `skidding`   | Represents the skidding between the panel and the trigger element.                    | `number`                                                                                                                                                             | `0`              |
| `strategy`  | `strategy`   | Defines the strategy to position the panel                                            | `"absolute" \| "fixed"`                                                                                                                                              | `'fixed'`        |


## Shadow Parts

| Part     | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `"base"` | The `div` element which acts as a container for the panel content |


## Dependencies

### Used by

 - [bq-dropdown](../dropdown)

### Graph
```mermaid
graph TD;
  bq-dropdown --> bq-panel
  style bq-panel fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

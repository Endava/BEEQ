# bq-dropdown



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute             | Description                                                                           | Type                                                                                                                                                                 | Default          |
| ------------------ | --------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `distance`         | `distance`            | Represents the distance (gutter or margin) between the panel and the trigger element. | `number`                                                                                                                                                             | `4`              |
| `keepOpenOnSelect` | `keep-open-on-select` | If true, the panel will remain open after a selection is made.                        | `boolean`                                                                                                                                                            | `false`          |
| `open`             | `open`                | If true, the panel will be visible.                                                   | `boolean`                                                                                                                                                            | `false`          |
| `panelHeight`      | `panel-height`        | When set, it will override the height of the dropdown panel                           | `string`                                                                                                                                                             | `undefined`      |
| `placement`        | `placement`           | Position of the panel                                                                 | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom-start'` |
| `sameWidth`        | `same-width`          | Whether the panel should have the same width as the trigger element                   | `boolean`                                                                                                                                                            | `false`          |
| `skidding`         | `skidding`            | Represents the skidding between the panel and the trigger element.                    | `number`                                                                                                                                                             | `0`              |
| `strategy`         | `strategy`            | Defines the strategy to position the panel                                            | `"absolute" \| "fixed"`                                                                                                                                              | `'fixed'`        |
| `triggerElement`   | --                    | The trigger element for the panel                                                     | `HTMLElement`                                                                                                                                                        | `undefined`      |


## Shadow Parts

| Part         | Description                                                    |
| ------------ | -------------------------------------------------------------- |
| `"base"`     | The component's internal wrapper.                              |
| `"dropdown"` | The `div` element used to display the panel element (bq-panel) |
| `"trigger"`  | The `div` element used to display the trigger element          |


## Dependencies

### Depends on

- [bq-panel](../panel)

### Graph
```mermaid
graph TD;
  bq-dropdown --> bq-panel
  style bq-dropdown fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

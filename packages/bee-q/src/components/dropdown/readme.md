# bq-dropdown



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                                                      | Type                                                                                                                                                                 | Default    |
| ---------------- | ----------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `panelDistance`  | `panel-distance`  | Distance between the panel and the trigger element.                              | `number`                                                                                                                                                             | `0`        |
| `panelOpen`      | `panel-open`      | If true, panel is visible. You can toggle this attribute to show/hide the panel. | `boolean`                                                                                                                                                            | `false`    |
| `panelPlacement` | `panel-placement` | Position of the panel                                                            | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom'` |
| `panelScrollbar` | `panel-scrollbar` | Determines whether the scrollbar is visible or hidden within the panel.          | `boolean`                                                                                                                                                            | `false`    |


## Events

| Event           | Description                                                                       | Type                                |
| --------------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| `bqPanelChange` | Handler to be called to check if the `bq-panel` switches states (visible/hidden). | `CustomEvent<{ opened: boolean; }>` |


## Shadow Parts

| Part        | Description                                                    |
| ----------- | -------------------------------------------------------------- |
| `"base"`    | The component's internal wrapper.                              |
| `"panel"`   | The `div` element used to display the panel element (bq-panel) |
| `"trigger"` | The `div` element used to display the trigger element          |


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

# bq-icon

<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                             | Type                                                              | Default     |
| -------- | --------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| `color`  | `color`   | Set the stroke color of the SVG. The value should be a valid value of the palette color | `string`                                                          | `undefined` |
| `name`   | `name`    | Icon name to load. Please check all available icons [here](https://phosphoricons.com/)  | `string`                                                          | `undefined` |
| `size`   | `size`    | Set the size of the SVG                                                                 | `number \| string`                                                | `24`        |
| `weight` | `weight`  | It set the icon weight/style                                                            | `"bold" \| "duotone" \| "fill" \| "light" \| "regular" \| "thin"` | `'regular'` |


## Shadow Parts

| Part     | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `"base"` | The component's internal wrapper that holds the icon SVG content. |
| `"svg"`  | The `<svg>` tag element inside the component.                     |


## Dependencies

### Used by

 - [bq-button](../button)

### Graph
```mermaid
graph TD;
  bq-button --> bq-icon
  style bq-icon fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

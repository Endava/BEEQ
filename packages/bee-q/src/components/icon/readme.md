# bq-icon

<!-- Auto Generated Below -->


## Overview

Icons are simplified images that graphically explain the meaning of an object on the screen.

## Properties

| Property            | Attribute | Description                                                                             | Type                                                              | Default     |
| ------------------- | --------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| `color`             | `color`   | Set the stroke color of the SVG. The value should be a valid value of the palette color | `string`                                                          | `undefined` |
| `name` _(required)_ | `name`    | Icon name to load. Please check all available icons [here](https://phosphoricons.com/)  | `string`                                                          | `undefined` |
| `size`              | `size`    | Set the size of the SVG                                                                 | `number \| string`                                                | `24`        |
| `weight`            | `weight`  | It set the icon weight/style                                                            | `"bold" \| "duotone" \| "fill" \| "light" \| "regular" \| "thin"` | `'regular'` |


## Events

| Event       | Description                                           | Type               |
| ----------- | ----------------------------------------------------- | ------------------ |
| `svgLoaded` | Callback handler to be called when the SVG has loaded | `CustomEvent<any>` |


## Shadow Parts

| Part     | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `"base"` | The component's internal wrapper that holds the icon SVG content. |
| `"svg"`  | The `<svg>` tag element inside the component.                     |


## Dependencies

### Used by

 - [bq-breadcrumb-item](../breadcrumb-item)
 - [bq-button](../button)
 - [bq-dialog](../dialog)
 - [bq-notification](../notification)
 - [bq-switch](../switch)
 - [bq-toast](../toast)

### Graph
```mermaid
graph TD;
  bq-breadcrumb-item --> bq-icon
  bq-button --> bq-icon
  bq-dialog --> bq-icon
  bq-notification --> bq-icon
  bq-switch --> bq-icon
  bq-toast --> bq-icon
  style bq-icon fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# bq-icon

<!-- Auto Generated Below -->


## Overview

The Icon component is an image that provides a visual representation of an object, action, or concept displayed on the screen.
It is a small graphical element that is used to enhance the user interface and improve user experience.

## Properties

| Property | Attribute | Description                                                                             | Type                                                              | Default     |
| -------- | --------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- |
| `color`  | `color`   | Set the stroke color of the SVG. The value should be a valid value of the palette color | `string`                                                          | `undefined` |
| `label`  | `label`   | Label for the icon, used for accessibility                                              | `string`                                                          | `undefined` |
| `name`   | `name`    | Icon name to load. Please check all available icons [here](https://phosphoricons.com/)  | `string`                                                          | `undefined` |
| `size`   | `size`    | Set the size of the SVG                                                                 | `number \| string`                                                | `24`        |
| `src`    | `src`     | Set the source of the SVG. If the source is set, the name property will be ignored      | `string`                                                          | `undefined` |
| `weight` | `weight`  | <span style="color:red">**[DEPRECATED]**</span> It set the icon weight/style<br/><br/>  | `"bold" \| "duotone" \| "fill" \| "light" \| "regular" \| "thin"` | `undefined` |


## Events

| Event       | Description                                           | Type               |
| ----------- | ----------------------------------------------------- | ------------------ |
| `svgLoaded` | Callback handler to be called when the SVG has loaded | `CustomEvent<any>` |


## Shadow Parts

| Part     | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `"base"` | The component's internal wrapper that holds the icon SVG content. |
| `"svg"`  | The `<svg>` tag element inside the component.                     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# bq-divider

<!-- Auto Generated Below -->


## Overview

The Divider component is used to visually separate content in a layout.

## Properties

| Property          | Attribute           | Description                                                                                      | Type                            | Default             |
| ----------------- | ------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------- | ------------------- |
| `dashed`          | `dashed`            | If true, the divider has a dashed pattern                                                        | `boolean`                       | `false`             |
| `orientation`     | `orientation`       | The default orientation of the divider                                                           | `"horizontal" \| "vertical"`    | `'horizontal'`      |
| `strokeBasis`     | `stroke-basis`      | Set the min width of the divider's stroke when text is not centered. Value expressed in px       | `number`                        | `0`                 |
| `strokeColor`     | `stroke-color`      | Set the stroke color of the divider. The value should be a valid value of the palette color      | `string`                        | `'stroke--primary'` |
| `strokeDashGap`   | `stroke-dash-gap`   | Set the gap of the divider's stroke. This is applicable when the stroke is dashed                | `number`                        | `7`                 |
| `strokeDashWidth` | `stroke-dash-width` | Set the width of each dash of the divider's stroke. This is applicable when the stroke is dashed | `number`                        | `12`                |
| `strokeLinecap`   | `stroke-linecap`    | Set the line of the divider's stroke. This is applicable when the stroke is dashed               | `"butt" \| "round" \| "square"` | `'butt'`            |
| `strokeThickness` | `stroke-thickness`  | Set the thickness of the divider's stroke. Value expressed in px                                 | `number`                        | `1`                 |
| `titleAlignment`  | `title-alignment`   | Set the alignment of the title on the main axis of the divider (horizontal / vertical)           | `"end" \| "middle" \| "start"`  | `'middle'`          |


## Slots

| Slot | Description                       |
| ---- | --------------------------------- |
|      | The title content of the divider. |


## Shadow Parts

| Part                | Description                                                                      |
| ------------------- | -------------------------------------------------------------------------------- |
| `"base"`            | The component's internal wrapper.                                                |
| `"dash-end"`        | The component's internal svg wrapper for the end line of the divider's stroke.   |
| `"dash-end-line"`   | The component's internal line component of the divider's stroke.                 |
| `"dash-start"`      | The component's internal svg wrapper for the start line of the divider's stroke. |
| `"dash-start-line"` | The component's internal line component of the divider's stroke.                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

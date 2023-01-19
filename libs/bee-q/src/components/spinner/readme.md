# bq-spinner



<!-- Auto Generated Below -->


## Overview

Spinners are designed for users to display data loading.

## Properties

| Property       | Attribute       | Description                                                   | Type                                                 | Default    |
| -------------- | --------------- | ------------------------------------------------------------- | ---------------------------------------------------- | ---------- |
| `animation`    | `animation`     | If `false`, the animation on the icon element will be stopped | `boolean`                                            | `true`     |
| `size`         | `size`          | It defines the size of the icon element displayed             | `"large" \| "medium" \| "small"`                     | `'medium'` |
| `textPosition` | `text-position` | It defines the position of the label text                     | `"above" \| "bellow" \| "left" \| "none" \| "right"` | `'none'`   |


## Shadow Parts

| Part            | Description                                                      |
| --------------- | ---------------------------------------------------------------- |
| `"base"`        | The HTML spinner used under the hood.                            |
| `"custom-icon"` | The `<span>` tag element that acts as custom icon container.     |
| `"icon"`        | The `<svg>` tag element that acts as loader element.             |
| `"text"`        | The `<span>` tag element that renderd text inside the component. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

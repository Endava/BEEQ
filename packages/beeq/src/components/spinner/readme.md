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


## Slots

| Slot     | Description                           |
| -------- | ------------------------------------- |
|          | The content of the spinner component. |
| `"icon"` | The icon slot container.              |


## Shadow Parts

| Part            | Description                                                                |
| --------------- | -------------------------------------------------------------------------- |
| `"base"`        | The div wrapper container used under the hood.                             |
| `"custom-icon"` | The `<span>` tag element that holds the custom icon element passed.        |
| `"icon"`        | The `<svg>` icon element used to spin/animate.                             |
| `"text"`        | The `<span>` tag element that renders the label text inside the component. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

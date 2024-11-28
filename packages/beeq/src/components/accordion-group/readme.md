# bq-accordion-group



<!-- Auto Generated Below -->


## Overview

The accordion group component is a container for multiple accordion elements.
It allows to manage the appearance and size of all accordions at once.

## Properties

| Property      | Attribute      | Description                                                                                                                                                     | Type                  | Default     |
| ------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `appearance`  | `appearance`   | The appearance style of accordion to be applied to all accordions                                                                                               | `"filled" \| "ghost"` | `'filled'`  |
| `expandAll`   | `expand-all`   | If true all accordions are expanded                                                                                                                             | `boolean`             | `undefined` |
| `multiple`    | `multiple`     | If true multiple accordions can be expanded at the same time                                                                                                    | `boolean`             | `false`     |
| `noAnimation` | `no-animation` | Animation is set through JS when the browser does not support CSS calc-size() If true, the accordion animation, will be disabled. No animation will be applied. | `boolean`             | `false`     |
| `size`        | `size`         | The size of accordion to be applied to all accordions                                                                                                           | `"medium" \| "small"` | `'medium'`  |


## Slots

| Slot | Description                                                  |
| ---- | ------------------------------------------------------------ |
|      | The default slot where the bq-accordion elements are placed. |


## Shadow Parts

| Part     | Description                   |
| -------- | ----------------------------- |
| `"base"` | The component's base wrapper. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

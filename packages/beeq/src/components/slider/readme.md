# bq-slider2



<!-- Auto Generated Below -->


## Overview

Sliders provide a visual representation of adjustable content, enabling users to change values by dragging a handle along a horizontal track.

## Properties

| Property               | Attribute                | Description                                                                                                                                                                                                                                             | Type                           | Default     |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ----------- |
| `debounceTime`         | `debounce-time`          | The amount of time, in milliseconds, to wait to trigger the `bqChange` event after each value change.                                                                                                                                                   | `number`                       | `0`         |
| `disabled`             | `disabled`               | If `true` the slider is disabled.                                                                                                                                                                                                                       | `boolean`                      | `false`     |
| `enableTooltip`        | `enable-tooltip`         | If `true`, a tooltip will be shown displaying the progress value                                                                                                                                                                                        | `boolean`                      | `false`     |
| `enableValueIndicator` | `enable-value-indicator` | If `true` it will show the value label on a side of the slider track area                                                                                                                                                                               | `boolean`                      | `false`     |
| `gap`                  | `gap`                    | A number representing the amount to remain between the minimum and maximum values (only for range type).                                                                                                                                                | `number`                       | `0`         |
| `max`                  | `max`                    | A number representing the max value of the slider.                                                                                                                                                                                                      | `number`                       | `100`       |
| `min`                  | `min`                    | A number representing the min value of the slider.                                                                                                                                                                                                      | `number`                       | `0`         |
| `name`                 | `name`                   | Name of the form control. Submitted with the form as part of a name/value pair                                                                                                                                                                          | `string`                       | `undefined` |
| `step`                 | `step`                   | A number representing the step of the slider. ⚠️ Please notice that the value (or list of values if the slider type is `range`) will be rounded to the nearest multiple of `step`.                                                                      | `number`                       | `1`         |
| `tooltipAlwaysVisible` | `tooltip-always-visible` | If `true`, a tooltip will always display the progress value. It relies on enableTooltip and if enableTooltip is false, tooltipAlwaysVisible cannot be true.                                                                                             | `boolean`                      | `false`     |
| `type`                 | `type`                   | It defines the type of slider to display                                                                                                                                                                                                                | `"range" \| "single"`          | `'single'`  |
| `value`                | `value`                  | The value of the slider. - If the slider type is `single`, the value is a number. - If the slider type is `range`, the value is an array of two numbers (the first number represents the `min` value and the second number represents the `max` value). | `number \| number[] \| string` | `undefined` |


## Events

| Event      | Description                                                | Type                                                                   |
| ---------- | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| `bqBlur`   | Handler to be called when the slider loses focus           | `CustomEvent<HTMLBqSliderElement>`                                     |
| `bqChange` | Handler to be called when change the value on range inputs | `CustomEvent<{ value: number \| number[]; el: HTMLBqSliderElement; }>` |
| `bqFocus`  | Handler to be called when the slider gets focused          | `CustomEvent<HTMLBqSliderElement>`                                     |


## Shadow Parts

| Part              | Description                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `"base"`          | The component's base wrapper.                                                                                          |
| `"container"`     | The container of the slider.                                                                                           |
| `"input-max"`     | The input element for the maximum value.                                                                               |
| `"input-min"`     | The input element for the value when the slider type is `single` or the minimum value when the slider type is `range`. |
| `"label-end"`     | The label for maximum value when the slider type is `range`.                                                           |
| `"label-start"`   | The label for the value when the slider type is `single` or the minimum value when the slider type is `range`.         |
| `"progress-area"` | The progress area of the slider.                                                                                       |
| `"track-area"`    | The track area of the slider.                                                                                          |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

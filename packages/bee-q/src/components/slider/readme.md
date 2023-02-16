# bq-slider



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute         | Description                                                                     | Type                           | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------------------- | ------------------------------ | ----------- |
| `debounceTime`   | `debounce-time`   | A number representing the delay value applied to bqChange event handler         | `number`                       | `0`         |
| `disabled`       | `disabled`        | If `true` slider is disabled                                                    | `boolean`                      | `false`     |
| `gap`            | `gap`             | A number representing the minimum value between the min and max range selected. | `number`                       | `0`         |
| `max`            | `max`             | A number representing the max value of the slider.                              | `number`                       | `0`         |
| `min`            | `min`             | A number representing the min value of the slider.                              | `number`                       | `0`         |
| `step`           | `step`            | A number representing the step of the slider.                                   | `number`                       | `1`         |
| `type`           | `type`            | It defines the type of slider to display                                        | `"range" \| "single"`          | `'single'`  |
| `value`          | `value`           | A number representing the value of the slider.                                  | `number \| number[] \| string` | `undefined` |
| `valueIndicator` | `value-indicator` | If `true` it will display the min and max values                                | `boolean`                      | `false`     |


## Events

| Event      | Description                                                | Type                                                                             |
| ---------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `bqBlur`   | Handler to be called when the slider loses focus           | `CustomEvent<HTMLBqSliderElement>`                                               |
| `bqChange` | Handler to be called when change the value on range inputs | `CustomEvent<{ value: string \| number \| number[]; el: HTMLBqSliderElement; }>` |
| `bqFocus`  | Handler to be called when the slider gets focused          | `CustomEvent<HTMLBqSliderElement>`                                               |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

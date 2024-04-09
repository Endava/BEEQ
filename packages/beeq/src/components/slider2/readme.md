# bq-slider2



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                                             | Type                                   | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `debounceTime` | `debounce-time` | The amount of time, in milliseconds, to wait to trigger the `bqChange` event after each value change.                                                                                                                                                   | `number`                               | `0`         |
| `gap`          | `gap`           | A number representing the amount to remain between the minimum and maximum values (only for range type).                                                                                                                                                | `number`                               | `0`         |
| `max`          | `max`           | A number representing the max value of the slider.                                                                                                                                                                                                      | `number`                               | `100`       |
| `min`          | `min`           | A number representing the min value of the slider.                                                                                                                                                                                                      | `number`                               | `0`         |
| `step`         | `step`          | A number representing the step of the slider. ⚠️ Please notice that the value (or list of values if the slider type is `range`) will be rounded to the nearest multiple of `step`.                                                                      | `number`                               | `1`         |
| `type`         | `type`          | It defines the type of slider to display                                                                                                                                                                                                                | `"range" \| "single"`                  | `'single'`  |
| `value`        | `value`         | The value of the slider. - If the slider type is `single`, the value is a number. - If the slider type is `range`, the value is an array of two numbers (the first number represents the `min` value and the second number represents the `max` value). | `[number, number] \| number \| string` | `undefined` |


## Events

| Event      | Description                                                | Type                                                                              |
| ---------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `bqChange` | Handler to be called when change the value on range inputs | `CustomEvent<{ value: string \| number \| number[]; el: HTMLBqSlider2Element; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

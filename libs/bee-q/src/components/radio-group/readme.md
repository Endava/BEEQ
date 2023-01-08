# bq-radio-group



<!-- Auto Generated Below -->


## Properties

| Property            | Attribute       | Description                                                                                                               | Type                         | Default      |
| ------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `debounceTime`      | `debounce-time` | A number representing the delay time (in milliseconds) that `bqChange` event handler gets triggered once the value change | `number`                     | `0`          |
| `disabled`          | `disabled`      | If true radio inputs are disabled                                                                                         | `boolean`                    | `false`      |
| `fieldset`          | `fieldset`      | If true displays fieldset                                                                                                 | `boolean`                    | `false`      |
| `name` _(required)_ | `name`          | Name of the HTML input form control. Submitted with the form as part of a name/value pair.                                | `string`                     | `undefined`  |
| `orientation`       | `orientation`   | The display orientation of the radio inputs                                                                               | `"horizontal" \| "vertical"` | `'vertical'` |
| `value`             | `value`         | A string representing the value of the radio.                                                                             | `string`                     | `undefined`  |


## Events

| Event      | Description                                       | Type                                                          |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `bqChange` | Handler to be called when the radio state changes | `CustomEvent<{ value: string; target: HTMLBqRadioElement; }>` |


## Shadow Parts

| Part      | Description                                               |
| --------- | --------------------------------------------------------- |
| `"base"`  | The component's internal wrapper of the radio components. |
| `"group"` | The `<div>` element that holds the radio inputs.          |
| `"label"` | The `<legend>` element that holds the text content.       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

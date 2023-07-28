# bq-textarea



<!-- Auto Generated Below -->


## Properties

| Property                   | Attribute           | Description                                                                                                                                                         | Type                                          | Default     |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| `autoGrow`                 | `auto-grow`         | If `true`, the textarea will automatically grow and shrink to fit its contents. If `false`, the textarea will have a fixed height specified by the `rows` property. | `boolean`                                     | `false`     |
| `debounceTime`             | `debounce-time`     | The amount of time, in milliseconds, to wait before emitting the `bqInput` event after the textarea value changes. A value of 0 means no debouncing will occur.     | `number`                                      | `0`         |
| `disabled`                 | `disabled`          | If `true`, the user cannot interact with the textarea.                                                                                                              | `boolean`                                     | `false`     |
| `maxlength`                | `maxlength`         | The maximum number of characters that can be entered into the textarea (`0`: no limit). When enabled, a character counter will be shown underneath the textarea.    | `number`                                      | `undefined` |
| `name` _(required)_        | `name`              | The name of the textarea element.                                                                                                                                   | `string`                                      | `undefined` |
| `placeholder` _(required)_ | `placeholder`       | The placeholder text to show when there is no value.                                                                                                                | `string`                                      | `undefined` |
| `rows`                     | `rows`              | The number of visible text lines for the control. It must be a positive integer.                                                                                    | `number`                                      | `5`         |
| `validationStatus`         | `validation-status` | The validation status of the input.                                                                                                                                 | `"error" \| "none" \| "success" \| "warning"` | `'none'`    |
| `value`                    | `value`             | The value of the textarea. It can be used to reset the input to a previous value.                                                                                   | `string`                                      | `undefined` |


## Events

| Event      | Description                                                                                                                                                                                                                                | Type                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `bqBlur`   | Callback handler emitted when the textarea loses focus                                                                                                                                                                                     | `CustomEvent<HTMLBqTextareaElement>`                                               |
| `bqChange` | Callback handler emitted when the textarea value has changed and the textarea loses focus. This handler is called whenever the user finishes typing or pasting text into the textarea field and then clicks outside of the textarea field. | `CustomEvent<{ value: string \| number \| string[]; el: HTMLBqTextareaElement; }>` |
| `bqClear`  | Callback handler emitted when the textarea value has been cleared                                                                                                                                                                          | `CustomEvent<HTMLBqTextareaElement>`                                               |
| `bqFocus`  | Callback handler emitted when the textarea has received focus                                                                                                                                                                              | `CustomEvent<HTMLBqTextareaElement>`                                               |
| `bqInput`  | Callback handler emitted when the textarea value changes. This handler is called whenever the user types or pastes text into the textarea field.                                                                                           | `CustomEvent<{ value: string \| number \| string[]; el: HTMLBqTextareaElement; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

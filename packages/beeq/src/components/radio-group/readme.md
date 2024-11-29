# bq-radio-group



<!-- Auto Generated Below -->


## Overview

The radio group is a user interface component that groups radio buttons to enable a single selection within the group.

## Properties

| Property                    | Attribute                     | Description                                                                                                               | Type                         | Default      |
| --------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------ |
| `backgroundOnHover`         | `background-on-hover`         | If true, all radio inputs in the group will display a background on hover                                                 | `boolean`                    | `false`      |
| `debounceTime`              | `debounce-time`               | A number representing the delay time (in milliseconds) that `bqChange` event handler gets triggered once the value change | `number`                     | `0`          |
| `disabled`                  | `disabled`                    | If true radio inputs are disabled                                                                                         | `boolean`                    | `false`      |
| `fieldset`                  | `fieldset`                    | If true displays fieldset                                                                                                 | `boolean`                    | `false`      |
| `name` _(required)_         | `name`                        | Name of the HTML input form control. Submitted with the form as part of a name/value pair.                                | `string`                     | `undefined`  |
| `orientation`               | `orientation`                 | The display orientation of the radio inputs                                                                               | `"horizontal" \| "vertical"` | `'vertical'` |
| `required`                  | `required`                    | If true, the radio group is required                                                                                      | `boolean`                    | `false`      |
| `requiredValidationMessage` | `required-validation-message` | The native form validation message when the radio group is required                                                       | `string`                     | `undefined`  |
| `value`                     | `value`                       | A string representing the value of the radio.                                                                             | `string`                     | `undefined`  |


## Events

| Event      | Description                                       | Type                                                          |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------- |
| `bqChange` | Handler to be called when the radio state changes | `CustomEvent<{ value: string; target: HTMLBqRadioElement; }>` |


## Slots

| Slot      | Description                      |
| --------- | -------------------------------- |
|           | The bq-radio items to group      |
| `"label"` | The label content of radio group |


## Shadow Parts

| Part      | Description                                               |
| --------- | --------------------------------------------------------- |
| `"base"`  | The component's internal wrapper of the radio components. |
| `"group"` | The `<div>` element that holds the radio inputs.          |
| `"label"` | The `<legend>` element that holds the text content.       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

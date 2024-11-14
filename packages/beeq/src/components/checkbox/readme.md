# bq-avatar



<!-- Auto Generated Below -->


## Overview

The checkbox is a UI component that allows users to select one or more options from a list of choices.
It is commonly used in forms, surveys, and settings pages.

## Properties

| Property                | Attribute                 | Description                                                                                                                            | Type      | Default     |
| ----------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `backgroundOnHover`     | `background-on-hover`     | If true checkbox displays background on hover                                                                                          | `boolean` | `false`     |
| `checked`               | `checked`                 | If true checkbox is checked                                                                                                            | `boolean` | `undefined` |
| `disabled`              | `disabled`                | If true checkbox is disabled                                                                                                           | `boolean` | `false`     |
| `formId`                | `form-id`                 | The form ID that the checkbox is associated with                                                                                       | `string`  | `undefined` |
| `formValidationMessage` | `form-validation-message` | The native form validation message                                                                                                     | `string`  | `undefined` |
| `indeterminate`         | `indeterminate`           | A state that is neither checked nor unchecked                                                                                          | `boolean` | `false`     |
| `name` _(required)_     | `name`                    | Name of the HTML input form control. Submitted with the form as part of a name/value pair.                                             | `string`  | `undefined` |
| `required`              | `required`                | If `true`, it will indicate that the user must specify a value for the checkbox before the owning form can be submitted                | `boolean` | `undefined` |
| `value` _(required)_    | `value`                   | A string representing the value of the checkbox. Primarily used to differentiate a list of related checkboxes that have the same name. | `string`  | `undefined` |


## Events

| Event      | Description                                          | Type                                 |
| ---------- | ---------------------------------------------------- | ------------------------------------ |
| `bqBlur`   | Handler to be called when the checkbox loses focus   | `CustomEvent<HTMLBqCheckboxElement>` |
| `bqChange` | Handler to be called when the checkbox state changes | `CustomEvent<{ checked: boolean; }>` |
| `bqFocus`  | Handler to be called when the checkbox gets focus    | `CustomEvent<HTMLBqCheckboxElement>` |


## Methods

### `vBlur() => Promise<void>`

Remove focus from the native `<input>` HTML element used under the hood.
Use this method instead of the global `element.blur()`.

#### Returns

Type: `Promise<void>`



### `vClick() => Promise<void>`

Simulate a click event on the native `<input>` HTML element used under the hood.
Use this method instead of the global `element.click()`.

#### Returns

Type: `Promise<void>`



### `vFocus() => Promise<void>`

Sets focus on the native `<input>` HTML element used under the hood.
Use this method instead of the global `element.focus()`.

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description                           |
| ---- | ------------------------------------- |
|      | The content of the checkbox component |


## Shadow Parts

| Part         | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| `"base"`     | The component's internal wrapper of the checkbox component.               |
| `"checkbox"` | The `<span>` element that renders the custom checked/indeterminate state. |
| `"control"`  | The container `<div>` element that holds the custom checkbox.             |
| `"input"`    | The native HTML `<input type="checkbox">` used under the hood.            |
| `"label"`    | The `<span>` element that holds the text content.                         |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

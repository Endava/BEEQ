# bq-switch



<!-- Auto Generated Below -->


## Overview

Toggle switches are digital on/off switches.
They should provide immediate results, giving users the freedom to control their preferences as needed.

## Properties

| Property                | Attribute                 | Description                                                                                                                                                 | Type                                                                                                                                                                                        | Default     |
| ----------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `backgroundOnHover`     | `background-on-hover`     | If true, a background will be displayed on hover                                                                                                            | `boolean`                                                                                                                                                                                   | `false`     |
| `checked`               | `checked`                 | It indicates whether if the switch is `ON` by default (when the page loads)                                                                                 | `boolean`                                                                                                                                                                                   | `false`     |
| `disabled`              | `disabled`                | If true, the switch control will be disabled and no interaction will be allowed                                                                             | `boolean`                                                                                                                                                                                   | `false`     |
| `formValidationMessage` | `form-validation-message` | The native form validation message                                                                                                                          | `string`                                                                                                                                                                                    | `undefined` |
| `fullWidth`             | `full-width`              | If true, the component will take the full width space available on the parent container                                                                     | `boolean`                                                                                                                                                                                   | `false`     |
| `innerLabel`            | `inner-label`             | It indicates how to to display the on/off marks inside the control, with icons or none (default)                                                            | `"default" \| "icon"`                                                                                                                                                                       | `'default'` |
| `justifyContent`        | `justify-content`         | It defines how to distribute the space between and around the control and the label text (https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) | `"center" \| "end" \| "flex-end" \| "flex-start" \| "inherit" \| "initial" \| "left" \| "normal" \| "right" \| "space-around" \| "space-between" \| "space-evenly" \| "start" \| "stretch"` | `'start'`   |
| `name` _(required)_     | `name`                    | Name of the form control. Submitted with the form as part of a name/value pair                                                                              | `string`                                                                                                                                                                                    | `undefined` |
| `required`              | `required`                | If `true`, it will indicate that the user must switch `ON` the element before the owning form can be submitted                                              | `boolean`                                                                                                                                                                                   | `false`     |
| `reverseOrder`          | `reverse-order`           | If true, the order of the control and the label text will be changed                                                                                        | `boolean`                                                                                                                                                                                   | `false`     |
| `value`                 | `value`                   | The input control's value, submitted as a name/value pair with form data.                                                                                   | `string`                                                                                                                                                                                    | `undefined` |


## Events

| Event      | Description                                        | Type                                 |
| ---------- | -------------------------------------------------- | ------------------------------------ |
| `bqBlur`   | Handler to be called when the switch loses focus   | `CustomEvent<HTMLBqSwitchElement>`   |
| `bqChange` | Handler to be called when the switch state changes | `CustomEvent<{ checked: boolean; }>` |
| `bqFocus`  | Handler to be called when the switch gets focus    | `CustomEvent<HTMLBqSwitchElement>`   |


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

| Slot | Description           |
| ---- | --------------------- |
|      | The switch label text |


## Shadow Parts

| Part         | Description                                                       |
| ------------ | ----------------------------------------------------------------- |
| `"base"`     | HTML `<label>` root container                                     |
| `"control"`  | HTML `<div>` element for the custom control                       |
| `"dot"`      | HTML `<div>` element that acts as changing dot                    |
| `"icon-off"` | HTMLBqIcon `<pk-icon>` element used as the `OFF` mark inner label |
| `"icon-on"`  | HTMLBqIcon `<pk-icon>` element used as the `ON` mark inner label  |
| `"label"`    | HTML `<span>` element that holds the label text                   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

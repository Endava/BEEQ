# bq-textarea



<!-- Auto Generated Below -->


## Overview

The Textarea component is a multi-line text input control that is often used in a form to collect user inputs like comments or reviews.

## Properties

| Property                   | Attribute                 | Description                                                                                                                                                         | Type                                                      | Default     |
| -------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- |
| `autoGrow`                 | `auto-grow`               | If `true`, the textarea will automatically grow and shrink to fit its contents. If `false`, the textarea will have a fixed height specified by the `rows` property. | `boolean`                                                 | `false`     |
| `autocapitalize`           | `autocapitalize`          | Controls whether or not the textarea field should be capitalized and how. Possible values are 'off', 'none', 'on', 'sentences', 'words', and 'characters'.          | `"characters" \| "off" \| "on" \| "sentences" \| "words"` | `'off'`     |
| `autocomplete`             | `autocomplete`            | Specifies whether or not the textarea field should have autocomplete enabled.                                                                                       | `string`                                                  | `'off'`     |
| `autofocus`                | `autofocus`               | If true, the textarea will be focused on component render                                                                                                           | `boolean`                                                 | `false`     |
| `debounceTime`             | `debounce-time`           | The amount of time, in milliseconds, to wait before emitting the `bqInput` event after the textarea value changes. A value of 0 means no debouncing will occur.     | `number`                                                  | `0`         |
| `disableResize`            | `disable-resize`          | If `true`, it will block the user's ability to resize the textarea.                                                                                                 | `boolean`                                                 | `false`     |
| `disabled`                 | `disabled`                | If `true`, the user cannot interact with the textarea.                                                                                                              | `boolean`                                                 | `false`     |
| `form`                     | `form`                    | The ID of the form that the textarea field belongs to.                                                                                                              | `string`                                                  | `undefined` |
| `formValidationMessage`    | `form-validation-message` | The native form validation message                                                                                                                                  | `string`                                                  | `undefined` |
| `maxlength`                | `maxlength`               | The maximum number of characters that can be entered into the textarea (`0`: no limit). When enabled, a character counter will be shown underneath the textarea.    | `number`                                                  | `undefined` |
| `name` _(required)_        | `name`                    | The name of the textarea element.                                                                                                                                   | `string`                                                  | `undefined` |
| `placeholder` _(required)_ | `placeholder`             | The placeholder text to show when there is no value.                                                                                                                | `string`                                                  | `undefined` |
| `readonly`                 | `readonly`                | If true, the textarea field cannot be modified.                                                                                                                     | `boolean`                                                 | `false`     |
| `required`                 | `required`                | Indicates whether or not the textarea field is required to be filled out before submitting the form.                                                                | `boolean`                                                 | `false`     |
| `rows`                     | `rows`                    | The number of visible text lines for the control. It must be a positive integer.                                                                                    | `number`                                                  | `5`         |
| `spellcheck`               | `spellcheck`              | If true, the textarea content may be checked for spelling errors.                                                                                                   | `boolean`                                                 | `false`     |
| `validationStatus`         | `validation-status`       | The validation status of the textarea.                                                                                                                              | `"error" \| "none" \| "success" \| "warning"`             | `'none'`    |
| `value`                    | `value`                   | The value of the textarea. It can be used to reset the textarea to a previous value.                                                                                | `string`                                                  | `undefined` |
| `wrap`                     | `wrap`                    | Specifies how the text in a text area is to be wrapped when submitted in a form                                                                                     | `"hard" \| "off" \| "soft"`                               | `'soft'`    |


## Events

| Event      | Description                                                                                                                                                                                                                                | Type                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `bqBlur`   | Callback handler emitted when the textarea loses focus                                                                                                                                                                                     | `CustomEvent<HTMLBqTextareaElement>`                         |
| `bqChange` | Callback handler emitted when the textarea value has changed and the textarea loses focus. This handler is called whenever the user finishes typing or pasting text into the textarea field and then clicks outside of the textarea field. | `CustomEvent<{ value: string; el: HTMLBqTextareaElement; }>` |
| `bqClear`  | Callback handler emitted when the textarea value has been cleared                                                                                                                                                                          | `CustomEvent<HTMLBqTextareaElement>`                         |
| `bqFocus`  | Callback handler emitted when the textarea has received focus                                                                                                                                                                              | `CustomEvent<HTMLBqTextareaElement>`                         |
| `bqInput`  | Callback handler emitted when the textarea value changes. This handler is called whenever the user types or pastes text into the textarea field.                                                                                           | `CustomEvent<{ value: string; el: HTMLBqTextareaElement; }>` |


## Slots

| Slot            | Description         |
| --------------- | ------------------- |
| `"helper-text"` | The helper text.    |
| `"label"`       | The textarea label. |


## Shadow Parts

| Part               | Description                   |
| ------------------ | ----------------------------- |
| `"base"`           | The component's base wrapper. |
| `"helper-counter"` | The helper counter.           |
| `"helper-info"`    | The helper info container.    |
| `"helper-text"`    | The helper text.              |
| `"input"`          | The textarea element.         |
| `"label"`          | The textarea label.           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

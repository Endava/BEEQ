# bq-radio



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute             | Description                                                                                                          | Type      | Default     |
| -------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `backgroundOnHover`  | `background-on-hover` | If true radio displays background on hover                                                                           | `boolean` | `false`     |
| `checked`            | `checked`             | If true radio input is checked                                                                                       | `boolean` | `undefined` |
| `disabled`           | `disabled`            | If true radio input is disabled                                                                                      | `boolean` | `false`     |
| `formId`             | `form-id`             | The form ID that the radio input is associated with                                                                  | `string`  | `undefined` |
| `name` _(required)_  | `name`                | Name of the HTML input form control. Submitted with the form as part of a name/value pair.                           | `string`  | `undefined` |
| `required`           | `required`            | If `true`, it will indicate that the user must specify a value for the radio before the owning form can be submitted | `boolean` | `undefined` |
| `value` _(required)_ | `value`               | A string representing the value of the radio.                                                                        | `string`  | `undefined` |


## Events

| Event       | Description                                        | Type                              |
| ----------- | -------------------------------------------------- | --------------------------------- |
| `bqBlur`    | Handler to be called when the radio loses focus    | `CustomEvent<HTMLBqRadioElement>` |
| `bqClick`   | Handler to be called when the radio state changes  | `CustomEvent<HTMLBqRadioElement>` |
| `bqFocus`   | Handler to be called when the radio gets focus     | `CustomEvent<HTMLBqRadioElement>` |
| `bqKeyDown` | Handler to be called when the radio key is pressed | `CustomEvent<KeyboardEvent>`      |


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




## Shadow Parts

| Part      | Description                                                 |
| --------- | ----------------------------------------------------------- |
| `"base"`  | The component's internal wrapper of the radio component.    |
| `"input"` | The native HTML `<input type="radio">` used under the hood. |
| `"label"` | The `<span>` element that holds the text content.           |
| `"radio"` | The component's internal wrapper of the radio component.    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

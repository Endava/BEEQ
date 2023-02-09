# bq-tab



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute  | Description                            | Type                  | Default     |
| ----------------------- | ---------- | -------------------------------------- | --------------------- | ----------- |
| `active`                | `active`   | If true tab is active                  | `boolean`             | `undefined` |
| `controls` _(required)_ | `controls` | The tab panel id that the tab controls | `string`              | `undefined` |
| `disabled`              | `disabled` | If true tab is disabled                | `boolean`             | `false`     |
| `size`                  | `size`     | The size of the tab                    | `"medium" \| "small"` | `'small'`   |
| `tabId` _(required)_    | `tab-id`   | The id of the tab                      | `string`              | `undefined` |


## Events

| Event       | Description                                      | Type                            |
| ----------- | ------------------------------------------------ | ------------------------------- |
| `bqBlur`    | Handler to be called when the tab loses focus    | `CustomEvent<HTMLBqTabElement>` |
| `bqClick`   | Handler to be called when the tab state changes  | `CustomEvent<HTMLBqTabElement>` |
| `bqFocus`   | Handler to be called when the tab gets focus     | `CustomEvent<HTMLBqTabElement>` |
| `bqKeyDown` | Handler to be called when the tab key is pressed | `CustomEvent<KeyboardEvent>`    |


## Methods

### `vBlur() => Promise<void>`

Remove focus from the native `<button>` HTML element used under the hood.
Use this method instead of the global `element.blur()`.

#### Returns

Type: `Promise<void>`



### `vClick() => Promise<void>`

Simulate a click event on the native `<button>` HTML element used under the hood.
Use this method instead of the global `element.click()`.

#### Returns

Type: `Promise<void>`



### `vFocus() => Promise<void>`

Sets focus on the native `<button>` HTML element used under the hood.
Use this method instead of the global `element.focus()`.

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part          | Description                                            |
| ------------- | ------------------------------------------------------ |
| `"base"`      | The HTML button used under the hood.                   |
| `"icon"`      | The HTML `<div>` element that holds the icon element.  |
| `"text"`      | The HTML `<span>` element that holds the text content. |
| `"underline"` | The HTML `<div>` element that display active state.    |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

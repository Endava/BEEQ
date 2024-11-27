# bq-tab



<!-- Auto Generated Below -->


## Overview

The tab is a user interface element that allows users to navigate between different sections of a page.
It should be used inside `<bq-tab-group>` component.

## Properties

| Property                | Attribute     | Description                             | Type                             | Default        |
| ----------------------- | ------------- | --------------------------------------- | -------------------------------- | -------------- |
| `active`                | `active`      | If true tab is active                   | `boolean`                        | `undefined`    |
| `controls` _(required)_ | `controls`    | The tab panel id that the tab controls  | `string`                         | `undefined`    |
| `disabled`              | `disabled`    | If true tab is disabled                 | `boolean`                        | `false`        |
| `orientation`           | `orientation` | The direction that tab should be render | `"horizontal" \| "vertical"`     | `'horizontal'` |
| `placement`             | `placement`   | The placement that tab should be render | `"end" \| "start"`               | `'start'`      |
| `size`                  | `size`        | The size of the tab                     | `"large" \| "medium" \| "small"` | `'medium'`     |
| `tabId` _(required)_    | `tab-id`      | The id of the tab                       | `string`                         | `undefined`    |


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

| Part          | Description                                           |
| ------------- | ----------------------------------------------------- |
| `"base"`      | The HTML button used under the hood.                  |
| `"content"`   | The HTML `<div>` element that holds the content.      |
| `"icon"`      | The HTML `<div>` element that holds the icon content. |
| `"text"`      | The HTML `<div>` element that holds the text content. |
| `"underline"` | The HTML `<div>` element that display active state.   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

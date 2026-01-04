# bq-toast



<!-- Auto Generated Below -->


## Overview

Toasts are time-based components used to display short messages.
Commonly used for errors, confirmations, or progress updates.

## Properties

| Property    | Attribute   | Description                                                                  | Type                                                                                              | Default           |
| ----------- | ----------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------------- |
| `border`    | `border`    | The corder radius of the toast component                                     | `"full" \| "l" \| "m" \| "none" \| "s" \| "xs" \| "xs2"`                                          | `'s'`             |
| `hideIcon`  | `hide-icon` | If true will hide toast icon                                                 | `boolean`                                                                                         | `false`           |
| `open`      | `open`      | If true, the toast will be shown                                             | `boolean`                                                                                         | `undefined`       |
| `placement` | `placement` | Placement of toast                                                           | `"bottom-center" \| "bottom-left" \| "bottom-right" \| "top-center" \| "top-left" \| "top-right"` | `'bottom-center'` |
| `time`      | `time`      | The length of time, in milliseconds, after which the toast will close itself | `number`                                                                                          | `3000`            |
| `type`      | `type`      | Type of toast                                                                | `"alert" \| "custom" \| "error" \| "info" \| "loading" \| "success"`                              | `'info'`          |


## Events

| Event    | Description                                                   | Type                              |
| -------- | ------------------------------------------------------------- | --------------------------------- |
| `bqHide` | Callback handler to be called when the notification is hidden | `CustomEvent<HTMLBqToastElement>` |
| `bqShow` | Callback handler to be called when the notification is shown  | `CustomEvent<HTMLBqToastElement>` |


## Methods

### `hide() => Promise<void>`

Method to be called to hide the toast component

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Method to be called to show the toast component

#### Returns

Type: `Promise<void>`



### `toast() => Promise<void>`

This method can be used to display toasts in a fixed-position element that allows for stacking multiple toasts vertically

#### Returns

Type: `Promise<void>`




## Slots

| Slot     | Description                                         |
| -------- | --------------------------------------------------- |
|          | The content to be displayed in the toast component. |
| `"icon"` | The icon to be displayed in the toast component.    |


## Shadow Parts

| Part          | Description                                              |
| ------------- | -------------------------------------------------------- |
| `"base"`      | The `<div>` container of the internal bq-icon component. |
| `"icon-info"` | The `<div>` container that holds the icon component.     |
| `"svg"`       | The `<svg>` element of the internal bq-icon component.   |
| `"wrapper"`   | The component's internal wrapper inside the shadow DOM.  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

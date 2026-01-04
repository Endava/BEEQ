# bq-alert



<!-- Auto Generated Below -->


## Overview

The Alert is a user interface component used to convey important information to the user in a clear and concise manner.
It can be used to notify users of success, failure, warning, or any other type of information that needs to be brought to their attention.

## Properties

| Property       | Attribute       | Description                                                                                                      | Type                                                       | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| `autoDismiss`  | `auto-dismiss`  | If true, the alert will automatically hide after the specified amount of time                                    | `boolean`                                                  | `undefined` |
| `border`       | `border`        | The corner radius of the alert component                                                                         | `"full" \| "l" \| "m" \| "none" \| "s" \| "xs" \| "xs2"`   | `'s'`       |
| `disableClose` | `disable-close` | If true, the close button at the top right of the alert won't be shown                                           | `boolean`                                                  | `undefined` |
| `hideIcon`     | `hide-icon`     | If true, the alert icon won't be shown                                                                           | `boolean`                                                  | `undefined` |
| `open`         | `open`          | If true, the alert will be shown                                                                                 | `boolean`                                                  | `undefined` |
| `sticky`       | `sticky`        | If true, the alert component will remain fixed at the top of the page, occupying the full viewport               | `boolean`                                                  | `undefined` |
| `time`         | `time`          | The length of time, in milliseconds, after which the alert will close itself. Only valid if `autoDismiss="true"` | `number`                                                   | `3000`      |
| `type`         | `type`          | Type of Alert                                                                                                    | `"default" \| "error" \| "info" \| "success" \| "warning"` | `'default'` |


## Events

| Event         | Description                                                   | Type               |
| ------------- | ------------------------------------------------------------- | ------------------ |
| `bqAfterHide` | Callback handler to be called after the alert has been hidden | `CustomEvent<any>` |
| `bqAfterShow` | Callback handler to be called after the alert has been shown  | `CustomEvent<any>` |
| `bqHide`      | Callback handler to be called when the alert is hidden        | `CustomEvent<any>` |
| `bqShow`      | Callback handler to be called when the alert is shown         | `CustomEvent<any>` |


## Methods

### `hide() => Promise<void>`

Method to be called to hide the alert component

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Method to be called to show the alert component

#### Returns

Type: `Promise<void>`




## Slots

| Slot          | Description                                                                          |
| ------------- | ------------------------------------------------------------------------------------ |
|               | The alert title content (no slot name required)                                      |
| `"body"`      | The alert description content                                                        |
| `"btn-close"` | The close button of the alert                                                        |
| `"footer"`    | The alert footer content                                                             |
| `"icon"`      | The predefined icon based on the alert type (info, success, warning, error, default) |


## Shadow Parts

| Part             | Description                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `"base"`         | The `<div>` container of the predefined bq-icon component                                                                 |
| `"body"`         | The container `<div>` that wraps the alert description content                                                            |
| `"btn-close"`    | The native button of the `bq-button` used to close the alert                                                              |
| `"content"`      | The container `<div>` that wraps all the alert content (title, description, footer)                                       |
| `"footer"`       | The container `<div>` that wraps the alert footer content                                                                 |
| `"icon"`         | The `<bq-icon>` element used to render a predefined icon based on the alert type (info, success, warning, error, default) |
| `"icon-outline"` | The container `<div>` that wraps the icon element                                                                         |
| `"main"`         | The container `<div>` that wraps the alert main content (title, description)                                              |
| `"svg"`          | The `<svg>` element of the predefined bq-icon component                                                                   |
| `"title"`        | The container `<div>` that wraps the alert title content                                                                  |
| `"wrapper"`      | The wrapper container `<div>` of the element inside the shadow DOM                                                        |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

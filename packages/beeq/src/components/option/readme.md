# bq-option



<!-- Auto Generated Below -->


## Overview

An option refers to a specific choice that appears in a list of selectable items that can be opened or closed by the user.
It can be an element of the navigation system that allows users to select different sections or pages within an application or it can be used within a dropdown list.

## Properties

| Property       | Attribute       | Description                                                                              | Type      | Default     |
| -------------- | --------------- | ---------------------------------------------------------------------------------------- | --------- | ----------- |
| `disabled`     | `disabled`      | If true, the option is disabled.                                                         | `boolean` | `false`     |
| `displayValue` | `display-value` | The display value of the option. It can be used to override the default displayed value. | `string`  | `undefined` |
| `hidden`       | `hidden`        | If true, the option is hidden.                                                           | `boolean` | `false`     |
| `selected`     | `selected`      | If true, the option is selected and active.                                              | `boolean` | `false`     |
| `value`        | `value`         | A string representing the value of the option. Can be used to identify the item          | `string`  | `undefined` |


## Events

| Event     | Description                                | Type                               |
| --------- | ------------------------------------------ | ---------------------------------- |
| `bqBlur`  | Handler to be called when item loses focus | `CustomEvent<HTMLBqOptionElement>` |
| `bqClick` | Handler to be called when item is clicked  | `CustomEvent<HTMLBqOptionElement>` |
| `bqEnter` | Handler to be called on enter key press    | `CustomEvent<HTMLBqOptionElement>` |
| `bqFocus` | Handler to be called when item is focused  | `CustomEvent<HTMLBqOptionElement>` |


## Slots

| Slot       | Description                                          |
| ---------- | ---------------------------------------------------- |
|            | The label content to be displayed.                   |
| `"prefix"` | The prefix content to be displayed before the label. |


## Shadow Parts

| Part       | Description                                                                |
| ---------- | -------------------------------------------------------------------------- |
| `"base"`   | The component's internal wrapper.                                          |
| `"label"`  | The `span` element in which the label text is displayed.                   |
| `"prefix"` | The `span` element in which the prefix is displayed (generally `bq-icon`). |
| `"suffix"` | The `span` element in which the suffix is displayed (generally `bq-icon`). |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# bq-accordion



<!-- Auto Generated Below -->


## Overview

The Accordion is a UI component that allows users to toggle between showing and hiding content sections. It provides a collapsible functionality, where only one section can be expanded at a time, while the others remain collapsed.

## Properties

| Property      | Attribute      | Description                                                                                                                                                     | Type                  | Default    |
| ------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------- |
| `appearance`  | `appearance`   | The appearance style of the Accordion                                                                                                                           | `"filled" \| "ghost"` | `'filled'` |
| `disabled`    | `disabled`     | If true, the Accordion is disabled                                                                                                                              | `boolean`             | `false`    |
| `expanded`    | `expanded`     | If true, the Accordion is expanded                                                                                                                              | `boolean`             | `false`    |
| `noAnimation` | `no-animation` | Animation is set through JS when the browser does not support CSS calc-size() If true, the Accordion animation, will be disabled. No animation will be applied. | `boolean`             | `false`    |
| `rotate`      | `rotate`       | If true, the Accordion expand icon is rotate 180deg when expanded                                                                                               | `boolean`             | `false`    |
| `size`        | `size`         | The size of the Accordion                                                                                                                                       | `"medium" \| "small"` | `'medium'` |


## Events

| Event          | Description                                         | Type                                  |
| -------------- | --------------------------------------------------- | ------------------------------------- |
| `bqAfterClose` | Handler to be called after the accordion is closed  | `CustomEvent<HTMLBqAccordionElement>` |
| `bqAfterOpen`  | Handler to be called after the accordion is opened  | `CustomEvent<HTMLBqAccordionElement>` |
| `bqBlur`       | Handler to be called when the accordion loses focus | `CustomEvent<HTMLBqAccordionElement>` |
| `bqClick`      | Handler to be called when the accordion is clicked  | `CustomEvent<HTMLBqAccordionElement>` |
| `bqClose`      | Handler to be called when the accordion is closed   | `CustomEvent<HTMLBqAccordionElement>` |
| `bqFocus`      | Handler to be called when the accordion gets focus  | `CustomEvent<HTMLBqAccordionElement>` |
| `bqOpen`       | Handler to be called when the accordion is opened   | `CustomEvent<HTMLBqAccordionElement>` |


## Slots

| Slot         | Description                                   |
| ------------ | --------------------------------------------- |
|              | The accordion panel content                   |
| `"collapse"` | The accordion collapse icon                   |
| `"expand"`   | The accordion expand icon                     |
| `"header"`   | The accordion header content                  |
| `"prefix"`   | The accordion prefix content (icon or avatar) |
| `"suffix"`   | The accordion suffix content (icon or avatar) |


## Shadow Parts

| Part       | Description                                              |
| ---------- | -------------------------------------------------------- |
| `"base"`   | The `<details>` that holds the accordion content         |
| `"header"` | The `<summary>` that holds the accordion header content  |
| `"panel"`  | The `<div>` that holds the accordion panel content       |
| `"prefix"` | The `<div>` that holds the accordion prefix content      |
| `"suffix"` | The `<div>` that holds the accordion suffix content      |
| `"text"`   | The `<div>` that holds the accordion header text content |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

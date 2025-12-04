# bq-tag



<!-- Auto Generated Below -->


## Overview

The Tag Component is a UI element used to label and categorize content within an application.
Tags are commonly used to label items with keywords or categories, making it easier to find and organize content.

## Properties

| Property    | Attribute   | Description                                                                            | Type                                                     | Default     |
| ----------- | ----------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------- |
| `border`    | `border`    | The corner radius of the Tag (will override size's predefined border)                  | `"full" \| "l" \| "m" \| "none" \| "s" \| "xs" \| "xs2"` | `undefined` |
| `clickable` | `clickable` | If true, the Tag can be clickable                                                      | `boolean`                                                | `false`     |
| `color`     | `color`     | The color style of the Tag                                                             | `"error" \| "gray" \| "info" \| "success" \| "warning"`  | `undefined` |
| `disabled`  | `disabled`  | If true, the Tag will be disabled (only if clickable = `true`, no interaction allowed) | `boolean`                                                | `false`     |
| `hidden`    | `hidden`    | If true, the Tag component will hidden                                                 | `boolean`                                                | `undefined` |
| `removable` | `removable` | If true, the Tag component can be removed                                              | `boolean`                                                | `false`     |
| `selected`  | `selected`  | If true, the Tag is selected (only if clickable = `true`)                              | `boolean`                                                | `false`     |
| `size`      | `size`      | The size of the Tag component                                                          | `"medium" \| "small" \| "xsmall"`                        | `'medium'`  |
| `variant`   | `variant`   | The variant of Tag to apply on top of the variant                                      | `"filled" \| "outline"`                                  | `'filled'`  |


## Events

| Event     | Description                                                  | Type                            |
| --------- | ------------------------------------------------------------ | ------------------------------- |
| `bqBlur`  | Handler to be called when tag loses focus                    | `CustomEvent<HTMLBqTagElement>` |
| `bqClick` | Handler to be called when tag is clicked                     | `CustomEvent<HTMLBqTagElement>` |
| `bqClose` | Callback handler to be called when the tag is close/hidden   | `CustomEvent<any>`              |
| `bqFocus` | Handler to be called when tag is focused                     | `CustomEvent<HTMLBqTagElement>` |
| `bqOpen`  | Callback handler to be called when the tag is not open/shown | `CustomEvent<any>`              |


## Methods

### `hide() => Promise<void>`

Method to be called to remove the tag component

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Method to be called to show the tag component

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
|            | The text content of the tag                                         |
| `"prefix"` | The prefix slot to add an icon or any other content before the text |


## Shadow Parts

| Part          | Description                                                                                |
| ------------- | ------------------------------------------------------------------------------------------ |
| `"btn-close"` | The close button element to remove the tag component.                                      |
| `"prefix"`    | The `<span>` tag element that acts as prefix container (when icon exists in front of tag). |
| `"text"`      | The `<div>` element containing the text of the tag component.                              |
| `"wrapper"`   | The wrapper container `<div>` of the element inside the shadow DOM.                        |


## Dependencies

### Used by

 - [bq-select](../select)

### Depends on

- [bq-button](../button)
- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-tag --> bq-button
  bq-tag --> bq-icon
  bq-button --> bq-icon
  bq-select --> bq-tag
  style bq-tag fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

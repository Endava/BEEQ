# bq-button



<!-- Auto Generated Below -->


## Overview

Buttons are designed for users to take action on a page or a screen.

## Properties

| Property     | Attribute    | Description                                                                                                                                                                             | Type                                           | Default      |
| ------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------ |
| `appearance` | `appearance` | The appearance style to apply to the button                                                                                                                                             | `"link" \| "primary" \| "secondary" \| "text"` | `'primary'`  |
| `disabled`   | `disabled`   | If true, the button will be disabled (no interaction allowed)                                                                                                                           | `boolean`                                      | `false`      |
| `download`   | `download`   | Tells the browser to treat the linked URL as a download. Only used when `href` is set. Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download               | `string`                                       | `undefined`  |
| `href`       | `href`       | When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`                                                                                   | `string`                                       | `undefined`  |
| `loading`    | `loading`    | If `true` it will display the button in a loading state                                                                                                                                 | `boolean`                                      | `false`      |
| `size`       | `size`       | The size of the button                                                                                                                                                                  | `"large" \| "medium" \| "small"`               | `'medium'`   |
| `target`     | `target`     | Where to display the linked URL, as the name for a browsing context (a `tab`, `window`, or `<iframe>`) Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target | `"_blank" \| "_parent" \| "_self" \| "_top"`   | `undefined`  |
| `type`       | `type`       | The default behavior of the button                                                                                                                                                      | `"button" \| "reset" \| "submit"`              | `'button'`   |
| `variant`    | `variant`    | The variant of button to apply on top of the appearance                                                                                                                                 | `"danger" \| "ghost" \| "standard"`            | `'standard'` |


## Events

| Event     | Description                                      | Type                               |
| --------- | ------------------------------------------------ | ---------------------------------- |
| `bqBlur`  | Handler to be called when the button loses focus | `CustomEvent<HTMLBqButtonElement>` |
| `bqClick` | Handler to be called when button gets focus      | `CustomEvent<HTMLBqButtonElement>` |
| `bqFocus` | Handler to be called when the button is clicked  | `CustomEvent<HTMLBqButtonElement>` |


## Shadow Parts

| Part       | Description                                                   |
| ---------- | ------------------------------------------------------------- |
| `"button"` | The HTML button used under the hood.                          |
| `"label"`  | The `<span>` tag element that renderd the text of the button. |
| `"prefix"` | The `<span>` tag element that acts as prefix container.       |
| `"suffix"` | The `<span>` tag element that acts as suffix container.       |


## Dependencies

### Depends on

- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-button --> bq-icon
  style bq-button fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

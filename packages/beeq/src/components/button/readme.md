# bq-button



<!-- Auto Generated Below -->


## Overview

Buttons are designed for users to take action on a page or a screen.

## Properties

| Property         | Attribute         | Description                                                                                                                                                                             | Type                                                     | Default      |
| ---------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------ |
| `appearance`     | `appearance`      | The appearance style to apply to the button                                                                                                                                             | `"link" \| "primary" \| "secondary" \| "text"`           | `'primary'`  |
| `block`          | `block`           | If `true`, it will make the button fit to its parent width.                                                                                                                             | `boolean`                                                | `false`      |
| `border`         | `border`          | The corner radius of the button                                                                                                                                                         | `"full" \| "l" \| "m" \| "none" \| "s" \| "xs" \| "xs2"` | `'m'`        |
| `disabled`       | `disabled`        | If true, the button will be disabled (no interaction allowed)                                                                                                                           | `boolean`                                                | `false`      |
| `download`       | `download`        | Tells the browser to treat the linked URL as a download. Only used when `href` is set. Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-download               | `string`                                                 | `undefined`  |
| `href`           | `href`            | When set, the underlying button will be rendered as an `<a>` with this `href` instead of a `<button>`                                                                                   | `string`                                                 | `undefined`  |
| `justifyContent` | `justify-content` | It determinate how the content should be aligned                                                                                                                                        | `"center" \| "left" \| "right"`                          | `'center'`   |
| `label`          | `label`           | Text  used for accessibility purposes, specially screen readers, to describe the button action                                                                                          | `string`                                                 | `undefined`  |
| `loading`        | `loading`         | If `true` it will display the button in a loading state                                                                                                                                 | `boolean`                                                | `false`      |
| `onlyIcon`       | `only-icon`       | If `true` it will display the button as an icon-only button with aspect ratio 1:1 (square dimensions). Make sure to set the `label` prop for accessibility purposes.                    | `boolean`                                                | `false`      |
| `size`           | `size`            | The size of the button                                                                                                                                                                  | `"large" \| "medium" \| "small"`                         | `'medium'`   |
| `target`         | `target`          | Where to display the linked URL, as the name for a browsing context (a `tab`, `window`, or `<iframe>`) Details: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target | `"_blank" \| "_parent" \| "_self" \| "_top"`             | `undefined`  |
| `type`           | `type`            | The default behavior of the button                                                                                                                                                      | `"button" \| "reset" \| "submit"`                        | `'button'`   |
| `variant`        | `variant`         | The variant of button to apply on top of the appearance (applicable only to `appearance="primary"`)                                                                                     | `"danger" \| "ghost" \| "standard"`                      | `'standard'` |


## Events

| Event     | Description                                       | Type                               |
| --------- | ------------------------------------------------- | ---------------------------------- |
| `bqBlur`  | Handler to be called when the button loses focus. | `CustomEvent<HTMLBqButtonElement>` |
| `bqClick` | Handler to be called when the button is clicked.  | `CustomEvent<HTMLBqButtonElement>` |
| `bqFocus` | Handler to be called when the button gets focus.  | `CustomEvent<HTMLBqButtonElement>` |


## Slots

| Slot       | Description                                                |
| ---------- | ---------------------------------------------------------- |
|            | The button label content                                   |
| `"prefix"` | The prefix content to be displayed before the button label |
| `"suffix"` | The suffix content to be displayed after the button label  |


## Shadow Parts

| Part       | Description                                                   |
| ---------- | ------------------------------------------------------------- |
| `"button"` | The `<a>` or `<button>` HTML element used under the hood.     |
| `"label"`  | The `<span>` tag element that renders the text of the button. |
| `"prefix"` | The `<span>` tag element that acts as prefix container.       |
| `"suffix"` | The `<span>` tag element that acts as suffix container.       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

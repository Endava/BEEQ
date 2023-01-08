# pk-tooltip



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                                                                          | Type                                                                                                                                                                 | Default   |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `displayOn` | `display-on` | Set the action when the tooltip should be displayed, on hover (default) or click                                                     | `"click" \| "hover"`                                                                                                                                                 | `'hover'` |
| `distance`  | `distance`   | Distance between trigger element and tooltip                                                                                         | `number`                                                                                                                                                             | `10`      |
| `hideArrow` | `hide-arrow` | If true, the arrow on the tooltip content won't be shown                                                                             | `boolean`                                                                                                                                                            | `false`   |
| `placement` | `placement`  |                                                                                                                                      | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'top'`   |
| `sameWidth` | `same-width` | Whether the tooltip should have the same width as the trigger element (applicable only for content shorter than the trigger element) | `boolean`                                                                                                                                                            | `false`   |
| `visible`   | `visible`    | Indicates whether or not the tooltip is visible                                                                                      | `boolean`                                                                                                                                                            | `false`   |


## Methods

### `hide() => Promise<void>`

Hides the tooltip

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Shows the tooltip

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part        | Description                                                                  |
| ----------- | ---------------------------------------------------------------------------- |
| `"base"`    | The component wrapper container inside the shadow DOM                        |
| `"panel"`   | The `<div>` container that holds the tooltip content                         |
| `"trigger"` | The `<div>` container that holds the element which displays tooltip on hover |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

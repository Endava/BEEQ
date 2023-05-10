# bq-panel



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                        | Type                                                                                                                                                                 | Default    |
| ----------- | ----------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| `distance`  | `distance`  | Distance between the panel and the trigger element | `number`                                                                                                                                                             | `0`        |
| `open`      | `open`      | If true, panel is visible                          | `boolean`                                                                                                                                                            | `false`    |
| `placement` | `placement` | Position of the panel                              | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom'` |


## Events

| Event               | Description                                                  | Type                   |
| ------------------- | ------------------------------------------------------------ | ---------------------- |
| `bqPanelVisibility` | Handler to be called to check if the panel is open or closed | `CustomEvent<boolean>` |


## Methods

### `setTriggerElement(trigger: HTMLElement) => Promise<void>`

set trigger element and init FloatingUI

#### Returns

Type: `Promise<void>`



### `togglePanel() => Promise<void>`



#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

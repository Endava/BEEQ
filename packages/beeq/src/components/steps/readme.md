# bq-steps



<!-- Auto Generated Below -->


## Overview

The Steps Component is a UI element used to display a series of steps or stages in a process or task.
It is used to guide users through a process or task and to indicate their progress.

## Properties

| Property       | Attribute       | Description                                                                                  | Type                           | Default             |
| -------------- | --------------- | -------------------------------------------------------------------------------------------- | ------------------------------ | ------------------- |
| `dividerColor` | `divider-color` | The color of the line that connects the steps. It should be a valid declarative color token. | `string`                       | `'stroke--primary'` |
| `size`         | `size`          | The size of the steps                                                                        | `"medium" \| "small"`          | `'medium'`          |
| `type`         | `type`          | The type of prefix element to use on the step items                                          | `"dot" \| "icon" \| "numeric"` | `undefined`         |


## Methods

### `setCurrentStepItem(newCurrentStep: HTMLBqStepItemElement) => Promise<void>`

Set the current step item.

#### Parameters

| Name             | Type                    | Description                        |
| ---------------- | ----------------------- | ---------------------------------- |
| `newCurrentStep` | `HTMLBqStepItemElement` | - The step item to set as current. |

#### Returns

Type: `Promise<void>`




## Slots

| Slot | Description    |
| ---- | -------------- |
|      | The step items |


## Shadow Parts

| Part                   | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `"container"`          | The container wrapper of the Steps component    |
| `"divider-base"`       | The base wrapper of the divider component       |
| `"divider-dash-end"`   | The dash end wrapper of the divider component   |
| `"divider-dash-start"` | The dash start wrapper of the divider component |


## Dependencies

### Depends on

- [bq-divider](../divider)

### Graph
```mermaid
graph TD;
  bq-steps --> bq-divider
  style bq-steps fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

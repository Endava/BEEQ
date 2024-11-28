# bq-tab



<!-- Auto Generated Below -->


## Overview

The tab group is a user interface element that allows users wrap a set of tab items.

## Properties

| Property         | Attribute         | Description                                                             | Type                             | Default        |
| ---------------- | ----------------- | ----------------------------------------------------------------------- | -------------------------------- | -------------- |
| `debounceTime`   | `debounce-time`   | A number representing the delay value applied to bqChange event handler | `number`                         | `0`            |
| `disableDivider` | `disable-divider` | If true, the underline divider below the tabs won't be shown            | `boolean`                        | `false`        |
| `orientation`    | `orientation`     | The direction that tab should be render                                 | `"horizontal" \| "vertical"`     | `'horizontal'` |
| `placement`      | `placement`       | The placement that tab should be render                                 | `"end" \| "start"`               | `'start'`      |
| `size`           | `size`            | The size of the tab                                                     | `"large" \| "medium" \| "small"` | `'medium'`     |
| `value`          | `value`           | A string representing the id of the selected tab.                       | `string`                         | `undefined`    |


## Events

| Event      | Description                                     | Type                                                        |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------- |
| `bqChange` | Handler to be called when the tab value changes | `CustomEvent<{ target: HTMLBqTabElement; value: string; }>` |


## Slots

| Slot | Description      |
| ---- | ---------------- |
|      | The bq-tab items |


## Shadow Parts

| Part     | Description                                 |
| -------- | ------------------------------------------- |
| `"base"` | The HTML div wrapper inside the shadow DOM. |
| `"tabs"` | The HTML div used to hold the tab buttons.  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

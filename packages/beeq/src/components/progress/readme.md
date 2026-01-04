# bq-progress



<!-- Auto Generated Below -->


## Overview

The progress bar is a user interface component that visually represents the completion status of a task or process.

## Properties

| Property        | Attribute        | Description                                                            | Type                    | Default     |
| --------------- | ---------------- | ---------------------------------------------------------------------- | ----------------------- | ----------- |
| `borderShape`   | `border-shape`   | It will set the border style of the progress bar                       | `"rounded" \| "square"` | `'rounded'` |
| `enableTooltip` | `enable-tooltip` | If `true`, a tooltip will be shown displaying the progress value       | `boolean`               | `false`     |
| `indeterminate` | `indeterminate`  | If `true` the indeterminate state of progress bar is enabled           | `boolean`               | `false`     |
| `label`         | `label`          | If `true, a label text showing the value (in percentage) will be shown | `boolean`               | `false`     |
| `thickness`     | `thickness`      | Progress bar thickness                                                 | `"large" \| "medium"`   | `'medium'`  |
| `type`          | `type`           | Progress type                                                          | `"default" \| "error"`  | `'default'` |
| `value`         | `value`          | A number representing the current value of the progress bar            | `number`                | `0`         |


## Shadow Parts

| Part              | Description                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| `"base"`          | The base container for the tooltip component inside the shadow DOM when hovering over the progress bar  |
| `"indeterminate"` | The `<div>` container that holds the indeterminate progress bar                                         |
| `"label"`         | The `<div>` container that holds the label value (in percentage)                                        |
| `"panel"`         | The container holding the content of the tooltip when hovering over the progress bar                    |
| `"progress"`      | The `<div>` container that holds the native progress element                                            |
| `"progress-bar"`  | The native html for progress element                                                                    |
| `"trigger"`       | The container holding the element that triggers the tooltip display when hovering over the progress bar |
| `"wrapper"`       | The component wrapper container inside the shadow DOM                                                   |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

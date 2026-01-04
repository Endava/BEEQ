# bq-dropdown



<!-- Auto Generated Below -->


## Overview

The Dropdown Component is commonly used when presenting a list of selectable options that are too numerous to fit comfortably on the screen.
They provide an efficient way to save space and present a long list of options in a compact and organized manner.

## Properties

| Property            | Attribute             | Description                                                                           | Type                                                                                                                                                                 | Default          |
| ------------------- | --------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `disableScrollLock` | `disable-scroll-lock` | If true, the dropdown panel will not lock the page body scroll when open.             | `boolean`                                                                                                                                                            | `false`          |
| `disabled`          | `disabled`            | If true, the dropdown panel will be visible and won't be shown.                       | `boolean`                                                                                                                                                            | `false`          |
| `distance`          | `distance`            | Represents the distance (gutter or margin) between the panel and the trigger element. | `number`                                                                                                                                                             | `4`              |
| `keepOpenOnSelect`  | `keep-open-on-select` | If true, the panel will remain open after a selection is made.                        | `boolean`                                                                                                                                                            | `false`          |
| `open`              | `open`                | If true, the panel will be visible.                                                   | `boolean`                                                                                                                                                            | `false`          |
| `panelHeight`       | `panel-height`        | When set, it will override the height of the dropdown panel                           | `string`                                                                                                                                                             | `undefined`      |
| `placement`         | `placement`           | Position of the panel                                                                 | `"bottom" \| "bottom-end" \| "bottom-start" \| "left" \| "left-end" \| "left-start" \| "right" \| "right-end" \| "right-start" \| "top" \| "top-end" \| "top-start"` | `'bottom-start'` |
| `sameWidth`         | `same-width`          | Whether the panel should have the same width as the trigger element                   | `boolean`                                                                                                                                                            | `false`          |
| `skidding`          | `skidding`            | Represents the skidding between the panel and the trigger element.                    | `number`                                                                                                                                                             | `0`              |
| `strategy`          | `strategy`            | Defines the strategy to position the panel                                            | `"absolute" \| "fixed"`                                                                                                                                              | `'fixed'`        |


## Events

| Event    | Description                                                                | Type                              |
| -------- | -------------------------------------------------------------------------- | --------------------------------- |
| `bqOpen` | Callback handler to be called when the dropdown panel is opened or closed. | `CustomEvent<{ open: boolean; }>` |


## Slots

| Slot        | Description                                        |
| ----------- | -------------------------------------------------- |
|             | The content of the dropdown panel.                 |
| `"trigger"` | The trigger element that opens the dropdown panel. |


## Shadow Parts

| Part         | Description                                                                              |
| ------------ | ---------------------------------------------------------------------------------------- |
| `"base"`     | The component's internal wrapper.                                                        |
| `"dropdown"` | The `<bq-panel>` element used under the hood to display the dropdown panel.              |
| `"panel"`    | The `<div>` element used to display and style the panel inside the `<bq-panel>` element. |
| `"trigger"`  | The `<div>` element that hosts the trigger element.                                      |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

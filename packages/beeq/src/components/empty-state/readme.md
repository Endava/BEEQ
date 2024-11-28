# bq-empty-state



<!-- Auto Generated Below -->


## Overview

An Empty State is a UI component displayed when there is no data or content available, often used in dynamic or inactive application states.

## Properties

| Property | Attribute | Description                           | Type                             | Default    |
| -------- | --------- | ------------------------------------- | -------------------------------- | ---------- |
| `size`   | `size`    | The size of the empty state component | `"large" \| "medium" \| "small"` | `'medium'` |


## Slots

| Slot          | Description                                                  |
| ------------- | ------------------------------------------------------------ |
| `"body"`      | The content to be displayed after the thumbnail section      |
| `"footer"`    | The content to be displayed after the body section as footer |
| `"thumbnail"` | The element that wraps the thumbnail element                 |


## Shadow Parts

| Part          | Description                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| `"body"`      | The container `<div>` that wraps the alert description content                                                     |
| `"footer"`    | The container `<div>` that wraps the alert footer content                                                          |
| `"icon"`      | The `<bq-icon>` element used to render a predefined icon size based on the empty state size (small, medium, large) |
| `"thumbnail"` | The container `<div>` that wraps the thumbnail element                                                             |
| `"title"`     | The container `<div>` that wraps the empty state title content                                                     |
| `"wrapper"`   | The wrapper container `<div>` of the element inside the shadow DOM                                                 |


## Dependencies

### Depends on

- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-empty-state --> bq-icon
  style bq-empty-state fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

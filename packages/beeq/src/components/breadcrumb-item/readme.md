# bq-breadcrumb-item



<!-- Auto Generated Below -->


## Overview

The Breadcrumb Item helps users understand their current location within a website or application's hierarchical structure.

## Properties

| Property | Attribute | Description                                                                                                          | Type                                         | Default                 |
| -------- | --------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------- |
| `href`   | `href`    | If set, the breadcrumb item will be rendered as an `<a>` with this `href`, otherwise, a `<button>` will be rendered. | `string`                                     | `undefined`             |
| `rel`    | `rel`     | Where to display the link in the browser context. Relevant only if `href` is set.                                    | `string`                                     | `'noreferrer noopener'` |
| `target` | `target`  | Where to display the link in the browser context. Relevant only if `href` is set.                                    | `"_blank" \| "_parent" \| "_self" \| "_top"` | `undefined`             |


## Events

| Event     | Description                                | Type                                       |
| --------- | ------------------------------------------ | ------------------------------------------ |
| `bqBlur`  | Handler to be called when item loses focus | `CustomEvent<HTMLBqBreadcrumbItemElement>` |
| `bqClick` | Handler to be called when item is clicked  | `CustomEvent<HTMLBqBreadcrumbItemElement>` |
| `bqFocus` | Handler to be called when item is focused  | `CustomEvent<HTMLBqBreadcrumbItemElement>` |


## Slots

| Slot | Description                                                     |
| ---- | --------------------------------------------------------------- |
|      | The default slot is used to add content to the breadcrumb item. |


## Shadow Parts

| Part          | Description                                     |
| ------------- | ----------------------------------------------- |
| `"base"`      | The component wrapper container                 |
| `"content"`   | The `span` tag that wraps the content item      |
| `"item"`      | The breadcrumb item wrapper (`button` or `a`)   |
| `"separator"` | The `span` tag that wraps the separator element |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

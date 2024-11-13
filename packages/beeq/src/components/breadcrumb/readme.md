# bq-breadcrumb



<!-- Auto Generated Below -->


## Overview

The Breadcrumb is used to wraps a series of breadcrumb items to indicate the current page's location within a navigational hierarchy.

## Properties

| Property | Attribute | Description                                                   | Type     | Default         |
| -------- | --------- | ------------------------------------------------------------- | -------- | --------------- |
| `label`  | `label`   | The `aria-label` attribute to describe the type of navigation | `string` | `'Breadcrumbs'` |


## Slots

| Slot          | Description                                                                     |
| ------------- | ------------------------------------------------------------------------------- |
|               | The default slot is used to add `bq-breadcrumb-item` items to the breadcrumb.   |
| `"separator"` | The slot to add a separator between breadcrumb items. Default separator is `/`. |


## Shadow Parts

| Part           | Description                                    |
| -------------- | ---------------------------------------------- |
| `"navigation"` | The `nav` tag that loads the breadcrumb items  |
| `"separator"`  | The container that wraps the separator element |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

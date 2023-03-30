# bq-menu-item



<!-- Auto Generated Below -->


## Overview

The menu item is used inside a `bq-menu` component

## Properties

| Property   | Attribute  | Description                                                 | Type      | Default     |
| ---------- | ---------- | ----------------------------------------------------------- | --------- | ----------- |
| `active`   | `active`   | If true, the item is set to active                          | `boolean` | `false`     |
| `disabled` | `disabled` | If true, the item will be disabled (no interaction allowed) | `boolean` | `false`     |
| `href`     | `href`     | Attribute link                                              | `string`  | `undefined` |


## Events

| Event             | Description                                    | Type                                 |
| ----------------- | ---------------------------------------------- | ------------------------------------ |
| `bqMenuItemBlur`  | Handler to be called when the item loses focus | `CustomEvent<HTMLBqMenuItemElement>` |
| `bqMenuItemClick` | Handler to be called when item gets focus      | `CustomEvent<HTMLBqMenuItemElement>` |
| `bqMenuItemFocus` | Handler to be called when the item is clicked  | `CustomEvent<HTMLBqMenuItemElement>` |


## Shadow Parts

| Part       | Description                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| `"item"`   | The anchor tag element used to display a menu item.                             |
| `"label"`  | The `<span>` tag element that acts as prefix container for the menu item label. |
| `"prefix"` | The `<span>` tag element that acts as prefix container (bq-icon).               |
| `"suffix"` | The `<span>` tag element that acts as prefix container (bq-icon).               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

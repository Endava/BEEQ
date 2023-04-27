# bq-menu-item



<!-- Auto Generated Below -->


## Overview

The menu item is used inside a `bq-menu` component

## Properties

| Property    | Attribute   | Description                                                 | Type      | Default     |
| ----------- | ----------- | ----------------------------------------------------------- | --------- | ----------- |
| `active`    | `active`    | If true, the item is set to active                          | `boolean` | `false`     |
| `collapsed` | `collapsed` | If true, the menu component is collapsed                    | `boolean` | `false`     |
| `disabled`  | `disabled`  | If true, the item will be disabled (no interaction allowed) | `boolean` | `false`     |
| `href`      | `href`      | Attribute link                                              | `string`  | `undefined` |


## Events

| Event               | Description                                    | Type                                 |
| ------------------- | ---------------------------------------------- | ------------------------------------ |
| `bqMenuItemBlur`    | Handler to be called when the item loses focus | `CustomEvent<HTMLBqMenuItemElement>` |
| `bqMenuItemClick`   | Handler to be called when the item is clicked  | `CustomEvent<HTMLBqMenuItemElement>` |
| `bqMenuItemFocus`   | Handler to be called when the item gets focus  | `CustomEvent<HTMLBqMenuItemElement>` |
| `bqMenuItemOnEnter` | Handler to be called on enter key press        | `CustomEvent<HTMLBqMenuItemElement>` |


## Methods

### `addSizeClassAndTheme(size: TMenuSize, theme: TMenuTheme) => Promise<void>`

called from Menu component on componentDidLoad() hook
add size class and theme

#### Returns

Type: `Promise<void>`



### `hidePartsFromMenuItems() => Promise<void>`

called from Menu component on collapse

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part       | Description                                                                     |
| ---------- | ------------------------------------------------------------------------------- |
| `"item"`   | The anchor tag element used to display a menu item.                             |
| `"label"`  | The `<span>` tag element that acts as prefix container for the menu item label. |
| `"prefix"` | The `<span>` tag element that acts as prefix container (bq-icon).               |
| `"suffix"` | The `<span>` tag element that acts as prefix container (bq-icon).               |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

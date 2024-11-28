# bq-side-menu



<!-- Auto Generated Below -->


## Overview

The default side menu serves as a versatile container for organizing and displaying navigation elements,
 with default side menu items providing a clean and straightforward way to represent individual menu options.
 Together, they form the foundation for building structured and intuitive side menu layouts.

## Properties

| Property     | Attribute    | Description                                      | Type                                | Default     |
| ------------ | ------------ | ------------------------------------------------ | ----------------------------------- | ----------- |
| `appearance` | `appearance` | It sets a predefined appearance of the side menu | `"brand" \| "default" \| "inverse"` | `'default'` |
| `collapse`   | `collapse`   | If true, the container will reduce its width     | `boolean`                           | `false`     |
| `size`       | `size`       | It sets the size of the navigation menu items    | `"medium" \| "small"`               | `'medium'`  |


## Events

| Event        | Description                                                                                                 | Type                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `bqCollapse` | Callback handler to be called when the Side menu changes its width from expanded to collapse and vice versa | `CustomEvent<{ collapse: boolean; }>`    |
| `bqSelect`   | Callback handler to be called when the active/selected menu item changes                                    | `CustomEvent<HTMLBqSideMenuItemElement>` |


## Methods

### `toggleCollapse() => Promise<void>`

Toggle the collapse state of the side menu

#### Returns

Type: `Promise<void>`




## Slots

| Slot                                            | Description                                                    |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `"The main section that holds all menu items."` |                                                                |
| `"footer"`                                      | The section for adding footer content to the side menu.        |
| `"logo"`                                        | The section for displaying the logo or brand in the side menu. |


## Shadow Parts

| Part       | Description                                          |
| ---------- | ---------------------------------------------------- |
| `"base"`   | HTML `<aside>` root container                        |
| `"footer"` | HTML `<div>` element that holds the footer           |
| `"logo"`   | HTML `<div>` element that holds the logo             |
| `"nav"`    | HTML `<nav>` element that holds the navigation items |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

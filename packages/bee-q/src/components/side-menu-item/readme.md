# bq-side-menu-item



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                                                           | Type      | Default |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------- | --------- | ------- |
| `active`   | `active`   | If true, the menu item will be shown as active/selected.                                              | `boolean` | `false` |
| `collapse` | `collapse` | If true, the item label and suffix will be hidden and the with will be reduce according to its parent | `boolean` | `false` |
| `disabled` | `disabled` | If true, the menu item will be disabled (no interaction allowed)                                      | `boolean` | `false` |


## Events

| Event     | Description                                      | Type                                     |
| --------- | ------------------------------------------------ | ---------------------------------------- |
| `bqBlur`  | Handler to be called when the button loses focus | `CustomEvent<HTMLBqSideMenuItemElement>` |
| `bqClick` | Handler to be called when button gets focus      | `CustomEvent<HTMLBqSideMenuItemElement>` |
| `bqFocus` | Handler to be called when the button is clicked  | `CustomEvent<HTMLBqSideMenuItemElement>` |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"prefix"` |             |
| `"suffix"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

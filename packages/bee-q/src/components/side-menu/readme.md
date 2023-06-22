# bq-side-menu



<!-- Auto Generated Below -->


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


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |
| `"logo"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

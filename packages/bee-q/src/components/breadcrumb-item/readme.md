# bq-breadcrumb-item



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                                                                                          | Type                                         | Default                 |
| -------- | --------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ----------------------- |
| `href`   | `href`    | If set, the breadcrumb item will be rendered as an `<a>` with this `href`, otherwise, a `<button>` will be rendered. | `string`                                     | `undefined`             |
| `isLast` | `is-last` | If true, the item is the last element inside breadcrumb                                                              | `boolean`                                    | `false`                 |
| `rel`    | `rel`     | Where to display the link in the browser context. Relevant only if `href` is set.                                    | `string`                                     | `'noreferrer noopener'` |
| `target` | `target`  | Where to display the link in the browser context. Relevant only if `href` is set.                                    | `"_blank" \| "_parent" \| "_self" \| "_top"` | `undefined`             |


## Shadow Parts

| Part       | Description |
| ---------- | ----------- |
| `"label"`  |             |
| `"prefix"` |             |
| `"suffix"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

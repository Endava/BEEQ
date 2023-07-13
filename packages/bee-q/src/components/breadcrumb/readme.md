# bq-breadcrumb



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                            | Type     | Default         |
| ----------- | ------------ | -------------------------------------- | -------- | --------------- |
| `ariaLabel` | `aria-label` | The `aria-label` attribute for `<nav>` | `string` | `'breadcrumbs'` |


## Events

| Event               | Description                                                                        | Type                                       |
| ------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| `bqBreadcrumbBlur`  | Handler to be called when `bq-breadcrumb-item` item loses focus.                   | `CustomEvent<HTMLBqBreadcrumbItemElement>` |
| `bqBreadcrumbClick` | Handler to be called when `bq-breadcrumb-item` is selected (on click/enter press). | `CustomEvent<HTMLBqBreadcrumbItemElement>` |
| `bqBreadcrumbFocus` | Handler to be called when `bq-breadcrumb-item` item gets focus.                    | `CustomEvent<HTMLBqBreadcrumbItemElement>` |


## Shadow Parts

| Part           | Description                                   |
| -------------- | --------------------------------------------- |
| `"navigation"` | The `nav` tag that loads the breadcrumb items |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

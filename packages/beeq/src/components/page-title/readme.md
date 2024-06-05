# bq-page-title



<!-- Auto Generated Below -->


## Properties

| Property             | Attribute              | Description                                       | Type      | Default     |
| -------------------- | ---------------------- | ------------------------------------------------- | --------- | ----------- |
| `haveBackNavigation` | `have-back-navigation` | If true, the page title back button will be shown | `boolean` | `undefined` |


## Events

| Event         | Description                                                        | Type                                  |
| ------------- | ------------------------------------------------------------------ | ------------------------------------- |
| `bqBackBlur`  | Handler to be called when page title navigation button loses focus | `CustomEvent<HTMLBqPageTitleElement>` |
| `bqBackClick` | Handler to be called when page title navigation button is clicked  | `CustomEvent<HTMLBqPageTitleElement>` |
| `bqBackFocus` | Handler to be called when page title navigation button is focused  | `CustomEvent<HTMLBqPageTitleElement>` |


## Shadow Parts

| Part          | Description                                                                              |
| ------------- | ---------------------------------------------------------------------------------------- |
| `"back"`      | The container `<div>` that wraps the page title back icon button.                        |
| `"base"`      | The inner container `<div>`of element that contains the base page title component        |
| `"btn-back"`  | The back navigation button.                                                              |
| `"divider"`   | The inner container `<div>` of element that contains the bottom divider section          |
| `"icon"`      | The `<bq-icon>` element used to render a predefined back navigation icon for page title. |
| `"prefix"`    | The `<div>` page title element that acts as prefix slot container.                       |
| `"sub-title"` | The `<div>` page title element that acts as sub-title slot container.                    |
| `"suffix"`    | The `<div>` page title element that acts as suffix slot container.                       |
| `"title"`     | The container `<div>` that wraps the page title content.                                 |
| `"wrapper"`   | The wrapper container `<div>` of the element inside the shadow DOM.                      |


## Dependencies

### Depends on

- [bq-button](../button)
- [bq-icon](../icon)
- [bq-divider](../divider)

### Graph
```mermaid
graph TD;
  bq-page-title --> bq-button
  bq-page-title --> bq-icon
  bq-page-title --> bq-divider
  bq-button --> bq-icon
  style bq-page-title fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# bq-option-list



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description              | Type     | Default     |
| ----------- | ------------ | ------------------------ | -------- | ----------- |
| `ariaLabel` | `aria-label` | Aria label for the list. | `string` | `'Options'` |


## Events

| Event      | Description                                                               | Type                                                         |
| ---------- | ------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `bqSelect` | Handler to be called when `bq-option` is selected (on click/enter press). | `CustomEvent<{ value: string; item: HTMLBqOptionElement; }>` |


## Shadow Parts

| Part     | Description                       |
| -------- | --------------------------------- |
| `"base"` | The component's internal wrapper. |


## Dependencies

### Used by

 - [bq-select](../select)

### Graph
```mermaid
graph TD;
  bq-select --> bq-option-list
  style bq-option-list fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

# bq-drawer



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                                 | Type                | Default     |
| ----------- | ----------- | ------------------------------------------- | ------------------- | ----------- |
| `open`      | `open`      | If true, the drawer component will be shown | `boolean`           | `undefined` |
| `placement` | `placement` |                                             | `"left" \| "right"` | `'left'`    |


## Events

| Event          | Description                                                    | Type               |
| -------------- | -------------------------------------------------------------- | ------------------ |
| `bqAfterClose` | Callback handler to be called after the drawer has been closed | `CustomEvent<any>` |
| `bqAfterOpen`  | Callback handler to be called after the drawer has been opened | `CustomEvent<any>` |
| `bqHide`       | Callback handler to be called when the drawer is hidden        | `CustomEvent<any>` |
| `bqShow`       | Callback handler to be called when the drawer is shown         | `CustomEvent<any>` |


## Methods

### `hide() => Promise<void>`

Method to be called to hide the notification component

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Method to be called to show the notification component

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description |
| ---------------- | ----------- |
| `"body"`         |             |
| `"button-close"` |             |
| `"content"`      |             |
| `"footer"`       |             |
| `"header"`       |             |
| `"title"`        |             |
| `"wrapper"`      |             |


## Dependencies

### Depends on

- [bq-button](../button)
- [bq-icon](../icon)
- [bq-divider](../divider)

### Graph
```mermaid
graph TD;
  bq-drawer --> bq-button
  bq-drawer --> bq-icon
  bq-drawer --> bq-divider
  bq-button --> bq-icon
  style bq-drawer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

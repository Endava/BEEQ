# bq-drawer



<!-- Auto Generated Below -->


## Properties

| Property              | Attribute                | Description                                                                                  | Type                | Default     |
| --------------------- | ------------------------ | -------------------------------------------------------------------------------------------- | ------------------- | ----------- |
| `closeOnClickOutside` | `close-on-click-outside` | If true, the drawer will not close when clicking outside the panel                           | `boolean`           | `false`     |
| `closeOnEsc`          | `close-on-esc`           | If true, the dialog will not close when the [Esc] key is pressed                             | `boolean`           | `false`     |
| `enableBackdrop`      | `enable-backdrop`        | If true, the backdrop overlay will be shown when the drawer opens                            | `boolean`           | `false`     |
| `open`                | `open`                   | If true, the drawer component will be shown                                                  | `boolean`           | `undefined` |
| `placement`           | `placement`              | <span style="color:red">**[DEPRECATED]**</span> Defines the position of the drawer<br/><br/> | `"left" \| "right"` | `'right'`   |
| `position`            | `position`               | Defines the position of the drawer                                                           | `"end" \| "start"`  | `'end'`     |


## Events

| Event          | Description                                                    | Type               |
| -------------- | -------------------------------------------------------------- | ------------------ |
| `bqAfterClose` | Callback handler to be called after the drawer has been closed | `CustomEvent<any>` |
| `bqAfterOpen`  | Callback handler to be called after the drawer has been opened | `CustomEvent<any>` |
| `bqClose`      | Callback handler to be called when the drawer is closed        | `CustomEvent<any>` |
| `bqOpen`       | Callback handler to be called when the drawer is opened        | `CustomEvent<any>` |


## Methods

### `hide() => Promise<void>`

Method to be called to hide the drawer component

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Method to be called to show the drawer component

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `"backdrop"`     | The `<div>` that holds the backdrop overlay                 |
| `"body"`         | The `<main>` that holds the drawer body content             |
| `"button-close"` | The button that close the dialog on click                   |
| `"footer"`       | The `<footer>` that holds footer content                    |
| `"header"`       | The `<header>` that holds the icon, title, and close button |
| `"panel"`        | The `<div>` that holds the drawer entire content            |
| `"title"`        | The `<div>` that holds the title content                    |


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

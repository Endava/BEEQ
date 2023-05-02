# bq-notification



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute         | Description                                                                                                          | Type                                                       | Default     |
| --------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| `disableClose`  | `disable-close`   | If true, the close button at the top right of the notification won't be shown                                        | `boolean`                                                  | `undefined` |
| `hasCustomIcon` | `has-custom-icon` | If true, the predefined icon type won't be shown and a custom icon provided on integration will be displayed instead | `boolean`                                                  | `undefined` |
| `hideIcon`      | `hide-icon`       | If true, the notification icon won't be shown                                                                        | `boolean`                                                  | `undefined` |
| `isOpen`        | `is-open`         | If true, the notification will be shown                                                                              | `boolean`                                                  | `undefined` |
| `type`          | `type`            | Type of Notification                                                                                                 | `"error" \| "info" \| "neutral" \| "success" \| "warning"` | `'neutral'` |


## Events

| Event    | Description | Type               |
| -------- | ----------- | ------------------ |
| `bqHide` |             | `CustomEvent<any>` |


## Methods

### `hide() => Promise<void>`

Trigger function when you want to close Notification

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Trigger function when you want to show Notification

#### Returns

Type: `Promise<void>`



### `toast() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part             | Description                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------ |
| `"base"`         | The wrapper container `<div>` of the element inside the shadow DOM                         |
| `"body"`         | The conatiner `<div>` that wraps the notification description content                      |
| `"btn-close"`    | The `bq-button` used to close the notification                                             |
| `"content"`      | The conatiner `<div>` that wraps all the notification content (title, description, footer) |
| `"footer"`       | The conatiner `<div>` that wraps the notification footer content                           |
| `"icon"`         | The `<bq-icon>` element used to render a predefined icon based on the notification type    |
| `"icon-outline"` | The conatiner `<div>` that wraps the icon element                                          |
| `"title"`        | The conatiner `<div>` that wraps the notification title content                            |


## Dependencies

### Depends on

- [bq-button](../button)
- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-notification --> bq-button
  bq-notification --> bq-icon
  bq-button --> bq-icon
  style bq-notification fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

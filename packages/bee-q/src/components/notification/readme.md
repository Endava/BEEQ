# bq-notification



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                                                                       | Type                                                       | Default     |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------- |
| `hideIcon`     | `hide-icon`     | If true, the notification icon won't be shown                                                                     | `boolean`                                                  | `false`     |
| `isOpen`       | `is-open`       | If true, the notification will be shown                                                                           | `boolean`                                                  | `false`     |
| `showClose`    | `show-close`    | Set property to false if you want to hide Close icon                                                              | `boolean`                                                  | `undefined` |
| `subjectColor` | `subject-color` | Set the subject color if you don't want to be black. Subject color will also apply to Icon color if there is one. | `string`                                                   | `undefined` |
| `type`         | `type`          | Type of Notification                                                                                              | `"default" \| "error" \| "info" \| "success" \| "warning"` | `'default'` |


## Methods

### `hide() => Promise<void>`

Trigger function when you want to close Notification

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Trigger function when you want to show Notification

#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part            | Description                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| `"avatar"`      | `<div>` container element of notification avatar component slot.  Will be shown if Prop showIcon is false. |
| `"base"`        | The component's internal wrapper of the notification component.                                            |
| `"close-icon"`  | `<div>` container element of notification close icon component.  Will be shown if Prop showClose is false. |
| `"description"` | `<div>` container element of notification description slot                                                 |
| `"footer"`      | `<div>` container element of notification footer slot                                                      |
| `"icon"`        | `<div>` container element of notification icon component. Will be shown if Prop showIcon is true.          |
| `"title"`       | `<div>` container element of notification default slot.                                                    |


## Dependencies

### Depends on

- [bq-icon](../icon)

### Graph
```mermaid
graph TD;
  bq-notification --> bq-icon
  style bq-notification fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

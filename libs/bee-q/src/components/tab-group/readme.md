# bq-tab



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                             | Type      | Default     |
| -------------- | --------------- | ----------------------------------------------------------------------- | --------- | ----------- |
| `debounceTime` | `debounce-time` | A number representing the delay value applied to bqChange event handler | `number`  | `0`         |
| `disabled`     | `disabled`      | If true tabs are disabled                                               | `boolean` | `false`     |
| `value`        | `value`         | A string representing the id of the selected tab.                       | `string`  | `undefined` |


## Events

| Event      | Description                                     | Type                                                        |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------- |
| `bqChange` | Handler to be called when the tab value changes | `CustomEvent<{ target: HTMLBqTabElement; value: string; }>` |


## Shadow Parts

| Part     | Description |
| -------- | ----------- |
| `"base"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

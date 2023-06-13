# bq-tab



<!-- Auto Generated Below -->


## Properties

| Property       | Attribute       | Description                                                             | Type                             | Default     |
| -------------- | --------------- | ----------------------------------------------------------------------- | -------------------------------- | ----------- |
| `debounceTime` | `debounce-time` | A number representing the delay value applied to bqChange event handler | `number`                         | `0`         |
| `divider`      | `divider`       | If true tab has underline active                                        | `boolean`                        | `true`      |
| `size`         | `size`          | The size of the tab                                                     | `"large" \| "medium" \| "small"` | `'medium'`  |
| `value`        | `value`         | A string representing the id of the selected tab.                       | `string`                         | `undefined` |


## Events

| Event      | Description                                     | Type                                                        |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------- |
| `bqChange` | Handler to be called when the tab value changes | `CustomEvent<{ target: HTMLBqTabElement; value: string; }>` |


## Shadow Parts

| Part     | Description                                 |
| -------- | ------------------------------------------- |
| `"base"` | The HTML div wrapper inside the shadow DOM. |
| `"tabs"` | The HTML div used to hold the tab buttons.  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

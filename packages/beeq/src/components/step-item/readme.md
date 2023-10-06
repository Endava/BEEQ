# bq-step-item



<!-- Auto Generated Below -->


## Properties

| Property | Attribute | Description                                         | Type                                                             | Default     |
| -------- | --------- | --------------------------------------------------- | ---------------------------------------------------------------- | ----------- |
| `size`   | `size`    | It defines prefix size                              | `"medium" \| "small"`                                            | `'medium'`  |
| `status` | `status`  | It defines step item appearance based on its status | `"completed" \| "current" \| "default" \| "disabled" \| "error"` | `'default'` |
| `type`   | `type`    | It defines the step item type used                  | `"dot" \| "icon" \| "numeric"`                                   | `undefined` |


## Events

| Event     | Description | Type                                                             |
| --------- | ----------- | ---------------------------------------------------------------- |
| `bqClick` |             | `CustomEvent<{ target: HTMLBqStepItemElement; value: string; }>` |


## Shadow Parts

| Part            | Description |
| --------------- | ----------- |
| `"base"`        |             |
| `"description"` |             |
| `"title"`       |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

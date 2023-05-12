# bq-option



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                    | Type      | Default     |
| ---------- | ---------- | ---------------------------------------------- | --------- | ----------- |
| `disabled` | `disabled` | If true, the option is disabled.               | `boolean` | `false`     |
| `selected` | `selected` | If true, the option is selected and active.    | `boolean` | `false`     |
| `value`    | `value`    | A string representing the value of the option. | `string`  | `undefined` |


## Events

| Event             | Description                                | Type                               |
| ----------------- | ------------------------------------------ | ---------------------------------- |
| `bqOptionBlur`    | Handler to be called when item loses focus | `CustomEvent<HTMLBqOptionElement>` |
| `bqOptionClick`   | Handler to be called when item is clicked  | `CustomEvent<HTMLBqOptionElement>` |
| `bqOptionFocus`   | Handler to be called when item is focused  | `CustomEvent<HTMLBqOptionElement>` |
| `bqOptionOnEnter` | Handler to be called on enter key press    | `CustomEvent<HTMLBqOptionElement>` |


## Methods

### `setPaddingToOption() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Shadow Parts

| Part       | Description                                                               |
| ---------- | ------------------------------------------------------------------------- |
| `"label"`  | The `span` element in which the label text is displayed                   |
| `"prefix"` | The `span` element in which the prefix is displayed (generally `bq-icon`) |
| `"suffix"` | The `span` element in which the suffix is displayed (generally `bq-icon`) |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

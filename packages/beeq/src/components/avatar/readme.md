# bq-avatar



<!-- Auto Generated Below -->


## Overview

The Avatar component is a simple and customizable element that displays an image or initials in a circular or square shape.
This component is useful for displaying user profile pictures or any other image that represents a person or an entity.

## Properties

| Property   | Attribute  | Description                                                                      | Type                                         | Default     |
| ---------- | ---------- | -------------------------------------------------------------------------------- | -------------------------------------------- | ----------- |
| `altText`  | `alt-text` | Alternate text for the avatar image if the image cannot be displayed             | `string`                                     | `undefined` |
| `image`    | `image`    | The image source to load on the avatar (this can be also a base64 encoded image) | `string`                                     | `undefined` |
| `initials` | `initials` | The text to display on avatar                                                    | `string`                                     | `undefined` |
| `label`    | `label`    | A text to use for describing the avatar on assistive devices                     | `string`                                     | `undefined` |
| `shape`    | `shape`    | The shape of the avatar                                                          | `"circle" \| "square"`                       | `'circle'`  |
| `size`     | `size`     | The size of the avatar                                                           | `"large" \| "medium" \| "small" \| "xsmall"` | `'medium'`  |


## Slots

| Slot      | Description                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `"badge"` | The badge slot is used to add a badge to the avatar. The badge is a small circle or square that can be used to display a number or a status. |


## Shadow Parts

| Part      | Description                                                        |
| --------- | ------------------------------------------------------------------ |
| `"badge"` | The container that wraps the badge slot element.                   |
| `"base"`  | The component's internal wrapper.                                  |
| `"img"`   | The `<image>` tag element that load the image source.              |
| `"text"`  | The `<span>` tag element that rendered the `Initials` text string. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*

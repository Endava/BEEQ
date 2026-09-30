---
title: "Skill reference: choosing BEEQ components"
description: A decision guide for agents that picks BEEQ components by each piece's job rather than the request's wording, lists required parent and child structures, and flags common mix-ups.
---

This reference supports the [BEEQ agent skill](../SKILL.md). Use it to narrow the choice, then confirm the winner on its component page before writing code. Each row links to the page that owns the final answer.

The component is decided by the piece's **job**: what people do with it and what it does to the page. The request's words are clues, never the key. People name one piece many ways ("modal", "popup", "overlay"), use one word for different pieces ("dropdown" is a form value in one request and a menu of actions in the next), and often describe a piece without naming it ("show how many are open", "tell them the save failed"). Two pieces that look alike get different components when their jobs differ.

## Name each piece's job

For every piece the request names or implies, answer these in order and stop at the first yes. A composite piece, such as a card whose title links to a detail page, is several pieces: answer for each. The answer points at a table in [Choose by intent](#choose-by-intent); pick the row whose "People need to…" matches, then confirm on the component page.

1. **Does it take people somewhere else**: another page, route, or top-level section? Go to [Actions and navigation](#actions-and-navigation).
2. **Does it hold a value that the app reads or a form submits?** Go to [Form input](#form-input). The number of options, whether they stay visible, and whether the change applies at once or on submit pick the row.
3. **Does it run an action here?** One action is `bq-button`; several actions behind one trigger are `bq-dropdown`.
4. **Does it report a state or an outcome**: an error, a success, an update, a region that is loading or empty? Go to [Feedback and status](#feedback-and-status). What the message is about decides: a field's value, content still on screen, a region with nothing to show, an action that just finished, or an update that arrives while people work.
5. **Does it open over or beside the page?** Blocking until a decision is `bq-dialog`; working beside the page, which stays usable, is `bq-drawer`; brief help on hover or focus is `bq-tooltip`.
6. **Does it describe an item?** Its state is `bq-status`, a count is `bq-badge`, a category people can select or remove is `bq-tag`.
7. **Does it structure content?** Go to [Content and structure](#content-and-structure).

When no row fits the job, BEEQ has no component for it; see [When BEEQ has nothing that fits](#when-beeq-has-nothing-that-fits).

### Words whose meaning depends on the job

| The request says… | When the job is… | Use |
| --- | --- | --- |
| dropdown, picker | A value the form submits | `bq-select`; `bq-date-picker` for a date |
| | A menu of actions from a trigger | `bq-dropdown` with `bq-option-list` |
| menu | Actions or options from a trigger | `bq-dropdown` |
| | Moving between sections of the app | `bq-side-menu` |
| panel | Grouped content in the page flow | `bq-card` |
| | Content opened beside the page, which stays usable | `bq-drawer` |
| | A section people expand and collapse | `bq-accordion` |
| popup, modal, overlay | A decision that blocks until answered | `bq-dialog` |
| | A list of actions or options | `bq-dropdown` |
| | Brief, non-essential help | `bq-tooltip` |
| toggle | A setting that applies at once | `bq-switch` |
| | An option submitted with a form | `bq-checkbox` |
| | Showing or hiding a section | `bq-accordion` |
| tabs | Peer views of the same context | `bq-tab-group` |
| | Top-level app sections | `bq-side-menu` or links |
| | Ordered stages of a task | `bq-steps` |
| badge, label, pill, chip | An item's state | `bq-status` |
| | A count | `bq-badge` |
| | A category people select, filter, or remove | `bq-tag` |
| alert, banner, notification, message | About content still on screen | `bq-alert` |
| | Confirming an action that just finished | `bq-toast` |
| | An update that arrives while people work | `bq-notification` |
| error | A field's value is invalid | The field's `validation-status` with a message in `helper-text` |
| | An action failed and the content is still on screen | `bq-alert` beside that content |
| | A region failed to load and has nothing to show | `bq-empty-state` with Retry |
| loading | A button's own action | `loading` on `bq-button` |
| | Work of unknown duration | `bq-spinner` |
| | Work of known progress | `bq-progress` |
| list | Rows that take people somewhere, in a sidebar | `bq-side-menu` |
| | Rows that are the options of a value | `bq-select`, `bq-radio-group`, or `bq-checkbox` |
| | Rows of content | A native list, with `bq-card` when each row is a card |
| header | The page's heading, with its context and actions | `bq-page-title` |
| | A section or card heading | A native `h2` to `h6`, inside the section or `bq-card` |
| | An app bar across the top of every page | Semantic `header` on tokens; BEEQ has none |
| link, button | Goes to another page | `bq-button` with `href`, or a native link |
| | Runs an action | `bq-button` without `href` |

## Choose by intent

### Actions and navigation

| People need to… | Use | Not |
| --- | --- | --- |
| Trigger an action or submit a form | [`bq-button`](https://www.beeq.design/components/button.md) | A styled `div` or a link that does not navigate. |
| Go to another page | `bq-button` with `href` (`appearance="link"` for inline and back links), or a native link | A button that calls the router without an `href`. |
| Open a short menu of actions or options from a trigger | [`bq-dropdown`](https://www.beeq.design/components/dropdown.md) with `bq-option-list` | `bq-select`, which is a form value. |
| Move between sections of an application | [`bq-side-menu`](https://www.beeq.design/components/side-menu.md) with `bq-side-menu-item`: icon in `slot="prefix"`, label as content, count in `slot="suffix"` | Tabs for top-level app navigation. A hand-built row of icon, name, and badge. |
| Switch between peer views in the same context | [`bq-tab-group`](https://www.beeq.design/components/tab.md) with `bq-tab` | Tabs for a sequence the user must complete in order. |
| Complete a sequence of steps | [`bq-steps`](https://www.beeq.design/components/steps.md) with `bq-step-item` | Tabs. |
| See where they are in a hierarchy | [`bq-breadcrumb`](https://www.beeq.design/components/breadcrumb.md) with `bq-breadcrumb-item` | A row of links styled by hand. |

### Form input

| People need to… | Use | Not |
| --- | --- | --- |
| Enter short text, numbers, or email | [`bq-input`](https://www.beeq.design/components/input.md), with `type="search"` for search | `bq-textarea`. |
| Enter longer text | [`bq-textarea`](https://www.beeq.design/components/textarea.md) | `bq-input`. |
| Pick one option from a long or compact list | [`bq-select`](https://www.beeq.design/components/select.md) with `bq-option` | Radios when there are many options. |
| Pick one option from a few that should stay visible | [`bq-radio-group`](https://www.beeq.design/components/radio.md) with `bq-radio` | A select that hides a two-option choice. |
| Pick several options | `bq-checkbox`, or `bq-select` with `multiple` | Several switches. |
| Turn a setting on or off with an immediate effect | [`bq-switch`](https://www.beeq.design/components/switch.md) | A checkbox for an instant setting. |
| Agree to or include one item in a form submission | [`bq-checkbox`](https://www.beeq.design/components/checkbox.md) | A switch. |
| Pick a date or date range | [`bq-date-picker`](https://www.beeq.design/components/date-picker.md) | Three selects for day, month, and year. |
| Pick a value on a continuous scale | [`bq-slider`](https://www.beeq.design/components/slider.md) | An input when precision matters more than the range. |

### Feedback and status

| People need to… | Use | Not |
| --- | --- | --- |
| Read an important message about content still on screen | [`bq-alert`](https://www.beeq.design/components/alert.md) | A toast that disappears before they read it. An alert in place of a region that failed to load. |
| Get brief confirmation after an action | [`bq-toast`](https://www.beeq.design/components/toast.md) | An alert that shifts the layout. |
| Notice an update that does not block work | [`bq-notification`](https://www.beeq.design/components/notification.md) | A dialog. |
| Confirm, review, or complete a focused task | [`bq-dialog`](https://www.beeq.design/components/dialog.md) | A drawer for a blocking decision. |
| Work with supporting content beside the main view | [`bq-drawer`](https://www.beeq.design/components/drawer.md) | A dialog that hides the context they need. |
| Read brief supplementary help on hover or focus | [`bq-tooltip`](https://www.beeq.design/components/tooltip.md) | A tooltip for essential information or interactive content. |
| See the state of an item | [`bq-status`](https://www.beeq.design/components/status.md) with a `type` | A tag when nothing is clickable or removable. |
| See a count or small label | [`bq-badge`](https://www.beeq.design/components/badge.md) | A tag. |
| See, filter, or remove a category label | [`bq-tag`](https://www.beeq.design/components/tag.md) | A badge. |
| Understand an empty or no-results view | [`bq-empty-state`](https://www.beeq.design/components/empty-state.md): what is missing in `slot="body"`, one action in `slot="footer"` | A lone line of grey text. |
| Recover from a region that failed to load | `bq-empty-state`: a warning icon in `slot="thumbnail"`, what failed in `slot="body"`, a Retry `bq-button` in `slot="footer"` | An alert that leaves the region blank. |
| Wait for work of known progress | [`bq-progress`](https://www.beeq.design/components/progress.md) | A spinner. |
| Wait for work of unknown duration | [`bq-spinner`](https://www.beeq.design/components/spinner.md) | A progress bar that never moves. |

### Content and structure

| People need to… | Use | Not |
| --- | --- | --- |
| Read the page heading with context and actions | [`bq-page-title`](https://www.beeq.design/components/page-title.md), which renders the `h1`: `slot="back"`, `slot="sub-title"`, and actions or a `bq-status` in `slot="suffix"` | A hand-built `header` with an `h1` and an action row. |
| Scan related content grouped in a container | [`bq-card`](https://www.beeq.design/components/card.md); `type="minimal"` for a flat surface. Header rows, truncation, and actions are your markup inside it | A `div` with a custom border, radius, background, or shadow. |
| Expand and collapse sections | [`bq-accordion-group`](https://www.beeq.design/components/accordion.md) with `bq-accordion` | Custom disclosure markup. |
| See a separation between regions | [`bq-divider`](https://www.beeq.design/components/divider.md) | A border on an empty element. |
| Recognise a person or account | [`bq-avatar`](https://www.beeq.design/components/avatar.md) | An image with custom rounding. |
| Understand an icon cue | [`bq-icon`](https://www.beeq.design/components/icon.md) with a Phosphor name | Emojis or inline SVG copied from elsewhere. |
| Scan tabular data | A native `table` with the `bq-table` class ([Table](https://www.beeq.design/components/table.md)); `compact`, `bordered`, `.selected` rows, and the `.bq-table--container` scroll wrapper cover density, borders, the active row, and overflow | Hand-written table styles, or a `bq-table` element, which does not exist. |

## Required parent and child structures

These components only work in the documented structure. Read the component page for the full contract.

| Parent | Children | Notes |
| --- | --- | --- |
| `bq-select` | `bq-option` | The select manages its internal option list. Do not add your own `bq-option-list`. |
| `bq-dropdown` | A trigger in `slot="trigger"`, then `bq-option-list` with `bq-option`, optionally grouped in `bq-option-group` | The trigger is usually a `bq-button`. Handle the pick with `bqSelect` on the `bq-option-list`; the dropdown's own event is `bqOpen`. |
| `bq-radio-group` | `bq-radio` | The group owns `name`, `value`, and `bqChange`. |
| `bq-tab-group` | `bq-tab` | Each tab needs `tab-id` and `controls`. Render the panels yourself, each with the matching `id` and `role="tabpanel"`. |
| `bq-steps` | `bq-step-item` | |
| `bq-side-menu` | `bq-side-menu-item`, optional `slot="logo"` and `slot="footer"` | Items have no `href`; handle `bqClick` or `bqSelect` for navigation. |
| `bq-breadcrumb` | `bq-breadcrumb-item` | Items take `href`; the last item is the current page. For client-side routing, call `event.preventDefault()` in the cancelable `bqClick` and route. |
| `bq-accordion-group` | `bq-accordion` | Use the group for coordinated expand behaviour. |

## Common mix-ups

The close calls, with the detail that settles them:

- **Select or dropdown.** A select carries a label, validation, and a value the form submits. A dropdown holds no value; it runs the action people pick.
- **Alert, notification, or toast.** Alerts sit inline beside the content they are about. Notifications announce updates without blocking. Toasts confirm what just happened and then leave, so never put the only copy of an error in a toast.
- **Empty state or alert for an error.** When a load fails and the region has nothing to show, the error is the region's state: use `bq-empty-state` with a warning icon, what failed, and a Retry button. When content is still on screen and the message is about it (a failed save, stale data, a partial failure, a maintenance notice), use `bq-alert` and keep the content.
- **Card or a hand-built container.** When the job is grouping related content in the page flow, the surface is `bq-card`, whatever the request calls it. Your header row, truncated title, badges, and actions go inside it. Change the surface only through `type`, `border`, and the card's custom properties: `--bq-card--padding`, `--bq-card--background`, `--bq-card--borderRadius`, `--bq-card--borderColor`.
- **Page title or a hand-built header.** The heading at the top of a page is `bq-page-title`. It renders the `h1`, so do not add another. A back link goes in `slot="back"`, metadata in `slot="sub-title"`, and actions or a `bq-status` in `slot="suffix"`.
- **Side menu or a hand-built list.** When selecting a row takes people somewhere (a project, a section, a settings page), use `bq-side-menu` with `bq-side-menu-item`, whatever the request calls the list. The item already lays out the icon, label, and count, truncates long labels, and shows the label in a tooltip while collapsed. Rows that do not navigate, such as files or search results, are a native list on BEEQ tokens.

## When BEEQ has nothing that fits

Build the piece from semantic HTML and BEEQ tokens, match the focus, disabled, and validation treatment of nearby BEEQ controls, and tell the user it is a custom element. Do not invent a `bq-*` tag or attribute. Pieces agents most often assume BEEQ ships:

- **Toolbar or button group**: a `div` with `role="toolbar"` and an `aria-label` around `bq-button`s; icon-only buttons take `only-icon` and a `label`.
- **Page layout, grid, or container**: consumer CSS on BEEQ tokens; see [layout-and-composition.md](layout-and-composition.md).
- **Skeleton loader**: `bq-spinner`, unless the project already has a skeleton pattern.

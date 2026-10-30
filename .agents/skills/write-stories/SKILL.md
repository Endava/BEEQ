---
name: write-stories
description: 'Write Storybook stories and MDX for a `bq-*` component: argTypes, controls and variants for every state. Use when adding or updating a component''s stories. Files live in the component''s `__storybook__/` folder.'
argument-hint: 'Component name (e.g. "bq-button") or path to the component tsx file'
metadata:
  internal: true
---

# Write BEEQ Storybook Stories

## When to Use

- Adding stories for a new `bq-*` component
- Adding missing story variants for component states
- Updating stories after a component API change
- Writing or updating the MDX documentation page

## File Locations

```
packages/beeq/src/components/<name>/__storybook__/
├── bq-<name>.stories.tsx   # Story definitions
└── bq-<name>.mdx           # Documentation page
```

## Stories File Structure

Always import from `@storybook/web-components-vite` (not `@storybook/web-components`):

```tsx
import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js'; // only if dynamic HTML needed
import { fn } from 'storybook/test';

import { isChromatic, skipSnapshotParameters } from '../../../../.storybook/chromatic-parameters';
import { BQ_COMPONENT_PROP_CONST } from '../bq-<name>.types';
import mdx from './bq-<name>.mdx';

const meta: Meta = {
  title: 'Components/<ComponentName>',
  component: 'bq-<name>',
  parameters: {
    docs: { page: mdx },
  },
  argTypes: {
    // @Prop() controls — use const arrays from types file for selects
    size: { control: 'select', options: [...BQ_COMPONENT_SIZE] },
    disabled: { control: 'boolean' },
    value: { control: 'text' },
    // Slot / story-only controls (hide from docs table)
    slotContent: { control: 'text', table: { disable: true } },
  },
  args: {
    size: 'medium',
    disabled: false,
    value: undefined,
    // @Event() handlers: use fn(), never `argTypes: { bqX: { action: 'bqX' } }`
    bqChange: fn(),
    bqFocus: fn(),
    bqBlur: fn(),
  },
};
export default meta;

type Story = StoryObj;
```

## Event Actions

Declare every `@Event()` as `args: { bqX: fn() }` (from `storybook/test`) and bind it with `@bqX=${args.bqX}`. Do not use `argTypes: { bqX: { action: 'bqX' } }`: Storybook wraps those actions in mocks, so the Actions panel logs every event twice after a control change.

## Template Pattern

Use `lit-html` tagged template literals. Handle boolean attributes with `?`:

```tsx
const Template = (args: Args) => html`
  <bq-<name>
    size=${args.size}
    ?disabled=${args.disabled}
    value=${args.value ?? nothing}
    @bqChange=${args.bqChange}
    @bqFocus=${args.bqFocus}
    @bqBlur=${args.bqBlur}
  >
    ${args.slotContent}
  </bq-<name>>
`;

export const Default: Story = {
  render: Template,
  args: {},
};
```

## Story Styling

Keep story-only styles inline in the story template. Use a `<style>` block and semantic markup instead of utility classes:

```tsx
const Template = () => html`
  <style>
    main {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--bq-spacing-m);
      padding: var(--bq-spacing-m);
    }
  </style>
  <main>
    <section>...</section>
    <section>...</section>
  </main>
`;
```

Add a BEM-style class when a selector needs to target a specific element, or when styling is reused. Do not add a separate stylesheet for a story.

## Required Story Variants

At minimum, provide stories for:

| Story | Purpose |
|---|---|
| `Default` | Component in its default state |
| `Disabled` | `disabled` prop set |
| `WithPrefix` / `WithSuffix` | Slot usage where applicable |
| One story per primary variant/appearance | e.g. `Primary`, `Secondary`, `Ghost` |

## Chromatic / Snapshot Handling

For animated or stateful components, opt out of Chromatic snapshots:

```tsx
import { skipSnapshotParameters } from '../../../../.storybook/chromatic-parameters';

export const WithAnimation: Story = {
  render: Template,
  parameters: { ...skipSnapshotParameters },
};
```

For loading states, guard against Chromatic environment:

```tsx
const Template = (args: Args) => {
  const loading = isChromatic() ? false : args.loading;
  return html`<bq-button ?loading=${loading}>...</bq-button>`;
};
```

## MDX Documentation Page

The `.mdx` file should import and use `<Stories />` and `<ArgTypes />` from `@storybook/blocks`. Reference the component's design documentation link if available from https://www.beeq.design/.

## Running Storybook

```bash
pnpm start             # run locally
pnpm build:storybook   # production build
```

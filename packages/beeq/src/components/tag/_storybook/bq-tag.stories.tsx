import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-tag.mdx';
import { SIZE_TO_VALUE_MAP, TAG_SIZE, TAG_TYPE, TAG_VARIANT } from '../bq-tag.types';

const meta: Meta = {
  title: 'Components/Tag',
  component: 'bq-tag',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    size: { control: 'select', options: [...TAG_SIZE] },
    open: { control: 'boolean' },
    type: { control: 'select', options: [...TAG_TYPE] },
    variant: { control: 'select', options: [...TAG_VARIANT] },
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    removable: { control: 'boolean' },
    'has-color': { control: 'boolean' },
    // Event handlers
    bqHide: { action: 'bqHide' },
    bqShow: { action: 'bqShow' },
    bqClick: { action: 'bqClick' },
    bqFocus: { action: 'bqFocus' },
    bqKeyDown: { action: 'bqKeyDown' },
  },
  args: {
    size: 'medium',
    open: false,
    type: 'default',
    variant: 'default',
    disabled: false,
    selected: false,
    removable: false,
    'has-color': false,
  },
};
export default meta;

type Story = StoryObj;

export const Clickable: Story = {
  render: (args: Args) => html`
    <div class="flex flex-col gap-8">
      <div class="flex flex-row gap-14">
        <bq-tag
          ?open=${args.open}
          size=${args.size}
          type=${args.type}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?selected=${args.selected}
          ?has-color=${args['has-color']}
          ?removable=${args.removable}
          @bqClick=${args.bqClick}
          @bqFocus=${args.bqFocus}
          @bqKeyDown=${args.bqKeyDown}
        >
          Tag
        </bq-tag>
        <bq-tag
          ?open=${args.open}
          size=${args.size}
          type=${args.type}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?selected=${true}
          ?has-color=${args['has-color']}
          ?removable=${args.removable}
          @bqClick=${args.bqClick}
          @bqFocus=${args.bqFocus}
          @bqKeyDown=${args.bqKeyDown}
        >
          Tag
        </bq-tag>
      </div>
      <div class="flex flex-row gap-14">
        <bq-tag
          ?open=${args.open}
          size=${args.size}
          type=${args.type}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?selected=${args.selected}
          ?has-color=${args['has-color']}
          ?removable=${args.removable}
          @bqClick=${args.bqClick}
          @bqFocus=${args.bqFocus}
          @bqKeyDown=${args.bqKeyDown}
        >
          <bq-icon
            size=${SIZE_TO_VALUE_MAP[args.size]}
            slot="prefix"
            name="star"
            part="icon"
            exportparts="base,svg"
          ></bq-icon>
          Tag
        </bq-tag>
        <bq-tag
          ?open=${args.open}
          size=${args.size}
          type=${args.type}
          variant=${args.variant}
          ?disabled=${args.disabled}
          ?selected=${true}
          ?has-color=${args['has-color']}
          ?removable=${args.removable}
          @bqClick=${args.bqClick}
          @bqFocus=${args.bqFocus}
          @bqKeyDown=${args.bqKeyDown}
        >
          <bq-icon
            size=${SIZE_TO_VALUE_MAP[args.size]}
            slot="prefix"
            name="star"
            part="icon"
            exportparts="base,svg"
          ></bq-icon>
          Tag
        </bq-tag>
      </div>
    </div>
  `,
  args: {
    open: true,
  },
};

export const Removable: Story = {
  render: (args: Args) => html`
    <div class="flex flex-col gap-8">
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type=${args.type}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type=${args.type}
        variant=${args.variant}
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        <bq-icon
          size=${SIZE_TO_VALUE_MAP[args.size]}
          slot="prefix"
          name="star"
          part="icon"
          exportparts="base,svg"
        ></bq-icon>
        Tag
      </bq-tag>
    </div>
  `,
  args: {
    open: true,
    removable: true,
  },
};

export const Outline: Story = {
  render: (args: Args) => html`
    <div class="flex flex-col gap-4">
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="success"
        variant="default"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="warning"
        variant="default"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="error"
        variant="default"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="info"
        variant="default"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="default"
        variant="default"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
    </div>
  `,
  args: {
    open: true,
    'has-color': true,
  },
};

export const Filled: Story = {
  render: (args: Args) => html`
    <div class="flex flex-col gap-4">
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="success"
        variant="filled"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="warning"
        variant="filled"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="error"
        variant="filled"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="info"
        variant="filled"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
      <bq-tag
        ?open=${args.open}
        size=${args.size}
        type="default"
        variant="filled"
        ?disabled=${args.disabled}
        ?has-color=${args['has-color']}
        ?removable=${args.removable}
      >
        Tag
      </bq-tag>
    </div>
  `,
  args: {
    open: true,
    'has-color': true,
  },
};

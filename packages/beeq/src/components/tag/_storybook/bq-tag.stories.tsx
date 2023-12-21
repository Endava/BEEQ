import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-tag.mdx';
import { TAG_COLOR, TAG_SIZE, TAG_VARIANT } from '../bq-tag.types';

const meta: Meta = {
  title: 'Components/Tag',
  component: 'bq-tag',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    clickable: { control: 'boolean' },
    color: { control: 'select', options: [...TAG_COLOR] },
    disabled: { control: 'boolean' },
    hidden: { control: 'boolean' },
    removable: { control: 'boolean' },
    selected: { control: 'boolean' },
    size: { control: 'select', options: [...TAG_SIZE] },
    variant: { control: 'select', options: [...TAG_VARIANT] },
    // Event handlers
    bqHide: { action: 'bqHide' },
    bqShow: { action: 'bqShow' },
    bqClick: { action: 'bqClick' },
    bqFocus: { action: 'bqFocus' },
    bqClose: { action: 'bqClose' },
    bqOpen: { action: 'bqOpen' },
    // Not part of the component API, but used for the story
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    clickable: false,
    color: undefined,
    disabled: false,
    hidden: false,
    removable: false,
    selected: false,
    size: 'medium',
    variant: 'filled',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-tag
    ?clickable=${args.clickable}
    color=${ifDefined(args.color)}
    ?disabled=${args.disabled}
    ?hidden=${args.hidden}
    ?removable=${args.removable}
    ?selected=${args.selected}
    size=${ifDefined(args.size)}
    variant=${ifDefined(args.variant)}
    @bqClick=${args.bqClick}
    @bqFocus=${args.bqFocus}
  >
    ${args.text}
  </bq-tag>
`;

export const Default: Story = {
  render: Template,
  args: {
    text: 'Tag',
  },
};

export const Size: Story = {
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Extra small -->
      ${Template({ ...args, size: 'xsmall', text: 'Extra small' })}
      <!-- Small -->
      ${Template({ ...args, size: 'small', text: 'Small' })}
      <!-- Medium -->
      ${Template({ ...args, size: 'medium', text: 'Medium' })}
    </div>
  `,
};

export const Clickable: Story = {
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Default -->
      ${Template({ ...args })}
      <!-- Active/Selected -->
      ${Template({ ...args, selected: true })}
    </div>
  `,
  args: {
    text: 'Tag',
    clickable: true,
  },
};

export const ColorFilled: Story = {
  name: 'Color - filled',
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Success -->
      ${Template({ ...args, color: 'success', text: 'Success' })}
      <!-- Info -->
      ${Template({ ...args, color: 'info', text: 'Info' })}
      <!-- Error -->
      ${Template({ ...args, color: 'error', text: 'Error' })}
      <!-- Warning -->
      ${Template({ ...args, color: 'warning', text: 'Warning' })}
      <!-- Gray -->
      ${Template({ ...args, color: 'gray', text: 'Gray' })}
    </div>
  `,
};

export const ColorOutline: Story = {
  name: 'Color - outline',
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Success -->
      ${Template({ ...args, color: 'success', text: 'Success' })}
      <!-- Info -->
      ${Template({ ...args, color: 'info', text: 'Info' })}
      <!-- Error -->
      ${Template({ ...args, color: 'error', text: 'Error' })}
      <!-- Warning -->
      ${Template({ ...args, color: 'warning', text: 'Warning' })}
      <!-- Gray -->
      ${Template({ ...args, color: 'gray', text: 'Gray' })}
    </div>
  `,
  args: {
    variant: 'outline',
  },
};

export const RemovableFilled: Story = {
  name: 'Removable - filled',
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Default -->
      ${Template({ ...args, text: 'Default' })}
      <!-- Success -->
      ${Template({ ...args, color: 'success', text: 'Success' })}
      <!-- Info -->
      ${Template({ ...args, color: 'info', text: 'Info' })}
      <!-- Error -->
      ${Template({ ...args, color: 'error', text: 'Error' })}
      <!-- Warning -->
      ${Template({ ...args, color: 'warning', text: 'Warning' })}
      <!-- Gray -->
      ${Template({ ...args, color: 'gray', text: 'Gray' })}
    </div>
  `,
  args: {
    removable: true,
  },
};

export const RemovableOutline: Story = {
  name: 'Removable - outline',
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Default -->
      ${Template({ ...args, text: 'Default' })}
      <!-- Success -->
      ${Template({ ...args, color: 'success', text: 'Success' })}
      <!-- Info -->
      ${Template({ ...args, color: 'info', text: 'Info' })}
      <!-- Error -->
      ${Template({ ...args, color: 'error', text: 'Error' })}
      <!-- Warning -->
      ${Template({ ...args, color: 'warning', text: 'Warning' })}
      <!-- Gray -->
      ${Template({ ...args, color: 'gray', text: 'Gray' })}
    </div>
  `,
  args: {
    removable: true,
    variant: 'outline',
  },
};

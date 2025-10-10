import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import { TAG_BORDER_RADIUS, TAG_COLOR, TAG_SIZE, TAG_VARIANT } from '../bq-tag.types';
import mdx from './bq-tag.mdx';

const meta: Meta = {
  title: 'Components/Tag',
  component: 'bq-tag',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    border: { control: 'select', options: [...TAG_BORDER_RADIUS] },
    clickable: { control: 'boolean' },
    color: { control: 'select', options: [...TAG_COLOR] },
    disabled: { control: 'boolean' },
    hidden: { control: 'boolean' },
    removable: { control: 'boolean' },
    selected: { control: 'boolean' },
    size: { control: 'select', options: [...TAG_SIZE] },
    variant: { control: 'select', options: [...TAG_VARIANT] },
    // Event handlers
    bqClose: { action: 'bqClose' },
    bqOpen: { action: 'bqOpen' },
    bqClick: { action: 'bqClick' },
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    // Not part of the component API, but used for the story
    text: { control: 'text', table: { disable: true } },
    icon: { control: 'text', table: { disable: true } },
  },
  args: {
    border: undefined,
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
    border=${ifDefined(args.border)}
    ?clickable=${args.clickable}
    color=${ifDefined(args.color)}
    ?disabled=${args.disabled}
    ?hidden=${args.hidden}
    ?removable=${args.removable}
    ?selected=${args.selected}
    size=${ifDefined(args.size)}
    variant=${ifDefined(args.variant)}
    @bqOpen=${args.bqOpen}
    @bqClose=${args.bqClose}
    @bqClick=${args.bqClick}
    @bqFocus=${args.bqFocus}
    @bqBlur=${args.bqBlur}
  >
    ${args.icon ? html`<bq-icon name=${args.icon} slot="prefix"></bq-icon>` : nothing} ${args.text}
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

export const CustomColor: Story = {
  name: 'Color - custom',
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Hex custom color -->
      ${Template({ ...args, color: '#FF5733', text: 'HEX', icon: 'yin-yang' })}
      <!-- Rgba custom color -->
      ${Template({ ...args, color: 'rgba(255, 87, 51, 0.7)', text: 'RGBA', icon: 'rss' })}
      <!-- Theme custom color palette -->
      ${Template({ ...args, color: 'sky-600', text: 'Theme Palette', icon: 'palette' })}
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

export const WithIconFilled: Story = {
  name: 'Prefix - filled',
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Default -->
      ${Template({ ...args, text: 'Default', icon: 'alarm' })}
      <!-- Success -->
      ${Template({ ...args, color: 'success', text: 'Success', icon: 'check-circle' })}
      <!-- Info -->
      ${Template({ ...args, color: 'info', text: 'Info', icon: 'info' })}
      <!-- Error -->
      ${Template({ ...args, color: 'error', text: 'Error', icon: 'warning-diamond' })}
      <!-- Warning -->
      ${Template({ ...args, color: 'warning', text: 'Warning', icon: 'warning' })}
      <!-- Gray -->
      ${Template({ ...args, color: 'gray', text: 'Gray', icon: 'video-camera-slash' })}
    </div>
  `,
  args: {
    variant: 'filled',
  },
};

export const WithIconOutline: Story = {
  name: 'Prefix - outline',
  render: (args: Args) => html`
    <div class="flex gap-s">
      <!-- Default -->
      ${Template({ ...args, text: 'Default', icon: 'alarm' })}
      <!-- Success -->
      ${Template({ ...args, color: 'success', text: 'Success', icon: 'check-circle' })}
      <!-- Info -->
      ${Template({ ...args, color: 'info', text: 'Info', icon: 'info' })}
      <!-- Error -->
      ${Template({ ...args, color: 'error', text: 'Error', icon: 'warning-diamond' })}
      <!-- Warning -->
      ${Template({ ...args, color: 'warning', text: 'Warning', icon: 'warning' })}
      <!-- Gray -->
      ${Template({ ...args, color: 'gray', text: 'Gray', icon: 'video-camera-slash' })}
    </div>
  `,
  args: {
    variant: 'outline',
  },
};

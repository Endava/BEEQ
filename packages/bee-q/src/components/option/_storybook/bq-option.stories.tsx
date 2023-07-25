import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

import mdx from './bq-option.mdx';

const meta: Meta = {
  title: 'Components/Option',
  component: 'bq-option',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    // Event handlers
    bqOptionBlur: { action: 'bqOptionBlur' },
    bqOptionFocus: { action: 'bqOptionFocus' },
    bqOptionClick: { action: 'bqOptionClick' },
    // Not part of the public API, so we don't want to expose it in the docs
    text: { control: 'text', table: { disable: true } },
    htmlNodePrefix: { control: 'object', table: { disable: true } },
    htmlNodeSuffix: { control: 'object', table: { disable: true } },
  },
  args: {
    disabled: false,
    selected: false,
    text: 'Option label',
    htmlNodePrefix: Object.assign(document.createElement('bq-icon'), {
      name: 'user',
      size: '16',
      slot: 'prefix',
    }),
    htmlNodeSuffix: Object.assign(document.createElement('bq-icon'), {
      name: 'gear',
      size: '16',
      slot: 'suffix',
    }),
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-option
    disabled=${args.disabled}
    selected=${args.selected}
    @bqOptionBlur=${args.bqOptionBlur}
    @bqOptionFocus=${args.bqOptionFocus}
    @bqOptionClick=${args.bqOptionClick}
  >
    ${args.htmlNodePrefix}
    <span>${args.text}</span>
    ${args.htmlNodeSuffix}
  </bq-option>
`;

export const Default: Story = {
  render: Template,
  args: {
    text: 'User profile',
  },
};

export const Selected: Story = {
  render: Template,
  args: {
    selected: true,
    text: 'User profile',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    text: 'Admin dashboard',
    htmlNodePrefix: Object.assign(document.createElement('bq-icon'), {
      name: 'lock',
      size: '16',
      slot: 'prefix',
    }),
    htmlNodeSuffix: Object.assign(document.createElement('bq-icon'), {
      name: 'chart-line',
      size: '16',
      slot: 'suffix',
    }),
  },
};

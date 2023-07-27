import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { ifDefined } from 'lit/directives/if-defined.js';
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
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
    // Not part of the public API, so we don't want to expose it in the docs
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    disabled: false,
    selected: false,
    text: 'Option label',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const bqIconPrefix = html`<bq-icon
    name=${ifDefined(!args.disabled ? 'user' : 'lock')}
    size="16"
    slot="prefix"
  ></bq-icon>`;

  const bqIconSuffix = html`<bq-icon
    name=${ifDefined(!args.disabled ? 'gear' : 'chart-line')}
    size="16"
    slot="suffix"
  ></bq-icon>`;

  return html`
    <bq-option-list>
      <bq-option
        ?disabled=${args.disabled}
        ?selected=${args.selected}
        @bqBlur=${args.bqBlur}
        @bqFocus=${args.bqFocus}
        @bqClick=${args.bqClick}
      >
        ${bqIconPrefix}
        <span>${args.text}</span>
        ${bqIconSuffix}
      </bq-option>
    </bq-option-list>
  `;
};

export const Default: Story = {
  render: Template,
  args: {
    text: 'User profile',
  },
};

export const Active: Story = {
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
  },
};

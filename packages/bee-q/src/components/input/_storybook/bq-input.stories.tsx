import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

import mdx from './bq-input.mdx';

const meta: Meta = {
  title: 'Components/Input',
  component: 'bq-input',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    placeholder: { control: 'text' },
    value: { control: 'text' },
    // Events
    bqChange: { action: 'bqChange' },
    bqClear: { action: 'bqClear' },
    // Not part of the public API, so we don't want to expose it in the docs
    prefix: { control: 'bolean', table: { disable: true } },
    suffix: { control: 'bolean', table: { disable: true } },
  },
  args: {
    value: undefined,
    placeholder: 'Placeholder',
    prefix: false,
    suffix: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-input placeholder=${args.placeholder} value=${args.value} @bqChange=${args.bqChange} @bqClear=${args.bqClear}>
    ${args.prefix ? html`<bq-icon name="user-circle" slot="prefix"></bq-icon>` : nothing}
    ${args.suffix ? html`<bq-icon name="gear" slot="suffix"></bq-icon>` : nothing}
  </bq-input>
`;

export const Default: Story = {
  render: Template,
};

export const Prefix: Story = {
  render: Template,
  args: {
    prefix: true,
  },
};

export const Suffix: Story = {
  render: Template,
  args: {
    suffix: true,
  },
};

export const PrefixAndSuffix: Story = {
  name: 'Prefix and Suffix',
  render: Template,
  args: {
    prefix: true,
    suffix: true,
  },
};

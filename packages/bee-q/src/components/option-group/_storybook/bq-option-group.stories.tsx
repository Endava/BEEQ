import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

import mdx from './bq-option-group.mdx';

const meta: Meta = {
  title: 'Components/Option/Grouping',
  component: 'bq-option-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    // Not part of the public API, so we don't want to expose it in the docs
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'Food',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-option-list>
    <bq-option-group>
      <span slot="header-label">${args.text}</span>

      <bq-option value="pizza">
        <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
        <span>Pizza</span>
        <bq-icon name="bowl-food" size="16" slot="suffix"></bq-icon>
      </bq-option>

      <bq-option value="seeds" disabled="true">
        <bq-icon name="lock" size="16" slot="prefix"></bq-icon>
        <span>Seeds</span>
      </bq-option>

      <bq-option value="orange">
        <span>Slice of orange</span>
        <bq-icon name="orange-slice" size="16" slot="suffix"></bq-icon>
      </bq-option>
    </bq-option-group>
  </bq-option-list>
`;

export const Default: Story = {
  render: Template,
};

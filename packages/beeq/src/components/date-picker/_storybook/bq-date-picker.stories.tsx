import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-date-picker.mdx';

const meta: Meta = {
  title: 'Components/Date picker',
  component: 'bq-date-picker',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`<bq-date-picker>${args.text}</bq-date-picker>`;

export const Default: Story = {
  render: Template,
  args: {},
};

import { html } from 'lit-html';
import mdx from './bq-option.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Option',
  component: 'bq-option',
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

const Template = (args: Args) => html`<bq-option>${args.text}</bq-option>`;

export const Default: Story = {
  render: Template,
  args: {},
};

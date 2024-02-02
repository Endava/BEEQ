import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-card.mdx';

const meta: Meta = {
  title: 'Components/Card',
  component: 'bq-card',
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

const Template = (args: Args) => html`<bq-card>${args.text}</bq-card>`;

export const Default: Story = {
  render: Template,
  args: {},
};

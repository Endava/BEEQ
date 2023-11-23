import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-alert.mdx';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'bq-alert',
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

const Template = (args: Args) => html`<bq-alert>${args.text}</bq-alert>`;

export const Default: Story = {
  render: Template,
  args: {},
};

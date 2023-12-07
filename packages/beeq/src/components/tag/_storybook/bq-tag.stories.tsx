import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

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
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`<bq-tag>${args.text}</bq-tag>`;

export const Default: Story = {
  render: Template,
  args: {},
};

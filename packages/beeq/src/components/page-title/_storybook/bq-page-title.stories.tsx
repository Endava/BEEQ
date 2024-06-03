import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-page-title.mdx';

const meta: Meta = {
  title: 'Components/Page title',
  component: 'bq-page-title',
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

const Template = (args: Args) => html`<bq-page-title>${args.text}</bq-page-title>`;

export const Default: Story = {
  render: Template,
  args: {},
};

import { html } from 'lit-html';
import mdx from './bq-breadcrumb.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  component: 'bq-breadcrumb',
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

const Template = (args: Args) => html`<bq-breadcrumb>${args.text}</bq-breadcrumb>`;

export const Default: Story = {
  render: Template,
  args: {},
};

import { html } from 'lit-html';
import mdx from './bq-side-menu.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Side menu',
  component: 'bq-side-menu',
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

const Template = (args: Args) => html`<bq-side-menu>${args.text}</bq-side-menu>`;

export const Default: Story = {
  render: Template,
  args: {},
};

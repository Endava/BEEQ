import { html } from 'lit-html';
import mdx from './bq-panel.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Panel',
  component: 'bq-panel',
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

const Template = (args: Args) => html`<bq-panel>${args.text}</bq-panel>`;

export const Default: Story = {
  render: Template,
  args: {},
};

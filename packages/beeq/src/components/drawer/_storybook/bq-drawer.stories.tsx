import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-drawer.mdx';

const meta: Meta = {
  title: 'Components/Drawer',
  component: 'bq-drawer',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    // Events
    bqShow: { action: 'bqOpen' },
    bqHide: { action: 'bqClose' },
    bqAfterOpen: { action: 'bqAfterOpen' },
    bqAfterClose: { action: 'bqAfterClose' },
  },
  args: {
    open: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) =>
  html`<div class="w-80">
    <bq-drawer ?open=${args.open}>Title</bq-drawer>
  </div>`;

export const Default: Story = {
  render: Template,
  args: {
    open: true,
  },
};

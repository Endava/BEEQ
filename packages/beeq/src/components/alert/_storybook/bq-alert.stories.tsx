import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

import mdx from './bq-alert.mdx';
import { ALERT_TYPE } from '../bq-alert.types';

const meta: Meta = {
  title: 'Components/Alert',
  component: 'bq-alert',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'disable-close': { control: 'boolean' },
    'hide-icon': { control: 'boolean' },
    open: { control: 'boolean' },
    type: { control: 'select', options: [...ALERT_TYPE] },
    // Not part of the component API, but used for the story
    customIcon: { control: 'booolean', table: { disabled: true } },
  },
  args: {
    'disable-close': false,
    'hide-icon': false,
    open: false,
    type: 'info',
    // Not part of the component API, but used for the story
    customIcon: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div class="flex flex-row gap-4">
    <bq-alert
      ?disable-close=${args['disable-close']}
      ?hide-icon=${args['hide-icon']}
      ?open=${args.open}
      type=${args.type}
    >
      ${args.customIcon ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
    </bq-alert>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    open: true,
  },
};

export const SuccessType: Story = {
  name: 'Success',
  render: Template,
  args: {
    open: true,
    type: 'success',
  },
};

export const WarningType: Story = {
  name: 'Warning',
  render: Template,
  args: {
    open: true,
    type: 'warning',
  },
};

export const ErrorType: Story = {
  name: 'Error',
  render: Template,
  args: {
    open: true,
    type: 'error',
  },
};

export const CustomIcon: Story = {
  render: Template,
  args: {
    open: true,
    customIcon: true,
  },
};

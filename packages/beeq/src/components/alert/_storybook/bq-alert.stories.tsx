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
    'auto-dismiss': { control: 'boolean' },
    'disable-close': { control: 'boolean' },
    'hide-icon': { control: 'boolean' },
    sticky: { control: 'boolean' },
    open: { control: 'boolean' },
    time: { control: 'number' },
    type: { control: 'select', options: [...ALERT_TYPE] },
    // Not part of the component API, but used for the story
    customIcon: { control: 'booolean', table: { disabled: true } },
  },
  args: {
    'auto-dismiss': false,
    'disable-close': false,
    'hide-icon': false,
    sticky: false,
    open: false,
    time: 3000,
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
      ?auto-dismiss=${args['auto-dismiss']}
      ?disable-close=${args['disable-close']}
      ?hide-icon=${args['hide-icon']}
      ?open=${args.open}
      time=${args.time}
      type=${args.type}
    >
      ${args.customIcon ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
    </bq-alert>

    <bq-alert
      ?auto-dismiss=${args['auto-dismiss']}
      ?disable-close=${args['disable-close']}
      ?hide-icon=${args['hide-icon']}
      ?open=${args.open}
      time=${args.time}
      type=${args.type}
    >
      ${args.customIcon ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
      <span slot="body">
        Description
        <a class="bq-link" href="https://example.com">Link</a>
      </span>
    </bq-alert>

    <bq-alert
      ?auto-dismiss=${args['auto-dismiss']}
      ?disable-close=${args['disable-close']}
      ?hide-icon=${args['hide-icon']}
      ?open=${args.open}
      time=${args.time}
      type=${args.type}
    >
      ${args.customIcon ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
      <span slot="body">
        Description
        <a class="bq-link" href="https://example.com">Link</a>
      </span>
      <div class="flex gap-xs" slot="footer">
        <bq-button appearance="primary" size="small"> Button </bq-button>
        <bq-button appearance="link" size="small"> Button </bq-button>
      </div>
    </bq-alert>
  </div>
`;

const TemplateSticky = (args: Args) => html`
  <div class="flex">
    <bq-alert
      ?auto-dismiss=${args['auto-dismiss']}
      ?disable-close=${args['disable-close']}
      ?hide-icon=${args['hide-icon']}
      ?sticky=${args['sticky']}
      ?open=${args.open}
      time=${args.time}
      type=${args.type}
    >
      ${args.customIcon ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
      <bq-button appearance="link" size="small"> Button </bq-button>
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
    type: 'custom',
  },
};

export const NormalSticky: Story = {
  name: 'Sticky',
  render: TemplateSticky,
  args: {
    open: true,
  },
};

export const StickyTemplate: Story = {
  name: 'Custom Sticky',
  render: TemplateSticky,
  args: {
    open: true,
    customIcon: true,
    type: 'custom',
  },
};

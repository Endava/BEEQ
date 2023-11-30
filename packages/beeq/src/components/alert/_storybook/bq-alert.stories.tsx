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
  },
  args: {
    'auto-dismiss': false,
    'disable-close': false,
    'hide-icon': false,
    sticky: false,
    open: false,
    time: 3000,
    type: 'default',
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
      ${args.type === 'default' ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
    </bq-alert>

    <bq-alert
      ?auto-dismiss=${args['auto-dismiss']}
      ?disable-close=${args['disable-close']}
      ?hide-icon=${args['hide-icon']}
      ?open=${args.open}
      time=${args.time}
      type=${args.type}
    >
      ${args.type === 'default' ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
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
      ${args.type === 'default' ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
      ${!args.sticky
        ? html`
            <span slot="body">
              Description
              <a class="bq-link" href="https://example.com">Link</a>
            </span>
            <div class="flex gap-xs" slot="footer">
              <bq-button appearance="primary" size="small"> Button </bq-button>
              <bq-button appearance="link" size="small"> Button </bq-button>
            </div>
          `
        : nothing}
    </bq-alert>
  </div>
`;

const TemplateSticky = (args: Args) => html`
  <bq-alert
    ?auto-dismiss=${args['auto-dismiss']}
    ?disable-close=${args['disable-close']}
    ?hide-icon=${args['hide-icon']}
    ?sticky=${args['sticky']}
    ?open=${args.open}
    time=${args.time}
    type=${args.type}
  >
    ${args.type === 'default' ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
    <bq-button appearance="link" size="small"> Button </bq-button>
  </bq-alert>
  <main class="grid grid-cols-1 p-m">
    <h1 class="mb-l">Dashboard</h1>
    <div class="h-80 w-full border border-dashed border-stroke-primary bg-ui-primary-alt"></div>
  </main>
`;

export const Default: Story = {
  render: Template,
  args: {
    open: true,
  },
};

export const Info: Story = {
  render: Template,
  args: {
    open: true,
    type: 'info',
  },
};

export const Success: Story = {
  render: Template,
  args: {
    open: true,
    type: 'success',
  },
};

export const Warning: Story = {
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

export const Sticky: Story = {
  render: TemplateSticky,
  args: {
    open: true,
    sticky: true,
    type: 'error',
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-alert.mdx';
import { ALERT_BORDER_RADIUS, ALERT_TYPE } from '../bq-alert.types';

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
    border: { control: 'select', options: [...ALERT_BORDER_RADIUS] },
    sticky: { control: 'boolean' },
    open: { control: 'boolean' },
    time: { control: 'number' },
    type: { control: 'select', options: [...ALERT_TYPE] },
    // Events
    bqShow: { action: 'bqShow' },
    bqAfterShow: { action: 'bqAfterShow' },
    bqHide: { action: 'bqHide' },
    bqAfterHide: { action: 'bqAfterHide' },
  },
  args: {
    'auto-dismiss': false,
    'disable-close': false,
    'hide-icon': false,
    border: 's',
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
      border=${ifDefined(args.border)}
      ?open=${args.open}
      time=${ifDefined(args.time)}
      type=${ifDefined(args.type)}
      @bqShow=${args.bqShow}
      @bqAfterShow=${args.bqAfterShow}
      @bqHide=${args.bqHide}
      @bqAfterHide=${args.bqAfterHide}
    >
      ${args.type === 'default' ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
    </bq-alert>

    <bq-alert
      ?auto-dismiss=${args['auto-dismiss']}
      ?disable-close=${args['disable-close']}
      ?hide-icon=${args['hide-icon']}
      border=${ifDefined(args.border)}
      ?open=${args.open}
      time=${ifDefined(args.time)}
      type=${ifDefined(args.type)}
      @bqShow=${args.bqShow}
      @bqAfterShow=${args.bqAfterShow}
      @bqHide=${args.bqHide}
      @bqAfterHide=${args.bqAfterHide}
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
      border=${ifDefined(args.border)}
      ?open=${args.open}
      time=${ifDefined(args.time)}
      type=${ifDefined(args.type)}
      @bqShow=${args.bqShow}
      @bqAfterShow=${args.bqAfterShow}
      @bqHide=${args.bqHide}
      @bqAfterHide=${args.bqAfterHide}
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
    border=${ifDefined(args.border)}
    ?open=${args.open}
    time=${ifDefined(args.time)}
    type=${ifDefined(args.type)}
    @bqShow=${args.bqShow}
    @bqAfterShow=${args.bqAfterShow}
    @bqHide=${args.bqHide}
    @bqAfterHide=${args.bqAfterHide}
  >
    ${args.type === 'default' ? html`<bq-icon name="star" slot="icon"></bq-icon>` : nothing} Title
    <bq-button appearance="link" size="small"> Button </bq-button>
  </bq-alert>
  <main class="grid grid-cols-1 p-b-m p-i-m">
    <h1 class="m-be-l">Dashboard</h1>
    <div class="border border-dashed border-primary bg-[--bq-ui--alt] bs-80 is-full"></div>
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

export const WithTrigger: Story = {
  render: (args: Args) => {
    const handleFormSubmit = async (ev: Event) => {
      ev.preventDefault();

      const bqAlertElem = document.querySelector('bq-alert');
      if (!bqAlertElem) return;

      await bqAlertElem.show();
    };

    const handleFormReset = async () => {
      const bqAlertElem = document.querySelector('bq-alert');
      if (!bqAlertElem) return;

      await bqAlertElem.hide();
    };

    return html`
      <bq-card>
        <form id="change-password" class="flex flex-col gap-y-m" @submit=${handleFormSubmit} @reset=${handleFormReset}>
          <!-- Alert -->
          <bq-alert
            ?auto-dismiss=${args['auto-dismiss']}
            ?disable-close=${args['disable-close']}
            ?hide-icon=${args['hide-icon']}
            ?sticky=${args['sticky']}
            border=${args.border}
            ?open=${args.open}
            time=${args.time}
            type=${args.type}
            @bqShow=${args.bqShow}
            @bqAfterShow=${args.bqAfterShow}
            @bqHide=${args.bqHide}
            @bqAfterHide=${args.bqAfterHide}
          >
            There were 2 errors with your submission
            <span slot="body">
              <ul class="ps-m m-be-0 m-bs-0">
                <li>Your password must be at least 8 characters</li>
                <li>Your password must include at least one pro wrestling finishing move</li>
              </ul>
            </span>
          </bq-alert>
          <bq-input name="password" type="password" required>
            <label class="flex flex-grow items-center" slot="label">Password</label>
          </bq-input>
          <bq-input name="confirm-password" type="password" required>
            <label class="flex flex-grow items-center" slot="label">Confirm Password</label>
          </bq-input>
          <div class="flex justify-end gap-x-m">
            <bq-button appearance="secondary" type="reset">Cancel</bq-button>
            <bq-button type="submit">Save</bq-button>
          </div>
        </form>
      </bq-card>
    `;
  },
  args: {
    type: 'error',
  },
};

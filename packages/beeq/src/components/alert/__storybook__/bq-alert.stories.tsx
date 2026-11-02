import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

import { ALERT_BORDER_RADIUS, ALERT_TYPE } from '../bq-alert.types';
import mdx from './bq-alert.mdx';

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
    // Events
    bqShow: fn(),
    bqAfterShow: fn(),
    bqHide: fn(),
    bqAfterHide: fn(),
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <style>
    .bq-story-alert {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    .bq-story-alert div[slot='footer'] {
      display: flex;
      gap: var(--bq-spacing-xs);
    }
  </style>
  <div class="bq-story-alert">
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
      ${
        !args.sticky
          ? html`
            <span slot="body">
              Description
              <a class="bq-link" href="https://example.com">Link</a>
            </span>
            <div slot="footer">
              <bq-button appearance="primary" size="small"> Button </bq-button>
              <bq-button appearance="link" size="small"> Button </bq-button>
            </div>
          `
          : nothing
      }
    </bq-alert>
  </div>
`;

const TemplateSticky = (args: Args) => html`
  <style>
    .bq-story-alert-sticky {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      padding-block: var(--bq-spacing-m);
      padding-inline: var(--bq-spacing-m);
    }

    .bq-story-alert-sticky h1 {
      margin-block-end: var(--bq-spacing-l);
    }

    .bq-story-alert-sticky > div {
      border-style: dashed;
      border-color: var(--bq-stroke--primary);
      background-color: var(--bq-ui--alt);
      block-size: 20rem;
      inline-size: 100%;
    }
  </style>
  <bq-alert
    ?auto-dismiss=${args['auto-dismiss']}
    ?disable-close=${args['disable-close']}
    ?hide-icon=${args['hide-icon']}
    ?sticky=${args.sticky}
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
  <main class="bq-story-alert-sticky">
    <h1>Dashboard</h1>
    <div></div>
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
      <style>
        .bq-story-alert-form form {
          display: flex;
          flex-direction: column;
          row-gap: var(--bq-spacing-m);
        }

        .bq-story-alert-form ul {
          padding-inline-start: var(--bq-spacing-m);
          margin-block-end: 0px;
          margin-block-start: 0px;
        }

        .bq-story-alert-form label[slot='label'] {
          display: flex;
          flex-grow: 1;
          align-items: center;
        }

        .bq-story-alert-form form > div {
          display: flex;
          justify-content: flex-end;
          column-gap: var(--bq-spacing-m);
        }
      </style>
      <bq-card class="bq-story-alert-form">
        <form id="change-password" @submit=${handleFormSubmit} @reset=${handleFormReset}>
          <!-- Alert -->
          <bq-alert
            ?auto-dismiss=${args['auto-dismiss']}
            ?disable-close=${args['disable-close']}
            ?hide-icon=${args['hide-icon']}
            ?sticky=${args.sticky}
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
              <ul>
                <li>Your password must be at least 8 characters</li>
                <li>Your password must include at least one pro wrestling finishing move</li>
              </ul>
            </span>
          </bq-alert>
          <bq-input name="password" type="password" required>
            <label slot="label">Password</label>
          </bq-input>
          <bq-input name="confirm-password" type="password" required>
            <label slot="label">Confirm Password</label>
          </bq-input>
          <div>
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

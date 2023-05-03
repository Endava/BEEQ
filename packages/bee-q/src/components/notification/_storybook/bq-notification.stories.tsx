import { html } from 'lit-html';
import mdx from './bq-notification.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { NOTIFICATION_TYPE } from '../bq-notification.types';

const meta: Meta = {
  title: 'Components/Notification',
  component: 'bq-notification',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'auto-dismiss': { control: 'boolean' },
    'disable-close': { control: 'boolean' },
    'has-custom-icon': { control: 'boolean' },
    'hide-icon': { control: 'boolean' },
    'is-open': { control: 'boolean' },
    time: { control: 'number' },
    type: { control: 'select', options: [...NOTIFICATION_TYPE] },
  },
  args: {
    'auto-dismiss': false,
    'disable-close': false,
    'has-custom-icon': false,
    'hide-icon': false,
    'is-open': false,
    time: 3000,
    type: 'info',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div class="flex flex-row gap-4">
    <bq-notification
      ?disable-close=${args['disable-close']}
      ?has-custom-icon=${args['has-custom-icon']}
      ?hide-icon=${args['hide-icon']}
      ?is-open=${args['is-open']}
      type=${args.type}
    >
      Title
    </bq-notification>

    <bq-notification
      ?disable-close=${args['disable-close']}
      ?has-custom-icon=${args['has-custom-icon']}
      ?hide-icon=${args['hide-icon']}
      ?is-open=${args['is-open']}
      type=${args.type}
    >
      Title
      <span slot="body">
        This is some description text text
        <a class="bq-link" href="https://example.com">Link</a>
      </span>
    </bq-notification>

    <bq-notification
      ?disable-close=${args['disable-close']}
      ?has-custom-icon=${args['has-custom-icon']}
      ?hide-icon=${args['hide-icon']}
      ?is-open=${args['is-open']}
      type=${args.type}
    >
      Title
      <span slot="body">
        This is some description text text
        <a class="bq-link" href="https://example.com">Link</a>
      </span>
      <div slot="footer">
        <bq-button appearance="primary" size="small"> Button </bq-button>
        <bq-button appearance="secondary" size="small"> Button </bq-button>
      </div>
    </bq-notification>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    'is-open': true,
  },
};

export const Error: Story = {
  render: Template,
  args: {
    'is-open': true,
    type: 'error',
  },
};

export const Neutral: Story = {
  render: Template,
  args: {
    'is-open': true,
    type: 'neutral',
  },
};

export const Success: Story = {
  render: Template,
  args: {
    'is-open': true,
    type: 'success',
  },
};

export const Warning: Story = {
  render: Template,
  args: {
    'is-open': true,
    type: 'warning',
  },
};

export const Stacked: Story = {
  render: (args: Args) => {
    const onButtonClick = (ev: CustomEvent) => {
      const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
      const type = getRandom(NOTIFICATION_TYPE as unknown as string[]) as string;

      const notification = Object.assign(document.createElement('bq-notification'), {
        type,
        autoDismiss: args['auto-dismiss'],
        disableClose: args['disable-close'],
        hideIcon: args['hide-icon'],
        time: args.time,
        innerHTML: `
          Title
          <span slot="body">
            Here goes the description for the <strong>${type} notification</strong><br />
            You can also add a <a class="bq-link" href="https://example.com">Link</a>
          </span>
        `,
      });

      document.body.append(notification);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (notification as any).toast();
    };

    return html`
      <p class="mb-0">
        The nofitication component creates and manages the notification portal, a fixed-position element that allows for
        stacking multiple notifications vertically.
      </p>
      <p class="mb-6">
        Only one instance of the notification portal exists and it is added or removed from the DOM as required when
        notifications are displayed.
      </p>
      <bq-button @bqClick=${onButtonClick}>Open notification</bq-button>
    `;
  },
  args: {
    'auto-dismiss': true,
    time: 3500,
  },
};

import { html } from 'lit-html';
import mdx from './bq-notification.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { NOTIFICATION_TYPE } from '../bg-notification.types';

const meta: Meta = {
  title: 'Components/Notification',
  component: 'bq-notification',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    type: { control: 'select', options: [...NOTIFICATION_TYPE] },
    'has-custom-icon': { control: 'boolean' },
    'hide-icon': { control: 'boolean' },
    'is-open': { control: 'boolean' },
    'disable-close': { control: 'boolean' },
  },
  args: {
    type: 'neutral',
    'has-custom-icon': false,
    'hide-icon': false,
    'is-open': false,
    'disable-close': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-notification
    ?disable-close=${args['disable-close']}
    ?has-custom-icon=${args['has-custom-icon']}
    ?hide-icon=${args['hide-icon']}
    ?is-open=${args['is-open']}
    type=${args.type}
  >
    Title
    <span slot="body"> This is some description text text <a class="bq-link" href="https://example.com">Link</a> </span>
    <div slot="footer">
      <bq-button appearance="primary" size="small"> Button </bq-button>
      <bq-button appearance="secondary" size="small"> Button </bq-button>
    </div>
  </bq-notification>
`;

export const Default: Story = {
  render: Template,
  args: {
    'is-open': true,
  },
};

export const Demo: Story = {
  render: () => {
    const onButtonClick = (ev: CustomEvent) => {
      const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

      const notification = Object.assign(document.createElement('bq-notification'), {
        type: getRandom(NOTIFICATION_TYPE as unknown as string[]) as string,
        innerHTML: `
          Title
          <span slot="body"> This is some description text text <a class="bq-link" href="https://example.com">Link</a> </span>
        `,
      });

      document.body.append(notification);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (notification as any).toast();
    };

    return html` <bq-button @bqClick=${onButtonClick}>Open notification</bq-button> `;
  },
};

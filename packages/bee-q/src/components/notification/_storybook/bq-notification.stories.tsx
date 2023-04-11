import { html } from 'lit-html';
import mdx from './bq-notification.mdx';
import { NOTIFICATION_TYPE } from '../bg-notification.types';

export default {
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
    type: 'default',
    'has-custom-icon': false,
    'hide-icon': false,
    'is-open': false,
    'disable-close': false,
  },
};

const Template = (args) => {
  const showNotification = async () => {
    await customElements.whenDefined('bq-notification');
    const notificationElement = document.querySelector('bq-notification');

    await notificationElement.show();
  };

  return html`
    <div>
      <div class="mb-2 inline-block w-full text-center">
        <bq-button appearance="primary" type="button" variant="standard" @bqClick=${showNotification}>
          Open Notification
        </bq-button>
      </div>
      <div class="inline-block w-full text-center">
        <bq-notification
          disable-close=${args['disable-close']}
          has-custom-icon=${args['has-custom-icon']}
          hide-icon=${args['hide-icon']}
          is-open=${args['is-open']}
          type=${args.type}
        >
          Title
          <span slot="body">
            This is some description text text <a class="link" href="https://example.com">Link</a>
          </span>
          <div slot="footer">
            <bq-button slot="footer" appearance="primary" size="small" type="button" variant="standard">
              Button
            </bq-button>
            <bq-button slot="footer" appearance="secondary" size="small" type="button" variant="standard">
              Button
            </bq-button>
          </div>
        </bq-notification>
      </div>
    </div>
  `;
};

export const Default = Template.bind({});

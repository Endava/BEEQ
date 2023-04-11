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
    showIcon: { control: 'boolean' },
    showClose: { control: 'boolean' },
    subjectColor: { control: 'text' },
  },
  args: {
    type: 'default',
    showIcon: true,
    showClose: true,
    subjectColor: '',
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
        <bq-button
          appearance="primary"
          href=""
          size="small"
          target=""
          type="button"
          variant="standard"
          @bqClick=${showNotification}
        >
          Open Notification
        </bq-button>
      </div>
      <div class="inline-block w-full text-center">
        <bq-notification
          type=${args.type}
          show-icon=${args.showIcon}
          subject-color=${args.subjectColor}
          show-close=${args.showClose}
        >
          Title
          <span slot="description">
            This is some description text text <a class="link" href="https://example.com">Link</a>
          </span>
          <bq-avatar
            slot="avatar"
            alt-text=""
            image=""
            label="Avatar component label"
            initials="JS"
            shape="circle"
            size="small"
          ></bq-avatar>
          <div slot="notification-footer">
            <bq-button appearance="primary" href="" size="small" target="" type="button" variant="standard">
              Button
            </bq-button>
            <bq-button appearance="secondary" href="" size="small" target="" type="button" variant="standard">
              Button
            </bq-button>
          </div>
        </bq-notification>
      </div>
    </div>
  `;
};

export const Default = Template.bind({});

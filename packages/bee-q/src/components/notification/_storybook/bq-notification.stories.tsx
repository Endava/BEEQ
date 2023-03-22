import { html } from 'lit-html';
import mdx from './bq-notification.mdx';
import { NOTIFICATION_TYPES } from '../bg-notification-types';

export default {
  title: 'Components/Notification',
  component: 'bq-notification',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    type: { control: 'select', options: [...NOTIFICATION_TYPES] },
    showIcon: { control: 'boolean' },
    showClose: { control: 'boolean' },
    subjectColor: { control: 'text' },
  },
  args: {
    type: 'info',
    showIcon: true,
    showClose: true,
    subjectColor: 'data--black',
  },
};

const Template = (args) => {
  const showNotification = async () => {
    await customElements.whenDefined('bq-notification');
    const notificationElement = document.querySelector('bq-notification');

    await notificationElement.showNotification();
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
          <span slot="description"
            >This is some description text text <a class="link" href="https://example.com">Link</a></span
          >
          <bq-avatar
            slot="avatar"
            alt-text=""
            image=""
            label="Avatar component label"
            initials="JS"
            shape="circle"
            size="small"
          ></bq-avatar>
          <bq-button
            slot="first-button"
            appearance="primary"
            href=""
            size="small"
            target=""
            type="button"
            variant="standard"
          >
            Button
          </bq-button>
          <bq-button
            slot="second-button"
            appearance="secondary"
            href=""
            size="small"
            target=""
            type="button"
            variant="standard"
          >
            Button
          </bq-button>
        </bq-notification>
      </div>
    </div>
  `;
};

export const Default = Template.bind({});

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
    description: { control: 'text' },
    href: { control: 'text' },
    showIcon: { control: 'boolean' },
    showClose: { control: 'boolean' },
    subjectColor: { control: 'text' },
  },
  args: {
    type: 'info',
    description: 'This is some description text text',
    href: 'https://example.com',
    showIcon: true,
    showClose: true,
    subjectColor: 'data--black',
  },
};

const Template = (args) => {
  return html` <bq-notification
    type=${args.type}
    description=${args.description}
    href=${args.href}
    show-icon=${args.showIcon}
    subject-color=${args.subjectColor}
    show-close=${args.showClose}
  >
    Title
    <bq-avatar
      slot="avatar"
      alt-text=""
      image=""
      label="Avatar component label"
      initials="JS"
      shape="circle"
      size="small"
    ></bq-avatar>
    <bq-button slot="first-button" appearance="primary" href="" size="small" target="" type="button" variant="standard">
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
  </bq-notification>`;
};

export const Default = Template.bind({});

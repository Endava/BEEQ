import { html } from 'lit-html';
import { TOAST_TYPE } from '../bq-toast.types';
import mdx from './bq-toast.mdx';

export default {
  title: 'Components/Toast',
  component: 'bq-toast',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    type: { control: 'select', options: [...TOAST_TYPE] },
    textColor: { control: 'text' },
    icon: { control: 'text' },
  },
  args: {
    type: 'default',
    textColor: 'ui--brand',
    icon: 'default',
  },
};

const Template = (args) => {
  const showToast = async () => {
    await customElements.whenDefined('bq-toast');
    const notificationElement = document.querySelector('bq-toast');

    await notificationElement.showToast();
  };
  return html`
    <div class="mb-2 inline-block w-full text-left">
      <bq-button appearance="primary" size="small" target="" type="button" variant="standard" @bqClick=${showToast}>
        Show Toast!
      </bq-button>
    </div>
    <div class="mb-2 inline-block w-full text-left">
      <bq-toast type=${args.type} icon=${args.icon} text-color=${args.textColor}>
        <span slot="text">This is some toast text message! </span></bq-toast
      >
    </div>
  `;
};

export const Default = (args) => Template(args);

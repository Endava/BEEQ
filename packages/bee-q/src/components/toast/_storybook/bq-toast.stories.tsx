import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-toast.mdx';
import { TOAST_TYPE } from '../bq-toast.types';

const meta: Meta = {
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
    autoCloseTime: { control: 'number' },
  },
  args: {
    type: 'default',
    textColor: 'ui--brand',
    autoCloseTime: 5000,
  },
};

export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const showToast = async () => {
    await customElements.whenDefined('bq-toast');
    const toastElement = document.querySelector('bq-toast');

    await toastElement.showToast();
  };
  return html`
    <div class="mb-2 inline-block w-full text-left">
      <bq-button appearance="primary" size="small" target="" type="button" variant="standard" @bqClick=${showToast}>
        Show Toast!
      </bq-button>
    </div>
    <div class="mb-2 inline-block w-full text-left">
      <bq-toast type=${args.type} icon=${args.icon} text-color=${args.textColor} auto-close-time=${args.autoCloseTime}>
        <bq-icon slot="icon" name="info" color="ui--brand" size="24" weight="bold"></bq-icon>
        <span slot="text">This is some toast text message! </span></bq-toast
      >
    </div>
  `;
};

export const Default: Story = {
  render: Template,
  args: {},
};

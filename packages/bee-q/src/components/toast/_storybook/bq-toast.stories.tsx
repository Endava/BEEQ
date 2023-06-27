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
    'hide-icon': { control: 'boolean' },
    open: { control: 'boolean' },
    time: { control: 'number' },
    text: { control: 'text', table: { disable: true } },
    // Event handlers
    bqShow: { action: 'bqShow' },
    bqHide: { action: 'bqHide' },
  },
  args: {
    type: 'info',
    'hide-icon': false,
    open: false,
    time: 3000,
    text: 'This is a message',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const onToastHide = (event) => {
    event.preventDefault();
  };

  return html`${TOAST_TYPE.map(
    (type) => html`
      <div class="mb-xs2">
        <bq-toast
          type=${type}
          hide-icon=${args['hide-icon']}
          open=${args.open}
          time=${args.time}
          @bqHide=${onToastHide}
        >
          ${args.text}
          ${type === 'custom' ? html`<bq-icon slot="icon" size="24" weight="bold" name="star"></bq-icon>` : null}
        </bq-toast>
      </div>
    `,
  )} `;
};

export const Default: Story = {
  render: Template,
  argTypes: {
    type: { control: 'select', table: { disable: true } },
    time: { control: 'number', table: { disable: true } },
    open: { control: 'boolean', table: { disable: true } },
  },
  args: {
    open: true,
  },
};

const CustomIconTemplate = (args: Args) => {
  const toggleToast = async () => {
    const toast = document.querySelector('bq-toast');

    if (!toast.open) {
      await toast.show();
    } else {
      await toast.hide();
    }
  };

  return html`
    <bq-button @bqClick=${toggleToast}>Toggle toast</bq-button>
    <bq-toast
      type=${args.type}
      hide-icon=${args['hide-icon']}
      open=${args.open}
      time=${args.time}
      @bqShow=${args.bqHide}
      @bqHide=${args.bqHide}
    >
      ${args.text}
      <bq-icon slot="icon" size="24" weight="bold" name="star"></bq-icon>
    </bq-toast>
  `;
};

export const Custom: Story = {
  render: CustomIconTemplate,
  args: {
    type: 'success',
  },
};

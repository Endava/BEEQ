import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-toast.mdx';
import { getRandomFromArray } from '../../../shared/utils';
import { TOAST_PLACEMENT, TOAST_TYPE } from '../bq-toast.types';

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
    placement: { control: 'select', options: [...TOAST_PLACEMENT] },
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
    placement: 'bottom-center',
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
    args.bqHide(event);
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
          placement=${args.placement}
          @bqShow=${args.bqShow}
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
  const onToastHide = (event) => {
    args.bqHide(event);
    event.preventDefault();
  };

  return html`
    <bq-toast
      type=${args.type}
      hide-icon=${args['hide-icon']}
      open=${args.open}
      time=${args.time}
      placement=${args.placement}
      @bqShow=${args.bqShow}
      @bqHide=${onToastHide}
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
    open: true,
  },
};

const StackableTemplate = (args: Args) => {
  const toggleToast = async () => {
    const toast = document.createElement('bq-toast');

    const [type] = getRandomFromArray(TOAST_TYPE as unknown as unknown[], 1);

    Object.assign(toast, {
      type: type,
      hideIcon: args['hide-icon'],
      time: args.time,
      open: args.open,
      placement: args.placement,
      innerHTML: args.text,
    });

    document.body.append(toast);

    await toast.toast();
  };

  return html` <bq-button @bqClick=${toggleToast}>Toggle toast</bq-button> `;
};

export const Stackable: Story = {
  render: StackableTemplate,
  argTypes: {
    type: { control: 'select', table: { disable: true } },
    open: { control: 'boolean', table: { disable: true } },
  },
  args: {},
};

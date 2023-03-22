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
    text: { control: 'text' },
    textColor: { control: 'text' },
    icon: { control: 'text' },
  },
  args: {
    type: 'default',
    text: 'This is toast message!',
    textColor: 'ui--brand',
    icon: 'default',
  },
};

const Template = (args) => {
  return html`<bq-toast
    text=${args.text}
    type=${args.type}
    icon=${args.icon}
    text-color=${args.textColor}
  ></bq-toast> `;
};

export const Default = (args) => Template(args);

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
  return html`<bq-toast type=${args.type} icon=${args.icon} text-color=${args.textColor}>
    <span slot="text">This is some toast text message! </span></bq-toast
  > `;
};

export const Default = (args) => Template(args);

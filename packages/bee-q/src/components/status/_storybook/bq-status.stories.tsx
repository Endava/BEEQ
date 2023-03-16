import { html } from 'lit-html';
import mdx from './bq-status.mdx';
import { STATUS_TYPE } from '../bq-status.types';

export default {
  title: 'Components/Status',
  component: 'bq-status',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    type: { control: 'select', options: [...STATUS_TYPE] },
    // This control is not part of the component
    label: { control: 'text' },
  },
  args: {
    type: 'neutral',
  },
};

const Template = (args) => html`<bq-status type=${args.type}>${args.label}</bq-status> `;

export const Neutral = (args) => Template(args);
Neutral.args = {
  label: 'Neutral status',
};

export const Success = (args) => Template(args);
Success.args = {
  label: 'Success status',
  type: 'success',
};

export const Danger = (args) => Template(args);
Danger.args = {
  label: 'Danger status',
  type: 'danger',
};

export const Info = (args) => Template(args);
Info.args = {
  label: 'Information status',
  type: 'info',
};

export const Alert = (args) => Template(args);
Alert.args = {
  label: 'Alert status',
  type: 'alert',
};

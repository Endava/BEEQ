import { html } from 'lit-html';
import mdx from './bq-spinner.mdx';
import { SPINNER_TEXT_POSITION, SPINNER_SIZE } from '../bq-spinner.types';

export default {
  title: 'Components/Spinner',
  component: 'bq-spinner',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    animation: { control: 'boolean' },
    'text-position': { control: 'select', options: [...SPINNER_TEXT_POSITION] },
    size: { control: 'select', options: [...SPINNER_SIZE] },
    text: { control: 'text' },
  },
  args: {
    animation: true,
    'text-position': 'bellow',
    size: 'large',
  },
};

const Template = (args) => {
  return html`<bq-spinner ?animation=${args.animation} size=${args.size} text-position=${args['text-position']}>
    <span>${args.text}</span>
  </bq-spinner>`;
};

export const Large = (args) => Template(args);
Large.args = {
  text: 'Loading...',
};

export const Medium = (args) => Template(args);
Medium.args = {
  text: 'Loading...',
  size: 'medium',
};

export const Small = (args) => Template(args);
Small.args = {
  text: 'Loading...',
  size: 'small',
};

export const CustomIcon = (args) => html`<bq-spinner
  ?animation=${args.animation}
  size=${args.size}
  text-position=${args['text-position']}
>
  <bq-icon name="spinner-gap" slot="icon"></bq-icon>
  <span>${args.text}</span>
</bq-spinner>`;

CustomIcon.args = {
  text: 'Loading...',
};

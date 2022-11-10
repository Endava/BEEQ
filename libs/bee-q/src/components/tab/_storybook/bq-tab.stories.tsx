import { html } from 'lit-html';
import mdx from './bq-tab.mdx';
import { TAB_SIZE } from '../bq-tab.types';

export default {
  title: 'Components/Tab',
  component: 'bq-tab',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: [...TAB_SIZE] },
    // Not part of the component
    text: { control: 'text' },
  },
  args: {
    text: 'Tab',
    active: false,
    disabled: false,
    size: 'small',
  },
};

const Template = (args) => {
  return html` <bq-tab .size=${args.size} ?active=${args.active} ?disabled=${args.disabled}>${args.text}</bq-tab> `;
};

export const Default = (args) => Template(args);

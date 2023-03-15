import { html } from 'lit-html';
import mdx from './bq-dialog.mdx';

export default {
  title: 'Components/Dialog',
  component: 'bq-dialog',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
  },
  args: {
    text: 'text',
    size: 'medium',
  },
};

const Template = (args) => {
  return html`<bq-dialog size=${args.size}>${args.text}</bq-dialog>`;
};

export const Default = (args) => Template(args);

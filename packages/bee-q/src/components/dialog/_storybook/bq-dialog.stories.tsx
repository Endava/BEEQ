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
  },
  args: {
    text: 'text',
  },
};

const Template = (args) => {
  return html`<bq-dialog>${args.text}</bq-dialog>`;
};

export const Default = (args) => Template(args);

import { html } from 'lit-html';
import mdx from './bq-dialog.mdx';

import { DIALOG_FOOTER_VARIANT } from '../bq-dialog.types';

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
    variant: { control: 'select', options: [...DIALOG_FOOTER_VARIANT] },
  },
  args: {
    text: 'text',
    size: 'medium',
    variant: 'standard',
  },
};

const Template = (args) => {
  return html`<bq-dialog size=${args.size} variant=${args.variant}>${args.text}</bq-dialog>`;
};

export const Default = (args) => Template(args);

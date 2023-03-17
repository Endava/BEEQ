import { html } from 'lit-html';
import mdx from './bq-menu-item.mdx';

export default {
  title: 'Components/Menu item',
  component: 'bq-menu-item',
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
  return html`<bq-menu-item>${args.text}</bq-menu-item>`;
};

export const Default = (args) => Template(args);

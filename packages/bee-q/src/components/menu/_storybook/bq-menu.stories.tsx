import { html } from 'lit-html';
import mdx from './bq-menu.mdx';

export default {
  title: 'Components/Menu',
  component: 'bq-menu',
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
  return html`<bq-menu>${args.text}</bq-menu>`;
};

export const Default = (args) => Template(args);

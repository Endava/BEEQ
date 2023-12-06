import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-accordion.mdx';

const meta: Meta = {
  title: 'Components/Accordions/Accordion',
  component: 'bq-accordion',
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
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`<bq-accordion>${args.text}</bq-accordion>`;

export const Default: Story = {
  render: Template,
  args: {},
};

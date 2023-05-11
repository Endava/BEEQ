import { html } from 'lit-html';
import mdx from './bq-option-group.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Option group',
  component: 'bq-option-group',
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

const Template = (args: Args) => html`<bq-option-group>${args.text}</bq-option-group>`;

export const Default: Story = {
  render: Template,
  args: {},
};

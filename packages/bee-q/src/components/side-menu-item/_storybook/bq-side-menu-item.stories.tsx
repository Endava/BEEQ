import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-side-menu-item.mdx';

const meta: Meta = {
  title: 'Components/Side menu item',
  component: 'bq-side-menu-item',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'Menu item',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-side-menu-item>
    <bq-icon name="star-four"></bq-icon>
    ${args.text}
    <bq-badge class="ml-auto"> 5 </bq-badge>
  </bq-side-menu-item>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

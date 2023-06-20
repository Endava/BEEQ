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
    active: { control: 'boolean' },
    collapse: { control: 'boolean' },
    // Not part of the component
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    active: false,
    collapse: false,
    // Not part of the component
    text: 'Menu item',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-side-menu-item ?active=${args.active} ?collapse=${args.collapse}>
    <bq-icon name="star-four" slot="prefix"></bq-icon>
    ${args.text}
    <bq-badge class="ml-auto" slot="suffix"> 5 </bq-badge>
  </bq-side-menu-item>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

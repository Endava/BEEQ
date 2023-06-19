import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import BeeQSvg from './assets/bee-q-logo.svg';

import mdx from './bq-side-menu.mdx';

const meta: Meta = {
  title: 'Components/Side menu',
  component: 'bq-side-menu',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    collapse: { control: 'boolean' },
  },
  args: {
    collapse: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-side-menu collapse=${args.collapse}>
    <div slot="logo">
      <img src=${BeeQSvg} />
    </div>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item active>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item akjasd kasjdh kjahsdkjash
      <bq-badge slot="suffix"> 5 </bq-badge>
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
    <bq-side-menu-item>
      <bq-icon name="star-four" slot="prefix"></bq-icon>
      Menu item
    </bq-side-menu-item>
  </bq-side-menu>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

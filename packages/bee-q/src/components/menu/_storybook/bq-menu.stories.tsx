import { html } from 'lit-html';
import { MENU_SIZE, MENU_THEME } from '../bq-menu.types';
import mdx from './bq-menu.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Menu',
  component: 'bq-menu',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    size: { control: 'select', options: [...MENU_SIZE] },
    collapsible: { control: 'boolean' },
    theme: { control: 'select', options: [...MENU_THEME] },
    text: { control: 'text', table: { disable: true } },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
  },
  args: {
    size: 'medium',
    collapsible: true,
    theme: 'light',
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-menu
    size=${args.size}
    ?collapsible=${args.collapsible}
    theme=${args.theme}
    @bqBlur=${args.bqBlur}
    @bqFocus=${args.bqFocus}
    @bqClick=${args.bqClick}
  >
    <!-- header slots -->
    <bq-icon name="dev-to-logo" slot="header-prefix" size="58"></bq-icon>
    <h1 slot="header-suffix">Bee-Q</h1>

    <!-- content -->
    <bq-menu-item active="true">
      <bq-icon size="18" name="user" slot="prefix"></bq-icon>
      <span>Verified users</span>
      <bq-icon size="18" name="check" color="#34eb52" slot="suffix"></bq-icon>
    </bq-menu-item>

    <bq-menu-item>
      <bq-icon size="18" name="presentation-chart" slot="prefix"></bq-icon>
      <span>Dashboard</span>
    </bq-menu-item>

    <bq-menu-item disabled="true">
      <span>Do not enter</span>
      <bq-icon size="18" name="prohibit" slot="suffix"></bq-icon>
    </bq-menu-item>

    <!-- footer slot -->
    <div slot="footer">Collapsible</div>
  </bq-menu>
`;

export const Light: Story = {
  render: Template,
  args: {
    theme: 'light',
  },
};

export const Brand: Story = {
  render: Template,
  args: {
    theme: 'brand',
  },
};

export const Inverse: Story = {
  render: Template,
  args: {
    theme: 'inverse',
  },
};

export const Small: Story = {
  render: Template,
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  render: Template,
  args: {
    size: 'medium',
  },
};

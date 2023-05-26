import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

import mdx from './bq-side-menu.mdx';

import { SIDE_MENU_SIZE, SIDE_MENU_THEME } from '../bq-side-menu.types';

const meta: Meta = {
  title: 'Components/Side Menu',
  component: 'bq-side-menu',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    size: { control: 'select', options: [...SIDE_MENU_SIZE] },
    'show-collapsible': { control: 'boolean' },
    collapsed: { control: 'boolean' },
    theme: { control: 'select', options: [...SIDE_MENU_THEME] },
    text: { control: 'text', table: { disable: true } },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
  },
  args: {
    size: 'medium',
    'show-collapsible': true,
    collapsed: false,
    theme: 'light',
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-side-menu
    size=${args.size}
    show-collapsible=${args['show-collapsible']}
    collapsed=${args.collapsed}
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
  </bq-side-menu>
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

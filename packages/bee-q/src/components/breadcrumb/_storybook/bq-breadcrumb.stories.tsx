import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

import mdx from './bq-breadcrumb.mdx';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  component: 'bq-breadcrumb',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
    ['separator-icon']: { control: 'text' },
  },
  args: {
    text: 'text',
    ['separator-icon']: '',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-breadcrumb separator-icon=${args['separator-icon']}>
    <bq-breadcrumb-item>
      <div class="flex items-center gap-xs">
        <bq-icon name="house-line" size="16"></bq-icon>
      </div>
    </bq-breadcrumb-item>
    <bq-breadcrumb-item>Men's Clothing</bq-breadcrumb-item>
    <bq-breadcrumb-item>
      <div class="flex items-center gap-xs">
        <bq-icon name="shirt-folded" size="16"></bq-icon>
        Shirts
      </div>
    </bq-breadcrumb-item>
    <bq-breadcrumb-item>Casual Shirts</bq-breadcrumb-item>
  </bq-breadcrumb>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

export const CaretSeparator: Story = {
  render: Template,
  args: {
    'separator-icon': 'caret-right',
  },
};

export const Links: Story = {
  render: () => html`
    <bq-breadcrumb>
      <bq-breadcrumb-item href="https://example.com/" target="_blank">
        <div class="flex items-center gap-xs">
          <bq-icon name="house-line" size="16"></bq-icon>
          <span>Home</span>
        </div>
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center" target="_blank">
        <span>Application Center</span>
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center/list" target="_blank">
        <div class="flex items-center gap-xs">
          <span>Application List</span>
          <bq-icon name="list-dashes" size="16"></bq-icon>
        </div>
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center/list/app" target="_blank">
        <span>App 1</span>
      </bq-breadcrumb-item>
    </bq-breadcrumb>
  `,
};

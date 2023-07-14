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
    ['aria-label']: { control: 'text' },
    htmlNode: { control: { type: 'object' } },
    // Event handlers
    bqBreadcrumbBlur: { action: 'bqBlur' },
    bqBreadcrumbClick: { action: 'bqClick' },
    bqBreadcrumbFocus: { action: 'bqFocus' },
  },
  args: {
    text: 'text',
    'aria-label': 'breadcrumbs',
    htmlNode: '',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-breadcrumb
    @bqBreadcrumbBlur=${args.bqBreadcrumbBlur}
    @bqBreadcrumbClick=${args.bqBreadcrumbClick}
    @bqBreadcrumbFocus=${args.bqBreadcrumbFocus}
  >
    ${args.htmlNode}
    <bq-breadcrumb-item>
      <bq-icon name="house-line" size="16"></bq-icon>
    </bq-breadcrumb-item>
    <bq-breadcrumb-item>Men's Clothing</bq-breadcrumb-item>
    <bq-breadcrumb-item>
      <bq-icon name="shirt-folded" size="16"></bq-icon>
      Shirts
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
    htmlNode: Object.assign(document.createElement('bq-icon'), { name: 'caret-right', size: '12', slot: 'separator' }),
  },
};

export const Links: Story = {
  render: (args: Args) => html`
    <bq-breadcrumb
      @bqBreadcrumbBlur=${args.bqBreadcrumbBlur}
      @bqBreadcrumbClick=${args.bqBreadcrumbClick}
      @bqBreadcrumbFocus=${args.bqBreadcrumbFocus}
    >
      <bq-breadcrumb-item href="https://example.com/" target="_blank">
        <bq-icon name="house-line" size="16"></bq-icon>
        Home
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center" target="_blank"> Application Center </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center/list" target="_blank">
        Application List
        <bq-icon name="list-dashes" size="16"></bq-icon>
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center/list/app" target="_blank">App 1 </bq-breadcrumb-item>
    </bq-breadcrumb>
  `,
};

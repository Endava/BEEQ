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
    htmlNode: { control: 'object', table: { disable: true } },
    useLinks: { control: 'boolean', table: { disable: true } },
    // Event handlers
    bqBreadcrumbBlur: { action: 'bqBlur' },
    bqBreadcrumbClick: { action: 'bqClick' },
    bqBreadcrumbFocus: { action: 'bqFocus' },
  },
  args: {
    text: 'text',
    'aria-label': 'Breadcrumbs',
    htmlNode: '',
    useLinks: false,
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
    <bq-breadcrumb-item
      href=${args.useLinks ? 'https://example.com/' : ''}
      target=${args.useLinks ? '_blank' : ''}
      aria-label="Home page"
    >
      <bq-icon name="house-line" size="16"></bq-icon>
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${args.useLinks ? 'https://example.com/' : ''}
      target=${args.useLinks ? '_blank' : ''}
      aria-label="Men clothing"
    >
      Men's Clothing
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${args.useLinks ? 'https://example.com/' : ''}
      target=${args.useLinks ? '_blank' : ''}
      aria-label="Shirts"
    >
      <bq-icon name="shirt-folded" size="16"></bq-icon>
      Shirts
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${args.useLinks ? 'https://example.com/' : ''}
      target=${args.useLinks ? '_blank' : ''}
      aria-label="Casual shirts"
    >
      Casual shirts
    </bq-breadcrumb-item>
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
  render: Template,
  args: {
    useLinks: true,
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { ifDefined } from 'lit/directives/if-defined.js';
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
    'aria-label': { control: 'text' },
    // Event handlers
    bqBreadcrumbBlur: { action: 'bqBlur' },
    bqBreadcrumbClick: { action: 'bqClick' },
    bqBreadcrumbFocus: { action: 'bqFocus' },
    // Not part of the public API, so we don't want to expose it in the docs
    text: { control: 'text', table: { disable: true } },
    htmlNode: { control: 'object', table: { disable: true } },
    useLinks: { control: 'boolean', table: { disable: true } },
  },
  args: {
    'aria-label': 'Breadcrumbs',
    text: 'text',
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
      href=${ifDefined(args.useLinks ? 'https://example.com/' : null)}
      target=${ifDefined(args.useLinks ? '_blank' : null)}
      aria-label="Home page"
    >
      <bq-icon name="house-line" size="16"></bq-icon>
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${ifDefined(args.useLinks ? 'https://example.com/' : null)}
      target=${ifDefined(args.useLinks ? '_blank' : null)}
      aria-label="Men clothing"
    >
      Men's Clothing
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${ifDefined(args.useLinks ? 'https://example.com/' : null)}
      target=${ifDefined(args.useLinks ? '_blank' : null)}
      aria-label="Shirts"
    >
      <bq-icon name="shirt-folded" size="16"></bq-icon>
      Shirts
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${ifDefined(args.useLinks ? 'https://example.com/' : null)}
      target=${ifDefined(args.useLinks ? '_blank' : null)}
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

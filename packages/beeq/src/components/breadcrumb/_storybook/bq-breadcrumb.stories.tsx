import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

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
    bqBlur: { action: 'bqBlur', table: { disable: true } },
    bqClick: { action: 'bqClick', table: { disable: true } },
    bqFocus: { action: 'bqFocus', table: { disable: true } },
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
  <bq-breadcrumb label=${args['aria-label']} @bqBlur=${args.bqBlur} @bqClick=${args.bqClick} @bqFocus=${args.bqFocus}>
    ${args.htmlNode}
    <bq-breadcrumb-item
      href=${ifDefined(args.useLinks ? 'https://example.com/' : null)}
      target=${ifDefined(args.useLinks ? '_blank' : null)}
      aria-label="Home page"
    >
      <bq-icon name="house-line" size="16" aria-hidden="true"></bq-icon>
      Home
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${ifDefined(args.useLinks ? 'https://example.com/' : null)}
      target=${ifDefined(args.useLinks ? '_blank' : null)}
      aria-label="Men's Clothing"
    >
      Men's Clothing
    </bq-breadcrumb-item>
    <bq-breadcrumb-item
      href=${ifDefined(args.useLinks ? 'https://example.com/' : null)}
      target=${ifDefined(args.useLinks ? '_blank' : null)}
      aria-label="Shirts"
    >
      <bq-icon name="shirt-folded" size="16" aria-hidden="true"></bq-icon>
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

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import mdx from './bq-accordion.mdx';
import { ACCORDION_APPEARANCE, ACCORDION_SIZE } from '../bq-accordion.types';

const meta: Meta = {
  title: 'Components/Accordion',
  component: 'bq-accordion',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    appearance: { control: 'select', options: [...ACCORDION_APPEARANCE] },
    disabled: { control: 'boolean' },
    expanded: { control: 'boolean' },
    'no-animation': { control: 'boolean' },
    rotate: { control: 'boolean' },
    size: { control: 'select', options: [...ACCORDION_SIZE] },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
    bqOpen: { action: 'bqOpen' },
    bqAfterOpen: { action: 'bqAfterOpen' },
    bqClose: { action: 'bqClose' },
    bqAfterClose: { action: 'bqAfterClose' },
    // Not part of the component
    header: { control: 'text', table: { disable: true } },
  },
  args: {
    appearance: 'filled',
    disabled: false,
    expanded: false,
    'no-animation': false,
    rotate: false,
    size: 'medium',
    // Not part of the component
    header: 'Header',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-accordion
    appearance=${args.appearance}
    ?disabled=${args.disabled}
    ?expanded=${args.expanded}
    ?no-animation=${args['no-animation']}
    ?rotate=${args.rotate}
    size=${args.size}
    @bqBlur=${args.bqBlur}
    @bqFocus=${args.bqFocus}
    @bqClick=${args.bqClick}
    @bqOpen=${args.bqOpen}
    @bqAfterOpen=${args.bqAfterOpen}
    @bqClose=${args.bqClose}
    @bqAfterClose=${args.bqAfterClose}
  >
    ${ifDefined(args.prefix) ? unsafeHTML(args.prefix) : nothing}
    <span slot="header">${args.header}</span>
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel ullam
      officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
      consequatur ea.
    </div>
    ${ifDefined(args.suffix) ? args.suffix : nothing}
    <!-- Custom collapse/expand icon -->
    ${ifDefined(args.collapse) ? unsafeHTML(args.collapse) : nothing}
  </bq-accordion>
`;

export const Default: Story = {
  render: Template,
};

export const Expanded: Story = {
  render: Template,
  args: {
    expanded: true,
  },
};

export const Ghost: Story = {
  render: Template,
  args: {
    appearance: 'ghost',
    expanded: true,
  },
};

export const Prefix: Story = {
  render: Template,
  argTypes: {
    prefix: { control: 'text', table: { disable: true } },
  },
  args: {
    prefix: `<bq-icon name="heart" slot="prefix"></bq-icon>`,
  },
};

export const Avatar: Story = {
  render: Template,
  argTypes: {
    prefix: { control: 'text', table: { disable: true } },
  },
  args: {
    prefix: `
      <bq-avatar
        size="xsmall"
        image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
        slot="prefix"
      ></bq-avatar>
    `,
  },
};

export const Suffix: Story = {
  render: Template,
  argTypes: {
    suffix: { control: 'text', table: { disable: true } },
  },
  args: {
    suffix: `<bq-icon name="gear" slot="suffix"></bq-icon>`,
  },
};

export const CustomCollapseExpand: Story = {
  render: Template,
  argTypes: {
    collapse: { control: 'text', table: { disable: true } },
  },
  args: {
    collapse: `<bq-icon name="caret-up" slot="expand"></bq-icon>`,
    rotate: true,
  },
};

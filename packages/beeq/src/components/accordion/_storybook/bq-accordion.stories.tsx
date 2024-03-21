import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

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
    expanded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    rotate: { control: 'boolean' },
    appearance: { control: 'select', options: [...ACCORDION_APPEARANCE] },
    size: { control: 'select', options: [...ACCORDION_SIZE] },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqClose: { action: 'bqClose' },
    bqFocus: { action: 'bqFocus' },
    bqOpen: { action: 'bqOpen' },
    // Not part of the component
    header: { control: 'text', table: { disable: true } },
  },
  args: {
    expanded: false,
    disabled: false,
    rotate: false,
    appearance: 'filled',
    size: 'medium',
    header: 'Header',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-accordion
    size=${args.size}
    appearance=${args.appearance}
    .expanded=${args.expanded}
    .disabled=${args.disabled}
    .rotate=${args.rotate}
    @bqBlur=${args.bqBlur}
    @bqFocus=${args.bqFocus}
    @bqClose=${args.bqClose}
    @bqOpen=${args.bqOpen}
  >
    ${ifDefined(args.prefix) ? args.prefix : nothing}
    <span slot="header">${args.header}</span>
    <div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque magnam corporis perferendis, architecto vel ullam
      officia officiis necessitatibus optio nam soluta labore libero debitis? Delectus enim quaerat laboriosam
      consequatur ea.
    </div>
    ${ifDefined(args.suffix) ? args.suffix : nothing}
    <!-- Custom collapse/expand icon -->
    ${ifDefined(args.collapse) ? args.collapse : nothing}
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
    prefix: html`<bq-icon name="heart" slot="prefix"></bq-icon>`,
  },
};

export const Avatar: Story = {
  render: Template,
  argTypes: {
    prefix: { control: 'text', table: { disable: true } },
  },
  args: {
    prefix: html`
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
    suffix: html`<bq-icon name="gear" slot="suffix"></bq-icon>`,
  },
};

export const CustomCollapseExpand: Story = {
  render: Template,
  argTypes: {
    collapse: { control: 'text', table: { disable: true } },
  },
  args: {
    collapse: html`<bq-icon name="caret-up" slot="expand"></bq-icon>`,
    rotate: true,
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-accordion.mdx';
import { ACCORDION_APPEARANCE, ACCORDION_SIZE } from '../bq-accordion.types';

const meta: Meta = {
  title: 'Components/Accordions/Accordion',
  component: 'bq-accordion',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    expanded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    appearance: { control: 'select', options: [...ACCORDION_APPEARANCE] },
    size: { control: 'select', options: [...ACCORDION_SIZE] },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqChange: { action: 'bqChange' },
    // Not part of the component
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    expanded: false,
    disabled: false,
    appearance: 'filled',
    size: 'medium',
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) =>
  html` <bq-accordion
    size=${args.size}
    appearance=${args.appearance}
    .expanded=${args.expanded}
    .disabled=${args.disabled}
    @bqFocus=${args.bqFocus}
    @bqClick=${args.bqClick}
    @bqBlur=${args.bqBlur}
  >
    <span slot="header">${args.text}</span>
    <div>hello world</div>
  </bq-accordion>`;

export const Default: Story = {
  render: Template,
  args: {},
};

const IconTemplate = (args: Args) =>
  html` <bq-accordion
    size=${args.size}
    appearance=${args.appearance}
    .expanded=${args.expanded}
    .disabled=${args.disabled}
    @bqFocus=${args.bqFocus}
    @bqClick=${args.bqClick}
    @bqBlur=${args.bqBlur}
  >
    <bq-icon name=${args['icon-name']} slot="prefix"></bq-icon>
    <span slot="header">${args.text}</span>
    <div>hello world</div>
  </bq-accordion>`;

export const Icon: Story = {
  render: IconTemplate,
  argTypes: {
    'icon-name': { control: 'text' },
  },
  args: {
    'icon-name': 'heart',
  },
};

const AvatarTemplate = (args: Args) =>
  html` <bq-accordion
    size=${args.size}
    appearance=${args.appearance}
    .expanded=${args.expanded}
    .disabled=${args.disabled}
    @bqFocus=${args.bqFocus}
    @bqClick=${args.bqClick}
    @bqBlur=${args.bqBlur}
  >
    <bq-avatar
      size="xsmall"
      image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80"
      slot="prefix"
    ></bq-avatar>
    <span slot="header">${args.text}</span>
    <div>hello world</div>
  </bq-accordion>`;

export const Avatar: Story = {
  render: AvatarTemplate,
  argTypes: {},
  args: {},
};

const MoreTemplate = (args: Args) => {
  const handleClick = (event) => {
    console.log('def here ??');
    event.preventDefault();
  };

  return html` <bq-accordion
    size=${args.size}
    appearance=${args.appearance}
    .expanded=${args.expanded}
    .disabled=${args.disabled}
    @bqFocus=${args.bqFocus}
    @bqClick=${args.bqClick}
    @bqBlur=${args.bqBlur}
  >
    <span slot="header">${args.text}</span>
    <bq-icon name="gear" @onClick=${handleClick} slot="suffix"></bq-icon>
    <div>hello world</div>
  </bq-accordion>`;
};

export const More: Story = {
  render: MoreTemplate,
  argTypes: {},
  args: {},
};

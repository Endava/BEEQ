import { html, render } from 'lit-html';

import { BUTTON_APPEARANCE, BUTTON_SIZE, BUTTON_TYPE, BUTTON_VARIANT } from '../bq-button.types';
import mdx from './bq-button.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Button',
  component: 'bq-button',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    appearance: { control: 'select', options: [...BUTTON_APPEARANCE] },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    loading: { control: 'boolean' },
    size: { control: 'select', options: [...BUTTON_SIZE] },
    target: { control: 'select', options: ['_blank', '_parent', '_self', '_top'] },
    type: { control: 'select', options: [...BUTTON_TYPE] },
    variant: { control: 'select', options: [...BUTTON_VARIANT] },
    // This control is not part of the component
    buttonText: { control: 'text', table: { disable: true } },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
  },
  args: {
    appearance: 'primary',
    href: undefined,
    disabled: false,
    loading: false,
    size: 'medium',
    target: undefined,
    type: 'button',
    variant: 'standard',
  },
};

export default meta;
type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-button
    appearance=${args.appearance}
    ?disabled=${args.disabled}
    href=${args.href}
    ?loading=${args.loading}
    size=${args.size}
    target=${args.target}
    type=${args.type}
    variant=${args.variant}
    @bqBlur=${args.bqBlur}
    @bqClick=${args.bqClick}
    @bqFocus=${args.bqFocus}
  >
    ${args.buttonText}
  </bq-button>
`;

export const Primary: Story = {
  render: Template.bind({}),
  args: {
    buttonText: 'Primary button',
  },
};

export const Secondary: Story = {
  render: Template.bind({}),
  args: {
    appearance: 'secondary',
    buttonText: 'Secondary button',
  },
};

export const Link: Story = {
  render: Template.bind({}),
  args: {
    appearance: 'link',
    href: 'https://www.example.com',
    target: '_blank',
    buttonText: 'Link button',
  },
};

export const Text: Story = {
  render: Template.bind({}),
  args: {
    appearance: 'text',
    buttonText: 'Text button',
  },
};

export const Loading: Story = {
  render: Template.bind({}),
  args: {
    appearance: 'primary',
    loading: true,
    buttonText: 'Loading button',
  },
};

export const IconLeft: Story = {
  render: (args) => html`
    <bq-button
      appearance=${args.appearance}
      ?disabled=${args.disabled}
      href=${args.href}
      ?loading=${args.loading}
      size=${args.size}
      target=${args.target}
      type=${args.type}
      variant=${args.variant}
      @bqBlur=${args.bqBlur}
      @bqClick=${args.bqClick}
      @bqFocus=${args.bqFocus}
    >
      <bq-icon name="arrow-circle-left" slot="prefix"></bq-icon>
      Go back
    </bq-button>
  `,
};

export const IconRight: Story = {
  render: (args) => html`
    <bq-button
      appearance=${args.appearance}
      ?disabled=${args.disabled}
      href=${args.href}
      ?loading=${args.loading}
      size=${args.size}
      target=${args.target}
      type=${args.type}
      variant=${args.variant}
      @bqBlur=${args.bqBlur}
      @bqClick=${args.bqClick}
      @bqFocus=${args.bqFocus}
    >
      Next step
      <bq-icon name="arrow-circle-right" slot="suffix"></bq-icon>
    </bq-button>
  `,
};

export const OnlyIcon: Story = {
  render: (args) => html`
    <bq-button
      appearance=${args.appearance}
      ?disabled=${args.disabled}
      href=${args.href}
      ?loading=${args.loading}
      size=${args.size}
      target=${args.target}
      type=${args.type}
      variant=${args.variant}
      @bqBlur=${args.bqBlur}
      @bqClick=${args.bqClick}
      @bqFocus=${args.bqFocus}
    >
      <bq-icon name="bell-ringing"></bq-icon>
    </bq-button>
  `,
};

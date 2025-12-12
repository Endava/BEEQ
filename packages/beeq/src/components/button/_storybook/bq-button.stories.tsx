import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import { isChromatic, skipSnapshotParameters } from '../../../../.storybook/chromatic-parameters';
import { BUTTON_APPEARANCE, BUTTON_BORDER_RADIUS, BUTTON_SIZE, BUTTON_TYPE, BUTTON_VARIANT } from '../bq-button.types';
import mdx from './bq-button.mdx';

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
    block: { control: 'boolean' },
    border: { control: 'select', options: [...BUTTON_BORDER_RADIUS] },
    disabled: { control: 'boolean' },
    href: { control: 'text' },
    'justify-content': { control: 'select', options: ['left', 'center', 'right'] },
    loading: { control: 'boolean' },
    'only-icon': { control: 'boolean' },
    size: { control: 'select', options: [...BUTTON_SIZE] },
    target: { control: 'select', options: ['_blank', '_parent', '_self', '_top'] },
    type: { control: 'select', options: [...BUTTON_TYPE] },
    variant: { control: 'select', options: [...BUTTON_VARIANT] },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
    // This control is not part of the component
    buttonText: { control: 'text', table: { disable: true } },
    buttonPrefix: { control: 'text', table: { disable: true } },
    buttonSuffix: { control: 'text', table: { disable: true } },
  },
  args: {
    appearance: 'primary',
    border: 'm',
    block: false,
    disabled: false,
    href: undefined,
    'justify-content': 'center',
    loading: false,
    'only-icon': false,
    size: 'medium',
    target: undefined,
    type: 'button',
    variant: 'standard',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  // In Chromatic environment, make sure loading is false
  const loading = isChromatic() ? false : args.loading;

  return html`
    <bq-button
      appearance=${args.appearance}
      ?block=${args.block}
      border=${args.border}
      ?disabled=${args.disabled}
      href=${args.href}
      justify-content=${args['justify-content']}
      ?loading=${loading}
      ?only-icon=${args['only-icon']}
      size=${args.size}
      target=${args.target}
      type=${args.type}
      variant=${args.variant}
      @bqBlur=${args.bqBlur}
      @bqClick=${args.bqClick}
      @bqFocus=${args.bqFocus}
    >
      ${args.buttonPrefix ? unsafeHTML(args.buttonPrefix) : nothing}
      ${args.buttonText ? unsafeHTML(args.buttonText) : nothing}
      ${args.buttonSuffix ? unsafeHTML(args.buttonSuffix) : nothing}
    </bq-button>
  `;
};

export const Primary: Story = {
  render: Template,
  args: {
    buttonText: 'Primary button',
  },
};

export const Secondary: Story = {
  render: Template,
  args: {
    appearance: 'secondary',
    buttonText: 'Secondary button',
  },
};

export const Link: Story = {
  render: Template,
  args: {
    appearance: 'link',
    href: 'https://www.example.com',
    target: '_blank',
    buttonText: 'Link button',
  },
};

export const Text: Story = {
  render: Template,
  args: {
    appearance: 'text',
    buttonText: 'Text button',
  },
};

export const Loading: Story = {
  render: Template,
  args: {
    appearance: 'primary',
    loading: true,
    buttonText: 'Loading button',
  },
  parameters: skipSnapshotParameters,
};

export const Block: Story = {
  render: Template,
  args: {
    block: true,
    buttonText: 'Block button',
  },
};

export const IconLeft: Story = {
  render: Template,
  args: {
    buttonText: 'Previous step',
    buttonPrefix: `<bq-icon name="arrow-circle-left" slot="prefix"></bq-icon>`,
  },
};

export const IconRight: Story = {
  render: Template,
  args: {
    buttonText: 'Next step',
    buttonSuffix: `<bq-icon name="arrow-circle-right" slot="suffix"></bq-icon>`,
  },
};

export const OnlyIcon: Story = {
  render: Template,
  args: {
    'only-icon': true,
    buttonText: `<bq-icon name="bell-ringing"></bq-icon>`,
  },
};

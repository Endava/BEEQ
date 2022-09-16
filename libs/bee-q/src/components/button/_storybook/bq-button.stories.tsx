import { html } from 'lit-html';

import { BUTTON_APPEARANCE, BUTTON_SIZE, BUTTON_TYPE, BUTTON_VARIANT } from '../bq-button.types';
import mdx from './bq-button.mdx';

export default {
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

const Template = (args) => html`
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

export const Primary = (args) => Template(args);
Primary.args = {
  buttonText: 'Primary button',
};

export const Secondary = (args) => Template(args);
Secondary.args = {
  appearance: 'secondary',
  buttonText: 'Secondary button',
};

export const Link = (args) => Template(args);
Link.args = {
  appearance: 'link',
  href: 'https://www.example.com',
  target: '_blank',
  buttonText: 'Link button',
};

export const Text = (args) => Template(args);
Text.args = {
  appearance: 'text',
  buttonText: 'Text button',
};

export const Loading = (args) => Template(args);
Loading.args = {
  appearance: 'primary',
  loading: true,
  buttonText: 'Loading button',
};

export const IconLeft = (args) => html`
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
`;

export const IconRight = (args) => html`
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
`;

export const OnlyIcon = (args) => html`
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
`;

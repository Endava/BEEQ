import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-textarea.mdx';
import { INPUT_VALIDATION } from '../../input/bq-input.types';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'bq-textarea',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'auto-grow': { control: 'boolean' },
    disabled: { control: 'boolean' },
    maxlength: { control: 'number' },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'text' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus' },
    bqInput: { action: 'bqInput' },
    // Not part of the public API, so we don't want to expose it in the docs
    noHelperText: { control: 'bolean', table: { disable: true } },
  },
  args: {
    'auto-grow': false,
    disabled: false,
    maxlength: 0,
    name: 'textarea',
    placeholder: 'Placeholder...',
    rows: 5,
    'validation-status': 'none',
    value: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-textarea
    ?auto-grow=${args['auto-grow']}
    ?disabled=${args.disabled}
    maxlength=${ifDefined(args.maxlength)}
    name=${ifDefined(args.name)}
    placeholder=${ifDefined(args.placeholder)}
    rows=${ifDefined(args.rows)}
    validation-status=${ifDefined(args['validation-status'])}
    value=${ifDefined(args.value)}
  >
    <span slot="label">Label</span>
    ${!args.noHelperText
      ? html`
          <span class="flex items-center gap-xs" slot="helper-text">
            <bq-icon name="star"></bq-icon>
            Helper text
          </span>
        `
      : nothing}
  </bq-textarea>
`;

export const Default: Story = {
  render: Template,
};

export const InitialValue: Story = {
  render: Template,
  args: {
    value:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, nulla. Ab non odio facere enim, voluptatum voluptates quod molestias suscipit fugiat et expedita accusamus quidem nostrum maxime illo recusandae ratione?',
  },
};

export const MaxLength: Story = {
  render: Template,
  args: {
    maxlength: 100,
    value: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
};

export const Validation: Story = {
  render: (args) => html`
    <div class="flex gap-m">
      <!-- Error -->
      ${Template({ ...args, 'validation-status': 'error' })}
      <!-- Warning -->
      ${Template({ ...args, 'validation-status': 'warning' })}
      <!-- Success -->
      ${Template({ ...args, 'validation-status': 'success' })}
    </div>
  `,
  args: {
    maxlength: 100,
    'validation-status': 'error',
    value: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
};

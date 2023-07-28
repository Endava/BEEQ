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
    autocapitalize: { control: 'select', options: ['off', 'none', 'on', 'sentences', 'words', 'characters'] },
    autocomplete: { control: 'text' },
    autocorrect: { control: 'inline-radio', options: ['on', 'off'] },
    autofocus: { control: 'boolean' },
    'auto-grow': { control: 'boolean' },
    'debounce-time': { control: 'number' },
    disabled: { control: 'boolean' },
    form: { control: 'text' },
    maxlength: { control: 'number' },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    rows: { control: 'number' },
    spellcheck: { control: 'boolean' },
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
    autocapitalize: 'off',
    autocomplete: 'off',
    autocorrect: 'off',
    autofocus: false,
    'auto-grow': false,
    'debounce-time': 0,
    disabled: false,
    form: undefined,
    maxlength: 0,
    name: 'textarea',
    placeholder: 'Placeholder...',
    readonly: false,
    required: false,
    rows: 5,
    spellcheck: false,
    'validation-status': 'none',
    value: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-textarea
    autocapitalize=${ifDefined(args.autocapitalize)}
    autocomplete=${ifDefined(args.autocomplete)}
    autocorrect=${ifDefined(args.autocorrect)}
    ?autofocus=${args.autofocus}
    ?auto-grow=${args['auto-grow']}
    debounce-time=${ifDefined(args['debounce-time'])}
    ?disabled=${args.disabled}
    form=${ifDefined(args.form)}
    maxlength=${ifDefined(args.maxlength)}
    name=${ifDefined(args.name)}
    placeholder=${ifDefined(args.placeholder)}
    ?readonly=${args.readonly}
    ?required=${args.required}
    rows=${ifDefined(args.rows)}
    spellcheck=${ifDefined(args.spellcheck)}
    validation-status=${ifDefined(args['validation-status'])}
    value=${ifDefined(args.value)}
    @bqBlur=${args.bqBlur}
    @bqChange=${args.bqChange}
    @bqFocus=${args.bqFocus}
    @bqInput=${args.bqInput}
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
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
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

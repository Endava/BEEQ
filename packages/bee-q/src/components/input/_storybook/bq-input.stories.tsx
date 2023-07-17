import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, nothing } from 'lit-html';

import mdx from './bq-input.mdx';
import { INPUT_TYPE, INPUT_VALIDATION } from '../bq-input.types';

const meta: Meta = {
  title: 'Components/Input',
  component: 'bq-input',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    autocapitalize: { control: 'text' },
    autocomplete: { control: 'text' },
    autocorrect: { control: 'inline-radio', options: ['on', 'off'] },
    autofocus: { control: 'boolean' },
    'clear-button-label': { control: 'text' },
    'debounce-time': { control: 'number' },
    'disable-clear': { control: 'boolean' },
    disabled: { control: 'boolean' },
    max: { control: 'text' },
    maxlength: { control: 'number' },
    min: { control: 'text' },
    minlength: { control: 'number' },
    name: { control: 'text' },
    pattern: { control: 'text' },
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    step: { control: 'text' },
    type: { control: 'select', options: [...INPUT_TYPE] },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'text' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqChange: { action: 'bqChange' },
    bqClear: { action: 'bqClear' },
    bqFocus: { action: 'bqFocus' },
    bqInput: { action: 'bqInput' },
    // Not part of the public API, so we don't want to expose it in the docs
    noLabel: { control: 'bolean', table: { disable: true } },
    hasLabelTooltip: { control: 'bolean', table: { disable: true } },
    noHelperText: { control: 'bolean', table: { disable: true } },
    optionalLabel: { control: 'bolean', table: { disable: true } },
    prefix: { control: 'bolean', table: { disable: true } },
    suffix: { control: 'bolean', table: { disable: true } },
  },
  args: {
    autocapitalize: 'off',
    autocomplete: 'off',
    autocorrect: 'off',
    autofocus: false,
    'clear-button-label': 'Clear value',
    'disable-clear': false,
    disabled: false,
    'debounce-time': 0,
    form: undefined,
    inputmode: 'text',
    max: undefined,
    maxlength: undefined,
    min: undefined,
    minlength: undefined,
    name: 'input',
    pattern: undefined,
    readonly: false,
    required: false,
    step: undefined,
    type: 'text',
    placeholder: 'Placeholder',
    'validation-status': 'none',
    value: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const tooltipTemplae = args.hasLabelTooltip
    ? html`
        <bq-tooltip class="ms-xs">
          <bq-icon name="info" slot="trigger"></bq-icon>
          You can provide more context detail by adding a tooltip to the label.
        </bq-tooltip>
      `
    : nothing;
  const labelTemplate = html`
    <label class="flex flex-grow items-center" slot=${ifDefined(!args.optionalLabel ? 'label' : null)}>
      Input label ${tooltipTemplae}
    </label>
  `;
  const label = !args.optionalLabel
    ? labelTemplate
    : html`
        <div slot="label" class="flex flex-1">
          ${labelTemplate}
          <span class="text-text-secondary">Optional</span>
        </div>
      `;

  return html`
    <bq-input
      autocapitalize=${args.autocapitalize}
      autocomplete=${args.autocomplete}
      autocorrect=${args.autocorrect}
      ?autofocus=${args.autofocus}
      clear-button-label=${args['clear-button-label']}
      debounce-time=${args['debounce-time']}
      ?disable-clear=${args['disable-clear']}
      ?disabled=${args.disabled}
      .form=${args.form}
      iputmode=${args.inputmode}
      .max=${args.max}
      .maxlength=${args.maxlength}
      .min=${args.min}
      .minlength=${args.minlength}
      .name=${args.name}
      .pattern=${args.pattern}
      placeholder=${args.placeholder}
      ?readonly=${args.readonly}
      ?required=${args.required}
      .step=${args.step}
      .type=${args.type}
      validation-status=${args['validation-status']}
      .value=${args.value}
      @bqBlur=${args.bqBlur}
      @bqChange=${args.bqChange}
      @bqClear=${args.bqClear}
      @bqFocus=${args.bqFocus}
      @bqInput=${args.bqInput}
    >
      ${!args.noLabel ? label : nothing}
      ${args.prefix ? html`<bq-icon name="user-circle" slot="prefix"></bq-icon>` : nothing}
      ${args.suffix ? html`<bq-icon name="gear" slot="suffix"></bq-icon>` : nothing}
      ${!args.noHelperText
        ? html`
            <span class="flex items-center gap-xs" slot="helper-text">
              <bq-icon name="star"></bq-icon>
              Helper text
            </span>
          `
        : nothing}
    </bq-input>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Value: Story = {
  render: Template,
  args: {
    value: 'Hello World!',
  },
};

export const Prefix: Story = {
  render: Template,
  args: {
    prefix: true,
  },
};

export const Suffix: Story = {
  render: Template,
  args: {
    suffix: true,
  },
};

export const PrefixAndSuffix: Story = {
  name: 'Prefix and Suffix',
  render: Template,
  args: {
    prefix: true,
    suffix: true,
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    prefix: true,
    suffix: true,
  },
};

export const ValidationStatus: Story = {
  name: 'Validation',
  render: (args) => html`
    <div class="flex flex-col gap-l">
      <!-- Error -->
      ${Template({ ...args, 'validation-status': 'error' })}
      <!-- Succes -->
      ${Template({ ...args, 'validation-status': 'success' })}
      <!-- Warning -->
      ${Template({ ...args, 'validation-status': 'warning' })}
    </div>
  `,
  args: {
    prefix: true,
    suffix: true,
  },
};

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: {
    optionalLabel: true,
    prefix: true,
    suffix: true,
  },
};

export const Tooltip: Story = {
  name: 'Label with "Info tooltip"',
  render: Template,
  args: {
    hasLabelTooltip: true,
    optionalLabel: true,
    prefix: true,
    suffix: true,
  },
  parameters: {
    layout: 'centered',
  },
};

export const NoLabel: Story = {
  name: 'With no Label',
  render: Template,
  args: {
    noLabel: true,
    prefix: true,
    suffix: true,
  },
};

export const NoHelperText: Story = {
  name: 'With no Helper Text',
  render: Template,
  args: {
    noHelperText: true,
    prefix: true,
    suffix: true,
  },
};

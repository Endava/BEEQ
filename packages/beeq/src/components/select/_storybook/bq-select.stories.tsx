import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-select.mdx';
import { INPUT_VALIDATION } from '../../input/bq-input.types';

const meta: Meta = {
  title: 'Components/Select',
  component: 'bq-select',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    autofocus: { control: 'boolean' },
    'clear-button-label': { control: 'text' },
    'disable-clear': { control: 'boolean' },
    distance: { control: 'number' },
    disabled: { control: 'boolean' },
    form: { control: 'text' },
    'keep-open-on-select': { control: 'boolean' },
    name: { control: 'text' },
    open: { control: 'boolean' },
    'panel-height': { control: 'text' },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ],
    },
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    'same-width': { control: 'boolean' },
    skidding: { control: 'number' },
    strategy: { control: 'select', options: ['fixed', 'absolute'] },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'text' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqClear: { action: 'bqClear' },
    bqFocus: { action: 'bqFocus' },
    bqSelect: { action: 'bqSelect' },
    // Not part of the public API, so we don't want to expose it in the docs
    noLabel: { control: 'boolean', table: { disable: true } },
    hasLabelTooltip: { control: 'boolean', table: { disable: true } },
    noHelperText: { control: 'boolean', table: { disable: true } },
    optionalLabel: { control: 'boolean', table: { disable: true } },
    prefix: { control: 'boolean', table: { disable: true } },
    suffix: { control: 'boolean', table: { disable: true } },
    options: { control: 'text', table: { disable: true } },
  },
  args: {
    autofocus: false,
    'clear-button-label': 'Clear value',
    'disable-clear': false,
    distance: 8,
    disabled: false,
    form: undefined,
    'keep-open-on-select': false,
    name: 'bq-select',
    open: false,
    'panel-height': undefined,
    placement: 'bottom',
    placeholder: 'Placeholder',
    'same-width': false,
    skidding: 0,
    strategy: 'absolute',
    readonly: false,
    required: false,
    'validation-status': 'none',
    value: undefined,
    // Not part of the public API, so we don't want to expose it in the docs
    options: html`
      <bq-option value="1">Option 1</bq-option>
      <bq-option value="2">Option 2</bq-option>
      <bq-option value="3">Option 3</bq-option>
      <bq-option value="4">Option 4</bq-option>
      <bq-option value="5">Option 5</bq-option>
    `,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const tooltipTemplate = args.hasLabelTooltip
    ? html`
        <bq-tooltip class="ms-xs">
          <bq-icon name="info" slot="trigger"></bq-icon>
          You can provide more context detail by adding a tooltip to the label.
        </bq-tooltip>
      `
    : nothing;
  const labelTemplate = html`
    <label class="flex flex-grow items-center" slot=${ifDefined(!args.optionalLabel ? 'label' : null)}>
      Select label ${tooltipTemplate}
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
  const style = args.hasLabelTooltip
    ? html`
        <style>
          bq-select {
            width: 75vw;
          }
        </style>
      `
    : nothing;

  return html`
    ${style}
    <bq-select
      ?autofocus=${args.autofocus}
      clear-button-label=${args['clear-button-label']}
      distance=${args.distance}
      ?disable-clear=${args['disable-clear']}
      ?disabled=${args.disabled}
      form=${ifDefined(args.form)}
      ?keep-open-on-select=${args['keep-open-on-select']}
      name=${ifDefined(args.name)}
      ?open=${args.open}
      panel-height=${args['panel-height']}
      placeholder=${args.placeholder}
      placement=${args.placement}
      ?readonly=${args.readonly}
      ?required=${args.required}
      ?same-width=${args['same-width']}
      skidding=${args.skidding}
      strategy=${args.strategy}
      validation-status=${args['validation-status']}
      value=${ifDefined(args.value)}
      @bqBlur=${args.bqBlur}
      @bqSelect=${args.bqSelect}
      @bqClear=${args.bqClear}
      @bqFocus=${args.bqFocus}
    >
      ${!args.noLabel ? label : nothing}
      ${args.prefix ? html`<bq-icon name="user-circle" slot="prefix"></bq-icon>` : nothing}
      ${args.suffix ? html`<bq-icon name="arrow-down" slot="suffix"></bq-icon>` : nothing}
      ${!args.noHelperText
        ? html`
            <span class="flex items-center gap-xs" slot="helper-text">
              <bq-icon name="star"></bq-icon>
              Helper text
            </span>
          `
        : nothing}
      ${args.options}
    </bq-select>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Open: Story = {
  render: Template,
  args: {
    autofocus: true,
    open: true,
  },
};

export const InitialValue: Story = {
  render: Template,
  args: {
    value: '2',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
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

export const Validation: Story = {
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
      <!-- Error -->
      ${Template({ ...args, 'validation-status': 'error', value: 1 })}
      <!-- Warning -->
      ${Template({ ...args, 'validation-status': 'warning', value: 3 })}
      <!-- Success -->
      ${Template({ ...args, 'validation-status': 'success', value: 5 })}
    </div>
  `,
};

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: {
    optionalLabel: true,
    prefix: true,
  },
};

export const Tooltip: Story = {
  name: 'Label with "Info tooltip"',
  render: Template,
  args: {
    hasLabelTooltip: true,
    optionalLabel: true,
    prefix: true,
  },
  parameters: {
    layout: 'centered',
  },
};

export const Placement: Story = {
  name: 'Panel placement',
  render: Template,
  args: {
    hasLabelTooltip: true,
    placement: 'top',
    prefix: true,
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
  },
};

export const NoHelperText: Story = {
  name: 'With no Helper Text',
  render: Template,
  args: {
    noHelperText: true,
    prefix: true,
  },
};

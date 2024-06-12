import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-date-picker.mdx';
import { INPUT_VALIDATION } from '../../input/bq-input.types';
import { DATE_PICKER_TYPE } from '../bq-date-picker.types';

const meta: Meta = {
  title: 'Components/Date picker',
  component: 'bq-date-picker',
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
    'first-day-of-week': { control: 'number' },
    formatOptions: { control: 'object' },
    form: { control: 'text' },
    locale: { control: 'text' },
    max: { control: 'text' },
    min: { control: 'text' },
    months: { control: 'number' },
    'months-per-view': { control: 'select', options: ['single', 'months'] },
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
    required: { control: 'boolean' },
    'show-outside-days': { control: 'boolean' },
    skidding: { control: 'number' },
    strategy: { control: 'select', options: ['fixed', 'absolute'] },
    tentative: { control: 'text' },
    type: { control: 'select', options: [...DATE_PICKER_TYPE] },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'text' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqChange: { action: 'bqChange' },
    bqClear: { action: 'bqClear' },
    bqFocus: { action: 'bqFocus' },
    // Not part of the public API, so we don't want to expose it in the docs
    noLabel: { control: 'boolean', table: { disable: true } },
    hasLabelTooltip: { control: 'boolean', table: { disable: true } },
    prefix: { control: 'boolean', table: { disable: true } },
    suffix: { control: 'boolean', table: { disable: true } },
  },
  args: {
    autofocus: false,
    'clear-button-label': 'Clear value',
    'disable-clear': false,
    distance: 8,
    disabled: false,
    'first-day-of-week': 1,
    formatOptions: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
    form: undefined,
    isDateDisallowed: undefined,
    locale: undefined,
    max: undefined,
    min: undefined,
    months: 1,
    'months-per-view': 'single',
    name: 'bq-date-picker',
    open: false,
    'panel-height': 'auto',
    placement: 'bottom-end',
    placeholder: 'Enter your date',
    required: false,
    'show-outside-days': false,
    skidding: 0,
    strategy: 'absolute',
    tentative: undefined,
    type: 'single',
    'validation-status': 'none',
    value: undefined,
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
      Date picker label ${tooltipTemplate}
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
  /**
   * * Converts a Date object to an ISO 8601 string representation.
   * This function is used only for demonstration purposes in Storybook.
   */

  const dateDisallowed = (date: Date): boolean => {
    if (!args.customDisallowedDate) return false;

    // Format the date value to YYYY-MM-DD
    const dateString = date.toLocaleDateString('fr-CA');
    // Check if the date is in the disallowed dates list
    return args.customDisallowedDate.replace(/\s+/g, '').split(',').includes(dateString);
  };

  const style = args.hasLabelTooltip
    ? html`
        <style>
          bq-date-picker {
            margin-block-start: -10rem;
            inline-size: 75vw;
          }
        </style>
      `
    : nothing;

  return html`
    ${style}
    <bq-date-picker
      ?autofocus=${args.autofocus}
      clear-button-label=${args['clear-button-label']}
      distance=${args.distance}
      ?disable-clear=${args['disable-clear']}
      ?disabled=${args.disabled}
      first-day-of-week=${args['first-day-of-week']}
      form=${ifDefined(args.form)}
      .formatOptions=${args.formatOptions}
      .isDateDisallowed=${dateDisallowed}
      locale=${ifDefined(args.locale)}
      max=${ifDefined(args.max)}
      min=${ifDefined(args.min)}
      months=${args.months}
      months-per-view=${args['months-per-view']}
      name=${ifDefined(args.name)}
      ?open=${args.open}
      panel-height=${args['panel-height']}
      placeholder=${args.placeholder}
      placement=${args.placement}
      ?required=${args.required}
      show-outside-days=${args['show-outside-days']}
      skidding=${args.skidding}
      strategy=${args.strategy}
      tentative=${args.tentative}
      type=${args.type}
      validation-status=${args['validation-status']}
      value=${ifDefined(args.value)}
      @bqBlur=${args.bqBlur}
      @bqChange=${args.bqChange}
      @bqClear=${args.bqClear}
      @bqFocus=${args.bqFocus}
    >
      ${!args.noLabel ? label : nothing}
      ${args.prefix ? html`<bq-icon name="user-circle" slot="prefix"></bq-icon>` : nothing}
      ${args.suffix ? html`<bq-icon name="arrow-down" slot="suffix"></bq-icon>` : nothing}
    </bq-date-picker>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Range: Story = {
  render: Template,
  args: {
    type: 'range',
    months: 2,
  },
};

export const Multi: Story = {
  render: Template,
  args: {
    type: 'multi',
    months: 2,
  },
};

export const InitialValue: Story = {
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
      <!-- Default date picker -->
      <div class="flex flex-col gap-2">
        <p>Default date picker</p>
        ${Template({ ...args, value: '2024-05-25', name: 'bq-date-picker-default', noLabel: 'true' })}
      </div>
      <!-- Range date picker -->
      <div class="flex flex-col gap-2">
        <p>Range date picker</p>
        ${Template({
          ...args,
          value: '2024-12-20/2025-01-10',
          name: 'bq-date-picker-range',
          type: 'range',
          months: 2,
          noLabel: 'true',
        })}
      </div>
      <!-- Multi date picker -->
      <div class="flex flex-col gap-2">
        <p>Multi date picker</p>
        ${Template({
          ...args,
          value: '2024-05-08 2024-05-22 2024-06-04 2024-06-18 2024-05-16 2024-05-30 2024-06-12 2024-06-26',
          name: 'bq-date-picker-multi',
          type: 'multi',
          months: 2,
          noLabel: 'true',
        })}
      </div>
    </div>
  `,
};

export const MixMax: Story = {
  name: 'Min and Max allowed dates',
  render: Template,
  args: {
    min: '2024-06-05',
    max: '2024-06-15',
    value: '2024-06-10',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    value: '2024-06-20',
  },
};

export const DisallowedDates: Story = {
  name: 'Disallowed dates',
  render: Template,
  argTypes: {
    customDisallowedDate: { control: 'text' },
  },
  args: {
    customDisallowedDate: '2024-12-01, 2024-12-25, 2024-12-26',
    value: '2024-12-12',
  },
};

export const ValidationStatus: Story = {
  name: 'Validation',
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
      <!-- Error -->
      <div class="flex flex-col gap-2">
        <p>Error date picker</p>
        ${Template({
          ...args,
          value: '2024-05-25',
          name: 'bq-date-picker-error',
          'validation-status': 'error',
          noLabel: 'true',
        })}
      </div>
      <!-- Success -->
      <div class="flex flex-col gap-2">
        <p>Success date picker</p>
        ${Template({
          ...args,
          value: '2024-06-25',
          name: 'bq-date-picker-success',
          'validation-status': 'success',
          noLabel: 'true',
        })}
      </div>
      <!-- Warning -->
      <div class="flex flex-col gap-2">
        <p>Warning date picker</p>
        ${Template({
          ...args,
          value: '2024-07-25',
          name: 'bq-date-picker-warning',
          'validation-status': 'warning',
          noLabel: 'true',
        })}
      </div>
    </div>
  `,
};

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: {
    optionalLabel: true,
    value: '2024-10-10',
  },
};

export const Tooltip: Story = {
  name: 'Label with "Info tooltip"',
  render: Template,
  args: {
    hasLabelTooltip: true,
    value: '2024-09-11',
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
    value: '2024-10-13',
  },
};

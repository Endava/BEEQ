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
    form: { control: 'text' },
    min: { control: 'text' },
    max: { control: 'text' },
    locale: { control: 'text' },
    'show-outside-days': { control: 'boolean' },
    'first-day-of-week': { control: 'number' },
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
    skidding: { control: 'number' },
    strategy: { control: 'select', options: ['fixed', 'absolute'] },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    type: { control: 'select', options: [...DATE_PICKER_TYPE] },
    months: { control: 'number' },
    value: { control: 'text' },
    'format-options': { control: 'object' },
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
    customDisallowedDate: { control: 'text' },
  },
  args: {
    autofocus: false,
    'clear-button-label': 'Clear value',
    'disable-clear': false,
    distance: 8,
    disabled: false,
    form: undefined,
    min: undefined,
    max: undefined,
    locale: undefined,
    'show-outside-days': false,
    'first-day-of-week': 1,
    name: 'bq-date-picker',
    open: false,
    'panel-height': 'auto',
    placement: 'bottom-start',
    placeholder: 'Enter your date',
    skidding: 0,
    strategy: 'absolute',
    required: false,
    'validation-status': 'none',
    type: 'single',
    months: 1,
    value: undefined,
    'format-options': {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
    isDateDisallowed: undefined,
    customDisallowedDate: undefined,
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

  const dateToIsoString = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isDate = (date: Date): boolean => {
    if (!args.customDisallowedDate) {
      return false;
    }

    const dateString = dateToIsoString(date);
    return args.customDisallowedDate.split(',').some((date: string) => date.trim() === dateString);
  };

  return html`
    <div class="w-[280px]">
      <bq-date-picker
        ?autofocus=${args.autofocus}
        clear-button-label=${args['clear-button-label']}
        distance=${args.distance}
        ?disable-clear=${args['disable-clear']}
        ?disabled=${args.disabled}
        form=${ifDefined(args.form)}
        min=${ifDefined(args.min)}
        max=${ifDefined(args.max)}
        locale=${ifDefined(args.locale)}
        ?show-outside-days=${args['show-outside-days']}
        first-day-of-week=${args['first-day-of-week']}
        name=${ifDefined(args.name)}
        ?open=${args.open}
        panel-height=${args['panel-height']}
        placeholder=${args.placeholder}
        placement=${args.placement}
        ?required=${args.required}
        skidding=${args.skidding}
        strategy=${args.strategy}
        validation-status=${args['validation-status']}
        type=${args.type}
        months=${args.months}
        value=${ifDefined(args.value)}
        .format-options=${args['format-options']}
        .isDateDisallowed=${isDate}
        @bqBlur=${args.bqBlur}
        @bqChange=${args.bqChange}
        @bqClear=${args.bqClear}
        @bqFocus=${args.bqFocus}
      >
        ${!args.noLabel ? label : nothing}
        ${args.prefix ? html`<bq-icon name="user-circle" slot="prefix"></bq-icon>` : nothing}
        ${args.suffix ? html`<bq-icon name="arrow-down" slot="suffix"></bq-icon>` : nothing}
      </bq-date-picker>
    </div>
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
    <div class="flex flex-row gap-4">
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
          value: '2024-06-04/2024-06-15',
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
          value: '2024-05-08 2024-05-09 2024-05-10',
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
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    value: '2024-06-20',
  },
};

export const ValidationStatus: Story = {
  name: 'Validation',
  render: (args) => html`
    <div class="flex flex-row gap-4">
      <!-- Error -->
      <div class="flex flex-col gap-2">
        <p>Error date picker</p>
        ${Template({ ...args, name: 'bq-date-picker-error', 'validation-status': 'error', noLabel: 'true' })}
      </div>
      <!-- Success -->
      <div class="flex flex-col gap-2">
        <p>Success date picker</p>
        ${Template({ ...args, name: 'bq-date-picker-success', 'validation-status': 'success', noLabel: 'true' })}
      </div>
      <!-- Warning -->
      <div class="flex flex-col gap-2">
        <p>Warning date picker</p>
        ${Template({ ...args, name: 'bq-date-picker-warning', 'validation-status': 'warning', noLabel: 'true' })}
      </div>
    </div>
  `,
};

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: {
    optionalLabel: true,
  },
};

export const Tooltip: Story = {
  name: 'Label with "Info tooltip"',
  render: Template,
  args: {
    hasLabelTooltip: true,
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
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-date-picker.mdx';
import { INPUT_VALIDATION } from '../../input/bq-input.types';

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
    range: { control: 'boolean' },
    multi: { control: 'boolean' },
    months: { control: 'number' },
    value: { control: 'text' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqChange: { action: 'bqChange' },
    bqClear: { action: 'bqClear' },
    bqFocus: { action: 'bqFocus' },
    bqInput: { action: 'bqInput' },
    // Not part of the public API, so we don't want to expose it in the docs
    noLabel: { control: 'boolean', table: { disable: true } },
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
    range: false,
    multi: false,
    months: 1,
    value: undefined,
    isDateDisallowed: undefined,
    customDisallowedDate: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const labelTemplate = html`
    <label class="flex flex-grow items-center" slot=${ifDefined(!args.optionalLabel ? 'label' : null)}> Label </label>
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
        range=${args.range}
        multi=${args.multi}
        months=${args.months}
        value=${ifDefined(args.value)}
        .isDateDisallowed=${isDate}
        @bqBlur=${args.bqBlur}
        @bqChange=${args.bqChange}
        @bqClear=${args.bqClear}
        @bqFocus=${args.bqFocus}
        @bqInput=${args.bqInput}
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
    range: true,
    months: 2,
  },
};

export const Multi: Story = {
  render: Template,
  args: {
    multi: true,
    months: 2,
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import { INPUT_VALIDATION } from '../../input/bq-input.types';
import { CALENDAR_VIEW, DATE_PICKER_TYPE, DATE_PRECISION } from '../bq-date-picker.types';
import mdx from './bq-date-picker.mdx';

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
    disabled: { control: 'boolean' },
    distance: { control: 'number' },
    'first-day-of-week': { control: 'number' },
    form: { control: 'text' },
    'form-validation-message': { control: 'text' },
    formatOptions: { control: 'object' },
    'initial-view': { control: 'select', options: [...CALENDAR_VIEW] },
    isDateDisallowed: {
      control: false,
      description: 'Predicate that marks specific dates as unselectable.',
      table: {
        type: {
          summary: '(date: Date) => boolean',
        },
      },
    },
    locale: { control: 'text' },
    max: { control: 'text' },
    min: { control: 'text' },
    months: { control: 'number' },
    'months-per-view': { control: 'select', options: ['single', 'months'] },
    name: { control: 'text' },
    open: { control: 'boolean' },
    'panel-height': { control: 'text' },
    placeholder: { control: 'text' },
    precision: { control: 'select', options: [...DATE_PRECISION] },
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
    required: { control: 'boolean' },
    'show-outside-days': { control: 'boolean' },
    skidding: { control: 'number' },
    strategy: { control: 'select', options: ['fixed', 'absolute'] },
    type: { control: 'select', options: [...DATE_PICKER_TYPE] },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'text' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqChange: { action: 'bqChange' },
    bqClear: { action: 'bqClear' },
    bqFocus: { action: 'bqFocus' },
    bqViewChange: { action: 'bqViewChange' },
    // Not part of the public API — hidden from docs table
    customDisallowedDate: { control: 'text', table: { disable: true } },
    hasLabelTooltip: { control: 'boolean', table: { disable: true } },
    noLabel: { control: 'boolean', table: { disable: true } },
    optionalLabel: { control: 'boolean', table: { disable: true } },
    prefix: { control: 'boolean', table: { disable: true } },
    suffix: { control: 'boolean', table: { disable: true } },
  },
  args: {
    autofocus: false,
    'clear-button-label': 'Clear value',
    'disable-clear': false,
    disabled: false,
    distance: 8,
    'first-day-of-week': 1,
    form: undefined,
    'form-validation-message': undefined,
    // Left undefined so the component can pick its precision-appropriate default.
    // Stories that need a specific format pass it explicitly (see `FormatOptions`).
    formatOptions: undefined,
    'initial-view': 'days',
    isDateDisallowed: undefined,
    locale: 'en-GB',
    max: undefined,
    min: undefined,
    months: 1,
    'months-per-view': 'single',
    name: 'bq-date-picker',
    open: false,
    'panel-height': 'auto',
    placeholder: 'Enter your date',
    placement: 'bottom-end',
    precision: 'day',
    required: false,
    'show-outside-days': false,
    skidding: 0,
    strategy: 'absolute',
    type: 'single',
    'validation-status': 'none',
    value: undefined,
    customDisallowedDate: undefined,
    hasLabelTooltip: false,
    noLabel: false,
    optionalLabel: false,
    prefix: false,
    suffix: false,
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

  const dateDisallowed = (date: Date): boolean => {
    if (!args.customDisallowedDate) return false;
    // Format the date value to YYYY-MM-DD
    const dateString = date.toLocaleDateString('fr-CA');
    return args.customDisallowedDate.replace(/\s+/g, '').split(',').includes(dateString);
  };

  const isDateDisallowed = args.isDateDisallowed ?? dateDisallowed;

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
      clear-button-label=${ifDefined(args['clear-button-label'])}
      ?disable-clear=${args['disable-clear']}
      ?disabled=${args.disabled}
      distance=${ifDefined(args.distance)}
      first-day-of-week=${ifDefined(args['first-day-of-week'])}
      form=${ifDefined(args.form)}
      form-validation-message=${ifDefined(args['form-validation-message'])}
      .formatOptions=${args.formatOptions}
      initial-view=${ifDefined(args['initial-view'])}
      .isDateDisallowed=${isDateDisallowed}
      locale=${ifDefined(args.locale)}
      max=${ifDefined(args.max)}
      min=${ifDefined(args.min)}
      months=${ifDefined(args.months)}
      months-per-view=${ifDefined(args['months-per-view'])}
      name=${ifDefined(args.name)}
      ?open=${args.open}
      panel-height=${ifDefined(args['panel-height'])}
      placeholder=${ifDefined(args.placeholder)}
      placement=${ifDefined(args.placement)}
      precision=${ifDefined(args.precision)}
      ?required=${args.required}
      ?show-outside-days=${args['show-outside-days']}
      skidding=${ifDefined(args.skidding)}
      strategy=${ifDefined(args.strategy)}
      type=${ifDefined(args.type)}
      validation-status=${ifDefined(args['validation-status'])}
      value=${ifDefined(args.value)}
      @bqBlur=${args.bqBlur}
      @bqChange=${args.bqChange}
      @bqClear=${args.bqClear}
      @bqFocus=${args.bqFocus}
      @bqViewChange=${args.bqViewChange}
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

export const Open: Story = {
  render: Template,
  args: { open: true },
};

/* ------------------------------ Selection types ---------------------------- */

export const SingleDate: Story = {
  render: Template,
  args: { open: true, type: 'single', value: '2026-05-15' },
};

export const Range: Story = {
  render: Template,
  args: { open: true, type: 'range', months: 2, value: '2026-05-15/2026-06-10' },
};

export const Multi: Story = {
  render: Template,
  args: { open: true, type: 'multi', months: 2, value: '2026-05-05 2026-05-15 2026-05-25 2026-06-08' },
};

export const InitialValue: Story = {
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
      <!-- Default (single) -->
      <div class="flex flex-col gap-2">
        <p>Default date picker</p>
        ${Template({ ...args, value: '2026-05-25', name: 'bq-date-picker-default', noLabel: true })}
      </div>
      <!-- Range -->
      <div class="flex flex-col gap-2">
        <p>Range date picker</p>
        ${Template({
          ...args,
          value: '2026-12-20/2027-01-10',
          name: 'bq-date-picker-range',
          type: 'range',
          months: 2,
          noLabel: true,
        })}
      </div>
      <!-- Multi -->
      <div class="flex flex-col gap-2">
        <p>Multi date picker</p>
        ${Template({
          ...args,
          value: '2026-05-08 2026-05-22 2026-06-04 2026-06-18 2026-05-16 2026-05-30 2026-06-12 2026-06-26',
          name: 'bq-date-picker-multi',
          type: 'multi',
          months: 2,
          noLabel: true,
        })}
      </div>
    </div>
  `,
};

/* ------------------------------- Constraints ------------------------------- */

export const MinMax: Story = {
  name: 'Min and Max allowed dates',
  render: Template,
  args: { open: true, min: '2026-05-01', max: '2026-05-31', value: '2026-05-15' },
};

export const DisallowedDates: Story = {
  name: 'Disallowed dates',
  render: Template,
  args: {
    open: true,
    isDateDisallowed: (date: Date) => {
      const dateString = date.toLocaleDateString('fr-CA');
      return ['2026-05-05', '2026-05-06', '2026-05-15', '2026-05-16'].includes(dateString);
    },
    value: '2026-05-10',
  },
};

export const Disabled: Story = {
  render: Template,
  args: { disabled: true, value: '2026-06-20' },
};

/* ---------------------------------- Views ---------------------------------- */

export const InitialMonthView: Story = {
  name: 'Initial view: months',
  render: Template,
  args: { open: true, 'initial-view': 'months' },
};

export const InitialYearView: Story = {
  name: 'Initial view: years',
  render: Template,
  args: { open: true, 'initial-view': 'years' },
};

/* --------------------------------- Precision -------------------------------- */

export const MonthPrecision: Story = {
  name: 'Precision: month',
  render: Template,
  args: {
    open: true,
    precision: 'month',
    value: '2026-05',
    // Let the component pick its precision default ({ month: 'long', year: 'numeric' })
    formatOptions: undefined,
    placeholder: 'Select month',
  },
};

export const YearPrecision: Story = {
  name: 'Precision: year',
  render: Template,
  args: {
    open: true,
    precision: 'year',
    value: '2026',
    formatOptions: undefined,
    placeholder: 'Select year',
  },
};

export const MonthPrecisionRange: Story = {
  name: 'Precision: month + range',
  render: Template,
  args: {
    open: true,
    precision: 'month',
    type: 'range',
    value: '2026-03/2026-08',
    formatOptions: undefined,
    placeholder: 'Select month range',
  },
};

export const MonthPrecisionMulti: Story = {
  name: 'Precision: month + multi',
  render: Template,
  args: {
    open: true,
    precision: 'month',
    type: 'multi',
    value: '2026-01 2026-03 2026-05 2026-07 2026-10 2026-12',
    formatOptions: undefined,
    placeholder: 'Select months',
  },
};

export const YearPrecisionMulti: Story = {
  name: 'Precision: year + multi',
  render: Template,
  args: {
    open: true,
    precision: 'year',
    type: 'multi',
    value: '2020 2022 2025 2027 2030',
    formatOptions: undefined,
    placeholder: 'Select years',
  },
};

/* ------------------------- Localization & formatting ----------------------- */

export const Localized: Story = {
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
      <div class="flex flex-col gap-2">
        <p>German (de-DE)</p>
        ${Template({ ...args, locale: 'de-DE', 'first-day-of-week': 1, value: '2026-05-15', noLabel: true })}
      </div>
      <div class="flex flex-col gap-2">
        <p>Japanese (ja-JP)</p>
        ${Template({ ...args, locale: 'ja-JP', 'first-day-of-week': 0, value: '2026-05-15', noLabel: true })}
      </div>
      <div class="flex flex-col gap-2">
        <p>French (fr-FR)</p>
        ${Template({ ...args, locale: 'fr-FR', 'first-day-of-week': 1, value: '2026-05-15', noLabel: true })}
      </div>
    </div>
  `,
};

export const FormatOptions: Story = {
  name: 'Custom display format',
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-2">
      <div class="flex flex-col gap-2">
        <p>Numeric &mdash; <code>{ day: '2-digit', month: '2-digit', year: 'numeric' }</code></p>
        ${Template({
          ...args,
          value: '2026-05-15',
          name: 'bq-date-picker-fmt-numeric',
          formatOptions: { day: '2-digit', month: '2-digit', year: 'numeric' },
          noLabel: true,
        })}
      </div>
      <div class="flex flex-col gap-2">
        <p>Long month &mdash; <code>{ day: 'numeric', month: 'long', year: 'numeric' }</code></p>
        ${Template({
          ...args,
          value: '2026-05-15',
          name: 'bq-date-picker-fmt-long',
          formatOptions: { day: 'numeric', month: 'long', year: 'numeric' },
          noLabel: true,
        })}
      </div>
      <div class="flex flex-col gap-2">
        <p>Full date style &mdash; <code>{ dateStyle: 'full' }</code></p>
        ${Template({
          ...args,
          value: '2026-05-15',
          name: 'bq-date-picker-fmt-full',
          formatOptions: { dateStyle: 'full' },
          noLabel: true,
        })}
      </div>
      <div class="flex flex-col gap-2">
        <p>Weekday + short month &mdash; <code>{ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }</code></p>
        ${Template({
          ...args,
          value: '2026-05-15',
          name: 'bq-date-picker-fmt-weekday',
          formatOptions: { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' },
          noLabel: true,
        })}
      </div>
    </div>
  `,
};

export const RTL: Story = {
  render: (args) => html`<div dir="rtl">${Template(args)}</div>`,
  args: { open: true, locale: 'ar-EG', value: '2026-05-15' },
};

/* ------------------------------ Label variants ----------------------------- */

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: { optionalLabel: true, value: '2026-10-10' },
};

export const Tooltip: Story = {
  name: 'Label with "Info tooltip"',
  render: Template,
  args: { hasLabelTooltip: true, value: '2026-09-11' },
  parameters: { layout: 'centered' },
};

export const NoLabel: Story = {
  name: 'With no label',
  render: Template,
  args: { noLabel: true, value: '2026-10-13' },
};

/* -------------------------------- Validation ------------------------------- */

export const ValidationStatus: Story = {
  name: 'Validation',
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
      <div class="flex flex-col gap-2">
        <p>Error</p>
        ${Template({
          ...args,
          value: '2026-05-25',
          name: 'bq-date-picker-error',
          'validation-status': 'error',
          noLabel: true,
        })}
      </div>
      <div class="flex flex-col gap-2">
        <p>Success</p>
        ${Template({
          ...args,
          value: '2026-06-25',
          name: 'bq-date-picker-success',
          'validation-status': 'success',
          noLabel: true,
        })}
      </div>
      <div class="flex flex-col gap-2">
        <p>Warning</p>
        ${Template({
          ...args,
          value: '2026-07-25',
          name: 'bq-date-picker-warning',
          'validation-status': 'warning',
          noLabel: true,
        })}
      </div>
    </div>
  `,
};

/* ---------------------------- Form integration ----------------------------- */

export const WithForm: Story = {
  name: 'Form integration',
  render: () => {
    const handleFormSubmit = (ev: Event) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      const codeElement = document.getElementById('form-data-2');
      if (!codeElement) return;
      codeElement.textContent = JSON.stringify(formValues, null, 2);
    };

    return html`
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />

      <div class="grid auto-cols-auto grid-cols-1 gap-y-l sm:grid-cols-2 sm:gap-x-l">
        <bq-card>
          <h4 class="m-be-m">Travel information</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit}>
            <bq-input name="fullName" value="Brad Bernie Beckett" autocomplete="name" required>
              <label class="flex flex-grow items-center" slot="label">Full Name</label>
            </bq-input>
            <div class="grid grid-cols-1 gap-y-m sm:grid-cols-2 sm:gap-x-m">
              <bq-input name="passportNumber" value="052763786" autocomplete="bday-year" required>
                <label class="flex flex-grow items-center" slot="label">Passport number</label>
              </bq-input>
              <bq-date-picker
                name="passportExpiration"
                value="2034-05-20"
                placeholder="Select a date"
                form-validation-message="Please, you must provide your passport expiration date"
                type="single"
                required
              >
                <label class="flex flex-grow items-center" slot="label">Expiration date</label>
              </bq-date-picker>
            </div>
            <bq-date-picker
              name="tripDate"
              placeholder="Select a start and end date for your travel"
              form-validation-message="Please, tell us when you are planning to travel"
              value="2026-12-25/2027-01-10"
              type="range"
              months="2"
              required
            >
              <label class="flex flex-grow items-center" slot="label">Travel dates</label>
            </bq-date-picker>
            <div class="flex justify-end gap-x-s">
              <bq-button appearance="secondary" type="reset">Cancel</bq-button>
              <bq-button type="submit">Save</bq-button>
            </div>
          </form>
        </bq-card>
        <bq-card class="[&::part(wrapper)]:h-full">
          <h4 class="m-be-m">Form Data</h4>
          <div class="language-javascript overflow-x-scroll whitespace-pre rounded-s">
            // Handle form submit<br />
            const form = ev.target as HTMLFormElement;<br />
            const formData = new FormData(form);<br />
            const formValues = Object.fromEntries(formData.entries());
          </div>
          <pre>
            <code id="form-data-2" class="rounded-s">
              { // submit the form to see the data here }
            </code>
          </pre>
        </bq-card>
      </div>

      <script type="module">
        import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.10.0/es/highlight.min.js';
        import javascript from 'https://unpkg.com/@highlightjs/cdn-assets@11.10.0/es/languages/javascript.min.js';

        hljs.registerLanguage('javascript', javascript);
        hljs.highlightAll();

        document.querySelectorAll('div.language-javascript').forEach((block) => {
          hljs.highlightElement(block);
        });
      </script>
    `;
  },
};

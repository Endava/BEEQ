import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

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
    // Events
    bqBlur: fn(),
    bqChange: fn(),
    bqClear: fn(),
    bqFocus: fn(),
    bqViewChange: fn(),
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const tooltipTemplate = args.hasLabelTooltip
    ? html`
        <bq-tooltip>
          <bq-icon name="info" slot="trigger"></bq-icon>
          You can provide more context detail by adding a tooltip to the label.
        </bq-tooltip>
      `
    : nothing;

  const labelTemplate = html`
    <label slot=${ifDefined(!args.optionalLabel ? 'label' : null)}>
      Date picker label ${tooltipTemplate}
    </label>
  `;

  const label = !args.optionalLabel
    ? labelTemplate
    : html`
        <div slot="label">
          ${labelTemplate}
          <span>Optional</span>
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
    <style>
      .bq-story-date-picker label {
        display: flex;
        flex-grow: 1;
        align-items: center;
      }
      .bq-story-date-picker div[slot='label'] {
        display: flex;
        flex: 1 1 0%;
      }
      .bq-story-date-picker bq-tooltip {
        margin-inline-start: var(--bq-spacing-xs);
      }
    </style>
    ${style}
    <bq-date-picker
      class="bq-story-date-picker"
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
    <style>
      .bq-story-date-picker-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--bq-spacing-m);
      }
      .bq-story-date-picker-grid > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      @media (min-width: 640px) {
        .bq-story-date-picker-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    </style>
    <div class="bq-story-date-picker-grid">
      <!-- Default (single) -->
      <div>
        <p>Default date picker</p>
        ${Template({ ...args, value: '2026-05-25', name: 'bq-date-picker-default', noLabel: true })}
      </div>
      <!-- Range -->
      <div>
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
      <div>
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
  },
};

/* ------------------------- Localization & formatting ----------------------- */

export const Localized: Story = {
  render: (args) => html`
    <style>
      .bq-story-date-picker-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--bq-spacing-m);
      }
      .bq-story-date-picker-grid > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      @media (min-width: 640px) {
        .bq-story-date-picker-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    </style>
    <div class="bq-story-date-picker-grid">
      <div>
        <p>German (de-DE)</p>
        ${Template({ ...args, locale: 'de-DE', 'first-day-of-week': 1, value: '2026-05-15', noLabel: true })}
      </div>
      <div>
        <p>Japanese (ja-JP)</p>
        ${Template({ ...args, locale: 'ja-JP', 'first-day-of-week': 0, value: '2026-05-15', noLabel: true })}
      </div>
      <div>
        <p>French (fr-FR)</p>
        ${Template({ ...args, locale: 'fr-FR', 'first-day-of-week': 1, value: '2026-05-15', noLabel: true })}
      </div>
    </div>
  `,
};

export const FormatOptions: Story = {
  name: 'Custom display format',
  render: (args) => html`
    <style>
      .bq-story-date-picker-format-options {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--bq-spacing-m);
      }
      .bq-story-date-picker-format-options > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      @media (min-width: 640px) {
        .bq-story-date-picker-format-options {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    </style>
    <div class="bq-story-date-picker-format-options">
      <div>
        <p>Numeric &mdash; <code>{ day: '2-digit', month: '2-digit', year: 'numeric' }</code></p>
        ${Template({
          ...args,
          value: '2026-05-15',
          name: 'bq-date-picker-fmt-numeric',
          formatOptions: { day: '2-digit', month: '2-digit', year: 'numeric' },
          noLabel: true,
        })}
      </div>
      <div>
        <p>Long month &mdash; <code>{ day: 'numeric', month: 'long', year: 'numeric' }</code></p>
        ${Template({
          ...args,
          value: '2026-05-15',
          name: 'bq-date-picker-fmt-long',
          formatOptions: { day: 'numeric', month: 'long', year: 'numeric' },
          noLabel: true,
        })}
      </div>
      <div>
        <p>Full date style &mdash; <code>{ dateStyle: 'full' }</code></p>
        ${Template({
          ...args,
          value: '2026-05-15',
          name: 'bq-date-picker-fmt-full',
          formatOptions: { dateStyle: 'full' },
          noLabel: true,
        })}
      </div>
      <div>
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

/* -------------------------------- Validation ------------------------------- */

export const ValidationStatus: Story = {
  name: 'Validation',
  render: (args) => html`
    <style>
      .bq-story-date-picker-grid {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--bq-spacing-m);
      }
      .bq-story-date-picker-grid > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      @media (min-width: 640px) {
        .bq-story-date-picker-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    </style>
    <div class="bq-story-date-picker-grid">
      <div>
        <p>Error</p>
        ${Template({
          ...args,
          value: '2026-05-25',
          name: 'bq-date-picker-error',
          'validation-status': 'error',
          noLabel: true,
        })}
      </div>
      <div>
        <p>Success</p>
        ${Template({
          ...args,
          value: '2026-06-25',
          name: 'bq-date-picker-success',
          'validation-status': 'success',
          noLabel: true,
        })}
      </div>
      <div>
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
      <style>
        .bq-story-date-picker-form {
          display: grid;
          grid-auto-columns: auto;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-l);
        }
        .bq-story-date-picker-form h4 {
          margin-block-end: var(--bq-spacing-m);
        }
        .bq-story-date-picker-form form {
          display: flex;
          flex-direction: column;
          row-gap: var(--bq-spacing-m);
        }
        .bq-story-date-picker-form label[slot='label'] {
          display: flex;
          flex-grow: 1;
          align-items: center;
        }
        .bq-story-date-picker-form__row {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-m);
        }
        .bq-story-date-picker-form__actions {
          display: flex;
          justify-content: flex-end;
          column-gap: var(--bq-spacing-s);
        }
        .bq-story-date-picker-form__data::part(wrapper) {
          height: 100%;
        }
        .bq-story-date-picker-form .language-javascript {
          overflow-x: scroll;
          white-space: pre;
          border-radius: var(--bq-radius--s);
        }
        .bq-story-date-picker-form code {
          border-radius: var(--bq-radius--s);
        }
        @media (min-width: 640px) {
          .bq-story-date-picker-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-l);
          }
          .bq-story-date-picker-form__row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-m);
          }
        }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />

      <div class="bq-story-date-picker-form">
        <bq-card>
          <h4>Travel information</h4>
          <form @submit=${handleFormSubmit}>
            <bq-input name="fullName" value="Brad Bernie Beckett" autocomplete="name" required>
              <label slot="label">Full Name</label>
            </bq-input>
            <div class="bq-story-date-picker-form__row">
              <bq-input name="passportNumber" value="052763786" autocomplete="bday-year" required>
                <label slot="label">Passport number</label>
              </bq-input>
              <bq-date-picker
                name="passportExpiration"
                value="2034-05-20"
                form-validation-message="Please, you must provide your passport expiration date"
                type="single"
                required
              >
                <label slot="label">Expiration date</label>
              </bq-date-picker>
            </div>
            <bq-date-picker
              name="tripDate"
              form-validation-message="Please, tell us when you are planning to travel"
              value="2026-12-25/2027-01-10"
              type="range"
              months="2"
              required
            >
              <label slot="label">Travel dates</label>
            </bq-date-picker>
            <div class="bq-story-date-picker-form__actions">
              <bq-button appearance="secondary" type="reset">Cancel</bq-button>
              <bq-button type="submit">Save</bq-button>
            </div>
          </form>
        </bq-card>
        <bq-card class="bq-story-date-picker-form__data">
          <h4>Form Data</h4>
          <div class="language-javascript">
            // Handle form submit<br />
            const form = ev.target as HTMLFormElement;<br />
            const formData = new FormData(form);<br />
            const formValues = Object.fromEntries(formData.entries());
          </div>
          <pre>
            <code id="form-data-2">
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

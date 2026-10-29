import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

import { skipSnapshotParameters } from '../../../../.storybook/chromatic-parameters';
import {
  FLOATING_PLACEMENT,
  FLOATING_STRATEGY,
  HOUR_FORMAT,
  INPUT_VALIDATION,
  TIME_PRECISION,
} from '../bq-time-picker.types';
import mdx from './bq-time-picker.mdx';

const meta: Meta = {
  title: 'Components/Time picker',
  component: 'bq-time-picker',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    autofocus: { control: 'boolean' },
    'disable-clear': { control: 'boolean' },
    'disable-now': { control: 'boolean' },
    disabled: { control: 'boolean' },
    distance: { control: 'number' },
    form: { control: 'text' },
    'form-validation-message': { control: 'text' },
    'hour-format': { control: 'select', options: [...HOUR_FORMAT] },
    'hour-step': { control: 'number' },
    labels: { control: 'object' },
    locale: { control: 'text' },
    max: { control: 'text' },
    min: { control: 'text' },
    'minute-step': { control: 'number' },
    name: { control: 'text' },
    open: { control: 'boolean' },
    'panel-height': { control: 'text' },
    placement: { control: 'select', options: [...FLOATING_PLACEMENT] },
    precision: { control: 'select', options: [...TIME_PRECISION] },
    readonly: { control: 'boolean' },
    'require-confirm': { control: 'boolean' },
    required: { control: 'boolean' },
    'second-step': { control: 'number' },
    skidding: { control: 'number' },
    strategy: { control: 'select', options: [...FLOATING_STRATEGY] },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'text' },
    // Not part of the public API — hidden from docs table
    noLabel: { control: 'boolean', table: { disable: true } },
    optionalLabel: { control: 'boolean', table: { disable: true } },
    prefix: { control: 'boolean', table: { disable: true } },
    suffix: { control: 'boolean', table: { disable: true } },
  },
  args: {
    autofocus: false,
    'disable-clear': false,
    'disable-now': false,
    disabled: false,
    distance: 8,
    form: undefined,
    'form-validation-message': undefined,
    'hour-format': '24',
    'hour-step': 1,
    labels: undefined,
    locale: 'en-GB',
    max: undefined,
    min: undefined,
    'minute-step': 1,
    name: 'bq-time-picker',
    open: false,
    'panel-height': 'auto',
    placement: 'bottom-end',
    precision: 'minute',
    readonly: false,
    'require-confirm': false,
    required: false,
    'second-step': 1,
    skidding: 0,
    strategy: 'fixed',
    'validation-status': 'none',
    value: undefined,
    noLabel: false,
    optionalLabel: false,
    prefix: false,
    suffix: false,
    // Events
    bqBlur: fn(),
    bqChange: fn(),
    bqClear: fn(),
    bqFocus: fn(),
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const labelTemplate = html`
    <label class="flex flex-grow items-center" slot=${ifDefined(args.optionalLabel ? undefined : 'label')}>
      Time picker label
    </label>
  `;

  const label = args.optionalLabel
    ? html`
        <div slot="label" class="flex flex-1">
          ${labelTemplate}
          <span class="text-text-secondary">Optional</span>
        </div>
      `
    : labelTemplate;

  return html`
    <bq-time-picker
      ?autofocus=${args.autofocus}
      ?disable-clear=${args['disable-clear']}
      ?disable-now=${args['disable-now']}
      ?disabled=${args.disabled}
      distance=${ifDefined(args.distance)}
      form=${ifDefined(args.form)}
      form-validation-message=${ifDefined(args['form-validation-message'])}
      hour-format=${ifDefined(args['hour-format'])}
      hour-step=${ifDefined(args['hour-step'])}
      .labels=${args.labels}
      locale=${ifDefined(args.locale)}
      max=${ifDefined(args.max)}
      min=${ifDefined(args.min)}
      minute-step=${ifDefined(args['minute-step'])}
      name=${ifDefined(args.name)}
      ?open=${args.open}
      panel-height=${ifDefined(args['panel-height'])}
      placement=${ifDefined(args.placement)}
      precision=${ifDefined(args.precision)}
      ?readonly=${args.readonly}
      ?require-confirm=${args['require-confirm']}
      ?required=${args.required}
      second-step=${ifDefined(args['second-step'])}
      skidding=${ifDefined(args.skidding)}
      strategy=${ifDefined(args.strategy)}
      validation-status=${ifDefined(args['validation-status'])}
      value=${ifDefined(args.value)}
      @bqBlur=${args.bqBlur}
      @bqChange=${args.bqChange}
      @bqClear=${args.bqClear}
      @bqFocus=${args.bqFocus}
    >
      ${args.noLabel ? nothing : label}
      ${args.prefix ? html`<bq-icon name="alarm" slot="prefix"></bq-icon>` : nothing}
      ${args.suffix ? html`<bq-icon name="clock-countdown" slot="suffix"></bq-icon>` : nothing}
    </bq-time-picker>
  `;
};

/** Lays out labelled variants side by side. */
const Grid = (items: { title: string; args: Args }[]) => html`
  <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
    ${items.map(
      ({ title, args }) => html`
        <div class="flex flex-col gap-2">
          <p>${title}</p>
          ${Template({ ...args, noLabel: true })}
        </div>
      `,
    )}
  </div>
`;

export const Default: Story = {
  render: Template,
};

export const Open: Story = {
  render: Template,
  args: { open: true, value: '09:30' },
};

/* -------------------------------- Precision -------------------------------- */

export const Precision: Story = {
  render: (args) =>
    Grid([
      { title: 'Hours', args: { ...args, name: 'tp-hour', precision: 'hour', value: '09:00' } },
      { title: 'Hours and minutes', args: { ...args, name: 'tp-minute', precision: 'minute', value: '09:30' } },
      {
        title: 'Hours, minutes and seconds',
        args: { ...args, name: 'tp-second', precision: 'second', value: '09:30:15' },
      },
    ]),
};

/* ----------------------------- Locale and format ---------------------------- */

export const HourFormat: Story = {
  name: 'Hour format',
  render: (args) =>
    Grid([
      { title: '24-hour clock (default)', args: { ...args, name: 'tp-24', value: '14:30' } },
      {
        title: '12-hour clock (en-US)',
        args: { ...args, name: 'tp-12', 'hour-format': '12', locale: 'en-US', value: '14:30' },
      },
    ]),
};

export const Localized: Story = {
  render: (args) =>
    Grid([
      {
        title: 'German (de-DE)',
        args: { ...args, name: 'tp-de', locale: 'de-DE', precision: 'second', value: '14:30:15' },
      },
      {
        title: 'Korean (ko-KR)',
        args: { ...args, name: 'tp-ko', locale: 'ko-KR', 'hour-format': '12', value: '14:30' },
      },
      {
        title: 'Arabic (ar-EG)',
        args: { ...args, name: 'tp-ar', locale: 'ar-EG', 'hour-format': '12', value: '14:30' },
      },
    ]),
};

export const CustomLabels: Story = {
  name: 'Custom labels',
  render: Template,
  args: {
    open: true,
    'hour-format': '12',
    labels: {
      hour: 'Heure',
      minute: 'Minute',
      am: 'matin',
      pm: 'soir',
      period: 'Moment',
      now: 'Maintenant',
      clear: 'Effacer',
      confirm: 'Valider',
      openPanel: "Ouvrir le sélecteur d'heure",
      panelLabel: "Choisir l'heure",
    },
    locale: 'fr-FR',
    value: '14:30',
  },
};

export const RTL: Story = {
  render: (args) => html`<div dir="rtl">${Template(args)}</div>`,
  args: { open: true, 'hour-format': '12', locale: 'ar-EG', value: '14:30' },
};

/* -------------------------------- Constraints ------------------------------- */

export const MinMax: Story = {
  name: 'Min and max allowed times',
  render: Template,
  args: { open: true, min: '09:30', max: '17:00', value: '12:00' },
  // The Now button is enabled or disabled depending on the time the snapshot is taken.
  parameters: { ...skipSnapshotParameters },
};

export const Steps: Story = {
  render: Template,
  args: { open: true, 'minute-step': 15, value: '10:45' },
};

/* ----------------------------- Confirm and Now ----------------------------- */

export const RequireConfirm: Story = {
  name: 'Require confirmation',
  render: Template,
  args: { open: true, 'require-confirm': true, value: '09:30' },
};

export const WithoutNow: Story = {
  name: 'Without the Now button',
  render: Template,
  args: { open: true, 'disable-now': true, value: '09:30' },
};

/* ---------------------------------- States --------------------------------- */

export const Disabled: Story = {
  render: Template,
  args: { disabled: true, value: '09:30' },
};

export const Readonly: Story = {
  name: 'Read-only',
  render: Template,
  args: { readonly: true, value: '09:30' },
};

export const WithPrefix: Story = {
  name: 'With prefix and suffix',
  render: Template,
  args: { prefix: true, suffix: true, value: '09:30' },
};

export const DisableClear: Story = {
  name: 'Without the clear button',
  render: Template,
  args: { 'disable-clear': true, value: '09:30' },
};

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: { optionalLabel: true },
};

export const ValidationStatus: Story = {
  name: 'Validation',
  render: (args) =>
    Grid([
      { title: 'Error', args: { ...args, name: 'tp-error', 'validation-status': 'error', value: '09:30' } },
      { title: 'Success', args: { ...args, name: 'tp-success', 'validation-status': 'success', value: '09:30' } },
      { title: 'Warning', args: { ...args, name: 'tp-warning', 'validation-status': 'warning', value: '09:30' } },
    ]),
};

/* ----------------------------- Form integration ---------------------------- */

export const WithForm: Story = {
  name: 'Form integration',
  render: () => {
    const handleFormSubmit = (ev: Event) => {
      ev.preventDefault();
      const formData = new FormData(ev.target as HTMLFormElement);
      const output = document.getElementById('time-picker-form-data');
      if (!output) return;
      output.textContent = JSON.stringify(Object.fromEntries(formData.entries()), null, 2);
    };

    return html`
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />

      <div class="grid auto-cols-auto grid-cols-1 gap-y-l sm:grid-cols-2 sm:gap-x-l">
        <bq-card>
          <h4 class="m-be-m">Book a meeting room</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit}>
            <div class="grid grid-cols-1 gap-y-m sm:grid-cols-2 sm:gap-x-m">
              <bq-time-picker
                name="start"
                min="08:00"
                max="18:00"
                minute-step="15"
                value="09:00"
                form-validation-message="Please, choose a start time between 08:00 and 18:00"
                required
              >
                <label class="flex flex-grow items-center" slot="label">Start time</label>
              </bq-time-picker>
              <bq-time-picker name="end" min="08:00" max="18:00" minute-step="15" require-confirm required>
                <label class="flex flex-grow items-center" slot="label">End time</label>
              </bq-time-picker>
            </div>
            <div class="flex justify-end gap-x-s">
              <bq-button appearance="secondary" type="reset">Reset</bq-button>
              <bq-button type="submit">Book</bq-button>
            </div>
          </form>
        </bq-card>
        <bq-card class="[&::part(wrapper)]:h-full">
          <h4 class="m-be-m">Form data</h4>
          <div class="language-javascript overflow-x-scroll whitespace-pre rounded-s">
            // Handle form submit<br />
            const form = ev.target as HTMLFormElement;<br />
            const formData = new FormData(form);<br />
            const formValues = Object.fromEntries(formData.entries());
          </div>
          <pre>
            <code id="time-picker-form-data" class="rounded-s">
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

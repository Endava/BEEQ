import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

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
    noLabel: { control: 'boolean', table: { disable: true } },
    hasLabelTooltip: { control: 'boolean', table: { disable: true } },
    noHelperText: { control: 'boolean', table: { disable: true } },
    optionalLabel: { control: 'boolean', table: { disable: true } },
    prefix: { control: 'boolean', table: { disable: true } },
    suffix: { control: 'boolean', table: { disable: true } },
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
    name: 'bq-input',
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
      Input label ${tooltipTemplate}
    </label>
  `;
  const label = !args.optionalLabel
    ? labelTemplate
    : html`
        <div slot="label" class="flex flex-1 items-center">
          ${labelTemplate}
          <span class="text-text-secondary">Optional</span>
        </div>
      `;
  const style = args.hasLabelTooltip
    ? html`
        <style>
          bq-input {
            inline-size: 75vw;
          }
        </style>
      `
    : nothing;

  return html`
    ${style}
    <bq-input
      autocapitalize=${ifDefined(args.autocapitalize)}
      autocomplete=${ifDefined(args.autocomplete)}
      autocorrect=${ifDefined(args.autocorrect)}
      ?autofocus=${args.autofocus}
      clear-button-label=${args['clear-button-label']}
      debounce-time=${args['debounce-time']}
      ?disable-clear=${args['disable-clear']}
      ?disabled=${args.disabled}
      form=${ifDefined(args.form)}
      inputmode=${ifDefined(args.inputmode)}
      max=${ifDefined(args.max)}
      maxlength=${ifDefined(args.maxlength)}
      min=${ifDefined(args.min)}
      minlength=${ifDefined(args.minlength)}
      name=${ifDefined(args.name)}
      pattern=${ifDefined(args.pattern)}
      placeholder=${ifDefined(args.placeholder)}
      ?readonly=${args.readonly}
      ?required=${args.required}
      step=${ifDefined(args.step)}
      type=${ifDefined(args.type)}
      validation-status=${ifDefined(args['validation-status'])}
      value=${ifDefined(args.value)}
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
      ${Template({ ...args, name: 'bq-input-error', 'validation-status': 'error' })}
      <!-- Success -->
      ${Template({ ...args, name: 'bq-input-success', 'validation-status': 'success' })}
      <!-- Warning -->
      ${Template({ ...args, name: 'bq-input-warning', 'validation-status': 'warning' })}
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

export const WithForm: Story = {
  render: () => {
    const handleFormSubmit = (ev: Event) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      const codeElement = document.getElementById('form-data');
      if (!codeElement) return;

      codeElement.textContent = JSON.stringify(formValues, null, 2);
    };

    return html`
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />

      <div class="grid auto-cols-auto grid-cols-1 gap-y-l sm:grid-cols-2 sm:gap-x-l">
        <bq-card>
          <h4 class="m-be-m">Shipping Information</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit} method="post">
            <div class="grid grid-cols-1 gap-y-m sm:grid-cols-2 sm:gap-x-m">
              <bq-input name="firstName" value="Brad Bernie" autocomplete="given-name" required>
                <label class="flex flex-grow items-center" slot="label">First Name</label>
              </bq-input>
              <bq-input name="lastName" value="Beckett" autocomplete="family-name" required>
                <label class="flex flex-grow items-center" slot="label">Last Name</label>
              </bq-input>
            </div>
            <bq-input name="company" value="Endava" autocomplete="organization" required>
              <label class="flex flex-grow items-center" slot="label">Company</label>
            </bq-input>
            <bq-input name="address" value="413 South Ohio Ave" autocomplete="shipping street-address" required>
              <label class="flex flex-grow items-center" slot="label">Address</label>
            </bq-input>
            <div class="grid grid-cols-1 gap-y-m sm:grid-cols-2 sm:gap-x-m" autocomplete="address-level2">
              <bq-input name="city" value="Oklahoma" required>
                <label class="flex flex-grow items-center" slot="label">City</label>
              </bq-input>
              <bq-select name="country" value="us" autocomplete="country-name">
                <label class="flex flex-grow items-center" slot="label">Country</label>
                <bq-option value="au">Australia</bq-option>
                <bq-option value="ca">Canada</bq-option>
                <bq-option value="mx">Mexico</bq-option>
                <bq-option value="pt">Portugal</bq-option>
                <bq-option value="ro">Romania</bq-option>
                <bq-option value="us">United States</bq-option>
              </bq-select>
            </div>
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
            <code id="form-data" class="rounded-s">
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

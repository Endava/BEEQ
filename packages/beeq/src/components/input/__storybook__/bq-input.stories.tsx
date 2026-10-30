import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

import { INPUT_TYPE, INPUT_VALIDATION } from '../bq-input.types';
import mdx from './bq-input.mdx';

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
    // Events
    bqBlur: fn(),
    bqChange: fn(),
    bqClear: fn(),
    bqFocus: fn(),
    bqInput: fn(),
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
      Input label ${tooltipTemplate}
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
  const style = args.hasLabelTooltip
    ? html`
        <style>
          .bq-story-input {
            inline-size: 75vw;
          }
        </style>
      `
    : nothing;

  return html`
    <style>
      .bq-story-input label {
        display: flex;
        flex-grow: 1;
        align-items: center;
      }

      .bq-story-input div[slot='label'] {
        display: flex;
        flex: 1 1 0%;
        align-items: center;
      }

      .bq-story-input span[slot='helper-text'] {
        display: flex;
        align-items: center;
        gap: var(--bq-spacing-xs);
      }

      .bq-story-input bq-tooltip {
        margin-inline-start: var(--bq-spacing-xs);
      }
    </style>
    ${style}
    <bq-input
      class="bq-story-input"
      autocapitalize=${ifDefined(args.autocapitalize)}
      autocomplete=${ifDefined(args.autocomplete)}
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
      ${
        !args.noHelperText
          ? html`
            <span slot="helper-text">
              <bq-icon name="star"></bq-icon>
              Helper text
            </span>
          `
          : nothing
      }
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

export const Numeric: Story = {
  render: Template,
  args: {
    type: 'number',
    inputmode: 'numeric',
    min: 0,
    step: 1,
    value: 0,
    required: true,
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
    <style>
      .bq-story-input-validation {
        display: flex;
        flex-direction: column;
        gap: var(--bq-spacing-l);
      }
    </style>
    <div class="bq-story-input-validation">
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
      <style>
        .bq-story-input-form {
          display: grid;
          grid-auto-columns: auto;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-l);
        }

        .bq-story-input-form h4 {
          margin-block-end: var(--bq-spacing-m);
        }

        .bq-story-input-form form {
          display: flex;
          flex-direction: column;
          row-gap: var(--bq-spacing-m);
        }

        .bq-story-input-form__row {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-m);
        }

        .bq-story-input-form label {
          display: flex;
          flex-grow: 1;
          align-items: center;
        }

        .bq-story-input-form__actions {
          display: flex;
          justify-content: flex-end;
          column-gap: var(--bq-spacing-s);
        }

        .bq-story-input-form__data::part(wrapper) {
          height: 100%;
        }

        .bq-story-input-form .language-javascript {
          overflow-x: scroll;
          white-space: pre;
          border-radius: var(--bq-radius--s);
        }

        .bq-story-input-form code {
          border-radius: var(--bq-radius--s);
        }

        @media (min-width: 640px) {
          .bq-story-input-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-l);
          }

          .bq-story-input-form__row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-m);
          }
        }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />

      <div class="bq-story-input-form">
        <bq-card>
          <h4>Shipping Information</h4>
          <form @submit=${handleFormSubmit} method="post">
            <div class="bq-story-input-form__row">
              <bq-input
                name="firstName"
                value="Brad Bernie"
                autocomplete="given-name"
                form-validation-message="Please, tell us what's your name"
                required
              >
                <label slot="label">First Name</label>
              </bq-input>
              <bq-input
                name="lastName"
                value="Beckett"
                autocomplete="family-name"
                form-validation-message="Please, tell us your family name"
                required
              >
                <label slot="label">Last Name</label>
              </bq-input>
            </div>
            <bq-input
              name="company"
              value="Endava"
              autocomplete="organization"
              form-validation-message="Please, tell us your company name"
              required
            >
              <label slot="label">Company</label>
            </bq-input>
            <bq-input
              name="address"
              value="413 South Ohio Ave"
              autocomplete="shipping street-address"
              form-validation-message="Please, tell us your address"
              required
            >
              <label slot="label">Address</label>
            </bq-input>
            <div class="bq-story-input-form__row" autocomplete="address-level2">
              <bq-input
                name="city"
                value="Oklahoma"
                form-validation-message="Please, tell us in which city you live"
                required
              >
                <label slot="label">City</label>
              </bq-input>
              <bq-select name="country" value="us" autocomplete="country-name">
                <label slot="label">Country</label>
                <bq-option value="au">Australia</bq-option>
                <bq-option value="ca">Canada</bq-option>
                <bq-option value="mx">Mexico</bq-option>
                <bq-option value="pt">Portugal</bq-option>
                <bq-option value="ro">Romania</bq-option>
                <bq-option value="us">United States</bq-option>
              </bq-select>
            </div>
            <div class="bq-story-input-form__actions">
              <bq-button appearance="secondary" type="reset">Cancel</bq-button>
              <bq-button type="submit">Save</bq-button>
            </div>
          </form>
        </bq-card>
        <bq-card class="bq-story-input-form__data">
          <h4>Form Data</h4>
          <div class="language-javascript">
            // Handle form submit<br />
            const form = ev.target as HTMLFormElement;<br />
            const formData = new FormData(form);<br />
            const formValues = Object.fromEntries(formData.entries());
          </div>
          <pre>
            <code id="form-data">
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

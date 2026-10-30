import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

import { INPUT_VALIDATION } from '../../input/bq-input.types';
import { TEXTAREA_AUTO_CAPITALIZE, TEXTAREA_WRAP } from '../bq-textarea.types';
import mdx from './bq-textarea.mdx';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'bq-textarea',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    autocapitalize: { control: 'select', options: [...TEXTAREA_AUTO_CAPITALIZE] },
    autocomplete: { control: 'text' },
    autofocus: { control: 'boolean' },
    'auto-grow': { control: 'boolean' },
    'debounce-time': { control: 'number' },
    disabled: { control: 'boolean' },
    'disable-resize': { control: 'boolean' },
    form: { control: 'text' },
    'form-validation-message': { control: 'text' },
    maxlength: { control: 'number' },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    rows: { control: 'number' },
    spellcheck: { control: 'boolean' },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'text' },
    wrap: { control: 'select', options: [...TEXTAREA_WRAP] },
    // Not part of the public API, so we don't want to expose it in the docs
    noHelperText: { control: 'boolean', table: { disable: true } },
  },
  args: {
    autocapitalize: 'off',
    autocomplete: 'off',
    autofocus: false,
    'auto-grow': false,
    'debounce-time': 0,
    disabled: false,
    'disable-resize': false,
    form: undefined,
    'form-validation-message': undefined,
    maxlength: 0,
    name: 'textarea',
    placeholder: 'Placeholder...',
    readonly: false,
    required: false,
    rows: 5,
    spellcheck: false,
    'validation-status': 'none',
    value: undefined,
    wrap: 'soft',
    // Events
    bqBlur: fn(),
    bqChange: fn(),
    bqFocus: fn(),
    bqInput: fn(),
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <style>
    .bq-story-textarea span[slot='helper-text'] {
      display: flex;
      align-items: center;
      gap: var(--bq-spacing-xs);
    }
  </style>
  <bq-textarea
    class="bq-story-textarea"
    autocapitalize=${ifDefined(args.autocapitalize)}
    autocomplete=${ifDefined(args.autocomplete)}
    ?autofocus=${args.autofocus}
    ?auto-grow=${args['auto-grow']}
    debounce-time=${ifDefined(args['debounce-time'])}
    ?disabled=${args.disabled}
    ?disable-resize=${args['disable-resize']}
    form=${ifDefined(args.form)}
    form-validation-message=${ifDefined(args['form-validation-message'])}
    maxlength=${ifDefined(args.maxlength)}
    name=${ifDefined(args.name)}
    placeholder=${ifDefined(args.placeholder)}
    ?readonly=${args.readonly}
    ?required=${args.required}
    rows=${ifDefined(args.rows)}
    spellcheck=${ifDefined(args.spellcheck)}
    validation-status=${ifDefined(args['validation-status'])}
    value=${ifDefined(args.value)}
    wrap=${ifDefined(args.wrap)}
    @bqBlur=${args.bqBlur}
    @bqChange=${args.bqChange}
    @bqFocus=${args.bqFocus}
    @bqInput=${args.bqInput}
  >
    <label slot="label">Label</label>
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
  </bq-textarea>
`;

export const Default: Story = {
  render: Template,
};

export const InitialValue: Story = {
  render: Template,
  args: {
    value:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, nulla. Ab non odio facere enim, voluptatum voluptates quod molestias suscipit fugiat et expedita accusamus quidem nostrum maxime illo recusandae ratione?',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    value:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, nulla. Ab non odio facere enim, voluptatum voluptates quod molestias suscipit fugiat et expedita accusamus quidem nostrum maxime illo recusandae ratione?',
  },
};

export const DisableResize: Story = {
  render: () => html`
    <style>
      .bq-story-textarea-disable-resize {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--bq-spacing-m);
      }
      @media (min-width: 640px) {
        .bq-story-textarea-disable-resize {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    </style>
    <div class="bq-story-textarea-disable-resize">
      <!-- Resize enabled -->
      ${Template({ 'disable-resize': false, placeholder: 'Resize is enabled' })}
      <!-- Resize disabled -->
      ${Template({ 'disable-resize': true, placeholder: 'Resize is disabled' })}
    </div>
  `,
  args: {
    value:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, nulla. Ab non odio facere enim, voluptatum voluptates quod molestias suscipit fugiat et expedita accusamus quidem nostrum maxime illo recusandae ratione?',
  },
};

export const MaxLength: Story = {
  render: Template,
  args: {
    maxlength: 100,
    value: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
};

export const ReadOnly: Story = {
  render: Template,
  args: {
    readonly: true,
    value:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, nulla. Ab non odio facere enim, voluptatum voluptates quod molestias suscipit fugiat et expedita accusamus quidem nostrum maxime illo recusandae ratione?',
  },
};

export const Validation: Story = {
  render: (args) => html`
    <style>
      .bq-story-textarea-validation {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        gap: var(--bq-spacing-m);
      }
      @media (min-width: 640px) {
        .bq-story-textarea-validation {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }
    </style>
    <div class="bq-story-textarea-validation">
      <!-- Error -->
      ${Template({ ...args, 'validation-status': 'error' })}
      <!-- Warning -->
      ${Template({ ...args, 'validation-status': 'warning' })}
      <!-- Success -->
      ${Template({ ...args, 'validation-status': 'success' })}
    </div>
  `,
  args: {
    maxlength: 100,
    'validation-status': 'error',
    value: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.',
  },
};

export const WithForm: Story = {
  render: () => {
    const handleFormSubmit = (ev: Event) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const formData = new FormData(form);
      // @ts-expect-error - FormData is not iterable
      const formValues = Object.fromEntries(formData.entries());

      const codeElement = document.getElementById('form-data');
      if (!codeElement) return;

      codeElement.textContent = JSON.stringify(formValues, null, 2);
    };

    return html`
      <style>
        .bq-story-textarea-form {
          display: grid;
          grid-auto-columns: auto;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-l);
        }
        @media (min-width: 640px) {
          .bq-story-textarea-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-l);
          }
        }
        .bq-story-textarea-form h4 {
          margin-block-end: var(--bq-spacing-m);
        }
        .bq-story-textarea-form form {
          display: flex;
          flex-direction: column;
          row-gap: var(--bq-spacing-m);
        }
        .bq-story-textarea-form__row {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-m);
        }
        @media (min-width: 640px) {
          .bq-story-textarea-form__row {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-m);
          }
        }
        .bq-story-textarea-form bq-input label {
          display: flex;
          flex-grow: 1;
          align-items: center;
        }
        .bq-story-textarea-form bq-input div[slot='label'] {
          display: flex;
          flex: 1 1 0%;
          align-items: center;
        }
        .bq-story-textarea-form__actions {
          display: flex;
          justify-content: flex-end;
          column-gap: var(--bq-spacing-s);
        }
        .bq-story-textarea-form__data::part(wrapper) {
          height: 100%;
        }
        .bq-story-textarea-form__snippet {
          overflow-x: scroll;
          white-space: pre;
          border-radius: var(--bq-radius--s);
        }
        .bq-story-textarea-form code {
          border-radius: var(--bq-radius--s);
        }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />
      <div class="bq-story-textarea-form">
        <bq-card>
          <h4>Submit your issue</h4>
          <form @submit=${handleFormSubmit}>
            <div class="bq-story-textarea-form__row">
              <bq-input name="firstName" value="Brad Bernie" autocomplete="given-name" required>
                <label slot="label">First Name</label>
              </bq-input>
              <bq-input name="lastName" value="Beckett" autocomplete="family-name" required>
                <label slot="label">Last Name Optional</label>
              </bq-input>
            </div>
            <bq-input name="email" type="email" autocomplete="email">
              <div slot="label">
                <label>Email address</label>
                <span>Optional</span>
              </div>
            </bq-input>
            <bq-textarea
              required
              form-validation-message="Please, provide a detailed description of the issue"
              maxlength="100"
              name="details"
              placeholder="Please tell us more about the problem you are facing..."
              rows="5"
            >
              <label slot="label">What's the issue?</label>
            </bq-textarea>
            <div class="bq-story-textarea-form__actions">
              <bq-button appearance="secondary" type="reset">Cancel</bq-button>
              <bq-button type="submit">Save</bq-button>
            </div>
          </form>
        </bq-card>
        <bq-card class="bq-story-textarea-form__data">
          <h4>Form Data</h4>
          <div class="language-javascript bq-story-textarea-form__snippet">
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

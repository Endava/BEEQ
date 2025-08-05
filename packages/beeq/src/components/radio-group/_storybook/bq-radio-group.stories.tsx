import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import mdx from './bq-radio-group.mdx';
import { RADIO_GROUP_ORIENTATION } from '../bq-radio-group.types';

const meta: Meta = {
  title: 'Components/Radio Group',
  component: 'bq-radio-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'background-on-hover': { control: 'boolean' },
    'debounce-time': { control: 'number' },
    disabled: { control: 'boolean' },
    fieldset: { control: 'boolean' },
    name: { control: 'text' },
    orientation: { control: 'inline-radio', options: [...RADIO_GROUP_ORIENTATION] },
    required: { control: 'boolean' },
    'required-validation-message': { control: 'text' },
    value: { control: 'text' },
    // Events
    bqChange: { action: 'bqChange' },
    // These events comes from the radio element children, not the radio group
    bqFocus: { action: 'bqFocus', table: { disable: true } },
    bqBlur: { action: 'bqBlur', table: { disable: true } },
    bqClick: { action: 'bqClick', table: { disable: true } },
    // Not part of the component
    label: { control: 'text', table: { disable: true } },
    children: { control: 'text', table: { disable: true } },
  },
  args: {
    'background-on-hover': false,
    'debounce-time': 0,
    disabled: false,
    fieldset: false,
    name: 'bq-radio',
    orientation: 'vertical',
    required: false,
    'required-validation-message': undefined,
    value: undefined,
    // Not part of the component
    children: `
      <bq-radio value="option1"> Radio option 1 </bq-radio>
      <bq-radio value="option2"> Radio option 2 </bq-radio>
      <bq-radio value="option3"> Radio option 3 </bq-radio>
    `,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-radio-group
    ?background-on-hover=${args['background-on-hover']}
    debounce-time=${ifDefined(args['debounce-time'])}
    ?disabled=${args.disabled}
    ?fieldset=${args.fieldset}
    name=${ifDefined(args.name)}
    orientation=${ifDefined(args.orientation)}
    ?required=${args.required}
    required-validation-message=${ifDefined(args['required-validation-message'])}
    value=${ifDefined(args.value)}
    @bqChange=${args.bqChange}
    @bqFocus=${args.bqFocus}
    @bqBlur=${args.bqBlur}
    @bqClick=${args.bqClick}
  >
    ${args.label ? html`${unsafeHTML(args.label)}` : nothing}
    <!-- Radio children -->
    ${args.children ? html`${unsafeHTML(args.children)}` : nothing}
  </bq-radio-group>
`;

export const Default: Story = {
  render: Template,
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
  },
};

export const InitialValue: Story = {
  render: Template,
  args: {
    value: 'option2',
  },
};

export const Horizontal = {
  render: Template,
  args: {
    orientation: 'horizontal',
  },
};

export const Label: Story = {
  render: Template,
  args: {
    label: '<span slot="label">Radio group label</span>',
  },
};

export const Fieldset = {
  render: Template,
  args: {
    fieldset: true,
    label: '<span slot="label">Radio group label</span>',
  },
};

export const WithForm: Story = {
  render: (args: Args) => {
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
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />

      <div class="grid auto-cols-auto grid-cols-1 gap-y-l sm:grid-cols-2 sm:gap-x-l">
        <bq-card>
          <h4 class="m-be-m">Marketing consent</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit} method="post">
            <bq-input name="email" value="brad.beckett202@dontsp.am" type="email" autocomplete="organization" required>
              <label class="flex flex-grow items-center" slot="label">Email address</label>
            </bq-input>
            <!-- Radio group -->
            ${Template({ ...args, value: undefined })}
            <!-- End of radio group -->
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
  args: {
    name: 'marketing-consent',
    orientation: 'horizontal',
    required: true,
    'required-validation-message': 'Please, select if you would like to receive marketing emails or not',
    value: undefined,
    children: `
      <bq-radio value="yes">Yes</bq-radio>
      <bq-radio value="no">No</bq-radio>
    `,
    label: '<span slot="label">I would like to receive marketing emails</span>',
  },
};

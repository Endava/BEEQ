import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';

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
    value: { control: 'text' },
    orientation: { control: 'select', options: [...RADIO_GROUP_ORIENTATION] },
    // Event handlers
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus', table: { disable: true } },
    bqBlur: { action: 'bqBlur', table: { disable: true } },
    // Not part of the component
    label: { control: 'text' },
  },
  args: {
    'background-on-hover': false,
    orientation: 'vertical',
    value: 'option1',
    disabled: false,
    name: 'bq-radio',
    fieldset: false,
    'debounce-time': 0,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  return html`
    <bq-radio-group
      ?background-on-hover=${args['background-on-hover']}
      debounce-time=${args['debounce-time']}
      ?disabled=${args.disabled}
      ?fieldset=${args.fieldset}
      name=${args.name}
      orientation=${args.orientation}
      value=${args.value}
      @bqChange=${args.bqChange}
      @bqFocus=${args.bqFocus}
      @bqBlur=${args.bqBlur}
    >
      <span slot="label">${args.label}</span>
      <bq-radio value="option1"> Radio option 1 </bq-radio>
      <bq-radio value="option2"> Radio option 2 </bq-radio>
      <bq-radio value="option3"> Radio option 3 </bq-radio>
    </bq-radio-group>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Disabled: Story = {
  render: (args: Args) => {
    return html`
      <div style="display: flex; gap: 16px">
        <bq-radio-group
          .name=${args.name}
          .value=${args.value}
          .disabled=${args.disabled}
          .orientation=${args.orientation}
          .fieldset=${args.fieldset}
          debounce-time=${args['debounce-time']}
          @bqChange=${args.bqChange}
          @bqFocus=${args.bqFocus}
          @bqBlur=${args.bqBlur}
        >
          <span slot="label">${args.label}</span>
          <bq-radio value="option1"> Radio option 1 </bq-radio>
          <bq-radio value="option2"> Radio option 2 </bq-radio>
          <bq-radio value="option3"> Radio option 3 </bq-radio>
        </bq-radio-group>
        <bq-radio-group
          .name=${args.name + '1'}
          .value=${args.value}
          .orientation=${args.orientation}
          .fieldset=${args.fieldset}
          debounce-time=${args['debounce-time']}
          @bqChange=${args.bqChange}
          @bqFocus=${args.bqFocus}
          @bqBlur=${args.bqBlur}
        >
          <span slot="label">${args.label}</span>
          <bq-radio value="option1"> Radio option 1 </bq-radio>
          <bq-radio value="option2" disabled> Radio option 2 </bq-radio>
          <bq-radio value="option3"> Radio option 3 </bq-radio>
        </bq-radio-group>
      </div>
    `;
  },
  args: {
    disabled: true,
  },
};

export const Horizontal = {
  render: Template,
  args: {
    orientation: 'horizontal',
  },
};

export const Fieldset = {
  render: Template,
  args: {
    fieldset: true,
    label: 'radio group',
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
          <h4 class="m-be-m">Marketing consent</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit} method="post">
            <bq-input name="email" value="brad.beckett202@dontsp.am" type="email" autocomplete="organization" required>
              <label class="flex flex-grow items-center" slot="label">Email address</label>
            </bq-input>
            <bq-radio-group
              name="marketing-consent"
              orientation="horizontal"
              required-validation-message="Please, select if you would like to receive marketing emails or not"
              value="yes"
              required
            >
              <span slot="label">I would like to receive marketing emails</span>
              <bq-radio value="yes">Yes</bq-radio>
              <bq-radio value="no">No</bq-radio>
            </bq-radio-group>
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

import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-checkbox.mdx';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'bq-checkbox',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'background-on-hover': { control: 'boolean' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    'form-id': { control: 'text' },
    'form-validation-message': { control: 'text' },
    indeterminate: { control: 'boolean' },
    name: { control: 'text' },
    required: { control: 'boolean' },
    value: { control: 'text' },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqChange: { action: 'bqChange' },
    // Not part of the component
    label: { control: 'text' },
  },
  args: {
    'background-on-hover': false,
    checked: false,
    disabled: false,
    'form-id': undefined,
    'form-validation-message': undefined,
    indeterminate: false,
    name: 'bq-checkbox',
    required: false,
    value: 'checkbox-value',
    // Not part of the component
    label: 'Checkbox label',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-checkbox
    ?background-on-hover=${args['background-on-hover']}
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    form-id=${ifDefined(args['form-id'])}
    form-validation-message=${ifDefined(args['form-validation-message'])}
    ?indeterminate=${args.indeterminate}
    name=${ifDefined(args.name)}
    ?required=${args.required}
    value=${ifDefined(args.value)}
    @bqFocus=${args.bqFocus}
    @bqBlur=${args.bqBlur}
    @bqChange=${args.bqChange}
  >
    ${args.label}
  </bq-checkbox>
`;

export const Default: Story = {
  render: Template,
};

export const LongLabel: Story = {
  render: Template,
  args: {
    label: 'By clicking here, I state that I have read and understood the terms and conditions.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const BackgroundOnHover: Story = {
  render: Template,
  args: {
    'background-on-hover': true,
  },
  name: 'Background on hover',
};

export const Checked: Story = {
  render: Template,
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
  },
};

export const Indeterminate: Story = {
  render: (args: Args) => {
    const allCheckboxChange = (event) => {
      const interestCheckboxes = [
        ...Array.from(document.querySelectorAll<HTMLInputElement>('bq-checkbox[name="interest"')),
      ];
      interestCheckboxes.forEach((interestCheckbox: HTMLInputElement) => {
        interestCheckbox.checked = event.detail.checked;
      });
    };

    const interestCheckboxChange = () => {
      const allInterestCheckbox = document.querySelector<HTMLInputElement>('bq-checkbox[name="all-interests"');
      if (!allInterestCheckbox) return;

      const interestCheckboxes = document.querySelectorAll('bq-checkbox[name="interest"');
      const onlyChecked = document.querySelectorAll('bq-checkbox[name="interest"][checked]').length;
      allInterestCheckbox.indeterminate = onlyChecked > 0 && onlyChecked < interestCheckboxes.length;
      allInterestCheckbox.checked = onlyChecked === interestCheckboxes.length;
    };

    return html`
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
        ${Template(args)}
        <div>
          <bq-checkbox value="all" name="all-interests" background-on-hover @bqChange=${allCheckboxChange}>
            Interests
          </bq-checkbox>
          <div style="display: flex; flex-direction: column; margin-inline-start: 24px;">
            <bq-checkbox value="music" name="interest" background-on-hover @bqChange=${interestCheckboxChange}>
              Music
            </bq-checkbox>
            <bq-checkbox value="travel" name="interest" background-on-hover @bqChange=${interestCheckboxChange}>
              Travel
            </bq-checkbox>
            <bq-checkbox value="sport" name="interest" background-on-hover @bqChange=${interestCheckboxChange}>
              Sport
            </bq-checkbox>
          </div>
        </div>
      </div>
    `;
  },
  args: {
    indeterminate: true,
  },
};

export const WithForm: Story = {
  render: (args: Args) => {
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
          <h4 class="m-be-m">Sign in to your account</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit}>
            <bq-input name="email" type="email" autocomplete="email">
              <label class="flex flex-grow items-center" slot="label">Email address</label>
            </bq-input>
            <bq-input name="password" type="password" autocomplete="current-password">
              <label class="flex flex-grow items-center" slot="label">Password</label>
            </bq-input>
            <!-- Checkbox -->
            ${Template({ ...args })}
            <!-- End: Checkbox -->
            <div class="flex justify-end gap-x-s">
              <bq-button appearance="secondary" type="reset">Cancel</bq-button>
              <bq-button type="submit">Log in</bq-button>
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
    'form-validation-message': 'Please accept the terms and conditions.',
    label: 'By clicking here, I state that I have read and understood the terms and conditions.',
    name: 'terms',
    required: true,
    value: 'terms',
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-switch.mdx';
import { SWITCH_INNER_LABEL, SWITCH_JUSTIFY_CONTENT } from '../bq-switch.types';

const meta: Meta = {
  title: 'Components/Switch',
  component: 'bq-switch',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'background-on-hover': { control: 'boolean' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    'form-validation-message': { control: 'text' },
    'full-width': { control: 'boolean' },
    'inner-label': { control: 'inline-radio', options: [...SWITCH_INNER_LABEL] },
    'justify-content': { control: 'select', options: [...SWITCH_JUSTIFY_CONTENT] },
    name: { control: 'text' },
    required: { control: 'boolean' },
    'reverse-order': { control: 'boolean' },
    value: { control: 'text' },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqChange: { action: 'bqChange' },
    // Not part of the component
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    'background-on-hover': false,
    checked: false,
    disabled: false,
    'form-validation-message': undefined,
    'full-width': false,
    'inner-label': 'default',
    'justify-content': 'start',
    name: 'bq-switch',
    required: false,
    'reverse-order': false,
    value: 'Switch value',
    // Not part of the component
    text: 'Toggle me!',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-switch
    ?background-on-hover=${args['background-on-hover']}
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    form-validation-message=${ifDefined(args['form-validation-message'])}
    ?full-width=${args['full-width']}
    inner-label=${ifDefined(args['inner-label'])}
    justify-content=${ifDefined(args['justify-content'])}
    name=${ifDefined(args.name)}
    ?required=${args.required}
    ?reverse-order=${args['reverse-order']}
    value=${ifDefined(args.value)}
    @bqFocus=${args.bqFocus}
    @bqBlur=${args.bqBlur}
    @bqChange=${args.bqChange}
  >
    ${args.text}
  </bq-switch>
`;

export const Default: Story = {
  render: Template,
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
    checked: true,
    disabled: true,
  },
};

export const WithInnerLabel: Story = {
  render: Template,
  args: {
    'inner-label': 'icon',
  },
};

export const ReverseOrder: Story = {
  render: Template,
  args: {
    'reverse-order': true,
  },
};

export const FullWidth: Story = {
  render: (args) => html`
    <div class="max-is-[28rem] m-b-[auto] m-i-[auto]">
      <div class="text-m font-regular m-be-4">
        Use a combination of <code class="bg-ui-secondary-disabled text-text-primary">full-width</code>,
        <code class="bg-ui-secondary-disabled text-text-primary">justify-content</code> and
        <code class="bg-ui-secondary-disabled text-text-primary">reverse-order</code>
      </div>
      ${Template({ ...args, text: 'Show app list in menu', value: 'show-app-list' })}
      ${Template({ ...args, text: 'Show recently added apps', value: 'show-recently-apps', checked: true })}
      ${Template({ ...args, text: 'Show most used apps', value: 'show-used-apps', disabled: true })}
      ${Template({ ...args, text: 'Show app notifications', value: 'show-app-notifications', checked: true })}
    </div>
  `,
  args: {
    'background-on-hover': true,
    'full-width': true,
    'justify-content': 'space-between',
    'reverse-order': true,
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
        <bq-card style="--bq-card--background: transparent">
          <h4 class="m-be-m">Account settings</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit}>
            ${Template({
              ...args,
              text: 'Show app list in the menu',
              name: 'showAppList',
              required: true,
              'form-validation-message': 'Please enable showing the app list in the menu',
            })}
            ${Template({ ...args, text: 'Show recently added apps', name: 'showRecentlyApps', checked: true })}
            ${Template({ ...args, text: 'Show most used apps', name: 'showUsedApps' })}
            ${Template({ ...args, text: 'Show app notifications', name: 'showAppNotifications', checked: true })}
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
    'background-on-hover': true,
    'full-width': true,
    'justify-content': 'space-between',
    'reverse-order': true,
  },
};

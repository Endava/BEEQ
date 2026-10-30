import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

import { SWITCH_INNER_LABEL, SWITCH_JUSTIFY_CONTENT } from '../bq-switch.types';
import mdx from './bq-switch.mdx';

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
    // Events
    bqBlur: fn(),
    bqFocus: fn(),
    bqChange: fn(),
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
    <style>
      .bq-story-switch-full-width {
        max-inline-size: 28rem;
        margin-block: auto;
        margin-inline: auto;
      }
      .bq-story-switch-full-width > div {
        font-size: var(--bq-font-size--m);
        font-weight: var(--bq-font-weight--regular);
        margin-block-end: 1rem;
      }
    </style>
    <div class="bq-story-switch-full-width">
      <div>
        Use a combination of <code>full-width</code>,
        <code>justify-content</code> and
        <code>reverse-order</code>
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
      // @ts-expect-error - FormData is not iterable
      const formValues = Object.fromEntries(formData.entries());

      const codeElement = document.getElementById('form-data');
      if (!codeElement) return;

      codeElement.textContent = JSON.stringify(formValues, null, 2);
    };

    return html`
      <style>
        .bq-story-switch-form {
          display: grid;
          grid-auto-columns: auto;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-l);
        }
        @media (min-width: 640px) {
          .bq-story-switch-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-l);
          }
        }
        .bq-story-switch-form h4 {
          margin-block-end: var(--bq-spacing-m);
        }
        .bq-story-switch-form form {
          display: flex;
          flex-direction: column;
          row-gap: var(--bq-spacing-m);
        }
        .bq-story-switch-form__actions {
          display: flex;
          justify-content: flex-end;
          column-gap: var(--bq-spacing-s);
        }
        .bq-story-switch-form__data::part(wrapper) {
          height: 100%;
        }
        .bq-story-switch-form__snippet {
          overflow-x: scroll;
          white-space: pre;
          border-radius: var(--bq-radius--s);
        }
        .bq-story-switch-form code {
          border-radius: var(--bq-radius--s);
        }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />
      <div class="bq-story-switch-form">
        <bq-card style="--bq-card--background: transparent">
          <h4>Account settings</h4>
          <form @submit=${handleFormSubmit}>
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
            <div class="bq-story-switch-form__actions">
              <bq-button appearance="secondary" type="reset">Cancel</bq-button>
              <bq-button type="submit">Save</bq-button>
            </div>
          </form>
        </bq-card>
        <bq-card class="bq-story-switch-form__data">
          <h4>Form Data</h4>
          <div class="language-javascript bq-story-switch-form__snippet">
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
  args: {
    'background-on-hover': true,
    'full-width': true,
    'justify-content': 'space-between',
    'reverse-order': true,
  },
};

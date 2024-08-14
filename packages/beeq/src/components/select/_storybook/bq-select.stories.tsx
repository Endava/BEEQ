import { useArgs } from '@storybook/preview-api';
import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-select.mdx';
import { INPUT_VALIDATION } from '../../input/bq-input.types';

const meta: Meta = {
  title: 'Components/Select',
  component: 'bq-select',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    autofocus: { control: 'boolean' },
    'clear-button-label': { control: 'text' },
    'debounce-time': { control: 'number' },
    'disable-clear': { control: 'boolean' },
    distance: { control: 'number' },
    disabled: { control: 'boolean' },
    form: { control: 'text' },
    'keep-open-on-select': { control: 'boolean' },
    name: { control: 'text' },
    'max-tags-visible': { control: 'number' },
    multiple: { control: 'boolean' },
    open: { control: 'boolean' },
    'panel-height': { control: 'text' },
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
    placeholder: { control: 'text' },
    readonly: { control: 'boolean' },
    required: { control: 'boolean' },
    'same-width': { control: 'boolean' },
    skidding: { control: 'number' },
    strategy: { control: 'select', options: ['fixed', 'absolute'] },
    'validation-status': { control: 'select', options: [...INPUT_VALIDATION] },
    value: { control: 'object' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqClear: { action: 'bqClear' },
    bqFocus: { action: 'bqFocus' },
    bqSelect: { action: 'bqSelect' },
    // Not part of the public API, so we don't want to expose it in the docs
    noLabel: { control: 'boolean', table: { disable: true } },
    hasLabelTooltip: { control: 'boolean', table: { disable: true } },
    noHelperText: { control: 'boolean', table: { disable: true } },
    optionalLabel: { control: 'boolean', table: { disable: true } },
    prefix: { control: 'boolean', table: { disable: true } },
    suffix: { control: 'boolean', table: { disable: true } },
    customTags: { control: 'boolean', table: { disable: true } },
    options: { control: 'text', table: { disable: true } },
  },
  args: {
    autofocus: false,
    'clear-button-label': 'Clear value',
    'debounce-time': 0,
    'disable-clear': false,
    distance: 8,
    disabled: false,
    form: undefined,
    'keep-open-on-select': false,
    name: 'bq-select',
    'max-tags-visible': 2,
    multiple: false,
    open: false,
    'panel-height': undefined,
    placement: 'bottom',
    placeholder: 'Placeholder',
    'same-width': false,
    skidding: 0,
    strategy: 'absolute',
    readonly: false,
    required: false,
    'validation-status': 'none',
    customTags: false,
    value: undefined,
    // Not part of the public API, so we don't want to expose it in the docs
    options: [
      { label: 'Running', value: 'running', icon: 'sneaker-move' },
      { label: 'Hiking', value: 'hiking', icon: 'boot' },
      { label: 'Biking', value: 'biking', icon: 'person-simple-bike' },
      { label: 'Swimming', value: 'swimming', icon: 'swimming-pool' },
      { label: 'Pizza', value: 'pizza', icon: 'pizza' },
      { label: 'Hamburger', value: 'hamburger', icon: 'hamburger' },
      { label: 'Cookie', value: 'cookie', icon: 'cookie' },
      { label: 'Ice-cream', value: 'ice-cream', icon: 'ice-cream' },
    ],
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const [, updateArgs] = useArgs();

  const onSelect = (event) => {
    updateArgs({ value: event.detail.value });
    args.bqSelect(event);
  };

  const onClear = (event) => {
    updateArgs({ value: [] });
    args.bqClear(event);
  };

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
      Select label ${tooltipTemplate}
    </label>
  `;

  const label = !args.optionalLabel
    ? labelTemplate
    : html`
        <div slot="label" class="flex flex-1">
          ${labelTemplate}
          <span class="text-text-secondary">Optional</span>
        </div>
      `;

  const style = args.hasLabelTooltip
    ? html`
        <style>
          bq-select {
            inline-size: 75vw;
          }
        </style>
      `
    : nothing;

  return html`
    ${style}
    <bq-select
      ?autofocus=${args.autofocus}
      clear-button-label=${args['clear-button-label']}
      distance=${args.distance}
      debounce-time=${args['debounce-time']}
      ?disable-clear=${args['disable-clear']}
      ?disabled=${args.disabled}
      form=${ifDefined(args.form)}
      ?keep-open-on-select=${args['keep-open-on-select']}
      name=${ifDefined(args.name)}
      max-tags-visible=${args['max-tags-visible']}
      ?multiple=${args.multiple}
      ?open=${args.open}
      panel-height=${args['panel-height']}
      placeholder=${args.placeholder}
      placement=${args.placement}
      ?readonly=${args.readonly}
      ?required=${args.required}
      ?same-width=${args['same-width']}
      skidding=${args.skidding}
      strategy=${args.strategy}
      validation-status=${args['validation-status']}
      value=${args.multiple ? ifDefined(JSON.stringify(args.value)) : args.value}
      @bqBlur=${args.bqBlur}
      @bqSelect=${args.customTags ? onSelect : args.bqSelect}
      @bqClear=${args.customTags ? onClear : args.bqClear}
      @bqFocus=${args.bqFocus}
    >
      ${args.customTags
        ? html`${args.options
            .filter((option) => args.value.includes(option.value))
            .map((option, index) => {
              if (index < args['max-tags-visible'] || args['max-tags-visible'] < 0) {
                return html`<bq-tag
                  key=${option.value}
                  size="xsmall"
                  variant="filled"
                  slot="tags"
                  class="[&::part(text)]:text-nowrap [&::part(text)]:leading-small"
                >
                  <bq-icon name=${option.icon} slot="prefix"></bq-icon>
                  ${option.value}
                </bq-tag>`;
              } else if (index === args['max-tags-visible']) {
                return html`
                  <bq-tag
                    key="more"
                    size="xsmall"
                    variant="filled"
                    slot="tags"
                    class="[&::part(text)]:text-nowrap [&::part(text)]:leading-small"
                  >
                    +${args.value.length - index}
                  </bq-tag>
                `;
              }
              return nothing;
            })}`
        : nothing}
      ${!args.noLabel ? label : nothing}
      ${args.prefix ? html`<bq-icon name="user-circle" slot="prefix"></bq-icon>` : nothing}
      ${args.suffix ? html`<bq-icon name="arrow-down" slot="suffix"></bq-icon>` : nothing}
      ${!args.noHelperText
        ? html`
            <span class="flex items-center gap-xs" slot="helper-text">
              <bq-icon name="star"></bq-icon>
              Helper text
            </span>
          `
        : nothing}
      ${args.options.map(
        (option) => html`
          <bq-option value=${option.value}>
            <bq-icon slot="prefix" name=${option.icon}></bq-icon> ${option.label}
          </bq-option>
        `,
      )}
    </bq-select>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Open: Story = {
  render: Template,
  args: {
    autofocus: true,
    open: true,
  },
};

export const InitialValue: Story = {
  render: Template,
  args: {
    value: 'swimming',
  },
};

export const ReadOnly: Story = {
  render: Template,
  args: {
    readonly: true,
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
  },
};

export const Multiple: Story = {
  render: Template,
  args: {
    'keep-open-on-select': true,
    multiple: true,
    value: ['running', 'biking', 'pizza'],
  },
};

export const MultipleCustomRender: Story = {
  render: Template,
  args: {
    'keep-open-on-select': true,
    multiple: true,
    customTags: true,
    value: ['running', 'biking', 'pizza'],
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

export const Validation: Story = {
  render: (args) => html`
    <div class="grid grid-cols-1 gap-m sm:grid-cols-3">
      <!-- Error -->
      ${Template({ ...args, 'validation-status': 'error', value: 1 })}
      <!-- Warning -->
      ${Template({ ...args, 'validation-status': 'warning', value: 3 })}
      <!-- Success -->
      ${Template({ ...args, 'validation-status': 'success', value: 5 })}
    </div>
  `,
};

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: {
    optionalLabel: true,
    prefix: true,
  },
};

export const Tooltip: Story = {
  name: 'Label with "Info tooltip"',
  render: Template,
  args: {
    hasLabelTooltip: true,
    optionalLabel: true,
    prefix: true,
  },
  parameters: {
    layout: 'centered',
  },
};

export const Placement: Story = {
  name: 'Panel placement',
  render: Template,
  args: {
    hasLabelTooltip: true,
    placement: 'top',
    prefix: true,
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
  },
};

export const NoHelperText: Story = {
  name: 'With no Helper Text',
  render: Template,
  args: {
    noHelperText: true,
    prefix: true,
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
          <h4 class="m-be-m">User data</h4>
          <form class="flex flex-col gap-y-m" @submit=${handleFormSubmit}>
            <bq-input name="fullName" value="Brad Bernie Beckett" autocomplete="name" required>
              <label class="flex flex-grow items-center" slot="label">Full Name</label>
            </bq-input>
            <div class="grid grid-cols-1 gap-y-m sm:grid-cols-2 sm:gap-x-m">
              <bq-select name="gender" value="male" autocomplete="sex" readonly>
                <label class="flex flex-grow items-center" slot="label">Gender</label>
                <bq-option value="female">Female</bq-option>
                <bq-option value="male">Male</bq-option>
                <bq-option value="non-binary">Non-binary</bq-option>
                <bq-option value="other">Other</bq-option>
              </bq-select>
              <bq-input name="bdayYear" type="number" value="1983" autocomplete="bday-year" required>
                <label class="flex flex-grow items-center" slot="label">Year of birth date (YYYY)</label>
              </bq-input>
            </div>
            <bq-select name="prevCountries" value='["ro","us"]' multiple autocomplete="country-name">
              <label class="flex flex-grow items-center" slot="label">Previous countries</label>
              <bq-option value="au">Australia</bq-option>
              <bq-option value="ca">Canada</bq-option>
              <bq-option value="mx">Mexico</bq-option>
              <bq-option value="pt">Portugal</bq-option>
              <bq-option value="ro">Romania</bq-option>
              <bq-option value="us">United States</bq-option>
              <span class="flex items-center gap-xs" slot="helper-text">
                Please select the countries you have visited before.
              </span>
            </bq-select>
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

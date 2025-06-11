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
    'disable-scroll-lock': { control: 'boolean' },
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
    bqInput: { action: 'bqInput' },
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
    'disable-scroll-lock': false,
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
    strategy: 'fixed',
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
      debounce-time=${args['debounce-time']}
      ?disable-clear=${args['disable-clear']}
      ?disable-scroll-lock=${args['disable-scroll-lock']}
      ?disabled=${args.disabled}
      distance=${ifDefined(args.distance)}
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
      @bqInput=${args.bqInput}
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
  render: (args: Args) => html` <div class="flex min-h-[150vh] items-center">${Template({ ...args })}</div> `,
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

export const Reset: Story = {
  render: (args: Args) => {
    const handleSelect = async (event: CustomEvent<{ value: string }>) => {
      args.bqSelect(event);

      const bqElement = event.target as HTMLBqSelectElement;
      setTimeout(async () => {
        await bqElement.reset(args.value);
      }, 2000);
    };

    return html`
      <div class="flex flex-col">
        <h4>Reset</h4>
        <p class="text-secondary m-be-l">
          This example demonstrates the <code>reset</code> method. After 2 seconds, the value will be reset to the
          initial value.
        </p>
        ${Template({ ...args, bqSelect: handleSelect })}
      </div>
    `;
  },
  args: {
    value: 'swimming',
  },
};

export const WithForm: Story = {
  render: () => {
    const handleFormSubmit = (ev: Event) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const formData = new FormData(form);
      // @ts-expect-error FormData.entries is not typed
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

export const CustomFiltering: Story = {
  render: (args: Args) => {
    // Simulate an API call with a delay
    const fetchFilteredOptions = async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return args.options.filter(
        (option) =>
          option.label.toLowerCase().includes(query.toLowerCase()) ??
          option.value.toLowerCase().includes(query.toLowerCase()),
      );
    };

    // Function to show all options
    const showAllOptions = (select: HTMLBqSelectElement) => {
      select.querySelectorAll('bq-option').forEach((option) => {
        option.hidden = false;
      });
    };

    const handleInput = async (event: CustomEvent<{ value: string }>) => {
      event.preventDefault();

      const select = event.target as HTMLBqSelectElement;
      const query = event.detail.value;

      // Remove loading/no-results states if they exist
      select.querySelectorAll('bq-option[data-temp]').forEach((option: HTMLBqOptionElement) => option.remove());

      if (!query) {
        showAllOptions(select);
        return;
      }

      // Hide all options initially and show loading state
      select.querySelectorAll('bq-option').forEach((option) => {
        option.hidden = true;
      });

      select.insertAdjacentHTML(
        'beforeend',
        `
        <bq-option disabled data-temp>
          <bq-spinner slot="prefix" animation size="small" text-position="right"></bq-spinner>
          Loading...
        </bq-option>
      `,
      );

      try {
        const filteredOptions = await fetchFilteredOptions(query);

        // Remove loading state
        select.querySelectorAll('bq-option[data-temp]').forEach((option) => option.remove());

        if (filteredOptions.length === 0) {
          select.insertAdjacentHTML(
            'beforeend',
            `
            <bq-option disabled data-temp>
              <bq-icon slot="prefix" name="x-circle"></bq-icon> No results found
            </bq-option>
          `,
          );
        } else {
          // Show only filtered options and highlight matching text
          select.querySelectorAll('bq-option:not([data-temp])').forEach((option: HTMLBqOptionElement) => {
            const matchingOption = filteredOptions.find((item: HTMLBqOptionElement) => item.value === option.value);
            if (matchingOption) {
              option.hidden = false;
              // Create regex that matches the query with case insensitivity
              const regex = new RegExp(`(${query})`, 'gi');
              const highlightedLabel = matchingOption.label.replace(regex, '<b>$1</b>');
              option.innerHTML = `
                <bq-icon slot="prefix" name="${matchingOption.icon}"></bq-icon> ${highlightedLabel}
              `;
            } else {
              option.hidden = true;
            }
          });
        }
      } catch (error) {
        console.error('Error fetching options:', error);
        select.querySelectorAll('bq-option[data-temp]').forEach((option) => option.remove());
        select.insertAdjacentHTML(
          'beforeend',
          `
          <bq-option disabled data-temp>
            <bq-icon slot="prefix" name="warning"></bq-icon> Error loading options
          </bq-option>
        `,
        );
      }

      args.bqInput(event);
    };

    // Handle selection to restore original options
    const handleSelect = (event: CustomEvent<{ value: string; item: HTMLBqOptionElement }>) => {
      const select = event.target as HTMLBqSelectElement;
      // Show all options again
      showAllOptions(select);
      // Remove any temporary options (loading/no results)
      select.querySelectorAll('bq-option[data-temp]').forEach((option) => option.remove());
      // Call the original bqSelect handler
      args.bqSelect(event);
      // Clear the input value after selection
      select.value = '';
    };

    return html`
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />
      <div class="flex flex-col">
        <h4>Custom filtering</h4>
        <p class="text-secondary">
          This example demonstrates custom filtering of options with loading states and visibility toggling. It uses the
          <code>bqInput</code> (with <code>event.preventDefault()</code>) and <code>bqSelect</code> events to handle the
          input and selection events.
        </p>
        <pre>
          <code class="language-javascript rounded-m">
            const bqSelectElement = document.querySelector('bq-select');
            bqSelectElement.addEventListener('bqInput', handleInput);

            function handleInput(event) {
              event.preventDefault();
              ...
            }
          </code>
        </pre>
        ${Template({ ...args, bqInput: handleInput, bqSelect: handleSelect })}
      </div>
      <script type="module">
        import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.10.0/es/highlight.min.js';
        import javascript from 'https://unpkg.com/@highlightjs/cdn-assets@11.10.0/es/languages/javascript.min.js';

        hljs.registerLanguage('javascript', javascript);
        hljs.highlightAll();
      </script>
    `;
  },
  args: {
    placeholder: 'Search options...',
    'debounce-time': 300,
  },
};

export const ScrollableContainer: Story = {
  render: (args: Args) => html`
    <div class="flex h-[150dvh] flex-col gap-m">
      <h4>Scroll Behavior Demo</h4>
      <p class="text-secondary">
        This example demonstrates how the Select behaves in scrollable containers. The Select uses a simple and reliable
        approach:
        <strong>body scroll lock</strong> + <strong>auto-close on ancestor scroll</strong>.
      </p>
      <p class="text-s italic text-secondary">
        (Try to scroll the container below. The Select will close automatically, while the page body scroll is being
        locked until the Select panel is closed.)
      </p>

      <!-- Scrollable container with Select inside -->
      <div class="border border-stroke-primary h-64 overflow-y-auto rounded-s bg-ui-secondary p-m">
        <div class="flex h-96 flex-col gap-m">
          <p>This is a scrollable container with some content...</p>
          <div class="space-y-xs">
            <p>📝 <strong>When Select is closed:</strong> You can scroll this container normally.</p>
            <p>🔒 <strong>When Select is open:</strong> Body scroll is locked to prevent background scrolling.</p>
            <p>
              ⚡ <strong>Auto-close behavior:</strong> The Select panel closes automatically when you scroll anywhere.
            </p>
          </div>

          <!-- Select component inside scrollable container -->
          <div class="mt-xs">${Template({ ...args, placeholder: 'Select inside scrollable container' })}</div>

          <div class="space-y-xs">
            <p>More content below the Select...</p>
            <p>🎯 <strong>Try this:</strong> Open the Select, then try to scroll this container.</p>
            <p>✨ <strong>Expected behavior:</strong> The Select panel will close immediately.</p>
            <p>
              🚀 <strong>Why this works:</strong> Simple scroll detection prevents floating panels from becoming
              detached.
            </p>
          </div>
        </div>
      </div>

      <!-- Regular body scroll area -->
      <div class="mt-l space-y-xs">
        <p>This content is in the normal page body flow.</p>
        <p>
          <strong>Body scroll behavior:</strong> When the Select above is opened, the body scroll is locked. This
          prevents the page from scrolling in the background while the panel is open.
        </p>
        <p>
          <strong>Accessibility note:</strong> This approach follows established patterns used by major design systems
          and provides a consistent, predictable user experience.
        </p>
      </div>
    </div>
  `,
  args: {
    autofocus: false,
    open: false,
    placeholder: 'Select inside container',
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

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
    'clear-button-label': { control: 'text' },
    'disable-clear': { control: 'boolean' },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    // Events
    bqChange: { action: 'bqChange' },
    bqClear: { action: 'bqClear' },
    // Not part of the public API, so we don't want to expose it in the docs
    noLabel: { control: 'bolean', table: { disable: true } },
    noHelperText: { control: 'bolean', table: { disable: true } },
    optionalLabel: { control: 'bolean', table: { disable: true } },
    prefix: { control: 'bolean', table: { disable: true } },
    suffix: { control: 'bolean', table: { disable: true } },
  },
  args: {
    'clear-button-label': 'Clear value',
    'disable-clear': false,
    placeholder: 'Placeholder',
    value: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-input
    clear-button-label=${args['clear-button-label']}
    ?disable-clear=${args['disable-clear']}
    placeholder=${args.placeholder}
    value=${args.value}
    @bqChange=${args.bqChange}
    @bqClear=${args.bqClear}
  >
    ${!args.noLabel
      ? !args.optionalLabel
        ? html`<label slot="label">Input label</label>`
        : html`
            <div slot="label" class="flex flex-1">
              <label class="flex flex-grow items-center">Input label</label>
              <span class="text-text-secondary">Optional</span>
            </div>
          `
      : nothing}
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

export const Optional: Story = {
  name: 'Label with "Optional"',
  render: Template,
  args: {
    optionalLabel: true,
    prefix: true,
    suffix: true,
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

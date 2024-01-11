import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, nothing } from 'lit-html';

import meta from './bq-input.stories';

const metaSearch: Meta = { ...meta, title: 'Components/Search' };
export default metaSearch;

type Story = StoryObj;

const Template = (args: Args) => {
  const style = args.hasLabelTooltip
    ? html`
        <style>
          bq-input {
            width: 75vw;
          }
        </style>
      `
    : nothing;

  return html`
    ${style}
    <bq-input
      autocapitalize=${ifDefined(args.autocapitalize)}
      autocomplete=${ifDefined(args.autocomplete)}
      autocorrect=${ifDefined(args.autocorrect)}
      ?autofocus=${args.autofocus}
      clear-button-label=${args['clear-button-label']}
      debounce-time=${args['debounce-time']}
      ?disable-clear=${args['disable-clear']}
      ?disabled=${args.disabled}
      form=${ifDefined(args.form)}
      iputmode=${args.inputmode}
      max=${ifDefined(args.max)}
      maxlength=${ifDefined(args.maxlength)}
      min=${ifDefined(args.min)}
      minlength=${ifDefined(args.minlength)}
      name=${ifDefined(args.name)}
      pattern=${ifDefined(args.pattern)}
      placeholder=${args.placeholder}
      ?readonly=${args.readonly}
      ?required=${args.required}
      step=${ifDefined(args.step)}
      type=${ifDefined(args.type)}
      validation-status=${args['validation-status']}
      value=${ifDefined(args.value)}
      @bqBlur=${args.bqBlur}
      @bqChange=${args.bqChange}
      @bqClear=${args.bqClear}
      @bqFocus=${args.bqFocus}
      @bqInput=${args.bqInput}
    >
      ${args.prefix ? html`<bq-icon name="magnifying-glass" slot="prefix"></bq-icon>` : nothing}
    </bq-input>
  `;
};

export const Default: Story = {
  render: Template,
  args: {
    prefix: true,
    placeholder: 'Search...',
    type: 'search',
  },
};

export const Value: Story = {
  render: Template,
  args: {
    prefix: true,
    placeholder: 'Search...',
    value: 'value',
    type: 'search',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    prefix: true,
    placeholder: 'Search...',
    type: 'search',
  },
};

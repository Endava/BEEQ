import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-slider.mdx';

const meta: Meta = {
  title: 'Components/Slider',
  component: 'bq-slider',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    'debounce-time': { control: 'number' },
    disabled: { control: 'boolean' },
    'enable-value-indicator': { control: 'boolean' },
    gap: { control: 'number' },
    max: { control: 'number' },
    min: { control: 'number' },
    step: { control: 'number' },
    type: { control: 'inline-radio', options: ['single', 'range'] },
    value: { control: 'object' },
    // Events
    bqBlur: { action: 'bqBlur' },
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus' },
  },
  args: {
    'debounce-time': 0,
    disabled: false,
    'enable-value-indicator': false,
    gap: 0,
    max: 100,
    min: 0,
    step: 1,
    type: 'single',
    value: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div class="w-96">
    <bq-slider
      debounce-time=${ifDefined(args['debounce-time'])}
      ?disabled=${args.disabled}
      ?enable-value-indicator=${args['enable-value-indicator']}
      gap=${ifDefined(args.gap)}
      max=${ifDefined(args.max)}
      min=${ifDefined(args.min)}
      step=${ifDefined(args.step)}
      type=${ifDefined(args.type)}
      value=${ifDefined(JSON.stringify(args.value))}
      @bqBlur=${args.bqBlur}
      @bqChange=${args.bqChange}
      @bqFocus=${args.bqFocus}
    >
      ${args.text}
    </bq-slider>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    value: 30,
  },
};

export const Range: Story = {
  render: Template,
  args: {
    value: [30, 70],
    type: 'range',
  },
};

export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
    value: [30, 70],
    type: 'range',
  },
};

export const ValueIndicator: Story = {
  render: Template,
  args: {
    'enable-value-indicator': true,
    value: [30, 70],
    type: 'range',
  },
};

export const MinMaxStep: Story = {
  name: 'Min, Max, Step',
  render: Template,
  args: {
    'enable-value-indicator': true,
    max: 10,
    min: 0,
    value: 3,
  },
};

export const Gap: Story = {
  render: Template,
  args: {
    'enable-value-indicator': true,
    gap: 4,
    max: 10,
    min: 0,
    type: 'range',
    value: [2, 8],
  },
};

export const DecimalValues: Story = {
  render: Template,
  args: {
    'enable-value-indicator': true,
    max: 1,
    min: 0,
    type: 'range',
    step: 0.05,
    value: [0.3, 0.7],
  },
};

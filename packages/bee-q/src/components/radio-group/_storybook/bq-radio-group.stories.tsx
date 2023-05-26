import type { Args, Meta, StoryObj } from '@storybook/web-components';
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
    name: 'bee-q-radio',
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

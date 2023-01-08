import { html } from 'lit-html';
import mdx from './bq-radio-group.mdx';
import { RADIO_GROUP_ORIENTATION } from '../bq-radio-group.types';

export default {
  title: 'Components/Radio Group',
  component: 'bq-radio-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    orientation: { control: 'select', options: [...RADIO_GROUP_ORIENTATION] },
    disabled: { control: 'boolean' },
    fieldset: { control: 'boolean' },
    value: { control: 'text' },
    name: { control: 'text' },
    'debounce-time': { control: 'number' },
    // Event handlers
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus' },
    bqBlur: { action: 'bqBlur' },
    // Not part of the component
    label: { control: 'text' },
  },
  args: {
    orientation: 'vertical',
    value: 'option1',
    disabled: false,
    name: 'bee-q-radio',
    fieldset: false,
    'debounce-time': 0,
  },
};

const Template = (args) => {
  return html`
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
      <bq-radio value="option1"> option 1 </bq-radio>
      <bq-radio value="option2"> option 2 </bq-radio>
      <bq-radio value="option3"> option 3 </bq-radio>
    </bq-radio-group>
  `;
};

export const Default = (args) => Template(args);

export const Disabled = (args) => {
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
        <bq-radio value="option1"> option 1 </bq-radio>
        <bq-radio value="option2"> option 2 </bq-radio>
        <bq-radio value="option3"> option 3 </bq-radio>
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
        <bq-radio value="option1"> option 1 </bq-radio>
        <bq-radio value="option2" disabled> option 2 </bq-radio>
        <bq-radio value="option3"> option 3 </bq-radio>
      </bq-radio-group>
    </div>
  `;
};
Disabled.args = {
  disabled: true,
};

export const Horizontal = (args) => Template(args);
Horizontal.args = {
  orientation: 'horizontal',
};

export const Fieldset = (args) => Template(args);
Fieldset.args = {
  fieldset: true,
  label: 'radio group',
};

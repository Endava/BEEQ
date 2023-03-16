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
    'background-on-hover': { control: 'boolean' },
    'debounce-time': { control: 'number' },
    disabled: { control: 'boolean' },
    fieldset: { control: 'boolean' },
    name: { control: 'text' },
    value: { control: 'text' },
    orientation: { control: 'select', options: [...RADIO_GROUP_ORIENTATION] },
    // Event handlers
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus' },
    bqBlur: { action: 'bqBlur' },
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

const Template = (args) => {
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

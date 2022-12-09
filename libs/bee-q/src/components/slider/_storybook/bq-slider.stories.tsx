import { html } from 'lit-html';
import mdx from './bq-slider.mdx';
import { SLIDER_TYPE } from '../bq-slider.types';

export default {
  title: 'Components/Slider',
  component: 'bq-slider',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    disabled: { control: 'boolean' },
    'debounce-time': { control: 'number' },
    gap: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    type: { control: 'select', options: [...SLIDER_TYPE] },
    value: { control: 'object' },
    'value-indicator': { control: 'boolean' },
    bqBlur: { action: 'bqBlur' },
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus' },
  },
  args: {
    disabled: false,
    'debounce-time': 0,
    gap: 0,
    min: 0,
    max: 100,
    step: 1,
    type: 'single',
    'value-indicator': false,
  },
};

const Template = (args) =>
  html` <style>
      .container {
        width: 50%;
      }
    </style>
    <div class="container">
      <bq-slider
        ?disabled=${args.disabled}
        debounce-time=${args['debounce-time']}
        gap=${args.gap}
        .min=${args.min}
        .max=${args.max}
        .step=${args.step}
        type=${args.type}
        .value=${args.value}
        ?value-indicator=${args['value-indicator']}
        @bqBlur=${args.bqBlur}
        @bqChange=${args.bqChange}
        @bqFocus=${args.bqFocus}
      ></bq-slider>
    </div>`;

export const Single = (args) => Template(args);
Single.args = {
  type: 'single',
  value: 30,
};

export const Range = (args) => Template(args);
Range.args = {
  type: 'range',
  value: [30, 70],
};

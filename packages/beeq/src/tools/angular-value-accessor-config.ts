import { ValueAccessorConfig } from '@stencil/angular-output-target';

/**
 * This lets you define which components should be integrated with ngModel (i.e. form components).
 * It lets you set what the target prop is (i.e. value), which event will cause the target prop to change.
 */
export const angularValueAccessorBindings: ValueAccessorConfig[] = [
  {
    // Boolean
    elementSelectors: ['bq-checkbox', 'bq-switch'],
    event: 'bqChange',
    targetAttr: 'checked',
    type: 'boolean',
  },
  {
    // Number
    elementSelectors: ['bq-input[type="number"]', 'bq-slider:not[type="range"]'],
    event: 'bqChange',
    targetAttr: 'value',
    type: 'number',
  },
  {
    // Radio
    elementSelectors: ['bq-radio-group'],
    event: 'bqChange',
    targetAttr: 'value',
    type: 'radio',
  },
  {
    // Select
    elementSelectors: ['bq-select'],
    event: 'bqChange',
    targetAttr: 'value',
    type: 'select',
  },
  {
    // Text
    elementSelectors: ['bq-date-picker', 'bq-input:not[type="number"]', 'bq-slider[type="range"]', 'bq-textarea'],
    event: 'bqChange',
    targetAttr: 'value',
    type: 'text',
  },
];

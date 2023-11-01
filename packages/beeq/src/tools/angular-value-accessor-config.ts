import { ValueAccessorConfig } from '@stencil/angular-output-target';

export const angularValueAccessorBindings: ValueAccessorConfig[] = [
  {
    elementSelectors: ['bq-checkbox', 'bq-switch'],
    event: 'bqChange',
    targetAttr: 'checked',
    type: 'boolean',
  },
  {
    elementSelectors: ['bq-input', 'bq-radio-group', 'bq-select', 'bq-slider', 'bq-textarea'],
    event: 'bqChange',
    targetAttr: 'value',
    type: 'text',
  },
];

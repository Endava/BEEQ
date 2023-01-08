import { ValueAccessorConfig } from '@stencil/angular-output-target';

export const angularValueAccessorBindings: ValueAccessorConfig[] = [
  {
    elementSelectors: ['bq-checkbox'],
    event: 'bqChange',
    targetAttr: 'checked',
    type: 'boolean',
  },
  {
    elementSelectors: ['bq-radio-group'],
    event: 'bqChange',
    targetAttr: 'value',
    type: 'text',
  },
];

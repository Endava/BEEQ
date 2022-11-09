import { ValueAccessorConfig } from '@stencil/angular-output-target';

export const angularValueAccessorBindings: ValueAccessorConfig[] = [
  {
    elementSelectors: ['bq-checkbox'],
    event: 'bqChange',
    targetAttr: 'checked',
    type: 'boolean',
  },
];

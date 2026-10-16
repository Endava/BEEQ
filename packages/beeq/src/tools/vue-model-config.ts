import type { ComponentModelConfig } from '@stencil/vue-output-target';

export const vueComponentModels: ComponentModelConfig[] = [
  {
    elements: ['bq-checkbox', 'bq-switch'],
    event: 'bqChange',
    targetAttr: 'checked',
  },
  {
    elements: [
      'bq-date-picker',
      'bq-input',
      'bq-radio-group',
      'bq-select',
      'bq-slider',
      'bq-textarea',
      'bq-time-picker',
    ],
    event: 'bqChange',
    targetAttr: 'value',
  },
];

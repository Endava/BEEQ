import { ComponentModelConfig } from '@stencil/vue-output-target';

export const vueComponentModels: ComponentModelConfig[] = [
  {
    elements: ['bq-checkbox', 'bq-switch'],
    event: 'v-bq-change',
    externalEvent: 'bq-change',
    targetAttr: 'checked',
  },
  {
    elements: ['bq-input', 'bq-radio-group', 'bq-select', 'bq-slider', 'bq-textarea'],
    event: 'v-bq-change',
    externalEvent: 'bq-change',
    targetAttr: 'value',
  },
];

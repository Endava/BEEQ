/** Default fallback input ID */
export const DEFAULT_INPUT_ID = 'time-picker';

/**
 * Shadow DOM parts exposed by the component.
 * Kept as a single list so it is easy to audit against the JSDoc @part list.
 */
export const TIME_PICKER_PARTS = {
  base: 'base',
  label: 'label',
  control: 'control',
  prefix: 'prefix',
  suffix: 'suffix',
  input: 'input',
  segment: 'segment',
  segmentLiteral: 'segment-literal',
  clearBtn: 'clear-btn',
  button: 'button',
  timeTrigger: 'time-trigger',
  container: 'container',
  columns: 'columns',
  column: 'column',
  option: 'option',
  optionSelected: 'option-selected',
  footer: 'footer',
  nowBtn: 'now-btn',
  confirmBtn: 'confirm-btn',
} as const;

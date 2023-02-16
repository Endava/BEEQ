export const SWITCH_INNER_LABEL = ['default', 'icon'] as const;
export type TSwitchInnerLabel = (typeof SWITCH_INNER_LABEL)[number];

export const SWITCH_JUSTIFY_CONTENT = [
  'center',
  'end',
  'flex-end',
  'flex-start',
  'inherit',
  'initial',
  'left',
  'normal',
  'right',
  'space-around',
  'space-between',
  'space-evenly',
  'start',
  'stretch',
] as const;
export type TSwitchJustifyContent = (typeof SWITCH_JUSTIFY_CONTENT)[number];

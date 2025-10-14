export const SPINNER_TEXT_POSITION = ['none', 'left', 'right', 'above', 'below'] as const;
export const SPINNER_SIZE = ['small', 'medium', 'large'] as const;
export type TSpinnerTextPosition = (typeof SPINNER_TEXT_POSITION)[number];
export type TSpinnerSize = (typeof SPINNER_SIZE)[number];

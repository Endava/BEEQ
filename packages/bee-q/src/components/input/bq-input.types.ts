export const INPUT_TYPE = [
  'date',
  'datetime-local',
  'email',
  'number',
  'password',
  'search',
  'tel',
  'text',
  'time',
  'url',
] as const;
export type TInputType = (typeof INPUT_TYPE)[number];

export const INPUT_VALIDATION = ['error', 'none', 'success', 'warning'] as const;
export type TInputValidation = (typeof INPUT_VALIDATION)[number];

export type TInputValue = string | number | string[];

export const SLIDER_TYPE = ['single', 'range'] as const;
export type TSliderType = (typeof SLIDER_TYPE)[number];

export type TSliderValue = string | number | number[];

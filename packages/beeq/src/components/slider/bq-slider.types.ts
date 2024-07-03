export const SLIDER_TYPE = ['single', 'range'] as const;
export type TSliderType = (typeof SLIDER_TYPE)[number];

export type TSliderValue = string | number | number[];

export const SLIDER_ORIENTATION_MODE = ['horizontal', 'vertical'] as const;
export type TSliderOrientation = (typeof SLIDER_ORIENTATION_MODE)[number];

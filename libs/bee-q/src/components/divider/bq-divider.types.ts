export const DIVIDER_ORIENTATION = ['horizontal', 'vertical'] as const;
export type TDividerOrientation = typeof DIVIDER_ORIENTATION[number];

export const DIVIDER_ORIENTATION_ENUM = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical',
} as const;

export const DIVIDER_TITLE_ALIGNMENT = ['start', 'middle', 'end'] as const;
export type TDividerTitleAlignment = typeof DIVIDER_TITLE_ALIGNMENT[number];

export const DIVIDER_STROKE_LINECAP = ['square', 'round', 'butt'] as const;
export type TDividerStrokeLinecap = typeof DIVIDER_STROKE_LINECAP[number];

export const PROGRESS_BORDER_SHAPE = ['square', 'rounded'] as const;
export type TProgressBorderShape = (typeof PROGRESS_BORDER_SHAPE)[number];

export const PROGRESS_THICKNESS = ['medium', 'large'] as const;
export type TProgressThickness = (typeof PROGRESS_THICKNESS)[number];

export const PROGRESS_TYPE = ['default', 'error'] as const;
export type TProgressType = (typeof PROGRESS_TYPE)[number];

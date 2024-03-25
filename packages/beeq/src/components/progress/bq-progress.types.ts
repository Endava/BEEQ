export const PROGRESS_MODE = ['determinate', 'indeterminate'] as const;
export type TProgressMode = (typeof PROGRESS_MODE)[number];

export const PROGRESS_THICKNESS = ['medium', 'large'] as const;
export type TProgressThickness = (typeof PROGRESS_THICKNESS)[number];

export const PROGRESS_TYPE = ['default', 'error'] as const;
export type TProgressType = (typeof PROGRESS_TYPE)[number];

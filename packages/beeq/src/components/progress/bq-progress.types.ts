export const PROGRESS_MODE = ['determinated', 'indeterminated'] as const;
export type TProgressMode = (typeof PROGRESS_MODE)[number];

export const PROGRESS_TICKNESS = ['medium', 'large'] as const;
export type TProgressTickness = (typeof PROGRESS_TICKNESS)[number];

export const PROGRESS_TYPE = ['default', 'error'] as const;
export type TProgressType = (typeof PROGRESS_TYPE)[number];

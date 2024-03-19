export const PROGRESS_MODE = ['determinated', 'indeterminated'] as const;
export type TProgressMode = (typeof PROGRESS_MODE)[number];

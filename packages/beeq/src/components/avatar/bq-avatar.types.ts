export const AVATAR_SIZE = ['xsmall', 'small', 'medium', 'large'] as const;
export type TAvatarSize = (typeof AVATAR_SIZE)[number];

export const AVATAR_SHAPE = ['circle', 'square'] as const;
export type TAvatarShape = (typeof AVATAR_SHAPE)[number];

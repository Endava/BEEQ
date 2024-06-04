export const TAB_SIZE = ['small', 'medium', 'large'] as const;
export type TTabSize = (typeof TAB_SIZE)[number];

export const TAB_ORIENTATION = ['horizontal', 'vertical-left', 'vertical-right'] as const;
export type TTabOrientation = (typeof TAB_ORIENTATION)[number];

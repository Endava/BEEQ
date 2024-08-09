export const TAB_SIZE = ['small', 'medium', 'large'] as const;
export type TTabSize = (typeof TAB_SIZE)[number];

export const TAB_ORIENTATION = ['horizontal', 'vertical'] as const;
export type TTabOrientation = (typeof TAB_ORIENTATION)[number];

export const TAB_PLACEMENT = ['start', 'end'] as const;
export type TTabPlacement = (typeof TAB_PLACEMENT)[number];

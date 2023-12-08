export const ACCORDION_SIZE = ['small', 'medium'] as const;
export type TAccordionSize = (typeof ACCORDION_SIZE)[number];

export const ACCORDION_APPEARANCE = ['filled', 'ghost'] as const;
export type TAccordionAppearance = (typeof ACCORDION_APPEARANCE)[number];

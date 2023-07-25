export const ACCORDION_SIZE = ['small', 'medium'] as const;
export type TAccordionSize = (typeof ACCORDION_SIZE)[number];

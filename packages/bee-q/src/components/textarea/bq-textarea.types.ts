export const TEXTAREA_AUTO_CAPITALIZE = ['on', 'off', 'sentences', 'words', 'characters'] as const;
export type TTextareaAutoCapitalize = (typeof TEXTAREA_AUTO_CAPITALIZE)[number];

export const TEXTAREA_WRAP = ['hard', 'soft', 'off'] as const;
export type TTextareaWrap = (typeof TEXTAREA_WRAP)[number];

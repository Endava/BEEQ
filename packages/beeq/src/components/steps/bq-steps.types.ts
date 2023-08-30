export const STEPS_TYPE = ['numeric', 'icon', 'dot'] as const;
export type TStepsType = (typeof STEPS_TYPE)[number];

export const STEPS_SIZE = ['medium', 'small'] as const;
export type TStepsSize = (typeof STEPS_SIZE)[number];

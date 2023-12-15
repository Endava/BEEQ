export const BUTTON_SIZE = ['small', 'medium', 'large'] as const;
export type TButtonSize = (typeof BUTTON_SIZE)[number];

export const BUTTON_TYPE = ['button', 'submit', 'reset'] as const;
export type TButtonType = (typeof BUTTON_TYPE)[number];

export const BUTTON_APPEARANCE = ['primary', 'secondary', 'link', 'text'] as const;
export type TButtonAppearance = (typeof BUTTON_APPEARANCE)[number];

export const BUTTON_VARIANT = ['standard', 'ghost', 'danger'] as const;
export type TButtonVariant = (typeof BUTTON_VARIANT)[number];

export const BUTTON_BORDER_RADIUS = ['none', 'xs2', 'xs', 's', 'm', 'l', 'full'] as const;
export type TButtonBorderRadius = (typeof BUTTON_BORDER_RADIUS)[number];

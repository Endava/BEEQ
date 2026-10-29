import { type FunctionalComponent, h } from '@stencil/core';

import type { TButtonAppearance, TButtonBorderRadius } from '../../button/bq-button.types';

export type TInternalButtonProps = {
  /** Visual appearance of the button. */
  appearance: TButtonAppearance;
  /** Border radius of the button. */
  border?: TButtonBorderRadius;
  /** Class used to style and locate the button. */
  class: string;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Accessible label, required for icon-only buttons. */
  label?: string;
  /** Whether the button only shows an icon. */
  onlyIcon?: boolean;
  /** Shadow parts exposed on the button. */
  part: string;
  /** Callback fired when the button is activated. */
  onBqClick: (ev: CustomEvent) => void;
  /** Callback fired on the native click, before `bqClick`. */
  onClick?: (ev: MouseEvent) => void;
};

const stopEvent = (ev: Event): void => {
  ev.stopPropagation();
};

/**
 * Small `bq-button` used inside the Time Picker.
 *
 * Its `bqFocus` and `bqBlur` events are stopped so they aren't mistaken for the Time Picker's own.
 */
export const InternalButton: FunctionalComponent<TInternalButtonProps> = (
  { appearance, border, class: className, disabled, label, onlyIcon, part, onBqClick, onClick },
  children,
) => (
  <bq-button
    appearance={appearance}
    border={border}
    class={className}
    disabled={disabled}
    exportparts="button"
    label={label}
    onBqBlur={stopEvent}
    onBqClick={onBqClick}
    onBqFocus={stopEvent}
    onClick={onClick}
    onlyIcon={onlyIcon}
    part={part}
    size="small"
  >
    {children}
  </bq-button>
);

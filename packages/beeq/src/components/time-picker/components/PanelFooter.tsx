import { type FunctionalComponent, h } from '@stencil/core';

import { TIME_PICKER_PARTS } from '../helper/constants';
import { InternalButton } from './InternalButton';

export type TPanelFooterProps = {
  /** Whether the Now button is shown. */
  showNow: boolean;
  /** Whether the Now button is disabled. */
  nowDisabled: boolean;
  /** Text of the Now button. */
  nowLabel: string;
  /** Text of the confirm button. */
  confirmLabel: string;
  /** Callback fired when the Now button is activated. */
  onNow: (ev: CustomEvent) => void;
  /** Callback fired when the confirm button is activated. */
  onConfirm: (ev: CustomEvent) => void;
};

/** Panel footer with the Now and confirm buttons. */
export const PanelFooter: FunctionalComponent<TPanelFooterProps> = ({
  showNow,
  nowDisabled,
  nowLabel,
  confirmLabel,
  onNow,
  onConfirm,
}) => (
  <div class="bq-time-picker__footer" part={TIME_PICKER_PARTS.footer}>
    {showNow && (
      <InternalButton
        appearance="text"
        class="bq-time-picker__now"
        disabled={nowDisabled}
        onBqClick={onNow}
        part={`${TIME_PICKER_PARTS.button} ${TIME_PICKER_PARTS.nowBtn}`}
      >
        {nowLabel}
      </InternalButton>
    )}
    <InternalButton
      appearance="primary"
      class="bq-time-picker__confirm"
      onBqClick={onConfirm}
      part={`${TIME_PICKER_PARTS.button} ${TIME_PICKER_PARTS.confirmBtn}`}
    >
      {confirmLabel}
    </InternalButton>
  </div>
);

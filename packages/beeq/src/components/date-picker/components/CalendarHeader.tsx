import { type FunctionalComponent, h } from '@stencil/core';

import type { TCalendarView } from '../bq-date-picker.types';
import { CALENDAR_PARTS } from '../helper/constants';

export type TCalendarHeaderProps = {
  /** Current view. Used to pick the correct aria label and title. */
  view: TCalendarView;
  /** Label rendered inside the title button (e.g. "January 2026", "2026", "2016 – 2027"). */
  label: string;
  /** Aria label for the previous button. */
  previousLabel: string;
  /** Aria label for the next button. */
  nextLabel: string;
  /** Aria label for the title button. */
  titleLabel: string;
  /** Whether the previous button is disabled. */
  previousDisabled?: boolean;
  /** Whether the next button is disabled. */
  nextDisabled?: boolean;
  /** Whether the title button is interactive. `false` when already on the years view. */
  titleInteractive?: boolean;
  /** Callback fired when the previous button is activated. */
  onPrevious: (ev: Event) => void;
  /** Callback fired when the next button is activated. */
  onNext: (ev: Event) => void;
  /** Callback fired when the title button is activated. */
  onTitleClick: (ev: Event) => void;
};

/**
 * Calendar header — previous / title / next.
 *
 * The header is rendered once per calendar panel. It exposes the standard
 * `calendar__header`, `calendar__previous`, `calendar__heading`, and
 * `calendar__next` shadow parts so consumers can theme any button.
 */
export const CalendarHeader: FunctionalComponent<TCalendarHeaderProps> = ({
  view,
  label,
  previousLabel,
  nextLabel,
  titleLabel,
  previousDisabled = false,
  nextDisabled = false,
  titleInteractive = true,
  onPrevious,
  onNext,
  onTitleClick,
}) => (
  <div class="bq-date-picker__header" part={CALENDAR_PARTS.header}>
    <bq-button
      appearance="text"
      border="s"
      class="bq-date-picker__nav-button"
      disabled={previousDisabled}
      label={previousLabel}
      onlyIcon
      onBqClick={onPrevious}
      part={`${CALENDAR_PARTS.button} ${CALENDAR_PARTS.previous}`}
      size="small"
      type="button"
    >
      <bq-icon aria-hidden="true" class="bq-date-picker__nav-icon" name="caret-left" />
    </bq-button>

    <bq-button
      appearance="text"
      aria-live="polite"
      border="s"
      class={{
        'bq-date-picker__heading': true,
        'bq-date-picker__heading--static': !titleInteractive,
      }}
      data-view={view}
      disabled={!titleInteractive}
      label={titleLabel}
      onBqClick={onTitleClick}
      part={CALENDAR_PARTS.heading}
      size="small"
      type="button"
      block
    >
      {label}
    </bq-button>

    <bq-button
      appearance="text"
      border="s"
      class="bq-date-picker__nav-button"
      disabled={nextDisabled}
      label={nextLabel}
      onlyIcon
      onBqClick={onNext}
      part={`${CALENDAR_PARTS.button} ${CALENDAR_PARTS.next}`}
      size="small"
      type="button"
    >
      <bq-icon aria-hidden="true" class="bq-date-picker__nav-icon" name="caret-right" />
    </bq-button>
  </div>
);

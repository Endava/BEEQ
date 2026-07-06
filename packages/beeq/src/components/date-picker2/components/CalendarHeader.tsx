import { type FunctionalComponent, h } from '@stencil/core';

import type { TCalendarView } from '../bq-date-picker2.types';
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
  onPrevious: (ev: MouseEvent) => void;
  /** Callback fired when the next button is activated. */
  onNext: (ev: MouseEvent) => void;
  /** Callback fired when the title button is activated. */
  onTitleClick: (ev: MouseEvent) => void;
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
  <div class="bq-date-picker2__header" part={CALENDAR_PARTS.header}>
    <button
      aria-label={previousLabel}
      class="bq-date-picker2__nav-button"
      disabled={previousDisabled}
      onClick={onPrevious}
      part={`${CALENDAR_PARTS.button} ${CALENDAR_PARTS.previous}`}
      type="button"
    >
      <bq-icon aria-hidden="true" class="bq-date-picker2__nav-icon" name="caret-left" size="20" />
    </button>

    <button
      aria-label={titleLabel}
      aria-live="polite"
      class={{
        'bq-date-picker2__heading': true,
        'bq-date-picker2__heading--static': !titleInteractive,
      }}
      disabled={!titleInteractive}
      data-view={view}
      onClick={onTitleClick}
      part={CALENDAR_PARTS.heading}
      type="button"
    >
      {label}
    </button>

    <button
      aria-label={nextLabel}
      class="bq-date-picker2__nav-button"
      disabled={nextDisabled}
      onClick={onNext}
      part={`${CALENDAR_PARTS.button} ${CALENDAR_PARTS.next}`}
      type="button"
    >
      <bq-icon aria-hidden="true" class="bq-date-picker2__nav-icon" name="caret-right" size="20" />
    </button>
  </div>
);

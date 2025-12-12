import { h } from '@stencil/core';

import type { TInputValidation } from '../input/bq-input.types';
import type { Placement } from '../../services/interfaces';
import type { DaysOfWeek, TCalendarDate } from './bq-date-picker.types';
import { CalendarHeading, DecadesView, MonthsView, NavigationIcons, YearsView } from './bq-date-picker-views';

/**
 * Render helpers for the date picker component
 */

export interface CalendarMonthConfig {
  isCallyLoaded: boolean;
  exportParts: string;
}

export interface CalendarRenderProps {
  calendarType: string;
  isCallyLoaded: boolean;
  firstDayOfWeek: DaysOfWeek;
  isDateDisallowed?: (date: Date) => boolean;
  locale: Intl.LocalesArgument;
  max?: string;
  min?: string;
  months: number;
  monthsPerView: 'single' | 'months';
  showOutsideDays: boolean;
  tentative?: string;
  value: string;
  labelId: string;
  calendarView: 'days' | 'months' | 'years' | 'decades';
  allowHeaderViewToggle: boolean;
  onCalendarChange: (ev: Event) => void;
  onRangeEnd: () => void;
  onRangeStart: (ev: CustomEvent) => void;
  onPrevClick: (ev: MouseEvent) => void;
  onNextClick: (ev: MouseEvent) => void;
  onHeadingClick: () => void;
  onMonthSelect: (monthIndex: number) => void;
  onYearSelect: (year: number) => void;
  onDecadeSelect: (decadeStart: number) => void;
  getHeadingTitle: () => string;
  getFocusedYear: () => number;
  getStartDecade: () => number;
  generateCalendarMonths: () => Element[];
  setCallyRef: (elem: TCalendarDate) => void;
}

export interface InputRenderProps {
  name: string;
  fallbackInputId: string;
  hasLabel: boolean;
  hasPrefix: boolean;
  hasValue: boolean;
  hasSuffix: boolean;
  disabled: boolean;
  validationStatus: TInputValidation;
  form?: string;
  required?: boolean;
  placeholder?: string;
  displayDate?: string;
  clearButtonLabel?: string;
  disableClear?: boolean;
  labelId: string;
  onBlur: () => void;
  onChange: (ev: Event) => void;
  onFocus: () => void;
  onClearClick: (ev: CustomEvent) => void;
  handleSlotChange: () => void;
  setLabelRef: (elem: HTMLElement) => void;
  setPrefixRef: (elem: HTMLElement) => void;
  setSuffixRef: (elem: HTMLElement) => void;
  setInputRef: (elem: HTMLInputElement) => void;
}

export interface DropdownRenderProps {
  disabled: boolean;
  distance: number;
  open: boolean;
  panelHeight: string;
  placement: Placement;
  skidding: number;
  strategy: 'fixed' | 'absolute';
}

/**
 * Generates a calendar month element
 */
export const generateCalendarMonth = (
  config: CalendarMonthConfig,
  offset?: number,
  className = '',
): Element | null => {
  if (!config.isCallyLoaded) return null;

  return (
    <calendar-month class={className} exportparts={config.exportParts} offset={offset} />
  );
};

/**
 * Renders the label slot
 */
export const renderLabel = (props: Pick<InputRenderProps, 'hasLabel' | 'labelId' | 'name' | 'fallbackInputId' | 'handleSlotChange' | 'setLabelRef'>) => (
  <label
    aria-labelledby={props.labelId}
    class={{ 'bq-date-picker__label': true, '!hidden': !props.hasLabel }}
    htmlFor={props.name || props.fallbackInputId}
    part="label"
    ref={props.setLabelRef}
  >
    <slot id={props.labelId} name="label" onSlotchange={props.handleSlotChange} />
  </label>
);

/**
 * Renders the input control group
 */
export const renderInputControl = (props: InputRenderProps) => (
  <div
    class={{
      'bq-date-picker__control': true,
      [`validation-${props.validationStatus}`]: true,
      disabled: props.disabled,
    }}
    part="control"
    slot="trigger"
  >
    {/* Prefix */}
    <span
      class={{ 'bq-date-picker__control--prefix': true, '!hidden': !props.hasPrefix }}
      part="prefix"
      ref={props.setPrefixRef}
    >
      <slot name="prefix" onSlotchange={props.handleSlotChange} />
    </span>

    {/* HTML Input */}
    <input
      aria-controls={`${props.name}`}
      aria-describedby={props.hasLabel ? props.labelId : null}
      aria-disabled={props.disabled ? 'true' : 'false'}
      aria-invalid={props.validationStatus === 'error' ? 'true' : 'false'}
      aria-haspopup="dialog"
      autoCapitalize="off"
      autoComplete="off"
      class="bq-date-picker__control--input"
      disabled={props.disabled}
      form={props.form}
      id={props.name || props.fallbackInputId}
      name={props.name}
      onBlur={props.onBlur}
      onChange={props.onChange}
      onFocus={props.onFocus}
      part="input"
      placeholder={props.placeholder}
      readonly={/* Readonly for range and multi types */ true}
      ref={props.setInputRef}
      required={props.required}
      spellcheck={false}
      type="text"
      value={props.displayDate}
    />

    {/* Clear Button */}
    {props.hasValue && !props.disabled && !props.disableClear && (
      <bq-button
        appearance="text"
        aria-label={props.clearButtonLabel}
        class="bq-date-picker__control--clear ms-[--bq-date-picker--gap] hidden"
        exportparts="button"
        onBqClick={props.onClearClick}
        part="clear-btn"
        size="small"
      >
        <slot name="clear-icon">
          <bq-icon class="flex" name="x-circle" />
        </slot>
      </bq-button>
    )}

    {/* Suffix */}
    <span
      class="bq-date-picker__control--suffix"
      part="suffix"
      ref={props.setSuffixRef}
    >
      <slot name="suffix" onSlotchange={props.handleSlotChange}>
        <bq-icon class="flex" name="calendar-blank" />
      </slot>
    </span>
  </div>
);

/**
 * Renders the calendar panel
 */
export const renderCalendarPanel = (props: CalendarRenderProps) => {
  if (!props.isCallyLoaded) return null;

  const CallyCalendar = props.calendarType;

  return (
    <CallyCalendar
      aria-labelledby={props.labelId}
      aria-modal="true"
      exportparts="container:calendar__container,header:calendar__header,button:calendar__button,previous:calendar__previous,next:calendar__next,disabled:calendar__disabled,heading:calendar__heading"
      firstDayOfWeek={props.firstDayOfWeek}
      isDateDisallowed={props.isDateDisallowed}
      locale={props.locale as string}
      max={props.max}
      min={props.min}
      months={props.months}
      onChange={props.onCalendarChange}
      onRangeend={props.onRangeEnd}
      onRangestart={props.onRangeStart}
      pageBy={props.monthsPerView}
      ref={props.setCallyRef}
      role="dialog"
      showOutsideDays={props.showOutsideDays}
      tentative={props.tentative}
      value={props.value}
    >
      <NavigationIcons onPrevClick={props.onPrevClick} onNextClick={props.onNextClick} />
      <CalendarHeading
        title={props.getHeadingTitle()}
        allowToggle={props.allowHeaderViewToggle}
        onHeadingClick={props.onHeadingClick}
      />

      {props.calendarView === 'days' && <div>{props.generateCalendarMonths()}</div>}

      {props.calendarView === 'months' && (
        <MonthsView locale={props.locale} onMonthSelect={props.onMonthSelect} />
      )}

      {props.calendarView === 'years' && (
        <YearsView focusedYear={props.getFocusedYear()} onYearSelect={props.onYearSelect} />
      )}

      {props.calendarView === 'decades' && (
        <DecadesView startDecade={props.getStartDecade()} onDecadeSelect={props.onDecadeSelect} />
      )}
    </CallyCalendar>
  );
};

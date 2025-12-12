import { h, FunctionalComponent } from '@stencil/core';
import type { TInputValidation } from '../input/bq-input.types';
import type { DaysOfWeek, TCalendarDate, TDatePickerType } from './bq-date-picker.types';

// ============================================
// Functional Components for Calendar Views
// ============================================

/**
 * Functional component for rendering the months view in the date picker
 */
export const MonthsView: FunctionalComponent<{
  locale: Intl.LocalesArgument;
  onMonthSelect: (monthIndex: number) => void;
}> = ({ locale, onMonthSelect }) => {
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale as string, { month: 'short' }).format(new Date(2020, i, 1)),
  );

  return (
    <div class="bq-date-picker_custom_container">
      {monthNames.map((monthName, index) => (
        <button
          type="button"
          class="bq-date-picker__date-btn"
          onClick={() => onMonthSelect(index)}
          key={`month-${index}`}
        >
          {monthName}
        </button>
      ))}
    </div>
  );
};

/**
 * Functional component for rendering the years view in the date picker
 */
export const YearsView: FunctionalComponent<{
  focusedYear: number;
  onYearSelect: (year: number) => void;
}> = ({ focusedYear, onYearSelect }) => {
  const years = Array.from({ length: 12 }, (_, i) => focusedYear + i);

  return (
    <div class="bq-date-picker_custom_container">
      {years.map((year) => (
        <button
          type="button"
          class="bq-date-picker__date-btn"
          onClick={() => onYearSelect(year)}
          key={`year-${year}`}
        >
          {year}
        </button>
      ))}
    </div>
  );
};

/**
 * Functional component for rendering the decades view in the date picker
 */
export const DecadesView: FunctionalComponent<{
  startDecade: number;
  onDecadeSelect: (decadeStart: number) => void;
}> = ({ startDecade, onDecadeSelect }) => {
  const decades = Array.from({ length: 12 }, (_, i) => startDecade + i * 10);

  return (
    <div class="bq-date-picker_custom_container">
      {decades.map((decadeStart) => (
        <button
          type="button"
          class="bq-date-picker__date-btn"
          onClick={() => onDecadeSelect(decadeStart)}
          key={`decade-${decadeStart}`}
        >
          {`${decadeStart}–${decadeStart + 9}`}
        </button>
      ))}
    </div>
  );
};

/**
 * Functional component for rendering the calendar heading button
 */
export const CalendarHeading: FunctionalComponent<{
  title: string;
  allowToggle: boolean;
  onHeadingClick: () => void;
}> = ({ title, allowToggle, onHeadingClick }) => (
  <div slot="heading">
    <button
      type="button"
      part="calendar__heading"
      class="bq-date-picker__heading-btn"
      disabled={!allowToggle}
      onClick={onHeadingClick}
    >
      {title}
    </button>
  </div>
);

/**
 * Functional component for rendering navigation icons
 */
export const NavigationIcons: FunctionalComponent<{
  onPrevClick: (ev: MouseEvent) => void;
  onNextClick: (ev: MouseEvent) => void;
}> = ({ onPrevClick, onNextClick }) => [
  <bq-icon
    role="button"
    color="text--primary"
    slot="previous"
    name="caret-left"
    label="Previous"
    onClick={onPrevClick}
  />,
  <bq-icon
    role="button"
    color="text--primary"
    slot="next"
    name="caret-right"
    label="Next"
    onClick={onNextClick}
  />,
];

// ============================================
// Functional Components for Input & Controls
// ============================================

export interface DatePickerLabelProps {
  labelId: string;
  name: string;
  fallbackInputId: string;
  hasLabel: boolean;
  onSlotChange: () => void;
  setLabelRef: (el: HTMLElement) => void;
}

export const DatePickerLabel: FunctionalComponent<DatePickerLabelProps> = ({
  labelId,
  name,
  fallbackInputId,
  hasLabel,
  onSlotChange,
  setLabelRef,
}) => (
  <label
    aria-labelledby={labelId}
    class={{ 'bq-date-picker__label': true, '!hidden': !hasLabel }}
    htmlFor={name || fallbackInputId}
    part="label"
    ref={setLabelRef}
  >
    <slot id={labelId} name="label" onSlotchange={onSlotChange} />
  </label>
);

export interface DatePickerInputProps {
  name: string;
  fallbackInputId: string;
  labelId: string;
  hasLabel: boolean;
  disabled: boolean;
  validationStatus: TInputValidation;
  form?: string;
  placeholder?: string;
  required?: boolean;
  type: TDatePickerType;
  displayDate?: string;
  onBlur: () => void;
  onChange: (ev: Event) => void;
  onFocus: () => void;
  setInputRef: (el: HTMLInputElement) => void;
}

export const DatePickerInput: FunctionalComponent<DatePickerInputProps> = ({
  name,
  fallbackInputId,
  labelId,
  hasLabel,
  disabled,
  validationStatus,
  form,
  placeholder,
  required,
  type,
  displayDate,
  onBlur,
  onChange,
  onFocus,
  setInputRef,
}) => (
  <input
    aria-controls={`${name}`}
    aria-describedby={hasLabel ? labelId : null}
    aria-disabled={disabled ? 'true' : 'false'}
    aria-invalid={validationStatus === 'error' ? 'true' : 'false'}
    aria-haspopup="dialog"
    autoCapitalize="off"
    autoComplete="off"
    class="bq-date-picker__control--input"
    disabled={disabled}
    form={form}
    id={name || fallbackInputId}
    name={name}
    onBlur={onBlur}
    onChange={onChange}
    onFocus={onFocus}
    part="input"
    placeholder={placeholder}
    readonly={type !== 'single'}
    ref={setInputRef}
    required={required}
    spellcheck={false}
    type="text"
    value={displayDate}
  />
);

export interface DatePickerClearButtonProps {
  hasValue: boolean;
  disabled: boolean;
  disableClear: boolean;
  clearButtonLabel: string;
  onClearClick: (ev: CustomEvent) => void;
}

export const DatePickerClearButton: FunctionalComponent<DatePickerClearButtonProps> = ({
  hasValue,
  disabled,
  disableClear,
  clearButtonLabel,
  onClearClick,
}) => {
  if (!hasValue || disabled || disableClear) return null;

  return (
    <bq-button
      appearance="text"
      aria-label={clearButtonLabel}
      class="bq-date-picker__control--clear ms-[--bq-date-picker--gap] hidden"
      exportparts="button"
      onBqClick={onClearClick}
      part="clear-btn"
      size="small"
    >
      <slot name="clear-icon">
        <bq-icon class="flex" name="x-circle" />
      </slot>
    </bq-button>
  );
};

export interface DatePickerPrefixProps {
  hasPrefix: boolean;
  onSlotChange: () => void;
  setPrefixRef: (el: HTMLElement) => void;
}

export const DatePickerPrefix: FunctionalComponent<DatePickerPrefixProps> = ({
  hasPrefix,
  onSlotChange,
  setPrefixRef,
}) => (
  <span
    class={{ 'bq-date-picker__control--prefix': true, '!hidden': !hasPrefix }}
    part="prefix"
    ref={setPrefixRef}
  >
    <slot name="prefix" onSlotchange={onSlotChange} />
  </span>
);

export interface DatePickerSuffixProps {
  onSlotChange: () => void;
  setSuffixRef: (el: HTMLElement) => void;
}

export const DatePickerSuffix: FunctionalComponent<DatePickerSuffixProps> = ({ onSlotChange, setSuffixRef }) => (
  <span class="bq-date-picker__control--suffix" part="suffix" ref={setSuffixRef}>
    <slot name="suffix" onSlotchange={onSlotChange}>
      <bq-icon class="flex" name="calendar-blank" />
    </slot>
  </span>
);

// ============================================
// Functional Component for Calendar Panel
// ============================================

export interface CalendarPanelProps {
  calendarType: string;
  labelId: string;
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
  calendarView: 'days' | 'months' | 'years' | 'decades';
  allowHeaderViewToggle: boolean;
  headingTitle: string;
  focusedYear: number;
  startDecade: number;
  calendarMonths: Element[];
  onCalendarChange: (ev: Event) => void;
  onRangeEnd: () => void;
  onRangeStart: (ev: CustomEvent) => void;
  onPrevClick: (ev: MouseEvent) => void;
  onNextClick: (ev: MouseEvent) => void;
  onHeadingClick: () => void;
  onMonthSelect: (monthIndex: number) => void;
  onYearSelect: (year: number) => void;
  onDecadeSelect: (decadeStart: number) => void;
  setCallyRef: (elem: TCalendarDate) => void;
}

export const CalendarPanel: FunctionalComponent<CalendarPanelProps> = ({
  calendarType,
  labelId,
  firstDayOfWeek,
  isDateDisallowed,
  locale,
  max,
  min,
  months,
  monthsPerView,
  showOutsideDays,
  tentative,
  value,
  calendarView,
  allowHeaderViewToggle,
  headingTitle,
  focusedYear,
  startDecade,
  calendarMonths,
  onCalendarChange,
  onRangeEnd,
  onRangeStart,
  onPrevClick,
  onNextClick,
  onHeadingClick,
  onMonthSelect,
  onYearSelect,
  onDecadeSelect,
  setCallyRef,
}) => {
  const CallyCalendar = calendarType;

  return (
    <CallyCalendar
      aria-labelledby={labelId}
      aria-modal="true"
      exportparts="container:calendar__container,header:calendar__header,button:calendar__button,previous:calendar__previous,next:calendar__next,disabled:calendar__disabled,heading:calendar__heading"
      firstDayOfWeek={firstDayOfWeek}
      isDateDisallowed={isDateDisallowed}
      locale={locale as string}
      max={max}
      min={min}
      months={months}
      onChange={onCalendarChange}
      onRangeend={onRangeEnd}
      onRangestart={onRangeStart}
      pageBy={monthsPerView}
      ref={setCallyRef}
      role="dialog"
      showOutsideDays={showOutsideDays}
      tentative={tentative}
      value={value}
    >
      <NavigationIcons onPrevClick={onPrevClick} onNextClick={onNextClick} />
      <CalendarHeading title={headingTitle} allowToggle={allowHeaderViewToggle} onHeadingClick={onHeadingClick} />

      {calendarView === 'days' && <div>{calendarMonths}</div>}
      {calendarView === 'months' && <MonthsView locale={locale} onMonthSelect={onMonthSelect} />}
      {calendarView === 'years' && <YearsView focusedYear={focusedYear} onYearSelect={onYearSelect} />}
      {calendarView === 'decades' && <DecadesView startDecade={startDecade} onDecadeSelect={onDecadeSelect} />}
    </CallyCalendar>
  );
};

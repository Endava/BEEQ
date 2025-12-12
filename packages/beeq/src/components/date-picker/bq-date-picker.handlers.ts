import { isHTMLElement, parseDateInput } from '../../shared/utils';
import type { TDatePickerType } from './bq-date-picker.types';
import { clampDateToRange, formatDisplayValue } from './bq-date-picker.utils';

/**
 * Event handlers for the date picker component
 */

export interface DatePickerHandlerContext {
  disabled?: boolean;
  locale: Intl.LocalesArgument;
  type: TDatePickerType;
  min?: string;
  max?: string;
  formatOptions: Intl.DateTimeFormatOptions;
  isDateDisallowed?: (date: Date) => boolean;
  el: HTMLBqDatePickerElement;
  inputElem: HTMLInputElement;
  internals: ElementInternals;
}

export interface ChangeHandlerCallbacks {
  clearValue: () => void;
  updateFormValidity: () => void;
  emitChange: (value: string) => void;
  setValue: (value: string, displayDate: string) => void;
}

/**
 * Handles the blur event on the input
 */
export const handleBlur = (
  disabled: boolean,
  el: HTMLBqDatePickerElement,
  emitBlur: (el: HTMLBqDatePickerElement) => void,
) => {
  if (disabled) return;
  emitBlur(el);
};

/**
 * Handles the focus event on the input
 */
export const handleFocus = (
  disabled: boolean,
  el: HTMLBqDatePickerElement,
  emitFocus: (el: HTMLBqDatePickerElement) => void,
) => {
  if (disabled) return;
  emitFocus(el);
};

/**
 * Handles the change event on the input
 */
export const handleInputChange = (
  ev: Event,
  context: DatePickerHandlerContext,
  callbacks: ChangeHandlerCallbacks,
): void => {
  if (context.disabled || !isHTMLElement(ev.target, 'input')) return;

  const inputValue = ev.target.value.trim();
  if (!inputValue) {
    callbacks.clearValue();
    callbacks.emitChange(undefined);
    return;
  }

  // Try to parse as date with locale awareness
  const dateValue = parseDateInput(inputValue, context.locale);
  if (!dateValue) {
    // Invalid date: don't update component value to avoid side effects
    context.internals.setFormValue(undefined);
    callbacks.updateFormValidity();
    callbacks.emitChange(inputValue);
    return;
  }

  // Check if date is disallowed
  if (context.isDateDisallowed?.(dateValue)) {
    context.internals.setFormValue(undefined);
    callbacks.updateFormValidity();
    callbacks.emitChange(inputValue);
    return;
  }

  // Valid date: normalize to ISO format and clamp to range if needed
  let isoDate = dateValue.toLocaleDateString('fr-CA');
  isoDate = clampDateToRange(isoDate, context.min, context.max);

  const displayDate = formatDisplayValue(isoDate, context.type, context.locale, context.formatOptions);
  callbacks.setValue(isoDate, displayDate);
  context.internals.setFormValue(isoDate);
  callbacks.updateFormValidity();
  callbacks.emitChange(isoDate);
};

/**
 * Handles the calendar change event
 */
export const handleCalendarChange = (
  ev: Event,
  isInternalUpdate: boolean,
  context: Pick<DatePickerHandlerContext, 'type' | 'locale' | 'formatOptions' | 'inputElem' | 'internals'>,
  callbacks: {
    setValue: (value: string, displayDate: string) => void;
    emitChange: (value: string) => void;
    setOpen: (open: boolean) => void;
    markInternalUpdate: () => void;
  },
  currentValue: string,
): boolean => {
  if (isInternalUpdate) return false;

  const shouldStayOpen = context.type === 'multi';
  const value = (ev.target as unknown as { value: string }).value;

  if (currentValue === value) {
    callbacks.setOpen(shouldStayOpen);
    return false;
  }

  callbacks.markInternalUpdate();

  const displayDate = formatDisplayValue(value, context.type, context.locale, context.formatOptions);
  callbacks.setValue(value, displayDate);
  context.inputElem.value = displayDate;
  context.inputElem.focus();

  context.internals.setFormValue(value);
  callbacks.emitChange(value);
  callbacks.setOpen(shouldStayOpen);

  return true;
};

/**
 * Handles the clear button click
 */
export const handleClearClick = (
  ev: CustomEvent,
  disabled: boolean,
  inputElem: HTMLInputElement,
  callbacks: {
    clearValue: () => void;
    setHasRangeEnd: (value: boolean) => void;
    emitClear: () => void;
    emitChange: (value: string) => void;
  },
): void => {
  if (disabled) return;

  inputElem.value = '';
  callbacks.clearValue();
  callbacks.setHasRangeEnd(false);
  callbacks.emitClear();
  callbacks.emitChange(undefined);
  inputElem.focus();

  ev.stopPropagation();
};

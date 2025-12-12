import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';

import type { Placement } from '../../services/interfaces';
import {
  hasSlotContent,
  isClient,
  isDefined,
  isEventTargetChildOfElement,
  isHTMLElement,
  isNil,
  parseDateInput,
  validatePropValue,
} from '../../shared/utils';
import type { TInputValidation } from '../input/bq-input.types';
import type { DaysOfWeek, TCalendarDate, TDatePickerType } from './bq-date-picker.types';
import { DATE_PICKER_TYPE } from './bq-date-picker.types';
import { isCallyLibraryLoaded, loadCallyLibrary } from './helper/callyLibrary';
import {
  formatDisplayValue,
  formatFocusedDate,
  getFocusedYear,
  getHeadingTitle,
  getStartDecade,
  shiftFocusedDateMonths,
  shiftFocusedDateYears,
  clampDateToRange,
  
} from './bq-date-picker.utils';
import {
  CalendarPanel,
  DatePickerClearButton,
  DatePickerInput,
  DatePickerLabel,
  DatePickerPrefix,
  DatePickerSuffix,
} from './bq-date-picker-views';

/**
 * The Date Picker is a intuitive UI element component allows users to select dates from a visual calendar interface, providing an intuitive way to input date information.
 *
 * @example How to use it
 * ```html
 * <bq-date-picker
 *   first-day-of-week="1"
 *   locale="en-GB"
 *   months-per-view="single"
 *   months="2"
 *   name="bq-date-picker"
 *   placeholder="Enter your date"
 *   placement="bottom-end"
 *   show-outside-days="false"
 *   type="range"
 *   validation-status="none"
 *   value="2024-05-25"
 * >
 *   <label class="flex flex-grow items-center" slot="label">
 *     Date picker label
 *   </label>
 * </bq-date-picker>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/5793a9-date-picker
 * @status stable
 *
 * @dependency bq-button
 * @dependency bq-dropdown
 * @dependency bq-icon
 *
 * @attr {boolean} autofocus - If `true`, the Date picker input will be focused on component render.
 * @attr {string} clear-button-label - The clear button aria label.
 * @attr {boolean} disable-clear - If `true`, the clear button won't be displayed.
 * @attr {boolean} disabled - Indicates whether the Date picker input is disabled or not.
 * @attr {number} distance - Represents the distance (gutter or margin) between the Date picker panel and the input element.
 * @attr {0 | 1 | 2 | 3 | 4 | 5 | 6} first-day-of-week - The first day of the week, where Sunday is 0, Monday is 1, etc.
 * @attr {Intl.DateTimeFormatOptions} format-options - The options to use when formatting the displayed value.
 * @attr {string} form - The ID of the form that the Date picker input belongs to.
 * @attr {string} form-validation-message - The native form validation message (mandatory if `required` is set).
 * @attr {function} is-date-disallowed - A function that takes a date and returns true if the date should not be selectable.
 * @attr {Intl.LocalesArgument} locale - The locale for formatting dates.
 * @attr {string} max - The latest date that can be selected.
 * @attr {string} min - The earliest date that can be selected.
 * @attr {number} months - Number of months to show when range is `true`.
 * @attr {string} name - The Date picker input name.
 * @attr {boolean} open - If `true`, the Date picker panel will be visible.
 * @attr {string} panel-height - When set, it will override the height of the Date picker panel.
 * @attr {Placement} placement - Position of the Date picker panel.
 * @attr {boolean} required - Indicates whether or not the Date picker input is required.
 * @attr {number} skidding - Represents the skidding between the Date picker panel and the input element.
 * @attr {boolean} show-outside-days - Whether to show days outside the month.
 * @attr {string} strategy - Defines the strategy to position the Date picker panel.
 * @attr {string} tentative - The date that is tentatively selected.
 * @attr {TDatePickerType} type - It defines how the calendar will behave.
 * @attr {TInputValidation} validation-status - The validation status of the Select input.
 * @attr {string} value - The select input value.
 * @attr {boolean} allowHeaderViewToggle - Enable custom header to toggle views.
 * @attr {string} calendarView - Panel type when the panel opens.
 *
 * @method clear - Clears the selected value.
 *
 * @event bqBlur - Callback handler emitted when the input loses focus.
 * @event bqChange - Callback handler emitted when the input value has changed.
 * @event bqClear - Callback handler emitted when the input value has been cleared.
 * @event bqFocus - Callback handler emitted when the input has received focus.
 *
 * @part base - The component's base wrapper.
 * @part button - The native HTML button used under the hood in the clear button.
 * @part calendar__button - Any button used in the calendar-month component.
 * @part calendar__container - The calendar-range container for the entire component.
 * @part calendar__day - The buttons corresponding to each day in the calendar-month grid.
 * @part calendar__disabled - A button that is disabled due to min/max.
 * @part calendar__disallowed - Any day that has been disallowed via isDateDisallowed.
 * @part calendar__head - The calendar-month table's header row.
 * @part calendar__header - The calendar-range container for the heading and buttons.
 * @part calendar__heading - The calendar-month heading container.
 * @part calendar__next - The next page button.
 * @part calendar__outside - Any days which are outside the current month.
 * @part calendar__previous - The previous page button.
 * @part calendar__range-end - The day at the end of a date range.
 * @part calendar__range-inner - Any days between the start and end of a date range.
 * @part calendar__range-start - The day at the start of a date range.
 * @part calendar__selected - Any days which are selected.
 * @part calendar__table - The calendar-month table element.
 * @part calendar__td - The calendar-month table's body cells.
 * @part calendar__th - The calendar-month table's header cells.
 * @part calendar__today - The Today's day.
 * @part calendar__tr - Any row within the table.
 * @part calendar__week - The calendar-month table's body rows.
 * @part clear-btn - The clear button.
 * @part control - The input control wrapper.
 * @part input - The native HTML input element.
 * @part label - The label slot container.
 * @part panel - The date picker panel container
 * @part prefix - The prefix slot container.
 * @part suffix - The suffix slot container.
 *
 * @cssprop --bq-date-picker--background-color - Date picker background color.
 * @cssprop --bq-date-picker--border-color - Date picker border color.
 * @cssprop --bq-date-picker--border-color-disabled - Date picker border color when disabled.
 * @cssprop --bq-date-picker--border-color-focus - Date picker border color on focus.
 * @cssprop --bq-date-picker--border-radius - Date picker border radius.
 * @cssprop --bq-date-picker--border-style - Date picker border style.
 * @cssprop --bq-date-picker--border-width - Date picker border width.
 * @cssprop --bq-date-picker--currentDate-border-color - Border color for current date.
 * @cssprop --bq-date-picker--currentDate-border-width - Border width for current date.
 * @cssprop --bq-date-picker--day-size - Date picker button day size.
 * @cssprop --bq-date-picker--gap - Gap between content and prefix/suffix.
 * @cssprop --bq-date-picker--icon-size - Icon size.
 * @cssprop --bq-date-picker--label-margin-bottom - Label margin bottom.
 * @cssprop --bq-date-picker--label-text-color - Label text color.
 * @cssprop --bq-date-picker--label-text-size - Label text size.
 * @cssprop --bq-date-picker--padding-end - Padding end.
 * @cssprop --bq-date-picker--padding-start - Padding start.
 * @cssprop --bq-date-picker--paddingY - Padding top and bottom.
 * @cssprop --bq-date-picker--range-background-color - Range background color.
 * @cssprop --bq-date-picker--range-inner-background-color - Range inner background color.
 * @cssprop --bq-date-picker--text-color - Text color.
 * @cssprop --bq-date-picker--text-placeholder-color - Placeholder text color.
 * @cssprop --bq-date-picker--text-size - Text size.
 */
@Component({
  tag: 'bq-date-picker',
  styleUrl: './scss/bq-date-picker.scss',
  formAssociated: true,
  shadow: { delegatesFocus: true },
})
export class BqDatePicker {
  // Own Properties
  // ====================

  private callyElem?: TCalendarDate;
  private inputElem?: HTMLInputElement;
  private isInternalUpdate = false;
  private labelElem?: HTMLElement;
  private prefixElem?: HTMLElement;
  private suffixElem?: HTMLElement;
  private fallbackInputId = 'date-picker';
  private readonly LOCALE_DATE = 'fr-CA';
  private readonly COMMON_EXPORT_PARTS =
    'calendar__heading,calendar__table,calendar__tr,calendar__head,calendar__week,calendar__th,calendar__td';
  private readonly BUTTON_EXPORT_PARTS =
    'calendar__button,calendar__day,calendar__selected,calendar__today,calendar__disallowed,calendar__outside,calendar__range-start,calendar__range-end,calendar__range-inner';

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals: ElementInternals;
  @Element() el!: HTMLBqDatePickerElement;

  // State() variables
  // =======================================

  @State() isCallyLoaded = false;
  @State() focusedDate: string;
  @State() displayDate: string;
  @State() hasLabel = false;
  @State() hasPrefix = false;
  @State() hasRangeEnd = false;
  @State() hasSuffix = false;
  @State() hasValue = false;

  // Public Property API
  // ========================

  @Prop({ reflect: true }) autofocus: boolean;
  @Prop({ reflect: true }) allowHeaderViewToggle: boolean = false;
  @Prop({ reflect: true }) clearButtonLabel? = 'Clear value';
  @Prop({ reflect: true }) disableClear? = false;
  @Prop({ mutable: true }) disabled?: boolean = false;
  @Prop({ reflect: true }) distance?: number = 8;
  @Prop({ reflect: true }) firstDayOfWeek?: DaysOfWeek = 1;
  @Prop({ reflect: true, mutable: true }) calendarView: 'days' | 'months' | 'years' | 'decades' = 'days';
  @Prop() formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  @Prop({ reflect: true }) form?: string;
  @Prop({ mutable: true }) formValidationMessage?: string;
  @Prop({ reflect: true }) isDateDisallowed?: (date: Date) => boolean;
  @Prop({ reflect: true }) locale: Intl.LocalesArgument = 'en-GB';
  @Prop({ reflect: true }) max?: string;
  @Prop({ reflect: true }) min?: string;
  @Prop({ reflect: true }) months: number;
  @Prop({ reflect: true }) monthsPerView: 'single' | 'months' = 'single';
  @Prop({ reflect: true }) name!: string;
  @Prop({ reflect: true, mutable: true }) open?: boolean = false;
  @Prop({ reflect: true, mutable: true }) panelHeight?: string = 'auto';
  @Prop({ reflect: true }) placeholder?: string;
  @Prop({ reflect: true }) placement?: Placement = 'bottom-end';
  @Prop({ reflect: true }) required?: boolean;
  @Prop({ reflect: true }) skidding?: number = 0;
  @Prop({ reflect: true }) showOutsideDays: boolean = false;
  @Prop({ reflect: true }) strategy?: 'fixed' | 'absolute' = 'fixed';
  @Prop({ reflect: true, mutable: true }) tentative?: string;
  @Prop({ reflect: true }) type: TDatePickerType = 'single';
  @Prop({ reflect: true }) validationStatus: TInputValidation = 'none';
  @Prop({ reflect: true, mutable: true }) value: string;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange(newValue: string, oldValue: string) {
    if (newValue === oldValue) return;
    if (!this.isCallyLoaded) return;

    this.internals.setFormValue(!isNil(newValue) ? `${newValue}` : undefined);
    this.updateFormValidity();
    this.hasValue = isDefined(newValue);
    this.displayDate = formatDisplayValue(newValue, this.type, this.locale, this.formatOptions);
    this.setFocusedDate();
  }

  @Watch('type')
  checkPropValues() {
    validatePropValue(DATE_PICKER_TYPE, 'single', this.el, 'type');
  }

  // Events section
  // ==============================================

  @Event() bqBlur!: EventEmitter<HTMLBqDatePickerElement>;
  @Event() bqChange!: EventEmitter<{ value: string; el: HTMLBqDatePickerElement }>;
  @Event() bqClear!: EventEmitter<HTMLBqDatePickerElement>;
  @Event() bqFocus!: EventEmitter<HTMLBqDatePickerElement>;

  // Component lifecycle events
  // =====================================

  async componentWillLoad() {
    if (!isClient() || this.isCallyLoaded) return;
    try {
      await loadCallyLibrary();
      this.isCallyLoaded = isCallyLibraryLoaded();
    } catch (error) {
      console.error(error);
    }
  }

  componentDidLoad() {
    this.handleSlotChange();
    this.handleValueChange(this.value, undefined);
  }

  componentDidRender() {
    if (this.isInternalUpdate) this.isInternalUpdate = false;
  }

  formAssociatedCallback() {
    this.updateFormValidity();
  }

  formResetCallback() {
    if (isNil(this.value)) return;
    this.clear();
  }

  // Listeners
  // ==============

  @Listen('bqOpen', { capture: true })
  handleOpenChange(ev: CustomEvent<{ open: boolean }>) {
    if (!isEventTargetChildOfElement(ev, this.el)) return;
    if (this.open === ev.detail.open) return;
    this.open = ev.detail.open;
  }

  @Listen('click', { target: 'body', capture: true })
  handleClickOutside(ev: MouseEvent) {
    if (!this.open || this.type !== 'range' || ev.button !== 0) return;
    if (isEventTargetChildOfElement(ev, this.el) || this.hasRangeEnd) return;
    this.tentative = undefined;
    this.hasRangeEnd = false;
  }

  // Public methods API
  // ===============================================

  @Method()
  async clear(): Promise<void> {
    if (this.disabled) return;
    this.value = undefined;
    this.internals.setFormValue(undefined);
    this.bqClear.emit(this.el);
  }

  // Local methods
  // =======================================================

  private handleBlur = () => {
    if (!this.disabled) this.bqBlur.emit(this.el);
  };

  private handleFocus = () => {
    if (!this.disabled) this.bqFocus.emit(this.el);
  };

  private setFocusedDate = () => {
    if (!this.callyElem || !this.isCallyLoaded) return;
    const nextFocused = this.value ? formatFocusedDate(this.value) : new Date().toLocaleDateString(this.LOCALE_DATE);
    if (this.focusedDate === nextFocused) return;
    this.focusedDate = nextFocused;
    if (this.callyElem.focusedDate !== this.focusedDate) {
      this.callyElem.focusedDate = this.focusedDate;
    }
  };

  private handleChange = (ev: Event) => {
    if (this.disabled || !isHTMLElement(ev.target, 'input')) return;

    const inputValue = ev.target.value.trim();
    if (!inputValue) {
      this.clearValue();
      this.bqChange.emit({ value: this.value, el: this.el });
      return;
    }

    const dateValue = parseDateInput(inputValue, this.locale);
    if (!dateValue || this.isDateDisallowed?.(dateValue)) {
      this.internals.setFormValue(undefined);
      this.updateFormValidity();
      this.bqChange.emit({ value: inputValue, el: this.el });
      return;
    }

    let isoDate = dateValue.toLocaleDateString(this.LOCALE_DATE);
    isoDate = clampDateToRange(isoDate, this.min, this.max);
    this.value = isoDate;
    this.displayDate = formatDisplayValue(isoDate, this.type, this.locale, this.formatOptions);
    this.internals.setFormValue(isoDate);
    this.updateFormValidity();
    this.bqChange.emit({ value: this.value, el: this.el });
  };

  private handleCalendarChange = (ev: Event) => {
    if (this.isInternalUpdate) return;
    const shouldStayOpen = this.type === 'multi';
    const value = (ev.target as unknown as { value: string }).value;
    if (this.value === value) {
      this.open = shouldStayOpen;
      return;
    }
    this.isInternalUpdate = true;
    this.value = value;
    this.displayDate = formatDisplayValue(value, this.type, this.locale, this.formatOptions);
    this.inputElem.value = this.displayDate;
    this.inputElem.focus();
    this.internals.setFormValue(value);
    this.bqChange.emit({ value: this.value, el: this.el });
    this.open = shouldStayOpen;
  };

  private handleCalendarRangeStart = (ev: CustomEvent) => {
    this.hasRangeEnd = false;
    this.tentative = ev.detail;
  };

  private handleCalendarRangeEnd = () => {
    this.hasRangeEnd = true;
  };

  private handleClearClick = (ev: CustomEvent) => {
    if (this.disabled) return;
    this.inputElem.value = '';
    this.clearValue();
    this.hasRangeEnd = false;
    this.bqClear.emit(this.el);
    this.bqChange.emit({ value: this.value, el: this.el });
    this.inputElem.focus();
    ev.stopPropagation();
  };

  private clearValue = () => {
    this.value = undefined;
    this.displayDate = undefined;
    this.internals.setFormValue(undefined);
  };

  private handleSlotChange = () => {
    this.hasLabel = hasSlotContent(this.labelElem);
    this.hasPrefix = hasSlotContent(this.prefixElem);
    this.hasSuffix = hasSlotContent(this.suffixElem);
  };

  private handleHeadingClick = () => {
    if (!this.allowHeaderViewToggle) return;
    const viewOrder = { days: 'months', months: 'years', years: 'decades' } as const;
    this.calendarView = viewOrder[this.calendarView] || this.calendarView;
  };

  private handleMonthSelect = (monthIndex: number) => {
    const year = this.focusedDate?.slice(0, 4) || new Date().getFullYear().toString();
    this.updateFocusedDate(`${year}-${String(monthIndex + 1).padStart(2, '0')}-01`);
    this.calendarView = 'days';
  };

  private handleYearSelect = (year: number) => {
    const monthDay = (this.focusedDate || formatFocusedDate(this.value))?.slice(5) || '01-01';
    this.updateFocusedDate(`${year}-${monthDay}`);
    this.calendarView = 'months';
  };

  private handleDecadeSelect = (decadeStart: number) => {
    const monthDay = (this.focusedDate || formatFocusedDate(this.value))?.slice(5) || '01-01';
    this.updateFocusedDate(`${decadeStart}-${monthDay}`);
    this.calendarView = 'years';
  };

  private handlePrevClick = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.navigateCalendar(-1);
  };

  private handleNextClick = (ev: MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    this.navigateCalendar(1);
  };

  private navigateCalendar = (direction: 1 | -1) => {
    const step = this.monthsPerView === 'months' ? this.months || 1 : 1;
    const shifts = { days: step, months: 1, years: 12, decades: 120 };
    const shiftFn = this.calendarView === 'days' ? shiftFocusedDateMonths : shiftFocusedDateYears;
    this.updateFocusedDate(shiftFn(this.focusedDate, this.value, direction * shifts[this.calendarView]));
  };

  private updateFocusedDate = (newFocused: string) => {
    this.focusedDate = newFocused;
    if (this.callyElem) this.callyElem.focusedDate = newFocused;
  };

  private updateFormValidity = () => {
    this.internals?.states.clear();
    if (this.required && (!this.value || this.value.toString().trim() === '')) {
      this.internals?.states.add('invalid');
      this.internals?.setValidity(
        { valueMissing: true },
        this.formValidationMessage ?? 'Please, input or select a valid date',
        this.inputElem,
      );
      return;
    }
    this.internals?.states.add('valid');
    this.internals?.setValidity({});
  };

  private get calendarType() {
    return { single: 'calendar-date', multi: 'calendar-multi', range: 'calendar-range' }[this.type] || 'calendar-date';
  }

  private get labelId() {
    return `bq-date-picker__label-${this.name || this.fallbackInputId}`;
  }

  private getCalendarMonths = (): Element[] => {
    if (!this.isCallyLoaded) return [];

    const exportParts = `${this.COMMON_EXPORT_PARTS},${this.BUTTON_EXPORT_PARTS}`;

    if ((this.type === 'range' || this.type === 'multi') && this.months) {
      return Array.from({ length: this.months }, (_, i) => {
        const offset = i > 0 ? i : undefined;
        const className = offset ? 'hidden sm:block' : '';
        return <calendar-month class={className} exportparts={exportParts} offset={offset} />;
      });
    }

    return [<calendar-month exportparts={exportParts} />];
  };

  // render() function
  // ===================================

  render() {
    return (
      <div class="bq-date-picker" part="base">
        <DatePickerLabel
          labelId={this.labelId}
          name={this.name}
          fallbackInputId={this.fallbackInputId}
          hasLabel={this.hasLabel}
          onSlotChange={this.handleSlotChange}
          setLabelRef={(el) => (this.labelElem = el)}
        />
        <bq-dropdown
          class="bq-date-picker__dropdown is-full [&::part(panel)]:is-auto [&::part(panel)]:p-m"
          disabled={this.disabled}
          distance={this.distance}
          exportparts="panel"
          open={this.open}
          panelHeight={this.panelHeight}
          placement={this.placement}
          skidding={this.skidding}
          strategy={this.strategy}
        >
          <div
            class={{
              'bq-date-picker__control': true,
              [`validation-${this.validationStatus}`]: true,
              disabled: this.disabled,
            }}
            part="control"
            slot="trigger"
          >
            <DatePickerPrefix
              hasPrefix={this.hasPrefix}
              onSlotChange={this.handleSlotChange}
              setPrefixRef={(el) => (this.prefixElem = el)}
            />
            <DatePickerInput
              name={this.name}
              fallbackInputId={this.fallbackInputId}
              labelId={this.labelId}
              hasLabel={this.hasLabel}
              disabled={this.disabled}
              validationStatus={this.validationStatus}
              form={this.form}
              placeholder={this.placeholder}
              required={this.required}
              type={this.type}
              displayDate={this.displayDate}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              setInputRef={(el) => (this.inputElem = el)}
            />
            <DatePickerClearButton
              hasValue={this.hasValue}
              disabled={this.disabled}
              disableClear={this.disableClear}
              clearButtonLabel={this.clearButtonLabel}
              onClearClick={this.handleClearClick}
            />
            <DatePickerSuffix
              onSlotChange={this.handleSlotChange}
              setSuffixRef={(el) => (this.suffixElem = el)}
            />
          </div>
          {this.isCallyLoaded && (
            <CalendarPanel
              calendarType={this.calendarType}
              labelId={this.labelId}
              firstDayOfWeek={this.firstDayOfWeek}
              isDateDisallowed={this.isDateDisallowed}
              locale={this.locale}
              max={this.max}
              min={this.min}
              months={this.months}
              monthsPerView={this.monthsPerView}
              showOutsideDays={this.showOutsideDays}
              tentative={this.tentative}
              value={this.value}
              calendarView={this.calendarView}
              allowHeaderViewToggle={this.allowHeaderViewToggle}
              headingTitle={getHeadingTitle(this.calendarView, this.focusedDate, this.value, this.locale)}
              focusedYear={getFocusedYear(this.focusedDate, this.value)}
              startDecade={getStartDecade(getFocusedYear(this.focusedDate, this.value))}
              calendarMonths={this.getCalendarMonths()}
              onCalendarChange={this.handleCalendarChange}
              onRangeEnd={this.handleCalendarRangeEnd}
              onRangeStart={this.handleCalendarRangeStart}
              onPrevClick={this.handlePrevClick}
              onNextClick={this.handleNextClick}
              onHeadingClick={this.handleHeadingClick}
              onMonthSelect={this.handleMonthSelect}
              onYearSelect={this.handleYearSelect}
              onDecadeSelect={this.handleDecadeSelect}
              setCallyRef={(el) => (this.callyElem = el)}
            />
          )}
        </bq-dropdown>
      </div>
    );
  }
}

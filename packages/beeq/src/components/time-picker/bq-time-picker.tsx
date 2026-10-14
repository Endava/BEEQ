import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, h, Listen, Method, Prop, State, Watch } from '@stencil/core';
import type { JSX } from '@stencil/core/internal';

import type { Placement } from '../../services/interfaces';
import {
  appendSegmentDigit,
  getAdjacentSegmentKey,
  getFirstEmptySegmentKey,
  getSegment,
  getTimeMask,
  hasSlotContent,
  isDefined,
  isEventHandled,
  isEventTargetChildOfElement,
  isString,
  markEventHandled,
  type TTimeHourCycle,
  type TTimeMask,
  type TTimeMaskField,
  updateSegment,
  validatePropValue,
} from '../../shared/utils';
import {
  FLOATING_PLACEMENT,
  FLOATING_STRATEGY,
  HOUR_FORMAT,
  INPUT_VALIDATION,
  type TDayPeriod,
  type TFloatingStrategy,
  type THourFormat,
  TIME_PRECISION,
  type TInputValidation,
  type TPartialTime,
  type TTime,
  type TTimeOption,
  type TTimePickerLabels,
  type TTimePrecision,
} from './bq-time-picker.types';
import { InternalButton } from './components/InternalButton';
import { PanelFooter } from './components/PanelFooter';
import { FixedMinuteColumn, TimeColumn } from './components/TimeColumn';
import { TimeSegments } from './components/TimeSegments';
import { DEFAULT_INPUT_ID, TIME_PICKER_PARTS } from './helper/constants';
import {
  clampTimeToBounds,
  createTimeConstraints,
  getNowTime,
  getTimeValidityFlags,
  type TTimeConstraints,
} from './helper/constraints';
import {
  findOptionByValue,
  getAdjacentColumn,
  getColumnKeyMove,
  getSegmentNavigationTarget,
  isSegmentNavigationKey,
  stepSegmentValue,
} from './helper/keyboard';
import { formatTime, parseLabels, resolveLabels } from './helper/labels';
import { applyColumnPick, getColumnOptions, moveColumnOption, resolvePartialTime } from './helper/options';
import { focusColumnTabStop, getScrollBehavior, scrollSelectionIntoView } from './helper/scroll';
import {
  completeTypedDigit,
  getTimeSegmentGroup,
  matchDayPeriodKey,
  partialToTime,
  readTimeSegmentGroup,
  type TTimeSegmentGroup,
  type TTimeSegmentKey,
  toPartialTime,
} from './helper/segments';
import { normalizeTimeValue, parseTime, serializeTime } from './helper/time';

/** Compose the default constraint-validation message for a set of flags. */
const defaultValidityMessage = (flags: ValidityStateFlags): string => {
  if (flags.badInput) return 'Please, input or select a valid time';
  if (flags.rangeUnderflow) return 'Selected time is before the minimum';
  if (flags.rangeOverflow) return 'Selected time is after the maximum';
  return 'Selected time is not an allowed step';
};

type TOpenSource = 'input' | 'keyboard' | 'trigger' | 'programmatic';

/**
 * The Time Picker lets users enter a time of day by typing into locale-ordered,
 * keyboard-editable segments or by picking hours, minutes, seconds and AM/PM
 * from scrollable columns in a dropdown panel.
 *
 * @example How to use it
 * ```html
 * <bq-time-picker name="meeting-time" value="14:30">
 *   <label slot="label">Meeting time</label>
 * </bq-time-picker>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/0727e1-time-picker
 *
 * @status experimental
 *
 * @dependency bq-button
 * @dependency bq-dropdown
 * @dependency bq-icon
 *
 * @attr {boolean} autofocus - If `true`, the Time picker field will be focused on component render.
 * @attr {boolean} disable-clear - If `true`, the clear button won't be displayed.
 * @attr {boolean} disable-now - If `true`, the panel "Now" button won't be displayed.
 * @attr {boolean} disabled - Indicates whether the Time picker is disabled or not.
 * @attr {number} distance - Represents the distance between the panel and the field.
 * @attr {string} form - The form ID the field belongs to.
 * @attr {string} form-validation-message - Custom native form validation message.
 * @attr {"12" | "24"} hour-format - The clock used by the field and the panel. Defaults to `"24"`.
 * @attr {number} hour-step - Step between selectable hours.
 * @attr {string} labels - JSON object with the text of the column headers, AM/PM labels, buttons and accessible names.
 * @attr {Intl.LocalesArgument} locale - Locale used for the field layout, separators, column headers and day period labels.
 * @attr {string} max - Latest selectable time (`HH:mm` or `HH:mm:ss`).
 * @attr {string} min - Earliest selectable time (`HH:mm` or `HH:mm:ss`).
 * @attr {number} minute-step - Step between selectable minutes.
 * @attr {string} name - The Time picker name.
 * @attr {boolean} open - If `true`, the panel is visible.
 * @attr {string} panel-height - Overrides the height of the panel.
 * @attr {"top" | "right" | "bottom" | "left" | "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"} placement - Placement of the panel.
 * @attr {"hour" | "minute" | "second"} precision - The smallest unit edited and submitted.
 * @attr {boolean} readonly - If `true`, the value can be read and submitted but not changed.
 * @attr {boolean} require-confirm - If `true`, panel picks are a draft shown only in the panel until confirmed with the OK button or Enter.
 * @attr {boolean} required - Whether a value must be entered before submitting the form.
 * @attr {number} second-step - Step between selectable seconds.
 * @attr {number} skidding - Skidding between the panel and the field.
 * @attr {"fixed" | "absolute"} strategy - Positioning strategy for the panel.
 * @attr {"error" | "none" | "success" | "warning"} validation-status - Validation state.
 * @attr {string} value - The selected time in 24-hour format: `HH:mm` (`HH:00` at hour precision) or `HH:mm:ss`.
 *
 * @method clear() - Clears the selected value.
 *
 * @event bqBlur - Emitted when focus leaves the Time picker, including its panel.
 * @event bqChange - Emitted when the value is committed or cleared.
 * @event bqClear - Emitted when the value is cleared.
 * @event bqFocus - Emitted when focus enters the Time picker, including its panel.
 *
 * @slot label - The label displayed above the field.
 * @slot prefix - Content rendered before the field value.
 * @slot suffix - Icon rendered inside the clock trigger button (defaults to a clock icon).
 * @slot clear-icon - Icon used inside the clear button.
 *
 * @part base - The component's base wrapper.
 * @part label - The label slot container.
 * @part control - The field control wrapper.
 * @part prefix - The prefix slot container.
 * @part suffix - The clock trigger button that hosts the suffix slot.
 * @part input - The segmented time field group.
 * @part segment - An editable hour, minute, second or AM/PM segment.
 * @part segment-literal - A locale-derived separator between time segments.
 * @part clear-btn - The clear button.
 * @part button - Any button rendered by the component.
 * @part time-trigger - The clock icon trigger button.
 * @part panel - The dropdown panel container.
 * @part container - The panel content wrapper.
 * @part columns - The wrapper of the panel columns.
 * @part column - A scrollable list of options (hours, minutes, seconds or AM/PM).
 * @part column-header - The header above a column. It stays in place while the column scrolls.
 * @part option - An option inside a column.
 * @part option-selected - The selected option of a column.
 * @part footer - The panel footer.
 * @part now-btn - The "Now" button.
 * @part confirm-btn - The confirm (OK) button.
 *
 * @cssprop --bq-time-picker--background-color - Field background color.
 * @cssprop --bq-time-picker--border-color - Field border color.
 * @cssprop --bq-time-picker--border-color-disabled - Border color when disabled.
 * @cssprop --bq-time-picker--border-color-focus - Border color on focus.
 * @cssprop --bq-time-picker--border-color-danger - Border color when the validation status is `error`.
 * @cssprop --bq-time-picker--border-color-success - Border color when the validation status is `success`.
 * @cssprop --bq-time-picker--border-color-warning - Border color when the validation status is `warning`.
 * @cssprop --bq-time-picker--border-radius - Field border radius.
 * @cssprop --bq-time-picker--border-style - Border style.
 * @cssprop --bq-time-picker--border-width - Border width.
 * @cssprop --bq-time-picker--column-gap - Space between the panel columns.
 * @cssprop --bq-time-picker--column-header-text-color - Text color of the column headers.
 * @cssprop --bq-time-picker--column-height - Height of the scrollable panel columns.
 * @cssprop --bq-time-picker--column-width - Width of a panel column.
 * @cssprop --bq-time-picker--divider-color - Color of the lines between the panel columns and above the footer.
 * @cssprop --bq-time-picker--gap - Gap between the field content and prefix/suffix.
 * @cssprop --bq-time-picker--icon-size - Size of the icons used in prefix/suffix/clear.
 * @cssprop --bq-time-picker--label-margin-bottom - Space below the label.
 * @cssprop --bq-time-picker--label-text-color - Label text color.
 * @cssprop --bq-time-picker--label-text-size - Label text size.
 * @cssprop --bq-time-picker--option-background-hover - Hover background of a column option.
 * @cssprop --bq-time-picker--option-background-selected - Background of the selected column option.
 * @cssprop --bq-time-picker--option-height - Height of a column option.
 * @cssprop --bq-time-picker--option-width - Width of a column option.
 * @cssprop --bq-time-picker--option-radius - Border radius of a column option.
 * @cssprop --bq-time-picker--option-text-selected - Text color of the selected column option.
 * @cssprop --bq-time-picker--padding-end - Field padding end.
 * @cssprop --bq-time-picker--padding-start - Field padding start.
 * @cssprop --bq-time-picker--paddingY - Field vertical padding.
 * @cssprop --bq-time-picker--text-color - Field text color.
 * @cssprop --bq-time-picker--text-placeholder-color - Placeholder text color.
 * @cssprop --bq-time-picker--text-size - Field text size.
 */
@Component({
  tag: 'bq-time-picker',
  styleUrl: './scss/bq-time-picker.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqTimePicker {
  // Own Properties
  // ====================

  /** Source of the current panel opening, used to decide where focus goes. */
  private activeOpenSource: TOpenSource = 'programmatic';

  private cachedLabels?: {
    labels: TTimePickerLabels | string | undefined;
    mask: TTimeMask;
    value: Required<TTimePickerLabels>;
  };
  private cachedConstraints?: { key: string; value: TTimeConstraints };
  private cachedMask?: { key: string; value: TTimeMask };
  /** Validity last passed to `setValidity`, so an unchanged state isn't set again. */
  private appliedValidity?: { key: string; anchor?: HTMLElement };

  /** Sticky flag: the typed draft can't be read as a time. Cleared on the next valid commit or clear. */
  private hasBadInput = false;
  /** Keeps a non-empty partial draft invalid after blur until it is corrected or cleared. */
  private hasBlurredIncompleteDraft = false;
  /** Initial `value` captured at load time, restored on form reset. */
  private initialValue?: string;

  /** Prevents an internal segment commit from rebuilding the visual draft. */
  private isCommittingSegmentDraft = false;

  private labelElem?: HTMLElement;
  private panelElem?: HTMLElement;
  /** Keeps the selected options visible once the panel gets its final size. */
  private panelResizeObserver?: ResizeObserver;

  /** Source to apply to the next open transition initiated by this component. */
  private pendingOpenSource?: Exclude<TOpenSource, 'programmatic'>;

  private prefixElem?: HTMLElement;
  private segmentContainerElem?: HTMLElement;

  /** Returns focus to the field once the panel closes from inside the panel. */
  private shouldRestoreFocus = false;

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals!: ElementInternals;
  @Element() el!: HTMLBqTimePickerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() activeSegment?: TTimeSegmentKey;
  @State() announcement = '';
  @State() constraintErrorMessage?: string;
  @State() hasConstraintError = false;
  @State() hasLabel = false;
  @State() hasPrefix = false;
  @State() hasValue = false;
  /** In `require-confirm` mode, the time picked in the panel until it is confirmed. The field keeps the committed value. */
  @State() panelDraft?: TTime;
  @State() segmentGroups: TTimeSegmentGroup[] = [];

  // Public Property API
  // ========================

  /** If `true`, the Time picker field will be focused on component render. */
  @Prop({ reflect: true }) autofocus: boolean = false;

  /** If `true`, the clear button won't be displayed. */
  @Prop({ reflect: true }) disableClear: boolean = false;

  /** If `true`, the panel "Now" button won't be displayed. */
  @Prop({ reflect: true }) disableNow: boolean = false;

  /** Indicates whether the Time picker is disabled or not. */
  @Prop({ reflect: true, mutable: true }) disabled: boolean = false;

  /** Distance (gutter) between the Time picker panel and the field. */
  @Prop({ reflect: true }) distance: number = 8;

  /** The ID of the form the field belongs to. */
  @Prop({ reflect: true }) form?: string;

  /** Native form validation message. */
  @Prop({ mutable: true }) formValidationMessage?: string;

  /**
   * The clock used by the field and the panel: 24-hour (`"24"`) or 12-hour with an AM/PM period (`"12"`).
   * It doesn't depend on the `locale`.
   */
  @Prop({ reflect: true, mutable: true }) hourFormat: THourFormat = '24';

  /** Step between selectable hours. */
  @Prop({ reflect: true }) hourStep: number = 1;

  /**
   * Text of the column headers, AM/PM labels, buttons and accessible names, as an object or a JSON string.
   * Missing keys fall back to the `locale` names (`hour`, `minute`, `second`, `am`, `pm`),
   * `am/pm` (`period`), or English text: `Now`, `Clear`, `OK`, `Open time picker` and `Choose time`.
   */
  @Prop() labels?: TTimePickerLabels | string;

  /** Locale used for the field layout, separators, column headers and day period labels. The clock is set by `hour-format`. */
  @Prop({ reflect: true }) locale: Intl.LocalesArgument = 'en-GB';

  /**
   * Latest selectable time, in 24-hour format (`HH:mm` or `HH:mm:ss`).
   * Ignored, together with `min`, when it is earlier than `min`.
   */
  @Prop({ reflect: true }) max?: string;

  /**
   * Earliest selectable time, in 24-hour format (`HH:mm` or `HH:mm:ss`).
   * Ignored, together with `max`, when it is later than `max`.
   */
  @Prop({ reflect: true }) min?: string;

  /** Step between selectable minutes. */
  @Prop({ reflect: true }) minuteStep: number = 1;

  /** The Time picker name. */
  @Prop({ reflect: true }) name!: string;

  /** If `true`, the panel is visible. */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  /** Overrides the height of the Time picker panel. */
  @Prop({ reflect: true }) panelHeight?: string = 'auto';

  /** Position of the Time picker panel. */
  @Prop({ reflect: true }) placement: Placement = 'bottom-end';

  /**
   * The smallest unit edited and submitted.
   * - `hour`   → `HH:00`
   * - `minute` → `HH:mm` (default)
   * - `second` → `HH:mm:ss`
   */
  @Prop({ reflect: true }) precision: TTimePrecision = 'minute';

  /** If `true`, the value can be read and submitted but not changed. */
  @Prop({ reflect: true }) readonly: boolean = false;

  /**
   * If `true`, picks made in the panel (including "Now") are a draft until confirmed
   * with the OK button or Enter. The field keeps showing the committed value until then.
   * Escape or an outside click discards the draft.
   */
  @Prop({ reflect: true }) requireConfirm: boolean = false;

  /** Whether a value must be entered before submitting the form. */
  @Prop({ reflect: true }) required: boolean = false;

  /** Step between selectable seconds. */
  @Prop({ reflect: true }) secondStep: number = 1;

  /** Skidding between the panel and the field. */
  @Prop({ reflect: true }) skidding: number = 0;

  /** Positioning strategy for the panel. */
  @Prop({ reflect: true }) strategy: TFloatingStrategy = 'fixed';

  /** Validation state applied to the field. */
  @Prop({ reflect: true }) validationStatus: TInputValidation = 'none';

  /**
   * The selected time, in 24-hour format: `HH:mm` (`HH:00` at hour precision) or `HH:mm:ss` at second precision.
   */
  @Prop({ reflect: true, mutable: true }) value?: string;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValueChange(newValue: string | undefined, oldValue: string | undefined) {
    if (newValue === oldValue) return;

    // Normalize before propagating so an invalid wire value never reaches the form.
    const normalized = normalizeTimeValue(newValue, this.precision);
    if (normalized !== newValue) {
      this.value = normalized;
      return;
    }

    this.hasBadInput = false;
    this.hasBlurredIncompleteDraft = false;
    this.panelDraft = undefined;
    const isSegmentDraftCommit = this.isCommittingSegmentDraft;
    this.isCommittingSegmentDraft = false;
    if (!isSegmentDraftCommit) this.syncDerivedFromValue();
  }

  @Watch('hourFormat')
  @Watch('locale')
  @Watch('precision')
  handleMaskChange() {
    this.checkPropValues();

    const normalized = normalizeTimeValue(this.value, this.precision);
    if (normalized !== this.value) {
      this.value = normalized;
      return;
    }

    this.syncDerivedFromValue();
  }

  @Watch('hourStep')
  @Watch('max')
  @Watch('min')
  @Watch('minuteStep')
  @Watch('required')
  @Watch('secondStep')
  handleConstraintsChange() {
    this.syncValidity();
  }

  @Watch('placement')
  @Watch('strategy')
  @Watch('validationStatus')
  checkPropValues() {
    validatePropValue(TIME_PRECISION, 'minute', this.el, 'precision');
    validatePropValue(FLOATING_STRATEGY, 'fixed', this.el, 'strategy');
    validatePropValue(FLOATING_PLACEMENT, 'bottom-end', this.el, 'placement');
    validatePropValue(INPUT_VALIDATION, 'none', this.el, 'validationStatus');
    validatePropValue(HOUR_FORMAT, '24', this.el, 'hourFormat');
  }

  @Watch('open')
  handleOpen(open: boolean) {
    if (open && (this.disabled || this.readonly)) {
      this.open = false;
      return;
    }

    if (!open) {
      this.pendingOpenSource = undefined;
      this.discardPendingDraft();
      if (this.shouldRestoreFocus) {
        this.shouldRestoreFocus = false;
        this.focusActiveSegment();
      }
      return;
    }

    this.activeOpenSource = this.pendingOpenSource ?? 'programmatic';
    this.pendingOpenSource = undefined;
    this.scrollColumnsToSelection(this.activeOpenSource !== 'input');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Callback handler emitted when focus leaves the Time picker. Moving focus between the field and the panel doesn't emit it. */
  @Event() bqBlur!: EventEmitter<HTMLBqTimePickerElement>;

  /** Callback handler emitted when the value is committed or cleared. */
  @Event() bqChange!: EventEmitter<{ value: string | undefined; el: HTMLElement }>;

  /** Callback handler emitted when the value is cleared. */
  @Event() bqClear!: EventEmitter<HTMLBqTimePickerElement>;

  /** Callback handler emitted when focus enters the Time picker. Moving focus between the field and the panel doesn't emit it. */
  @Event() bqFocus!: EventEmitter<HTMLBqTimePickerElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  connectedCallback() {
    // Reconnects the observer when the element is moved in the DOM; on first load the panel isn't rendered yet.
    this.observePanelSize();
  }

  componentWillLoad() {
    this.checkPropValues();
    this.value = normalizeTimeValue(this.value, this.precision);
    this.initialValue = this.value;
    this.syncDerivedFromValue();
  }

  componentDidLoad() {
    this.handleSlotChange();
    this.syncValidity();
    if (this.autofocus) this.focusActiveSegment();
    this.observePanelSize();
    // `@Watch('open')` doesn't run for the initial prop value.
    if (this.open) this.handleOpen(true);
  }

  formAssociatedCallback() {
    this.syncValidity();
  }

  disconnectedCallback() {
    this.panelResizeObserver?.disconnect();
  }

  formResetCallback() {
    if (this.value === this.initialValue) {
      this.syncDerivedFromValue();
      return;
    }

    this.value = this.initialValue;
  }

  // Listeners
  // ==============

  @Listen('bqOpen', { capture: true })
  handleOpenChange(ev: CustomEvent<{ open: boolean }>) {
    if (!isEventTargetChildOfElement(ev, this.el)) return;

    const { open } = ev.detail;
    if (this.open === open) return;

    this.open = open;
  }

  /** Emits `bqFocus` only when focus enters the component, not when it moves between its parts. */
  @Listen('focusin')
  handleHostFocusIn(ev: FocusEvent) {
    if (this.disabled || this.isFocusMovingWithin(ev)) return;

    this.bqFocus.emit(this.el);
  }

  /** Emits `bqBlur` only when focus leaves the component, not when it moves to the panel or a button. */
  @Listen('focusout')
  handleHostFocusOut(ev: FocusEvent) {
    if (this.disabled || this.isFocusMovingWithin(ev)) return;

    this.bqBlur.emit(this.el);
  }

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  /**
   * Clears the selected value and any pending validation state. Emits `bqClear`.
   * No-op when the component is disabled or read-only.
   *
   * @returns A promise that resolves once the value has been cleared.
   */
  @Method()
  async clear(): Promise<void> {
    if (this.disabled || this.readonly) return;

    this.clearValue();
    this.bqClear.emit(this.el);
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  /** Locale- and precision-aware segment mask, memoized by its inputs. */
  private get mask(): TTimeMask {
    const hourCycle: TTimeHourCycle = this.hourFormat === '12' ? 'h12' : 'h23';
    const key = `${String(this.locale)}|${this.precision}|${hourCycle}`;
    if (this.cachedMask?.key !== key) {
      this.cachedMask = { key, value: getTimeMask(this.locale, this.precision, hourCycle) };
    }
    return this.cachedMask.value;
  }

  /** Labels set through `labels`, completed with the locale names and English defaults. Memoized by their inputs. */
  private get resolvedLabels(): Required<TTimePickerLabels> {
    const { labels, mask } = this;
    // `mask` is always defined, so the first check is true while nothing is cached yet.
    if (this.cachedLabels?.mask !== mask || this.cachedLabels.labels !== labels) {
      const parsed = parseLabels(labels);
      if (isString(labels) && labels.trim() && !parsed) {
        console.warn('[BqTimePicker] `labels` must be a JSON object. The default labels are used.', labels);
      }
      this.cachedLabels = { labels, mask, value: resolveLabels(this.locale, mask.dayPeriods, parsed) };
    }
    return this.cachedLabels.value;
  }

  /** Localized `[AM, PM]` labels used by the field, the panel and letter typing. */
  private get dayPeriodLabels(): readonly [string, string] {
    const { am, pm } = this.resolvedLabels;
    return [am, pm];
  }

  /** Column header and segment accessible name of a field. */
  private getFieldLabel = (field: TTimeMaskField): string => {
    const labels = this.resolvedLabels;
    return field === 'dayPeriod' ? labels.period : labels[field];
  };

  /** Sanitized min/max and step constraints, memoized by their inputs. */
  private get constraints(): TTimeConstraints {
    const { precision, hourStep, minuteStep, secondStep, min, max } = this;
    const key = [precision, hourStep, minuteStep, secondStep, min, max].join('|');
    if (this.cachedConstraints?.key !== key) {
      this.cachedConstraints = {
        key,
        value: createTimeConstraints({ precision, hourStep, minuteStep, secondStep, min, max }),
      };
    }
    return this.cachedConstraints.value;
  }

  /** Display values of the complete segments currently shown in the field. */
  private get displayPartial(): TPartialTime {
    const [group] = this.segmentGroups;
    return group ? readTimeSegmentGroup(group, this.mask.hourCycle).partial : {};
  }

  /** Display values selected in the panel: the unconfirmed draft, or else the field. */
  private get panelPartial(): TPartialTime {
    return this.panelDraft ? toPartialTime(this.panelDraft, this.mask.hourCycle) : this.displayPartial;
  }

  private get isInteractive(): boolean {
    return !this.disabled && !this.readonly;
  }

  /**
   * Segment the browser focuses when it reports the error on submit. It must be focusable:
   * the browser dismisses its validation message when the anchor loses focus.
   */
  private get validationAnchor(): HTMLElement | undefined {
    return (
      this.segmentContainerElem?.querySelector<HTMLElement>('[role="spinbutton"][tabindex="0"]') ??
      this.segmentContainerElem?.querySelector<HTMLElement>('[role="spinbutton"]') ??
      this.segmentContainerElem
    );
  }

  // Segments
  // --------

  /**
   * Moves DOM focus to a segment. Segments keep their elements across renders, so focus moves right
   * away and fast typing lands in the next segment; the frame callback covers a pending re-render.
   */
  private focusSegment = (key: TTimeSegmentKey): void => {
    const focus = () =>
      this.segmentContainerElem
        ?.querySelector<HTMLElement>(`[data-group-id="${key.groupId}"][data-segment-field="${key.field}"]`)
        ?.focus();

    focus();
    requestAnimationFrame(focus);
  };

  private focusActiveSegment = (): void => {
    const key = this.activeSegment ?? this.getFirstSegmentKey();
    if (key) this.focusSegment(key);
  };

  private getFirstSegmentKey = (): TTimeSegmentKey | undefined => {
    const [group] = this.segmentGroups;
    const first = group?.segments[0];
    return first ? { groupId: group.id, field: first.field } : undefined;
  };

  private handleSegmentKeyDown = (ev: KeyboardEvent, key: TTimeSegmentKey): void => {
    if (this.disabled) return;

    ev.stopPropagation();

    if (this.handleSegmentPopupShortcut(ev)) return;
    if (this.handleSegmentEnter(ev)) return;
    if (this.handleSegmentNavigation(ev, key)) return;
    if (this.readonly) return;
    if (this.handleSegmentDeletion(ev, key)) return;
    if (this.handleSegmentIncrement(ev, key)) return;
    if (key.field === 'dayPeriod') {
      this.handleDayPeriodKey(ev, key);
      return;
    }

    this.handleSegmentDigit(ev, key);
  };

  /** Opens the panel with Alt+ArrowDown and moves focus into it. */
  private handleSegmentPopupShortcut = (ev: KeyboardEvent): boolean => {
    if (!ev.altKey || ev.key !== 'ArrowDown') return false;

    ev.preventDefault();
    if (this.open || !this.isInteractive) return true;

    this.pendingOpenSource = 'keyboard';
    this.open = true;
    return true;
  };

  /** Commits a pending panel draft and closes the panel when Enter is pressed in the field. */
  private handleSegmentEnter = (ev: KeyboardEvent): boolean => {
    if (ev.key !== 'Enter' || !this.open) return false;

    ev.preventDefault();
    this.confirmAndClose(false);
    return true;
  };

  private handleSegmentNavigation = (ev: KeyboardEvent, key: TTimeSegmentKey): boolean => {
    if (!isSegmentNavigationKey(ev.key)) return false;

    ev.preventDefault();

    const next = getSegmentNavigationTarget(this.segmentGroups, key, ev.key);
    if (!next) return true;

    this.activeSegment = next;
    this.focusSegment(next);
    return true;
  };

  /** Clears a whole segment; Backspace on an empty segment moves to the previous one. */
  private handleSegmentDeletion = (ev: KeyboardEvent, key: TTimeSegmentKey): boolean => {
    if (ev.key !== 'Backspace' && ev.key !== 'Delete') return false;

    ev.preventDefault();

    const segment = getSegment(this.segmentGroups, key);
    if (!segment) return true;

    const previous = ev.key === 'Backspace' ? getAdjacentSegmentKey(this.segmentGroups, key, -1) : undefined;
    if (segment.value) this.editSegment(key, '');
    if (!previous) return true;

    this.activeSegment = previous;
    this.focusSegment(previous);
    return true;
  };

  /** Moves a segment to the next or previous enabled panel option, wrapping around. */
  private handleSegmentIncrement = (ev: KeyboardEvent, key: TTimeSegmentKey): boolean => {
    if (ev.key !== 'ArrowUp' && ev.key !== 'ArrowDown') return false;

    ev.preventDefault();

    const segment = getSegment(this.segmentGroups, key);
    if (!segment) return true;

    const options = getColumnOptions(key.field, this.getColumnContext(this.displayPartial));
    const next = stepSegmentValue(segment, options, ev.key === 'ArrowUp' ? 1 : -1, this.mask.hourCycle);
    if (!next) return true;

    this.editSegment(key, next);
    this.focusSegment(key);
    return true;
  };

  /** Sets the day period from its localized first letter (or `a`/`p`). */
  private handleDayPeriodKey = (ev: KeyboardEvent, key: TTimeSegmentKey): void => {
    if (ev.metaKey || ev.ctrlKey || ev.altKey) return;

    const dayPeriod = matchDayPeriodKey(ev.key, this.dayPeriodLabels);
    if (!dayPeriod) return;

    ev.preventDefault();
    this.editSegment(key, dayPeriod);
    this.moveToNextSegment(key);
  };

  /** Adds one digit, padding it when it can't be followed by another one, then auto-advances. */
  private handleSegmentDigit = (ev: KeyboardEvent, key: TTimeSegmentKey): void => {
    if (!/^\d$/.test(ev.key) || ev.metaKey || ev.ctrlKey) return;

    ev.preventDefault();

    const segment = getSegment(this.segmentGroups, key);
    if (!segment || key.field === 'dayPeriod') return;

    const nextValue = completeTypedDigit(key.field, appendSegmentDigit(segment, ev.key), this.mask.hourCycle);
    this.editSegment(key, nextValue);

    if (nextValue.length < segment.maxLength) return;

    this.moveToNextSegment(key);
  };

  private moveToNextSegment = (key: TTimeSegmentKey): void => {
    const next = getAdjacentSegmentKey(this.segmentGroups, key, 1);
    if (!next) return;

    this.activeSegment = next;
    this.focusSegment(next);
  };

  /** Applies a segment edit typed by the user. Typing always commits directly, even in confirm mode. */
  private editSegment = (key: TTimeSegmentKey, value: string): void => {
    this.panelDraft = undefined;
    this.segmentGroups = updateSegment(this.segmentGroups, key, value);
    this.activeSegment = key;
    this.syncSegmentDraftValue();
  };

  /** Opens the panel from a segment click while keeping keyboard focus on the field. */
  private handleSegmentClick = (key: TTimeSegmentKey, ev: MouseEvent): void => {
    this.activeSegment = key;
    this.openFromField(ev);
    // The dropdown finishes its own focus work while opening; keep pointer entry on the segment.
    requestAnimationFrame(() => this.focusSegment(key));
  };

  /** Routes clicks on empty field space or separators to the active segment. */
  private handleControlClick = (ev: MouseEvent): void => {
    if (isEventHandled(ev)) return;
    if (ev.composedPath().some((target) => target instanceof HTMLElement && target.tagName === 'BQ-BUTTON')) return;

    const key = this.activeSegment ?? this.getFirstSegmentKey();
    if (!key) return;

    this.handleSegmentClick(key, ev);
  };

  private handleLabelClick = (ev: MouseEvent): void => {
    if (this.disabled) return;

    ev.preventDefault();
    this.focusActiveSegment();
  };

  private openFromField = (ev: MouseEvent): void => {
    if (this.disabled) return;

    // Stop bq-dropdown from toggling: clicking the field only ever opens the panel.
    markEventHandled(ev);
    if (this.open || this.readonly) return;

    this.pendingOpenSource = 'input';
    this.open = true;
  };

  /**
   * Focus events crossing the shadow boundary are retargeted, so a `relatedTarget` inside the
   * shadow tree is reported as the host itself.
   */
  private isFocusMovingWithin = (ev: FocusEvent): boolean => {
    const related = ev.relatedTarget as Node | null;
    return !!related && (related === this.el || this.el.contains(related));
  };

  private handleSegmentsFocusIn = (ev: FocusEvent): void => {
    if (this.segmentContainerElem?.contains(ev.relatedTarget as Node)) return;

    this.announceValue();
  };

  private handleSegmentsFocusOut = (ev: FocusEvent): void => {
    if (this.segmentContainerElem?.contains(ev.relatedTarget as Node)) return;
    if (this.disabled) return;

    this.clampSegmentsToBounds();
    const draft = this.readDraft();
    this.hasBlurredIncompleteDraft = !draft.isEmpty && !draft.isComplete;
    this.syncSegmentDraftValue();
  };

  /** Moves a complete, out-of-range typed time to the closest allowed time. */
  private clampSegmentsToBounds = (): void => {
    if (this.readonly) return;

    const draft = this.readDraft();
    const time = draft.isComplete ? partialToTime(draft.partial, this.mask) : undefined;
    if (!time) return;

    const clamped = clampTimeToBounds(time, this.constraints);
    if (clamped === time) return;

    this.setSegmentsFromTime(clamped);
    this.syncSegmentDraftValue();
  };

  private readDraft = () => readTimeSegmentGroup(this.segmentGroups[0], this.mask.hourCycle);

  private setSegmentsFromTime = (time: TTime | undefined): void => {
    this.segmentGroups = [getTimeSegmentGroup(this.mask, toPartialTime(time, this.mask.hourCycle))];
  };

  // Panel
  // -----

  private getColumnContext = (selected: TPartialTime) => ({
    constraints: this.constraints,
    hourCycle: this.mask.hourCycle,
    dayPeriods: this.dayPeriodLabels,
    selected,
  });

  /**
   * Picks an option from a panel column. Missing fields are filled with the first allowed time,
   * and the result is clamped to the bounds.
   */
  private pickOption = (column: TTimeMaskField, value: number | TDayPeriod): void => {
    const partial = applyColumnPick(this.panelPartial, column, value);
    const resolved = resolvePartialTime(partial, this.mask.hourCycle, this.constraints);
    if (!resolved) return;

    this.applyPanelTime(clampTimeToBounds(resolved, this.constraints));
  };

  /** Commits a time picked in the panel, or keeps it as the panel draft when confirmation is required. */
  private applyPanelTime = (time: TTime): void => {
    if (this.requireConfirm) {
      this.panelDraft = time;
      return;
    }

    this.commitPanelTime(time);
  };

  private commitPanelTime = (time: TTime): void => {
    this.setSegmentsFromTime(time);
    this.hasBlurredIncompleteDraft = false;
    this.syncSegmentDraftValue();
  };

  private handleOptionClick = (column: TTimeMaskField, option: TTimeOption): void => {
    if (option.disabled || !this.isInteractive) return;

    this.pickOption(column, option.value);
    if (column === this.precision && !this.requireConfirm) {
      this.closePanel(true);
      return;
    }

    this.scrollColumnsToSelection(false, column);
  };

  private handleColumnKeyDown = (ev: KeyboardEvent, column: TTimeMaskField, options: TTimeOption[]): void => {
    if (this.handleColumnSwitch(ev, column)) return;

    if (ev.key === 'Escape') {
      ev.preventDefault();
      this.closePanel(true);
      return;
    }

    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this.pickFocusedOption(ev, column, options);
      if (ev.key === 'Enter') this.confirmAndClose(true);
      return;
    }

    const move = getColumnKeyMove(ev.key);
    if (!move) return;

    ev.preventDefault();
    const current = options.find((option) => option.selected)?.value;
    const target = moveColumnOption(options, current, move, column, this.mask.hourCycle);
    if (!target || target.value === current) return;

    this.pickOption(column, target.value);
    this.scrollColumnsToSelection(false, column);
  };

  /** Moves focus to the adjacent column with ArrowLeft/ArrowRight. */
  private handleColumnSwitch = (ev: KeyboardEvent, column: TTimeMaskField): boolean => {
    if (ev.key !== 'ArrowLeft' && ev.key !== 'ArrowRight') return false;

    ev.preventDefault();
    const columns = this.mask.segments.map(({ field }) => field);
    const isRtl = getComputedStyle(this.el).direction === 'rtl';
    const next = getAdjacentColumn(columns, column, ev.key, isRtl);
    if (next) this.focusColumn(next);
    return true;
  };

  /** Picks the focused option when it is not selected yet (e.g. the first option of an empty column). */
  private pickFocusedOption = (ev: KeyboardEvent, column: TTimeMaskField, options: TTimeOption[]): void => {
    const option = findOptionByValue(options, (ev.target as HTMLElement).dataset.value);
    if (!option || option.selected || option.disabled) return;

    this.pickOption(column, option.value);
  };

  private handleNowClick = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this.isInteractive) return;

    const now = getNowTime(this.constraints);
    if (!now) return;

    this.applyPanelTime(now);
    if (this.requireConfirm) {
      this.scrollColumnsToSelection(false);
      return;
    }

    this.closePanel(true);
  };

  private handleConfirmClick = (ev: CustomEvent): void => {
    ev.stopPropagation();
    this.confirmAndClose(true);
  };

  /** Commits a pending draft (confirm mode) and closes the panel. */
  private confirmAndClose = (restoreFocus: boolean): void => {
    const draft = this.panelDraft;
    if (draft) {
      this.panelDraft = undefined;
      this.commitPanelTime(draft);
    }

    this.closePanel(restoreFocus);
  };

  private closePanel = (restoreFocus: boolean): void => {
    this.shouldRestoreFocus = restoreFocus;
    this.open = false;
  };

  /** Drops an unconfirmed panel draft. */
  private discardPendingDraft = (): void => {
    this.panelDraft = undefined;
  };

  /** Re-runs the selection scroll when the panel is shown or resized, since it is hidden when the scroll first runs. */
  private observePanelSize = (): void => {
    if (!this.panelElem || typeof ResizeObserver === 'undefined') return;

    this.panelResizeObserver ??= new ResizeObserver(() => {
      if (this.open) scrollSelectionIntoView(this.panelElem, 'auto');
    });
    this.panelResizeObserver.observe(this.panelElem);
  };

  /** Moves focus to the tab stop of a column. */
  private focusColumn = (column: TTimeMaskField): void => {
    requestAnimationFrame(() => focusColumnTabStop(this.panelElem, column));
  };

  /**
   * Scrolls each column just enough to keep its selected option visible once the panel has rendered.
   *
   * @param isOpening Whether the panel is opening.
   * @param focusColumn Column whose tab stop receives focus. When the panel opens and no column is
   * given, the first column receives focus unless the panel was opened from the field.
   */
  private scrollColumnsToSelection = (isOpening: boolean, focusColumn?: TTimeMaskField): void => {
    const shouldFocusFirst = isOpening && this.activeOpenSource !== 'input';
    const behavior = getScrollBehavior();

    requestAnimationFrame(() => {
      scrollSelectionIntoView(this.panelElem, behavior);

      const column = focusColumn ?? (shouldFocusFirst ? this.mask.segments[0]?.field : undefined);
      if (column) this.focusColumn(column);
    });
  };

  // Value and validity
  // ------------------

  private handleClearClick = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this.isInteractive) return;

    this.clearValue();
    this.bqClear.emit(this.el);
    this.bqChange.emit({ value: this.value, el: this.el });
    this.focusActiveSegment();
  };

  /** Toggles the panel when the clock trigger button is activated. */
  private handleTriggerClick = (ev: CustomEvent): void => {
    ev.stopPropagation();
    if (!this.isInteractive) return;

    this.pendingOpenSource = 'trigger';
    this.open = !this.open;
  };

  private clearValue = (): void => {
    this.hasBadInput = false;
    this.hasBlurredIncompleteDraft = false;
    this.panelDraft = undefined;
    this.value = undefined;
    this.syncDerivedFromValue();
  };

  private handleSlotChange = (): void => {
    this.hasLabel = this.labelElem ? hasSlotContent(this.labelElem) : false;
    this.hasPrefix = this.prefixElem ? hasSlotContent(this.prefixElem) : false;
  };

  /** Recomputes the form value, validity and visual segments from the public `value`. */
  private syncDerivedFromValue = (): void => {
    this.internals?.setFormValue(this.value ?? null);
    this.hasValue = !!this.value;
    this.setSegmentsFromTime(parseTime(this.value));
    this.activeSegment = getFirstEmptySegmentKey(this.segmentGroups) ?? this.getFirstSegmentKey();
    this.syncValidity();
  };

  /**
   * Commits a complete, readable segment draft to `value` while keeping partial drafts visible.
   * Out-of-range times are committed and flagged; they are clamped when focus leaves the field.
   */
  private syncSegmentDraftValue = (): void => {
    const draft = this.readDraft();
    const isPartial = !draft.isEmpty && !draft.isComplete;

    if (this.hasBlurredIncompleteDraft && !isPartial) this.hasBlurredIncompleteDraft = false;
    this.hasBadInput = draft.isInvalid || (this.hasBlurredIncompleteDraft && isPartial);
    this.syncValidity();

    if (this.hasBadInput || isPartial) return;

    const time = draft.isEmpty ? undefined : partialToTime(draft.partial, this.mask);
    const nextValue = time ? serializeTime(time, this.precision) : undefined;
    if (nextValue === this.value) return;

    this.isCommittingSegmentDraft = true;
    this.value = nextValue;
    this.internals.setFormValue(nextValue ?? null);
    this.hasValue = !!nextValue;
    this.syncValidity();
    this.bqChange.emit({ value: this.value, el: this.el });
  };

  /**
   * Checks bad input, bounds and steps, then `required`, and applies the result.
   * `setValidity` only runs when the result changes: Chrome re-shows a visible validation message on
   * every call, so calling it on blur would keep the message open after focus leaves.
   */
  private syncValidity = (): void => {
    if (!this.internals) return;

    let flags: ValidityStateFlags = getTimeValidityFlags(parseTime(this.value), this.constraints);
    if (this.hasBadInput) flags.badInput = true;

    let message = '';
    if (Object.keys(flags).length > 0) {
      message = this.formValidationMessage ?? defaultValidityMessage(flags);
    } else if (this.required && !isDefined(this.value)) {
      flags = { valueMissing: true };
      message = this.formValidationMessage ?? 'Please, input or select a valid time';
    }

    const isValid = !message;
    const anchor = isValid ? undefined : this.validationAnchor;
    const key = `${JSON.stringify(flags)}|${message}`;
    if (this.appliedValidity?.key !== key || this.appliedValidity.anchor !== anchor) {
      this.internals.setValidity(flags, message, anchor);
      this.appliedValidity = { key, anchor };
    }

    this.internals.states.delete(isValid ? 'invalid' : 'valid');
    this.internals.states.add(isValid ? 'valid' : 'invalid');
    this.hasConstraintError = !isValid;
    this.constraintErrorMessage = isValid ? undefined : message;
  };

  /** Announces the committed time once when focus enters the field. */
  private announceValue = (): void => {
    const time = parseTime(this.value);
    const message = time
      ? `Selected time: ${formatTime(time, this.locale, this.precision, this.mask.hourCycle)}`
      : 'No time selected';

    // Clear before restoring the message so repeated announcements are read.
    this.announcement = '';
    requestAnimationFrame(() => {
      this.announcement = message;
    });
  };

  // Rendering helpers
  // -----------------

  private renderPanel = (): JSX.Element => {
    const selected = this.panelPartial;
    const canPickNow = this.isInteractive && !!getNowTime(this.constraints);
    const showFixedMinute = this.precision === 'hour' && this.hourFormat !== '12';

    return (
      <div
        aria-label={this.resolvedLabels.panelLabel}
        class="bq-time-picker__panel"
        part={TIME_PICKER_PARTS.container}
        ref={(el) => {
          this.panelElem = el;
        }}
        role="dialog"
      >
        <div class="bq-time-picker__columns" part={TIME_PICKER_PARTS.columns}>
          {this.mask.segments.map(({ field }) => {
            const options = getColumnOptions(field, this.getColumnContext(selected));
            return [
              <TimeColumn
                field={field}
                key={field}
                label={this.getFieldLabel(field)}
                onKeyDown={(ev) => this.handleColumnKeyDown(ev, field, options)}
                onOptionClick={(option) => this.handleOptionClick(field, option)}
                options={options}
              />,
              showFixedMinute && field === 'hour' && (
                <FixedMinuteColumn
                  key="fixed-minute"
                  label={this.resolvedLabels.minute}
                  selected={selected.hour !== undefined}
                />
              ),
            ];
          })}
        </div>
        <PanelFooter
          confirmLabel={this.resolvedLabels.confirm}
          nowDisabled={!canPickNow}
          nowLabel={this.resolvedLabels.now}
          onConfirm={this.handleConfirmClick}
          onNow={this.handleNowClick}
          showNow={!this.disableNow}
        />
      </div>
    );
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const id = this.name || DEFAULT_INPUT_ID;
    const labelId = `bq-time-picker__label-${id}`;
    const maskDescriptionId = `bq-time-picker__mask-${id}`;
    const errorDescriptionId = `bq-time-picker__error-${id}`;
    const hasErrorDescription = this.hasConstraintError && !!this.constraintErrorMessage;

    return (
      <div class="bq-time-picker" part={TIME_PICKER_PARTS.base}>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: pointer activation forwards focus; keyboard users tab directly to the roving segment. */}
        <label // NOSONAR: labels are pointer-activated; keyboard users focus the segments directly.
          class={{ 'bq-time-picker__label': true, 'is-hidden': !this.hasLabel }}
          htmlFor={id}
          onClick={this.handleLabelClick}
          part={TIME_PICKER_PARTS.label}
          ref={(labelElem) => {
            this.labelElem = labelElem;
          }}
        >
          <slot id={labelId} name="label" onSlotchange={this.handleSlotChange} />
        </label>

        <bq-dropdown
          class="bq-time-picker__dropdown"
          disabled={!this.isInteractive}
          distance={this.distance}
          exportparts="panel"
          open={this.open}
          panelHeight={this.panelHeight}
          placement={this.placement}
          skidding={this.skidding}
          strategy={this.strategy}
        >
          <div // NOSONAR: the click is a pointer shortcut to the segments; keydown only stops bq-dropdown from toggling.
            aria-label="Time picker"
            class={{
              'bq-time-picker__control': true,
              [`validation-${this.validationStatus}`]: true,
              'is-disabled': this.disabled,
              'is-open': this.open,
              'is-readonly': this.readonly,
            }}
            onClick={this.handleControlClick}
            onKeyDown={(ev) => ev.stopPropagation()}
            part={TIME_PICKER_PARTS.control}
            role="group"
            slot="trigger"
          >
            <span
              class={{ 'bq-time-picker__prefix': true, 'is-hidden': !this.hasPrefix }}
              part={TIME_PICKER_PARTS.prefix}
              ref={(el) => {
                this.prefixElem = el;
              }}
            >
              <slot name="prefix" onSlotchange={this.handleSlotChange} />
            </span>

            <div
              aria-describedby={hasErrorDescription ? `${maskDescriptionId} ${errorDescriptionId}` : maskDescriptionId}
              aria-disabled={this.disabled ? 'true' : 'false'}
              aria-labelledby={this.hasLabel ? labelId : undefined}
              class="bq-time-picker__segments"
              part={TIME_PICKER_PARTS.input}
              ref={(el) => {
                this.segmentContainerElem = el;
              }}
              role="group"
            >
              <TimeSegments
                activeSegment={this.activeSegment}
                dayPeriodLabels={this.dayPeriodLabels}
                disabled={this.disabled}
                getLabel={this.getFieldLabel}
                group={this.segmentGroups[0]}
                invalid={this.validationStatus === 'error' || this.hasConstraintError}
                mask={this.mask}
                onSegmentBlur={this.handleSegmentsFocusOut}
                onSegmentClick={this.handleSegmentClick}
                onSegmentFocus={this.handleSegmentsFocusIn}
                onSegmentKeyDown={this.handleSegmentKeyDown}
                readonly={this.readonly}
                required={this.required}
              />
            </div>
            <span class="bq-time-picker__mask-description" id={maskDescriptionId}>
              Expected format: {this.mask.template}
            </span>
            {hasErrorDescription && (
              <span class="bq-time-picker__error-description" id={errorDescriptionId}>
                {this.constraintErrorMessage}
              </span>
            )}
            <span aria-atomic="true" aria-live="polite" class="bq-time-picker__announcement" role="status">
              {this.announcement}
            </span>

            {this.hasValue && this.isInteractive && !this.disableClear && (
              <InternalButton
                appearance="text"
                border="xs"
                class="bq-time-picker__clear"
                label={this.resolvedLabels.clear}
                onBqClick={this.handleClearClick}
                onlyIcon
                part={TIME_PICKER_PARTS.clearBtn}
              >
                <slot name="clear-icon">
                  <bq-icon aria-hidden="true" name="x-circle" />
                </slot>
              </InternalButton>
            )}

            <InternalButton
              appearance="text"
              border="xs"
              class="bq-time-picker__trigger"
              disabled={!this.isInteractive}
              label={this.resolvedLabels.openPanel}
              onBqClick={this.handleTriggerClick}
              // `handleTriggerClick` toggles the panel; keep bq-dropdown from toggling it again.
              onClick={markEventHandled}
              onlyIcon
              part={`${TIME_PICKER_PARTS.button} ${TIME_PICKER_PARTS.suffix} ${TIME_PICKER_PARTS.timeTrigger}`}
            >
              <slot name="suffix" onSlotchange={this.handleSlotChange}>
                <bq-icon aria-hidden="true" name="clock" />
              </slot>
            </InternalButton>
          </div>

          {this.renderPanel()}
        </bq-dropdown>
      </div>
    );
  }
}

import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { TSliderType, TSliderValue } from './bq-slider.types';
import { debounce, isString, TDebounce } from '../../shared/utils';

/**
 * @part base - The component's base wrapper.
 * @part container - The container of the slider.
 * @part track-area - The track area of the slider.
 * @part progress-area - The progress area of the slider.
 * @part input-min - The input element for the value when the slider type is `single` or the minimum value when the slider type is `range`.
 * @part input-max - The input element for the maximum value.
 * @part label-start - The label for the value when the slider type is `single` or the minimum value when the slider type is `range`.
 * @part label-end - The label for maximum value when the slider type is `range`.
 */
@Component({
  tag: 'bq-slider',
  styleUrl: './scss/bq-slider.scss',
  shadow: {
    delegatesFocus: true,
  },
})
export class BqSlider2 {
  // Own Properties
  // ====================

  private inputMinElem: HTMLInputElement;
  private inputMaxElem: HTMLInputElement;
  private progressElem: HTMLSpanElement;
  private debounceBqChange: TDebounce<void>;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSliderElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  /**
   * The `minValue` state is the only value when the slider type is `single`
   * and the minimum value when the slider type is `range`.
   */
  @State() minValue: number = 0;
  /** The `maxValue` state is only used when the slider type is `range`. */
  @State() maxValue: number = 100;

  // Public Property API
  // ========================

  /** The amount of time, in milliseconds, to wait to trigger the `bqChange` event after each value change. */
  @Prop({ reflect: true }) debounceTime = 0;

  /** If `true` the slider is disabled. */
  @Prop({ reflect: true }) disabled? = false;

  /** If `true` it will show the value label on a side of the slider track area */
  @Prop({ reflect: true }) enableValueIndicator? = false;

  /** A number representing the amount to remain between the minimum and maximum values (only for range type). */
  @Prop({ reflect: true, mutable: true }) gap = 0;

  /** A number representing the max value of the slider. */
  @Prop({ reflect: true }) max = 100;

  /** A number representing the min value of the slider. */
  @Prop({ reflect: true }) min = 0;

  /**
   * A number representing the step of the slider.
   * ⚠️ Please notice that the value (or list of values if the slider type is `range`) will be rounded to the nearest multiple of `step`.
   */
  @Prop({ reflect: true }) step = 1;

  /** It defines the type of slider to display  */
  @Prop({ reflect: true }) type: TSliderType = 'single';

  /**
   * The value of the slider.
   * - If the slider type is `single`, the value is a number.
   * - If the slider type is `range`, the value is an array of two numbers (the first number represents the `min` value and the second number represents the `max` value).
   */
  @Prop({ reflect: true, mutable: true }) value: TSliderValue;

  // Prop lifecycle events
  // =======================

  @Watch('value')
  handleValuePropChange(newValue: TSliderValue) {
    this.setState(newValue);
    this.emitBqChange();
  }

  @Watch('step')
  handleStepPropChange() {
    this.minValue = Math.round(this.minValue / this.step) * this.step;
    this.maxValue = Math.round(this.maxValue / this.step) * this.step;
  }

  @Watch('gap')
  handleGapChange(newValue: number) {
    if (!this.isRangeType) return;
    // Use the this.value prop value when the component is initialized
    // Otherwise, use the current this.min and this.max state values
    const value = this.min && this.max ? [this.min, this.max] : this.stringToObject(this.value);
    // If the gap is less than the min or greater than the max, set it to 0
    this.gap = newValue < value[0] || newValue > value[1] ? 0 : newValue;
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when change the value on range inputs */
  @Event() bqChange: EventEmitter<{ value: Exclude<TSliderValue, string>; el: HTMLBqSliderElement }>;

  /** Handler to be called when the slider loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqSliderElement>;

  /** Handler to be called when the slider gets focused */
  @Event() bqFocus: EventEmitter<HTMLBqSliderElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  connectedCallback() {
    this.handleGapChange(this.gap);
    this.setState(this.value);
    this.handleStepPropChange();
  }

  componentDidLoad() {
    this.updateProgressTrack();
    this.syncInputsValue();
  }

  componentDidUpdate() {
    this.updateProgressTrack();
    this.syncInputsValue();
  }

  // Listeners
  // ==============

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private calculateMinValue = (value: TSliderValue) => {
    const isMaxValue = (this.maxValue ?? value[1]) === this.max;
    const isGapExceeded = value[0] + this.gap > this.max;
    // Make sure that the min value gets adjusted according to the gap value
    return isMaxValue || isGapExceeded ? this.max - this.gap : value[0];
  };

  private calculateMaxValue = (value: TSliderValue, minValue: number) => Math.max(value[1], minValue + this.gap);

  private setState = (newValue: TSliderValue) => {
    const isRangeType = this.isRangeType;
    const value = this.stringToObject(newValue);

    this.minValue = isRangeType ? this.calculateMinValue(value) : value;
    this.maxValue = isRangeType ? this.calculateMaxValue(value, this.minValue) : this.minValue;
  };

  private syncInputsValue = () => {
    this.inputMinElem?.setAttribute('value', this.minValue.toString());
    this.inputMaxElem?.setAttribute('value', this.maxValue.toString());
  };

  private stringToObject = (value: TSliderValue) => (isString(value) ? JSON.parse(value) : value);

  private handleInputChange = (type: 'min' | 'max', event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    const value = parseFloat(target.value);

    if (type === 'min') {
      this.minValue = this.isRangeType ? Math.min(value, this.maxValue - this.gap) : value;
    } else if (type === 'max') {
      this.maxValue = this.isRangeType ? Math.max(value, this.minValue + this.gap) : value;
    }

    // Update the input value to reflect the clamped value
    const reflectedValue = (type === 'min' ? this.minValue : this.maxValue).toString();
    target.value = reflectedValue;
    target.setAttribute('value', reflectedValue);

    this.emitBqChange();
  };

  private calculatePercent = (value: number) => {
    const totalRange = Number(this.max) - Number(this.min);
    return (value / totalRange) * 100;
  };

  private updateProgressTrack = () => {
    if (!this.progressElem) return;

    // For range type, left starts from the `min` value and width is the difference between `max` and `min`.
    // For non-range type, left starts from 0 and width is the `min` value.
    const left = this.isRangeType ? this.calculatePercent(this.minValue) : 0;
    const width = this.isRangeType
      ? this.calculatePercent(Number(this.maxValue) - Number(this.minValue))
      : this.calculatePercent(this.minValue);

    this.progressElem.style.left = `${left}%`;
    this.progressElem.style.width = `${width}%`;
  };

  private emitBqChange = () => {
    this.debounceBqChange?.cancel();

    const value: Exclude<TSliderValue, string> = this.isRangeType ? [this.minValue, this.maxValue] : this.minValue;
    this.debounceBqChange = debounce(() => this.bqChange.emit({ value, el: this.el }), this.debounceTime);

    this.debounceBqChange();
  };

  private handleBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private get decimalCount(): number {
    // Return the length of the decimal part of the step value.
    return (this.step % 1).toFixed(10).split('.')[1].replace(/0+$/, '').length;
  }

  private get isRangeType() {
    return this.type === 'range';
  }

  private renderLabel = (value: number, position: 'start' | 'end', css?: string) => {
    return (
      <span
        class={{
          [`${css} box-content block w-fit min-w-8 text-s font-medium leading-regular text-text-primary [font-variant:tabular-nums]`]:
            true,
          hidden: position === 'start' ? !this.enableValueIndicator : !this.enableValueIndicator || !this.isRangeType,
        }}
        part={`label-${position}`}
      >
        {value.toFixed(this.decimalCount)}
      </span>
    );
  };

  private renderInput = (type: 'max' | 'min', value: number, refCallback: (input: HTMLInputElement) => void) => {
    return (
      <input
        type="range"
        class={{
          'absolute top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed':
            true,
          'pointer-events-none': this.isRangeType,
        }}
        disabled={this.disabled}
        min={this.min}
        max={this.max}
        step={this.step}
        ref={refCallback}
        onInput={(ev) => this.handleInputChange(type, ev)}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        value={value}
        part={`input-${type}`}
      />
    );
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        aria-disabled={this.disabled ? 'true' : 'false'}
        class={{ 'flex w-full': true, 'cursor-not-allowed opacity-60': this.disabled }}
        part="base"
      >
        {/* LABEL (start) */}
        {this.renderLabel(this.minValue, 'start', 'me-xs text-end')}
        {/* SLIDER */}
        <div class="relative w-full" part="container">
          {/* TRACK AREA */}
          <span
            class="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-xs bg-[--bq-slider--trackarea-color]"
            part="track-area"
          />
          {/* PROGRESS AREA */}
          <span
            class="absolute top-1/2 h-1 w-1/2 -translate-y-1/2 rounded-xs bg-[--bq-slider--progress-color]"
            ref={(elem) => (this.progressElem = elem)}
            part="progress-area"
          />
          {/* INPUT (Min), used on single type */}
          {this.renderInput('min', this.minValue, (input) => (this.inputMinElem = input))}
          {/* INPUT (Max) */}
          {this.isRangeType && this.renderInput('max', this.maxValue, (input) => (this.inputMaxElem = input))}
        </div>
        {/* LABEL (end) */}
        {this.renderLabel(this.maxValue, 'end', 'ms-xs text-start')}
      </div>
    );
  }
}

import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { TSliderType, TSliderValue } from './bq-slider.types';
import { debounce, isString, TDebounce } from '../../shared/utils';

@Component({
  tag: 'bq-slider2',
  styleUrl: './scss/bq-slider2.scss',
  shadow: true,
})
export class BqSlider2 {
  // Own Properties
  // ====================

  private progressElem: HTMLSpanElement;
  private debounceBqChange: TDebounce<void>;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSlider2Element;

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
    const isRangeType = this.isRangeType;
    const value = this.parseValue(newValue);

    this.minValue = isRangeType ? value[0] : value;
    this.maxValue = isRangeType ? value[1] : this.minValue;

    this.updateProgressTrack();
  }

  @Watch('step')
  handleStepPropChange() {
    this.minValue = Math.round(this.minValue / this.step) * this.step;
    this.maxValue = Math.round(this.maxValue / this.step) * this.step;

    this.updateProgressTrack();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when change the value on range inputs */
  @Event() bqChange: EventEmitter<{ value: number | Array<number> | string; el: HTMLBqSlider2Element }>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handleValuePropChange(this.value);
  }

  componentDidLoad() {
    this.updateProgressTrack();
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

  private parseValue = (value: TSliderValue) => {
    return isString(value) ? JSON.parse(value) : value;
  };

  private handleInputChange = (type: 'min' | 'max', event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);

    if (type === 'min') {
      this.minValue = this.isRangeType && value >= this.maxValue ? this.maxValue : value;
    } else if (type === 'max') {
      this.maxValue = this.isRangeType && value <= this.minValue ? this.minValue : value;
    }

    // Update the input value to reflect the clamped value
    target.value = (type === 'min' ? this.minValue : this.maxValue).toString();

    this.updateProgressTrack();
    this.emitBqChange();
  };

  private calculatePercent = (value: number): number => ((value - this.min) / (this.max - this.min)) * 100;

  private updateProgressTrack = () => {
    if (!this.progressElem) return;

    // For range type, left starts from the `min` value and width is the difference between `max` and `min`.
    // For non-range type, left starts from 0 and width is the `min` value.
    const left = this.isRangeType ? this.calculatePercent(this.minValue) : 0;
    const width = this.isRangeType ? Number(this.maxValue) - Number(this.minValue) : this.minValue;

    this.progressElem.style.left = `${left}%`;
    this.progressElem.style.width = `${width}%`;
  };

  private emitBqChange = () => {
    this.debounceBqChange?.cancel();

    const value = this.isRangeType ? [this.minValue, this.maxValue] : this.minValue;
    this.debounceBqChange = debounce(() => this.bqChange.emit({ value, el: this.el }), this.debounceTime);

    this.debounceBqChange();
  };

  private get isRangeType() {
    return this.type === 'range';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex w-full">
        {/* LABEL (start) */}
        <span class="me-xs box-content block w-8 text-end text-s font-medium leading-regular text-text-primary [font-variant:tabular-nums]">
          {this.minValue}
        </span>
        {/* SLIDER */}
        <div class="relative w-full">
          {/* TRACK AREA */}
          <span class="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-xs bg-ui-secondary" />
          {/* PROGRESS AREA */}
          <span
            class="absolute top-1/2 h-1 w-1/2 -translate-y-1/2 rounded-xs bg-ui-brand"
            ref={(elem) => (this.progressElem = elem)}
          />
          {/* INPUT (Min), used on single type */}
          <input
            type="range"
            class={{
              'absolute top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed':
                true,
              'pointer-events-none': this.isRangeType,
            }}
            min={this.min}
            max={this.max}
            step={this.step}
            onInput={(ev) => this.handleInputChange('min', ev)}
            value={this.minValue}
          />
          {/* INPUT (Max) */}
          {this.isRangeType && (
            <input
              type="range"
              class="pointer-events-none absolute top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed"
              min={this.min}
              max={this.max}
              step={this.step}
              onInput={(ev) => this.handleInputChange('max', ev)}
              value={this.maxValue}
            />
          )}
        </div>
        {/* LABEL (end) */}
        <span
          class={{
            'ms-xs box-content block w-8 text-start text-s font-medium leading-regular text-text-primary [font-variant:tabular-nums]':
              true,
            hidden: !this.isRangeType,
          }}
        >
          {this.maxValue}
        </span>
      </div>
    );
  }
}

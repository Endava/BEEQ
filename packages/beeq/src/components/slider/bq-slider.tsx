import type { EventEmitter } from '@stencil/core';
import { AttachInternals, Component, Element, Event, h, Prop, State, Watch } from '@stencil/core';
import type { JSX } from '@stencil/core/internal';

import { clamp, debounce, isNil, isString, type TDebounce } from '../../shared/utils';
import type { TSliderType, TSliderValue } from './bq-slider.types';

/**
 * Sliders provide a visual representation of adjustable content, enabling users to change values by dragging a handle along a horizontal track.
 *
 * @example How to use it
 * ```html
 * <bq-slider max="100" value="30"></bq-slider>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/509cbc-slider/b/09d7b1
 * @status stable
 *
 * @dependency bq-tooltip
 *
 * @attr {number} debounce-time - The amount of time, in milliseconds, to wait to trigger the bqChange event after each value change.
 * @attr {boolean} disabled - If `true` the slider is disabled.
 * @attr {boolean} enable-tooltip - If `true`, a tooltip will be shown displaying the progress value.
 * @attr {boolean} enable-value-indicator - If `true` it will show the value label on the side of the slider track area.
 * @attr {number} gap - A number representing the amount to remain between the minimum and maximum values (only for range type).
 * @attr {number} max - A number representing the max value of the slider.
 * @attr {number} min - A number representing the min value of the slider.
 * @attr {number} step - A number represents the step of the slider. ⚠️ Please notice that the value (or list of values if the slider type is range) will be rounded to the nearest multiple of step.
 * @attr {boolean} tooltip-always-visible - If `true`, a tooltip will always display the progress value. It relies on enableTooltip and if enableTooltip is false, tooltipAlwaysVisible cannot be true.
 * @attr {"range" | "single"} type - It defines the type of slider to display.
 * @attr {"[number, number]" | "number" | "string"} value - The value of the slider. If the slider type is single, the value is a number.
 * If the slider type is range, the value is an array of two numbers (the first number represents the min value and the second number represents the max value).
 *
 * @event bqBlur - Handler to be called when the slider loses focus.
 * @event bqChange - Handler to be called when changing the value on range inputs.
 * @event bqFocus - Handler to be called when the slider gets focused.
 *
 * @part base - The component's base wrapper.
 * @part container - The container of the slider.
 * @part track-area - The track area of the slider.
 * @part progress-area - The progress area of the slider.
 * @part input-min - The input element for the value when the slider type is `single` or the minimum value when the slider type is `range`.
 * @part input-max - The input element for the maximum value.
 * @part label-start - The label for the value when the slider type is `single` or the minimum value when the slider type is `range`.
 * @part label-end - The label for maximum value when the slider type is `range`.
 *
 * @cssprop --bq-slider--size - The height of the slider track/progress area
 * @cssprop --bq-slider--border-radius - Slider border radius
 * @cssprop --bq-slider--thumb-size - Slider hover thumb size
 * @cssprop --bq-slider--progress-color - Slider progress background color
 * @cssprop --bq-slider--trackarea-color - Slider track background color
 */
@Component({
  tag: 'bq-slider',
  styleUrl: './scss/bq-slider.scss',
  formAssociated: true,
  shadow: {
    delegatesFocus: true,
  },
})
export class BqSlider {
  // Own Properties
  // ====================

  private inputMinElem: HTMLInputElement;
  private inputMaxElem: HTMLInputElement;
  private minTooltipElem: HTMLBqTooltipElement;
  private maxTooltipElem: HTMLBqTooltipElement;
  private progressElem: HTMLSpanElement;
  private trackElem: HTMLSpanElement;
  private debounceBqChange: TDebounce<void>;

  // Reference to host HTML element
  // ===================================

  @AttachInternals() internals!: ElementInternals;
  @Element() el!: HTMLBqSliderElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  /**
   * The `minValue` state is the only value when the slider type is `single`
   * and the minimum value when the slider type is `range`.
   */
  @State() minValue: number;
  /** The `maxValue` state is only used when the slider type is `range`. */
  @State() maxValue: number;
  /** It hold the left position of the Thumb for the value or the minimum value (if the slider type is `range`) */
  @State() minThumbPosition: number;
  /** It hold the left position of the Thumb for the maximum value (if the slider type is `range`) */
  @State() maxThumbPosition: number;

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

  /** Name of the form control. Submitted with the form as part of a name/value pair */
  @Prop({ reflect: true }) name: string;

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

  /** If `true`, a tooltip will be shown displaying the progress value */
  @Prop({ reflect: true }) enableTooltip: boolean = false;

  /**
   * If `true`, a tooltip will always display the progress value.
   * It relies on enableTooltip and if enableTooltip is false, tooltipAlwaysVisible cannot be true.
   */
  @Prop({ reflect: true }) tooltipAlwaysVisible: boolean = false;

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
    const value = !isNil(this.min) && !isNil(this.max) ? [this.min, this.max] : this.stringToObject(this.value);
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

  componentWillLoad() {
    this.init();
  }

  componentDidLoad() {
    this.runUpdates();
  }

  componentDidUpdate() {
    this.runUpdates();
  }

  formAssociatedCallback() {
    this.internals?.setFormValue(`${this.value}`);
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

  private init = () => {
    this.handleGapChange(this.gap);
    this.setState(this.value);
    this.handleStepPropChange();
  };

  private runUpdates = () => {
    this.updateProgressTrack();
    this.syncInputsValue();
    this.setThumbPosition();
  };

  private setState = (newValue: TSliderValue) => {
    const isRangeType = this.isRangeType;
    const value = this.stringToObject(newValue);

    this.minValue = isRangeType ? clamp(value[0], this.min, this.max - this.gap) : value;
    this.maxValue = isRangeType ? clamp(value[1], this.minValue + this.gap, this.max) : this.minValue;
  };

  private setThumbPosition = () => {
    if (!this.enableTooltip) return;

    // Destructure the returned object from this.thumbPosition() and assign the properties to this.minThumbPosition and this.maxThumbPosition
    ({ minThumbPosition: this.minThumbPosition, maxThumbPosition: this.maxThumbPosition } = this.thumbPosition());
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

    // Sync the prop value.
    // This will trigger the `@Watch('value')` method and emit the `bqChange` event.
    const { internals, isRangeType, maxValue, minValue } = this;
    this.value = isRangeType ? [minValue, maxValue] : minValue;
    internals?.setFormValue(isRangeType ? JSON.stringify(this.value) : this.value.toString());
    if (isRangeType) this.el.setAttribute('value', JSON.stringify(this.value));
  };

  private calculatePercent = (value: number) => {
    const totalRange = Number(this.max) - Number(this.min);
    return ((value - this.min) / totalRange) * 100;
  };

  private updateProgressTrack = () => {
    if (!this.progressElem) return;

    // For range type, left starts from the `min` value and width is the difference between `max` and `min`.
    // For non-range type, left starts from 0 and width is the `min` value.
    const left = this.isRangeType ? this.calculatePercent(this.minValue) : 0;
    const width = this.isRangeType
      ? this.calculatePercent(Number(this.maxValue) - Number(this.minValue) + this.min)
      : this.calculatePercent(this.minValue);

    this.progressElem.style.insetInlineStart = `${left}%`;
    this.progressElem.style.inlineSize = `${width}%`;
  };

  private calculateThumbPosition = (value: number): number => {
    if (!this.progressElem) return 0;

    // Get the width of the track area and the size of the input range thumb
    const trackAreaWidth = this.trackElem.getBoundingClientRect().width;
    // We need to also add 4px to the thumb size,
    // this is because the thumb is 2px border (`border-m`)
    const inputThumbSize = parseInt(getComputedStyle(this.el).getPropertyValue('--bq-slider--thumb-size'), 10) + 4;
    const totalWidth = trackAreaWidth - inputThumbSize;

    return ((value - this.min) / (this.max - this.min)) * totalWidth + inputThumbSize / 2;
  };

  private thumbPosition = (): { minThumbPosition: number; maxThumbPosition?: number } => {
    const minThumbPosition = this.calculateThumbPosition(this.minValue);
    const maxThumbPosition = this.isRangeType ? this.calculateThumbPosition(this.maxValue) : undefined;

    return { minThumbPosition, maxThumbPosition };
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

  private handleMouseDown = (event: MouseEvent) => {
    this.handleTooltipVisibility(event, 'remove');
  };

  private handleMouseUp = (event: MouseEvent) => {
    this.handleTooltipVisibility(event, 'add');
  };

  private handleTooltipVisibility = (event: MouseEvent, action: 'add' | 'remove') => {
    if (!this.enableTooltip || this.tooltipAlwaysVisible) return;

    const target = event.target as HTMLElement;
    const tooltipElem = target === this.inputMinElem ? this.minTooltipElem : this.maxTooltipElem;
    tooltipElem.classList[action]('hidden');
  };

  private get decimalCount(): number {
    // Return the length of the decimal part of the step value.
    return (this.step % 1).toFixed(10).split('.')[1].replace(/0+$/, '').length;
  }

  private get isRangeType() {
    return this.type === 'range';
  }

  private get isTooltipAlwaysVisible(): boolean {
    return this.tooltipAlwaysVisible && this.enableTooltip;
  }

  private renderLabel = (value: number, position: 'start' | 'end', css?: string) => {
    return (
      <span
        class={{
          [`${css} is-fit min-is-8 box-content block font-medium text-primary text-s leading-regular [font-variant:tabular-nums]`]: true,
          hidden: position === 'start' ? !this.enableValueIndicator : !this.enableValueIndicator || !this.isRangeType,
        }}
        part={`label-${position}`}
      >
        {value.toFixed(this.decimalCount)}
      </span>
    );
  };

  private renderInput = (type: 'max' | 'min', value: number, refCallback: (input: HTMLInputElement) => void) => {
    // Determine the zIndex value based on the type and the current min and max values.
    const zIndexValue = (type: 'min' | 'max'): string => {
      const zIndex = {
        min: this.minValue === this.min && this.maxValue === this.minValue,
        max: this.maxValue === this.max && this.minValue === this.maxValue,
      };

      // If the value of both thumbs is the same as the min or max value, set the zIndex to -1
      return zIndex[type] ? '-1' : '0';
    };

    return (
      <input
        class={{
          'is-full absolute inset-bs-[50%] start-0 -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed': true,
          'pointer-events-none': this.isRangeType,
        }}
        disabled={this.disabled}
        max={this.max}
        min={this.min}
        name={this.name}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onInput={(ev) => this.handleInputChange(type, ev)}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        part={`input-${type}`}
        ref={refCallback}
        step={this.step}
        style={this.isRangeType ? { zIndex: zIndexValue(type) } : undefined}
        type="range"
        value={value}
      />
    );
  };

  private renderTooltip = (
    value: number,
    thumbPosition: number,
    refCallback: (elem: HTMLBqTooltipElement) => void,
  ): JSX.Element => (
    <bq-tooltip
      alwaysVisible={true}
      class={{
        'absolute [&::part(panel)]:absolute': true,
        hidden: !this.isTooltipAlwaysVisible,
      }}
      distance={this.enableValueIndicator ? 6 : 16}
      exportparts="base,trigger,panel"
      ref={refCallback}
      style={{ insetInlineStart: `${thumbPosition}px`, fontVariant: 'tabular-nums' }}
    >
      <div class="bs-1 is-1 absolute" slot="trigger" />
      {value.toFixed(this.decimalCount)}
    </bq-tooltip>
  );

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        aria-disabled={this.disabled ? 'true' : 'false'}
        class={{ 'is-full flex': true, 'cursor-not-allowed opacity-60': this.disabled }}
        part="base"
      >
        {/* LABEL (start) */}
        {this.renderLabel(this.minValue, 'start', 'me-xs text-end')}
        {/* SLIDER */}
        <div class="is-full relative" part="container">
          {/* TRACK AREA */}
          <span
            class="bs-1 is-full absolute inset-bs-[50%] start-0 -translate-y-1/2 rounded-xs bg-[--bq-slider--trackarea-color]"
            part="track-area"
            ref={(elem) => {
              this.trackElem = elem;
            }}
          />
          {/* PROGRESS AREA */}
          <span
            class="bs-1 is-[50%] absolute inset-bs-[50%] -translate-y-1/2 rounded-xs bg-[--bq-slider--progress-color]"
            part="progress-area"
            ref={(elem) => {
              this.progressElem = elem;
            }}
          />
          {/* TOOLTIP on top of the value or min value (if the slider type is `range`) */}
          {this.enableTooltip &&
            this.renderTooltip(this.minValue, this.minThumbPosition, (elem) => {
              this.minTooltipElem = elem;
            })}
          {/* INPUT (Min), used on single type */}
          {this.renderInput('min', this.minValue, (input) => {
            this.inputMinElem = input;
          })}
          {/* TOOLTIP on top of the max value (if the slider type is `range`) */}
          {this.enableTooltip &&
            this.isRangeType &&
            this.renderTooltip(this.maxValue, this.maxThumbPosition, (elem) => {
              this.maxTooltipElem = elem;
            })}
          {/* INPUT (Max) */}
          {this.isRangeType &&
            this.renderInput('max', this.maxValue, (input) => {
              this.inputMaxElem = input;
            })}
        </div>
        {/* LABEL (end) */}
        {this.renderLabel(this.maxValue, 'end', 'ms-xs text-start')}
      </div>
    );
  }
}

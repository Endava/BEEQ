import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { SLIDER_TYPE, TSliderType } from './bq-slider.types';
import { debounce, isString, TDebounce, validatePropValue } from '../../shared/utils';

@Component({
  tag: 'bq-slider',
  styleUrl: './scss/bq-slider.scss',
  shadow: true,
})
export class BqSlider {
  // Own Properties
  // ====================

  private progressDivElement: HTMLDivElement;
  private minRangeInputElement: HTMLInputElement;
  private maxRangeInputElement: HTMLInputElement;
  private bqChangeDebounced: TDebounce<void>;
  private inputDivElement: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSliderElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================
  @State() private minRangeValue = 0;
  @State() private maxRangeValue = 0;

  // Public Property API
  // ========================

  /** If `true` slider is disabled */
  @Prop({ reflect: true }) disabled? = false;

  /** A number representing the delay value applied to bqChange event handler */
  @Prop({ reflect: true }) debounceTime = 0;

  /** A number representing the minimum value between the min and max range selected. */
  @Prop({ reflect: true }) gap = 0;

  /** A number representing the min value of the slider. */
  @Prop({ reflect: true }) min = 0;

  /** A number representing the max value of the slider. */
  @Prop({ reflect: true }) max = 0;

  /** A number representing the step of the slider. */
  @Prop({ reflect: true }) step = 1;

  /** It defines the type of slider to display  */
  @Prop({ reflect: true }) type: TSliderType = 'single';

  /** If `true` it will display the min and max values */
  @Prop({ reflect: true }) valueIndicator? = false;

  /** A number representing the value of the slider. */
  @Prop({ reflect: true, mutable: true }) value: number | Array<number> | string;

  /** If `true`, a tooltip will be shown displaying the progress value */
  @Prop({ reflect: true }) enableTooltip: boolean = false;

  /**
   * If `true`, a tooltip will always display the progress value.
   * It relies on enableTooltip and if enableTooltip is false, tooltipAlwaysVisible cannot be true.
   */
  @Prop({ reflect: true }) tooltipAlwaysVisible: boolean = false;

  // Prop lifecycle events
  // =======================
  @Watch('type')
  handleTypePropChange() {
    validatePropValue(SLIDER_TYPE, 'single', this.el, 'type');
  }

  @Watch('value')
  handleValuePropChange() {
    this.handleRangeInputChange();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when change the value on range inputs */
  @Event() bqChange: EventEmitter<{ value: number | Array<number> | string; el: HTMLBqSliderElement }>;

  /** Handler to be called when the slider loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqSliderElement>;

  /** Handler to be called when the slider gets focused */
  @Event() bqFocus: EventEmitter<HTMLBqSliderElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handleTypePropChange();
  }

  componentDidLoad() {
    this.sanitizePropValue();
    this.updateProgressSize();
  }

  componentDidUpdate() {
    this.sanitizePropValue();
    this.updateProgressSize();
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

  private get isSingleSlider(): boolean {
    return this.type === 'single';
  }

  private get stepDecimalNumber(): number {
    if (this.step % 1 != 0) return this.step.toString().split('.')[1].length;
    return 0;
  }

  private setPropValue = (value?: { min?: number; max?: number }): void => {
    if (!value) return;

    if (value.hasOwnProperty('min') && value.min) {
      if (this.isSingleSlider) {
        this.value = value.min;
        this.minRangeValue = value.min;
        this.setElementValue(String(value.min), this.minRangeInputElement);
        return;
      }

      if (this.gap && value.hasOwnProperty('max')) {
        value.min = Math.min(value.min, value.max - this.gap);
      }

      this.value[0] = value.min;
      this.minRangeValue = value.min;
      this.setElementValue(String(value.min), this.minRangeInputElement);
    }

    if (value.hasOwnProperty('max') && value.max) {
      if (this.gap && value.hasOwnProperty('min')) {
        value.max = Math.max(value.max, value.min + this.gap);
      }

      this.value[1] = value.max;
      this.maxRangeValue = value.max;
      this.setElementValue(String(value.max), this.maxRangeInputElement);
    }
  };

  private handleMinRangeInput = (): void => {
    if (!this.isSingleSlider) {
      const minRangeValue = Math.min(
        parseFloat(this.minRangeInputElement.value),
        parseFloat(this.maxRangeInputElement.value) - this.gap,
      );

      this.setPropValue({ min: minRangeValue });
    }

    this.setPropValue({ min: parseFloat(this.minRangeInputElement.value) });
    this.updateProgressSize();
    this.handleRangeInputChange();
  };

  private handleMaxRangeInput = (): void => {
    if (!this.isSingleSlider) {
      const maxRangeValue = Math.max(
        parseFloat(this.maxRangeInputElement.value),
        parseFloat(this.minRangeInputElement.value) + this.gap,
      );

      this.setPropValue({ max: maxRangeValue });
    }

    this.setPropValue({ max: parseFloat(this.maxRangeInputElement.value) });
    this.updateProgressSize();
    this.handleRangeInputChange();
  };

  private calculatePercent = (value: string): number => ((parseFloat(value) - this.min) / (this.max - this.min)) * 100;

  // The below calculations are used to "guess" where the thumb is located. Since we're using the native range control
  // under the hood, we don't have access to the thumb's true coordinates. These measurements can be a pixel or two
  // off depending on the size of the control, thumb, and tooltip dimensions.

  private calculateThumbPosition = (): { leftThumbPosition: number; rightThumbPosition?: number } => {
    if (!this.progressDivElement || !this.inputDivElement) return { leftThumbPosition: 0 };

    // Get the width of the input container and the size of the slider thumb
    const inputWidth = this.inputDivElement.getBoundingClientRect().width;
    const thumbSize = parseInt(
      getComputedStyle(this.progressDivElement).getPropertyValue('--bq-slider--thumb-size'),
      10,
    );
    const { value, min, max } = this;
    const totalInputWidth = inputWidth - thumbSize;

    // Function to calculate the thumb position based on the value
    const calculatePosition = (val: number): number => ((val - min) / (max - min)) * totalInputWidth + thumbSize / 2;

    if (this.isSingleSlider) {
      // Return the position for a single thumb slider
      return { leftThumbPosition: calculatePosition(Number(value)) };
    } else {
      const [leftValue, rightValue] = value as [number, number];
      // Return the positions for a range slider with two thumbs
      return {
        leftThumbPosition: calculatePosition(leftValue),
        rightThumbPosition: calculatePosition(rightValue),
      };
    }
  };

  private updateProgressSize = (): void => {
    if (!this.progressDivElement) return;

    const left = this.isSingleSlider ? '0%' : `${this.calculatePercent(this.minRangeInputElement.value)}%`;
    const width = this.isSingleSlider
      ? `${this.getMinRangeValue()}%`
      : `${Number(this.getMaxRangeValue()) - Number(this.getMinRangeValue())}%`;

    this.progressDivElement.style.left = left;
    this.progressDivElement.style.width = width;
  };

  private sanitizeArrayValue = (defaultValue): void => {
    if (!Array.isArray(this.value)) return;

    if (!this.value.length) {
      this.value = defaultValue;
      return;
    }

    if (this.isSingleSlider) {
      this.value = this.value[0];
      return;
    }

    if (this.value.length === 1) {
      this.value[1] = this.value[0];
    }

    if (this.value.length > 1) {
      this.value[0] = Math.min(this.value[0], this.value[1]);
      this.value[1] = Math.max(this.value[0], this.value[1]);
    }
  };

  private sanitizePropValue = (): void => {
    const defaultValue = !this.isSingleSlider ? [0, 0] : 0;

    if (!this.value) {
      this.value = defaultValue;
    }

    this.value = isString(this.value) ? JSON.parse(this.value) : this.value;

    if (Array.isArray(this.value)) {
      this.sanitizeArrayValue(defaultValue);
    }

    if (typeof this.value === 'object' && !Array.isArray(this.value)) {
      this.value = defaultValue;
    }

    if (typeof this.value === 'number' && !this.isSingleSlider && !Array.isArray(this.value)) {
      this.value = [this.value, this.value];
    }

    this.setPropValue(this.isSingleSlider ? { min: Number(this.value) } : { min: this.value[0], max: this.value[1] });
  };

  private setElementValue = (value: string, element: Element): void => {
    if (!element || !(element instanceof HTMLInputElement)) return;

    element.value = value;
    element.setAttribute('value', value);
  };

  private getMinRangeValue = () => {
    if (!this.value) return 0;
    return !Array.isArray(this.value) ? this.value : this.value[0];
  };

  private getMaxRangeValue = () => {
    if (!this.value) return 0;

    return this.value[1];
  };

  private handleRangeInputBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleRangeInputFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleRangeInputChange = () => {
    this.bqChangeDebounced?.cancel();

    this.bqChangeDebounced = debounce(() => this.bqChange.emit({ value: this.value, el: this.el }), this.debounceTime);
    this.bqChangeDebounced();
  };

  private get isTooltipAlwaysVisible(): boolean {
    return this.tooltipAlwaysVisible && this.enableTooltip;
  }

  private renderInput = ({
    value,
    onInputCallback,
    ref,
    ariaLabel,
  }: {
    value: number;
    onInputCallback: () => void;
    ref: (input: HTMLInputElement) => void;
    ariaLabel: string;
  }): HTMLInputElement => (
    <input
      class="bq-slider__input"
      type="range"
      min={this.min}
      max={this.max}
      step={this.step}
      value={String(value)}
      disabled={this.disabled}
      ref={ref}
      onInput={onInputCallback}
      onBlur={this.handleRangeInputBlur}
      onFocus={this.handleRangeInputFocus}
      aria-label={ariaLabel}
    />
  );

  private renderTooltip = (value: number, thumbPosition: number): HTMLBqTooltipElement => (
    <bq-tooltip
      class="absolute"
      exportparts="base,trigger,panel"
      alwaysVisible={this.isTooltipAlwaysVisible}
      visible
      distance={16}
      style={{ left: `${thumbPosition}px`, fontVariant: 'tabular-nums' }}
    >
      <div class={{ 'absolute h-1 w-1': true, 'z-50': !this.tooltipAlwaysVisible }} slot="trigger" />
      {value}
    </bq-tooltip>
  );

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class={{
          [`bq-slider ${this.type}`]: true,
          'cursor-not-allowed opacity-60': this.disabled,
        }}
        part="base"
        aria-disabled={this.disabled ? 'true' : 'false'}
      >
        {!this.isSingleSlider && (
          <span
            class={{
              'is-hidden': !this.valueIndicator,
              'bq-slider__label mr-m': true,
            }}
          >
            {this.minRangeValue.toFixed(this.stepDecimalNumber)}
          </span>
        )}
        <div class="bq-slider__container">
          {/* SINGLE */}
          {this.renderInput({
            value: Number(this.getMinRangeValue()),
            onInputCallback: this.handleMinRangeInput,
            ref: (input: HTMLInputElement) => (this.minRangeInputElement = input),
            ariaLabel: 'Min Range',
          })}
          {this.enableTooltip &&
            this.renderTooltip(Number(this.getMinRangeValue()), this.calculateThumbPosition()?.leftThumbPosition)}
          {/* RANGE */}
          {!this.isSingleSlider &&
            this.renderInput({
              value: Number(this.getMaxRangeValue()),
              onInputCallback: this.handleMaxRangeInput,
              ref: (input: HTMLInputElement) => (this.maxRangeInputElement = input),
              ariaLabel: 'Max Range',
            })}
          {!this.isSingleSlider &&
            this.enableTooltip &&
            this.renderTooltip(Number(this.getMaxRangeValue()), this.calculateThumbPosition()?.rightThumbPosition)}
          <div ref={(div: HTMLDivElement) => (this.inputDivElement = div)}>
            <div class="progress" ref={(div: HTMLDivElement) => (this.progressDivElement = div)} />
          </div>
        </div>
        {!this.isSingleSlider && (
          <span
            class={{
              'is-hidden': !this.valueIndicator,
              'bq-slider__label ml-m': true,
            }}
          >
            {this.maxRangeValue.toFixed(this.stepDecimalNumber)}
          </span>
        )}
        {this.isSingleSlider && (
          <span
            class={{
              'is-hidden': !this.valueIndicator,
              'bq-slider__label ml-m': true,
            }}
          >
            {this.minRangeValue.toFixed(this.stepDecimalNumber)}
          </span>
        )}
      </div>
    );
  }
}

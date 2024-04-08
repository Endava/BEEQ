import { Component, h, Prop, State, Watch } from '@stencil/core';

@Component({
  tag: 'bq-slider2',
  styleUrl: './scss/bq-slider2.scss',
  shadow: true,
})
export class BqSlider2 {
  // Own Properties
  // ====================

  private progressElem: HTMLSpanElement;

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() minValue: number = 0;
  @State() maxValue: number = 100;

  // Public Property API
  // ========================

  /** A number representing the max value of the slider. */
  @Prop({ reflect: true }) max = 0;

  /** A number representing the min value of the slider. */
  @Prop({ reflect: true }) min = 0;

  /** A number representing the step of the slider. */
  @Prop({ reflect: true }) step = 1;

  /** It defines the type of slider to display  */
  @Prop({ reflect: true }) type: 'single' | 'range' = 'single';

  /** A number representing the value of the slider. */
  @Prop({ reflect: true, mutable: true }) value: string | number | number[];

  // Prop lifecycle events
  // =======================

  @Watch('value')
  valueChanged(newValue: string | number | number[]) {
    const value = Array.isArray(newValue) ? newValue[0] : newValue;
    this.minValue = parseInt(value as string, 10);

    this.updateProgressTrack();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.valueChanged(this.value);
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

  private onInputChange = (event: InputEvent) => {
    const target = event.target as HTMLInputElement;
    this.minValue = parseInt(target.value, 10);

    this.updateProgressTrack();
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

  private get isRangeType() {
    return this.type === 'range';
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex w-full">
        {/* LABEL (left) */}
        <span class="me-m block w-7 text-end text-s font-medium leading-regular text-text-primary"></span>
        {/* SLIDER */}
        <div class="relative w-full">
          {/* TRACK AREA */}
          <span class="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-xs bg-ui-secondary" />
          {/* PROGRESS AREA */}
          <span
            class="absolute top-1/2 h-1 w-1/2 -translate-y-1/2 rounded-xs bg-ui-brand"
            ref={(elem) => (this.progressElem = elem)}
          />
          {/* INPUT (Min) */}
          <input
            type="range"
            class="absolute top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent outline-none disabled:cursor-not-allowed"
            min="0"
            max="100"
            step="1"
            onInput={this.onInputChange}
            value={this.minValue}
          />
        </div>
        {/* LABEL (right) */}
        <span class="ms-m block w-7 text-start text-s font-medium leading-regular text-text-primary">
          {this.minValue}
        </span>
      </div>
    );
  }
}

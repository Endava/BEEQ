import { Component, Element, h, Prop, Watch } from '@stencil/core';

import {
  PROGRESS_MODE,
  PROGRESS_TICKNESS,
  PROGRESS_TYPE,
  TProgressMode,
  TProgressTickness,
  TProgressType,
} from './bq-progress.types';
import { validatePropValue } from '../../shared/utils';

@Component({
  tag: 'bq-progress',
  styleUrl: './scss/bq-progress.scss',
  shadow: true,
})
export class BqProgress {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqProgressElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** It defines the mode of progress bar to display */
  @Prop({ reflect: true }) mode: TProgressMode = 'determinated';

  /** A number representing the current value of the progress bar */
  @Prop({ reflect: true }) value = 0;

  /** Progress bar thickness */
  @Prop({ reflect: true }) thickness: TProgressTickness = 'medium';

  /** Progress type */
  @Prop({ reflect: true }) type: TProgressType = 'default';

  /** If `true`, the progress bar will be displayed without border radius */
  @Prop({ reflect: true }) level: boolean = false;

  /** It `true`, the progress bar will be displayed with percentage text */
  @Prop({ reflect: true }) percentage: boolean = false;

  /** It `true`, the progress bar will be displayed with percentage tooltip */
  @Prop({ reflect: true }) tooltip: boolean = false;

  // Prop lifecycle events
  // =======================
  @Watch('mode')
  @Watch('thickness')
  @Watch('type')
  handleTypePropChange() {
    validatePropValue(PROGRESS_MODE, 'determinated', this.el, 'mode');
    validatePropValue(PROGRESS_TICKNESS, 'medium', this.el, 'thickness');
    validatePropValue(PROGRESS_TYPE, 'default', this.el, 'type');
  }
  @Watch('value')
  validateValue(newValue: number) {
    const clampedValue = Math.max(0, Math.min(100, newValue)); // Value must be between 0 and 100
    if (newValue !== clampedValue) {
      this.value = clampedValue;
    }
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handleTypePropChange();
  }

  componentDidUpdate() {
    this.setProgressIndeterminate();
    this.checkIsIndeterminated();
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

  private previousValue: number | null = null;

  private setProgressIndeterminate = () => {
    if (this.mode === 'indeterminated') {
      // Remove the value only if it hasn't been removed already
      if (this.el.hasAttribute('value')) {
        this.previousValue = this.value;
        this.el.removeAttribute('value');
      }
    } else {
      // Restore the previous value only if it's available
      if (this.previousValue !== null) {
        this.el.setAttribute('value', `${this.previousValue}`);
      }
    }
  };

  private isFirefox = () => {
    return navigator.userAgent.indexOf('Firefox') !== -1;
  };

  private checkIsIndeterminated() {
    const isIndeterminated = this.mode === 'indeterminated';
    if (isIndeterminated) {
      this.tooltip = false;
      this.percentage = false;
    }
    return isIndeterminated;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const progressClasses = {
      [`progress-bar ${this.thickness} progress-bar__${this.type}`]: true,
      'h-1': this.thickness === 'medium',
      'h-2': this.thickness === 'large',
      'progress-bar__level': !this.level,
      onlyOnFirefox: !this.level && this.isFirefox(),
    };

    return (
      <div class="flex items-center gap-xs">
        {this.tooltip && (
          <bq-tooltip>
            <progress class={progressClasses} value={this.value} max="100" slot="trigger"></progress>
            <span class="font-medium leading-regular text-text-inverse">{this.value}</span>
          </bq-tooltip>
        )}
        {!this.tooltip && <progress class={progressClasses} value={this.value} max="100" slot="trigger"></progress>}
        {this.percentage && <div class="font-medium leading-regular text-text-primary">{this.value}%</div>}
      </div>
    );
  }
}
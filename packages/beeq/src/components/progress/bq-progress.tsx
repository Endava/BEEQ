import { Component, Element, h, Prop, Watch } from '@stencil/core';

import {
  PROGRESS_MODE,
  PROGRESS_THICKNESS,
  PROGRESS_TYPE,
  TProgressMode,
  TProgressThickness,
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

  private previousValue: number | null = null;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqProgressElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** It defines the mode of progress bar to display */
  @Prop({ reflect: true }) mode: TProgressMode = 'determinate';

  /** A number representing the current value of the progress bar */
  @Prop({ reflect: true }) value = 0;

  /** Progress bar thickness */
  @Prop({ reflect: true }) thickness: TProgressThickness = 'medium';

  /** Progress type */
  @Prop({ reflect: true }) type: TProgressType = 'default';

  /** If `true`, the progress bar will be displayed without border radius */
  @Prop({ reflect: true }) borderShape: boolean = false;

  /** It `true`, the progress bar will be displayed with percentage text */
  @Prop({ reflect: true }) label: boolean = false;

  /** It `true`, the progress bar will be displayed with percentage tooltip */
  @Prop({ reflect: true }) enableTooltip: boolean = false;

  // Prop lifecycle events
  // =======================
  @Watch('mode')
  @Watch('thickness')
  @Watch('type')
  handleTypePropChange() {
    validatePropValue(PROGRESS_MODE, 'determinated', this.el, 'mode');
    validatePropValue(PROGRESS_THICKNESS, 'medium', this.el, 'thickness');
    validatePropValue(PROGRESS_TYPE, 'default', this.el, 'type');
  }

  @Watch('value')
  handleValuePropChange(newValue: number) {
    this.validateValue(newValue);
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handleTypePropChange();
    this.handleValuePropChange(this.value);
  }

  componentDidUpdate() {
    this.checkIsIndeterminated();
    this.setProgressIndeterminate();
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

  private setProgressIndeterminate = () => {
    const hasValueAttribute = this.el.hasAttribute('value');
    const hasPreviousValue = this.previousValue !== null;

    if (this.mode === 'indeterminate' && hasValueAttribute) {
      this.previousValue = this.value;
      this.el.removeAttribute('value');
      return;
    }

    if (this.mode !== 'indeterminate' && hasPreviousValue) {
      this.el.setAttribute('value', `${this.previousValue}`);
    }
  };

  private checkIsIndeterminated() {
    const isIndeterminated = this.mode === 'indeterminate';
    if (isIndeterminated) {
      this.enableTooltip = false;
      this.label = false;
    }
    return isIndeterminated;
  }

  private validateValue(newValue: number) {
    if (this.value) {
      const clampedValue = Math.max(0, Math.min(100, newValue));
      if (newValue !== clampedValue) {
        this.value = clampedValue;
      }
    }
    return this.value;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const progressClasses = {
      [`progress-bar progress-bar__${this.type} ${this.thickness}`]: true,
      'progress-bar__border-shape rounded-full': !this.borderShape,
      'h-1': this.thickness === 'medium',
      'h-2': this.thickness === 'large',
      indeterminate: this.checkIsIndeterminated(),
    };

    return (
      <div class="flex items-center gap-xs">
        <div class="relative flex items-center">
          <progress class={progressClasses} value={this.value} max="100"></progress>
          {this.enableTooltip && (
            <bq-tooltip
              class="absolute"
              exportparts="base,trigger,panel"
              alwaysVisible={true}
              distance={16}
              style={{ left: `${this.value}%`, fontVariant: 'tabular-nums' }}
            >
              <div class="absolute h-1 w-1" slot="trigger"></div>
              {this.value}
            </bq-tooltip>
          )}
        </div>
        {this.label && (
          <div
            style={{ fontVariant: 'tabular-nums' }}
            class={{
              ' font-medium tabular-nums leading-regular text-text-primary': true,
              'text-ui-danger': this.type === 'error',
            }}
          >
            {this.value}%
          </div>
        )}
      </div>
    );
  }
}

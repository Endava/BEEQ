import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { PROGRESS_MODE, TProgressMode } from './bq-progress.types';
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

  // Prop lifecycle events
  // =======================
  @Watch('mode')
  handleTypePropChange() {
    validatePropValue(PROGRESS_MODE, 'determinated', this.el, 'mode');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class={{
          [`bq-progress ${this.mode}`]: true,
        }}
        part="base"
      >
        <div class="bq-progress__container">
          <progress value={this.value} max="100"></progress>
        </div>
      </div>
    );
  }
}

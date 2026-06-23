import { Component, Element, h, Prop, Watch } from '@stencil/core';

import { validatePropValue } from '../../shared/utils';
import type { TStatusType } from './bq-status.types';
import { STATUS_TYPE } from './bq-status.types';

/**
 * The Status Component is a UI element that represents the current state or condition of an item, task, or process.
 *
 * @example How to use it
 * ```html
 * <bq-status type="alert">Alert status</bq-status>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/46c8d5-status/b/09d7b1
 * @status stable
 *
 * @dependency bq-badge
 *
 * @attr {"alert" | "danger" | "info" | "neutral" | "success"} type - It defines the type of status to display.
 *
 * @slot The content of the status component.
 *
 * @part base - The component's internal wrapper of the status component.
 * @part circle - The colored circle that marks the status type.
 * @part text - The `<div>` container that holds the text label of the status component.
 *
 * @cssprop --bq-status-circ - Status circle size.
 */
@Component({
  tag: 'bq-status',
  styleUrl: './scss/bq-status.scss',
  shadow: true,
})
export class BqStatus {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================
  @Element() el!: HTMLBqStatusElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** It defines the type of status to display  */
  @Prop({ reflect: true }) type: TStatusType = 'neutral';

  // Prop lifecycle events
  // =======================
  @Watch('type')
  checkPropValues() {
    validatePropValue(STATUS_TYPE, 'neutral', this.el, 'type');
  }
  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
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

  // render() function
  // Always the last one in the class.
  // ===================================
  render() {
    return (
      <div class="bq-status" part="base" role="status">
        <bq-badge class="bq-status__circle" part="circle" size="medium" />
        <div class="bq-status__text" part="text">
          <slot />
        </div>
      </div>
    );
  }
}

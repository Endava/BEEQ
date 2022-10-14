import { h, Component, Prop, Element, Watch } from '@stencil/core';
import { validatePropValue } from '../../shared/utils';
import { STATUS_TYPE, TStatusType } from './bq-status.types';

/**
 * @part base - The component's internal wrapper of the status component
 * @part circle - The colored circle that marks the status type
 * @part label - The `<span>` element that holds the text content
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
    validatePropValue(STATUS_TYPE, 'neutral', this.type, this.el, 'type');
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
      <div
        class="bq-status inline-flex items-center gap-2 font-inter text-s font-medium text-text-primary"
        part="base"
        role="status"
      >
        <div class={`bq-status__circle rounded-full ${this.type}`} part="circle" />
        <slot />
      </div>
    );
  }
}

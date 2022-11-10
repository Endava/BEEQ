import { h, Component, Prop, Watch, Element } from '@stencil/core';
import { validatePropValue } from '../../shared/utils';
import { TAB_SIZE, TTabSize } from './bq-tab.types';

@Component({
  tag: 'bq-tab',
  styleUrl: './scss/bq-tab.scss',
  shadow: true,
})
export class BqTab {
  // Own Properties
  // ====================

  @Element() el!: HTMLBqTabElement;

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true tab is active */
  @Prop({ reflect: true }) active? = false;

  /** If true tab is disabled */
  @Prop({ reflect: true }) disabled? = false;

  /** The size of the tab */
  @Prop({ reflect: true }) size: TTabSize = 'small';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(TAB_SIZE, 'small', this.size, this.el, 'size');
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
        class={{
          'relative flex cursor-pointer items-center justify-center rounded-s': true,
          'pointer-events-none cursor-not-allowed opacity-40': this.disabled,
          'bq-tab': true,
          [`bq-tab--${this.size}`]: true,
        }}
        role="tab"
        part="base"
        aria-disabled={this.disabled ? 'true' : 'false'}
        tabindex={this.disabled ? '-1' : '0'}
      >
        <slot name="icon" />
        <span
          class={{
            'font-inter text-s leading-m text-text-primary': true,
            'text-ui-primary': this.active && !this.disabled,
          }}
          part="text"
        >
          <slot />
        </span>
        <div class={{ 'bq-tab__underline': true, 'bg-ui-primary': this.active && !this.disabled }} part="underline" />
      </div>
    );
  }
}

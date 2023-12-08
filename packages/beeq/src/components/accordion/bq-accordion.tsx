import { Component, Element, Event, EventEmitter, h, Prop, State, Watch } from '@stencil/core';

import { ACCORDION_APPEARANCE, ACCORDION_SIZE, TAccordionAppearance, TAccordionSize } from './bq-accordion.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part base - The `<details>` that holds the accordion content
 * @part header - The `<summary>` that holds the accordion header content
 * @part prefix - The `<div>` that holds the accordion text prefix icon / avatar
 * @part text - The `<div>` that holds the accordion header text
 * @part suffix - The `<div>` that holds the accordion text suffix icon
 * @part panel - The `<div>` that holds the accordion panel content
 */
@Component({
  tag: 'bq-accordion',
  styleUrl: './scss/bq-accordion.scss',
  shadow: true,
})
export class BqAccordion {
  // Own Properties
  // ====================

  private prefixElem: HTMLDivElement;
  private suffixElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAccordionElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasPrefix = false;
  @State() private hasSuffix = false;

  // Public Property API
  // ========================

  /** If true accordion is expanded */
  @Prop({ reflect: true, mutable: true }) expanded: boolean = false;

  /** If true accordion is disabled */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** If true accordion expand icon is rotate 180deg when expanded */
  @Prop({ reflect: true }) rotate: boolean = false;

  /** The size of accordion */
  @Prop({ reflect: true, mutable: true }) size: TAccordionSize = 'medium';

  /** The appearance style of accordion */
  @Prop({ reflect: true, mutable: true }) appearance: TAccordionAppearance = 'filled';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(ACCORDION_SIZE, 'medium', this.el, 'size');
    validatePropValue(ACCORDION_APPEARANCE, 'filled', this.el, 'appearance');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the accordion is clicked */
  @Event() bqClick: EventEmitter<HTMLBqAccordionElement>;

  /** Handler to be called when the accordion gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqAccordionElement>;

  /** Handler to be called when the accordion loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqAccordionElement>;

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

  private handleClick = (event: MouseEvent) => {
    event.preventDefault();

    this.expanded = !this.expanded;
    this.bqClick.emit(this.el);
  };

  private handleFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handlePrefixSlotChange = () => {
    this.hasPrefix = hasSlotContent(this.prefixElem, 'prefix');
  };

  private handleSuffixSlotChange = () => {
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
  };

  private get open() {
    return this.expanded && !this.disabled;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <details
        class={{ [`bq-accordion ${this.size} ${this.appearance}`]: true, disabled: this.disabled }}
        open={this.open}
        onClick={this.handleClick}
        part="base"
      >
        <summary class="bq-accordion__header" part="header" onFocus={this.handleFocus} onBlur={this.handleBlur}>
          <div
            ref={(element) => (this.prefixElem = element)}
            class={{ 'bq-accordion__header--prefix': true, '!hidden': !this.hasPrefix }}
            part="prefix"
          >
            <slot name="prefix" onSlotchange={this.handlePrefixSlotChange} />
          </div>
          <div class="bq-accordion__header--text" part="text">
            <slot name="header" />
          </div>
          <div
            ref={(element) => (this.suffixElem = element)}
            class={{ 'bq-accordion__header--suffix': true, '!hidden': !this.hasSuffix }}
            part="suffix"
          >
            <slot name="suffix" onSlotchange={this.handleSuffixSlotChange} />
          </div>
          <div
            class={{
              'flex items-center justify-center': true,
              '!hidden': this.open && !this.rotate,
              'rotate-180': this.rotate && this.open,
            }}
          >
            <slot name="expand">
              <bq-icon name="plus" />
            </slot>
          </div>
          <div
            class={{ 'flex items-center justify-center': true, '!hidden': (!this.open && !this.rotate) || this.rotate }}
          >
            <slot name="collapse">
              <bq-icon name="minus" />
            </slot>
          </div>
        </summary>
        <div class="bq-accordion__body" part="panel">
          <slot />
        </div>
      </details>
    );
  }
}

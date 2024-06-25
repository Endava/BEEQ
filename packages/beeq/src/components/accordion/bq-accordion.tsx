import { Component, Element, Event, EventEmitter, h, Listen, Prop, State, Watch } from '@stencil/core';

import { ACCORDION_APPEARANCE, ACCORDION_SIZE, TAccordionAppearance, TAccordionSize } from './bq-accordion.types';
import { Accordion } from './helper';
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

  private accordion: Accordion;
  private prefixElem: HTMLDivElement;
  private suffixElem: HTMLDivElement;
  private detailsElem: HTMLDetailsElement;

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

  /** The appearance style of accordion */
  @Prop({ reflect: true, mutable: true }) appearance: TAccordionAppearance = 'filled';

  /** If true accordion is disabled */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** If true accordion is expanded */
  @Prop({ reflect: true, mutable: true }) expanded: boolean = false;

  /** If true accordion expand icon is rotate 180deg when expanded */
  @Prop({ reflect: true }) rotate: boolean = false;

  /** The size of accordion */
  @Prop({ reflect: true, mutable: true }) size: TAccordionSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(ACCORDION_SIZE, 'medium', this.el, 'size');
    validatePropValue(ACCORDION_APPEARANCE, 'filled', this.el, 'appearance');
  }

  @Watch('expanded')
  handleExpandedChange() {
    if (!this.accordion) return;

    const event = this.expanded ? this.bqOpen.emit(this.el) : this.bqClose.emit(this.el);
    if (event.defaultPrevented) {
      this.expanded = !this.expanded;
      return;
    }

    this.expanded ? this.accordion.open() : this.accordion.close();
  }

  @Watch('disabled')
  handleDisabledChange() {
    if (!this.disabled) return;

    this.expanded = false;
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the accordion loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqAccordionElement>;

  /** Handler to be called when the accordion gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqAccordionElement>;

  /** Handler to be called when the accordion is opened */
  @Event() bqOpen: EventEmitter<HTMLBqAccordionElement>;

  /** Handler to be called after the accordion is opened */
  @Event() bqAfterOpen: EventEmitter<HTMLBqAccordionElement>;

  /** Handler to be called when the accordion is closed */
  @Event() bqClose: EventEmitter<HTMLBqAccordionElement>;

  /** Handler to be called after the accordion is closed */
  @Event() bqAfterClose: EventEmitter<HTMLBqAccordionElement>;

  /** @internal Handler to be called when the accordion is clicked */
  @Event() bqClick: EventEmitter<HTMLBqAccordionElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

  componentDidLoad() {
    this.accordion = new Accordion(this.detailsElem);
    this.handleExpandedChange();
  }

  // Listeners
  // ==============

  @Listen('accordionTransitionEnd')
  onAccordionTransitionEnd(event: CustomEvent) {
    if (event.target !== this.el) return;

    this.expanded ? this.bqAfterOpen.emit(this.el) : this.bqAfterClose.emit(this.el);
  }

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

    if (this.disabled) return;

    this.expanded = !this.expanded;
    this.bqClick.emit(this.el);
  };

  private handleFocus = () => {
    if (this.disabled) return;

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
        class={{ [`bq-accordion overflow-hidden ${this.size} ${this.appearance}`]: true, disabled: this.disabled }}
        ref={(detailsElem: HTMLDetailsElement) => (this.detailsElem = detailsElem)}
        part="base"
      >
        <summary
          class="bq-accordion__header"
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          aria-expanded={this.open}
          aria-disabled={this.disabled}
          tabindex={this.disabled ? -1 : 0}
          part="header"
        >
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
              'flex items-center justify-center transition-transform duration-300 ease-in-out': true,
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

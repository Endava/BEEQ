import { Component, Element, Event, EventEmitter, h, Listen, Prop, State, Watch } from '@stencil/core';

import { ACCORDION_APPEARANCE, ACCORDION_SIZE, TAccordionAppearance, TAccordionSize } from './bq-accordion.types';
import { Accordion } from './helper';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * The Accordion is a UI component that allows users to toggle between showing and hiding content sections. It provides a collapsible functionality, where only one section can be expanded at a time, while the others remain collapsed.
 *
 * @example How to use it
 * ```html
 * <bq-accordion appearance="filled" size="medium">
 *   <bq-avatar size="xsmall" image="/image/url/img.png" slot="prefix"></bq-avatar>
 *   <h3 slot="header">Header</h3>
 *   <div>Lorem ipsum dolor...</div>
 * </bq-accordion>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/713eae-accordion
 * @status stable
 *
 * @dependency bq-icon
 *
 * @attr {"filled" | "ghost"} [appearance="filled"] - The appearance style of the Accordion
 * @attr {boolean} [disabled=false] - If true, the Accordion is disabled
 * @attr {boolean} [expanded=false] - If true, the Accordion is expanded
 * @attr {boolean} [no-animation=false] - Animation is set through JS when the browser does not support CSS calc-size() If true, the Accordion animation, will be disabled. No animation will be applied.
 * @attr {boolean} [rotate=false] - If true, the Accordion expand icon is rotate 180deg when expanded
 * @attr {"small" | "medium"} [size="medium"] - The size of the the Accordion
 *
 * @event bqOpen - Handler to be called when the accordion is opened
 * @event bqAfterOpen - Handler to be called after the accordion is opened
 * @event bqClose - Handler to be called when the accordion is closed
 * @event bqAfterClose - Handler to be called after the accordion is closed
 * @event bqFocus - Handler to be called when the accordion gets focus
 * @event bqClick - Handler to be called when the accordion is clicked
 * @event bqBlur - Handler to be called when the accordion loses focus
 *
 * @slot - The accordion panel content
 * @slot collapse - The accordion collapse icon
 * @slot expand - The accordion expand icon
 * @slot header - The accordion header content
 * @slot prefix - The accordion prefix content (icon or avatar)
 * @slot suffix - The accordion suffix content (icon or avatar)
 *
 * @part base - The `<details>` that holds the accordion content
 * @part header - The `<summary>` that holds the accordion header content
 * @part panel - The `<div>` that holds the accordion panel content
 * @part prefix - The `<div>` that holds the accordion prefix content
 * @part suffix - The `<div>` that holds the accordion suffix content
 * @part text - The `<div>` that holds the accordion header text content
 *
 * @cssprop --bq-accordion--small-padding-y - Accordion small vertical padding
 * @cssprop --bq-accordion--small-padding-start - Accordion small start padding
 * @cssprop --bq-accordion--small-padding-end - Accordion small end padding
 * @cssprop --bq-accordion--small-padding-gap - Accordion small gap distance between suffix, title and prefix
 * @cssprop --bq-accordion--small-radius - Accordion small border radius
 *
 * @cssprop --bq-accordion--medium-padding-y - Accordion medium vertical padding
 * @cssprop --bq-accordion--medium-padding-start - Accordion medium start padding
 * @cssprop --bq-accordion--medium-padding-end - Accordion medium end padding
 * @cssprop --bq-accordion--medium-padding-gap - Accordion medium gap distance between suffix, title and prefix
 * @cssprop --bq-accordion--medium-radius - Accordion medium border radius
 *
 * @cssprop --bq-accordion--collapsed-border-color - Accordion collapsed border color
 * @cssprop --bq-accordion--collapsed-border-style - Accordion collapsed border style
 * @cssprop --bq-accordion--collapsed-border-width - Accordion collapsed border width
 *
 * @cssprop --bq-accordion--expanded-border-color - Accordion expanded border color
 * @cssprop --bq-accordion--expanded-border-style - Accordion expanded border style
 * @cssprop --bq-accordion--expanded-border-width - Accordion expanded border width
 *
 * @cssprop --bq-accordion--filled-collapsed-background - Accordion filled collapsed header background
 * @cssprop --bq-accordion--filled-collapsed-text-color - Accordion filled collapsed header text color
 * @cssprop --bq-accordion--filled-expanded-background - Accordion filled expanded header background
 * @cssprop --bq-accordion--filled-expanded-collapsed-hover - Accordion filled expanded header color on hover
 * @cssprop --bq-accordion--filled-expanded-text-color - Accordion filled expanded header text color
 *
 * @cssprop --bq-accordion--ghost-collapsed-background - Accordion ghost collapsed header background
 * @cssprop --bq-accordion--ghost-collapsed-text-color - Accordion ghost collapsed header text color
 * @cssprop --bq-accordion--ghost-expanded-background - Accordion ghost expanded header background
 * @cssprop --bq-accordion--ghost-expanded-collapsed-hover - Accordion ghost expanded header color on hover
 * @cssprop --bq-accordion--ghost-expanded-text-color - Accordion ghost expanded header text color
 *
 * @cssprop --bq-accordion--panel-filled-border-color - Accordion filled panel border color
 * @cssprop --bq-accordion--panel-filled-border-style - Accordion filled panel border style
 * @cssprop --bq-accordion--panel-filled-border-width - Accordion filled panel border width
 * @cssprop --bq-accordion--panel-small-filled-padding-y - Accordion small filled panel vertical padding
 * @cssprop --bq-accordion--panel-small-filled-padding-start - Accordion small filled panel start padding
 * @cssprop --bq-accordion--panel-small-filled-padding-end - Accordion small filled panel end padding
 * @cssprop --bq-accordion--panel-medium-filled-padding-y - Accordion medium filled panel vertical padding
 * @cssprop --bq-accordion--panel-medium-filled-padding-start - Accordion medium filled panel start padding
 * @cssprop --bq-accordion--panel-medium-filled-padding-end - Accordion medium filled panel end padding
 *
 * @cssprop --bq-accordion--panel-ghost-border-color - Accordion ghost panel border color
 * @cssprop --bq-accordion--panel-ghost-border-style - Accordion ghost panel border style
 * @cssprop --bq-accordion--panel-ghost-border-width - Accordion ghost panel border width
 * @cssprop --bq-accordion--panel-small-ghost-padding-y - Accordion small ghost panel vertical padding
 * @cssprop --bq-accordion--panel-small-ghost-padding-start - Accordion small ghost panel start padding
 * @cssprop --bq-accordion--panel-small-ghost-padding-end - Accordion small ghost panel end padding
 * @cssprop --bq-accordion--panel-medium-ghost-padding-y - Accordion medium ghost panel vertical padding
 * @cssprop --bq-accordion--panel-medium-ghost-padding-start - Accordion medium ghost panel start padding
 * @cssprop --bq-accordion--panel-medium-ghost-padding-end - Accordion medium ghost panel end padding
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

  /** The appearance style of the Accordion */
  @Prop({ reflect: true, mutable: true }) appearance: TAccordionAppearance = 'filled';

  /** If true, the Accordion is disabled */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** If true, the Accordion is expanded */
  @Prop({ reflect: true, mutable: true }) expanded: boolean = false;

  /**
   * Animation is set through JS when the browser does not support CSS calc-size()
   * If true, the Accordion animation, will be disabled. No animation will be applied.
   */
  @Prop({ reflect: true }) noAnimation: boolean = false;

  /** If true, the Accordion expand icon is rotate 180deg when expanded */
  @Prop({ reflect: true }) rotate: boolean = false;

  /** The size of the Accordion */
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
    const event = this.expanded ? this.bqOpen.emit(this.el) : this.bqClose.emit(this.el);
    if (event.defaultPrevented) {
      this.expanded = !this.expanded;
      return;
    }

    if (this.expanded) {
      this.accordion?.open();
    } else {
      this.accordion?.close();
    }
    if (!this.isCssCalcSizeSupported) return;

    // NOTE: This is a workaround to trigger the transitionEnd event
    // when the open/close animation is handled via CSS instead of JS
    setTimeout(() => {
      this.el.dispatchEvent(new CustomEvent('accordionTransitionEnd', { bubbles: false, composed: true }));
    }, 200);
  }

  @Watch('disabled')
  handleDisabledChange() {
    if (!this.disabled) return;

    this.expanded = false;
  }

  @Watch('noAnimation')
  handleJsAnimation() {
    if (this.isCssCalcSizeSupported) return;

    console.warn(
      `[bq-accordion] calc-size() is not supported and animation will be set through JS
        For vertical layout, consider using the 'noAnimation' prop ('no-animation' attribute) to disable it`,
    );
    this.accordion = !this.noAnimation ? new Accordion(this.detailsElem) : null;
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

  /** Handler to be called when the accordion is clicked */
  @Event() bqClick: EventEmitter<HTMLBqAccordionElement>;

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValues();
  }

  componentDidLoad() {
    this.handleJsAnimation();
    this.handleExpandedChange();
  }

  // Listeners
  // ==============

  @Listen('accordionTransitionEnd')
  onAccordionTransitionEnd(event: CustomEvent) {
    event.stopPropagation();
    if (event.target !== this.el) return;

    if (this.expanded) {
      this.bqAfterOpen.emit(this.el);
      return;
    }

    this.bqAfterClose.emit(this.el);
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

    this.bqClick.emit(this.el);
    this.expanded = !this.expanded;
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

  private get isCssCalcSizeSupported() {
    return window.CSS?.supports('(block-size: calc-size(auto))');
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <details
        class={{
          [`bq-accordion overflow-hidden ${this.size} ${this.appearance}`]: true,
          'no-animation': this.noAnimation,
          disabled: this.disabled,
        }}
        ref={(detailsElem: HTMLDetailsElement) => (this.detailsElem = detailsElem)}
        open={this.open}
        part="base"
      >
        <summary
          id="bq-accordion__header"
          class="bq-accordion__header"
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          aria-expanded={this.expanded ? 'true' : 'false'}
          aria-disabled={this.disabled ? 'true' : 'false'}
          aria-controls="bq-accordion__content"
          tabindex={this.disabled ? -1 : 0}
          role="button"
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
            aria-hidden="true"
          >
            <slot name="expand">
              <bq-icon name="plus" />
            </slot>
          </div>
          <div
            class={{ 'flex items-center justify-center': true, '!hidden': (!this.open && !this.rotate) || this.rotate }}
            aria-hidden="true"
          >
            <slot name="collapse">
              <bq-icon name="minus" />
            </slot>
          </div>
        </summary>
        <div
          class="bq-accordion__body overflow-hidden"
          aria-labelledby="bq-accordion__header"
          role="region"
          part="panel"
        >
          <slot id="bq-accordion__content" class="bq-accordion__content block" />
        </div>
      </details>
    );
  }
}

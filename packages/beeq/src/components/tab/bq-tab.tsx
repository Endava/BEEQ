import { Component, Element, Event, EventEmitter, h, Method, Prop, State, Watch } from '@stencil/core';

import { TAB_ORIENTATION, TAB_PLACEMENT, TAB_SIZE, TTabOrientation, TTabPlacement, TTabSize } from './bq-tab.types';
import { hasSlotContent, validatePropValue } from '../../shared/utils';

/**
 * @part base - The HTML button used under the hood.
 * @part content - The HTML `<div>` element that holds the content.
 * @part icon - The HTML `<div>` element that holds the icon content.
 * @part text - The HTML `<div>` element that holds the text content.
 * @part underline - The HTML `<div>` element that display active state.
 */
@Component({
  tag: 'bq-tab',
  styleUrl: './scss/bq-tab.scss',
  shadow: true,
})
export class BqTab {
  // Own Properties
  // ====================

  private buttonElement: HTMLButtonElement;
  private iconElement: HTMLSpanElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTabElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() tabIndex: number | null = null;
  @State() hasIcon: boolean = false;

  // Public Property API
  // ========================

  /** If true tab is active */
  @Prop({ reflect: true, mutable: true }) active?: boolean;

  /** If true tab is disabled */
  @Prop({ reflect: true }) disabled = false;

  /** The size of the tab */
  @Prop({ reflect: true }) size: TTabSize = 'medium';

  /** The direction that tab should be render */
  @Prop({ reflect: true }) orientation?: TTabOrientation = 'horizontal';

  /** The placement that tab should be render */
  @Prop({ reflect: true }) placement?: TTabPlacement = 'start';

  /** The id of the tab */
  @Prop({ reflect: true }) tabId!: string;

  /** The tab panel id that the tab controls */
  @Prop({ reflect: true }) controls!: string;

  // Prop lifecycle events
  // =======================

  @Watch('size')
  @Watch('orientation')
  @Watch('placement')
  checkPropValues() {
    validatePropValue(TAB_SIZE, 'medium', this.el, 'size');
    validatePropValue(TAB_ORIENTATION, 'horizontal', this.el, 'orientation');
    validatePropValue(TAB_PLACEMENT, 'start', this.el, 'placement');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  /** Handler to be called when the tab state changes */
  @Event() bqClick: EventEmitter<HTMLBqTabElement>;

  /** Handler to be called when the tab gets focus */
  @Event() bqFocus: EventEmitter<HTMLBqTabElement>;

  /** Handler to be called when the tab loses focus */
  @Event() bqBlur: EventEmitter<HTMLBqTabElement>;

  /** Handler to be called when the tab key is pressed */
  @Event() bqKeyDown: EventEmitter<KeyboardEvent>;

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
  /**
   * Simulate a click event on the native `<button>` HTML element used under the hood.
   * Use this method instead of the global `element.click()`.
   */
  @Method()
  async vClick() {
    this.buttonElement?.click();
  }

  /**
   * Sets focus on the native `<button>` HTML element used under the hood.
   * Use this method instead of the global `element.focus()`.
   */
  @Method()
  async vFocus() {
    this.buttonElement?.focus();
  }

  /**
   * Remove focus from the native `<button>` HTML element used under the hood.
   * Use this method instead of the global `element.blur()`.
   */
  @Method()
  async vBlur() {
    this.buttonElement?.blur();
  }

  /**
   * Sets tabindex on the native `<button>` HTML element used under the hood.
   * This method is used inside `<bq-tab-group>` to make tab focusable after the active one is focused
   */
  @Method()
  async enableFocus(value: boolean) {
    this.tabIndex = value ? 0 : null;
  }

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private handleClick = () => {
    this.active = true;
    this.bqClick.emit(this.el);
  };

  private handleOnFocus = () => {
    this.bqFocus.emit(this.el);
  };

  private handleOnBlur = () => {
    this.bqBlur.emit(this.el);
  };

  private handleOnKeyDown = (event: KeyboardEvent) => {
    this.bqKeyDown.emit(event);
  };

  private handleIconSlotChange = () => {
    this.hasIcon = hasSlotContent(this.iconElement, 'icon');
  };

  private get tabindex(): string {
    // NOTE: this.active is undefined when is not part of bq-tab-group
    return `${this.tabIndex ?? -1 + +(this.active ?? 1)}`;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <button
        ref={(el) => (this.buttonElement = el)}
        class={{
          [`bq-tab bq-tab--${this.size} bq-tab--${this.orientation}-${this.placement}`]: true,
          'text-brand': this.active,
          'text-primary': !this.active,
        }}
        id={this.tabId}
        onBlur={this.handleOnBlur}
        onClick={this.handleClick}
        onFocus={this.handleOnFocus}
        onKeyDown={this.handleOnKeyDown}
        disabled={this.disabled}
        role="tab"
        aria-controls={this.controls}
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-selected={this.active ? 'true' : 'false'}
        tabindex={this.tabindex}
        part="base"
      >
        <div class="flex items-center justify-center" part="content">
          <div class="flex" ref={(span: HTMLSpanElement) => (this.iconElement = span)} part="icon">
            <slot name="icon" onSlotchange={this.handleIconSlotChange} />
          </div>
          <div class={{ 'line-clamp-1': true, 'ms-[--bq-tab--label-icon-gap]': this.hasIcon }} part="text">
            <slot />
          </div>
        </div>
      </button>
    );
  }
}

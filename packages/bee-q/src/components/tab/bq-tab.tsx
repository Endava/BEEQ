import { h, Component, Prop, Watch, Element, Event, EventEmitter, Method } from '@stencil/core';
import { validatePropValue, hasSlotContent } from '../../shared/utils';
import { TAB_SIZE, TTabSize } from './bq-tab.types';

/**
 * @part base - The HTML button used under the hood.
 * @part icon - The HTML `<div>` element that holds the icon element.
 * @part text - The HTML `<span>` element that holds the text content.
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

  private iconSpanElement: HTMLSpanElement;

  private hasIcon = false;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqTabElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If true tab is active */
  @Prop({ reflect: true, mutable: true }) active?: boolean;

  /** If true tab is disabled */
  @Prop({ reflect: true }) disabled = false;

  /** The size of the tab */
  @Prop({ reflect: true }) size: TTabSize = 'small';

  /** The id of the tab */
  @Prop({ reflect: true }) tabId!: string;

  /** The tab panel id that the tab controls */
  @Prop({ reflect: true }) controls!: string;

  // Prop lifecycle events
  // =======================

  @Watch('size')
  checkPropValues() {
    validatePropValue(TAB_SIZE, 'small', this.el, 'size');
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

  private get tabindex(): string {
    // NOTE: this.active is undefined when is not part of bq-tab-group
    return `${-1 + +(this.active ?? 1)}`;
  }

  private handleIconSlotChange = (): void => {
    this.hasIcon = hasSlotContent(this.iconSpanElement);
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const isActive = this.active && !this.disabled;
    return (
      <button
        ref={(el) => (this.buttonElement = el)}
        class={{
          'bq-tab': true,
          [`bq-tab--${this.size}`]: true,
          'pointer-events-none cursor-not-allowed opacity-40': this.disabled,
          'gap-1': this.hasIcon && this.size === 'small',
          'gap-2': this.hasIcon && this.size !== 'small',
        }}
        id={this.tabId}
        onBlur={this.handleOnBlur}
        onClick={this.handleClick}
        onFocus={this.handleOnFocus}
        onKeyDown={this.handleOnKeyDown}
        role="tab"
        aria-controls={this.controls}
        aria-disabled={this.disabled ? 'true' : 'false'}
        aria-selected={this.active ? 'true' : 'false'}
        tabindex={this.tabindex}
        part="base"
      >
        <div part="icon" ref={(element) => (this.iconSpanElement = element)}>
          <slot name="icon" onSlotchange={this.handleIconSlotChange} />
        </div>
        <span
          class={{
            'font-inter text-s font-medium leading-large text-text-primary hover:text-text-accent': true,
            'text-ui-primary': isActive,
          }}
          part="text"
        >
          <slot />
        </span>
        <div class={{ 'bq-tab__underline': true, 'bg-ui-primary': isActive }} part="underline" />
      </button>
    );
  }
}

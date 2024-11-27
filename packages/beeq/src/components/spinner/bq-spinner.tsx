import { Component, Element, h, Prop, State, Watch } from '@stencil/core';

import { SPINNER_SIZE, SPINNER_TEXT_POSITION, TSpinnerSize, TSpinnerTextPosition } from './bq-spinner.types';
import {
  getCSSVariableValue,
  getTextContent,
  hasSlotContent,
  isHTMLElement,
  isNil,
  validatePropValue,
} from '../../shared/utils';

/**
 * Spinners are designed for users to display data loading.
 *
 * @example How to use it
 * ```html
 * <bq-spinner size="medium" text-position="bellow">
 *   <span>Loading...</span>
 * </bq-spinner>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/275f10-spinner/b/09d7b1
 * @status stable
 *
 * @attr {boolean} animation - If `false`, the animation on the icon element will be stopped.
 * @attr {"small" | "medium" | "large"} size - It defines the size of the icon element displayed.
 * @attr {"above" | "below" | "left" | "right" | "none"} text-position - It defines the position of the label text.
 *
 * @slot icon - The icon slot container.
 * @slot The content of the spinner component.
 *
 * @part base - The div wrapper container used under the hood.
 * @part icon - The `<svg>` icon element used to spin/animate.
 * @part custom-icon - The `<span>` tag element that holds the custom icon element passed.
 * @part text - The `<span>` tag element that renders the label text inside the component.
 *
 * @cssprop --bq-spinner--color - Spinner color
 * @cssprop --bq-spinner--size-large - Spinner large size
 * @cssprop --bq-spinner--size-medium - Spinner medium size
 * @cssprop --bq-spinner--size-small - Spinner small size
 * @cssprop --bq-spinner--large-text-fontSize - Spinner large text font size
 * @cssprop --bq-spinner--medium-text-fontSize - Spinner medium text font size
 * @cssprop --bq-spinner--small-text-fontSize - Spinner small text font size
 * @cssprop --bq-spinner--text-lineHeight - Spinner text line height
 */
@Component({
  tag: 'bq-spinner',
  styleUrl: './scss/bq-spinner.scss',
  shadow: true,
})
export class BqSpinner {
  // Own Properties
  // ====================

  private iconSlotElem: HTMLElement;
  private slotElem: HTMLElement;
  private observer: MutationObserver = new MutationObserver((mutations) => {
    const [mutation] = mutations;
    this.slotContentLength = mutation.target.textContent.length;
  });

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqSpinnerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasIconSlot = false;
  @State() private hasSlot = false;
  @State() private slotContentLength = 0;

  // Public Property API
  // ========================

  /** If `false`, the animation on the icon element will be stopped */
  @Prop({ reflect: true }) animation? = true;

  /** It defines the position of the label text */
  @Prop({ reflect: true }) textPosition: TSpinnerTextPosition = 'none';

  /** It defines the size of the icon element displayed */
  @Prop({ reflect: true }) size: TSpinnerSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('textPosition')
  handleTextPositionProp() {
    validatePropValue(SPINNER_TEXT_POSITION, 'none', this.el, 'textPosition');
  }

  @Watch('size')
  handleSizeProp() {
    validatePropValue(SPINNER_SIZE, 'medium', this.el, 'size');
    this.setIconSize();
  }

  @Watch('hasIconSlot')
  handleHasIconSlot() {
    this.setIconSize();
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

  componentDidLoad() {
    this.setIconSize();
  }

  disconnectedCallback() {
    this.observer?.disconnect();
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

  private handleSlotChange = () => {
    if (!this.slotElem) return;

    this.hasSlot = hasSlotContent(this.slotElem);
    if (!this.hasSlot) return;

    const slot = this.slotElem.querySelector('slot') ?? null;
    if (isNil(slot)) return;

    this.slotContentLength = getTextContent(slot, { recurse: true }).length;
    const nodes = slot.assignedNodes({ flatten: true });
    nodes.forEach((node) => {
      this.observer.observe(node, {
        characterData: true,
        childList: true,
        subtree: true,
      });
    });
  };

  private handleIconSlotChange = (): void => {
    this.hasIconSlot = hasSlotContent(this.iconSlotElem, 'icon');
  };

  private checkPropValues = (): void => {
    validatePropValue(SPINNER_TEXT_POSITION, 'none', this.el, 'textPosition');
    validatePropValue(SPINNER_SIZE, 'medium', this.el, 'size');
  };

  private get isTextDisplayed(): boolean {
    return this.textPosition !== 'none';
  }

  private setIconSize(): void {
    if (!this.hasIconSlot || !this.bqIcon) return;

    this.bqIcon.size = parseInt(getCSSVariableValue(`bq-spinner--size-${this.size}`, this.el)).toString();
  }

  private get bqIcon(): HTMLBqIconElement | null {
    if (!this.hasIconSlot) return null;

    const slot = this.iconSlotElem.querySelector('slot');

    return [...slot.assignedElements({ flatten: true })].filter((el: Element) =>
      isHTMLElement(el, 'bq-icon'),
    )[0] as HTMLBqIconElement;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class={{
          [`bq-spinner ${this.size} text-${this.textPosition}`]: true,
          'is-animated': this.animation,
          'has-text': !!this.slotContentLength,
        }}
        part="base"
      >
        {!this.hasIconSlot && (
          <div
            class={`bq-spinner--loader ${this.size} relative text-[--bq-spinner--color]`}
            aria-label="Loading..."
            role="status"
          >
            <svg class="bs-full is-full" fill="currentColor" viewBox="0 0 48 48">
              <path
                fill="currentColor"
                d="M10.27 7.637c-.937-1.117-.798-2.796.415-3.605a24 24 0 0 1 37.09 23.249c-.2 1.444-1.65 2.301-3.064 1.944-1.414-.356-2.25-1.793-2.096-3.242A18.72 18.72 0 0 0 14.102 8.11c-1.237.77-2.895.643-3.832-.474Z"
              />
              <path
                fill="currentColor"
                d="M48 24c0 13.255-10.745 24-24 24S0 37.255 0 24 10.745 0 24 0s24 10.745 24 24ZM5.28 24c0 10.339 8.381 18.72 18.72 18.72 10.339 0 18.72-8.381 18.72-18.72 0-10.339-8.381-18.72-18.72-18.72C13.661 5.28 5.28 13.661 5.28 24Z"
                opacity=".1"
              />
            </svg>
          </div>
        )}
        <span
          class={{
            'bq-spinner--icon': true,
            flex: this.hasIconSlot,
            '!hidden': !this.hasIconSlot,
          }}
          ref={(spanElem) => (this.iconSlotElem = spanElem)}
          part="custom-icon"
        >
          <slot name="icon" onSlotchange={this.handleIconSlotChange} />
        </span>
        <span
          class={{
            'bq-spinner--text font-medium leading-regular text-primary': true,
            '!hidden': !this.isTextDisplayed,
          }}
          part="text"
          ref={(spanElem) => (this.slotElem = spanElem)}
        >
          <slot onSlotchange={this.handleSlotChange} />
        </span>
      </div>
    );
  }
}

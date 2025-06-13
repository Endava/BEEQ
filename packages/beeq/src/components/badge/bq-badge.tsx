import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';

import { BADGE_SIZE } from './bq-badge.types';
import type { TBadgeSize } from './bq-badge.types';
import { getColorCSSVariable, getTextContent, isNil, validatePropValue } from '../../shared/utils';

/**
 * The Badge component is a visual indicator that can be added to various elements within a user interface.
 * It is typically used to highlight important or relevant information, such as alerts, notifications, or statuses.
 *
 * @example How to use it
 * ```html
 * <bq-badge background-color="ui--success" text-color="text--inverse" size="small">9</bq-badge>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/194fd1-badge
 * @status stable
 *
 * @attr {string} background-color - Badge background color. The value should be a valid value of the palette color.
 * @attr {string} text-color - Badge number color. The value should be a valid value of the palette color.
 * @attr {"small" | "medium" | "large"} size - The size of the badge. Relevant if badge has no content.
 *
 * @slot - The default slot is used to add content to the badge. The content can be a number or a text.
 *
 * @part base - The component's internal wrapper that holds the count.
 * @part number - The component's internal wrapper that holds the slot.
 *
 * @cssprop --bq-badge--background-color - The badge background color
 * @cssprop --bq-badge--box-shadow - The badge box shadow
 * @cssprop --bq-badge--border-color - The badge border color
 * @cssprop --bq-badge--border-radius - The badge border radius
 * @cssprop --bq-badge--border-style - The badge border style
 * @cssprop --bq-badge--border-width - The badge border width
 * @cssprop --bq-badge--size-small - The badge small size
 * @cssprop --bq-badge--size-medium - The badge medium size
 * @cssprop --bq-badge--size-large - The badge large size
 * @cssprop --bq-badge--text-color - The badge text color
 */
@Component({
  tag: 'bq-badge',
  styleUrl: './scss/bq-badge.scss',
  shadow: true,
})
export class BqBadge {
  // Own Properties
  // ====================

  private spanElement?: HTMLSpanElement;

  private observer: MutationObserver = new MutationObserver((mutations) => {
    const [mutation] = mutations;
    this.contentLength = mutation.target.textContent.length;
  });

  // Reference to host HTML element
  // ===================================

  @Element() el: HTMLBqBadgeElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private contentLength = 0;

  // Public Property API
  // ========================

  /** Badge background color. The value should be a valid value of the palette color */
  @Prop({ mutable: true, reflect: true }) backgroundColor?: string;

  /** Badge number color. The value should be a valid value of the palette color */
  @Prop({ mutable: true, reflect: true }) textColor?: string;

  /** The size of the badge. Relevant if badge has no content. */
  @Prop({ reflect: true, mutable: true }) size?: TBadgeSize = 'small';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  handleSizePropChange() {
    validatePropValue(BADGE_SIZE, 'small', this.el, 'size');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handleSizePropChange();
  }

  componentDidLoad() {
    this.handleSlotChange();
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
    const slot = this.slot;

    if (isNil(slot)) return;

    this.contentLength = getTextContent(slot, { recurse: true }).length;
    const [node] = slot.assignedNodes({ flatten: true });

    if (isNil(node)) {
      this.observer.takeRecords();
      return;
    }

    this.observer.observe(node, {
      characterData: true,
      childList: true,
      subtree: true,
    });
  };

  private get slot(): HTMLSlotElement | null {
    return this.spanElement?.querySelector('slot') ?? null;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = {
      ...(this.backgroundColor && { '--bq-badge--background-color': getColorCSSVariable(this.backgroundColor) }),
      ...(this.textColor && { '--bq-badge--text-color': getColorCSSVariable(this.textColor) }),
    };

    return (
      <Host style={styles}>
        <div
          class={{
            'bq-badge': true,
            [`size--${this.size}`]: this.contentLength === 0,
            digit: this.contentLength > 0,
            'p-i-xs2': this.contentLength > 1,
          }}
          part="base"
        >
          <span ref={(element) => (this.spanElement = element)} class="text-xs font-bold leading-small" part="number">
            <slot onSlotchange={this.handleSlotChange}></slot>
          </span>
        </div>
      </Host>
    );
  }
}

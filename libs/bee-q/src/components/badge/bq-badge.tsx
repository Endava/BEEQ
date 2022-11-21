import { h, Component, Prop, Watch, Host, Element, State } from '@stencil/core';
import { getColorCSSVariable, getTextContent, isNil, validatePropValue } from '../../shared/utils';
import { BADGE_SIZE, TBadgeSize } from './bq-badge.types';

/**
 * @part base - The component's internal wrapper that holds the count.
 * @part number - The component's internal wrapper that holds the slot.
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
  @Prop({ mutable: true, reflect: true }) backgroundColor? = 'data--red';

  /** Badge number color. The value should be a valid value of the palette color */
  @Prop({ mutable: true, reflect: true }) textColor? = 'text--inverse';

  /** The size of the badge */
  @Prop({ reflect: true, mutable: true }) size?: TBadgeSize = 'small';

  // Prop lifecycle events
  // =======================

  @Watch('size')
  handleSizePropChange() {
    validatePropValue(BADGE_SIZE, 'small', this.size, this.el, 'size');
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

  disconnectedcallback() {
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

  private onSlotChange = () => {
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
            'pr-2 pl-2': this.contentLength > 1,
          }}
          part="base"
        >
          <span
            ref={(element) => (this.spanElement = element)}
            class="font-inter text-xs font-bold leading-large"
            part="number"
          >
            <slot onSlotchange={this.onSlotChange}></slot>
          </span>
        </div>
      </Host>
    );
  }
}

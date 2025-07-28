import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

import { CARD_TYPE } from './bq-card.types';
import type { TCardBorderRadius, TCardType } from './bq-card.types';
import { validatePropValue } from '../../shared/utils';

/**
 * The Card component serves as a versatile container designed for flexible content presentation within user interfaces.
 * Its structure accommodates various styles, allowing users to customize and adapt it according to their design preferences.
 *
 * @example How to use it
 * ```html
 * <bq-card type="default" border="m">
 *   <div class="p-m">
 *     <h3 class="text-xl font-bold">Card Title</h3>
 *     <p class="text-m">Card content goes here</p>
 *   </div>
 * </bq-card>
 * ```
 *
 * @documentation https://www.beeq.design/3d466e231/p/522abb-card
 * @status stable
 *
 * @attr {"default" | "minimal"} type - Type of card component
 * @attr {"none" | "xs2" | "xs" | "s" | "m" | "l" | "full"} border - The corner radius of the card component
 *
 * @slot - The content of the card component
 *
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM
 *
 * @cssprop --bq-card--borderColor - Card border color
 * @cssprop --bq-card--borderRadius - Card border radius
 * @cssprop --bq-card--borderStyle - Card border style
 * @cssprop --bq-card--borderWidth - Card border width
 *
 * @cssprop --bq-card--padding - Card padding
 * @cssprop --bq-card--paddingMinimal - Minimal card padding
 * @cssprop --bq-card--background - Card background color
 */
@Component({
  tag: 'bq-card',
  styleUrl: './scss/bq-card.scss',
  shadow: true,
})
export class BqCard {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqCardElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** Type of card component */
  @Prop({ reflect: true }) type: TCardType = 'default';

  /** The corner radius of the card component */
  @Prop({ reflect: true }) border: TCardBorderRadius = 'm';

  // Prop lifecycle events
  // =======================

  @Watch('type')
  checkPropValue() {
    validatePropValue(CARD_TYPE, 'default', this.el, 'type');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.checkPropValue();
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
    const style = {
      ...(this.border && { '--bq-card--borderRadius': `var(--bq-radius--${this.border})` }),
    };
    return (
      <Host style={style}>
        <div
          class={{
            'bq-card rounded-[--bq-card--borderRadius] border-[length:--bq-card--borderWidth] border-[color:--bq-card--borderColor] bg-[--bq-card--background]': true,
            'p-b-[--bq-card--padding] p-i-[--bq-card--padding]': this.type === 'default',
            // Remove padding for minimal card type
            'p-b-0 p-i-0': this.type === 'minimal',
          }}
          part="wrapper"
        >
          <slot />
        </div>
      </Host>
    );
  }
}

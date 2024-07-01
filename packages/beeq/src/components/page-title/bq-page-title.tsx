import { Component, Element, h, State } from '@stencil/core';

import { hasSlotContent } from '../../shared/utils';

/**
 * @part wrapper - The wrapper container `<div>` of the element inside the shadow DOM.
 * @part base - The inner container `<div>`of element that contains the base page title component.
 * @part content - Defines the main container of the page title component, which includes the title and subtitle elements.
 * @part title-suffix - Defines the container that holds the title and any suffix content.
 * @part back - The container `<div>` page title element that acts as back slot container.
 * @part title - The `<h1>` element serves as a container for the page title content, to improve accessibility.
 * @part suffix - The `<div>` page title element that acts as suffix slot container.
 * @part sub-title - The `<div>` page title element that acts as sub-title slot container.
 */
@Component({
  tag: 'bq-page-title',
  styleUrl: './scss/bq-page-title.scss',
  shadow: true,
})
export class BqPageTitle {
  // Own Properties
  // ====================

  private backNavigationElem: HTMLElement;
  private suffixElem: HTMLElement;
  private subTitleElem: HTMLElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqPageTitleElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private haveBackNavigation = false;
  @State() private hasSuffix = false;
  @State() private hasSubTitle = false;

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

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
    this.haveBackNavigation = hasSlotContent(this.backNavigationElem, 'back');
    this.hasSuffix = hasSlotContent(this.suffixElem, 'suffix');
    this.hasSubTitle = hasSlotContent(this.subTitleElem, 'sub-title');
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div class="flex flex-col" part="wrapper">
        <div class="bq-page-title-base" part="base">
          {/* Back navigation button */}
          <div
            class={{ flex: true, '!hidden': !this.haveBackNavigation }}
            ref={(divElem) => (this.backNavigationElem = divElem)}
            part="back"
          >
            <slot name="back" onSlotchange={this.handleSlotChange} />
          </div>
          <div class="flex flex-grow flex-col gap-xs" part="content">
            <div class="flex items-center gap-xs" part="title-suffix">
              {/* Title */}
              <h1
                class="title-font text-[length:--title-textSize] font-[--title-fontWeight] leading-[--title-lineHeight] text-[color:--title-textColor]"
                part="title"
              >
                <slot />
              </h1>
              {/* Suffix */}
              <div
                class={{ 'flex flex-grow gap-xs p-b-xs2 p-i-xs2': true, '!hidden': !this.hasSuffix }}
                ref={(divElem) => (this.suffixElem = divElem)}
                part="suffix"
              >
                <slot name="suffix" onSlotchange={this.handleSlotChange} />
              </div>
            </div>
            {/* Sub-title */}
            <div
              class={{
                'title-font text-[length:--subtitle-textSize] font-[--subtitle-fontWeight] leading-[--title-lineHeight] text-[color:--subtitle-textColor]':
                  true,
                hidden: !this.hasSubTitle,
              }}
              ref={(divElem) => (this.subTitleElem = divElem)}
              part="sub-title"
            >
              <slot name="sub-title" onSlotchange={this.handleSlotChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

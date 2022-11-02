import { h, Component, Element, Prop, Watch, Host, State } from '@stencil/core';
import { validatePropValue, getColorCSSVariable, hasSlotContent, getTextContent } from '../../shared/utils';
import {
  DIVIDER_ORIENTATION,
  DIVIDER_TITLE_ALIGNMENT,
  TDividerOrientation,
  TDividerTitleAlignment,
} from './bq-divider.types';

/**
 * @part base - The component's internal wrapper.
 */
@Component({
  tag: 'bq-divider',
  styleUrl: './scss/bq-divider.scss',
  shadow: true,
})
export class BqDivider {
  // Own Properties
  // ====================

  private titleElem: HTMLDivElement;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqDividerElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() private hasTitle: boolean;

  // Public Property API
  // ========================

  /** If true, the divider has a dashed pattern */
  @Prop() dashed = false;

  /** The default orientation of the divider */
  @Prop({ reflect: true }) orientation: TDividerOrientation = 'horizontal';

  /** Set the stroke color of the divider. The value should be a valid value of the palette color */
  @Prop({ reflect: true }) strokeColor?: string = 'ui--secondary';

  /** Set the alignment of the title on the main axis of the divider (horizontal / vertical) */
  @Prop({ reflect: true }) titleAlignment?: TDividerTitleAlignment = 'middle';

  // Prop lifecycle events
  // =======================

  @Watch('orientation')
  @Watch('titleAlignment')
  checkPropValues() {
    validatePropValue(DIVIDER_ORIENTATION, 'horizontal', this.orientation, this.el, 'orientation');
    validatePropValue(DIVIDER_TITLE_ALIGNMENT, 'middle', this.titleAlignment, this.el, 'titleAlignment');
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
    this.handleSlotChange();
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
    this.hasTitle = hasSlotContent(this.titleElem) || !!getTextContent(this.titleElem.querySelector('slot'));
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = {
      ...(this.strokeColor && { '--bq-divider--stroke-color': getColorCSSVariable(this.strokeColor) }),
    };

    const baseClasses = {
      'bq-divider': true,
      [`bq-divider--${this.orientation}`]: true,
      [`bq-divider--dashed`]: this.dashed,
      ['bq-divider--no-title']: !this.hasTitle,
      [`bq-divider-title--${this.titleAlignment}`]: true,
    };

    return (
      <Host style={styles}>
        <div class={baseClasses} part="base" ref={(div) => (this.titleElem = div)}>
          <slot onSlotchange={this.handleSlotChange} />
        </div>
      </Host>
    );
  }
}

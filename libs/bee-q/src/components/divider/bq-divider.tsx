import { h, Component, Element, Prop, Watch, Host, State } from '@stencil/core';
import { validatePropValue, getColorCSSVariable, hasSlotContent, getTextContent } from '../../shared/utils';
import {
  DIVIDER_ORIENTATION,
  DIVIDER_TITLE_ALIGNMENT,
  DIVIDER_ORIENTATION_ENUM,
  DIVIDER_STROKE_LINECAP,
  TDividerOrientation,
  TDividerTitleAlignment,
  TDividerStrokeLinecap,
} from './bq-divider.types';

const strokeDrawPositions = {
  HORIZONTAL: (drawOffset: number) => {
    return { x1: drawOffset, x2: '100%', y1: drawOffset, y2: drawOffset };
  },
  VERTICAL: (drawOffset: number) => {
    return { x1: drawOffset, x2: drawOffset, y1: drawOffset, y2: '100%' };
  },
};

/**
 * @part base - The component's internal wrapper.
 * @part dash-start - The component's internal svg wrapper for the start line of the divider's stroke
 * @part dash-end - The componet's internal svg wrapper for the end line of the divider's stroke
 * @part dash-start-line - The component's internal line component of the divider's stroke
 * @part dash-end-line - The component's internal line component of the divider's stroke
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

  /** Set the width of each dash of the divider's stroke. This is applicable when the stroke is dashed */
  @Prop({ reflect: true }) strokeDashWidth?: number = 12;

  /** Set the gap of the divider's stroke. This is applicable when the stroke is dashed */
  @Prop({ reflect: true }) strokeDashGap?: number = 7;

  /** Set the thickness of the divider's stroke. Value expressed in px*/
  @Prop({ reflect: true }) strokeThickness?: number = 2;

  /** Set the min width of the divider's stroke when text is not centered. Value expressed in px */
  @Prop({ reflect: true }) strokeBasis?: number = 20;

  /** Set the lineap of the divider's stroke. This is applicable when the stroke is dashed */
  @Prop({ reflect: true }) strokeLinecap?: TDividerStrokeLinecap = 'butt';

  // Prop lifecycle events
  // =======================

  @Watch('orientation')
  @Watch('titleAlignment')
  @Watch('strokeLinecap')
  checkPropValues() {
    validatePropValue(DIVIDER_ORIENTATION, 'horizontal', this.orientation, this.el, 'orientation');
    validatePropValue(DIVIDER_TITLE_ALIGNMENT, 'middle', this.titleAlignment, this.el, 'titleAlignment');
    validatePropValue(DIVIDER_STROKE_LINECAP, 'butt', this.strokeLinecap, this.el, 'strokeLinecap');
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

  private getStrokeDrawPositions = () => {
    switch (this.orientation) {
      case DIVIDER_ORIENTATION_ENUM.HORIZONTAL:
        return strokeDrawPositions.HORIZONTAL(this.strokeThickness / 2);
      case DIVIDER_ORIENTATION_ENUM.VERTICAL:
        return strokeDrawPositions.VERTICAL(this.strokeThickness / 2);
      default:
        break;
    }
  };

  private getStrokeDasharray = () => {
    return `${this.strokeDashWidth}, ${this.strokeDashGap}`;
  };

  private getStrokeAttributes = () => {
    return {
      ...this.getStrokeDrawPositions(),
      ...(this.dashed && { 'stroke-dasharray': this.getStrokeDasharray() }),
      'stroke-linecap': this.strokeLinecap,
      'stroke-width': this.strokeThickness,
    };
  };

  private handleSlotChange = () => {
    this.hasTitle = hasSlotContent(this.titleElem) || !!getTextContent(this.titleElem.querySelector('slot'));
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = {
      ...(this.strokeColor && { '--bq-divider--stroke-color': getColorCSSVariable(this.strokeColor) }),
      ...(this.strokeThickness && { '--bq-divider--stroke-thickness': `${this.strokeThickness}px` }),
      ...(this.strokeBasis && { '--bq-divider--stroke-basis': `${this.strokeBasis}px` }),
    };

    const baseClasses = {
      'bq-divider': true,
      [`bq-divider--${this.orientation}`]: true,
      ['bq-divider--no-title']: !this.hasTitle,
      [`bq-divider--title--${this.titleAlignment}`]: true,
    };

    const strokeAttributes = this.getStrokeAttributes();

    return (
      <Host style={styles}>
        <div
          class={baseClasses}
          part="base"
          ref={(div) => (this.titleElem = div)}
          role="separator"
          aria-orientation={this.orientation}
        >
          <svg class="bq-stroke bq-divider--stroke--start" part="dash-start">
            <line {...strokeAttributes} part="dash-start-line" />
          </svg>
          <slot onSlotchange={this.handleSlotChange} />
          <svg class="bq-stroke bq-divider--stroke--end" part="dash-end">
            <line {...strokeAttributes} part="dash-end-line" />
          </svg>
        </div>
      </Host>
    );
  }
}

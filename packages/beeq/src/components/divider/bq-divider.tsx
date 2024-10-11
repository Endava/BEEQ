import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';

import {
  DIVIDER_ORIENTATION,
  DIVIDER_ORIENTATION_ENUM,
  DIVIDER_STROKE_LINECAP,
  DIVIDER_TITLE_ALIGNMENT,
  TDividerOrientation,
  TDividerStrokeLinecap,
  TDividerTitleAlignment,
} from './bq-divider.types';
import { getColorCSSVariable, getTextContent, hasSlotContent, isNil, validatePropValue } from '../../shared/utils';

/**
 * @part base - The component's internal wrapper.
 * @part dash-start - The component's internal svg wrapper for the start line of the divider's stroke
 * @part dash-end - The component's internal svg wrapper for the end line of the divider's stroke
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
  @Prop({ reflect: true }) strokeColor?: string = 'stroke--primary';

  /** Set the alignment of the title on the main axis of the divider (horizontal / vertical) */
  @Prop({ reflect: true }) titleAlignment?: TDividerTitleAlignment = 'middle';

  /** Set the width of each dash of the divider's stroke. This is applicable when the stroke is dashed */
  @Prop({ reflect: true }) strokeDashWidth?: number = 12;

  /** Set the gap of the divider's stroke. This is applicable when the stroke is dashed */
  @Prop({ reflect: true }) strokeDashGap?: number = 7;

  /** Set the thickness of the divider's stroke. Value expressed in px*/
  @Prop({ reflect: true }) strokeThickness?: number = 1;

  /** Set the min width of the divider's stroke when text is not centered. Value expressed in px */
  @Prop({ reflect: true }) strokeBasis?: number = 0;

  /** Set the line of the divider's stroke. This is applicable when the stroke is dashed */
  @Prop({ reflect: true }) strokeLinecap?: TDividerStrokeLinecap = 'butt';

  // Prop lifecycle events
  // =======================

  @Watch('orientation')
  @Watch('titleAlignment')
  @Watch('strokeLinecap')
  checkPropValues() {
    validatePropValue(DIVIDER_ORIENTATION, 'horizontal', this.el, 'orientation');
    validatePropValue(DIVIDER_TITLE_ALIGNMENT, 'middle', this.el, 'titleAlignment');
    validatePropValue(DIVIDER_STROKE_LINECAP, 'butt', this.el, 'strokeLinecap');
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  connectedCallback() {
    this.checkPropValues();
  }

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

  private get strokeAttributes() {
    return {
      ...this.strokeDrawPositions,
      ...(this.dashed && { 'stroke-dasharray': this.strokeDasharray }),
      'stroke-linecap': this.strokeLinecap,
      'stroke-width': this.strokeThickness,
    };
  }

  private get strokeDrawPositions() {
    const drawOffset = this.strokeThickness / 2;
    const strokeDrawPositions = {
      [DIVIDER_ORIENTATION_ENUM.HORIZONTAL]: { x1: drawOffset, x2: '100%', y1: drawOffset, y2: drawOffset },
      [DIVIDER_ORIENTATION_ENUM.VERTICAL]: { x1: drawOffset, x2: drawOffset, y1: drawOffset, y2: '100%' },
    };
    const orientationMap = new Map(Object.entries(strokeDrawPositions));

    return orientationMap.get(this.orientation);
  }

  private get strokeDasharray() {
    return `${this.strokeDashWidth}, ${this.strokeDashGap}`;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const styles = {
      ...(this.strokeColor && { '--bq-divider--stroke-color': getColorCSSVariable(this.strokeColor) }),
      ...(this.strokeThickness && { '--bq-divider--stroke-thickness': `${this.strokeThickness}px` }),
      ...(!isNil(this.strokeBasis) && { '--bq-divider--stroke-basis': `${this.strokeBasis}px` }),
    };

    return (
      <Host style={styles}>
        <div
          class={{
            'bq-divider': true,
            [`bq-divider--${this.orientation}`]: true,
            [`bq-divider--title__${this.titleAlignment}`]: true,
            'gap-0': !this.hasTitle,
          }}
          part="base"
          ref={(div) => (this.titleElem = div)}
          role="separator"
          aria-orientation={this.orientation}
        >
          <svg
            class={{
              'bq-divider--stroke start': true,
              '!hidden': this.strokeBasis === 0 && this.titleAlignment === 'start',
            }}
            part="dash-start"
          >
            <line {...this.strokeAttributes} part="dash-start-line" />
          </svg>
          <slot onSlotchange={this.handleSlotChange} />
          <svg
            class={{
              'bq-divider--stroke end': true,
              '!hidden': !this.hasTitle || (this.strokeBasis === 0 && this.titleAlignment === 'end'),
            }}
            part="dash-end"
          >
            <line {...this.strokeAttributes} part="dash-end-line" />
          </svg>
        </div>
      </Host>
    );
  }
}

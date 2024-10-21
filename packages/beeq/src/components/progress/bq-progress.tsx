import { Component, Element, h, Host, Prop, Watch } from '@stencil/core';

import {
  PROGRESS_BORDER_SHAPE,
  PROGRESS_THICKNESS,
  PROGRESS_TYPE,
  TProgressBorderShape,
  TProgressThickness,
  TProgressType,
} from './bq-progress.types';
import { validatePropValue } from '../../shared/utils';

/**
 * @part wrapper - The component wrapper container inside the shadow DOM
 * @part progress - The `<div>` container that holds the native progress element
 * @part progress-bar - The native html for progress element
 * @part label - The `<div>` container that holds the label value (in percentage)
 * @part indeterminate - The `<div>` container that holds the indeterminate progress bar
 *
 * @part base - The base container for the tooltip component inside the shadow DOM when hovering over the progress bar
 * @part trigger - The container holding the element that triggers the tooltip display when hovering over the progress bar
 * @part panel - The container holding the content of the tooltip when hovering over the progress bar
 */

@Component({
  tag: 'bq-progress',
  styleUrl: './scss/bq-progress.scss',
  shadow: true,
})
export class BqProgress {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqProgressElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  /** If `true` the indeterminate state of progress bar is enabled */
  @Prop({ reflect: true }) indeterminate: boolean = false;

  /** A number representing the current value of the progress bar */
  @Prop({ reflect: true, mutable: true }) value = 0;

  /** Progress bar thickness */
  @Prop({ reflect: true }) thickness: TProgressThickness = 'medium';

  /** Progress type */
  @Prop({ reflect: true }) type: TProgressType = 'default';

  /** It will set the border style of the progress bar */
  @Prop({ reflect: true }) borderShape: TProgressBorderShape = 'rounded';

  /** If `true`, a label text showing the value (in percentage) will be shown */
  @Prop({ reflect: true }) label: boolean = false;

  /** If `true`, a tooltip will be shown displaying the progress value */
  @Prop({ reflect: true }) enableTooltip: boolean = false;

  // Prop lifecycle events
  // =======================

  @Watch('borderShape')
  @Watch('thickness')
  @Watch('type')
  handleTypePropChange() {
    validatePropValue(PROGRESS_BORDER_SHAPE, 'rounded', this.el, 'borderShape');
    validatePropValue(PROGRESS_THICKNESS, 'medium', this.el, 'thickness');
    validatePropValue(PROGRESS_TYPE, 'default', this.el, 'type');
  }

  @Watch('value')
  handleValuePropChange(newValue: number) {
    this.validateValue(newValue);
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.handleTypePropChange();
    this.handleValuePropChange(this.value);
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

  private validateValue(newValue: number) {
    const clampedValue = Math.max(0, Math.min(100, newValue));
    if (newValue !== clampedValue) {
      this.value = clampedValue;
    }
    return this.value;
  }

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    const style = {
      ...(this.thickness === 'large' && { '--bq-progress-bar--height': 'var(--bq-spacing-xs)' }),
      ...(this.type === 'error' && { '--bq-progress-bar--indicatorColor': 'var(--bq-ui--danger)' }),
    };

    return (
      <Host style={style}>
        <div class="flex items-center" part="wrapper">
          <div class="relative flex items-center is-full" part="progress">
            <progress
              class={{
                [`progress-bar progress-bar__${this.type} ${this.thickness}`]: true,
                'progress-bar__border-shape rounded-full': this.borderShape === 'rounded',
              }}
              value={this.indeterminate ? undefined : this.value}
              max="100"
              part="progress-bar"
            />
            {this.enableTooltip && !this.indeterminate && (
              <bq-tooltip
                class="absolute [&::part(panel)]:absolute"
                exportparts="base,trigger,panel"
                alwaysVisible={true}
                distance={16}
                style={{ insetInlineStart: `${this.value}%`, fontVariant: 'tabular-nums' }}
              >
                <div class="absolute bs-1 is-1" slot="trigger"></div>
                {this.value}
              </bq-tooltip>
            )}
            {this.indeterminate && (
              <div
                class={{
                  'progress-bar__indeterminate absolute bg-[--bq-progress-bar--indicatorColor] bs-[--bq-progress-bar--height] is-[--bq-progress-bar--indeterminateWidth]':
                    true,
                  'rounded-full': this.borderShape === 'rounded',
                }}
                part="indeterminate"
              />
            )}
          </div>
          <div
            aria-hidden={!this.label || this.indeterminate ? 'true' : 'false'}
            class={{
              'ms-xs font-medium leading-regular': true,
              'text-primary': this.type !== 'error',
              'text-danger': this.type === 'error',
              'invisible ms-0 is-0': !this.label || this.indeterminate,
            }}
            style={{ fontVariant: 'tabular-nums' }}
            part="label"
          >
            <span>{this.value}%</span>
          </div>
        </div>
      </Host>
    );
  }
}

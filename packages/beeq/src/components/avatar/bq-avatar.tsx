import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';

import { AVATAR_SHAPE, AVATAR_SIZE, TAvatarShape, TAvatarSize } from './bq-avatar.types';
import { validatePropValue } from '../../shared/utils';

/**
 * @part base - The component's internal wrapper.
 * @part img - The `<image>` tag element that load the image source.
 * @part text - The `<span>` tag element that renderd the `Initials` text string.
 */
@Component({
  tag: 'bq-avatar',
  styleUrl: './scss/bq-avatar.scss',
  shadow: true,
})
export class BqAvatar {
  // Own Properties
  // ====================

  trimmedInitials: string;

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAvatarElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasError: boolean;

  // Public Property API
  // ========================

  /** Alternate text for the avatar image if the image cannot be displayed */
  @Prop({ reflect: true }) altText: string;

  /** The image source to load on the avatar (this can be also a base64 encoded image) */
  @Prop({ reflect: true }) image: string;

  /** A text to use for describing the avatar on assistive devices */
  @Prop({ reflect: true }) label: string;

  /** The text to display on avatar */
  @Prop({ reflect: true }) initials: string;

  /** The shape of the avatar */
  @Prop({ reflect: true }) shape: TAvatarShape = 'circle';

  /** The size of the avatar */
  @Prop({ reflect: true, mutable: true }) size: TAvatarSize = 'medium';

  // Prop lifecycle events
  // =======================

  @Watch('image')
  handleImagePropChange() {
    // Reset the error when a new image source is provided
    this.hasError = false;
  }

  @Watch('shape')
  @Watch('size')
  checkPropValues() {
    validatePropValue(AVATAR_SHAPE, 'circle', this.el, 'shape');
    validatePropValue(AVATAR_SIZE, 'medium', this.el, 'size');
  }

  @Watch('initials')
  @Watch('size')
  onInitialsChange() {
    this.trimInitialsBasedOnSize();
  }

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
    this.trimInitialsBasedOnSize();
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

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  private onImageError = () => {
    this.hasError = true;
  };

  private trimInitialsBasedOnSize = (): void => {
    if (!this.initials) return;

    AVATAR_SIZE.forEach((size: TAvatarSize) => {
      if (this.size === size) {
        this.trimmedInitials = this.initials.substring(0, this.getIndex(size));
      }
    });
  };

  private getIndex = (size: TAvatarSize): number => {
    const sizeIndexMap = {
      xsmall: 1,
      small: 2,
      medium: 3,
      large: 4,
    };
    return sizeIndexMap[size] ?? sizeIndexMap.xsmall;
  };

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <Host>
        <div
          class={{
            'bq-avatar': true,
            [`size--${this.size}`]: true,
            'rounded-[--bq-avatar--border-radius-circle]': this.shape === 'circle',
            'rounded-[--bq-avatar--border-radius-squareXs]': this.shape === 'square' && this.size === 'xsmall',
            'rounded-[--bq-avatar--border-radius-squareS]': this.shape === 'square' && this.size === 'small',
            'rounded-[--bq-avatar--border-radius-squareM]':
              this.shape === 'square' && (this.size === 'medium' || this.size === 'large'),
          }}
          aria-label={this.label}
          role="img"
          part="base"
        >
          {this.initials && (
            <span
              class="absolute start-0 inline-flex items-center justify-center font-bold bs-full is-full inset-bs-0"
              part="text"
            >
              {this.trimmedInitials}
            </span>
          )}
          {this.image && !this.hasError && (
            <img
              class="absolute start-0 object-cover bs-full is-full inset-bs-0"
              alt={this.altText ?? undefined}
              src={this.image}
              onError={this.onImageError}
              part="img"
            />
          )}
        </div>
        <div
          class={{
            'absolute flex items-center justify-center': true,
            'start-[--bq-avatar--badge-left-square] inset-bs-[--bq-avatar--badge-top-square]': this.shape === 'square',
            'start-[--bq-avatar--badge-left-circle] inset-bs-[--bq-avatar--badge-top-circle]': this.shape === 'circle',
          }}
        >
          <slot name="badge"></slot>
        </div>
      </Host>
    );
  }
}

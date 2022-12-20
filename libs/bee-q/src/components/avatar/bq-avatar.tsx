import { h, Component, Prop, Watch, State, Element } from '@stencil/core';
import { validatePropValue } from '../../shared/utils';
import { TAvatarShape, TAvatarSize, AVATAR_SHAPE, AVATAR_SIZE } from './bq-avatar.types';

/**
 * An avatar represents an object made of different pieces of information, in a way that is understandable at a glance.
 *
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

  // Reference to host HTML element
  // ===================================

  @Element() el!: HTMLBqAvatarElement;

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  @State() hasError: boolean;

  // Public Property API
  // ========================

  /** The image source to load on the avatar (this can be also a base64 encoded image) */
  @Prop() image: string;

  /** A text to use for describing the avatar on assistive devices */
  @Prop({ reflect: true }) label: string;

  /** The text to display on avatar */
  @Prop() initials: string;

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

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  componentWillLoad() {
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

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return (
      <div
        class={{
          'bq-avatar bg-ui-secondary': true,
          [`size--${this.size}`]: true,
          'rounded-full': this.shape === 'circle',
          'rounded-xs': this.shape === 'square' && this.size === 'xsmall',
          'rounded-s': this.shape === 'square' && this.size === 'small',
          'rounded-m': this.shape === 'square' && (this.size === 'medium' || this.size === 'large'),
        }}
        aria-label={this.label}
        role="img"
        part="base"
      >
        {this.initials && (
          <span class="bq-avatar__initials" part="text">
            {this.initials}
          </span>
        )}
        {this.image && !this.hasError && (
          <img class="bq-avatar__image" alt="" part="img" src={this.image} onError={this.onImageError} />
        )}
      </div>
    );
  }
}

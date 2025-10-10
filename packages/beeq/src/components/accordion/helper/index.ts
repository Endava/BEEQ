/* -------------------------------------------------------------------------------------- */
/*   💡 Credits: https://css-tricks.com/how-to-animate-the-details-element-using-waapi    */
/* -------------------------------------------------------------------------------------- */

export class Accordion {
  private el: HTMLDetailsElement;
  private header: HTMLElement;
  private panel: HTMLElement;
  private animation: Animation | null;
  private isClosing: boolean;
  private isExpanding: boolean;
  private animationOptions = {
    duration: 200,
    easing: 'ease-in-out',
  };

  constructor(el: HTMLDetailsElement) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> header element
    this.header = el.querySelector('summary');
    // Store the <div class="content"> element
    this.panel = el.querySelector('.bq-accordion__body');
    // Store the animation object (so we can cancel it, if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
  }

  public open() {
    // Check if the element is being closed or is already closed
    if (!this.isClosing && this.el.open) return;
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  public close() {
    // Check if the element is being opened or is already open
    if (!this.isExpanding && !this.el.open) return;
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the <summary> header
    const endHeight = `${this.header.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({ height: [startHeight, endHeight] }, this.animationOptions);
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => {
      this.isClosing = false;
    };
  }

  // Expands the accordion
  private expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary header height + panel body height)
    const endHeight = `${this.header.offsetHeight + this.panel.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate({ height: [startHeight, endHeight] }, this.animationOptions);
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => {
      this.isExpanding = false;
    };
  }

  // Handles the end of the animation
  private onAnimationFinish(open: boolean) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.removeAttribute('style');
    // Dispatch a custom event based on the open parameter
    const endEvent = new Event('accordionTransitionEnd', { bubbles: false, composed: true });
    this.el.dispatchEvent(endEvent);
  }
}

/** Returns whether the current runtime provides the complete HTML Popover API. */
export const isPopoverSupported = (): boolean => {
  return (
    typeof HTMLElement !== 'undefined' &&
    'popover' in HTMLElement.prototype &&
    typeof HTMLElement.prototype.showPopover === 'function' &&
    typeof HTMLElement.prototype.hidePopover === 'function'
  );
};

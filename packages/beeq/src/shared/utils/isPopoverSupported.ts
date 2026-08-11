/**
 * Feature-detects the HTML Popover API (`[popover]`, `showPopover()`,
 * `hidePopover()`).
 *
 * Elements promoted via `showPopover()` are painted in the browser's top
 * layer, which sits above every stacking context and is not affected by
 * containing blocks created by ancestor `transform`, `filter`, `contain`,
 * `will-change`, `perspective`, `backdrop-filter`, `translate`, `rotate`
 * or `scale`. This makes it the correct rendering path for floating UI
 * (tooltips, popovers, menus) when the trigger lives inside a subtree
 * that establishes such a containing block.
 *
 * The check is SSR-safe: it returns `false` when `HTMLElement` is not
 * defined (e.g. Node.js server-side rendering).
 *
 * @returns {boolean} `true` when the current runtime supports the
 * Popover API, otherwise `false`.
 */
export const isPopoverSupported = (): boolean => {
  return typeof HTMLElement !== 'undefined' && 'popover' in HTMLElement.prototype;
};

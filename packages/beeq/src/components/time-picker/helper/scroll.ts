import type { TTimeMaskField } from '../../../shared/utils';

const TAB_STOP_SELECTOR = '[role="option"][tabindex="0"]';

/** Smooth scrolling, unless the user prefers reduced motion. */
export const getScrollBehavior = (): ScrollBehavior =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

/**
 * Scrolls a column just enough to show the option.
 * Uses `scrollTop` instead of `scrollIntoView` so the page and the floating panel don't move.
 */
export const scrollOptionIntoView = (
  columnElem: HTMLElement,
  optionElem: HTMLElement,
  behavior: ScrollBehavior,
): void => {
  const top = optionElem.offsetTop;
  const bottom = top + optionElem.offsetHeight;
  const { scrollTop, clientHeight } = columnElem;
  // The panel is still hidden or being laid out; the resize observer retries once it has its size.
  if (clientHeight < optionElem.offsetHeight) return;

  if (top < scrollTop) columnElem.scrollTo({ top, behavior });
  else if (bottom > scrollTop + clientHeight) columnElem.scrollTo({ top: bottom - clientHeight, behavior });
};

/** Scrolls every column of the panel to its tab stop, the selected option when there is one. */
export const scrollSelectionIntoView = (panelElem: HTMLElement | undefined, behavior: ScrollBehavior): void => {
  if (!panelElem) return;

  for (const columnElem of Array.from(panelElem.querySelectorAll<HTMLElement>('[data-column]'))) {
    const optionElem = columnElem.querySelector<HTMLElement>(TAB_STOP_SELECTOR);
    if (optionElem) scrollOptionIntoView(columnElem, optionElem, behavior);
  }
};

/** Moves focus to the tab stop of a column without scrolling it. */
export const focusColumnTabStop = (panelElem: HTMLElement | undefined, column: TTimeMaskField): void => {
  panelElem
    ?.querySelector<HTMLElement>(`[data-column="${column}"] ${TAB_STOP_SELECTOR}`)
    ?.focus({ preventScroll: true });
};

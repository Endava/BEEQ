import { afterEach, describe, expect, it, vi } from 'vitest';

import { focusColumnTabStop, getScrollBehavior, scrollOptionIntoView, scrollSelectionIntoView } from '../scroll';

/** Column stub with a fixed viewport. */
const createColumn = (scrollTop: number, clientHeight: number) => {
  const elem = document.createElement('div');
  Object.defineProperties(elem, {
    scrollTop: { value: scrollTop },
    clientHeight: { value: clientHeight },
  });
  const scrollTo = vi.fn();
  elem.scrollTo = scrollTo;
  return { elem, scrollTo };
};

/** Option stub at a given offset. */
const createOption = (offsetTop: number, offsetHeight = 40) => {
  const elem = document.createElement('button');
  Object.defineProperties(elem, {
    offsetTop: { value: offsetTop },
    offsetHeight: { value: offsetHeight },
  });
  return elem;
};

describe('getScrollBehavior', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('scrolls smoothly unless reduced motion is preferred', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    expect(getScrollBehavior()).toBe('smooth');

    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    expect(getScrollBehavior()).toBe('auto');
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });
});

describe('scrollOptionIntoView', () => {
  it('scrolls up to an option above the viewport', () => {
    const { elem, scrollTo } = createColumn(200, 160);
    scrollOptionIntoView(elem, createOption(80), 'smooth');
    expect(scrollTo).toHaveBeenCalledWith({ top: 80, behavior: 'smooth' });
  });

  it('scrolls down just enough to show an option below the viewport', () => {
    const { elem, scrollTo } = createColumn(0, 160);
    scrollOptionIntoView(elem, createOption(200), 'auto');
    expect(scrollTo).toHaveBeenCalledWith({ top: 80, behavior: 'auto' });
  });

  it('keeps a visible option in place', () => {
    const { elem, scrollTo } = createColumn(0, 160);
    scrollOptionIntoView(elem, createOption(40), 'smooth');
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('skips a column that has no size yet', () => {
    const { elem, scrollTo } = createColumn(0, 0);
    scrollOptionIntoView(elem, createOption(200), 'smooth');
    expect(scrollTo).not.toHaveBeenCalled();
  });
});

describe('scrollSelectionIntoView', () => {
  it('scrolls each column to its tab stop', () => {
    const panel = document.createElement('div');
    const hour = createColumn(0, 160);
    const minute = createColumn(0, 160);
    hour.elem.setAttribute('data-column', 'hour');
    minute.elem.setAttribute('data-column', 'minute');

    const tabStop = createOption(200);
    tabStop.setAttribute('role', 'option');
    tabStop.setAttribute('tabindex', '0');
    hour.elem.appendChild(tabStop);
    panel.append(hour.elem, minute.elem);

    scrollSelectionIntoView(panel, 'auto');

    expect(hour.scrollTo).toHaveBeenCalledWith({ top: 80, behavior: 'auto' });
    expect(minute.scrollTo).not.toHaveBeenCalled();
  });

  it('does nothing without a panel', () => {
    expect(() => scrollSelectionIntoView(undefined, 'auto')).not.toThrow();
  });
});

describe('focusColumnTabStop', () => {
  it("focuses the column's tab stop without scrolling", () => {
    const panel = document.createElement('div');
    panel.innerHTML = `
      <div data-column="hour"><button role="option" tabindex="0"></button></div>
      <div data-column="minute">
        <button role="option" tabindex="-1"></button>
        <button role="option" tabindex="0"></button>
      </div>
    `;
    const [, , minuteTabStop] = Array.from(panel.querySelectorAll<HTMLElement>('[role="option"]'));
    const focus = vi.fn();
    minuteTabStop.focus = focus;

    focusColumnTabStop(panel, 'minute');

    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('does nothing without a panel', () => {
    expect(() => focusColumnTabStop(undefined, 'hour')).not.toThrow();
  });
});

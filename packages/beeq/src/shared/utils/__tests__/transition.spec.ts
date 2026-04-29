import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { enter, leave, toggle } from '..';

describe('transition', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);

    // Mock rAF to resolve synchronously
    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(performance.now());
      return 0;
    });

    // Mock getAnimations so afterTransition resolves immediately
    Object.defineProperty(element, 'getAnimations', { value: () => [], configurable: true });
  });

  afterEach(() => {
    document.body.removeChild(element);
    vi.restoreAllMocks();
  });

  describe(enter.name, () => {
    it('should remove the hidden class from the element', async () => {
      element.classList.add('hidden');

      await enter(element);

      expect(element.classList.contains('hidden')).toBe(false);
    });

    it('should apply and then clean up enter transition classes', async () => {
      await enter(element, 'fade');

      // Genesis and end classes are removed after transition; only base state remains
      expect(element.classList.contains('fade-enter')).toBe(false);
      expect(element.classList.contains('fade-enter-start')).toBe(false);
      expect(element.classList.contains('fade-enter-end')).toBe(false);
    });

    it('should use dataset transition classes when provided', async () => {
      element.dataset['transitionEnter'] = 'custom-enter';
      element.dataset['transitionEnterStart'] = 'custom-enter-start';
      element.dataset['transitionEnterEnd'] = 'custom-enter-end';

      await enter(element);

      expect(element.classList.contains('custom-enter')).toBe(false);
      expect(element.classList.contains('custom-enter-start')).toBe(false);
      expect(element.classList.contains('custom-enter-end')).toBe(false);
    });
  });

  describe(leave.name, () => {
    it('should add the hidden class to the element after transition', async () => {
      await leave(element);

      expect(element.classList.contains('hidden')).toBe(true);
    });

    it('should apply and then clean up leave transition classes', async () => {
      await leave(element, 'fade');

      expect(element.classList.contains('fade-leave')).toBe(false);
      expect(element.classList.contains('fade-leave-start')).toBe(false);
      expect(element.classList.contains('fade-leave-end')).toBe(false);
    });
  });

  describe(toggle.name, () => {
    it('should enter (remove hidden) when the element is hidden', async () => {
      element.classList.add('hidden');

      await toggle(element);

      expect(element.classList.contains('hidden')).toBe(false);
    });

    it('should leave (add hidden) when the element is visible', async () => {
      await toggle(element);

      expect(element.classList.contains('hidden')).toBe(true);
    });
  });
});

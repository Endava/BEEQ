import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  configureScrollLock,
  forceUnlockAllBodyScroll,
  getScrollLockCount,
  isBodyScrollLocked,
  lockBodyScroll,
  unlockBodyScroll,
} from '..';

describe('scrollLock', () => {
  beforeEach(() => {
    // Reset state between tests by force-unlocking
    forceUnlockAllBodyScroll();
    // Reset to default config
    configureScrollLock({ debug: false, bodyClassName: 'bq-body--scroll-lock' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe(lockBodyScroll.name, () => {
    it('should add the scroll-lock class to body on first lock', () => {
      lockBodyScroll();

      expect(document.body.classList.contains('bq-body--scroll-lock')).toBe(true);
    });

    it('should increment lock count on each call', () => {
      lockBodyScroll();
      lockBodyScroll();

      expect(getScrollLockCount()).toBe(2);
    });

    it('should not add the class again on subsequent locks', () => {
      lockBodyScroll();
      lockBodyScroll();

      expect(document.body.classList.contains('bq-body--scroll-lock')).toBe(true);
      expect(getScrollLockCount()).toBe(2);
    });
  });

  describe(unlockBodyScroll.name, () => {
    it('should remove the scroll-lock class when count reaches 0', () => {
      lockBodyScroll();
      unlockBodyScroll();

      expect(document.body.classList.contains('bq-body--scroll-lock')).toBe(false);
      expect(getScrollLockCount()).toBe(0);
    });

    it('should not remove the class until all locks are released', () => {
      lockBodyScroll();
      lockBodyScroll();
      unlockBodyScroll();

      expect(document.body.classList.contains('bq-body--scroll-lock')).toBe(true);
      expect(getScrollLockCount()).toBe(1);
    });

    it('should be safe to call when not locked', () => {
      expect(() => unlockBodyScroll()).not.toThrow();
      expect(getScrollLockCount()).toBe(0);
    });
  });

  describe(forceUnlockAllBodyScroll.name, () => {
    it('should reset count to 0 and remove the class regardless of lock count', () => {
      lockBodyScroll();
      lockBodyScroll();
      lockBodyScroll();
      forceUnlockAllBodyScroll();

      expect(getScrollLockCount()).toBe(0);
      expect(document.body.classList.contains('bq-body--scroll-lock')).toBe(false);
    });

    it('should be safe to call when not locked', () => {
      expect(() => forceUnlockAllBodyScroll()).not.toThrow();
    });
  });

  describe(isBodyScrollLocked.name, () => {
    it('should return false when not locked', () => {
      expect(isBodyScrollLocked()).toBe(false);
    });

    it('should return true when locked', () => {
      lockBodyScroll();

      expect(isBodyScrollLocked()).toBe(true);
    });
  });

  describe(configureScrollLock.name, () => {
    it('should apply a custom body class name', () => {
      configureScrollLock({ bodyClassName: 'custom-lock-class' });
      lockBodyScroll();

      expect(document.body.classList.contains('custom-lock-class')).toBe(true);
    });

    it('should log debug messages when debug is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      configureScrollLock({ debug: true });
      lockBodyScroll();

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('[BEEQ ScrollLock]'));
    });
  });

  describe('non-client environment (SSR)', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should not lock body scroll when window is undefined', () => {
      vi.stubGlobal('window', undefined);
      lockBodyScroll();

      expect(getScrollLockCount()).toBe(0);
    });

    it('should not unlock body scroll when window is undefined', () => {
      vi.unstubAllGlobals();
      lockBodyScroll();
      vi.stubGlobal('window', undefined);
      unlockBodyScroll();

      expect(getScrollLockCount()).toBe(1);
      vi.unstubAllGlobals();
      forceUnlockAllBodyScroll();
    });

    it('should not force-unlock body scroll when window is undefined', () => {
      vi.unstubAllGlobals();
      lockBodyScroll();
      vi.stubGlobal('window', undefined);
      forceUnlockAllBodyScroll();

      expect(getScrollLockCount()).toBe(1);
      vi.unstubAllGlobals();
      forceUnlockAllBodyScroll();
    });
  });
});

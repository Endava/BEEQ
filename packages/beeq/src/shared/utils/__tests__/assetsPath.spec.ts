import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getBasePath, setBasePath } from '..';

describe('assetsPath', () => {
  beforeEach(() => {
    // Reset beeqBasePath before each test by setting it to undefined via setBasePath
    // We force-clear it by setting an empty string then relying on test-specific setups
    setBasePath('');
  });

  afterEach(() => {
    // Remove any script tags added during tests
    document.querySelectorAll('script[data-beeq], script[src*="beeq"]').forEach((el) => {
      el.remove();
    });
    vi.restoreAllMocks();
  });

  describe(setBasePath.name, () => {
    it('should set the base path', () => {
      setBasePath('/assets');

      expect(getBasePath()).toBe('/assets');
    });
  });

  describe(getBasePath.name, () => {
    it('should return the base path without a trailing slash', () => {
      setBasePath('/assets/');

      expect(getBasePath()).toBe('/assets');
    });

    it('should append a subpath separated by a slash', () => {
      setBasePath('/assets');

      expect(getBasePath('icons')).toBe('/assets/icons');
    });

    it('should handle a subpath that already starts with a slash', () => {
      setBasePath('/assets');

      expect(getBasePath('/icons')).toBe('/assets/icons');
    });

    it('should resolve base path from a script with data-beeq attribute', () => {
      setBasePath('');
      const script = document.createElement('script');
      script.setAttribute('data-beeq', '/cdn/assets');
      document.head.appendChild(script);

      expect(getBasePath()).toBe('/cdn/assets');
    });

    it('should fall back to a beeq script src path when no data-beeq script is present', () => {
      setBasePath('');
      const script = document.createElement('script');
      script.setAttribute('src', '/lib/beeq/beeq.esm.js');
      document.head.appendChild(script);

      expect(getBasePath()).toBe('/lib/beeq/svg');
    });

    it('should return an empty string when no script is found and base path is not set', () => {
      setBasePath('');

      expect(getBasePath()).toBe('');
    });

    it('should return empty string for a beeq script with no src attribute', () => {
      setBasePath('');
      const script = document.createElement('script');
      // Append without setting src — getScriptPath should return ''
      script.setAttribute('src', '');
      document.head.appendChild(script);

      // No data-beeq and no matching beeq src, so falls back to empty string
      expect(getBasePath()).toBe('');
    });
  });

  describe('non-client environment (SSR)', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should not resolve config script path when window is undefined', () => {
      vi.stubGlobal('window', undefined);

      // setBasePath is set to '' in beforeEach; getBasePath will try findConfigScript
      // which returns null when !isClient() — so fallback path is also empty
      expect(getBasePath()).toBe('');
    });
  });
});

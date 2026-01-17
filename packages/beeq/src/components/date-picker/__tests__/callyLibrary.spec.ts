type CallyLibraryModule = typeof import('../libs/callyLibrary');

type MockScriptElement = {
  type: string;
  src: string;
  onload: ((ev: Event) => void) | null;
  onerror: ((ev: Event) => void) | null;
  setAttribute: jest.Mock;
};

describe('callyLibrary', () => {
  let mockScript: MockScriptElement;
  let appendChildSpy: jest.SpyInstance;
  let querySelectorSpy: jest.SpyInstance;
  let createElementSpy: jest.SpyInstance;

  // We need dynamic imports here because jest.resetModules() doesn't reset already-imported modules
  let loadCallyLibrary: CallyLibraryModule['loadCallyLibrary'];
  let isCallyLibraryLoaded: CallyLibraryModule['isCallyLibraryLoaded'];

  beforeEach(async () => {
    // Reset module state between tests
    jest.resetModules();

    // Create a mock script element
    mockScript = {
      type: '',
      src: '',
      onload: null,
      onerror: null,
      setAttribute: jest.fn(),
    };

    // Mock document.createElement
    createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockReturnValue(mockScript as unknown as HTMLScriptElement);

    // Mock document.head.appendChild
    appendChildSpy = jest.spyOn(document.head, 'appendChild').mockImplementation((node) => node);

    // Mock document.querySelector - default to no script found
    querySelectorSpy = jest.spyOn(document, 'querySelector').mockReturnValue(null);

    // Dynamically import the module AFTER mocks are set up
    const module = await import('../libs/callyLibrary');
    loadCallyLibrary = module.loadCallyLibrary;
    isCallyLibraryLoaded = module.isCallyLibraryLoaded;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isCallyLibraryLoaded', () => {
    it('should return false when library is not loaded', () => {
      querySelectorSpy.mockReturnValue(null);
      expect(isCallyLibraryLoaded()).toBe(false);
    });

    it('should return true when script tag exists in DOM', () => {
      querySelectorSpy.mockReturnValue(document.createElement('script'));
      expect(isCallyLibraryLoaded()).toBe(true);
    });

    it('should return true from isCallyLibraryLoaded after successful load', async () => {
      const loadPromise = loadCallyLibrary();
      mockScript.onload?.(new Event('load'));
      await loadPromise;

      expect(isCallyLibraryLoaded()).toBe(true);
    });
  });

  describe('loadCallyLibrary', () => {
    it('should create and append a script element', async () => {
      const loadPromise = loadCallyLibrary();

      // Simulate successful script load
      mockScript.onload?.(new Event('load'));
      await loadPromise;

      expect(createElementSpy).toHaveBeenCalledWith('script');
      expect(appendChildSpy).toHaveBeenCalledTimes(1);
      expect(mockScript.type).toBe('module');
      expect(mockScript.src).toContain('unpkg.com/cally');
    });

    it('should set correct script attributes', async () => {
      const loadPromise = loadCallyLibrary();
      mockScript.onload?.(new Event('load'));
      await loadPromise;

      expect(mockScript.setAttribute).toHaveBeenCalledWith('data-cally-library', '');
      expect(mockScript.setAttribute).toHaveBeenCalledWith('crossOrigin', 'anonymous');
      expect(mockScript.setAttribute).toHaveBeenCalledWith('integrity', expect.any(String));
    });

    it('should not load script if already loaded', async () => {
      // First load
      const firstLoad = loadCallyLibrary();
      mockScript.onload?.(new Event('load'));
      await firstLoad;

      // Reset spy counts
      createElementSpy.mockClear();
      appendChildSpy.mockClear();

      // Second load should return immediately
      await loadCallyLibrary();

      expect(createElementSpy).not.toHaveBeenCalled();
      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    it('should not load script if it already exists in DOM', async () => {
      querySelectorSpy.mockReturnValue(document.createElement('script'));

      await loadCallyLibrary();

      expect(appendChildSpy).not.toHaveBeenCalled();
    });

    it('should throw error when script fails to load', async () => {
      const loadPromise = loadCallyLibrary();

      // Simulate script load failure
      mockScript.onerror?.(new Event('error'));

      await expect(loadPromise).rejects.toThrow('Failed to load the cally library');
    });

    it('should allow retry after failed load', async () => {
      // First attempt - fails
      const firstLoad = loadCallyLibrary();
      mockScript.onerror?.(new Event('error'));
      await expect(firstLoad).rejects.toThrow();

      // Reset mocks for second attempt
      createElementSpy.mockClear();
      appendChildSpy.mockClear();

      // Second attempt - should try again
      const secondLoad = loadCallyLibrary();
      mockScript.onload?.(new Event('load'));
      await secondLoad;

      expect(appendChildSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('race condition prevention', () => {
    it('should only append one script when called concurrently', async () => {
      // Simulate two date pickers calling loadCallyLibrary simultaneously
      const promise1 = loadCallyLibrary();
      const promise2 = loadCallyLibrary();
      const promise3 = loadCallyLibrary();

      // All should be waiting for the same load operation
      mockScript.onload?.(new Event('load'));

      await Promise.all([promise1, promise2, promise3]);

      // Script should only be appended once
      expect(appendChildSpy).toHaveBeenCalledTimes(1);
      expect(createElementSpy).toHaveBeenCalledTimes(1);
    });

    it('should reuse the loading promise for concurrent calls', async () => {
      let resolveCount = 0;

      const promise1 = loadCallyLibrary().then(() => {
        resolveCount++;
      });
      const promise2 = loadCallyLibrary().then(() => {
        resolveCount++;
      });

      // Both are waiting, script only created once
      expect(createElementSpy).toHaveBeenCalledTimes(1);

      // Resolve the load
      mockScript.onload?.(new Event('load'));

      await Promise.all([promise1, promise2]);

      // Both resolved
      expect(resolveCount).toBe(2);
      // But only one script was ever created
      expect(appendChildSpy).toHaveBeenCalledTimes(1);
    });

    it('should resolve all concurrent promises when load succeeds', async () => {
      const results: boolean[] = [];

      const promise1 = loadCallyLibrary().then(() => {
        results.push(true);
      });
      const promise2 = loadCallyLibrary().then(() => {
        results.push(true);
      });
      const promise3 = loadCallyLibrary().then(() => {
        results.push(true);
      });

      mockScript.onload?.(new Event('load'));

      await Promise.all([promise1, promise2, promise3]);

      expect(results).toEqual([true, true, true]);
    });

    it('should return the same promise instance for concurrent calls', async () => {
      const promise1 = loadCallyLibrary();
      const promise2 = loadCallyLibrary();

      // Verify they're the same promise reference
      expect(promise1).toBe(promise2);

      mockScript.onload?.(new Event('load'));
      await Promise.all([promise1, promise2]);
    });

    it('should reject all concurrent promises when load fails', async () => {
      const errors: Error[] = [];

      const promise1 = loadCallyLibrary().catch((e) => errors.push(e));
      const promise2 = loadCallyLibrary().catch((e) => errors.push(e));
      const promise3 = loadCallyLibrary().catch((e) => errors.push(e));

      mockScript.onerror?.(new Event('error'));

      await Promise.all([promise1, promise2, promise3]);

      expect(errors.length).toBe(3);
      errors.forEach((error) => {
        expect(error.message).toContain('Failed to load the cally library');
      });
    });

    it('should handle interleaved success and new calls correctly', async () => {
      // First batch of concurrent calls
      const promise1 = loadCallyLibrary();
      const promise2 = loadCallyLibrary();

      mockScript.onload?.(new Event('load'));
      await Promise.all([promise1, promise2]);

      // Reset spy counts
      appendChildSpy.mockClear();

      // New call after successful load should not create new script
      await loadCallyLibrary();

      expect(appendChildSpy).not.toHaveBeenCalled();
    });
  });
});

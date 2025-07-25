import { waitForSvgLoad } from '../waitForSvgLoad';

interface MockHTMLBqIconElement {
  name?: string;
  size?: string | number;
  shadowRoot?: {
    querySelector: jest.Mock;
  };
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  [key: string]: any;
}

const createMockElement = (
  options: {
    hasSvg?: boolean;
    svgContent?: string;
    shadowRoot?: boolean;
  } = {},
): MockHTMLBqIconElement => {
  const { hasSvg = false, svgContent = '<path>test</path>', shadowRoot = true } = options;

  const mockSvgElement = hasSvg
    ? {
        innerHTML: svgContent,
      }
    : null;

  const mockShadowRoot = shadowRoot
    ? {
        querySelector: jest.fn().mockImplementation((selector: string) => {
          if (selector === '[part="svg"]') {
            return mockSvgElement;
          }
          return null;
        }),
      }
    : null;

  return {
    shadowRoot: mockShadowRoot,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };
};

describe('waitForSvgLoad', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should resolve immediately when SVG is already loaded', async () => {
    const mockElement = createMockElement({ hasSvg: true });

    const promise = waitForSvgLoad(mockElement as any);

    jest.advanceTimersByTime(100);

    await expect(promise).resolves.toBeUndefined();
    expect(mockElement.addEventListener).not.toHaveBeenCalled();
  });

  it('should wait for svgLoaded event when SVG is not loaded', async () => {
    const mockElement = createMockElement({ hasSvg: false });
    let svgLoadedCallback: () => void;

    mockElement.addEventListener.mockImplementation((event: string, callback: () => void) => {
      if (event === 'svgLoaded') {
        svgLoadedCallback = callback;
      }
    });

    const promise = waitForSvgLoad(mockElement as any);

    // Simulate SVG loading
    setTimeout(() => {
      svgLoadedCallback();
    }, 100);

    jest.advanceTimersByTime(200);

    await expect(promise).resolves.toBeUndefined();
    expect(mockElement.addEventListener).toHaveBeenCalledWith('svgLoaded', expect.any(Function));
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('svgLoaded', expect.any(Function));
  });

  it('should set properties on the element when provided', async () => {
    const mockElement = createMockElement({ hasSvg: true });
    const properties = { name: 'check', size: 24 };

    await waitForSvgLoad(mockElement as any, { properties });

    expect(mockElement.name).toBe('check');
    expect(mockElement.size).toBe(24);
  });

  it('should use custom timeout when provided', async () => {
    const mockElement = createMockElement({ hasSvg: false });
    const customTimeout = 5000;

    const promise = waitForSvgLoad(mockElement as any, { timeout: customTimeout });

    jest.advanceTimersByTime(customTimeout);

    await expect(promise).rejects.toThrow(`SVG did not load within ${customTimeout}ms`);
  });

  it('should reject when timeout is reached', async () => {
    const mockElement = createMockElement({ hasSvg: false });

    const promise = waitForSvgLoad(mockElement as any);

    jest.advanceTimersByTime(15000); // Default timeout

    await expect(promise).rejects.toThrow('SVG did not load within 15000ms');
    expect(mockElement.removeEventListener).toHaveBeenCalled();
  });

  it('should handle element without shadow root', async () => {
    const mockElement = createMockElement({ shadowRoot: false });

    const promise = waitForSvgLoad(mockElement as any);

    jest.advanceTimersByTime(15000);

    await expect(promise).rejects.toThrow('SVG did not load within 15000ms');
  });

  it('should handle SVG element with empty content', async () => {
    const mockElement = createMockElement({ hasSvg: true, svgContent: '' });
    let svgLoadedCallback: () => void;

    mockElement.addEventListener.mockImplementation((event: string, callback: () => void) => {
      if (event === 'svgLoaded') {
        svgLoadedCallback = callback;
      }
    });

    const promise = waitForSvgLoad(mockElement as any);

    // Simulate SVG loading with content
    setTimeout(() => {
      mockElement.shadowRoot.querySelector.mockImplementation((selector: string) => {
        if (selector === '[part="svg"]') {
          return { innerHTML: '<path>loaded</path>' };
        }
        return null;
      });
      svgLoadedCallback();
    }, 100);

    jest.advanceTimersByTime(200);

    await expect(promise).resolves.toBeUndefined();
  });

  it('should not resolve multiple times', async () => {
    const mockElement = createMockElement({ hasSvg: false });
    let svgLoadedCallback: () => void;

    mockElement.addEventListener.mockImplementation((event: string, callback: () => void) => {
      if (event === 'svgLoaded') {
        svgLoadedCallback = callback;
      }
    });

    const promise = waitForSvgLoad(mockElement as any);

    // Simulate multiple event calls
    setTimeout(() => {
      svgLoadedCallback();
      svgLoadedCallback(); // Second call should be ignored
    }, 100);

    jest.advanceTimersByTime(200);

    await expect(promise).resolves.toBeUndefined();
    expect(mockElement.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('should clean up event listeners on timeout', async () => {
    const mockElement = createMockElement({ hasSvg: false });

    const promise = waitForSvgLoad(mockElement as any, { timeout: 1000 });

    jest.advanceTimersByTime(1000);

    await expect(promise).rejects.toThrow();
    expect(mockElement.removeEventListener).toHaveBeenCalledWith('svgLoaded', expect.any(Function));
  });

  it('should handle changing properties that trigger new SVG load', async () => {
    const mockElement = createMockElement({ hasSvg: false });
    let svgLoadedCallback: () => void;

    mockElement.addEventListener.mockImplementation((event: string, callback: () => void) => {
      if (event === 'svgLoaded') {
        svgLoadedCallback = callback;
      }
    });

    const promise = waitForSvgLoad(mockElement as any, {
      properties: { name: 'new-icon' },
    });

    // Simulate property change triggering SVG load
    setTimeout(() => {
      // Update mock to show SVG is now loaded
      mockElement.shadowRoot.querySelector.mockImplementation((selector: string) => {
        if (selector === '[part="svg"]') {
          return { innerHTML: '<path>new-icon-content</path>' };
        }
        return null;
      });
      svgLoadedCallback();
    }, 100);

    jest.advanceTimersByTime(200);

    await expect(promise).resolves.toBeUndefined();
    expect(mockElement.name).toBe('new-icon');
  });

  it('should handle rapid consecutive calls', async () => {
    const mockElement = createMockElement({ hasSvg: true });

    const promises = [
      waitForSvgLoad(mockElement as any),
      waitForSvgLoad(mockElement as any),
      waitForSvgLoad(mockElement as any),
    ];

    jest.advanceTimersByTime(100);

    await expect(Promise.all(promises)).resolves.toEqual([undefined, undefined, undefined]);
  });
});

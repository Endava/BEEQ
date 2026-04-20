import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-card', () => {
  it('should render', async () => {
    const { root } = await render(<bq-card />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-card />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render default type', async () => {
    const { root } = await render(<bq-card type="default" />);

    await waitForStable(root);

    const styleProps = ['padding'] as const;
    const defaultStyle = computedStyle('bq-card[type="default"] >>> [part="wrapper"]', styleProps);

    expect(defaultStyle).toEqual({ padding: '24px' });
  });

  it('should render minimal type', async () => {
    const { root } = await render(<bq-card type="minimal" />);

    await waitForStable(root);

    const styleProps = ['padding'] as const;
    const minimalStyle = computedStyle('bq-card[type="minimal"] >>> [part="wrapper"]', styleProps);

    expect(minimalStyle).toEqual({ padding: '0px' });
  });

  it('should apply the selected border radius as an inline CSS variable', async () => {
    const { root } = await render(<bq-card border="full" />);

    expect(root.style.getPropertyValue('--bq-card--borderRadius')).toBe('var(--bq-radius--full)');
  });

  it('should handle invalid type values', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(<bq-card type="minimal" />);

    root.type = 'invalid' as HTMLBqCardElement['type'];

    await waitForChanges();

    expect(root.type).toBe('default');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('[BQ-CARD] Please notice that "type" should be one of default|minimal');
  });
});

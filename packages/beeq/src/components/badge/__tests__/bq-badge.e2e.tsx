import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-badge', () => {
  it('should render', async () => {
    const { root } = await render(<bq-badge />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-badge />);

    expect(root).toHaveShadowRoot();
  });

  it('should have small size', async () => {
    const { root } = await render(<bq-badge />);

    await waitForStable(root);

    const badge = root.shadowRoot.querySelector('.bq-badge') as HTMLDivElement;
    const style = computedStyle('bq-badge >>> .bq-badge', ['height', 'width']);

    expect(badge).toHaveClass('size--small');
    expect(style).toEqual({ height: '8px', width: '8px' });
  });

  it('should have medium size', async () => {
    const { root } = await render(<bq-badge size="medium" />);

    await waitForStable(root);

    const badge = root.shadowRoot.querySelector('.bq-badge') as HTMLDivElement;
    const style = computedStyle('bq-badge >>> .bq-badge', ['height', 'width']);

    expect(badge).toHaveClass('size--medium');
    expect(style).toEqual({ height: '12px', width: '12px' });
  });

  it('should render a number', async () => {
    const { root } = await render(<bq-badge>2</bq-badge>);

    await waitForStable(root);

    const badge = root.shadowRoot.querySelector('.bq-badge') as HTMLDivElement;
    const numberSlot = badge.querySelector('slot') as HTMLSlotElement;

    expect(badge).toHaveClass('digit');
    expect(getTextContent(numberSlot, { recurse: true })).toBe('2');
    expect(badge).not.toHaveClass('is-multiple');
  });

  it('should apply inline CSS variables from color props', async () => {
    const { root } = await render(<bq-badge background-color="ui--success" text-color="text--inverse" />);

    await waitForStable(root);

    expect(root.style.getPropertyValue('--bq-badge--background-color')).toBe('var(--bq-ui--success)');
    expect(root.style.getPropertyValue('--bq-badge--text-color')).toBe('var(--bq-text--inverse)');
  });

  it('should handle invalid size values', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-badge size="medium" />);
    const badge = root as HTMLBqBadgeElement;

    await setProps({ size: 'invalid' as HTMLBqBadgeElement['size'] });

    expect(badge.size).toBe('small');
    expect(badge).toEqualAttribute('size', 'small');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith('[BQ-BADGE] Please notice that "size" should be one of small|medium');
  });

  it('should apply extra padding for multi-character content', async () => {
    const { root } = await render(<bq-badge>12</bq-badge>);

    await waitForStable(root);

    const badge = root.shadowRoot.querySelector('.bq-badge') as HTMLDivElement;
    const numberSlot = badge.querySelector('slot') as HTMLSlotElement;

    expect(getTextContent(numberSlot, { recurse: true })).toBe('12');
    expect(badge).toHaveClass('digit');
    expect(badge).toHaveClass('is-multiple');
  });
});

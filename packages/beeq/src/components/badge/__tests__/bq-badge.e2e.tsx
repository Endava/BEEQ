import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

describe('bq-badge', () => {
  it('should render', async () => {
    const { root } = await render(<bq-badge />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-badge />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should have small size', async () => {
    const { root } = await render(<bq-badge />);

    await waitForStable(root);

    const badge = root.shadowRoot.querySelector('.bq-badge') as HTMLDivElement;
    const style = computedStyle('bq-badge >>> .bq-badge', ['height', 'width']);

    expect(badge.classList.contains('size--small')).toBe(true);
    expect(style).toEqual({ height: '8px', width: '8px' });
  });

  it('should have medium size', async () => {
    const { root } = await render(<bq-badge size="medium" />);

    await waitForStable(root);

    const badge = root.shadowRoot.querySelector('.bq-badge') as HTMLDivElement;
    const style = computedStyle('bq-badge >>> .bq-badge', ['height', 'width']);

    expect(badge.classList.contains('size--medium')).toBe(true);
    expect(style).toEqual({ height: '12px', width: '12px' });
  });

  it('should render a number', async () => {
    const { root } = await render(<bq-badge>2</bq-badge>);

    await waitForStable(root);

    const badge = root.shadowRoot.querySelector('.bq-badge') as HTMLDivElement;
    const number = badge.querySelector('span');

    expect(badge.classList.contains('digit')).toBe(true);
    expect(number).not.toBeNull();
  });
});

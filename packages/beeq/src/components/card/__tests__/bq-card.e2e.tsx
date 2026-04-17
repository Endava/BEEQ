import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

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
});

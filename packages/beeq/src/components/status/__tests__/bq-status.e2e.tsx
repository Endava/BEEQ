import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { STATUS_TYPE } from '../bq-status.types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-status', () => {
  it('should render', async () => {
    const { root } = await render(h('bq-status', null, 'Neutral status'));

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(h('bq-status', null, 'Neutral status'));

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display status text', async () => {
    const { root } = await render(h('bq-status', null, 'Neutral status'));

    expect(root.textContent?.trim()).toBe('Neutral status');
  });

  it('should handle status type', async () => {
    const { root, waitForChanges } = await render(h('bq-status', null, 'Neutral status'));

    root.type = 'danger';
    await waitForChanges();

    expect(root.type).toBe('danger');
    expect(root.shadowRoot?.querySelector('[part="circle"]')).toHaveClass('danger');
  });

  it('should handle invalid status type', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(h('bq-status', null, 'Neutral status'));

    root.type = 'invalid-status' as HTMLBqStatusElement['type'];
    await waitForChanges();

    expect(root.type).toBe('neutral');
    expect(root.shadowRoot?.querySelector('[part="circle"]')).toHaveClass('neutral');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      `[BQ-STATUS] Please notice that "type" should be one of ${STATUS_TYPE.join('|')}`,
    );
  });

  it('should respect design height', async () => {
    await render(h('bq-status', null, 'Neutral status'));

    const style = computedStyle('bq-status >>> [part="base"]', ['height']);

    expect(style.height).toBe('20px');
  });

  it('should have status as circle', async () => {
    await render(h('bq-status', null, 'Neutral status'));

    const style = computedStyle('bq-status >>> [part="circle"]', ['borderRadius']);

    expect(style.borderRadius).toBe('9999px');
  });

  it('should respect design space between status and text', async () => {
    await render(h('bq-status', null, 'Neutral status'));

    const style = computedStyle('bq-status >>> [part="base"]', ['gap']);

    expect(style).toEqual({ gap: '8px' });
  });
});

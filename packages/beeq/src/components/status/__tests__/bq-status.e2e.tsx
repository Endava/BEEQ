import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { STATUS_TYPE } from '../bq-status.types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-status', () => {
  it('should render', async () => {
    const { root } = await render(<bq-status>Neutral status</bq-status>);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-status>Neutral status</bq-status>);

    expect(root).toHaveShadowRoot();
  });

  it('should display status text', async () => {
    const { root } = await render(<bq-status>Neutral status</bq-status>);

    expect(root.textContent?.trim()).toBe('Neutral status');
  });

  it('should handle status type', async () => {
    const { root, setProps } = await render(<bq-status>Neutral status</bq-status>);
    const status = root as HTMLBqStatusElement;

    await setProps({ type: 'danger' });

    expect(status.type).toBe('danger');
    expect(status.shadowRoot?.querySelector('[part="circle"]')).toHaveClass('danger');
  });

  it('should handle invalid status type', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-status>Neutral status</bq-status>);
    const status = root as HTMLBqStatusElement;

    await setProps({ type: 'invalid-status' as HTMLBqStatusElement['type'] });

    expect(status.type).toBe('neutral');
    expect(status.shadowRoot?.querySelector('[part="circle"]')).toHaveClass('neutral');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      `[BQ-STATUS] Please notice that "type" should be one of ${STATUS_TYPE.join('|')}`,
    );
  });

  it('should respect design height', async () => {
    await render(<bq-status>Neutral status</bq-status>);

    const style = computedStyle('bq-status >>> [part="base"]', ['height']);

    expect(style.height).toBe('20px');
  });

  it('should have status as circle', async () => {
    await render(<bq-status>Neutral status</bq-status>);

    const style = computedStyle('bq-status >>> [part="circle"]', ['borderRadius']);

    expect(style.borderRadius).toBe('9999px');
  });

  it('should respect design space between status and text', async () => {
    await render(<bq-status>Neutral status</bq-status>);

    const style = computedStyle('bq-status >>> [part="base"]', ['gap']);

    expect(style).toEqual({ gap: '8px' });
  });

  it('should expose role status for assistive technology', async () => {
    const { root } = await render(<bq-status>Neutral status</bq-status>);

    expect(root.shadowRoot?.querySelector('[part="base"]')).toEqualAttribute('role', 'status');
  });

  it('should apply classes for the supported status types', async () => {
    const { root, setProps } = await render(<bq-status>Neutral status</bq-status>);
    const status = root as HTMLBqStatusElement;

    const circle = status.shadowRoot?.querySelector('[part="circle"]');

    await setProps({ type: 'alert' });
    expect(circle).toHaveClass('alert');

    await setProps({ type: 'info' });
    expect(circle).toHaveClass('info');

    await setProps({ type: 'success' });
    expect(circle).toHaveClass('success');
  });
});

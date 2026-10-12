import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { STATUS_TYPE } from '../bq-status.types';

/** Resolves a CSS color value (e.g. `var(--bq-icon--info)`) to its computed `rgb()` form */
const resolveColor = (value: string): string => {
  const probe = document.createElement('div');
  probe.style.color = value;
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};

const getDot = (el: HTMLBqStatusElement) =>
  el.shadowRoot
    ?.querySelector<HTMLBqBadgeElement>('[part="circle"]')
    ?.shadowRoot?.querySelector<HTMLElement>('[part="base"]');

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

  it('should map the status colors to the icon and text role tokens', async () => {
    const { root } = await render(<bq-status>Neutral status</bq-status>);

    const hostStyle = getComputedStyle(root);
    const roles = {
      alert: 'warning',
      danger: 'danger',
      info: 'info',
      neutral: 'secondary',
      success: 'success',
    };

    Object.entries(roles).forEach(([type, role]) => {
      expect(hostStyle.getPropertyValue(`--bq-status--dot-color-${type}`).trim()).toBe(
        hostStyle.getPropertyValue(`--bq-icon--${role}`).trim(),
      );
    });
    expect(hostStyle.getPropertyValue('--bq-status--text-color').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--primary').trim(),
    );
    expect(computedStyle('bq-status >>> [part="text"]', ['color']).color).toBe(resolveColor('var(--bq-text--primary)'));
  });

  it('should paint the circle with the icon role token of each type', async () => {
    const { root, setProps } = await render(<bq-status>Neutral status</bq-status>);
    const status = root as HTMLBqStatusElement;
    const roles = {
      alert: 'warning',
      danger: 'danger',
      info: 'info',
      neutral: 'secondary',
      success: 'success',
    } as const;

    for (const [type, role] of Object.entries(roles)) {
      await setProps({ type: type as HTMLBqStatusElement['type'] });
      await waitForStable(root);

      expect(getComputedStyle(getDot(status)).backgroundColor).toBe(resolveColor(`var(--bq-icon--${role})`));
    }
  });

  it('should not use the brand color for the info circle', async () => {
    const { root } = await render(<bq-status type="info">Info status</bq-status>);

    await waitForStable(root);

    const { backgroundColor } = getComputedStyle(getDot(root as HTMLBqStatusElement));

    expect(backgroundColor).toBe(resolveColor('var(--bq-icon--info)'));
    expect(backgroundColor).not.toBe(resolveColor('var(--bq-ui--brand)'));
  });
});

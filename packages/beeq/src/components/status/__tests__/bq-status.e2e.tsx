import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
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
    expect(status).toEqualAttribute('type', 'danger');
  });

  it('should handle invalid status type', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-status>Neutral status</bq-status>);
    const status = root as HTMLBqStatusElement;

    await setProps({ type: 'invalid-status' as HTMLBqStatusElement['type'] });

    expect(status.type).toBe('neutral');
    expect(status).toEqualAttribute('type', 'neutral');
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

  it('should reflect the supported status types on the host', async () => {
    const { root, setProps } = await render(<bq-status>Neutral status</bq-status>);
    const status = root as HTMLBqStatusElement;

    await setProps({ type: 'alert' });
    expect(status).toEqualAttribute('type', 'alert');

    await setProps({ type: 'info' });
    expect(status).toEqualAttribute('type', 'info');

    await setProps({ type: 'success' });
    expect(status).toEqualAttribute('type', 'success');
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

  it('should apply the public circle-size variable to the rendered dot', async () => {
    const { root } = await render(<bq-status>Status</bq-status>);
    const status = root as HTMLBqStatusElement;
    status.style.setProperty('--bq-status-circle--size', '18px');
    await expect.poll(() => getComputedStyle(getDot(status)).inlineSize).toBe('18px');
  });

  it('should preserve the legacy circle size and allow the new size to override it', async () => {
    const { root } = await render(<bq-status>Status</bq-status>);
    const status = root as HTMLBqStatusElement;
    root.style.setProperty('--bq-status-circ', '18px');
    await expect.poll(() => getComputedStyle(getDot(status)).inlineSize).toBe('18px');
    root.style.setProperty('--bq-status-circle--size', '22px');
    await expect.poll(() => getComputedStyle(getDot(status)).inlineSize).toBe('22px');
    root.style.removeProperty('--bq-status-circle--size');
    await expect.poll(() => getComputedStyle(getDot(status)).inlineSize).toBe('18px');
  });

  it('should update the circle colour when its type changes', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-status>Status</bq-status>);
    const status = root as HTMLBqStatusElement;
    const scope = status.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    status.style.setProperty('--bq-status--dot-color-danger', '#123456');
    expect(getComputedStyle(getDot(status)).backgroundColor).toBe(
      resolveColorToken('--bq-status--dot-color-neutral', scope),
    );
    await setProps({ type: 'danger' });
    await waitForChanges();
    await waitForStable(status);
    expect(getComputedStyle(getDot(status)).backgroundColor).toBe(
      resolveColorToken('--bq-status--dot-color-danger', scope),
    );
    await setProps({ type: 'neutral' });
    await waitForChanges();
    await waitForStable(status);
    expect(getComputedStyle(getDot(status)).backgroundColor).toBe(
      resolveColorToken('--bq-status--dot-color-neutral', scope),
    );
  });
});

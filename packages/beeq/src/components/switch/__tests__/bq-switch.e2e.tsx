import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getSwitchInput = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector('input.bq-switch--input') as HTMLInputElement;

const getSwitchBase = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector('[part="base"]') as HTMLLabelElement;

describe('bq-switch', () => {
  it('should render', async () => {
    const { root } = await render(h('bq-switch', null));

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(h('bq-switch', null));

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should load checked', async () => {
    const { root } = await render(h('bq-switch', { checked: true }));

    expect(getSwitchInput(root).getAttribute('aria-checked')).toBe('true');
  });

  it('should display label text', async () => {
    const { root } = await render(h('bq-switch', null, 'Toggle me!'));

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('[part="label"] slot') as HTMLSlotElement;
    const assignedElement = slotElement.assignedNodes({ flatten: true })[0];

    expect(assignedElement.textContent?.trim()).toBe('Toggle me!');
  });

  it('should toggle on click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(h('bq-switch', null));

    const bqChange = spyOnEvent('bqChange');

    expect(root.checked).toBe(false);

    await userEvent.click(getSwitchBase(root));
    await waitForChanges();

    expect(root.checked).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should do nothing if disabled', async () => {
    const { root, spyOnEvent } = await render(h('bq-switch', { disabled: true }));

    const bqChange = spyOnEvent('bqChange');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getSwitchInput(root);

    expect(input).toBeDisabled();
    expect(input.getAttribute('aria-disabled')).toBe('true');
    expect(root.checked).toBe(false);
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render inner icon labels', async () => {
    const { root } = await render(h('bq-switch', { innerLabel: 'icon' }, 'Toggle me!'));

    await waitForStable(root);

    const iconElements = root.shadowRoot?.querySelectorAll('bq-icon.bq-switch--control__icon');

    expect(iconElements).toHaveLength(2);
  });

  it('should change the content order', async () => {
    const { root } = await render(h('bq-switch', { reverseOrder: true }, 'Toggle me!'));

    expect(getSwitchBase(root)).toHaveClass('flex-row-reverse');
  });

  it('should expose `vClick`, `vFocus`, and `vBlur` methods', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(h('bq-switch', null, 'Toggle me!'));

    const bqChange = spyOnEvent('bqChange');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');

    await root.vFocus();
    await waitForChanges();
    await root.vClick();
    await waitForChanges();
    await root.vBlur();
    await waitForChanges();

    expect(root.checked).toBe(true);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });
});

import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

const getSwitchInput = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector<HTMLInputElement>('input.bq-switch--input');

const getSwitchBase = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector<HTMLLabelElement>('[part="base"]');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-switch', () => {
  it('should render', async () => {
    const { root } = await render(<bq-switch name="bq-switch" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-switch name="bq-switch" />);

    expect(root).toHaveShadowRoot();
  });

  it('should load checked', async () => {
    const { root } = await render(<bq-switch name="bq-switch" checked />);
    const sw = root as HTMLBqSwitchElement;

    expect(getSwitchInput(sw).getAttribute('aria-checked')).toBe('true');
  });

  it('should display label text', async () => {
    const { root } = await render(<bq-switch name="bq-switch">Toggle me!</bq-switch>);
    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('[part="label"] slot');
    expect(getTextContent(slotElement, { recurse: true })).toBe('Toggle me!');
  });

  it('should toggle on click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-switch name="bq-switch" />);
    const sw = root as HTMLBqSwitchElement;

    const bqChange = spyOnEvent('bqChange');

    expect(sw.checked).toBe(false);

    await userEvent.click(getSwitchBase(sw));
    await waitForChanges();

    expect(sw.checked).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should do nothing if disabled', async () => {
    const { root } = await render(
      <div>
        <bq-switch name="bq-switch-disabled" disabled>
          Disabled
        </bq-switch>
        <bq-switch name="bq-switch-enabled">Enabled</bq-switch>
      </div>,
    );

    const switches = root.querySelectorAll('bq-switch') as NodeListOf<HTMLBqSwitchElement>;
    const disabledSwitch = switches[0];
    const enabledSwitch = switches[1];

    const bqChange = vi.fn();
    const bqFocus = vi.fn();
    const bqBlur = vi.fn();
    disabledSwitch.addEventListener('bqChange', bqChange);
    disabledSwitch.addEventListener('bqFocus', bqFocus);
    disabledSwitch.addEventListener('bqBlur', bqBlur);
    enabledSwitch.addEventListener('bqFocus', bqFocus);

    const input = getSwitchInput(disabledSwitch);

    expect(input).toBeDisabled();
    expect(input.getAttribute('aria-disabled')).toBe('true');

    getSwitchBase(disabledSwitch).click();
    await userEvent.tab();

    expect(disabledSwitch.checked).toBe(false);
    expect(bqChange).toHaveBeenCalledTimes(0);
    expect(bqFocus).toHaveBeenCalledTimes(1);
    expect(bqBlur).toHaveBeenCalledTimes(0);
    expect(
      document.activeElement === enabledSwitch ||
        enabledSwitch.shadowRoot?.activeElement === getSwitchInput(enabledSwitch),
    ).toBe(true);
  });

  it('should render inner icon labels', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" innerLabel="icon">
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    await waitForStable(root);

    const iconElements = sw.shadowRoot?.querySelectorAll('bq-icon.bq-switch--control__icon');

    expect(iconElements).toHaveLength(2);
  });

  it('should change the content order', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" reverseOrder>
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    expect(getSwitchBase(sw)).toHaveClass('flex-row-reverse');
  });

  it('should expose `vClick`, `vFocus`, and `vBlur` methods', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-switch name="bq-switch">Toggle me!</bq-switch>);
    const sw = root as HTMLBqSwitchElement;

    const bqChange = spyOnEvent('bqChange');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');

    await sw.vFocus();
    await waitForChanges();
    await sw.vClick();
    await waitForChanges();
    await sw.vBlur();
    await waitForChanges();

    expect(sw.checked).toBe(true);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should apply hover background and full width classes', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" backgroundOnHover fullWidth>
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    expect(sw).toHaveClass('full-width');
    expect(getSwitchBase(sw)).toHaveClass('has-background');
  });

  it('should apply justifyContent as an inline CSS variable', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" justifyContent="space-between">
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    expect(sw.style.getPropertyValue('--bq-switch--justify-content')).toBe('space-between');
  });

  it('should participate in forms, reset, and required validation', async () => {
    const { waitForChanges } = await render(
      <form>
        <bq-switch formValidationMessage="Please enable this switch" name="terms" required>
          Toggle me!
        </bq-switch>
      </form>,
    );

    const form = document.querySelector('form') as HTMLFormElement;
    const switchElement = form.querySelector('bq-switch') as HTMLBqSwitchElement;

    await waitForStable(switchElement);

    expect(form.checkValidity()).toBe(false);

    await userEvent.click(getSwitchBase(switchElement));
    await waitForChanges();

    const formData = new FormData(form);

    expect(switchElement.checked).toBe(true);
    expect(form.checkValidity()).toBe(true);
    expect(formData.get('terms')).toBe('on');

    form.reset();
    await waitForChanges();

    expect(switchElement.checked).toBe(false);
    expect(form.checkValidity()).toBe(false);
  });
});

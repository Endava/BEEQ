import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

const getSwitchInput = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector('input.bq-switch--input') as HTMLInputElement;

const getSwitchBase = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector('[part="base"]') as HTMLLabelElement;

describe('bq-switch', () => {
  it('should render', async () => {
    const { root } = await render(<bq-switch />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-switch />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should load checked', async () => {
    const { root } = await render(<bq-switch checked />);

    expect(getSwitchInput(root).getAttribute('aria-checked')).toBe('true');
  });

  it('should display label text', async () => {
    const { root } = await render(<bq-switch>Toggle me!</bq-switch>);

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('[part="label"] slot') as HTMLSlotElement;

    expect(getTextContent(slotElement, { recurse: true })).toBe('Toggle me!');
  });

  it('should toggle on click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-switch />);

    const bqChange = spyOnEvent('bqChange');

    expect(root.checked).toBe(false);

    await userEvent.click(getSwitchBase(root));
    await waitForChanges();

    expect(root.checked).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should do nothing if disabled', async () => {
    const { spyOnEvent } = await render(
      <div>
        <bq-switch disabled>Disabled</bq-switch>
        <bq-switch>Enabled</bq-switch>
      </div>,
    );

    const bqChange = spyOnEvent('bqChange');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const switches = document.querySelectorAll('bq-switch') as NodeListOf<HTMLBqSwitchElement>;
    const disabledSwitch = switches[0];
    const enabledSwitch = switches[1];
    const input = getSwitchInput(disabledSwitch);

    expect(input).toBeDisabled();
    expect(input.getAttribute('aria-disabled')).toBe('true');

    getSwitchBase(disabledSwitch).click();
    await userEvent.tab();

    expect(disabledSwitch.checked).toBe(false);
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(
      document.activeElement === enabledSwitch ||
        enabledSwitch.shadowRoot?.activeElement === getSwitchInput(enabledSwitch),
    ).toBe(true);
  });

  it('should render inner icon labels', async () => {
    const { root } = await render(<bq-switch innerLabel="icon">Toggle me!</bq-switch>);

    await waitForStable(root);

    const iconElements = root.shadowRoot?.querySelectorAll('bq-icon.bq-switch--control__icon');

    expect(iconElements).toHaveLength(2);
  });

  it('should change the content order', async () => {
    const { root } = await render(<bq-switch reverseOrder>Toggle me!</bq-switch>);

    expect(getSwitchBase(root)).toHaveClass('flex-row-reverse');
  });

  it('should expose `vClick`, `vFocus`, and `vBlur` methods', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-switch>Toggle me!</bq-switch>);

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

  it('should apply hover background and full width classes', async () => {
    const { root } = await render(
      <bq-switch backgroundOnHover fullWidth>
        Toggle me!
      </bq-switch>,
    );

    expect(root).toHaveClass('full-width');
    expect(getSwitchBase(root)).toHaveClass('has-background');
  });

  it('should apply justifyContent as an inline CSS variable', async () => {
    const { root } = await render(<bq-switch justifyContent="space-between">Toggle me!</bq-switch>);

    expect(root.style.getPropertyValue('--bq-switch--justify-content')).toBe('space-between');
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

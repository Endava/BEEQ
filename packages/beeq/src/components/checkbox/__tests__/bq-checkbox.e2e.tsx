import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const getCheckboxInput = (checkbox: HTMLBqCheckboxElement) =>
  checkbox.shadowRoot?.querySelector('[part="input"]') as HTMLInputElement;

const getCheckboxBase = (checkbox: HTMLBqCheckboxElement) =>
  checkbox.shadowRoot?.querySelector('[part="base"]') as HTMLLabelElement;

const getCheckboxMark = (checkbox: HTMLBqCheckboxElement) =>
  checkbox.shadowRoot?.querySelector('[part="checkbox"]') as HTMLSpanElement;

describe('bq-checkbox', () => {
  it('should render', async () => {
    const { root } = await render(<bq-checkbox />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-checkbox />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const { root } = await render(
      <bq-checkbox>
        <p>Label</p>
      </bq-checkbox>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('slot') as HTMLSlotElement;

    expect(getTextContent(slotElement, { recurse: true })).toBe('Label');
  });

  it('should be keyboard accessible', async () => {
    const { spyOnEvent } = await render(
      <div>
        <bq-checkbox>Checkbox</bq-checkbox>
        <bq-checkbox>Checkbox 1</bq-checkbox>
      </div>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqChange = spyOnEvent('bqChange');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.tab();
    await userEvent.tab();

    const checkboxes = document.querySelectorAll('bq-checkbox') as NodeListOf<HTMLBqCheckboxElement>;
    const secondCheckbox = checkboxes[1];
    const secondCheckboxInput = getCheckboxInput(secondCheckbox);

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(
      document.activeElement === secondCheckbox || secondCheckbox.shadowRoot?.activeElement === secondCheckboxInput,
    ).toBe(true);
  });

  it('should not be checked by default', async () => {
    const { root } = await render(<bq-checkbox>Label</bq-checkbox>);

    await waitForStable(root);

    expect(getCheckboxMark(root).innerHTML).toBe('');
  });

  it('should render check mark', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-checkbox>Label</bq-checkbox>);

    const bqChange = spyOnEvent('bqChange');

    await userEvent.click(getCheckboxBase(root));
    await waitForChanges();

    expect(root.checked).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(getCheckboxMark(root).innerHTML).not.toBe('');
  });

  it('should render indeterminate', async () => {
    const { root } = await render(<bq-checkbox indeterminate>Label</bq-checkbox>);

    await waitForStable(root);

    expect(getCheckboxMark(root).innerHTML).not.toBe('');
  });

  it('should apply the hover background class', async () => {
    const { root } = await render(<bq-checkbox backgroundOnHover>Label</bq-checkbox>);

    expect(getCheckboxBase(root).classList.contains('has-background')).toBe(true);
  });

  it('should set checked to false when indeterminate is enabled', async () => {
    const { root, waitForChanges } = await render(<bq-checkbox checked>Label</bq-checkbox>);

    root.indeterminate = true;
    await waitForChanges();

    expect(root.checked).toBe(false);
    expect(getCheckboxInput(root).indeterminate).toBe(true);
  });

  it('should not allow interaction when disabled', async () => {
    const { spyOnEvent } = await render(
      <div>
        <bq-checkbox disabled>Disabled</bq-checkbox>
        <bq-checkbox>Enabled</bq-checkbox>
      </div>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqChange = spyOnEvent('bqChange');
    const checkboxes = document.querySelectorAll('bq-checkbox') as NodeListOf<HTMLBqCheckboxElement>;
    const disabledCheckbox = checkboxes[0];
    const enabledCheckbox = checkboxes[1];
    const enabledCheckboxInput = getCheckboxInput(enabledCheckbox);

    await userEvent.tab();

    expect(disabledCheckbox.checked).toBeFalsy();
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(
      document.activeElement === enabledCheckbox || enabledCheckbox.shadowRoot?.activeElement === enabledCheckboxInput,
    ).toBe(true);
  });

  it('should participate in forms, reset, and required validation', async () => {
    const { waitForChanges } = await render(
      <form>
        <bq-checkbox formValidationMessage="Please accept the terms" name="terms" required value="accepted">
          Accept terms
        </bq-checkbox>
      </form>,
    );

    const form = document.querySelector('form') as HTMLFormElement;
    const checkbox = form.querySelector('bq-checkbox') as HTMLBqCheckboxElement;

    await waitForStable(checkbox);

    expect(form.checkValidity()).toBe(false);

    await userEvent.click(getCheckboxBase(checkbox));
    await waitForChanges();

    const formData = new FormData(form);

    expect(checkbox.checked).toBe(true);
    expect(form.checkValidity()).toBe(true);
    expect(formData.get('terms')).toBe('on');

    form.reset();
    await waitForChanges();

    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(false);
    expect(form.checkValidity()).toBe(false);
  });

  it('should expose `vClick`, `vFocus`, and `vBlur` methods', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-checkbox>Label</bq-checkbox>);

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

  it('should respect design style', async () => {
    const { root } = await render(<bq-checkbox>Label</bq-checkbox>);

    await waitForStable(root);

    const baseStyle = computedStyle('bq-checkbox >>> [part="base"]', ['height']);
    const checkboxStyle = computedStyle('bq-checkbox >>> [part="checkbox"]', ['borderWidth', 'borderRadius']);

    expect(baseStyle).toEqual({ height: '40px' });
    expect(checkboxStyle).toEqual({ borderWidth: '2px', borderRadius: '4px' });
  });
});

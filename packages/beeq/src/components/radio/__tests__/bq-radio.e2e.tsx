import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

const getInput = (element: HTMLBqRadioElement) => element.shadowRoot?.querySelector<HTMLInputElement>('input');
const getSlot = (element: HTMLBqRadioElement) => element.shadowRoot?.querySelector<HTMLSlotElement>('slot');

describe('bq-radio', () => {
  it('should render', async () => {
    const { root } = await render(<bq-radio />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-radio />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display the slotted label', async () => {
    const { root } = await render(
      <bq-radio>
        <span>Label</span>
      </bq-radio>,
    );

    await waitForStable(root);

    const assignedElement = getSlot(root).assignedElements({ flatten: true })[0];

    expect(assignedElement.textContent?.trim()).toBe('Label');
  });

  it('should handle checked state correctly', async () => {
    const { root, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    const input = getInput(root);

    expect(root).not.toHaveAttribute('checked');
    expect(input.checked).toBe(false);

    bqRadio.checked = true;
    await waitForChanges();

    expect(root).toHaveAttribute('checked');
    expect(input.checked).toBe(true);

    bqRadio.checked = false;
    await waitForChanges();

    expect(root).not.toHaveAttribute('checked');
    expect(input.checked).toBe(false);
  });

  it('should emit bqClick when clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqClick = spyOnEvent('bqClick');
    const bqRadio = root as HTMLBqRadioElement;

    await bqRadio.vClick();
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should apply hover background styles when enabled', async () => {
    const { root } = await render(
      <bq-radio backgroundOnHover name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );

    expect(root.shadowRoot?.querySelector('[part="base"]')).toHaveClass('has-background');
  });

  it('should not emit bqClick when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio disabled name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqClick = spyOnEvent('bqClick');
    const input = getInput(root);

    expect(input).toBeDisabled();

    input.click();
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(0);
  });

  it('should disable the input when forceDisabled is set', async () => {
    const { root } = await render(
      <bq-radio forceDisabled name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );

    expect(getInput(root)).toBeDisabled();
    expect(getInput(root).getAttribute('aria-disabled')).toBe('true');
  });

  it('should emit bqFocus and bqBlur through the native input', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getInput(root);

    input.focus();
    input.blur();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should propagate native input properties', async () => {
    const { root } = await render(
      <bq-radio formId="my-form" name="test-option" required value="test-value">
        Test Label
      </bq-radio>,
    );

    const input = getInput(root);

    expect(input.getAttribute('form')).toBe('my-form');
    expect(input.getAttribute('name')).toBe('test-option');
    expect(input.required).toBe(true);
    expect(input.value).toBe('test-value');
  });

  it('should expose the native input through getNativeInput', async () => {
    const { root } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    expect(await bqRadio.getNativeInput()).toBe(getInput(root));
  });

  it('should not emit bqFocus when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio disabled name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqFocus = spyOnEvent('bqFocus');

    getInput(root).focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
  });

  it('should emit bqKeyDown without triggering click or blur', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');
    const bqKeyDown = spyOnEvent('bqKeyDown');

    getInput(root).focus();
    await userEvent.keyboard('0');
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqKeyDown).toHaveReceivedEventTimes(1);
  });

  it('should respect the expected design styles', async () => {
    const { root } = await render(
      <bq-radio name="option" value="1">
        Option 1
      </bq-radio>,
    );

    await waitForStable(root);

    const style = computedStyle('bq-radio >>> [part="base"]', ['height', 'gap', 'borderRadius']);

    expect(style).toEqual({ height: '40px', gap: '8px', borderRadius: '8px' });
  });
});

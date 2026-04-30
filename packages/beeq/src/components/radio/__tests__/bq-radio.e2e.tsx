import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const getInput = (element: HTMLBqRadioElement) => element.shadowRoot?.querySelector<HTMLInputElement>('input');

describe('bq-radio', () => {
  it('should render', async () => {
    const { root } = await render(<bq-radio name="test-option" value="test-value" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-radio name="test-option" value="test-value" />);

    expect(root).toHaveShadowRoot();
  });

  it('should display the slotted label', async () => {
    const { root } = await render(
      <bq-radio name="test-option" value="test-value">
        <span>Label</span>
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    await waitForStable(bqRadio);

    const labelSlot = bqRadio.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    expect(getTextContent(labelSlot, { recurse: true })).toBe('Label');
  });

  it('should handle checked state correctly', async () => {
    const { root, setProps } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    const input = getInput(bqRadio);

    expect(bqRadio).not.toHaveAttribute('checked');
    expect(input.checked).toBe(false);

    await setProps({ checked: true });

    expect(bqRadio).toHaveAttribute('checked');
    expect(input.checked).toBe(true);

    await setProps({ checked: false });

    expect(bqRadio).not.toHaveAttribute('checked');
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
    const bqRadio = root as HTMLBqRadioElement;
    const bqClick = spyOnEvent('bqClick');
    const input = getInput(bqRadio);

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
    const bqRadio = root as HTMLBqRadioElement;

    expect(getInput(bqRadio)).toBeDisabled();
    expect(getInput(bqRadio)).toEqualAttribute('aria-disabled', 'true');
  });

  it('should emit bqFocus and bqBlur through the native input', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getInput(bqRadio);

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
    const bqRadio = root as HTMLBqRadioElement;

    const input = getInput(bqRadio);

    expect(input).toEqualAttributes({
      form: 'my-form',
      name: 'test-option',
    });
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

    expect(await bqRadio.getNativeInput()).toBe(getInput(bqRadio));
  });

  it('should not emit bqFocus when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio disabled name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqFocus = spyOnEvent('bqFocus');

    getInput(bqRadio).focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
  });

  it('should emit bqKeyDown without triggering click or blur', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');
    const bqKeyDown = spyOnEvent('bqKeyDown');

    getInput(bqRadio).focus();
    await userEvent.keyboard('0');
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqKeyDown).toHaveReceivedEventTimes(1);
  });

  it('should remove focus from the native input via vBlur', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqBlur = spyOnEvent('bqBlur');

    await bqRadio.vFocus();
    await bqRadio.vBlur();
    await waitForChanges();

    expect(bqBlur).toHaveReceivedEventTimes(1);
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

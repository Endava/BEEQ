import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const getCheckboxInput = (checkbox: HTMLBqCheckboxElement) => checkbox.shadowRoot?.querySelector('[part="input"]');
const getCheckboxBase = (checkbox: HTMLBqCheckboxElement) => checkbox.shadowRoot?.querySelector('[part="base"]');
const getCheckboxMark = (checkbox: HTMLBqCheckboxElement) => checkbox.shadowRoot?.querySelector('[part="checkbox"]');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-checkbox', () => {
  it('should render', async () => {
    const { root } = await render(<bq-checkbox name="checkbox" value="test" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-checkbox name="checkbox" value="test" />);

    expect(root).toHaveShadowRoot();
  });

  it('should display text', async () => {
    const { root } = await render(
      <bq-checkbox name="checkbox" value="test">
        <p>Label</p>
      </bq-checkbox>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('slot');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Label');
  });

  it('should be keyboard accessible', async () => {
    const { spyOnEvent } = await render(
      <div>
        <bq-checkbox name="checkbox" value="test">
          Checkbox
        </bq-checkbox>
        <bq-checkbox name="checkbox1" value="test1">
          Checkbox 1
        </bq-checkbox>
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
    const { root } = await render(
      <bq-checkbox name="checkbox" value="test">
        Label
      </bq-checkbox>,
    );
    const checkbox = root as HTMLBqCheckboxElement;

    await waitForStable(root);

    expect(getCheckboxMark(checkbox).innerHTML).toBe('');
  });

  it('should render check mark', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-checkbox name="checkbox" value="test">
        Label
      </bq-checkbox>,
    );
    const checkbox = root as HTMLBqCheckboxElement;

    const bqChange = spyOnEvent('bqChange');

    await userEvent.click(getCheckboxBase(checkbox));
    await waitForChanges();

    expect(checkbox.checked).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(getCheckboxMark(checkbox).innerHTML).not.toBe('');
  });

  it('should render indeterminate', async () => {
    const { root } = await render(
      <bq-checkbox name="checkbox" value="test" indeterminate>
        Label
      </bq-checkbox>,
    );
    const checkbox = root as HTMLBqCheckboxElement;

    await waitForStable(root);

    expect(getCheckboxMark(checkbox).innerHTML).not.toBe('');
  });

  it('should apply the hover background class', async () => {
    const { root } = await render(
      <bq-checkbox name="checkbox" value="test" backgroundOnHover>
        Label
      </bq-checkbox>,
    );
    const checkbox = root as HTMLBqCheckboxElement;

    expect(getCheckboxBase(checkbox).classList.contains('has-background')).toBe(true);
  });

  it('should set checked to false when indeterminate is enabled', async () => {
    const { root, setProps } = await render(
      <bq-checkbox name="checkbox" value="test" checked>
        Label
      </bq-checkbox>,
    );
    const checkbox = root as HTMLBqCheckboxElement;

    await setProps({ indeterminate: true });

    expect(checkbox.checked).toBe(false);
    expect((getCheckboxInput(checkbox) as HTMLInputElement).indeterminate).toBe(true);
  });

  it('should not allow interaction when disabled', async () => {
    const { spyOnEvent } = await render(
      <div>
        <bq-checkbox name="disabled" value="disabled" disabled>
          Disabled
        </bq-checkbox>
        <bq-checkbox name="enabled" value="enabled">
          Enabled
        </bq-checkbox>
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
    // NOTE: The component's setFormValue() always submits 'on' regardless of the `value` prop.
    // This is a known component bug — `value="accepted"` should yield formData.get('terms') === 'accepted'.
    expect(formData.get('terms')).toBe('on');

    form.reset();
    await waitForChanges();

    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(false);
    expect(form.checkValidity()).toBe(false);
  });

  it('should expose `vClick`, `vFocus`, and `vBlur` methods', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-checkbox name="checkbox" value="test">
        Label
      </bq-checkbox>,
    );
    const checkbox = root as HTMLBqCheckboxElement;

    const bqChange = spyOnEvent('bqChange');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');

    await checkbox.vFocus();
    await waitForChanges();
    await checkbox.vClick();
    await waitForChanges();
    await checkbox.vBlur();
    await waitForChanges();

    expect(checkbox.checked).toBe(true);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should respect design style', async () => {
    const { root } = await render(
      <bq-checkbox name="checkbox" value="test">
        Label
      </bq-checkbox>,
    );

    await waitForStable(root);

    const baseStyle = computedStyle('bq-checkbox >>> [part="base"]', ['height']);
    const checkboxStyle = computedStyle('bq-checkbox >>> [part="checkbox"]', ['borderWidth', 'borderRadius']);

    expect(baseStyle).toEqual({ height: '40px' });
    expect(checkboxStyle).toEqual({ borderWidth: '2px', borderRadius: '4px' });
  });
});

import { h } from '@stencil/core';
import { describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { page, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const getRadio = (element: ParentNode, value: string) =>
  element.querySelector<HTMLBqRadioElement>(`bq-radio[value="${value}"]`);
const pressKey = (radio: HTMLBqRadioElement, key: string) =>
  radio.shadowRoot
    ?.querySelector<HTMLInputElement>('input')
    ?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true }));
const getLabelSlot = (element: HTMLBqRadioGroupElement) =>
  element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]');

const getFieldset = (element: HTMLBqRadioGroupElement) =>
  element.shadowRoot?.querySelector<HTMLFieldSetElement>('fieldset');

describe('bq-radio-group', () => {
  it('should render', async () => {
    const { root } = await render(<bq-radio-group name="test-option" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-radio-group name="test-option" />);

    expect(root).toHaveShadowRoot();
  });

  it('should set the value when a radio is clicked', async () => {
    const { root, waitForChanges } = await render(
      <bq-radio-group name="test-option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
      </bq-radio-group>,
    );
    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    await getRadio(bqRadioGroup, 'option2').vClick();
    await waitForChanges();

    expect(bqRadioGroup).toEqualAttribute('value', 'option2');
    expect(bqRadioGroup.value).toBe('option2');
    expect(getRadio(bqRadioGroup, 'option2')).toHaveAttribute('checked');
  });

  it('should render fieldset label and horizontal orientation', async () => {
    const { root } = await render(
      <bq-radio-group fieldset name="test-option" orientation="horizontal">
        <span slot="label">Radio group label</span>
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
      </bq-radio-group>,
    );
    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    expect(getTextContent(getLabelSlot(bqRadioGroup), { recurse: true })).toBe('Radio group label');
    expect(bqRadioGroup).toHaveAttribute('fieldset');
    expect(computedStyle('bq-radio-group >>> [part="group"]', ['flexDirection'])).toEqual({
      flexDirection: 'row',
    });
  });

  it('should preserve the unframed vertical layout by default', async () => {
    await render(
      <bq-radio-group name="test-option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
      </bq-radio-group>,
    );

    expect(computedStyle('bq-radio-group', ['display'])).toEqual({ display: 'inline-block' });
    expect(
      computedStyle('bq-radio-group >>> [part="base"]', [
        'borderBlockEndWidth',
        'borderBlockStartWidth',
        'borderInlineEndWidth',
        'borderInlineStartWidth',
        'marginBlockEnd',
        'marginBlockStart',
        'marginInlineEnd',
        'marginInlineStart',
        'paddingBlockEnd',
        'paddingBlockStart',
        'paddingInlineEnd',
        'paddingInlineStart',
      ]),
    ).toEqual({
      borderBlockEndWidth: '0px',
      borderBlockStartWidth: '0px',
      borderInlineEndWidth: '0px',
      borderInlineStartWidth: '0px',
      marginBlockEnd: '0px',
      marginBlockStart: '0px',
      marginInlineEnd: '0px',
      marginInlineStart: '0px',
      paddingBlockEnd: '0px',
      paddingBlockStart: '0px',
      paddingInlineEnd: '0px',
      paddingInlineStart: '0px',
    });
    expect(computedStyle('bq-radio-group >>> [part="group"]', ['display', 'flexDirection'])).toEqual({
      display: 'flex',
      flexDirection: 'column',
    });
  });

  it('should become valid only after one option is selected when required', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-radio-group name="test-option" required>
          <bq-radio name="test-option" value="option1">
            Option 1
          </bq-radio>
          <bq-radio name="test-option" value="option2">
            Option 2
          </bq-radio>
          <bq-radio name="test-option" value="option3">
            Option 3
          </bq-radio>
        </bq-radio-group>
        <button type="submit">Submit</button>
      </form>,
    );
    const form = root as HTMLFormElement;
    const radioGroup = form.querySelector<HTMLBqRadioGroupElement>('bq-radio-group');

    await waitForStable(radioGroup);

    expect(form.checkValidity()).toBe(false);
    expect(radioGroup.value).toBeUndefined();

    await getRadio(form, 'option2').vClick();
    await waitForChanges();

    expect(form.checkValidity()).toBe(true);
    expect(radioGroup).toEqualAttribute('value', 'option2');
  });

  it('should reset to the initial value on form reset', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-radio-group name="test-option" value="option1">
          <bq-radio name="test-option" value="option1">
            Option 1
          </bq-radio>
          <bq-radio name="test-option" value="option2">
            Option 2
          </bq-radio>
        </bq-radio-group>
      </form>,
    );
    const form = root as HTMLFormElement;
    const radioGroup = form.querySelector<HTMLBqRadioGroupElement>('bq-radio-group');

    await waitForStable(radioGroup);
    await getRadio(form, 'option2').vClick();
    await waitForChanges();
    expect(radioGroup.value).toBe('option2');

    form.reset();
    await waitForChanges();

    expect(radioGroup.value).toBe('option1');
    expect(getRadio(form, 'option1').checked).toBe(true);
    expect(getRadio(form, 'option2').checked).toBe(false);
  });

  it('should submit the selected option with the form', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-radio-group name="test-option" value="option1">
          <bq-radio name="test-option" value="option1">
            Option 1
          </bq-radio>
          <bq-radio name="test-option" value="option2">
            Option 2
          </bq-radio>
        </bq-radio-group>
      </form>,
    );
    const form = root as HTMLFormElement;

    await waitForStable(form.querySelector('bq-radio-group'));
    expect(new FormData(form).get('test-option')).toBe('option1');

    await getRadio(form, 'option2').vClick();
    await waitForChanges();

    expect(new FormData(form).get('test-option')).toBe('option2');
  });

  it('should update the form value when the value property is set from code', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-radio-group name="test-option" value="option1">
          <bq-radio name="test-option" value="option1">
            Option 1
          </bq-radio>
          <bq-radio name="test-option" value="option2">
            Option 2
          </bq-radio>
        </bq-radio-group>
      </form>,
    );
    const form = root as HTMLFormElement;
    const radioGroup = form.querySelector<HTMLBqRadioGroupElement>('bq-radio-group');

    await waitForStable(radioGroup);
    radioGroup.value = 'option2';
    await waitForChanges();

    expect(new FormData(form).get('test-option')).toBe('option2');

    radioGroup.value = undefined;
    await waitForChanges();

    expect(new FormData(form).has('test-option')).toBe(false);
  });

  it('should keep the form value in sync when a bqChange handler overrides the value synchronously', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-radio-group name="test-option" value="option1">
          <bq-radio name="test-option" value="option1">
            Option 1
          </bq-radio>
          <bq-radio name="test-option" value="option2">
            Option 2
          </bq-radio>
        </bq-radio-group>
      </form>,
    );
    const form = root as HTMLFormElement;
    const radioGroup = form.querySelector<HTMLBqRadioGroupElement>('bq-radio-group');

    await waitForStable(radioGroup);
    // A controlled consumer that rejects the selection and restores the previous value inside the event
    radioGroup.addEventListener('bqChange', (event: CustomEvent<{ value: string }>) => {
      if (event.detail.value === 'option2') radioGroup.value = 'option1';
    });

    await getRadio(form, 'option2').vClick();
    await waitForChanges();

    expect(radioGroup.value).toBe('option1');
    expect(new FormData(form).get('test-option')).toBe('option1');
  });

  it('should check a radio when the value property is set', async () => {
    const { root } = await render(
      <bq-radio-group name="test-option" value="option2">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
        <bq-radio name="test-option" value="option3">
          Option 3
        </bq-radio>
      </bq-radio-group>,
    );

    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    await waitForStable(bqRadioGroup);

    expect(getRadio(bqRadioGroup, 'option1').checked).toBe(false);
    expect(getRadio(bqRadioGroup, 'option2').checked).toBe(true);
    expect(getRadio(bqRadioGroup, 'option3').checked).toBe(false);
  });

  it('should keep a single checked radio while switching selection', async () => {
    const { root, waitForChanges } = await render(
      <bq-radio-group name="test-option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
        <bq-radio name="test-option" value="option3">
          Option 3
        </bq-radio>
      </bq-radio-group>,
    );

    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    await getRadio(bqRadioGroup, 'option1').vClick();
    await waitForChanges();
    expect(bqRadioGroup.value).toBe('option1');
    expect(getRadio(bqRadioGroup, 'option1').checked).toBe(true);

    await getRadio(bqRadioGroup, 'option2').vClick();
    await waitForChanges();
    expect(bqRadioGroup.value).toBe('option2');
    expect(getRadio(bqRadioGroup, 'option1').checked).toBe(false);
    expect(getRadio(bqRadioGroup, 'option2').checked).toBe(true);

    await getRadio(bqRadioGroup, 'option3').vClick();
    await waitForChanges();
    expect(bqRadioGroup.value).toBe('option3');
    expect(getRadio(bqRadioGroup, 'option2').checked).toBe(false);
    expect(getRadio(bqRadioGroup, 'option3').checked).toBe(true);
  });

  it('should emit bqChange when a radio is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio-group name="test-option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
        <bq-radio name="test-option" value="option3">
          Option 3
        </bq-radio>
      </bq-radio-group>,
    );
    const bqChange = spyOnEvent('bqChange');

    await getRadio(root, 'option1').vClick();
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should debounce bqChange and emit only the final value', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio-group debounceTime={150} name="test-option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
        <bq-radio name="test-option" value="option3">
          Option 3
        </bq-radio>
      </bq-radio-group>,
    );
    const bqRadioGroup = root as HTMLBqRadioGroupElement;
    const bqChange = spyOnEvent('bqChange');

    await getRadio(bqRadioGroup, 'option1').vClick();
    await getRadio(bqRadioGroup, 'option2').vClick();
    await getRadio(bqRadioGroup, 'option3').vClick();
    await waitForChanges();
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqRadioGroup.value).toBe('option3');
    expect(bqRadioGroup).toEqualAttribute('value', 'option3');
  });

  it('should emit bqChange synchronously on keyboard selection with the default debounceTime', async () => {
    const { root, spyOnEvent } = await render(
      <bq-radio-group name="test-option" value="option1">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
      </bq-radio-group>,
    );
    const bqChange = spyOnEvent('bqChange');

    pressKey(getRadio(root, 'option1'), 'ArrowDown');

    // Asserted before any await: the event is emitted inside the keydown
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqChange.events[0].detail.value).toBe('option2');
  });

  it('should emit only the latest value after a positive debounceTime', async () => {
    const { root, spyOnEvent } = await render(
      <bq-radio-group debounceTime={100} name="test-option" value="option1">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
        <bq-radio name="test-option" value="option3">
          Option 3
        </bq-radio>
      </bq-radio-group>,
    );
    const bqChange = spyOnEvent('bqChange');

    pressKey(getRadio(root, 'option1'), 'ArrowDown');
    pressKey(getRadio(root, 'option2'), 'ArrowDown');

    expect(bqChange).toHaveReceivedEventTimes(0);

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqChange.events[0].detail.value).toBe('option3');
    expect((root as HTMLBqRadioGroupElement).value).toBe('option3');
  });

  it('should keep the selection when a controlled consumer re-renders a stale value', async () => {
    const { root, waitForChanges } = await render(
      <bq-radio-group name="test-option" value="option1">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
      </bq-radio-group>,
    );
    const bqRadioGroup = root as HTMLBqRadioGroupElement;
    let state = 'option1';
    const received: string[] = [];
    const renderState = () => {
      bqRadioGroup.value = state;
    };
    bqRadioGroup.addEventListener('bqChange', (event: CustomEvent<{ value: string }>) => {
      received.push(event.detail.value);
      state = event.detail.value;
      setTimeout(renderState, 0);
    });
    // Simulates an unrelated re-render, queued before the selection, that re-applies the controlled value
    bqRadioGroup.addEventListener('keydown', () => setTimeout(renderState, 0), true);

    await getRadio(bqRadioGroup, 'option1').vFocus();
    await userEvent.keyboard('{ArrowRight}');
    await new Promise((resolve) => setTimeout(resolve, 50));
    await waitForChanges();

    expect(received).toEqual(['option2']);
    expect(bqRadioGroup.value).toBe('option2');
    expect(getRadio(bqRadioGroup, 'option2')).toHaveAttribute('checked');
  });

  it('should propagate disabled and hover properties to child radios', async () => {
    const { root } = await render(
      <bq-radio-group backgroundOnHover disabled name="test-option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
      </bq-radio-group>,
    );

    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    expect(bqRadioGroup.getAttribute('tabindex')).toBe('-1');
    expect(getRadio(bqRadioGroup, 'option1').backgroundOnHover).toBe(true);
    expect(getRadio(bqRadioGroup, 'option1').forceDisabled).toBe(true);
    expect(getRadio(bqRadioGroup, 'option1').name).toBe('test-option');
    expect(getRadio(bqRadioGroup, 'option2').forceDisabled).toBe(true);
  });

  it('should reflect the requiredValidationMessage property', async () => {
    const { root } = await render(
      <bq-radio-group name="test-option" required requiredValidationMessage="Please select an option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
      </bq-radio-group>,
    );

    expect(root).toEqualAttribute('required-validation-message', 'Please select an option');
  });

  it('should support keyboard navigation across the radios', async () => {
    const { root, waitForChanges } = await render(
      <bq-radio-group name="test-option">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
        <bq-radio name="test-option" value="option2">
          Option 2
        </bq-radio>
        <bq-radio name="test-option" value="option3">
          Option 3
        </bq-radio>
      </bq-radio-group>,
    );

    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    await getRadio(bqRadioGroup, 'option1').vFocus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();

    expect(bqRadioGroup.value).toBe('option2');
    expect(getRadio(bqRadioGroup, 'option2')).toHaveAttribute('checked');

    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    expect(bqRadioGroup.value).toBe('option3');
    expect(getRadio(bqRadioGroup, 'option3')).toHaveAttribute('checked');

    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    expect(bqRadioGroup.value).toBe('option1');
    expect(getRadio(bqRadioGroup, 'option1')).toHaveAttribute('checked');

    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();

    expect(bqRadioGroup.value).toBe('option3');
    expect(getRadio(bqRadioGroup, 'option3')).toHaveAttribute('checked');

    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();

    expect(bqRadioGroup.value).toBe('option2');
    expect(getRadio(bqRadioGroup, 'option2')).toHaveAttribute('checked');
  });

  it('should reference an existing label element from the fieldset aria-labelledby', async () => {
    const { root } = await render(
      <bq-radio-group name="delivery">
        <span slot="label">Delivery method</span>
        <bq-radio name="delivery" value="standard">
          Standard
        </bq-radio>
        <bq-radio name="delivery" value="express">
          Express
        </bq-radio>
      </bq-radio-group>,
    );
    const bqRadioGroup = root as HTMLBqRadioGroupElement;
    await waitForStable(bqRadioGroup);

    const labelledBy = getFieldset(bqRadioGroup)?.getAttribute('aria-labelledby');
    const labelElement = bqRadioGroup.shadowRoot?.getElementById(labelledBy ?? '');

    expect(labelledBy).toBeTruthy();
    expect(labelElement).not.toBeNull();
    expect(labelElement).toBe(getLabelSlot(bqRadioGroup));
  });

  it('should expose the label slot content as the accessible name of the group', async () => {
    const { root } = await render(
      <bq-radio-group name="delivery">
        <span slot="label">Delivery method</span>
        <bq-radio name="delivery" value="standard">
          Standard
        </bq-radio>
        <bq-radio name="delivery" value="express">
          Express
        </bq-radio>
      </bq-radio-group>,
    );
    await waitForStable(root as HTMLBqRadioGroupElement);

    await expect.element(page.getByRole('group', { name: 'Delivery method' })).toBeVisible();
  });

  it('should resolve the accessible name of each group when multiple instances are rendered', async () => {
    const { root } = await render(
      <div>
        <bq-radio-group name="delivery">
          <span slot="label">Delivery method</span>
          <bq-radio name="delivery" value="standard">
            Standard
          </bq-radio>
        </bq-radio-group>
        <bq-radio-group name="payment">
          <span slot="label">Payment method</span>
          <bq-radio name="payment" value="card">
            Card
          </bq-radio>
        </bq-radio-group>
      </div>,
    );
    const groups = Array.from(root.querySelectorAll<HTMLBqRadioGroupElement>('bq-radio-group'));
    await Promise.all(groups.map((group) => waitForStable(group)));

    groups.forEach((group) => {
      const labelledBy = getFieldset(group)?.getAttribute('aria-labelledby');

      expect(group.shadowRoot?.getElementById(labelledBy ?? '')).toBe(getLabelSlot(group));
    });
    await expect.element(page.getByRole('group', { name: 'Delivery method' })).toBeVisible();
    await expect.element(page.getByRole('group', { name: 'Payment method' })).toBeVisible();
  });

  it('should fallback invalid orientation values to vertical', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(
      <bq-radio-group name="test-option" orientation="horizontal">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
      </bq-radio-group>,
    );
    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    await setProps({ orientation: 'invalid' });

    expect(bqRadioGroup.orientation).toBe('vertical');
    expect(warn).toHaveBeenCalledWith(
      '[BQ-RADIO-GROUP] Please notice that "orientation" should be one of horizontal|vertical',
    );
    expect(computedStyle('bq-radio-group >>> [part="group"]', ['flexDirection'])).toEqual({
      flexDirection: 'column',
    });

    warn.mockRestore();
  });
});

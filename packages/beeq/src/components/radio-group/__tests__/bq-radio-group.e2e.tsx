import { h } from '@stencil/core';
import { describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

const getRadio = (element: ParentNode, value: string) =>
  element.querySelector<HTMLBqRadioElement>(`bq-radio[value="${value}"]`);
const getLabelSlot = (element: HTMLBqRadioGroupElement) =>
  element.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]');

describe('bq-radio-group', () => {
  it('should render', async () => {
    const { root } = await render(<bq-radio-group name="test-option" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-radio-group name="test-option" />);

    expect(root.shadowRoot).not.toBeNull();
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

    expect(bqRadioGroup.shadowRoot?.querySelector('[part="base"]')).toHaveClass('has-fieldset');
    expect(getTextContent(getLabelSlot(bqRadioGroup), { recurse: true })).toBe('Radio group label');
    expect(bqRadioGroup.shadowRoot?.querySelector('[part="group"]')).toHaveClass('bq-radio-group--horizontal');
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

  it('should fallback invalid orientation values to vertical', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(
      <bq-radio-group name="test-option" orientation="horizontal">
        <bq-radio name="test-option" value="option1">
          Option 1
        </bq-radio>
      </bq-radio-group>,
    );
    const bqRadioGroup = root as HTMLBqRadioGroupElement;

    // @ts-expect-error testing invalid prop handling
    bqRadioGroup.orientation = 'invalid';
    await waitForChanges();

    expect(bqRadioGroup.orientation).toBe('vertical');
    expect(bqRadioGroup.shadowRoot?.querySelector('[part="group"]')).toHaveClass('bq-radio-group--vertical');
    expect(warn).toHaveBeenCalledTimes(1);

    warn.mockRestore();
  });
});

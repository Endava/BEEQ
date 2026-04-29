import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { sleep } from '../../../shared/test-utils';

const getInput = (select: HTMLBqSelectElement) => select.shadowRoot?.querySelector<HTMLInputElement>('input');
const getControl = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector<HTMLElement>('.bq-select__control');
const getDropdown = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector<HTMLBqDropdownElement>('bq-dropdown');
const getClearButton = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector('bq-button')?.shadowRoot?.querySelector<HTMLButtonElement>('[part="button"]');
const getOptionButton = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLButtonElement>('[part="base"]');
const getHelperText = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector<HTMLElement>('[part="helper-text"]');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-select', () => {
  it('should render', async () => {
    const { root } = await render(<bq-select name="bq-select" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-select name="bq-select" />);

    expect(root).toHaveShadowRoot();
  });

  it('should render the default suffix icon', async () => {
    const { root } = await render(<bq-select name="bq-select" />);
    const select = root as HTMLBqSelectElement;

    expect(select.shadowRoot?.querySelector('bq-icon[name="caret-down"]')).not.toBeNull();
  });

  it('should render with prefix icon', async () => {
    const { root } = await render(
      <bq-select name="bq-select">
        <bq-icon name="user-circle" slot="prefix" />
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForStable(root);

    expect(select.shadowRoot?.querySelector('.bq-select__control--prefix')).not.toHaveClass('!hidden');
  });

  it('should render with label content', async () => {
    const { root } = await render(
      <bq-select name="bq-select">
        <span slot="label">Select label</span>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForStable(root);

    expect(select.shadowRoot?.querySelector('.bq-select__label')).not.toHaveClass('!hidden');
  });

  it('should render with helper content', async () => {
    const { root } = await render(
      <bq-select name="bq-select">
        <span slot="helper-text">Helper text</span>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForStable(root);

    expect(select.shadowRoot?.querySelector('.bq-select__helper-text')).not.toHaveClass('!hidden');
  });

  it('should render with options', async () => {
    const { root } = await render(
      <bq-select name="bq-select">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );

    expect(root.querySelectorAll('bq-option')).toHaveLength(3);
  });

  it('should render with selected option', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" value="1">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForChanges();

    expect(root.querySelector('bq-option[value="1"]')).toHaveAttribute('selected');
    expect(getInput(select).value).toBe('Option 1');
  });

  it('should select an option and emit bqSelect', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const bqSelect = spyOnEvent('bqSelect');
    const option = root.querySelector('bq-option[value="2"]') as HTMLBqOptionElement;

    await userEvent.click(getControl(select));
    await waitForChanges();

    expect(getDropdown(select)).toHaveAttribute('open');
    expect(option).not.toHaveAttribute('selected');

    await userEvent.click(getOptionButton(option));
    await waitForChanges();

    expect(getDropdown(select)).not.toHaveAttribute('open');
    expect(option).toHaveAttribute('selected');
    expect(getInput(select).value).toBe('Option 2');
    expect(bqSelect).toHaveReceivedEventTimes(1);
  });

  it('should render tags for multiple selected options', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    select.value = ['1', '2'];
    await waitForChanges();

    const selectedValueElements = root.querySelectorAll('bq-option[selected]');
    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(selectedValueElements).toHaveLength(2);
    expect(displayTags).toHaveLength(2);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
    expect(displayTags[1].textContent?.trim()).toContain('Option 2');
  });

  it('should rerender when value changes externally', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    select.value = ['1', '2'];
    await waitForChanges();
    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(2);

    select.value = ['3'];
    await waitForChanges();

    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(1);
    expect(displayTags).toHaveLength(1);
    expect(displayTags[0].textContent?.trim()).toContain('Option 3');
  });

  it('should remove the last selected option on Backspace when the input is empty', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    select.value = ['1', '2'];
    await waitForChanges();

    const input = getInput(select);
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');
    await waitForChanges();

    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(1);
    expect(displayTags).toHaveLength(1);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
  });

  it('should keep selected options when Backspace is used while typing', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    select.value = ['1', '2'];
    await waitForChanges();

    const input = getInput(select);
    await userEvent.click(input);
    await userEvent.keyboard('Option 3');
    await waitForChanges();
    await userEvent.keyboard('{Backspace}{Backspace}');
    await waitForChanges();

    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(displayTags).toHaveLength(2);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
    expect(displayTags[1].textContent?.trim()).toContain('Option 2');
    expect(input.value).toBe('Option');
  });

  it('should clear the current value and emit bqClear', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" value="2">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const bqClear = spyOnEvent('bqClear');

    await waitForChanges();
    await userEvent.click(getClearButton(select));
    await waitForChanges();

    expect(select.value).toBe('');
    expect(getInput(select).value).toBe('');
    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(0);
    expect(bqClear).toHaveReceivedEventTimes(1);
  });

  it('should render with panel options opened', async () => {
    const { root } = await render(
      <bq-select name="bq-select" open>
        <bq-option value="1">Option 1</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForStable(root);

    expect(getDropdown(select)).toHaveAttribute('open');
  });

  it('should do nothing when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" disabled value="2">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqInput = spyOnEvent('bqInput');
    const bqClear = spyOnEvent('bqClear');
    const input = getInput(select);

    await userEvent.click(getControl(select));
    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    input.value = 'Option';
    input.dispatchEvent(new Event('input'));
    await select.clear();
    await waitForChanges();

    expect(getDropdown(select)).not.toHaveAttribute('open');
    expect(select.value).toBe('2');
    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqInput).toHaveReceivedEventTimes(0);
    expect(bqClear).toHaveReceivedEventTimes(0);
  });

  it('should emit bqFocus and bqBlur events', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-select name="bq-select" />);
    const select = root as HTMLBqSelectElement;

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getInput(select);

    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should emit bqInput and filter options while typing', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="alpha">Alpha</bq-option>
        <bq-option value="beta">Beta</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    const bqInput = spyOnEvent('bqInput');
    const input = getInput(select);
    const alphaOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="alpha"]');
    const betaOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="beta"]');

    await userEvent.click(input);
    // Use fill instead of type to set the value atomically, ensuring exactly 1 bqInput
    // event fires regardless of debounce timing across character keystrokes
    await userEvent.fill(input, 'alp');
    await waitForChanges();

    expect(bqInput).toHaveReceivedEventTimes(1);
    expect(alphaOption.hidden).toBe(false);
    expect(betaOption.hidden).toBe(true);
  });

  it('should hide the clear button when disableClear is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" disableClear value="2">
        <bq-option value="2">Option 2</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForChanges();

    expect(select.shadowRoot?.querySelector('[part="clear-btn"]')).toBeNull();
  });

  it('should apply validation status classes', async () => {
    const { root } = await render(
      <bq-select name="bq-select" validationStatus="error">
        <span slot="helper-text">Helper text</span>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForStable(root);

    expect(getControl(select)).toHaveClass('validation-error');
    expect(getHelperText(select)).toHaveClass('validation-error');
  });

  it('should render placeholder and readonly attributes', async () => {
    const { root } = await render(<bq-select name="bq-select" placeholder="Choose one" readonly />);
    const select = root as HTMLBqSelectElement;

    const input = getInput(select);

    expect(input.placeholder).toBe('Choose one');
    expect(input.readOnly).toBe(true);
  });

  it('should stay open after selection when keepOpenOnSelect is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" keepOpenOnSelect>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const option = root.querySelector('bq-option[value="2"]') as HTMLBqOptionElement;

    await userEvent.click(getControl(select));
    await waitForChanges();
    await userEvent.click(getOptionButton(option));
    await waitForChanges();

    expect(getDropdown(select)).toHaveAttribute('open');
  });

  it('should render overflow tag when maxTagsVisible is exceeded', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" maxTagsVisible={1} multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    select.value = ['1', '2', '3'];
    await waitForChanges();

    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(displayTags).toHaveLength(2);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
    expect(displayTags[1].textContent?.trim()).toContain('+2');
  });

  it('should participate in forms and reset to an empty value', async () => {
    const { waitForChanges } = await render(
      <form>
        <bq-select name="country" required value="2">
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
        </bq-select>
      </form>,
    );

    const form = document.querySelector('form') as HTMLFormElement;
    const select = form.querySelector('bq-select') as HTMLBqSelectElement;

    await waitForChanges();

    expect(new FormData(form).get('country')).toBe('2');
    expect(form.checkValidity()).toBe(true);

    await select.clear();
    await waitForChanges();

    expect(new FormData(form).get('country')).toBe('');

    form.reset();
    await waitForChanges();

    expect(select.value).toBe('');
    expect(getInput(select).value).toBe('');
  });

  it('should remove multiple tags one at a time when backspace is pressed repeatedly', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    select.value = ['1', '2', '3'];
    await waitForChanges();

    const input = getInput(select);
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}{Backspace}');
    await waitForChanges();

    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(1);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
  });

  it('should not throw when backspace is pressed with no selected options', async () => {
    const { root } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    const input = getInput(select);

    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');

    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(0);
  });

  it('should close the panel when Escape is pressed', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="1">Option 1</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await userEvent.click(getControl(select));
    await waitForChanges();

    expect(getDropdown(select)).toHaveAttribute('open');

    await userEvent.keyboard('{Escape}');
    await waitForChanges();

    expect(getDropdown(select)).not.toHaveAttribute('open');
  });

  it('should render a custom suffix icon via the suffix slot', async () => {
    const { root } = await render(
      <bq-select name="bq-select">
        <bq-icon name="arrow-down" slot="suffix" />
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForStable(root);

    const suffixSlot = select.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="suffix"]');
    const assigned = suffixSlot.assignedElements({ flatten: true });

    expect(assigned).toHaveLength(1);
    expect(assigned[0].tagName.toLowerCase()).toBe('bq-icon');
    expect(assigned[0]).toEqualAttribute('name', 'arrow-down');
  });

  it('should debounce the bqInput event when debounceTime is set', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" debounceTime={250}>
        <bq-option value="alpha">Alpha</bq-option>
        <bq-option value="beta">Beta</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const bqInput = spyOnEvent('bqInput');
    const input = getInput(select);

    await userEvent.click(input);
    await userEvent.type(input, 'alp');
    await waitForChanges();

    // bqInput should not fire immediately when debounceTime > 0
    expect(bqInput).toHaveReceivedEventTimes(0);

    await sleep(300);

    expect(bqInput).toHaveReceivedEventTimes(1);
  });

  it('should reset to a given value using the reset method', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await select.reset('2');
    await waitForChanges();

    expect(select.value).toBe('2');
    expect(root.querySelector('bq-option[value="2"]')).toHaveAttribute('selected');
    expect(getInput(select).value).toBe('Option 2');
  });
});

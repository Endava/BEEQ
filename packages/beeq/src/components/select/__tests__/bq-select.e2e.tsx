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
  option.shadowRoot?.querySelector<HTMLButtonElement>('button[part="base"]');
const getOptionSelectionControl = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLElement>('[part="base"]');
const getOptionExpandButton = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLBqButtonElement>('[part="expand"]');
const getOptionExpandButtonControl = (option: HTMLBqOptionElement) =>
  getOptionExpandButton(option)?.shadowRoot?.querySelector<HTMLButtonElement>('[part="button"]');
const getOptionCheckbox = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLBqCheckboxElement>('bq-checkbox');
const getOptionCheckboxInput = (option: HTMLBqOptionElement) =>
  getOptionCheckbox(option)?.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');
const getOptionCheckboxBase = (option: HTMLBqOptionElement) =>
  getOptionCheckbox(option)?.shadowRoot?.querySelector<HTMLElement>('[part="base"]');
const getOptionCheckboxMark = (option: HTMLBqOptionElement) =>
  getOptionCheckbox(option)?.shadowRoot?.querySelector<HTMLElement>('[part="checkbox"]');
const getOptionSelectionSummary = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLElement>('[part="selection-summary"]');
const getHelperText = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector<HTMLElement>('[part="helper-text"]');
const setDropdownOpen = (select: HTMLBqSelectElement, open: boolean) => {
  getDropdown(select)?.dispatchEvent(
    new CustomEvent('bqOpen', {
      bubbles: true,
      composed: true,
      detail: { open },
    }),
  );
};
const createOption = (value: string, label = value) => {
  const option = document.createElement('bq-option');
  option.value = value;
  option.textContent = label;
  return option;
};

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

  it('should reflect `enable-checkboxes`', async () => {
    const { root, setProps } = await render(<bq-select name="bq-select" />);

    expect(root).not.toHaveAttribute('enable-checkboxes');

    await setProps({ enableCheckboxes: true });
    expect(root).toHaveAttribute('enable-checkboxes');

    await setProps({ enableCheckboxes: false });
    expect(root).not.toHaveAttribute('enable-checkboxes');
  });

  it('should apply checkbox presentation to options added after load', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" multiple enableCheckboxes>
        <bq-option value="1">Option 1</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const option = document.createElement('bq-option');
    option.value = '2';
    option.textContent = 'Option 2';

    await waitForChanges();
    select.appendChild(option);
    await waitForStable(root);

    expect(option.shadowRoot?.querySelector('bq-checkbox')).not.toBeNull();
  });

  it('should activate nested presentation when nested options are added after load', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select">
        <bq-option value="frontend">Frontend</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const parentOption = document.createElement('bq-option') as HTMLBqOptionElement;
    const childOption = document.createElement('bq-option') as HTMLBqOptionElement;

    parentOption.value = 'backend';
    parentOption.textContent = 'Backend';
    childOption.slot = 'options';
    childOption.value = 'node';
    childOption.textContent = 'Node.js';
    parentOption.append(childOption);
    select.append(parentOption);
    await waitForChanges();
    await waitForStable(root);

    expect(getInput(select)).toEqualAttribute('aria-haspopup', 'tree');
    expect(parentOption).toEqualAttribute('role', 'treeitem');
    expect(childOption).toEqualAttribute('role', 'treeitem');
    expect(getOptionCheckbox(parentOption)).not.toBeNull();
    expect(getOptionCheckbox(childOption)).not.toBeNull();
  });

  it('should only render checkboxes for multiple selection', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="1">Option 1</bq-option>
      </bq-select>,
    );
    const option = root.querySelector('bq-option') as HTMLBqOptionElement;

    await waitForChanges();
    expect(getOptionCheckbox(option)).toBeNull();

    await setProps({ enableCheckboxes: true });
    await waitForChanges();
    expect(getOptionCheckbox(option)).toBeNull();

    await setProps({ multiple: true });
    await waitForChanges();
    expect(getOptionCheckbox(option)).not.toBeNull();

    await setProps({ enableCheckboxes: false });
    await waitForChanges();
    expect(getOptionCheckbox(option)).toBeNull();

    await setProps({ enableCheckboxes: true, multiple: false });
    await waitForChanges();
    expect(getOptionCheckbox(option)).toBeNull();

    await setProps({ multiple: true });
    await waitForChanges();
    expect(getOptionCheckbox(option)).not.toBeNull();

    await setProps({ multiple: false });
    await waitForChanges();
    expect(getOptionCheckbox(option)).toBeNull();
  });

  it('should synchronize selected and unselected checkbox states', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select" multiple enableCheckboxes>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
      </bq-select>,
    );
    const selectedOption = root.querySelector('bq-option[value="1"]') as HTMLBqOptionElement;
    const unselectedOption = root.querySelector('bq-option[value="2"]') as HTMLBqOptionElement;

    await setProps({ value: ['1'] });
    await waitForChanges();

    expect(getOptionCheckboxInput(selectedOption)?.checked).toBe(true);
    expect(getOptionCheckboxInput(unselectedOption)?.checked).toBe(false);
    expect(getOptionCheckboxInput(selectedOption)).toEqualAttribute('aria-checked', 'true');
    expect(getOptionCheckboxInput(unselectedOption)).toEqualAttribute('aria-checked', 'false');
  });

  it('should expose checkbox selection through the option semantics', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select" multiple enableCheckboxes>
        <bq-option value="1">Option 1</bq-option>
      </bq-select>,
    );
    const option = root.querySelector<HTMLBqOptionElement>('bq-option');
    const checkbox = getOptionCheckbox(option);
    const input = getOptionCheckboxInput(option);

    await setProps({ value: ['1'] });
    await waitForChanges();

    expect(option).toEqualAttribute('role', 'option');
    expect(option).toEqualAttribute('aria-checked', 'true');
    expect(option).not.toHaveAttribute('aria-selected');
    expect(checkbox).toEqualAttribute('aria-hidden', 'true');
    expect(input).toEqualAttribute('tabindex', '-1');
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

  it('should use the complete default slot content as the selected label', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" value="1">
        <bq-option value="1">
          <span>Option</span> label
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await waitForChanges();
    await waitForStable(root);

    expect(getInput(select).value).toBe('Option label');
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
    const { root, setProps } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await setProps({ value: ['1', '2'] });

    const selectedValueElements = root.querySelectorAll('bq-option[selected]');
    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(selectedValueElements).toHaveLength(2);
    expect(displayTags).toHaveLength(2);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
    expect(displayTags[1].textContent?.trim()).toContain('Option 2');
  });

  it('should render and toggle checkbox options when enabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" keepOpenOnSelect multiple enableCheckboxes>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const option = root.querySelector('bq-option[value="2"]') as HTMLBqOptionElement;
    const bqSelect = spyOnEvent('bqSelect');

    await waitForChanges();

    expect(getOptionCheckbox(option)).not.toBeNull();
    expect(getOptionButton(option)).toBeNull();

    await userEvent.click(getControl(select));
    await waitForChanges();

    await userEvent.click(getOptionCheckboxBase(option));
    await waitForChanges();

    expect(option).toHaveAttribute('selected');
    expect(select.value).toEqual(['2']);
    expect(bqSelect).toHaveReceivedEventTimes(1);

    await userEvent.click(getOptionCheckboxBase(option));
    await waitForChanges();

    expect(option).not.toHaveAttribute('selected');
    expect(select.value).toEqual([]);
    expect(bqSelect).toHaveReceivedEventTimes(2);
  });

  it('should select by label click and checkbox click without duplicate events', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" keepOpenOnSelect multiple enableCheckboxes>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const firstOption = root.querySelector('bq-option[value="1"]') as HTMLBqOptionElement;
    const secondOption = root.querySelector('bq-option[value="2"]') as HTMLBqOptionElement;
    const bqSelect = spyOnEvent('bqSelect');

    await userEvent.click(getControl(select));
    await waitForChanges();
    await userEvent.click(getOptionCheckboxBase(firstOption));
    await waitForChanges();

    expect(firstOption).toHaveAttribute('selected');
    expect(bqSelect).toHaveReceivedEventTimes(1);

    await userEvent.click(getOptionCheckboxMark(secondOption));
    await waitForChanges();

    expect(secondOption).toHaveAttribute('selected');
    expect(bqSelect).toHaveReceivedEventTimes(2);
  });

  it('should select a checkbox option with Enter and Space', async () => {
    const { root, setProps, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" keepOpenOnSelect multiple enableCheckboxes>
        <bq-option value="1">Option 1</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const option = root.querySelector('bq-option') as HTMLBqOptionElement;
    const checkbox = getOptionCheckbox(option);
    const bqSelect = spyOnEvent('bqSelect');

    await userEvent.click(getControl(select));
    await waitForChanges();
    await checkbox?.vFocus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(option).toHaveAttribute('selected');
    expect(select.value).toEqual(['1']);
    expect(bqSelect).toHaveReceivedEventTimes(1);

    await setProps({ value: [] });
    await waitForChanges();
    await checkbox?.vFocus();
    await userEvent.keyboard(' ');
    await waitForChanges();

    expect(option).toHaveAttribute('selected');
    expect(select.value).toEqual(['1']);
    expect(bqSelect).toHaveReceivedEventTimes(2);
  });

  it('should keep selected row styling with checkboxes enabled', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" multiple enableCheckboxes value={['1']}>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
      </bq-select>,
    );
    const selectedOption = root.querySelector('bq-option[value="1"]') as HTMLBqOptionElement;
    const unselectedOption = root.querySelector('bq-option[value="2"]') as HTMLBqOptionElement;
    const selectedLabel = getOptionCheckbox(selectedOption)?.shadowRoot?.querySelector<HTMLElement>('[part="label"]');
    const unselectedLabel =
      getOptionCheckbox(unselectedOption)?.shadowRoot?.querySelector<HTMLElement>('[part="label"]');

    await waitForChanges();

    expect(selectedOption).toHaveAttribute('selected');
    expect(selectedLabel).not.toBeNull();
    expect(unselectedLabel).not.toBeNull();
    expect(getComputedStyle(selectedLabel as HTMLElement).color).not.toBe(
      getComputedStyle(unselectedLabel as HTMLElement).color,
    );
  });

  it('should rerender when value changes externally', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await setProps({ value: ['1', '2'] });
    await waitForChanges();
    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(2);

    await setProps({ value: ['3'] });
    await waitForChanges();

    const displayTags = select.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(1);
    expect(displayTags).toHaveLength(1);
    expect(displayTags[0].textContent?.trim()).toContain('Option 3');
  });

  it('should remove the last selected option on Backspace when the input is empty', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await setProps({ value: ['1', '2'] });

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
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await setProps({ value: ['1', '2'] });

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

  it('should clear and reset multiple values without changing the form value shape', async () => {
    const { waitForChanges } = await render(
      <form>
        <bq-select multiple name="skills" value={['1', '2']}>
          <bq-option value="1">Option 1</bq-option>
          <bq-option value="2">Option 2</bq-option>
        </bq-select>
      </form>,
    );
    const form = document.querySelector('form') as HTMLFormElement;
    const select = form.querySelector('bq-select') as HTMLBqSelectElement;

    await waitForChanges();
    expect(new FormData(form).get('skills')).toBe('1,2');

    await select.clear();
    await waitForChanges();

    expect(select.value).toEqual([]);
    expect(new FormData(form).get('skills')).toBe('');

    await select.reset(['1']);
    await waitForChanges();
    form.reset();
    await waitForChanges();

    expect(select.value).toEqual([]);
    expect(new FormData(form).get('skills')).toBe('');
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
    expect(getInput(select)).toEqualAttribute('aria-expanded', 'true');
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
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true, composed: true }));
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, composed: true }));
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
    const { root, spyOnEvent, waitForChanges } = await render(
      <div>
        <button type="button">Outside</button>
        <bq-select name="bq-select" />
      </div>,
    );
    const select = root.querySelector<HTMLBqSelectElement>('bq-select');

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getInput(select);

    await userEvent.click(input);
    await userEvent.click(root.querySelector<HTMLButtonElement>('button'));
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(bqFocus.events[0].detail).toBe(select);
    expect(bqBlur.events[0].detail).toBe(select);

    input.focus();
    input.blur();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqBlur).toHaveReceivedEventTimes(2);
  });

  it('should keep focus events scoped to the whole Select across shadow controls and checkboxes', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <div>
        <button type="button">Outside</button>
        <bq-select multiple enableCheckboxes name="bq-select" value={['alpha']}>
          <bq-option value="alpha">Alpha</bq-option>
          <bq-option value="beta">Beta</bq-option>
        </bq-select>
      </div>,
    );
    const select = root.querySelector<HTMLBqSelectElement>('bq-select');
    const input = getInput(select);
    const outside = root.querySelector<HTMLButtonElement>('button');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const option = select.querySelector<HTMLBqOptionElement>('bq-option[value="beta"]');

    await userEvent.click(input);
    await waitForChanges();
    getClearButton(select).focus();
    const tag = select.shadowRoot.querySelector<HTMLBqTagElement>('bq-tag');
    const tagClose = tag.shadowRoot.querySelector<HTMLBqButtonElement>('bq-button');
    tagClose.shadowRoot.querySelector<HTMLButtonElement>('button').focus();
    getOptionCheckboxInput(option).focus();
    input.focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(select.shadowRoot.activeElement).toBe(input);

    outside.focus();
    await waitForChanges();
    expect(bqBlur).toHaveReceivedEventTimes(1);

    getOptionCheckboxInput(option).focus();
    await waitForChanges();
    expect(bqFocus).toHaveReceivedEventTimes(2);

    outside.focus();
    await waitForChanges();
    expect(bqBlur).toHaveReceivedEventTimes(2);
  });

  it('should not emit focus events when moving between nested option controls', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <div>
        <button type="button">Outside</button>
        <bq-select multiple name="bq-select">
          <bq-option expanded value="parent">
            Parent
            <bq-option slot="options" value="child">
              Child
            </bq-option>
          </bq-option>
        </bq-select>
      </div>,
    );
    const select = root.querySelector<HTMLBqSelectElement>('bq-select');
    const parent = select.querySelector<HTMLBqOptionElement>('bq-option[value="parent"]');
    const child = select.querySelector<HTMLBqOptionElement>('bq-option[value="child"]');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.click(getInput(select));
    await waitForChanges();
    getOptionExpandButtonControl(parent).focus();
    getOptionCheckboxInput(child).focus();
    getInput(select).focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);

    root.querySelector<HTMLButtonElement>('button').focus();
    await waitForChanges();
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

    expect(input.readOnly).toBe(false);

    await userEvent.click(input);
    // Use fill instead of type to set the value atomically, ensuring exactly 1 bqInput
    // event fires regardless of debounce timing across character keystrokes
    await userEvent.fill(input, 'alp');
    await waitForChanges();

    expect(bqInput).toHaveReceivedEventTimes(1);
    expect(alphaOption.hidden).toBe(false);
    expect(betaOption.hidden).toBe(true);
  });

  it('should expand collapsed parents when a nested option matches the search', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select">
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="framework">
            Framework
            <bq-option slot="options" value="react">
              React
            </bq-option>
            <bq-option slot="options" value="stencil">
              Stencil
            </bq-option>
          </bq-option>
        </bq-option>
        <bq-option value="backend">Backend</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const frameworkOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="framework"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const stencilOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="stencil"]');
    const backendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="backend"]');

    expect(frontendOption.expanded).toBe(false);

    await userEvent.click(input);
    await userEvent.fill(input, 'rea');
    await waitForChanges();

    expect(frontendOption.expanded).toBe(true);
    expect(frameworkOption.expanded).toBe(true);
    expect(getOptionExpandButtonControl(frontendOption)).toEqualAttribute('aria-expanded', 'true');
    expect(getOptionExpandButtonControl(frameworkOption)).toEqualAttribute('aria-expanded', 'true');
    expect(frontendOption.hidden).toBe(false);
    expect(frameworkOption.hidden).toBe(false);
    expect(reactOption.hidden).toBe(false);
    expect(stencilOption.hidden).toBe(true);
    expect(backendOption.hidden).toBe(true);

    setDropdownOpen(select, false);
    await waitForChanges();

    expect(frontendOption.expanded).toBe(false);
    expect(frameworkOption.expanded).toBe(false);
  });

  describe.each([false, true])('dynamic search with multiple=%s', (multiple) => {
    it('should support async option navigation and focus-leave cleanup without remounting', async () => {
      const initialValue = multiple ? ['English'] : 'English';
      const initialInputValue = multiple ? '' : 'English';
      const selectedValue = multiple ? ['English', 'Spanish'] : 'Spanish';
      const selectedInputValue = multiple ? '' : 'Spanish';
      const selectedFormValue = multiple ? 'English,Spanish' : 'Spanish';
      const { root, spyOnEvent, waitForChanges } = await render(
        <form>
          <button type="button">Outside</button>
          <bq-select
            multiple={multiple}
            name="spoken-languages"
            value={initialValue}
            onBqInput={(event) => event.preventDefault()}
          >
            <bq-option hidden value="English">
              English
            </bq-option>
          </bq-select>
        </form>,
      );
      const form = root as HTMLFormElement;
      const select = form.querySelector<HTMLBqSelectElement>('bq-select');
      const input = getInput(select);
      const english = select.querySelector<HTMLBqOptionElement>('bq-option');
      const outside = form.querySelector<HTMLButtonElement>('button');
      const resetSearch = vi.fn(() => select.reset(select.value));
      const bqSelect = spyOnEvent('bqSelect');
      const bqBlur = spyOnEvent('bqBlur');
      const bqFocus = spyOnEvent('bqFocus');
      select.addEventListener('bqBlur', () => {
        void resetSearch();
      });

      await userEvent.click(input);
      await userEvent.fill(input, 'Spanish');
      const loading = createOption('loading', 'Loading...');
      loading.disabled = true;
      select.replaceChildren(english, loading);
      await waitForChanges();
      await waitForStable(root);

      expect(input.value).toBe('Spanish');
      expect(select.shadowRoot.activeElement).toBe(input);

      const spanish = createOption('Spanish');
      const spanishSpain = createOption('Spanish (Spain)');
      select.replaceChildren(english, spanish, spanishSpain);
      await waitForChanges();
      await waitForStable(root);

      await userEvent.keyboard('{ArrowDown}');
      await waitForChanges();

      expect(document.activeElement).toBe(spanish);
      expect(select.open).toBe(true);
      expect(input.value).toBe('Spanish');
      expect(getInput(select)).toBe(input);
      expect(form.querySelector('bq-select')).toBe(select);
      expect(resetSearch).not.toHaveBeenCalled();
      expect(bqBlur).toHaveReceivedEventTimes(0);
      expect(bqFocus).toHaveReceivedEventTimes(1);
      expect(new FormData(form).get('spoken-languages')).toBe('English');

      await userEvent.keyboard('{ArrowDown}');
      expect(document.activeElement).toBe(spanishSpain);
      await userEvent.keyboard('{ArrowUp}');
      expect(document.activeElement).toBe(spanish);
      expect(resetSearch).not.toHaveBeenCalled();

      await userEvent.click(outside);
      await waitForChanges();
      await waitForStable(root);

      expect(resetSearch).toHaveBeenCalledTimes(1);
      expect(bqBlur).toHaveReceivedEventTimes(1);
      expect(document.activeElement).toBe(outside);
      expect(select.open).toBe(false);
      expect(input.value).toBe(initialInputValue);
      expect(new FormData(form).get('spoken-languages')).toBe('English');

      await userEvent.click(input);
      await userEvent.fill(input, 'Spanish');
      await userEvent.keyboard('{ArrowDown}');
      await waitForChanges();
      expect(document.activeElement).toBe(spanish);
      expect(select.open).toBe(true);

      await userEvent.keyboard('{Enter}');
      await waitForChanges();
      await waitForStable(root);

      expect(select.value).toEqual(selectedValue);
      expect(input.value).toBe(selectedInputValue);
      expect(select.shadowRoot.activeElement).toBe(input);
      expect(resetSearch).toHaveBeenCalledTimes(1);
      expect(bqFocus).toHaveReceivedEventTimes(2);
      expect(bqSelect).toHaveReceivedEventTimes(1);

      await userEvent.fill(input, 'another query');
      await userEvent.click(outside);
      await waitForChanges();
      await waitForStable(root);

      expect(resetSearch).toHaveBeenCalledTimes(2);
      expect(bqBlur).toHaveReceivedEventTimes(2);
      expect(input.value).toBe(selectedInputValue);
      expect(new FormData(form).get('spoken-languages')).toBe(selectedFormValue);
      expect(form.querySelector('bq-select')).toBe(select);
      expect(getInput(select)).toBe(input);

      await select.clear();
      await waitForChanges();
      expect(input.value).toBe('');
      expect(new FormData(form).get('spoken-languages')).toBe('');
    });

    it.each([false, true])('should preserve async search text with a committed selection=%s', async (selected) => {
      const initialValues = selected ? ['initial'] : [];
      const value = multiple ? initialValues : initialValues.join(',');
      const showLoading = (event: Event) => {
        event.preventDefault();
        const select = event.target as HTMLBqSelectElement;
        const loading = createOption('loading', 'Loading...');
        loading.disabled = true;
        select.replaceChildren(loading);
      };
      const { root, spyOnEvent, waitForChanges } = await render(
        <form>
          <bq-select multiple={multiple} name="dynamic" value={value} onBqInput={showLoading}>
            <bq-option value="initial">Initial</bq-option>
          </bq-select>
        </form>,
      );
      const form = root as HTMLFormElement;
      const select = form.querySelector<HTMLBqSelectElement>('bq-select');
      const input = getInput(select);
      const bqInput = spyOnEvent('bqInput');
      const bqSelect = spyOnEvent('bqSelect');
      const bqClear = spyOnEvent('bqClear');

      await userEvent.click(input);
      await userEvent.fill(input, '  remote query  ');
      await waitForStable(root);

      expect(input.value).toBe('  remote query  ');
      input.setSelectionRange(3, 7);
      select.replaceChildren();
      await waitForStable(root);
      expect(input.value).toBe('  remote query  ');

      const result = createOption('remote', 'Remote result');
      select.append(createOption('initial', 'Initial updated'), result);
      await waitForChanges();
      await waitForStable(root);

      expect(getInput(select)).toBe(input);
      expect(input.value).toBe('  remote query  ');
      expect(select.shadowRoot.activeElement).toBe(input);
      expect(input.selectionStart).toBe(3);
      expect(input.selectionEnd).toBe(7);
      expect(select.value).toEqual(value);
      expect(new FormData(form).get('dynamic')).toBe(selected ? 'initial' : '');
      expect(form.checkValidity()).toBe(true);
      expect(result.hidden).toBe(false);
      expect(bqInput).toHaveReceivedEventTimes(1);
      expect(bqSelect).toHaveReceivedEventTimes(0);
      expect(bqClear).toHaveReceivedEventTimes(0);
      expect(select.querySelectorAll('bq-option[selected]')).toHaveLength(initialValues.length);

      await userEvent.click(getOptionSelectionControl(result));
      await waitForStable(root);

      const selectedValues = [...initialValues, 'remote'];
      expect(input.value).toBe(multiple ? '' : 'Remote result');
      expect(select.value).toEqual(multiple ? selectedValues : 'remote');
      expect(bqSelect).toHaveReceivedEventTimes(1);
    });

    it('should preserve the latest query through appends, mutations, empty results and named slots', async () => {
      const { root } = await render(
        <bq-select multiple={multiple} name="dynamic" onBqInput={(event) => event.preventDefault()}>
          <bq-option value="initial">Initial</bq-option>
        </bq-select>,
      );
      const select = root as HTMLBqSelectElement;
      const input = getInput(select);

      await userEvent.click(input);
      await userEvent.fill(input, 'older query');
      await waitForStable(root);
      await userEvent.fill(input, 'newer query');
      await waitForStable(root);
      input.setSelectionRange(2, 2);

      const olderResult = createOption('older', 'Older response');
      select.append(olderResult);
      await waitForStable(root);
      expect(input.value).toBe('newer query');

      olderResult.value = 'changed';
      await waitForStable(root);
      const label = document.createElement('span');
      label.slot = 'label';
      label.textContent = 'Dynamic label';
      select.append(label);
      await waitForStable(root);

      expect(input.value).toBe('newer query');
      expect(input.selectionStart).toBe(2);
      expect(input.selectionEnd).toBe(2);
      expect(select.shadowRoot.activeElement).toBe(input);

      const empty = createOption('empty', 'No results');
      empty.disabled = true;
      select.replaceChildren(empty);
      await waitForStable(root);
      expect(input.value).toBe('newer query');

      await userEvent.clear(input);
      await waitForStable(root);
      select.replaceChildren(createOption('restored', 'Restored'));
      await waitForStable(root);
      expect(input.value).toBe('');
    });

    it('should preserve search text when options change before the input debounce expires', async () => {
      const { root, spyOnEvent } = await render(
        <bq-select debounceTime={250} multiple={multiple} name="dynamic" onBqInput={(event) => event.preventDefault()}>
          <bq-option value="initial">Initial</bq-option>
        </bq-select>,
      );
      const select = root as HTMLBqSelectElement;
      const input = getInput(select);
      const bqInput = spyOnEvent('bqInput');

      await userEvent.click(input);
      await userEvent.fill(input, 'pending query');
      expect(bqInput).toHaveReceivedEventTimes(0);
      select.replaceChildren(createOption('result', 'Result'));
      await waitForStable(root);

      expect(input.value).toBe('pending query');
      await expect.poll(() => bqInput.events.length).toBe(1);
      expect(bqInput.events[0].detail.value).toBe('pending query');
    });

    it('should clear search for reset, clear, form reset and programmatic value changes', async () => {
      const value = multiple ? ['initial'] : 'initial';
      const { root, waitForChanges } = await render(
        <form>
          <bq-select multiple={multiple} name="dynamic" value={value} onBqInput={(event) => event.preventDefault()}>
            <bq-option value="initial">Initial</bq-option>
            <bq-option value="remote">Remote</bq-option>
          </bq-select>
        </form>,
      );
      const form = root as HTMLFormElement;
      const select = form.querySelector<HTMLBqSelectElement>('bq-select');
      const input = getInput(select);

      await userEvent.click(input);
      await userEvent.fill(input, 'query');
      await waitForStable(root);
      await select.reset(select.value);
      await waitForStable(root);
      expect(input.value).toBe(multiple ? '' : 'Initial');

      await userEvent.fill(input, 'query');
      await waitForStable(root);
      select.value = multiple ? ['remote'] : 'remote';
      await waitForChanges();
      await waitForStable(root);
      expect(input.value).toBe(multiple ? '' : 'Remote');

      await userEvent.fill(input, 'query');
      await waitForStable(root);
      form.reset();
      await waitForStable(root);
      expect(input.value).toBe('');
      expect(new FormData(form).get('dynamic')).toBe('');

      await userEvent.fill(input, 'query');
      await waitForStable(root);
      await select.clear();
      await waitForStable(root);
      expect(input.value).toBe('');
    });

    it('should cancel pending search work when explicitly cleared', async () => {
      const { root, spyOnEvent } = await render(
        <bq-select debounceTime={250} multiple={multiple} name="dynamic">
          <bq-option value="initial">Initial</bq-option>
        </bq-select>,
      );
      const select = root as HTMLBqSelectElement;
      const input = getInput(select);
      const bqInput = spyOnEvent('bqInput');

      await userEvent.click(input);
      await userEvent.fill(input, 'pending query');
      await select.clear();
      await sleep(300);
      await waitForStable(root);

      expect(input.value).toBe('');
      expect(select.querySelectorAll('bq-option[hidden]')).toHaveLength(0);
      expect(bqInput).toHaveReceivedEventTimes(0);
    });

    it('should retain built-in search text and filtering when options are appended', async () => {
      const { root, waitForChanges } = await render(
        <bq-select multiple={multiple} name="dynamic">
          <bq-option value="alpha">Alpha</bq-option>
          <bq-option value="beta">Beta</bq-option>
        </bq-select>,
      );
      const select = root as HTMLBqSelectElement;
      const input = getInput(select);

      await userEvent.click(input);
      await userEvent.fill(input, 'alp');
      await waitForChanges();
      select.append(createOption('alpine', 'Alpine'));
      await waitForChanges();
      await waitForStable(root);

      expect(input.value).toBe('alp');
      expect(select.querySelector('bq-option[value="alpha"]')).not.toHaveAttribute('hidden');
      expect(select.querySelector('bq-option[value="beta"]')).toHaveAttribute('hidden');
    });

    it('should preserve a query after closing and blurring the input', async () => {
      const { root, setProps, waitForChanges } = await render(
        <bq-select multiple={multiple} name="dynamic" onBqInput={(event) => event.preventDefault()}>
          <bq-option value="initial">Initial</bq-option>
        </bq-select>,
      );
      const select = root as HTMLBqSelectElement;
      const input = getInput(select);

      await userEvent.click(input);
      await userEvent.fill(input, 'query');
      await waitForStable(root);
      input.blur();
      await setProps({ open: false });
      select.replaceChildren(createOption('result', 'Result'));
      await waitForChanges();
      await waitForStable(root);

      expect(input.value).toBe('query');
      expect(getDropdown(select)).not.toHaveAttribute('open');
    });

    it('should end search when the selection mode changes', async () => {
      const { root, setProps } = await render(
        <bq-select
          multiple={multiple}
          name="dynamic"
          value={multiple ? ['initial'] : 'initial'}
          onBqInput={(event) => event.preventDefault()}
        >
          <bq-option value="initial">Initial</bq-option>
        </bq-select>,
      );
      const select = root as HTMLBqSelectElement;
      const input = getInput(select);

      await userEvent.click(input);
      await userEvent.fill(input, 'query');
      await waitForStable(root);
      await setProps({ multiple: !multiple });
      await waitForStable(root);

      expect(input.value).toBe(multiple ? 'Initial' : '');
    });

    it('should update idle selected labels when options are replaced', async () => {
      const { root, waitForChanges } = await render(
        <bq-select multiple={multiple} name="dynamic" value={multiple ? ['initial'] : 'initial'}>
          <bq-option value="initial">Initial</bq-option>
        </bq-select>,
      );
      const select = root as HTMLBqSelectElement;

      select.replaceChildren(createOption('initial', 'Updated label'));
      await waitForChanges();
      await waitForStable(root);

      expect(select.querySelector('bq-option')).toHaveAttribute('selected');
      if (multiple) {
        expect(select.shadowRoot.querySelector('bq-tag')?.textContent?.trim()).toBe('Updated label');
        expect(getInput(select).value).toBe('');
      } else {
        expect(getInput(select).value).toBe('Updated label');
      }
    });
  });

  it('should restore the selected label when the same single-select option is selected again', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="dynamic" value="initial" onBqInput={(event) => event.preventDefault()}>
        <bq-option value="initial">Initial</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);

    await userEvent.click(input);
    await userEvent.fill(input, 'query');
    await waitForStable(root);
    await userEvent.click(getOptionButton(select.querySelector<HTMLBqOptionElement>('bq-option')));
    await waitForChanges();
    await waitForStable(root);

    expect(select.value).toBe('initial');
    expect(input.value).toBe('Initial');
  });

  it('should not apply stale filtering after a consumer changes value inside bqInput', async () => {
    const { root, waitForChanges } = await render(
      <bq-select
        name="dynamic"
        onBqInput={(event) => {
          (event.target as HTMLBqSelectElement).value = 'initial';
        }}
      >
        <bq-option value="initial">Initial</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);

    await userEvent.click(input);
    await userEvent.fill(input, 'unmatched query');
    await waitForChanges();
    await waitForStable(root);

    expect(input.value).toBe('Initial');
    expect(select.querySelector('bq-option')).not.toHaveAttribute('hidden');
  });

  it('should retain search through nested value normalization and slot mutations', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="dynamic" value={['child']} onBqInput={(event) => event.preventDefault()}>
        <bq-option value="child">Child</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const parent = createOption('parent', 'Parent');
    const child = createOption('child', 'Child');
    parent.append(child);

    await userEvent.click(input);
    await userEvent.fill(input, 'query');
    await waitForStable(root);
    select.replaceChildren(parent);
    await waitForStable(root);
    child.slot = 'options';
    await waitForChanges();
    await waitForStable(root);

    expect(input.value).toBe('query');
    expect(select.value).toEqual(['parent', 'child']);
    expect(input).toEqualAttribute('aria-haspopup', 'tree');
    expect(getOptionCheckbox(child)).not.toBeNull();
  });

  it('should reset nested search visibility without expanding unmatched parents', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select">
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
        <bq-option value="backend">
          Backend
          <bq-option slot="options" value="node">
            Node.js
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const backendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="backend"]');

    await userEvent.click(input);
    await userEvent.fill(input, 'rea');
    await waitForChanges();

    expect(frontendOption.expanded).toBe(true);
    expect(backendOption.expanded).toBe(false);
    expect(backendOption.hidden).toBe(true);

    await userEvent.clear(input);
    await waitForChanges();

    expect(frontendOption.hidden).toBe(false);
    expect(backendOption.hidden).toBe(false);
    expect(backendOption.expanded).toBe(false);
  });

  it('should use tree semantics for nested options', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select">
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
        <bq-option value="backend">Backend</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const optionList = select.shadowRoot?.querySelector<HTMLBqOptionListElement>('bq-option-list');
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const backendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="backend"]');

    await waitForChanges();
    await waitForStable(root);

    expect(getInput(select)).toEqualAttribute('aria-haspopup', 'tree');
    expect(optionList).toEqualAttribute('role', 'tree');
    expect(optionList).toEqualAttribute('aria-multiselectable', 'true');
    expect(frontendOption).toEqualAttribute('role', 'treeitem');
    expect(reactOption).toEqualAttribute('role', 'treeitem');
    expect(backendOption).toEqualAttribute('role', 'treeitem');
    expect(frontendOption).toEqualAttribute('tabindex', '0');
    expect(reactOption).toEqualAttribute('tabindex', '-1');
    expect(backendOption).toEqualAttribute('tabindex', '-1');
  });

  it('should expose nested checkbox states through tree items', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select" value={['frontend', 'react']}>
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
          <bq-option slot="options" value="stencil">
            Stencil
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const parentOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const childOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');

    await waitForChanges();

    expect(parentOption).toEqualAttribute('aria-checked', 'mixed');
    expect(parentOption).not.toHaveAttribute('aria-selected');
    expect(getOptionCheckbox(parentOption)).toEqualAttribute('aria-hidden', 'true');
    expect(getOptionCheckboxInput(parentOption)).toEqualAttribute('tabindex', '-1');
    expect(childOption).toEqualAttribute('aria-checked', 'true');
    expect(childOption).not.toHaveAttribute('aria-selected');
  });

  it('should open and navigate flat options with Arrow Down and Arrow Up', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="alpha">Alpha</bq-option>
        <bq-option value="beta">Beta</bq-option>
        <bq-option value="gamma">Gamma</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const alphaOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="alpha"]');
    const betaOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="beta"]');

    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    expect(select.open).toBe(true);
    expect(document.activeElement).toBe(alphaOption);

    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    expect(document.activeElement).toBe(betaOption);

    await userEvent.keyboard('{ArrowUp}');
    await waitForChanges();

    expect(document.activeElement).toBe(alphaOption);
  });

  it('should skip disabled and hidden options during keyboard navigation', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="alpha">Alpha</bq-option>
        <bq-option disabled value="beta">
          Beta
        </bq-option>
        <bq-option hidden value="gamma">
          Gamma
        </bq-option>
        <bq-option value="delta">Delta</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const deltaOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="delta"]');

    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    expect(document.activeElement).toBe(deltaOption);
  });

  it('should navigate nested options with roving tree focus', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select">
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
          <bq-option slot="options" value="stencil">
            Stencil
          </bq-option>
        </bq-option>
        <bq-option value="backend">Backend</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const stencilOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="stencil"]');
    const backendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="backend"]');

    input.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    expect(select.open).toBe(true);
    expect(document.activeElement).toBe(frontendOption);

    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();

    expect(frontendOption.expanded).toBe(true);
    expect(document.activeElement).toBe(frontendOption);

    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();

    expect(document.activeElement).toBe(reactOption);
    expect(reactOption).toEqualAttribute('tabindex', '0');
    expect(frontendOption).toEqualAttribute('tabindex', '-1');

    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();

    expect(document.activeElement).toBe(stencilOption);

    await userEvent.keyboard('{End}');
    await waitForChanges();

    expect(document.activeElement).toBe(backendOption);

    await userEvent.keyboard('{Home}');
    await waitForChanges();

    expect(document.activeElement).toBe(frontendOption);

    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();

    expect(document.activeElement).toBe(frontendOption);

    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();

    expect(frontendOption.expanded).toBe(false);
    expect(document.activeElement).toBe(frontendOption);
  });

  it('should cascade nested parent selection without selecting on expand', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select multiple name="bq-select" keepOpenOnSelect>
        <bq-option expanded value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const bqSelect = spyOnEvent('bqSelect');

    await userEvent.click(getControl(select));
    await waitForChanges();

    await userEvent.click(getOptionExpandButtonControl(frontendOption));
    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventTimes(0);
    expect(select.value).toEqual([]);

    await userEvent.click(getOptionSelectionControl(frontendOption));
    await waitForChanges();

    expect(frontendOption).toHaveAttribute('selected');
    expect(reactOption).toHaveAttribute('selected');
    expect(select.value).toEqual(['frontend', 'react']);
    expect(bqSelect).toHaveReceivedEventTimes(1);

    await userEvent.click(getOptionExpandButtonControl(frontendOption));
    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventTimes(1);

    await userEvent.click(getOptionSelectionControl(frontendOption));
    await waitForChanges();

    expect(frontendOption).not.toHaveAttribute('selected');
    expect(reactOption).not.toHaveAttribute('selected');
    expect(select.value).toEqual([]);
    expect(bqSelect).toHaveReceivedEventTimes(2);
  });

  it('should select ancestors, expose indeterminate state, and emit the nested selection tree', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select multiple name="skills" keepOpenOnSelect>
        <bq-option expanded value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
          <bq-option slot="options" value="stencil">
            Stencil
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const stencilOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="stencil"]');
    const bqSelect = spyOnEvent('bqSelect');

    await userEvent.click(getControl(select));
    await userEvent.click(getOptionCheckboxBase(reactOption));
    await waitForChanges();

    expect(select.value).toEqual(['frontend', 'react']);
    expect(frontendOption).toHaveAttribute('selected');
    expect(getOptionCheckboxInput(frontendOption)?.indeterminate).toBe(true);
    expect(getOptionCheckboxInput(frontendOption)).toEqualAttribute('aria-checked', 'mixed');
    expect(getOptionSelectionSummary(frontendOption)).toHaveTextContent('1 selected');
    expect(select.shadowRoot?.querySelectorAll('bq-tag')).toHaveLength(1);
    expect(select.shadowRoot?.querySelector('bq-tag')?.textContent).toContain('Frontend (1)');
    expect(bqSelect.events[0].detail.value).toEqual(['frontend', 'react']);
    expect(bqSelect.events[0].detail.selectionTree).toEqual([
      { children: [{ children: [], value: 'react' }], value: 'frontend' },
    ]);

    await userEvent.click(getOptionCheckboxBase(frontendOption));
    await waitForChanges();

    expect(select.value).toEqual(['frontend', 'react', 'stencil']);
    expect(stencilOption).toHaveAttribute('selected');
    expect(getOptionCheckboxInput(frontendOption)?.checked).toBe(true);
    expect(getOptionCheckboxInput(frontendOption)?.indeterminate).toBe(false);
    expect(getOptionSelectionSummary(frontendOption)).toHaveTextContent('All selected');
    expect(select.shadowRoot?.querySelectorAll('bq-tag')).toHaveLength(1);
    expect(select.shadowRoot?.querySelector('bq-tag')?.textContent).toContain('Frontend');
    expect(select.shadowRoot?.querySelector('bq-tag')?.textContent).not.toContain('(');
    expect(bqSelect.events[1].detail.selectionTree).toEqual([
      {
        children: [
          { children: [], value: 'react' },
          { children: [], value: 'stencil' },
        ],
        value: 'frontend',
      },
    ]);

    await userEvent.click(getOptionCheckboxBase(stencilOption));
    await waitForChanges();

    expect(select.value).toEqual(['frontend', 'react']);
    expect(getOptionCheckboxInput(frontendOption)?.checked).toBe(false);
    expect(getOptionCheckboxInput(frontendOption)?.indeterminate).toBe(true);

    await userEvent.click(getOptionCheckboxBase(reactOption));
    await waitForChanges();

    expect(select.value).toEqual([]);
    expect(frontendOption).not.toHaveAttribute('selected');
    expect(getOptionCheckboxInput(frontendOption)?.checked).toBe(false);
    expect(getOptionCheckboxInput(frontendOption)?.indeterminate).toBe(false);
    expect(bqSelect.events.at(-1)?.detail.selectionTree).toEqual([]);
  });

  it('should cascade selections and emit the selection tree across three nesting levels', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select multiple name="skills" keepOpenOnSelect>
        <bq-option expanded value="frontend">
          Frontend
          <bq-option expanded slot="options" value="frameworks">
            Frameworks
            <bq-option slot="options" value="react">
              React
            </bq-option>
            <bq-option slot="options" value="stencil">
              Stencil
            </bq-option>
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const frameworksOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frameworks"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const bqSelect = spyOnEvent('bqSelect');

    await userEvent.click(getControl(select));
    await userEvent.click(getOptionCheckboxBase(reactOption));
    await waitForChanges();

    expect(select.value).toEqual(['frontend', 'frameworks', 'react']);
    expect(getOptionCheckboxInput(frontendOption)?.indeterminate).toBe(true);
    expect(getOptionCheckboxInput(frameworksOption)?.indeterminate).toBe(true);
    expect(bqSelect.events[0].detail.selectionTree).toEqual([
      {
        children: [
          {
            children: [{ children: [], value: 'react' }],
            value: 'frameworks',
          },
        ],
        value: 'frontend',
      },
    ]);

    await userEvent.click(getOptionCheckboxBase(frameworksOption));
    await waitForChanges();

    expect(select.value).toEqual(['frontend', 'frameworks', 'react', 'stencil']);
    expect(getOptionCheckboxInput(frontendOption)?.checked).toBe(true);
    expect(getOptionCheckboxInput(frameworksOption)?.checked).toBe(true);
    expect(bqSelect.events[1].detail.selectionTree).toEqual([
      {
        children: [
          {
            children: [
              { children: [], value: 'react' },
              { children: [], value: 'stencil' },
            ],
            value: 'frameworks',
          },
        ],
        value: 'frontend',
      },
    ]);
  });

  it('should not cascade selection to disabled or hidden nested options', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="skills" keepOpenOnSelect>
        <bq-option expanded value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
          <bq-option disabled slot="options" value="legacy">
            Legacy
          </bq-option>
          <bq-option hidden slot="options" value="private">
            Private
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const legacyOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="legacy"]');
    const privateOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="private"]');

    await userEvent.click(getControl(select));
    await userEvent.click(getOptionCheckboxBase(frontendOption));
    await waitForChanges();

    expect(select.value).toEqual(['frontend', 'react']);
    expect(reactOption).toHaveAttribute('selected');
    expect(legacyOption).not.toHaveAttribute('selected');
    expect(privateOption).not.toHaveAttribute('selected');
  });

  it('should synchronize nested external values, resets, clears, and tag removal', async () => {
    const { root, setProps, spyOnEvent, waitForChanges } = await render(
      <bq-select multiple name="skills" value={['react']}>
        <bq-option expanded value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
          <bq-option slot="options" value="stencil">
            Stencil
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const bqSelect = spyOnEvent('bqSelect');

    await waitForChanges();
    expect(select.value).toEqual(['frontend', 'react']);

    await setProps({ value: ['frontend', 'react', 'stencil'] });
    await waitForChanges();
    await select.reset(['react']);
    await waitForChanges();
    expect(select.value).toEqual(['frontend', 'react']);

    const frontendTag = Array.from(select.shadowRoot?.querySelectorAll<HTMLBqTagElement>('bq-tag') ?? []).find((tag) =>
      tag.textContent?.includes('Frontend'),
    );
    const closeButton = frontendTag?.shadowRoot?.querySelector<HTMLElement>('[part="btn-close"]');

    expect(frontendTag).toBeDefined();
    expect(closeButton).not.toBeNull();
    await userEvent.click(closeButton);
    await waitForChanges();

    expect(select.value).toEqual([]);
    expect(bqSelect.events.at(-1)?.detail.selectionTree).toEqual([]);

    await select.clear();
    await waitForChanges();
    expect(select.value).toEqual([]);
  });

  it('should clear nested selection state when its form resets', async () => {
    const { waitForChanges } = await render(
      <form>
        <bq-select multiple name="skills" value={['react']}>
          <bq-option expanded value="frontend">
            Frontend
            <bq-option slot="options" value="react">
              React
            </bq-option>
          </bq-option>
        </bq-select>
      </form>,
    );
    const form = document.querySelector('form') as HTMLFormElement;
    const select = form.querySelector<HTMLBqSelectElement>('bq-select');

    await waitForChanges();
    expect(select.value).toEqual(['frontend', 'react']);

    form.reset();
    await waitForChanges();

    expect(select.value).toEqual([]);
    expect(form.querySelectorAll('bq-option[selected]')).toHaveLength(0);
  });

  it('should select the focused nested child with Enter and Space and select its parent', async () => {
    const { root, setProps, spyOnEvent, waitForChanges } = await render(
      <bq-select multiple name="bq-select" keepOpenOnSelect>
        <bq-option expanded value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const bqSelect = spyOnEvent('bqSelect');

    await userEvent.click(getControl(select));
    await waitForChanges();

    reactOption.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(frontendOption).toHaveAttribute('selected');
    expect(reactOption).toHaveAttribute('selected');
    expect(document.activeElement).toBe(reactOption);
    expect(bqSelect).toHaveReceivedEventTimes(1);

    await setProps({ value: [] });
    await waitForChanges();
    reactOption.focus();
    await userEvent.keyboard(' ');
    await waitForChanges();

    expect(frontendOption).toHaveAttribute('selected');
    expect(reactOption).toHaveAttribute('selected');
    expect(document.activeElement).toBe(reactOption);
    expect(bqSelect).toHaveReceivedEventTimes(2);
  });

  it('should retain search expansion for a selected descendant unless the user collapses it', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select" value={['react']}>
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');

    await waitForStable(root);
    await userEvent.click(input);
    await userEvent.fill(input, 'rea');
    await waitForChanges();

    expect(reactOption.selected).toBe(true);
    expect(frontendOption.expanded).toBe(true);

    setDropdownOpen(select, false);
    await waitForChanges();

    expect(frontendOption.expanded).toBe(true);

    setDropdownOpen(select, true);
    await waitForChanges();
    await userEvent.click(getOptionExpandButtonControl(frontendOption));
    await waitForStable(root);
    setDropdownOpen(select, false);
    await waitForChanges();

    expect(frontendOption.expanded).toBe(false);
  });

  it('should render nested markup as flat options in single select mode', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" value="react">
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
        <bq-option value="backend">Backend</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const parentOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const childOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    const optionList = select.shadowRoot?.querySelector<HTMLBqOptionListElement>('bq-option-list');
    const bqSelect = spyOnEvent('bqSelect');

    await waitForChanges();
    await waitForStable(root);

    expect(select.value).toBe('');
    expect(getInput(select)).toEqualAttribute('aria-haspopup', 'listbox');
    expect(optionList).toEqualAttribute('role', 'listbox');
    expect(parentOption).toEqualAttribute('role', 'option');
    expect(parentOption).toEqualAttribute('aria-selected', 'false');
    expect(getOptionExpandButton(parentOption)).toBeNull();
    expect(parentOption.shadowRoot?.querySelector('[part="options"]')).toBeNull();
    expect(childOption).not.toHaveAttribute('selected');

    await userEvent.click(getControl(select));
    await userEvent.click(getOptionSelectionControl(parentOption));
    await waitForChanges();

    expect(select.value).toBe('frontend');
    expect(bqSelect).toHaveReceivedEventTimes(1);
  });

  it('should warn once when nested options are used without multiple', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const nestedOptionsWarning =
      '[BqSelect] Nested options require `multiple` to be enabled. Nested descendants are unavailable.';
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select">
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
      </bq-select>,
    );

    await waitForChanges();
    await setProps({ value: 'react' });
    await waitForChanges();

    expect(root).toEqualAttribute('value', '');
    expect(warn.mock.calls.filter(([message]) => message === nestedOptionsWarning)).toHaveLength(1);
  });

  it('should report duplicate nested option values once, including dynamically added options', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select">
        <bq-option value="javascript">
          JavaScript
          <bq-option slot="options" value="javascript:beginner">
            Beginner
          </bq-option>
        </bq-option>
        <bq-option value="react">
          React
          <bq-option slot="options" value="react:beginner">
            Beginner
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const reactOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');
    await waitForChanges();

    const duplicateOption = document.createElement('bq-option');
    duplicateOption.slot = 'options';
    duplicateOption.value = 'javascript:beginner';
    reactOption.append(duplicateOption);
    await waitForChanges();

    expect(error).toHaveBeenCalledTimes(1);
    expect(error).toHaveBeenCalledWith(
      '[BqSelect] Duplicate option value "javascript:beginner" detected. Option values must be unique within a nested select.',
    );

    const uniqueOption = document.createElement('bq-option');
    uniqueOption.slot = 'options';
    uniqueOption.value = 'react:advanced';
    reactOption.append(uniqueOption);
    await waitForChanges();

    expect(error).toHaveBeenCalledTimes(1);

    uniqueOption.value = 'javascript';
    await waitForChanges();

    expect(error).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenLastCalledWith(
      '[BqSelect] Duplicate option value "javascript" detected. Option values must be unique within a nested select.',
    );
  });

  it('should clear nested selections when changing from multiple to single select', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-select multiple name="bq-select" value={['react']}>
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const parentOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');
    const childOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="react"]');

    await waitForStable(root);
    expect(childOption).toHaveAttribute('selected');

    await setProps({ multiple: false });
    await waitForChanges();

    expect(select.value).toBe('');
    expect(parentOption).toEqualAttribute('role', 'option');
    expect(getOptionExpandButton(parentOption)).toBeNull();
    expect(childOption).not.toHaveAttribute('selected');

    await setProps({ multiple: true, value: ['react'] });
    await waitForChanges();

    expect(parentOption).toEqualAttribute('role', 'treeitem');
    expect(childOption).toHaveAttribute('selected');
  });

  it('should preserve a user expansion after search closes', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple name="bq-select">
        <bq-option value="frontend">
          Frontend
          <bq-option slot="options" value="react">
            React
          </bq-option>
        </bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const frontendOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="frontend"]');

    await userEvent.click(input);
    await userEvent.fill(input, 'rea');
    await waitForChanges();
    await userEvent.click(getOptionExpandButtonControl(frontendOption));
    await waitForStable(root);
    await userEvent.click(getOptionExpandButtonControl(frontendOption));
    await waitForStable(root);
    setDropdownOpen(select, false);
    await waitForChanges();

    expect(frontendOption.expanded).toBe(true);
  });

  it('should disable typing while allowing option selection when disableSearch is true', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select name="bq-select" disableSearch value="alpha">
        <bq-option value="alpha">Alpha</bq-option>
        <bq-option value="beta">Beta</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const betaOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="beta"]');
    const bqInput = spyOnEvent('bqInput');

    expect(input.readOnly).toBe(true);

    await userEvent.click(input);
    await userEvent.keyboard('bet');
    await waitForChanges();

    expect(input.value).toBe('Alpha');
    expect(bqInput).toHaveReceivedEventTimes(0);
    expect(root.querySelectorAll('bq-option[hidden]')).toHaveLength(0);
    expect(getDropdown(select)).toHaveAttribute('open');

    input.setSelectionRange(0, input.value.length);
    await userEvent.click(getOptionButton(betaOption));
    await waitForChanges();

    expect(betaOption).toHaveAttribute('selected');
    expect(select.value).toBe('beta');
    expect(input.value).toBe('Beta');
    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);
    expect(select.shadowRoot.activeElement).toBe(input);
  });

  it('should collapse the selection after keyboard selection when readonly', async () => {
    const { root, waitForChanges } = await render(
      <bq-select name="bq-select" readonly value="alpha">
        <bq-option value="alpha">Alpha</bq-option>
        <bq-option value="beta">Beta</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);
    const betaOption = root.querySelector<HTMLBqOptionElement>('bq-option[value="beta"]');

    await userEvent.click(getControl(select));
    await waitForChanges();

    input.setSelectionRange(0, input.value.length);
    const betaButton = getOptionButton(betaOption);
    betaButton.focus();
    betaButton.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, composed: true, key: 'Enter' }));
    await waitForChanges();

    expect(input.value).toBe('Beta');
    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);
    expect(select.shadowRoot.activeElement).toBe(input);

    await userEvent.click(input);
    await waitForChanges();

    expect(getDropdown(select)).toHaveAttribute('open');
    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);

    input.setSelectionRange(0, input.value.length);
    await userEvent.click(input);
    await waitForChanges();

    expect(getDropdown(select)).not.toHaveAttribute('open');
    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  it('should collapse retained selection whenever a readonly input receives focus', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <button type="button">Before select</button>
        <bq-select name="bq-select" readonly value="alpha" />
      </div>,
    );
    const select = root.querySelector<HTMLBqSelectElement>('bq-select');
    const input = getInput(select);

    input.setSelectionRange(0, input.value.length);
    input.focus();
    await waitForChanges();

    expect(select.shadowRoot.activeElement).toBe(input);
    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);

    input.blur();
    root.querySelector('button').focus();
    input.setSelectionRange(0, input.value.length);
    await userEvent.tab();
    await waitForChanges();

    expect(select.shadowRoot.activeElement).toBe(input);
    expect(input.selectionStart).toBe(input.value.length);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  it('should preserve native selection for searchable inputs', async () => {
    const { root } = await render(<bq-select name="bq-select" value="alpha" />);
    const select = root as HTMLBqSelectElement;
    const input = getInput(select);

    input.focus();
    input.setSelectionRange(0, input.value.length);
    input.dispatchEvent(new Event('select', { bubbles: true }));

    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
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
    const { root, setProps } = await render(
      <bq-select name="bq-select" maxTagsVisible={1} multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await setProps({ value: ['1', '2', '3'] });

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
    const { root, setProps, waitForChanges } = await render(
      <bq-select name="bq-select" multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;

    await setProps({ value: ['1', '2', '3'] });

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

  it('should cancel pending input work when disconnected', async () => {
    const { root, spyOnEvent } = await render(
      <bq-select debounceTime={250} name="bq-select">
        <bq-option value="alpha">Alpha</bq-option>
      </bq-select>,
    );
    const select = root as HTMLBqSelectElement;
    const bqInput = spyOnEvent('bqInput');
    const input = getInput(select);

    await userEvent.click(input);
    await userEvent.type(input, 'a');
    select.remove();
    await sleep(300);

    expect(bqInput).toHaveReceivedEventTimes(0);
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

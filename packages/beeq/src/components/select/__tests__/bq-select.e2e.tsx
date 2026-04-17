import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getInput = (select: HTMLBqSelectElement) => select.shadowRoot?.querySelector('input') as HTMLInputElement;
const getControl = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector('.bq-select__control') as HTMLElement;
const getDropdown = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector('bq-dropdown') as HTMLBqDropdownElement;
const getClearButton = (select: HTMLBqSelectElement) =>
  select.shadowRoot?.querySelector('bq-button')?.shadowRoot?.querySelector('[part="button"]') as HTMLButtonElement;
const getOptionButton = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;

describe('bq-select', () => {
  it('should render', async () => {
    const { root } = await render(<bq-select />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-select />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render the default suffix icon', async () => {
    const { root } = await render(<bq-select />);

    expect(root.shadowRoot?.querySelector('bq-icon[name="caret-down"]')).not.toBeNull();
  });

  it('should render with prefix icon', async () => {
    const { root } = await render(
      <bq-select>
        <bq-icon name="user-circle" slot="prefix" />
      </bq-select>,
    );

    await waitForStable(root);

    expect(root.shadowRoot?.querySelector('.bq-select__control--prefix')).not.toHaveClass('!hidden');
  });

  it('should render with label content', async () => {
    const { root } = await render(
      <bq-select>
        <span slot="label">Select label</span>
      </bq-select>,
    );

    await waitForStable(root);

    expect(root.shadowRoot?.querySelector('.bq-select__label')).not.toHaveClass('!hidden');
  });

  it('should render with helper content', async () => {
    const { root } = await render(
      <bq-select>
        <span slot="helper-text">Helper text</span>
      </bq-select>,
    );

    await waitForStable(root);

    expect(root.shadowRoot?.querySelector('.bq-select__helper-text')).not.toHaveClass('!hidden');
  });

  it('should render with options', async () => {
    const { root } = await render(
      <bq-select>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );

    expect(root.querySelectorAll('bq-option')).toHaveLength(3);
  });

  it('should render with selected option', async () => {
    const { root, waitForChanges } = await render(
      <bq-select value="1">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );

    await waitForChanges();

    expect(root.querySelector('bq-option[value="1"]')).toHaveAttribute('selected');
    expect(getInput(root).value).toBe('Option 1');
  });

  it('should select an option and emit bqSelect', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const bqSelect = spyOnEvent('bqSelect');
    const option = root.querySelector('bq-option[value="2"]') as HTMLBqOptionElement;

    await userEvent.click(getControl(root));
    await waitForChanges();

    expect(getDropdown(root)).toHaveAttribute('open');
    expect(option).not.toHaveAttribute('selected');

    await userEvent.click(getOptionButton(option));
    await waitForChanges();

    expect(getDropdown(root)).not.toHaveAttribute('open');
    expect(option).toHaveAttribute('selected');
    expect(getInput(root).value).toBe('Option 2');
    expect(bqSelect).toHaveReceivedEventTimes(1);
  });

  it('should render tags for multiple selected options', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );

    root.value = ['1', '2'];
    await waitForChanges();

    const selectedValueElements = root.querySelectorAll('bq-option[selected]');
    const displayTags = root.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(selectedValueElements).toHaveLength(2);
    expect(displayTags).toHaveLength(2);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
    expect(displayTags[1].textContent?.trim()).toContain('Option 2');
  });

  it('should rerender when value changes externally', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );

    root.value = ['1', '2'];
    await waitForChanges();
    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(2);

    root.value = ['3'];
    await waitForChanges();

    const displayTags = root.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(1);
    expect(displayTags).toHaveLength(1);
    expect(displayTags[0].textContent?.trim()).toContain('Option 3');
  });

  it('should remove the last selected option on Backspace when the input is empty', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );

    root.value = ['1', '2'];
    await waitForChanges();

    const input = getInput(root);
    await userEvent.click(input);
    await userEvent.keyboard('{Backspace}');
    await waitForChanges();

    const displayTags = root.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(1);
    expect(displayTags).toHaveLength(1);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
  });

  it('should keep selected options when Backspace is used while typing', async () => {
    const { root, waitForChanges } = await render(
      <bq-select multiple>
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );

    root.value = ['1', '2'];
    await waitForChanges();

    const input = getInput(root);
    await userEvent.click(input);
    await userEvent.keyboard('Option 3');
    await waitForChanges();
    await userEvent.keyboard('{Backspace}{Backspace}');
    await waitForChanges();

    const displayTags = root.shadowRoot?.querySelectorAll('bq-tag') ?? [];

    expect(displayTags).toHaveLength(2);
    expect(displayTags[0].textContent?.trim()).toContain('Option 1');
    expect(displayTags[1].textContent?.trim()).toContain('Option 2');
    expect(input.value).toBe('Option');
  });

  it('should clear the current value and emit bqClear', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-select value="2">
        <bq-option value="1">Option 1</bq-option>
        <bq-option value="2">Option 2</bq-option>
        <bq-option value="3">Option 3</bq-option>
      </bq-select>,
    );
    const bqClear = spyOnEvent('bqClear');

    await waitForChanges();
    await userEvent.click(getClearButton(root));
    await waitForChanges();

    expect(root.value).toBe('');
    expect(getInput(root).value).toBe('');
    expect(root.querySelectorAll('bq-option[selected]')).toHaveLength(0);
    expect(bqClear).toHaveReceivedEventTimes(1);
  });
});

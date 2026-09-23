import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

const getOptionCheckbox = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLBqCheckboxElement>('bq-checkbox');
const getCheckboxInput = (checkbox?: HTMLBqCheckboxElement) => checkbox?.shadowRoot?.querySelector('[part="input"]');
const getCheckboxBase = (checkbox?: HTMLBqCheckboxElement) => checkbox?.shadowRoot?.querySelector('[part="base"]');
const getExpandButton = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLBqButtonElement>('[part="expand"]');
const getExpandButtonControl = (option: HTMLBqOptionElement) =>
  getExpandButton(option)?.shadowRoot?.querySelector<HTMLButtonElement>('[part="button"]');
const getNestedOptions = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLElement>('[part="options"]');
const getSelectionSummary = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLElement>('[part="selection-summary"]');

describe('bq-option', () => {
  it('should render', async () => {
    const { root } = await render(<bq-option>Option label</bq-option>);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-option>Option label</bq-option>);

    expect(root).toHaveShadowRoot();
  });

  it('should have role="option"', async () => {
    const { root } = await render(<bq-option>Option label</bq-option>);

    expect(root).toEqualAttribute('role', 'option');
  });

  it('should display text', async () => {
    const text = 'Option label';
    const { root } = await render(<bq-option>{text}</bq-option>);

    expect(root).toEqualText(text);
  });

  it('should reflect `value` attribute', async () => {
    const { root } = await render(<bq-option value="pizza">Pizza</bq-option>);

    expect(root).toEqualAttribute('value', 'pizza');
  });

  it('should reflect `display-value` attribute', async () => {
    const { root } = await render(<bq-option displayValue="Pizza slice">Pizza</bq-option>);

    expect(root).toEqualAttribute('display-value', 'Pizza slice');
  });

  it('should trigger bqClick', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-option>Option label</bq-option>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');

    const element = root.shadowRoot?.querySelector<HTMLButtonElement>('button[part="base"]');

    element?.click();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should be keyboard accessible', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-option>Option label</bq-option>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');
    const target = root.shadowRoot?.querySelector<HTMLElement>('[tabindex]');

    target?.focus();
    target?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        composed: true,
      }),
    );

    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should handle Enter', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bq-option>Option label</bq-option>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');
    const bqEnter = spyOnEvent('bqEnter');

    const target = root.shadowRoot?.querySelector<HTMLElement>('[tabindex]');

    target?.focus();
    target?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      }),
    );

    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqEnter).toHaveReceivedEventTimes(1);
  });

  it('should handle `disabled` property', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bq-option disabled>Option label</bq-option>);
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');

    const element = root.shadowRoot?.querySelector<HTMLButtonElement>('button[part="base"]');

    element?.click();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should handle `hidden` property', async () => {
    const { root, waitForChanges, spyOnEvent } = await render(<bq-option hidden>Option label</bq-option>);
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');

    const element = root.shadowRoot?.querySelector<HTMLButtonElement>('button[part="base"]');

    element?.click();
    await waitForChanges();

    expect(root).toEqualAttribute('aria-hidden', 'true');
    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
  });

  it('should set aria-selected when `selected` is true', async () => {
    const { root } = await render(<bq-option selected>Option 1</bq-option>);

    expect(root).toEqualAttribute('aria-selected', 'true');
  });

  it('should expose the option label and checkbox states accessibly', async () => {
    const { root } = await render(
      <bq-option checkbox disabled selected value="option-value">
        Option label
      </bq-option>,
    );
    const option = root as HTMLBqOptionElement;
    const checkbox = getOptionCheckbox(option);
    const input = getCheckboxInput(checkbox);
    const base = getCheckboxBase(checkbox);

    await waitForStable(root);

    expect(option).toEqualAttribute('aria-selected', 'true');
    expect(option).toEqualAttribute('aria-disabled', 'true');
    expect(base).toEqualAttribute('aria-label', 'Option label');
    expect(input).toEqualAttribute('aria-checked', 'true');
    expect(input).toEqualAttribute('aria-disabled', 'true');
  });

  it('should expose an indeterminate checkbox state', async () => {
    const { root } = await render(
      <bq-option checkbox indeterminate value="option-value">
        Option label
      </bq-option>,
    );
    const checkbox = getOptionCheckbox(root as HTMLBqOptionElement);
    const input = getCheckboxInput(checkbox) as HTMLInputElement;

    await waitForStable(root);

    expect(input.indeterminate).toBe(true);
    expect(input).toEqualAttribute('aria-checked', 'mixed');
  });

  it('should toggle from the checkbox with Space and emit focus and blur once', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option checkbox value="option-value">
        Option label
      </bq-option>,
    );
    const checkbox = getOptionCheckbox(root as HTMLBqOptionElement);
    const input = getCheckboxInput(checkbox) as HTMLInputElement;
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');

    await waitForStable(root);
    await checkbox?.vFocus();
    await waitForChanges();
    expect(checkbox?.shadowRoot?.activeElement).toBe(input);
    expect(bqFocus).toHaveReceivedEventTimes(1);

    await userEvent.keyboard(' ');
    await waitForChanges();

    expect((getCheckboxInput(checkbox) as HTMLInputElement).checked).toBe(true);
    expect(bqClick).toHaveReceivedEventTimes(1);

    await checkbox?.vBlur();
    await waitForChanges();
    expect(checkbox?.shadowRoot?.activeElement).toBeNull();
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should render prefix element', async () => {
    const { root } = await render(
      <bq-option value="option1">
        <span slot="prefix">Prefix</span>
        <span>Option label</span>
      </bq-option>,
    );

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="prefix"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Prefix');
  });

  it('should render suffix element', async () => {
    const { root } = await render(
      <bq-option value="option1">
        <span>Option label</span>
        <span slot="suffix">Suffix</span>
      </bq-option>,
    );

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="suffix"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Suffix');
  });

  it('should handle `selected` property', async () => {
    const { root } = await render(<bq-option selected>Option 1</bq-option>);

    const optionItem = root.shadowRoot?.querySelector('[part="item"]');

    expect(optionItem).not.toBeNull();
    expect(root).toHaveAttribute('selected');
  });

  it('should identify a selected nested option without a visible parent count', async () => {
    const { root, waitForChanges } = await render(
      <bq-option value="parent">
        Parent
        <bq-option slot="options" value="child">
          Child
        </bq-option>
      </bq-option>,
    );
    const option = root as HTMLBqOptionElement;
    const child = root.querySelector<HTMLBqOptionElement>('bq-option[value="child"]');

    child.selected = true;
    await waitForChanges();
    await waitForStable(root);

    expect(option).toEqualAttribute('aria-selected', 'false');
    expect(option).toEqualAttribute('aria-label', 'Parent, Child selected');
    expect(option.shadowRoot?.querySelector('[part="selected-descendant"]')).toBeNull();

    option.expanded = true;
    await waitForChanges();

    expect(option).not.toHaveAttribute('aria-label');
  });

  it('should display customizable nested selection summaries and allow opting out', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-option allSelectedLabel="All levels" selectedCountLabel="{count} levels selected" value="parent">
        Parent
        <bq-option slot="options" value="child-one">
          Child one
        </bq-option>
        <bq-option slot="options" value="child-two">
          Child two
        </bq-option>
      </bq-option>,
    );
    const option = root as HTMLBqOptionElement;
    const firstChild = root.querySelector<HTMLBqOptionElement>('bq-option[value="child-one"]');
    const secondChild = root.querySelector<HTMLBqOptionElement>('bq-option[value="child-two"]');

    firstChild.selected = true;
    await waitForChanges();

    expect(getSelectionSummary(option)).toHaveTextContent('1 levels selected');

    secondChild.selected = true;
    await waitForChanges();

    expect(getSelectionSummary(option)).toHaveTextContent('All levels');

    await setProps({ showSelectionSummary: false });
    await waitForChanges();

    expect(getSelectionSummary(option)).toBeNull();
  });

  it('should expand and collapse nested options without changing selection', async () => {
    const { root, setProps, spyOnEvent, waitForChanges } = await render(
      <bq-option value="parent">
        Parent
        <bq-option slot="options" value="child">
          Child
        </bq-option>
      </bq-option>,
    );
    const option = root as HTMLBqOptionElement;
    const expandButtonControl = getExpandButtonControl(option);
    const bqClick = spyOnEvent('bqClick');

    await waitForChanges();

    expect(option).not.toHaveAttribute('expanded');
    expect(expandButtonControl).toEqualAttribute('aria-expanded', 'false');
    expect(getNestedOptions(option)).toHaveClass('!hidden');

    await userEvent.click(expandButtonControl);
    await waitForChanges();

    expect(option).toHaveAttribute('expanded');
    expect(option).not.toHaveAttribute('selected');
    expect(expandButtonControl).toEqualAttribute('aria-expanded', 'true');
    expect(getNestedOptions(option)).not.toHaveClass('!hidden');
    expect(bqClick).toHaveReceivedEventTimes(0);

    await setProps({ expanded: false });
    await waitForChanges();

    expect(expandButtonControl).toEqualAttribute('aria-expanded', 'false');
    expect(getNestedOptions(option)).toHaveClass('!hidden');
  });

  it('should expand nested options with Enter without selecting the parent', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option value="parent">
        Parent
        <bq-option slot="options" value="child">
          Child
        </bq-option>
      </bq-option>,
    );
    const option = root as HTMLBqOptionElement;
    const expandButtonControl = getExpandButtonControl(option);
    const bqClick = spyOnEvent('bqClick');

    await waitForChanges();
    await userEvent.click(expandButtonControl);
    await waitForChanges();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(expandButtonControl).toEqualAttribute('aria-expanded', 'false');
    expect(option).not.toHaveAttribute('selected');
    expect(bqClick).toHaveReceivedEventTimes(0);

    await userEvent.keyboard(' ');
    await waitForChanges();

    expect(expandButtonControl).toEqualAttribute('aria-expanded', 'true');
    expect(option).not.toHaveAttribute('selected');
    expect(bqClick).toHaveReceivedEventTimes(0);
  });

  it('should use tree semantics for nested options', async () => {
    const { root, waitForChanges } = await render(
      <bq-option value="parent">
        Parent
        <bq-option slot="options" value="child">
          Child
        </bq-option>
      </bq-option>,
    );
    const option = root as HTMLBqOptionElement;
    const child = root.querySelector<HTMLBqOptionElement>('bq-option[value="child"]');
    const expandButtonControl = getExpandButtonControl(option);

    await waitForChanges();
    await waitForStable(root);

    expect(option).toEqualAttribute('role', 'treeitem');
    expect(option).toEqualAttribute('aria-expanded', 'false');
    expect(child).toEqualAttribute('role', 'treeitem');
    expect(getNestedOptions(option)).toEqualAttribute('role', 'group');
    expect(expandButtonControl).toEqualAttribute('tabindex', '-1');
  });

  it('should render an optional expand label', async () => {
    const { root } = await render(
      <bq-option value="parent">
        Parent
        <span slot="expand-label">2 levels</span>
        <bq-option slot="options" value="child">
          Child
        </bq-option>
      </bq-option>,
    );
    const option = root as HTMLBqOptionElement;
    const expandLabelSlot = option.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="expand-label"]');

    await waitForStable(root);

    expect(getTextContent(expandLabelSlot, { recurse: true })).toBe('2 levels');
    expect(getExpandButton(option)?.onlyIcon).toBe(false);
    expect(getExpandButtonControl(option)).toEqualAttribute('aria-label', 'Expand Parent');
  });
});

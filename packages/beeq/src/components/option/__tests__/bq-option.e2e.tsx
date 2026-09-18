import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

const getOptionCheckbox = (option: HTMLBqOptionElement) =>
  option.shadowRoot?.querySelector<HTMLBqCheckboxElement>('bq-checkbox');
const getCheckboxInput = (checkbox?: HTMLBqCheckboxElement) => checkbox?.shadowRoot?.querySelector('[part="input"]');
const getCheckboxBase = (checkbox?: HTMLBqCheckboxElement) => checkbox?.shadowRoot?.querySelector('[part="base"]');

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

  it('should toggle from the checkbox with Space and emit focus and blur once', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option checkbox value="option-value">
        Option label
      </bq-option>,
    );
    const checkbox = getOptionCheckbox(root as HTMLBqOptionElement);
    const input = getCheckboxInput(checkbox) as HTMLInputElement;
    const bqClick = spyOnEvent('bqClick');

    await waitForStable(root);
    await checkbox?.vFocus();
    await waitForChanges();
    expect(checkbox?.shadowRoot?.activeElement).toBe(input);

    await userEvent.keyboard(' ');
    await waitForChanges();

    expect((getCheckboxInput(checkbox) as HTMLInputElement).checked).toBe(true);
    expect(bqClick).toHaveReceivedEventTimes(1);

    await checkbox?.vBlur();
    await waitForChanges();
    expect(checkbox?.shadowRoot?.activeElement).toBeNull();
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

    const bqOption = root.shadowRoot?.querySelector('button[part="base"]');

    expect(bqOption).toHaveClass('active');
  });
});

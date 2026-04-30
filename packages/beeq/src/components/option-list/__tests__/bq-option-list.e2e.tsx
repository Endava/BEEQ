import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

describe('bq-option-list', () => {
  it('should render', async () => {
    const { root } = await render(<bq-option-list />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-option-list />);
    expect(root).toHaveShadowRoot();
  });

  it('should have role="listbox"', async () => {
    const { root } = await render(<bq-option-list />);
    expect(root).toEqualAttribute('role', 'listbox');
  });

  it('should have default aria-label="Options"', async () => {
    const { root } = await render(<bq-option-list />);
    expect(root).toEqualAttribute('aria-label', 'Options');
  });

  it('should reflect custom ariaLabel', async () => {
    const { root } = await render(<bq-option-list ariaLabel="Custom label" />);
    expect(root).toEqualAttribute('aria-label', 'Custom label');
  });

  it('should render default slot with multiple options', async () => {
    const { root } = await render(
      <bq-option-list>
        <bq-option value="pizza">Pizza</bq-option>
        <bq-option value="burger">Burger</bq-option>
      </bq-option-list>,
    );

    const defaultSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    const assignedElements = defaultSlot?.assignedElements({ flatten: true });

    expect(assignedElements?.length).toBe(2);
  });

  it('should trigger bqSelect on click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option-list>
        <bq-option value="pizza">Pizza</bq-option>
      </bq-option-list>,
    );

    const bqSelect = spyOnEvent('bqSelect');
    const option = root.querySelector<HTMLBqOptionElement>('bq-option');
    const button = option.shadowRoot?.querySelector<HTMLButtonElement>('button');

    button?.click();
    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventTimes(1);
  });

  it('should trigger bqSelect on Enter', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option-list>
        <bq-option>Option</bq-option>
      </bq-option-list>,
    );

    const bqSelect = spyOnEvent('bqSelect');
    const option = root.querySelector<HTMLBqOptionElement>('bq-option');
    const target = option.shadowRoot?.querySelector<HTMLElement>('[tabindex]');

    target?.focus();
    target?.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      }),
    );

    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventTimes(1);
  });

  it('should emit bqSelect with the selected option value', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option-list>
        <bq-option value="pizza">Pizza</bq-option>
      </bq-option-list>,
    );

    const bqSelect = spyOnEvent('bqSelect');
    const option = root.querySelector<HTMLBqOptionElement>('bq-option');
    const button = option.shadowRoot?.querySelector<HTMLButtonElement>('button');

    button?.click();
    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventDetail({ item: option, value: 'pizza' });
  });
});

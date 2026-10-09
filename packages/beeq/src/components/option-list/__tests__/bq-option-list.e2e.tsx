import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

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

  it.each([false, true])('should select from option padding once (checkbox=%s)', async (checkbox) => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option-list>
        <bq-option checkbox={checkbox} value="pizza">
          Pizza
        </bq-option>
      </bq-option-list>,
    );
    const option = root.querySelector<HTMLBqOptionElement>('bq-option');
    const row = option.shadowRoot.querySelector<HTMLElement>('[part="item"]');
    const bqSelect = spyOnEvent('bqSelect');
    await waitForStable(root);

    const rect = row.getBoundingClientRect();
    const position = { x: 2, y: rect.height / 2 };
    expect(option.shadowRoot.elementFromPoint(rect.left + position.x, rect.top + position.y)).toBe(
      option.shadowRoot.querySelector('[part="base"]'),
    );
    await userEvent.click(row, { position });
    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventTimes(1);
    expect(bqSelect).toHaveReceivedEventDetail({ item: option, value: 'pizza' });
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

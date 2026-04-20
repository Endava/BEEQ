import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

describe('bq-option', () => {
  it('should render', async () => {
    const { root } = await render(<bq-option>Option label</bq-option>);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-option>Option label</bq-option>);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const text = 'Option label';
    const { root } = await render(<bq-option>{text}</bq-option>);

    expect(root).toEqualText(text);
  });

  it('should trigger bqClick', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-option>Option label</bq-option>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');

    const element = root.shadowRoot?.querySelector('button[part="base"]') as HTMLButtonElement;

    element.click();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should be keyboard accessible', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-option>Option label</bq-option>);

    const bqFocus = await spyOnEvent('bqFocus');
    const bqBlur = await spyOnEvent('bqBlur');
    const bqClick = await spyOnEvent('bqClick');
    const target = root.shadowRoot?.querySelector('[tabindex]') as HTMLElement;

    target.focus();
    target.dispatchEvent(
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

    const target = root.shadowRoot?.querySelector('[tabindex]') as HTMLElement;

    target.focus();
    target.dispatchEvent(
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
    const { root, waitForChanges, spyOnEvent } = await render(<bq-option disabled="true">Option label</bq-option>);
    const bqFocus = await spyOnEvent('bqFocus');
    const bqBlur = await spyOnEvent('bqBlur');
    const bqClick = await spyOnEvent('bqClick');

    const element = root.shadowRoot?.querySelector('button[part="base"]') as HTMLButtonElement;

    element.click();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render prefix element', async () => {
    const { root } = await render(
      <bq-option value="option1">
        <span slot="prefix">Prefix</span>
        <span>Option label</span>
      </bq-option>,
    );

    const slotElement = root.shadowRoot?.querySelector('slot[name="prefix"]') as HTMLSlotElement | null;

    const assignedElement = slotElement?.assignedElements({ flatten: true })[0];
    const prefixText = assignedElement?.textContent?.trim();

    expect(prefixText).toBe('Prefix');
  });

  it('should render suffix element', async () => {
    const { root } = await render(
      <bq-option value="option1">
        <span>Option label</span>
        <span slot="suffix">Suffix</span>
      </bq-option>,
    );

    const slotElement = root.shadowRoot?.querySelector('slot[name="suffix"]') as HTMLSlotElement | null;

    const assignedElement = slotElement?.assignedElements({ flatten: true })[0];
    const suffixText = assignedElement?.textContent?.trim();

    expect(suffixText).toBe('Suffix');
  });

  it('should handle `selected` property', async () => {
    const { root } = await render(<bq-option selected="true">Option 1</bq-option>);

    const bqOption = root.shadowRoot?.querySelector('button[part="base"]');

    expect(bqOption).toHaveClass('active');
  });
});

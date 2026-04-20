import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

describe('bq-option-list', () => {
  it('should render', async () => {
    const { root } = await render(<bq-option-list />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-option-list />);
    expect(root.shadowRoot).not.toBeNull();
  });

  it('should trigger bqSelect on Enter', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-option-list>
        <bq-option>Option</bq-option>
      </bq-option-list>,
    );

    const bqSelect = spyOnEvent('bqSelect');
    const option = root.querySelector('bq-option') as HTMLBqOptionElement;
    const target = option.shadowRoot?.querySelector('[tabindex]') as HTMLElement;

    target.focus();
    target.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
      }),
    );

    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventTimes(1);
  });
});

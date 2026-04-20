import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

describe('bq-empty-state', () => {
  it('should render', async () => {
    const { root } = await render(<bq-empty-state />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-empty-state />);
    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render a basic empty state', async () => {
    const { root } = await render(
      <bq-empty-state>
        Title
        <span slot="body">You have a basic empty state</span>
      </bq-empty-state>,
    );

    const element = root?.shadowRoot?.querySelector('slot[name="body"]') as HTMLSlotElement;

    expect(element).not.toBeNull();
  });
});

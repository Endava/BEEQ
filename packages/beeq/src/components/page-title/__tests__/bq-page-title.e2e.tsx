import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

describe('bq-page-title', () => {
  it('should render', async () => {
    const { root } = await render(<bq-page-title>Title</bq-page-title>);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-page-title>Title</bq-page-title>);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render title + back navigation button', async () => {
    const { root } = await render(<bq-page-title haveBackNavigation="true">Title</bq-page-title>);

    const backIcon = root.shadowRoot?.querySelector('slot[name="back"]');
    expect(backIcon).not.toBeNull();
  });

  it('should render title + action icons - suffix', async () => {
    const { root } = await render(
      <bq-page-title>
        Title
        <div slot="suffix">
          <bq-icon name="start"></bq-icon>
        </div>
      </bq-page-title>,
    );

    const suffixSlot = root.shadowRoot?.querySelector('slot[name="suffix"]');
    expect(suffixSlot).not.toBeNull();
  });
});

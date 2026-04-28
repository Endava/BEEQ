import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';

import { getTextContent } from '../../../shared/utils/slot';

describe('bq-page-title', () => {
  it('should render', async () => {
    const { root } = await render(<bq-page-title>Title</bq-page-title>);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-page-title>Title</bq-page-title>);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render title text', async () => {
    const { root } = await render(<bq-page-title>My Title</bq-page-title>);

    const titleSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    expect(getTextContent(titleSlot, { recurse: true })).toBe('My Title');
  });

  it('should hide back navigation by default', async () => {
    const { root } = await render(<bq-page-title>Title</bq-page-title>);

    const backContainer = root.shadowRoot?.querySelector<HTMLElement>('[part="back"]');
    expect(backContainer).toHaveClass('!hidden');
  });

  it('should show back navigation when back slot has content', async () => {
    const { root } = await render(
      <bq-page-title>
        <bq-button slot="back">Back</bq-button>
        Title
      </bq-page-title>,
    );

    const backContainer = root.shadowRoot?.querySelector<HTMLElement>('[part="back"]');
    expect(backContainer).not.toHaveClass('!hidden');
  });

  it('should render sub-title slot', async () => {
    const { root } = await render(
      <bq-page-title>
        Title<span slot="sub-title">Sub-title text</span>
      </bq-page-title>,
    );

    const subTitleSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="sub-title"]');
    expect(getTextContent(subTitleSlot, { recurse: true })).toBe('Sub-title text');
  });

  it('should hide sub-title by default', async () => {
    const { root } = await render(<bq-page-title>Title</bq-page-title>);

    const subTitleContainer = root.shadowRoot?.querySelector<HTMLElement>('[part="sub-title"]');
    expect(subTitleContainer).toHaveClass('hidden');
  });

  it('should render suffix slot', async () => {
    const { root } = await render(
      <bq-page-title>
        Title
        <div slot="suffix">
          <bq-icon name="star"></bq-icon>
        </div>
      </bq-page-title>,
    );

    const suffixSlot = root.shadowRoot?.querySelector('slot[name="suffix"]');
    expect(suffixSlot).not.toBeNull();
  });
});

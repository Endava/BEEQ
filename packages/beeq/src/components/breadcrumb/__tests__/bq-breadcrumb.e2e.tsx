import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

describe('bq-breadcrumb', () => {
  it('should render', async () => {
    const { root } = await render(<bq-breadcrumb />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-breadcrumb />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should trigger bqClick on breadcrumb item click', async () => {
    const { root, spyOnEvent } = await render(
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );

    const bqBlur = spyOnEvent('bqBlur');
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const element = root.querySelector('bq-breadcrumb-item') as HTMLBqBreadcrumbItemElement;

    await userEvent.click(element);

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should be keyboard accessible', async () => {
    const { spyOnEvent } = await render(
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );

    const bqBlur = spyOnEvent('bqBlur');
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');

    await userEvent.tab();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should trigger bqClick on Enter', async () => {
    const { spyOnEvent } = await render(
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );

    const bqBlur = spyOnEvent('bqBlur');
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render custom separator', async () => {
    const { root } = await render(
      <bq-breadcrumb>
        <bq-icon name="caret-right" size="12" slot="separator" />
        <bq-breadcrumb-item>
          <bq-icon name="house-line" size="16" />
          <span>Home</span>
        </bq-breadcrumb-item>
        <bq-breadcrumb-item>Application Center</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );

    await waitForStable(root);

    const separator = root.querySelector('bq-icon[slot="separator"]');
    const items = root.querySelectorAll('bq-breadcrumb-item');
    const firstItemSeparatorSlot = items[0].shadowRoot.querySelector('slot[name="separator"]') as HTMLSlotElement;
    const firstItemSeparators = firstItemSeparatorSlot.assignedElements({ flatten: true });

    expect(separator).not.toBeNull();
    expect(firstItemSeparators).toHaveLength(1);
    expect(firstItemSeparators[0].tagName.toLowerCase()).toBe('bq-icon');
  });

  it('should set `aria-current` only on the last item', async () => {
    const { root } = await render(
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        <bq-breadcrumb-item>Library</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );

    await waitForStable(root);

    const items = root.querySelectorAll('bq-breadcrumb-item');

    expect(items[0].getAttribute('aria-current')).toBe('');
    expect(items[1].getAttribute('aria-current')).toBe('page');
  });
});

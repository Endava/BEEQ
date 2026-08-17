import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

const generatedSeparators = (item: HTMLBqBreadcrumbItemElement) =>
  Array.from(item.children).filter((element) => element.matches('[slot="separator"]'));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-breadcrumb', () => {
  it('should render', async () => {
    const { root } = await render(<bq-breadcrumb />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-breadcrumb />);

    expect(root).toHaveShadowRoot();
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

  it('should synchronize delayed custom-element properties to every generated separator', async () => {
    const { root } = await render(
      <bq-breadcrumb>
        <bq-icon slot="separator" />
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        <bq-breadcrumb-item>Library</bq-breadcrumb-item>
        <bq-breadcrumb-item>Current</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );
    const source = root.querySelector<HTMLBqIconElement>(':scope > bq-icon[slot="separator"]');

    source.name = 'caret-right';
    source.size = '16';
    await waitForStable(root);

    expect(source.name).toBe('caret-right');

    const items = root.querySelectorAll('bq-breadcrumb-item');
    const separators = [...generatedSeparators(items[0]), ...generatedSeparators(items[1])] as HTMLBqIconElement[];

    expect(separators).toHaveLength(2);
    for (const separator of separators) {
      expect(separator.name).toBe('caret-right');
      expect(separator.size).toBe('16');
    }
    await expect.poll(() => separators.every((separator) => separator.shadowRoot.querySelector('svg'))).toBe(true);
  });

  it('should refresh generated separators when the source is replaced', async () => {
    const { root } = await render(
      <bq-breadcrumb>
        <bq-icon name="caret-right" size="12" slot="separator" />
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        <bq-breadcrumb-item>Library</bq-breadcrumb-item>
        <bq-breadcrumb-item>Current</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );
    const source = root.querySelector<HTMLBqIconElement>(':scope > bq-icon[slot="separator"]');
    const items = root.querySelectorAll('bq-breadcrumb-item');

    const replacement = document.createElement('span');
    replacement.slot = 'separator';
    replacement.textContent = '→';
    source.replaceWith(replacement);
    await waitForStable(root);

    expect(generatedSeparators(items[0])[0]).toHaveTextContent('→');
    expect(generatedSeparators(items[1])[0]).toHaveTextContent('→');
  });

  it('should reconcile generated separators and aria-current when items change', async () => {
    const { root } = await render(
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        <bq-breadcrumb-item>Current</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );
    const [home, current] = Array.from(root.querySelectorAll('bq-breadcrumb-item'));
    const library = document.createElement('bq-breadcrumb-item');
    library.textContent = 'Library';

    root.insertBefore(library, current);
    await waitForStable(root);

    expect(generatedSeparators(home)).toHaveLength(1);
    expect(generatedSeparators(library)).toHaveLength(1);
    expect(generatedSeparators(current)).toHaveLength(0);
    expect(current).toEqualAttribute('aria-current', 'page');

    root.append(home);
    await waitForStable(root);

    expect(generatedSeparators(current)).toHaveLength(1);
    expect(generatedSeparators(home)).toHaveLength(0);
    expect(home).toEqualAttribute('aria-current', 'page');

    current.remove();
    await waitForStable(root);

    expect(generatedSeparators(library)).toHaveLength(1);
    expect(generatedSeparators(home)).toHaveLength(0);
  });

  it('should preserve consumer-provided item separators', async () => {
    const { root } = await render(
      <bq-breadcrumb>
        <bq-icon name="caret-right" slot="separator" />
        <bq-breadcrumb-item>
          Home
          <span slot="separator">•</span>
        </bq-breadcrumb-item>
        <bq-breadcrumb-item>Current</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );
    const [firstItem] = root.querySelectorAll('bq-breadcrumb-item');

    await waitForStable(root);

    expect(generatedSeparators(firstItem)).toHaveLength(1);
    expect(generatedSeparators(firstItem)[0]).toHaveTextContent('•');
  });

  it('should set a default aria-label on the navigation element', async () => {
    const { root } = await render(<bq-breadcrumb />);
    const nav = root.shadowRoot?.querySelector('nav');
    expect(nav).toEqualAttribute('aria-label', 'Breadcrumbs');
  });

  it('should set a custom aria-label on the navigation element', async () => {
    const { root } = await render(<bq-breadcrumb label="Page trail" />);
    const nav = root.shadowRoot?.querySelector('nav');

    expect(nav).toEqualAttribute('aria-label', 'Page trail');
  });

  it('should render the default separator for all non-last items', async () => {
    const { root } = await render(
      <bq-breadcrumb>
        <bq-breadcrumb-item>Home</bq-breadcrumb-item>
        <bq-breadcrumb-item>Library</bq-breadcrumb-item>
        <bq-breadcrumb-item>Current</bq-breadcrumb-item>
      </bq-breadcrumb>,
    );

    await waitForStable(root);

    const items = root.querySelectorAll('bq-breadcrumb-item');
    const firstSeparatorSlot = items[0].shadowRoot?.querySelector('slot[name="separator"]');
    const secondSeparatorSlot = items[1].shadowRoot?.querySelector('slot[name="separator"]');
    const lastSeparatorSlot = items[2].shadowRoot?.querySelector('slot[name="separator"]');

    expect(getTextContent(firstSeparatorSlot as HTMLSlotElement, { recurse: true })).toBe('/');
    expect(getTextContent(secondSeparatorSlot as HTMLSlotElement, { recurse: true })).toBe('/');
    expect(getTextContent(lastSeparatorSlot as HTMLSlotElement, { recurse: true })).toBe('');
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

    expect(items[0]).toEqualAttribute('aria-current', '');
    expect(items[1]).toEqualAttribute('aria-current', 'page');
  });
});

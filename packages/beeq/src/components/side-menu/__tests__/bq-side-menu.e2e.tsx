import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

afterEach(() => {
  vi.restoreAllMocks();
});

const getMenuItemButton = (item: HTMLBqSideMenuItemElement) =>
  item.shadowRoot?.querySelector<HTMLButtonElement>('[part="base"]');

describe('bq-side-menu', () => {
  it('should render', async () => {
    const { root } = await render(<bq-side-menu />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-side-menu />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render with default values', async () => {
    const { root } = await render(<bq-side-menu />);

    expect(root).toEqualAttribute('appearance', 'default');
    expect(root).toEqualAttribute('size', 'medium');
  });

  it('should collapse and expand through the public method', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item>Dashboard</bq-side-menu-item>
      </bq-side-menu>,
    );
    const bqSideMenu = root as HTMLBqSideMenuElement;
    const asideElement = bqSideMenu.shadowRoot.querySelector<HTMLElement>('[part="base"]');

    const bqCollapse = spyOnEvent('bqCollapse');

    await bqSideMenu.toggleCollapse();
    await waitForChanges();

    expect(bqSideMenu).toHaveAttribute('collapse');
    expect(asideElement).toHaveClass('is-collapsed');
    expect(bqCollapse).toHaveReceivedEventTimes(1);
    expect(bqCollapse.events[0].detail.collapse).toBe(true);

    await bqSideMenu.toggleCollapse();
    await waitForChanges();

    expect(bqSideMenu).not.toHaveAttribute('collapse');
    expect(asideElement).not.toHaveClass('is-collapsed');
    expect(bqCollapse).toHaveReceivedEventTimes(2);
  });

  it('should manage body classes based on collapse state', async () => {
    const { root, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item>Dashboard</bq-side-menu-item>
      </bq-side-menu>,
    );
    const bqSideMenu = root as HTMLBqSideMenuElement;

    await waitForStable(bqSideMenu);

    expect(document.body).toHaveClass('bq-body--side-menu');
    expect(document.body).toHaveClass('bq-body--side-menu__expand');

    await bqSideMenu.toggleCollapse();
    await waitForChanges();

    expect(document.body).toHaveClass('bq-body--side-menu__collapse');
    expect(document.body).not.toHaveClass('bq-body--side-menu__expand');
  });

  it('should assign navigation menu items to the default slot', async () => {
    const { root } = await render(
      <bq-side-menu>
        <bq-side-menu-item active>
          <bq-icon name="diamonds-four" slot="prefix" />
          Dashboard
        </bq-side-menu-item>
        <bq-side-menu-item>
          <bq-icon name="package" slot="prefix" />
          Products
          <bq-badge slot="suffix">5</bq-badge>
        </bq-side-menu-item>
      </bq-side-menu>,
    );

    await waitForStable(root);

    const defaultSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('[part="nav"] slot:not([name])');
    const assigned = defaultSlot?.assignedElements({ flatten: true });

    expect(assigned).toHaveLength(2);
  });

  it('should emit bqSelect and activate the clicked item', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item active>Dashboard</bq-side-menu-item>
        <bq-side-menu-item>Products</bq-side-menu-item>
      </bq-side-menu>,
    );
    const bqSelect = spyOnEvent('bqSelect');
    const [firstItem, secondItem] = Array.from(root.querySelectorAll<HTMLBqSideMenuItemElement>('bq-side-menu-item'));

    await userEvent.click(getMenuItemButton(secondItem));
    await waitForChanges();

    expect(bqSelect).toHaveReceivedEventTimes(1);
    expect(firstItem.active).toBe(false);
    expect(secondItem.active).toBe(true);
    expect(getMenuItemButton(firstItem)).not.toHaveClass('active');
    expect(getMenuItemButton(secondItem)).toHaveClass('active');
  });

  it('should display a tooltip on the navigation item when collapsed', async () => {
    const { root } = await render(
      <bq-side-menu collapse>
        <bq-side-menu-item>
          <bq-icon name="diamonds-four" slot="prefix" />
          Dashboard
        </bq-side-menu-item>
      </bq-side-menu>,
    );
    const menuItem = root.querySelector<HTMLBqSideMenuItemElement>('bq-side-menu-item');

    await waitForStable(menuItem);

    const tooltip = menuItem.shadowRoot?.querySelector('bq-tooltip');

    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent?.trim()).toContain('Dashboard');
  });

  it('should apply appearance styles', async () => {
    await render(<bq-side-menu appearance="brand" />);

    const style = computedStyle('bq-side-menu[appearance="brand"] >>> [part="base"]', ['backgroundColor']);

    expect(style.backgroundColor).not.toBe('');
  });

  it('should apply size styles to slotted items', async () => {
    const { root } = await render(
      <bq-side-menu size="small">
        <bq-side-menu-item>Dashboard</bq-side-menu-item>
      </bq-side-menu>,
    );

    await waitForStable(root);

    const item = root.querySelector('bq-side-menu-item') as HTMLBqSideMenuItemElement;
    const paddingY = getComputedStyle(item).getPropertyValue('--bq-side-menu-item--paddingY').trim();

    expect(paddingY).toBe('0.75rem');
  });

  it('should render slotted logo content', async () => {
    const { root } = await render(
      <bq-side-menu>
        <div slot="logo">My Logo</div>
      </bq-side-menu>,
    );

    await waitForStable(root);

    const logoSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('[part="logo"] slot[name="logo"]');
    const assigned = logoSlot.assignedElements({ flatten: true });

    expect(assigned).toHaveLength(1);
    expect(assigned[0].textContent).toBe('My Logo');
  });

  it('should render slotted footer content', async () => {
    const { root } = await render(
      <bq-side-menu>
        <span slot="footer">Footer content</span>
      </bq-side-menu>,
    );

    await waitForStable(root);

    const footerSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('[part="footer"] slot[name="footer"]');
    const assigned = footerSlot.assignedElements({ flatten: true });

    expect(assigned).toHaveLength(1);
    expect(assigned[0].textContent).toBe('Footer content');
  });

  it('should remove body classes when disconnected', async () => {
    const { root } = await render(
      <bq-side-menu>
        <bq-side-menu-item>Dashboard</bq-side-menu-item>
      </bq-side-menu>,
    );

    await waitForStable(root);

    expect(document.body).toHaveClass('bq-body--side-menu');

    root.remove();

    expect(document.body).not.toHaveClass('bq-body--side-menu');
    expect(document.body).not.toHaveClass('bq-body--side-menu__expand');
    expect(document.body).not.toHaveClass('bq-body--side-menu__collapse');
  });
});

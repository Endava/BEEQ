import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';
import { computedStyle } from '../../../shared/test-utils/computedStyle';

const getMenuItemButton = (item: HTMLBqSideMenuItemElement) =>
  item.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;

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

    expect(root).toHaveAttribute('appearance', 'default');
    expect(root).toHaveAttribute('size', 'medium');
  });

  it('should collapse and expand through the public method', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item>Dashboard</bq-side-menu-item>
      </bq-side-menu>,
    );
    const bqCollapse = spyOnEvent('bqCollapse');
    const menuItem = root.querySelector('bq-side-menu-item') as HTMLBqSideMenuItemElement;

    await root.toggleCollapse();
    await waitForChanges();

    expect(root).toHaveAttribute('collapse');
    expect(menuItem.collapse).toBe(true);
    expect(bqCollapse).toHaveReceivedEventTimes(1);
    expect(bqCollapse.events[0].detail.collapse).toBe(true);

    await root.toggleCollapse();
    await waitForChanges();

    expect(root).not.toHaveAttribute('collapse');
    expect(menuItem.collapse).toBe(false);
    expect(bqCollapse).toHaveReceivedEventTimes(2);
  });

  it('should render navigation menu items', async () => {
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

    expect(root.querySelectorAll('bq-side-menu-item')).toHaveLength(2);
  });

  it('should emit bqSelect and activate the clicked item', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item active>Dashboard</bq-side-menu-item>
        <bq-side-menu-item>Products</bq-side-menu-item>
      </bq-side-menu>,
    );
    const bqSelect = spyOnEvent('bqSelect');
    const [firstItem, secondItem] = Array.from(
      root.querySelectorAll('bq-side-menu-item'),
    ) as HTMLBqSideMenuItemElement[];

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
    const menuItem = root.querySelector('bq-side-menu-item') as HTMLBqSideMenuItemElement;

    await waitForStable(menuItem);

    const tooltip = menuItem.shadowRoot?.querySelector('bq-tooltip');

    expect(tooltip).not.toBeNull();
    expect(tooltip?.textContent?.trim()).toContain('Dashboard');
  });

  it('should manage body classes based on collapse state', async () => {
    const { root, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item>Dashboard</bq-side-menu-item>
      </bq-side-menu>,
    );

    await waitForStable(root);

    expect(document.body).toHaveClass('bq-body--side-menu');
    expect(document.body).toHaveClass('bq-body--side-menu__expand');

    await root.toggleCollapse();
    await waitForChanges();

    expect(document.body).toHaveClass('bq-body--side-menu__collapse');
    expect(document.body).not.toHaveClass('bq-body--side-menu__expand');
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
});

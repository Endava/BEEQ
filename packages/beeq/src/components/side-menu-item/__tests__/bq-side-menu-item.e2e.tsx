import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

afterEach(() => {
  vi.restoreAllMocks();
});

const getMenuButton = (item: HTMLBqSideMenuItemElement) =>
  item.shadowRoot?.querySelector<HTMLButtonElement>('[part="base"]');

describe('bq-side-menu-item', () => {
  it('should render', async () => {
    const { root } = await render(<bq-side-menu-item />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-side-menu-item />);

    expect(root).toHaveShadowRoot();
  });

  it('should display text', async () => {
    const { root } = await render(<bq-side-menu-item>Menu item label</bq-side-menu-item>);

    await waitForStable(root);

    expect(root.textContent?.trim()).toBe('Menu item label');
  });

  it('should emit bqClick when clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-side-menu-item>Menu item label</bq-side-menu-item>);
    const item = root as HTMLBqSideMenuItemElement;
    const bqClick = spyOnEvent('bqClick');

    await userEvent.click(getMenuButton(item));
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqFocus and bqBlur when tabbed through', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <bq-side-menu-item>
          <bq-icon name="user" size="18" slot="prefix" />
          <span>Verified users</span>
        </bq-side-menu-item>
        <button type="button">Next</button>
      </div>,
    );

    const item = root.querySelector('bq-side-menu-item') as HTMLBqSideMenuItemElement;
    const bqFocusSpy = vi.fn();
    const bqBlurSpy = vi.fn();
    item.addEventListener('bqFocus', bqFocusSpy);
    item.addEventListener('bqBlur', bqBlurSpy);

    await userEvent.tab();
    await userEvent.tab();
    await waitForChanges();

    expect(bqFocusSpy).toHaveBeenCalledTimes(1);
    expect(bqBlurSpy).toHaveBeenCalledTimes(1);
    expect(document.activeElement?.tagName.toLowerCase()).toBe('button');
  });

  it('should apply the active class when active is true', async () => {
    const { root } = await render(<bq-side-menu-item active>Menu item label</bq-side-menu-item>);
    const item = root as HTMLBqSideMenuItemElement;

    expect(getMenuButton(item)).toHaveClass('active');
  });

  it('should become active on Enter key press inside side menu', async () => {
    const { root, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item>Menu item label</bq-side-menu-item>
      </bq-side-menu>,
    );
    const menuItem = root.querySelector('bq-side-menu-item') as HTMLBqSideMenuItemElement;

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(getMenuButton(menuItem)).toHaveClass('active');
  });

  it('should become active on Space key press inside side menu', async () => {
    const { root, waitForChanges } = await render(
      <bq-side-menu>
        <bq-side-menu-item>Menu item label</bq-side-menu-item>
      </bq-side-menu>,
    );
    const menuItem = root.querySelector('bq-side-menu-item') as HTMLBqSideMenuItemElement;

    await userEvent.tab();
    await userEvent.keyboard(' ');
    await waitForChanges();

    expect(getMenuButton(menuItem)).toHaveClass('active');
  });

  it('should prevent focus, blur and click events when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-side-menu-item disabled>Menu item label</bq-side-menu-item>,
    );
    const item = root as HTMLBqSideMenuItemElement;
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');
    const button = getMenuButton(item);

    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.tabIndex).toBe(-1);
    expect(button).toHaveClass('disabled');

    button.focus();
    button.blur();
    button.click();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render prefix element', async () => {
    const { root } = await render(
      <bq-side-menu-item>
        <span slot="prefix">Prefix</span> Dashboard
      </bq-side-menu-item>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="prefix"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Prefix');
  });

  it('should render suffix element', async () => {
    const { root } = await render(
      <bq-side-menu-item>
        <span slot="suffix">Suffix</span> Dashboard
      </bq-side-menu-item>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="suffix"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Suffix');
  });

  it('should expose role menuitem for accessibility', async () => {
    const { root } = await render(<bq-side-menu-item>Menu item label</bq-side-menu-item>);
    const item = root as HTMLBqSideMenuItemElement;

    expect(getMenuButton(item)).toEqualAttribute('role', 'menuitem');
  });

  it('should render collapsed state in isolation', async () => {
    const { root } = await render(
      <bq-side-menu-item collapse>
        <span slot="suffix">Suffix</span> Menu item label
      </bq-side-menu-item>,
    );
    const item = root as HTMLBqSideMenuItemElement;

    await waitForStable(root);

    const tooltip = item.shadowRoot?.querySelector('bq-tooltip');

    expect(tooltip).not.toBeNull();
    expect(getMenuButton(item)).toHaveClass('is-collapsed');
    expect(tooltip?.textContent?.trim()).toContain('Menu item label');
  });
});

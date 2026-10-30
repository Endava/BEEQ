import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { cdp, page, userEvent } from 'vitest/browser';

import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

afterEach(() => {
  vi.restoreAllMocks();
});

const getMenuButton = (item: HTMLBqSideMenuItemElement) =>
  item.shadowRoot?.querySelector<HTMLButtonElement>('[part="base"]');

/** Waits for any running CSS transition inside the element's shadow root to finish */
const waitForTransitions = async (element: Element) => {
  const animations = element.shadowRoot?.getAnimations() ?? [];
  await Promise.all(animations.map((animation) => animation.finished));
};

// Hover/click tests leave the Playwright cursor where they finished, so a freshly rendered element can
// render under it and pick up `:hover` styles. Before each test, park the cursor in the bottom-right corner
// of the top-level page (CDP coordinates), which lies outside the scaled test iframe.
const movePointerOff = () =>
  cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: window.top.innerWidth - 1,
    y: window.top.innerHeight - 1,
  });

beforeEach(async () => {
  await movePointerOff();
});

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

  describe('accessibility', () => {
    it('should not set an explicit role so the native button semantics apply', async () => {
      const { root } = await render(<bq-side-menu-item>Menu item label</bq-side-menu-item>);
      const button = getMenuButton(root as HTMLBqSideMenuItemElement);

      expect(button.tagName).toBe('BUTTON');
      expect(button).not.toHaveAttribute('role');
      expect(button).toEqualAttribute('type', 'button');
    });

    it('should expose navigation buttons with accessible names inside the nav landmark', async () => {
      const { root } = await render(
        <bq-side-menu>
          <bq-side-menu-item active>Home</bq-side-menu-item>
          <bq-side-menu-item>Settings</bq-side-menu-item>
        </bq-side-menu>,
      );
      const items = Array.from(root.querySelectorAll<HTMLBqSideMenuItemElement>('bq-side-menu-item'));

      expect(root.shadowRoot?.querySelector('nav[part="nav"]')).not.toBeNull();
      expect(root.querySelector('[role="menu"], [role="menubar"]')).toBeNull();
      expect(items.map((item) => item.textContent?.trim())).toEqual(['Home', 'Settings']);
      items.forEach((item) => {
        expect(getMenuButton(item)).not.toHaveAttribute('role');
      });
      await expect.element(page.getByRole('button', { name: 'Home' })).toBeInTheDocument();
      await expect.element(page.getByRole('button', { name: 'Settings' })).toBeInTheDocument();
      expect(page.getByRole('menuitem').elements()).toHaveLength(0);
    });

    it('should skip disabled items in the Tab order and activate the next one with the keyboard', async () => {
      const { root, waitForChanges } = await render(
        <bq-side-menu>
          <bq-side-menu-item>Home</bq-side-menu-item>
          <bq-side-menu-item disabled>Reports</bq-side-menu-item>
          <bq-side-menu-item>Settings</bq-side-menu-item>
        </bq-side-menu>,
      );
      const [home, reports, settings] = Array.from(
        root.querySelectorAll<HTMLBqSideMenuItemElement>('bq-side-menu-item'),
      );

      expect(getMenuButton(reports)).toEqualAttribute('aria-disabled', 'true');
      expect(getMenuButton(home)).toEqualAttribute('aria-disabled', 'false');

      await userEvent.tab();
      expect(home.shadowRoot?.activeElement).toBe(getMenuButton(home));

      await userEvent.tab();
      expect(settings.shadowRoot?.activeElement).toBe(getMenuButton(settings));
      expect(reports.shadowRoot?.activeElement).toBeNull();

      await userEvent.keyboard('{Enter}');
      await waitForChanges();

      expect(getMenuButton(settings)).toHaveClass('active');
      expect(getMenuButton(reports)).not.toHaveClass('active');
    });

    it('should keep the native button semantics and keyboard activation when collapsed', async () => {
      const { root, waitForChanges } = await render(
        <bq-side-menu collapse>
          <bq-side-menu-item>
            <bq-icon name="house" slot="prefix" aria-hidden="true" />
            Home
          </bq-side-menu-item>
        </bq-side-menu>,
      );
      const item = root.querySelector<HTMLBqSideMenuItemElement>('bq-side-menu-item');

      await waitForStable(item);

      const button = getMenuButton(item);

      expect(item.shadowRoot?.querySelector('bq-tooltip')).not.toBeNull();
      expect(button.tagName).toBe('BUTTON');
      expect(button).not.toHaveAttribute('role');
      expect(item.textContent).toContain('Home');

      await userEvent.tab();
      expect(item.shadowRoot?.activeElement).toBe(button);

      await userEvent.keyboard(' ');
      await waitForChanges();

      expect(button).toHaveClass('active');
    });
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

  it('should preserve native structure, spacing, typography and transitions', async () => {
    const { root } = await render(
      <bq-side-menu-item style={{ width: '320px' }}>
        <bq-icon name="house" slot="prefix" />
        Menu item label
        <bq-badge slot="suffix">5</bq-badge>
      </bq-side-menu-item>,
    );
    const item = root as HTMLBqSideMenuItemElement;
    await waitForStable(root);

    const button = getMenuButton(item);
    const label = item.shadowRoot.querySelector<HTMLElement>('.bq-side-menu-item__label');
    const suffix = item.shadowRoot.querySelector<HTMLElement>('.bq-side-menu-item__suffix');
    const buttonStyle = getComputedStyle(button);
    const labelStyle = getComputedStyle(label);

    expect(buttonStyle.display).toBe('flex');
    expect(buttonStyle.columnGap).toBe('12px');
    expect(buttonStyle.padding).toBe('16px 24px');
    expect(buttonStyle.borderRadius).toBe('8px');
    expect(buttonStyle.fontSize).toBe('16px');
    expect(buttonStyle.transitionDuration).toBe('0.15s');
    expect(buttonStyle.transitionProperty).toBe(
      'color, background-color, border-color, text-decoration-color, fill, stroke',
    );
    expect(labelStyle.overflow).toBe('hidden');
    expect(labelStyle.textAlign).toBe('start');
    expect(labelStyle.textOverflow).toBe('ellipsis');
    expect(labelStyle.whiteSpace).toBe('nowrap');
    expect(suffix.getBoundingClientRect().right).toBeLessThanOrEqual(button.getBoundingClientRect().right - 23);
  });

  it('should preserve public padding overrides and the collapsed inline padding', async () => {
    const paddingOverrides = {
      '--bq-side-menu-item--paddingX': '20px',
      '--bq-side-menu-item--paddingY': '8px',
    };
    const { root } = await render(
      <div>
        <bq-side-menu-item style={paddingOverrides}>Expanded item</bq-side-menu-item>
        <bq-side-menu-item collapse style={paddingOverrides}>
          Collapsed item
        </bq-side-menu-item>
      </div>,
    );
    const [expandedItem, collapsedItem] = Array.from(
      root.querySelectorAll<HTMLBqSideMenuItemElement>('bq-side-menu-item'),
    );
    await waitForStable(root);

    expect(getComputedStyle(getMenuButton(expandedItem)).padding).toBe('8px 20px');
    expect(getComputedStyle(getMenuButton(collapsedItem)).padding).toBe('8px 16px');
  });

  it('should preserve collapsed geometry while retaining an accessible label', async () => {
    const { root } = await render(
      <bq-side-menu-item collapse>
        <bq-icon name="house" slot="prefix" />
        Menu item label
        <bq-badge slot="suffix">5</bq-badge>
      </bq-side-menu-item>,
    );
    const item = root as HTMLBqSideMenuItemElement;
    await waitForStable(root);

    const button = getMenuButton(item);
    const label = item.shadowRoot.querySelector<HTMLElement>('.bq-side-menu-item__label');
    const suffix = item.shadowRoot.querySelector<HTMLElement>('.bq-side-menu-item__suffix');
    const buttonStyle = getComputedStyle(button);
    const labelStyle = getComputedStyle(label);

    expect(buttonStyle.columnGap).toBe('0px');
    expect(buttonStyle.justifyContent).toBe('center');
    expect(buttonStyle.padding).toBe('16px');
    expect(labelStyle.position).toBe('absolute');
    expect(labelStyle.blockSize).toBe('1px');
    expect(labelStyle.inlineSize).toBe('1px');
    expect(labelStyle.clipPath).toBe('inset(50%)');
    expect(labelStyle.transform).toBe('matrix(0, 0, 0, 0, 0, 0)');
    expect(getComputedStyle(suffix).position).toBe('absolute');
    await expect.element(page.getByRole('button', { name: /Menu item label/ })).toBeInTheDocument();
  });

  it('should preserve focus, disabled and RTL behavior', async () => {
    const { root } = await render(
      <div>
        <bq-side-menu-item dir="rtl" style={{ width: '320px' }}>
          <bq-icon name="house" slot="prefix" />
          RTL item
          <bq-badge slot="suffix">5</bq-badge>
        </bq-side-menu-item>
        <bq-side-menu-item disabled>Disabled item</bq-side-menu-item>
      </div>,
    );
    const [rtlItem, disabledItem] = Array.from(root.querySelectorAll<HTMLBqSideMenuItemElement>('bq-side-menu-item'));
    await waitForStable(root);
    await userEvent.tab();

    const rtlButton = getMenuButton(rtlItem);
    const prefix = rtlItem.shadowRoot.querySelector<HTMLElement>('.bq-side-menu-item__prefix');
    const suffix = rtlItem.shadowRoot.querySelector<HTMLElement>('.bq-side-menu-item__suffix');
    const focusStyle = getComputedStyle(rtlButton);
    const disabledStyle = getComputedStyle(getMenuButton(disabledItem));

    expect(focusStyle.outlineColor).toBe(resolveColorToken('--bq-focus'));
    expect(focusStyle.outlineStyle).toBe('solid');
    expect(focusStyle.outlineWidth).toBe('2px');
    expect(prefix.getBoundingClientRect().left).toBeGreaterThan(suffix.getBoundingClientRect().left);
    expect(disabledStyle.cursor).toBe('not-allowed');
    expect(disabledStyle.opacity).toBe('0.6');
  });

  it('should retain focus-triggered right positioning after movement and remove the tooltip on expansion', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-side-menu-item collapse style={{ display: 'block', width: '64px', margin: '100px' }}>
        Dashboard
      </bq-side-menu-item>,
    );
    const item = root as HTMLBqSideMenuItemElement;
    const tooltip = item.shadowRoot.querySelector<HTMLBqTooltipElement>('bq-tooltip');
    const panel = tooltip.shadowRoot.querySelector<HTMLElement>('[part="panel"]');
    const trigger = tooltip.shadowRoot.querySelector<HTMLElement>('[part="trigger"]');
    const getOffset = () => Math.abs(panel.getBoundingClientRect().left - trigger.getBoundingClientRect().right - 10);

    getMenuButton(item).focus();
    await waitForChanges();
    await expect.poll(getOffset).toBeLessThanOrEqual(2);
    expect(panel).toEqualAttribute('aria-hidden', 'false');
    expect(tooltip).toEqualAttribute('exportparts', 'trigger, panel');
    item.style.transform = 'translateX(40px)';
    await expect.poll(getOffset).toBeLessThanOrEqual(2);
    expect(getComputedStyle(panel).visibility).toBe('visible');
    getMenuButton(item).blur();
    await waitForChanges();
    expect(panel).toEqualAttribute('aria-hidden', 'true');

    await setProps({ collapse: false });
    expect(item.shadowRoot.querySelector('bq-tooltip')).toBeNull();
    expect(tooltip.isConnected).toBe(false);
    expect(getMenuButton(item)).not.toHaveClass('is-collapsed');
  });

  it('should use the default colour custom properties', async () => {
    const { root } = await render(<bq-side-menu-item>Menu item label</bq-side-menu-item>);
    const item = root as HTMLBqSideMenuItemElement;

    await waitForStable(root);
    await waitForTransitions(root);

    const style = getComputedStyle(getMenuButton(item));

    expect(style.color).toBe(resolveColorToken('--bq-text--primary'));
    expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  });

  it('should apply the active colour custom properties', async () => {
    const { root } = await render(<bq-side-menu-item active>Menu item label</bq-side-menu-item>);
    const item = root as HTMLBqSideMenuItemElement;

    await waitForStable(root);
    await waitForTransitions(root);

    const style = getComputedStyle(getMenuButton(item));

    expect(style.color).toBe(resolveColorToken('--bq-text--brand'));
    expect(style.backgroundColor).toBe(resolveColorToken('--bq-ui--brand-alt'));
  });

  it('should apply the hover colour custom properties', async () => {
    const { root } = await render(<bq-side-menu-item>Menu item label</bq-side-menu-item>);
    const item = root as HTMLBqSideMenuItemElement;

    await waitForStable(root);

    // The hover vars hold the base roles only; the SCSS mixes them with `--bq-hover`
    const hostStyle = getComputedStyle(item);
    expect(hostStyle.getPropertyValue('--bq-side-menu-item--bg-hover').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--alt').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-side-menu-item--text-hover').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--primary').trim(),
    );

    await userEvent.hover(getMenuButton(item));

    const colorProbe = document.createElement('span');
    item.shadowRoot.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-ui--alt), var(--bq-hover) 20%)';
    const expectedBackground = getComputedStyle(colorProbe).color;
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-text--primary), var(--bq-hover) 20%)';
    const expectedText = getComputedStyle(colorProbe).color;

    await expect.poll(() => getComputedStyle(getMenuButton(item)).backgroundColor).toBe(expectedBackground);
    await expect.poll(() => getComputedStyle(getMenuButton(item)).color).toBe(expectedText);
    colorProbe.remove();
  });

  it('should consume custom hover colour overrides', async () => {
    const { root } = await render(
      <bq-side-menu-item
        style={{
          '--bq-side-menu-item--bg-hover': 'rgb(255, 0, 0)',
          '--bq-side-menu-item--text-hover': 'rgb(0, 0, 255)',
        }}
      >
        Menu item label
      </bq-side-menu-item>,
    );
    const item = root as HTMLBqSideMenuItemElement;

    await waitForStable(root);
    await userEvent.hover(getMenuButton(item));

    const colorProbe = document.createElement('span');
    item.shadowRoot.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, rgb(255, 0, 0), var(--bq-hover) 20%)';
    const expectedBackground = getComputedStyle(colorProbe).color;
    colorProbe.style.color = 'color-mix(in srgb, rgb(0, 0, 255), var(--bq-hover) 20%)';
    const expectedText = getComputedStyle(colorProbe).color;

    await expect.poll(() => getComputedStyle(getMenuButton(item)).backgroundColor).toBe(expectedBackground);
    await expect.poll(() => getComputedStyle(getMenuButton(item)).color).toBe(expectedText);
    colorProbe.remove();
  });
});

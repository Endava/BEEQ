import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { getTextContent } from '../../../shared/utils/slot';

const getDrawerPanel = (drawer: HTMLBqDrawerElement) =>
  drawer.shadowRoot?.querySelector('[part="panel"]') as HTMLDivElement;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-drawer', () => {
  it('should render', async () => {
    const { root } = await render(<bq-drawer />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-drawer />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render as hidden', async () => {
    const { root } = await render(<bq-drawer />);

    const element = getDrawerPanel(root);

    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-drawer open={false} />);

    const element = getDrawerPanel(root);

    expect(element.getAttribute('aria-hidden')).toBe('true');
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-drawer open />);

    const element = getDrawerPanel(root);

    expect(element.getAttribute('aria-hidden')).toBe('false');
    expect(element).not.toHaveClass('hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-drawer open={true} />);

    const element = getDrawerPanel(root);

    expect(element.getAttribute('aria-hidden')).toBe('false');
    expect(element).not.toHaveClass('hidden');
  });

  it('should display drawer title', async () => {
    const { root } = await render(
      <bq-drawer>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );

    await waitForStable(root);

    const titleSlot = root.shadowRoot?.querySelector('slot[name="title"]') as HTMLSlotElement;

    expect(getTextContent(titleSlot, { recurse: true })).toBe('Drawer Title');
  });

  it('should render basic body drawer slot', async () => {
    const { root } = await render(
      <bq-drawer>
        <div>Slot</div>
      </bq-drawer>,
    );

    const description = root.shadowRoot?.querySelector('slot');

    expect(description).not.toBeNull();
  });

  it('should render footer drawer slot', async () => {
    const { root } = await render(
      <bq-drawer>
        <div slot="footer">Footer slot</div>
      </bq-drawer>,
    );

    const description = root.shadowRoot?.querySelector('slot[name="footer"]');

    expect(description).not.toBeNull();
  });

  it('should call `show` method', async () => {
    const { root } = await render(
      <bq-drawer>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );

    const closedDrawer = getDrawerPanel(root);

    expect(closedDrawer.getAttribute('aria-hidden')).toBe('true');
    expect(closedDrawer).toHaveAttribute('hidden');

    const afterOpen = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterOpen', () => resolve(), { once: true }),
    );

    await root.show();
    await afterOpen;

    const openDrawer = getDrawerPanel(root);

    expect(openDrawer.getAttribute('aria-hidden')).toBe('false');
    expect(openDrawer).not.toHaveAttribute('hidden');
  });

  it('should call `hide` method', async () => {
    const { root } = await render(
      <bq-drawer open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );

    const openDrawer = getDrawerPanel(root);

    expect(openDrawer.getAttribute('aria-hidden')).toBe('false');
    expect(openDrawer).not.toHaveAttribute('hidden');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    await root.hide();
    await afterClose;

    const closedDrawer = getDrawerPanel(root);

    expect(closedDrawer.getAttribute('aria-hidden')).toBe('true');
    expect(closedDrawer).toHaveAttribute('hidden');
  });

  it('should close on "Escape" by default', async () => {
    const { root } = await render(
      <bq-drawer open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await afterClose;

    expect(getDrawerPanel(root).getAttribute('aria-hidden')).toBe('true');
  });

  it('should not close on "Escape" when closeOnEsc is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-drawer closeOnEsc open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(getDrawerPanel(root).getAttribute('aria-hidden')).toBe('false');
  });

  it('should apply the position class to the drawer panel', async () => {
    const { root } = await render(<bq-drawer position="start" />);

    expect(getDrawerPanel(root).classList.contains('start')).toBe(true);
  });

  it('should render a backdrop when enableBackdrop is true', async () => {
    const { root } = await render(<bq-drawer enableBackdrop open />);

    expect(root.shadowRoot?.querySelector('[part="backdrop"]')).not.toBeNull();
  });

  it('should not close on outside click when closeOnClickOutside is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-drawer closeOnClickOutside open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );

    const panel = getDrawerPanel(root);
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      right: 100,
      bottom: 100,
      left: 0,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect);

    window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 200, clientY: 50 }));
    await waitForChanges();

    expect(panel.getAttribute('aria-hidden')).toBe('false');
  });

  it('should not show when bqOpen is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-drawer />);

    root.addEventListener('bqOpen', (event) => event.preventDefault(), { once: true });
    await root.show();
    await waitForChanges();

    expect(getDrawerPanel(root).getAttribute('aria-hidden')).toBe('true');
  });

  it('should not hide when bqClose is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-drawer open />);

    root.addEventListener('bqClose', (event) => event.preventDefault(), { once: true });
    await root.hide();
    await waitForChanges();

    expect(getDrawerPanel(root).getAttribute('aria-hidden')).toBe('false');
  });
});

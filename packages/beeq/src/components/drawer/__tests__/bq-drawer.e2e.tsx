import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

const getDrawerPanel = (drawer: HTMLBqDrawerElement) =>
  drawer.shadowRoot?.querySelector('[part="panel"]') as HTMLDivElement;

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
    const titleElement = titleSlot.assignedElements({ flatten: true })[0];

    expect(titleElement.textContent?.trim()).toBe('Drawer Title');
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

  it('should close on "Escape"', async () => {
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
});

import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { getTextContent } from '../../../shared/utils/slot';

const getDrawerPanel = (drawer: HTMLBqDrawerElement) =>
  drawer.shadowRoot?.querySelector<HTMLDivElement>('[part="panel"]');

const resolveColor = (value: string) => {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};

beforeEach(() => {
  // !Note: Remove once the deprecated `placement` prop is removed from bq-drawer
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

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

    expect(root).toHaveShadowRoot();
  });

  it('should render as hidden', async () => {
    const { root } = await render(<bq-drawer />);
    const drawer = root as HTMLBqDrawerElement;

    const element = getDrawerPanel(drawer);

    expect(element).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as hidden with `open="false"`', async () => {
    const { root } = await render(<bq-drawer open={false} />);
    const drawer = root as HTMLBqDrawerElement;

    const element = getDrawerPanel(drawer);

    expect(element).toEqualAttribute('aria-hidden', 'true');
  });

  it('should render as open', async () => {
    const { root } = await render(<bq-drawer open />);
    const drawer = root as HTMLBqDrawerElement;

    const element = getDrawerPanel(drawer);

    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).not.toHaveClass('hidden');
  });

  it('should render as open with `open="true"`', async () => {
    const { root } = await render(<bq-drawer open={true} />);
    const drawer = root as HTMLBqDrawerElement;

    const element = getDrawerPanel(drawer);

    expect(element).toEqualAttribute('aria-hidden', 'false');
    expect(element).not.toHaveClass('hidden');
  });

  it('should display drawer title', async () => {
    const { root } = await render(
      <bq-drawer>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );

    await waitForStable(root);

    const titleSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="title"]');

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
    const drawer = root as HTMLBqDrawerElement;

    const closedDrawer = getDrawerPanel(drawer);

    expect(closedDrawer).toEqualAttribute('aria-hidden', 'true');
    expect(closedDrawer).toHaveAttribute('hidden');

    const afterOpen = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterOpen', () => resolve(), { once: true }),
    );

    await drawer.show();
    await afterOpen;

    const openDrawer = getDrawerPanel(drawer);

    expect(openDrawer).toEqualAttribute('aria-hidden', 'false');
    expect(openDrawer).not.toHaveAttribute('hidden');
  });

  it('should call `hide` method', async () => {
    const { root } = await render(
      <bq-drawer open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );
    const drawer = root as HTMLBqDrawerElement;

    const openDrawer = getDrawerPanel(drawer);

    expect(openDrawer.getAttribute('aria-hidden')).toBe('false');
    expect(openDrawer).not.toHaveAttribute('hidden');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    await drawer.hide();
    await afterClose;

    const closedDrawer = getDrawerPanel(drawer);

    expect(closedDrawer).toEqualAttribute('aria-hidden', 'true');
    expect(closedDrawer).toHaveAttribute('hidden');
  });

  it('should close on "Escape" by default', async () => {
    const { root } = await render(
      <bq-drawer open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );
    const drawer = root as HTMLBqDrawerElement;

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await afterClose;

    expect(getDrawerPanel(drawer)).toEqualAttribute('aria-hidden', 'true');
  });

  it('should not close on "Escape" when closeOnEsc is true', async () => {
    // NOTE: `closeOnEsc = true` means "do NOT close on Escape" (prop semantics are inverted).
    // Consider renaming to `disableCloseOnEsc` for clarity (aligns with bq-dialog's disableCloseEscKeydown).
    const { root, waitForChanges } = await render(
      <bq-drawer closeOnEsc open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );
    const drawer = root as HTMLBqDrawerElement;

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(getDrawerPanel(drawer)).toEqualAttribute('aria-hidden', 'false');
  });

  it('should apply the position class to the drawer panel', async () => {
    const { root } = await render(<bq-drawer position="start" />);
    const drawer = root as HTMLBqDrawerElement;

    expect(getDrawerPanel(drawer).classList.contains('start')).toBe(true);
  });

  it('should render a backdrop when enableBackdrop is true', async () => {
    const { root } = await render(<bq-drawer enableBackdrop open />);

    expect(root.shadowRoot?.querySelector('[part="backdrop"]')).not.toBeNull();
  });

  it('should use the colour custom properties', async () => {
    const { root } = await render(
      <bq-drawer open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );
    const drawer = root as HTMLBqDrawerElement;

    await waitForStable(root);

    const panelStyle = getComputedStyle(getDrawerPanel(drawer));
    const titleStyle = getComputedStyle(drawer.shadowRoot?.querySelector<HTMLElement>('[part="title"]'));

    expect(panelStyle.backgroundColor).toBe(resolveColor('var(--bq-ui--primary)'));
    expect(panelStyle.color).toBe(resolveColor('var(--bq-text--primary)'));
    expect(titleStyle.color).toBe(resolveColor('var(--bq-text--primary)'));
  });

  it('should apply custom colour overrides', async () => {
    const { root } = await render(
      <bq-drawer
        open
        style={{ '--bq-drawer--background': 'rgb(255, 0, 0)', '--bq-drawer--text-color': 'rgb(0, 0, 255)' }}
      >
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );
    const drawer = root as HTMLBqDrawerElement;

    await waitForStable(root);

    const panelStyle = getComputedStyle(getDrawerPanel(drawer));

    expect(panelStyle.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(panelStyle.color).toBe('rgb(0, 0, 255)');
  });

  it('should not close on outside click when closeOnClickOutside is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-drawer closeOnClickOutside open>
        <div slot="title">Drawer Title</div>
      </bq-drawer>,
    );
    const drawer = root as HTMLBqDrawerElement;

    const panel = getDrawerPanel(drawer);
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100));

    window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 200, clientY: 50 }));
    await waitForChanges();

    expect(panel).toEqualAttribute('aria-hidden', 'false');
  });

  it('should not show when bqOpen is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-drawer />);
    const drawer = root as HTMLBqDrawerElement;

    root.addEventListener('bqOpen', (event) => event.preventDefault(), { once: true });
    await drawer.show();
    await waitForChanges();

    expect(getDrawerPanel(drawer)).toEqualAttribute('aria-hidden', 'true');
  });

  it('should not hide when bqClose is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-drawer open />);
    const drawer = root as HTMLBqDrawerElement;

    root.addEventListener('bqClose', (event) => event.preventDefault(), { once: true });
    await drawer.hide();
    await waitForChanges();

    expect(getDrawerPanel(drawer)).toEqualAttribute('aria-hidden', 'false');
  });
});

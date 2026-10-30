import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

const getDrawerPanel = (drawer: HTMLBqDrawerElement) =>
  drawer.shadowRoot?.querySelector<HTMLDivElement>('[part="panel"]');

const resolveBoxShadowToken = (name: string) => {
  const probe = document.createElement('span');
  probe.style.boxShadow = `var(${name})`;
  document.body.appendChild(probe);
  const { boxShadow } = getComputedStyle(probe);
  probe.remove();
  return boxShadow;
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

  it('should apply the selected drawer position', async () => {
    const { root } = await render(<bq-drawer open position="start" />);
    const drawer = root as HTMLBqDrawerElement;

    await waitForStable(root);

    const panel = getDrawerPanel(drawer);
    const panelStyle = getComputedStyle(panel);

    expect(panelStyle.insetInlineStart).toBe('0px');
    expect(panel.getBoundingClientRect().left).toBe(0);
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

    expect(panelStyle.backgroundColor).toBe(resolveColorToken('--bq-ui--primary'));
    expect(panelStyle.color).toBe(resolveColorToken('--bq-text--primary'));
    expect(titleStyle.color).toBe(resolveColorToken('--bq-text--primary'));
  });

  it('should preserve native panel structure, spacing and transitions', async () => {
    const { root } = await render(
      <bq-drawer open>
        <div slot="title">Drawer Title</div>
        <div>Body</div>
        <div slot="footer">Footer</div>
      </bq-drawer>,
    );
    const drawer = root as HTMLBqDrawerElement;

    await waitForStable(root);

    const panel = getDrawerPanel(drawer);
    const header = drawer.shadowRoot?.querySelector<HTMLElement>('[part="header"]');
    const title = drawer.shadowRoot?.querySelector<HTMLElement>('[part="title"]');
    const close = drawer.shadowRoot?.querySelector<HTMLElement>('[part="button-close"]');
    const body = drawer.shadowRoot?.querySelector<HTMLElement>('[part="body"]');
    const footer = drawer.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');
    const divider = drawer.shadowRoot?.querySelector<HTMLElement>('bq-divider');
    const panelStyle = getComputedStyle(panel);

    expect(getComputedStyle(drawer).visibility).toBe('visible');
    expect(panelStyle.position).toBe('fixed');
    expect(panelStyle.display).toBe('flex');
    expect(panelStyle.flexDirection).toBe('column');
    expect(panelStyle.inlineSize).toBe('320px');
    expect(panelStyle.maxInlineSize).toBe('100%');
    expect(panelStyle.insetBlockStart).toBe('0px');
    expect(panelStyle.insetBlockEnd).toBe('0px');
    expect(panelStyle.rowGap).toBe('24px');
    expect(panelStyle.padding).toBe('16px 24px');
    expect(panelStyle.zIndex).toBe('10');
    expect(panelStyle.boxShadow).toBe(resolveBoxShadowToken('--bq-box-shadow--m'));
    expect(panelStyle.transitionDuration).toBe('0.3s');
    expect(panelStyle.transitionProperty.split(', ')).toEqual(
      expect.arrayContaining(['inset-inline-start', 'inset-inline-end']),
    );
    expect(panelStyle.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(getComputedStyle(header).display).toBe('flex');
    expect(getComputedStyle(header).alignItems).toBe('center');
    expect(getComputedStyle(title).flexGrow).toBe('1');
    expect(getComputedStyle(title).fontSize).toBe('24px');
    expect(getComputedStyle(title).fontWeight).toBe('700');
    expect(getComputedStyle(close).display).toBe('flex');
    expect(getComputedStyle(body).display).toBe('block');
    expect(getComputedStyle(body).overflow).toBe('auto');
    expect(footer).not.toHaveAttribute('hidden');
    expect(getComputedStyle(footer).display).toBe('block');
    expect(getComputedStyle(divider).marginBlockEnd).toBe('16px');
  });

  it('should preserve backdrop styles and open state', async () => {
    const { root } = await render(<bq-drawer enableBackdrop open />);
    const drawer = root as HTMLBqDrawerElement;

    await waitForStable(root);

    const backdrop = drawer.shadowRoot?.querySelector<HTMLElement>('[part="backdrop"]');
    const backdropStyle = getComputedStyle(backdrop);

    expect(backdropStyle.position).toBe('fixed');
    expect(backdropStyle.inset).toBe('0px');
    expect(backdropStyle.backgroundColor).toBe(resolveColorToken('--bq-background--overlay'));
    expect(backdropStyle.opacity).toBe('0.6');
    expect(backdropStyle.pointerEvents).toBe('auto');
    expect(backdropStyle.transitionDuration).toBe('0.3s');
    expect(backdropStyle.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('should preserve public layout overrides', async () => {
    const { root } = await render(
      <bq-drawer
        open
        style={{
          '--bq-drawer--gap': '10px',
          '--bq-drawer--paddingX': '20px',
          '--bq-drawer--paddingY': '12px',
          '--bq-drawer--width': '360px',
          '--bq-drawer--zIndex': '42',
        }}
      />,
    );
    const drawer = root as HTMLBqDrawerElement;

    await waitForStable(root);

    const panelStyle = getComputedStyle(getDrawerPanel(drawer));

    expect(panelStyle.inlineSize).toBe('360px');
    expect(panelStyle.rowGap).toBe('10px');
    expect(panelStyle.padding).toBe('12px 20px');
    expect(panelStyle.zIndex).toBe('42');
  });

  it('should hide an empty footer with native hidden state', async () => {
    const { root } = await render(<bq-drawer open />);
    const drawer = root as HTMLBqDrawerElement;

    await waitForStable(root);

    const footer = drawer.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');

    expect(footer).toHaveAttribute('hidden');
    expect(getComputedStyle(footer).display).toBe('none');
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

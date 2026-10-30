import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { page } from 'vitest/browser';

import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

const getDialogPanel = (dialog: HTMLBqDialogElement) =>
  dialog.shadowRoot?.querySelector<HTMLDialogElement>('[part="dialog"]');

const resolveBoxShadowToken = (name: string) => {
  const probe = document.createElement('span');
  probe.style.boxShadow = `var(${name})`;
  document.body.appendChild(probe);
  const { boxShadow } = getComputedStyle(probe);
  probe.remove();
  return boxShadow;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-dialog', () => {
  it('should render', async () => {
    const { root } = await render(<bq-dialog />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-dialog />);

    expect(root).toHaveShadowRoot();
  });

  it('should display title', async () => {
    const { root } = await render(
      <bq-dialog>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );

    await waitForStable(root);

    const titleSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="title"]');
    expect(getTextContent(titleSlot, { recurse: true })).toBe('Dialog Title');
  });

  it('should display content', async () => {
    const { root } = await render(
      <bq-dialog>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      </bq-dialog>,
    );

    await waitForStable(root);

    const contentSlot = root.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    expect(getTextContent(contentSlot, { recurse: true })).toBe(
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    );
  });

  it('should call `show` and `hide` methods', async () => {
    const { root } = await render(
      <bq-dialog>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );
    const dialog = root as HTMLBqDialogElement;

    const panel = getDialogPanel(dialog);

    expect(panel).not.toHaveAttribute('open');

    const afterOpen = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterOpen', () => resolve(), { once: true }),
    );

    await dialog.show();
    await afterOpen;

    expect(panel).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    await dialog.hide();
    await afterClose;

    expect(panel).not.toHaveAttribute('open');
  });

  it('should cancel on "Escape"', async () => {
    const { root } = await render(
      <bq-dialog open>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const panel = getDialogPanel(dialog);

    expect(panel).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await afterClose;

    expect(panel).not.toHaveAttribute('open');
  });

  it('should not cancel on "Escape" when disableCloseEscKeydown is true', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-dialog disableCloseEscKeydown open>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const panel = getDialogPanel(dialog);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForChanges();

    expect(panel).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );
    await setProps({ open: false });
    await afterClose;
  });

  it('should not close on outside click when disableCloseClickOutside is true', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-dialog disableCloseClickOutside open>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const panel = getDialogPanel(dialog);
    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 100, 100));

    window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 200, clientY: 200 }));
    await waitForChanges();

    expect(panel).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );
    await setProps({ open: false });
    await afterClose;
  });

  it('should hide the close button when hideCloseButton is true', async () => {
    const { root } = await render(<bq-dialog hideCloseButton />);

    expect(root.shadowRoot?.querySelector('bq-button.bq-dialog--close')).toBeNull();
  });

  it('should apply the selected dialog size', async () => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    try {
      await page.viewport(800, viewport.height);
      const { root } = await render(<bq-dialog open size="small" />);
      const dialog = root as HTMLBqDialogElement;

      await waitForStable(root);

      const panel = getDialogPanel(dialog);

      expect(getComputedStyle(panel).inlineSize).toBe('320px');
    } finally {
      await page.viewport(viewport.width, viewport.height);
    }
  });

  it('should handle invalid size values', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-dialog size="medium" />);
    const dialog = root as HTMLBqDialogElement;

    await setProps({ size: 'invalid' });

    expect(dialog.size).toBe('large');
    expect(warnSpy).toHaveBeenCalledWith('[BQ-DIALOG] Please notice that "size" should be one of small|medium|large');
  });

  it('should use the colour custom properties', async () => {
    const { root } = await render(
      <bq-dialog footerAppearance="highlight">
        <h3 slot="title">Dialog Title</h3>
        <div slot="footer">Footer</div>
      </bq-dialog>,
    );
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const panelStyle = getComputedStyle(getDialogPanel(dialog));
    const footer = dialog.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');
    const backdropStyle = getComputedStyle(getDialogPanel(dialog), '::backdrop');

    expect(panelStyle.backgroundColor).toBe(resolveColorToken('--bq-ui--primary'));
    expect(panelStyle.color).toBe(resolveColorToken('--bq-text--primary'));
    expect(getComputedStyle(footer).backgroundColor).toBe(resolveColorToken('--bq-ui--alt'));
    expect(getComputedStyle(footer).paddingBlock).toBe('12px');
    expect(backdropStyle.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('should preserve native layout, spacing and transition styles', async () => {
    const { root } = await render(
      <bq-dialog open>
        <h3 slot="title">Dialog Title</h3>
        <p>Dialog content</p>
        <div slot="footer">Footer</div>
      </bq-dialog>,
    );
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const panel = getDialogPanel(dialog);
    const content = dialog.shadowRoot?.querySelector<HTMLElement>('[part="content"]');
    const header = dialog.shadowRoot?.querySelector<HTMLElement>('[part="header"]');
    const title = dialog.shadowRoot?.querySelector<HTMLElement>('[part="title"]');
    const body = dialog.shadowRoot?.querySelector<HTMLElement>('[part="body"]');
    const footer = dialog.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');
    const panelStyle = getComputedStyle(panel);

    expect(getComputedStyle(dialog).visibility).toBe('visible');
    expect(panelStyle.display).toBe('flex');
    expect(panelStyle.position).toBe('fixed');
    expect(panelStyle.flexDirection).toBe('column');
    expect(parseFloat(panelStyle.inlineSize)).toBeCloseTo(window.innerWidth * 0.9, 0);
    expect(panelStyle.rowGap).toBe('24px');
    expect(panelStyle.padding).toBe('0px');
    expect(panelStyle.borderRadius).toBe('12px');
    expect(panelStyle.boxShadow).toBe(resolveBoxShadowToken('--bq-box-shadow--l'));
    expect(getComputedStyle(content).display).toBe('flex');
    expect(getComputedStyle(content).flexDirection).toBe('column');
    expect(getComputedStyle(content).rowGap).toBe('12px');
    expect(getComputedStyle(header).padding).toBe('24px 24px 0px');
    expect(getComputedStyle(title).display).toBe('flex');
    expect(getComputedStyle(title).flexGrow).toBe('1');
    expect(getComputedStyle(body).paddingInline).toBe('24px');
    expect(getComputedStyle(body).overflowBlock).toBe('auto');
    expect(getComputedStyle(footer).padding).toBe('0px 24px 24px');
    expect(getComputedStyle(footer).columnGap).toBe('8px');

    panel.classList.add('is-entering', 'is-enter-start');
    const transitionStyle = getComputedStyle(panel);
    expect(transitionStyle.transitionProperty.split(', ')).toEqual(expect.arrayContaining(['opacity', 'transform']));
    expect(transitionStyle.transitionDuration).toBe('0.3s');
    await expect.poll(() => getComputedStyle(panel).opacity).toBe('0');
    expect(getComputedStyle(panel).transform).not.toBe('none');
    panel.classList.remove('is-entering', 'is-enter-start');
  });

  it('should preserve public layout overrides', async () => {
    const viewport = { width: window.innerWidth, height: window.innerHeight };

    try {
      await page.viewport(800, viewport.height);
      const { root } = await render(
        <bq-dialog
          open
          size="medium"
          style={{
            '--bq-dialog--content-footer-gap': '10px',
            '--bq-dialog--padding': '20px',
            '--bq-dialog--title-body-gap': '6px',
            '--bq-dialog--width-medium': '520px',
          }}
        >
          <h3 slot="title">Dialog Title</h3>
          <p>Dialog content</p>
          <div slot="footer">Footer</div>
        </bq-dialog>,
      );
      const dialog = root as HTMLBqDialogElement;

      await waitForStable(root);

      const panel = getDialogPanel(dialog);
      const content = dialog.shadowRoot?.querySelector<HTMLElement>('[part="content"]');
      const header = dialog.shadowRoot?.querySelector<HTMLElement>('[part="header"]');
      const footer = dialog.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');

      expect(getComputedStyle(panel).inlineSize).toBe('520px');
      expect(getComputedStyle(panel).rowGap).toBe('10px');
      expect(getComputedStyle(content).rowGap).toBe('6px');
      expect(getComputedStyle(header).padding).toBe('20px 20px 0px');
      expect(getComputedStyle(footer).padding).toBe('0px 20px 20px');
    } finally {
      await page.viewport(viewport.width, viewport.height);
    }
  });

  it('should hide empty content and footer with native hidden state', async () => {
    const { root } = await render(<bq-dialog open />);
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const body = dialog.shadowRoot?.querySelector<HTMLElement>('[part="body"]');
    const footer = dialog.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');

    expect(body).toHaveAttribute('hidden');
    expect(footer).toHaveAttribute('hidden');
    expect(getComputedStyle(body).display).toBe('none');
    expect(getComputedStyle(footer).display).toBe('none');
  });

  it('should preserve non-modal dialog positioning', async () => {
    const { root } = await render(<bq-dialog disableBackdrop open />);
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const panelStyle = getComputedStyle(getDialogPanel(dialog));

    expect(panelStyle.insetBlockStart).toBe(panelStyle.insetBlockEnd);
    expect(panelStyle.insetBlockStart).not.toBe('auto');
  });

  it('should apply a custom footer background', async () => {
    const { root } = await render(
      <bq-dialog footerAppearance="highlight" style={{ '--bq-dialog--footer-background': 'rgb(255, 0, 0)' }}>
        <div slot="footer">Footer</div>
      </bq-dialog>,
    );
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    const footer = dialog.shadowRoot?.querySelector<HTMLElement>('[part="footer"]');

    expect(getComputedStyle(footer).backgroundColor).toBe('rgb(255, 0, 0)');
  });

  it('should not show when bqOpen is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-dialog />);
    const dialog = root as HTMLBqDialogElement;

    root.addEventListener('bqOpen', (event) => event.preventDefault(), { once: true });
    await dialog.show();
    await waitForChanges();

    expect(getDialogPanel(dialog).hasAttribute('open')).toBe(false);
  });

  it('should not hide when bqClose is defaultPrevented', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-dialog open />);
    const dialog = root as HTMLBqDialogElement;

    await waitForStable(root);

    root.addEventListener('bqClose', (event) => event.preventDefault(), { once: true });
    await dialog.hide();
    await waitForChanges();

    expect(getDialogPanel(dialog)).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );
    await setProps({ open: false });
    await afterClose;
  });
});

import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { getTextContent } from '../../../shared/utils/slot';

const getDialogPanel = (dialog: HTMLBqDialogElement) =>
  dialog.shadowRoot?.querySelector<HTMLDialogElement>('[part="dialog"]');

const resolveColor = (value: string) => {
  const probe = document.createElement('span');
  probe.style.color = value;
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
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

  it('should apply the size class to the dialog panel', async () => {
    const { root } = await render(<bq-dialog size="small" />);
    const dialog = root as HTMLBqDialogElement;

    const panel = getDialogPanel(dialog);

    expect(panel).toHaveClass('small');
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

    expect(panelStyle.backgroundColor).toBe(resolveColor('var(--bq-ui--primary)'));
    expect(panelStyle.color).toBe(resolveColor('var(--bq-text--primary)'));
    expect(getComputedStyle(footer).backgroundColor).toBe(resolveColor('var(--bq-ui--alt)'));
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

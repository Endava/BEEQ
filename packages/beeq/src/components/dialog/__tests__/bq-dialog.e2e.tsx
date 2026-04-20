import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { getTextContent } from '../../../shared/utils/slot';

const getDialogPanel = (dialog: HTMLBqDialogElement) =>
  dialog.shadowRoot?.querySelector('[part="dialog"]') as HTMLDialogElement;

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

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display title', async () => {
    const { root } = await render(
      <bq-dialog>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );

    await waitForStable(root);

    const titleSlot = root.shadowRoot?.querySelector('slot[name="title"]') as HTMLSlotElement;

    expect(getTextContent(titleSlot, { recurse: true })).toBe('Dialog Title');
  });

  it('should display content', async () => {
    const { root } = await render(
      <bq-dialog>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      </bq-dialog>,
    );

    await waitForStable(root);

    const contentSlot = root.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;

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

    const dialog = getDialogPanel(root);

    expect(dialog.hasAttribute('open')).toBe(false);

    const afterOpen = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterOpen', () => resolve(), { once: true }),
    );

    await root.show();
    await afterOpen;

    expect(dialog).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    await root.hide();
    await afterClose;

    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('should cancel on "Escape"', async () => {
    const { root } = await render(
      <bq-dialog open>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );

    await waitForStable(root);

    const dialog = getDialogPanel(root);

    expect(dialog).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await afterClose;

    expect(dialog.hasAttribute('open')).toBe(false);
  });

  it('should not cancel on "Escape" when disableCloseEscKeydown is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-dialog disableCloseEscKeydown open>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );

    await waitForStable(root);

    const dialog = getDialogPanel(root);

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
    await waitForChanges();

    expect(dialog).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );
    root.open = false;
    await afterClose;
  });

  it('should not close on outside click when disableCloseClickOutside is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-dialog disableCloseClickOutside open>
        <h3 slot="title">Dialog Title</h3>
      </bq-dialog>,
    );

    await waitForStable(root);

    const dialog = getDialogPanel(root);
    vi.spyOn(dialog, 'getBoundingClientRect').mockReturnValue({
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

    window.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 200, clientY: 200 }));
    await waitForChanges();

    expect(dialog).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );
    root.open = false;
    await afterClose;
  });

  it('should hide the close button when hideCloseButton is true', async () => {
    const { root } = await render(<bq-dialog hideCloseButton />);

    expect(root.shadowRoot?.querySelector('bq-button.bq-dialog--close')).toBeNull();
  });

  it('should apply the size class to the dialog panel', async () => {
    const { root } = await render(<bq-dialog size="small" />);

    const dialog = getDialogPanel(root);

    expect(dialog.classList.contains('small')).toBe(true);
  });

  it('should handle invalid size values', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(<bq-dialog size="medium" />);

    root.size = 'invalid' as HTMLBqDialogElement['size'];
    await waitForChanges();

    expect(root.size).toBe('large');
    expect(warnSpy).toHaveBeenCalledWith('[BQ-DIALOG] Please notice that "size" should be one of small|medium|large');
  });

  it('should not show when bqOpen is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-dialog />);

    root.addEventListener('bqOpen', (event) => event.preventDefault(), { once: true });
    await root.show();
    await waitForChanges();

    expect(getDialogPanel(root).hasAttribute('open')).toBe(false);
  });

  it('should not hide when bqClose is defaultPrevented', async () => {
    const { root, waitForChanges } = await render(<bq-dialog open />);

    await waitForStable(root);

    root.addEventListener('bqClose', (event) => event.preventDefault(), { once: true });
    await root.hide();
    await waitForChanges();

    expect(getDialogPanel(root)).toHaveAttribute('open');

    const afterClose = new Promise<void>((resolve) =>
      root.addEventListener('bqAfterClose', () => resolve(), { once: true }),
    );
    root.open = false;
    await afterClose;
  });
});

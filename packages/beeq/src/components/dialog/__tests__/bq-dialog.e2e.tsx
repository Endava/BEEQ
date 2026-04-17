import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

const getDialogPanel = (dialog: HTMLBqDialogElement) =>
  dialog.shadowRoot?.querySelector('[part="dialog"]') as HTMLDialogElement;

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
    const titleElement = titleSlot.assignedElements({ flatten: true })[0];

    expect(titleElement.textContent?.trim()).toBe('Dialog Title');
  });

  it('should display content', async () => {
    const { root } = await render(
      <bq-dialog>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      </bq-dialog>,
    );

    await waitForStable(root);

    const contentSlot = root.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement;
    const contentElement = contentSlot.assignedElements({ flatten: true })[0];

    expect(contentElement.textContent?.trim()).toBe(
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
});

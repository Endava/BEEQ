import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getDropdownPanelHost = (dropdown: HTMLBqDropdownElement) =>
  dropdown.shadowRoot?.querySelector('.bq-dropdown__panel') as HTMLBqPanelElement;

describe('bq-dropdown', () => {
  it('should render', async () => {
    const { root } = await render(<bq-dropdown />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-dropdown />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should be visible on click', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    const button = root.querySelector('bq-button') as HTMLBqButtonElement;

    await userEvent.click(button);
    await waitForChanges();

    const dropdownPanel = getDropdownPanelHost(root);

    expect(dropdownPanel).toHaveAttribute('open');
  });

  it('should open based on `open` prop', async () => {
    const { root } = await render(
      <bq-dropdown open={true}>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    await waitForStable(root);

    const dropdownPanel = getDropdownPanelHost(root);

    expect(dropdownPanel).toHaveAttribute('open');
  });

  it('should close on "Escape"', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown open>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    const dropdownPanel = getDropdownPanelHost(root);

    expect(dropdownPanel).toHaveAttribute('open');

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(dropdownPanel).not.toHaveAttribute('open');
  });

  it('should change placement value', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    root.placement = 'bottom';
    await waitForChanges();

    const dropdownPanel = getDropdownPanelHost(root);

    expect(dropdownPanel).toHaveAttribute('placement', 'bottom');
  });

  it('should not open when disabled', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown disabled>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    const button = root.querySelector('bq-button') as HTMLBqButtonElement;

    await userEvent.click(button);
    await waitForChanges();

    const dropdownPanel = getDropdownPanelHost(root);

    expect(dropdownPanel).not.toHaveAttribute('open');
  });

  it('should emit bqOpen when opened', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    const bqOpen = spyOnEvent('bqOpen');
    const button = root.querySelector('bq-button') as HTMLBqButtonElement;

    await userEvent.click(button);
    await waitForChanges();

    expect(bqOpen).toHaveReceivedEventTimes(1);
    expect(bqOpen.events[0].detail.open).toBe(true);
  });

  it('should close on `bqSelect` by default', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown open>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    root.dispatchEvent(new CustomEvent('bqSelect', { bubbles: true, composed: true }));
    await waitForChanges();

    expect(getDropdownPanelHost(root)).not.toHaveAttribute('open');
  });

  it('should stay open on `bqSelect` when keepOpenOnSelect is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown keepOpenOnSelect open>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    root.dispatchEvent(new CustomEvent('bqSelect', { bubbles: true, composed: true }));
    await waitForChanges();

    expect(getDropdownPanelHost(root)).toHaveAttribute('open');
  });

  it('should close when clicking outside', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <bq-dropdown open>
          <bq-button slot="trigger">Open</bq-button>
          <div>Some content in panel</div>
        </bq-dropdown>
        <button type="button">Outside</button>
      </div>,
    );

    const dropdown = root.querySelector('bq-dropdown') as HTMLBqDropdownElement;
    const outsideButton = root.querySelector('button') as HTMLButtonElement;

    await userEvent.click(outsideButton);
    await waitForChanges();

    expect(getDropdownPanelHost(dropdown)).not.toHaveAttribute('open');
  });

  it('should pass sameWidth and panelHeight props to the panel', async () => {
    const { root } = await render(
      <bq-dropdown panelHeight="240px" sameWidth>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    await waitForStable(root);

    const panel = root.shadowRoot?.querySelector('bq-panel') as HTMLBqPanelElement;

    expect(panel).toHaveAttribute('same-width');
    expect(panel.style.getPropertyValue('--bq-panel--height')).toBe('240px');
  });
});

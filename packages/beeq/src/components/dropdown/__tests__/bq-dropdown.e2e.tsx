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

  it('should close on `bqSelect` unless `keepOpenOnSelect` is true', async () => {
    const { root: closingDropdown, waitForChanges: waitForClosingChanges } = await render(
      <bq-dropdown open>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    closingDropdown.dispatchEvent(new CustomEvent('bqSelect', { bubbles: true, composed: true }));
    await waitForClosingChanges();

    expect(getDropdownPanelHost(closingDropdown)).not.toHaveAttribute('open');

    const { root: persistentDropdown, waitForChanges: waitForPersistentChanges } = await render(
      <bq-dropdown keepOpenOnSelect open>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );

    persistentDropdown.dispatchEvent(new CustomEvent('bqSelect', { bubbles: true, composed: true }));
    await waitForPersistentChanges();

    expect(getDropdownPanelHost(persistentDropdown)).toHaveAttribute('open');
  });
});

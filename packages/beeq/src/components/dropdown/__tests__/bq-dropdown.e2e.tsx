import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getDropdownPanelHost = (dropdown: HTMLBqDropdownElement) =>
  dropdown.shadowRoot?.querySelector<HTMLBqPanelElement>('.bq-dropdown__panel');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-dropdown', () => {
  it('should render', async () => {
    const { root } = await render(<bq-dropdown />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-dropdown />);

    expect(root).toHaveShadowRoot();
  });

  it('should be visible on click', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );
    const dropdown = root as HTMLBqDropdownElement;

    const button = root.querySelector('bq-button');

    await userEvent.click(button);
    await waitForChanges();

    const dropdownPanel = getDropdownPanelHost(dropdown);

    expect(dropdownPanel).toHaveAttribute('open');
  });

  it('should open based on `open` prop', async () => {
    const { root } = await render(
      <bq-dropdown open={true}>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );
    const dropdown = root as HTMLBqDropdownElement;

    await waitForStable(root);

    const dropdownPanel = getDropdownPanelHost(dropdown);

    expect(dropdownPanel).toHaveAttribute('open');
  });

  it('should close on "Escape"', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown open>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );
    const dropdown = root as HTMLBqDropdownElement;

    const dropdownPanel = getDropdownPanelHost(dropdown);

    expect(dropdownPanel).toHaveAttribute('open');

    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(dropdownPanel).not.toHaveAttribute('open');
  });

  it('should change placement value', async () => {
    const { root, setProps } = await render(
      <bq-dropdown>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );
    const dropdown = root as HTMLBqDropdownElement;

    await setProps({ placement: 'bottom' });

    const dropdownPanel = getDropdownPanelHost(dropdown);

    expect(dropdownPanel).toHaveAttribute('placement');
    expect(dropdownPanel).toEqualAttribute('placement', 'bottom');
  });

  it('should not open when disabled', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown disabled>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );
    const dropdown = root as HTMLBqDropdownElement;

    const button = root.querySelector('bq-button') as HTMLBqButtonElement;

    await userEvent.click(button);
    await waitForChanges();

    const dropdownPanel = getDropdownPanelHost(dropdown);

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
    const button = root.querySelector<HTMLBqButtonElement>('bq-button');

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
    const dropdown = root as HTMLBqDropdownElement;

    root.dispatchEvent(new CustomEvent('bqSelect', { bubbles: true, composed: true }));
    await waitForChanges();

    expect(getDropdownPanelHost(dropdown)).not.toHaveAttribute('open');
  });

  it('should stay open on `bqSelect` when keepOpenOnSelect is true', async () => {
    const { root, waitForChanges } = await render(
      <bq-dropdown keepOpenOnSelect open>
        <bq-button slot="trigger">Open</bq-button>
        <div>Some content in panel</div>
      </bq-dropdown>,
    );
    const dropdown = root as HTMLBqDropdownElement;

    root.dispatchEvent(new CustomEvent('bqSelect', { bubbles: true, composed: true }));
    await waitForChanges();

    expect(getDropdownPanelHost(dropdown)).toHaveAttribute('open');
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

    const dropdown = root.querySelector<HTMLBqDropdownElement>('bq-dropdown');
    const outsideButton = root.querySelector<HTMLButtonElement>('button');

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

    const panel = root.shadowRoot?.querySelector<HTMLBqPanelElement>('bq-panel');

    expect(panel).toHaveAttribute('same-width');
    expect(panel.style.getPropertyValue('--bq-panel--height')).toBe('240px');
  });

  describe('single open panel', () => {
    it('should close an open dropdown when another one opens programmatically', async () => {
      const { root, waitForChanges } = await render(
        <div>
          <bq-dropdown id="dropdown-a">
            <bq-button slot="trigger">Open A</bq-button>
            <div>Panel A</div>
          </bq-dropdown>
          <bq-dropdown id="dropdown-b">
            <bq-button slot="trigger">Open B</bq-button>
            <div>Panel B</div>
          </bq-dropdown>
        </div>,
      );
      const dropdownA = root.querySelector<HTMLBqDropdownElement>('#dropdown-a');
      const dropdownB = root.querySelector<HTMLBqDropdownElement>('#dropdown-b');

      dropdownA.open = true;
      await waitForChanges();
      dropdownB.open = true;
      await waitForChanges();

      expect(dropdownA.open).toBe(false);
      expect(dropdownB.open).toBe(true);
      expect(getDropdownPanelHost(dropdownA)).not.toHaveAttribute('open');
    });

    it('should keep the parent dropdown open when a nested dropdown opens', async () => {
      const { root, waitForChanges } = await render(
        <bq-dropdown id="parent">
          <bq-button slot="trigger">Open parent</bq-button>
          <bq-dropdown id="child">
            <bq-button slot="trigger">Open child</bq-button>
            <div>Child panel</div>
          </bq-dropdown>
        </bq-dropdown>,
      );
      const parent = root as HTMLBqDropdownElement;
      const child = root.querySelector<HTMLBqDropdownElement>('#child');

      parent.open = true;
      await waitForChanges();
      child.open = true;
      await waitForChanges();

      expect(parent.open).toBe(true);
      expect(child.open).toBe(true);
    });

    it('should ignore `bqOpen` events that are not emitted by a dropdown', async () => {
      const { root, waitForChanges } = await render(
        <bq-dropdown open>
          <bq-button slot="trigger">Open</bq-button>
          <div>Panel</div>
        </bq-dropdown>,
      );
      const dropdown = root as HTMLBqDropdownElement;

      document.body.dispatchEvent(new CustomEvent('bqOpen', { bubbles: true, composed: true, detail: { open: true } }));
      await waitForChanges();

      expect(dropdown.open).toBe(true);
    });
  });
});

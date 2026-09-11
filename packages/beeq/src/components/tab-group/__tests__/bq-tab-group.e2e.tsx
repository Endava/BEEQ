import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

// Shared fixture — 4 tabs with a given active value
const mkGroup = (
  value = '1',
  extra: Partial<{
    size: 'small' | 'medium' | 'large';
    disableDivider: boolean;
    orientation: 'horizontal' | 'vertical';
  }> = {},
) => (
  <bq-tab-group value={value} size={extra.size} disable-divider={extra.disableDivider} orientation={extra.orientation}>
    <bq-tab tabId="1" controls="panel-1">
      Tab 1
    </bq-tab>
    <bq-tab tabId="2" controls="panel-2">
      Tab 2
    </bq-tab>
    <bq-tab tabId="3" controls="panel-3">
      Tab 3
    </bq-tab>
    <bq-tab tabId="4" controls="panel-4">
      Tab 4
    </bq-tab>
  </bq-tab-group>
);

describe('bq-tab-group', () => {
  it('should render', async () => {
    const { root } = await render(mkGroup());

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(mkGroup());

    expect(root).toHaveShadowRoot();
  });

  it('should propagate size to all child tabs', async () => {
    const { root } = await render(mkGroup('1', { size: 'large' }));

    const tabs = Array.from(root.querySelectorAll('bq-tab')) as HTMLBqTabElement[];

    tabs.forEach((tab) => {
      expect(tab.size).toBe('large');
    });
  });

  it('should mark the correct tab as active based on value', async () => {
    const { root } = await render(mkGroup('2'));

    const activeTab = root.querySelector('bq-tab[active]');

    expect(activeTab?.textContent?.trim()).toBe('Tab 2');
  });

  it('should emit bqChange on tab click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(mkGroup());
    const bqFocus = spyOnEvent('bqFocus');
    const bqChange = spyOnEvent('bqChange');
    const bqBlur = spyOnEvent('bqBlur');

    const tab2 = root.querySelector<HTMLBqTabElement>('bq-tab[tab-id="2"]');
    await userEvent.click(tab2);
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);

    const changeEvent = bqChange.events[0];
    expect(changeEvent.detail.value).toBe('2');
  });

  it('should emit bqChange on keyboard navigation via arrow keys', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(mkGroup());
    const bqFocus = spyOnEvent('bqFocus');
    const bqChange = spyOnEvent('bqChange');
    const bqBlur = spyOnEvent('bqBlur');

    // Focus tab 1 via Tab key, then navigate forward with ArrowRight 3×
    await userEvent.tab();
    await waitForChanges();

    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();

    // Tab out to trigger blur on the last focused tab
    await userEvent.tab();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(4);
    expect(bqChange).toHaveReceivedEventTimes(3);
    expect(bqBlur).toHaveReceivedEventTimes(4);
    expect((root as HTMLBqTabGroupElement).value).toBe('4');
  });

  it('should change active tab when value is updated externally', async () => {
    const { root, setProps } = await render(mkGroup());

    await setProps({ value: '3' });

    const activeTab = root.querySelector('bq-tab[active]');

    expect(activeTab?.textContent?.trim()).toBe('Tab 3');
  });

  it('should propagate orientation and placement to all child tabs', async () => {
    const { root } = await render(mkGroup('1', { orientation: 'vertical' }));

    const tabs = Array.from(root.querySelectorAll('bq-tab')) as HTMLBqTabElement[];

    tabs.forEach((tab) => {
      expect(tab.orientation).toBe('vertical');
    });
  });

  it('should skip disabled tabs during ArrowRight keyboard navigation', async () => {
    const { root, waitForChanges } = await render(
      <bq-tab-group value="1">
        <bq-tab tabId="1" controls="panel-1">
          Tab 1
        </bq-tab>
        <bq-tab tabId="2" controls="panel-2" disabled>
          Tab 2
        </bq-tab>
        <bq-tab tabId="3" controls="panel-3">
          Tab 3
        </bq-tab>
      </bq-tab-group>,
    );

    // Focus tab1 directly to avoid cross-test focus-position side effects from userEvent.tab()
    const tab1 = root.querySelector<HTMLBqTabElement>('bq-tab[tab-id="1"]');
    await tab1.vFocus();
    await waitForChanges();

    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();

    // Tab 2 is disabled so getNextElement skips it and lands on Tab 3
    expect(root.getAttribute('value')).toBe('3');
  });

  it('should navigate backward with ArrowLeft', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(mkGroup('4'));
    const bqChange = spyOnEvent('bqChange');

    await userEvent.tab();
    await waitForChanges();

    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(2);
    expect((root as HTMLBqTabGroupElement).value).toBe('2');
  });

  it('should hide the divider when `disable-divider` is set', async () => {
    const { root } = await render(mkGroup('1', { disableDivider: true }));

    const base = root.shadowRoot.querySelector<HTMLElement>('[part="base"]');

    expect(root).toHaveAttribute('disable-divider');
    expect(window.getComputedStyle(base, '::after').content).toBe('none');
  });

  it('should render with vertical orientation', async () => {
    const { root } = await render(mkGroup('1', { orientation: 'vertical' }));
    const tabs = root.shadowRoot.querySelector<HTMLElement>('[part="tabs"]');

    expect(root).toEqualAttribute('orientation', 'vertical');
    expect(window.getComputedStyle(tabs).flexDirection).toBe('column');
  });
});

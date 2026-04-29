import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

describe('bq-tab', () => {
  it('should render', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel 1">
        Tab text
      </bq-tab>,
    );

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );

    expect(root).toHaveShadowRoot();
  });

  it('should display text content', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        <p>Tab text</p>
      </bq-tab>,
    );

    const slot = root.shadowRoot.querySelector<HTMLSlotElement>('[part="text"] > slot');
    const assigned = slot.assignedElements({ flatten: true });

    expect(assigned[0].textContent).toBe('Tab text');
  });

  it('should display icon when icon slot is used', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        <bq-icon name="check" slot="icon" />
        Tab text
      </bq-tab>,
    );

    const iconSlot = root.shadowRoot.querySelector<HTMLSlotElement>('[part="icon"] > slot');

    expect(iconSlot.assignedElements({ flatten: true })).toHaveLength(1);
  });

  it('should render as active when `active` prop is set', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1" active>
        Tab text
      </bq-tab>,
    );

    const btn = root.shadowRoot.querySelector('[part="base"]');

    expect(root).toHaveAttribute('active');
    expect(btn).toEqualAttribute('aria-selected', 'true');
  });

  it('should emit bqClick when tab is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );
    const bqClick = spyOnEvent('bqClick');

    await userEvent.click(root);
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqFocus and bqBlur on keyboard navigation', async () => {
    await render(
      <div>
        <bq-tab tabId="1" controls="panel-1">
          Tab text
        </bq-tab>
        <bq-tab tabId="2" controls="panel-2">
          Tab text
        </bq-tab>
      </div>,
    );

    let focusCount = 0,
      blurCount = 0,
      clickCount = 0;

    // Use capture phase so we receive events even if they don't bubble
    const onFocus = () => focusCount++;
    const onBlur = () => blurCount++;
    const onClick = () => clickCount++;
    document.addEventListener('bqFocus', onFocus, { capture: true });
    document.addEventListener('bqBlur', onBlur, { capture: true });
    document.addEventListener('bqClick', onClick, { capture: true });

    try {
      await userEvent.tab();
      await userEvent.tab();

      expect(focusCount).toBe(2);
      expect(clickCount).toBe(0);
      expect(blurCount).toBe(1);
      expect(document.activeElement?.tagName.toLowerCase()).toBe('bq-tab');
    } finally {
      document.removeEventListener('bqFocus', onFocus, { capture: true });
      document.removeEventListener('bqBlur', onBlur, { capture: true });
      document.removeEventListener('bqClick', onClick, { capture: true });
    }
  });

  it('should set aria-controls on the inner button', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );

    const btn = root.shadowRoot.querySelector('[part="base"]');

    expect(btn).toEqualAttribute('aria-controls', 'panel-1');
  });

  it('should emit bqKeyDown when a key is pressed', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );
    const bqKeyDown = spyOnEvent('bqKeyDown');

    root.shadowRoot.querySelector<HTMLButtonElement>('[part="base"]').focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();

    expect(bqKeyDown).toHaveReceivedEventTimes(1);
  });

  it('should support vFocus(), vBlur() and vClick() public methods', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqClick = spyOnEvent('bqClick');
    const tab = root as HTMLBqTabElement;

    await tab.vFocus();
    await waitForChanges();
    expect(bqFocus).toHaveReceivedEventTimes(1);

    await tab.vBlur();
    await waitForChanges();
    expect(bqBlur).toHaveReceivedEventTimes(1);

    await tab.vClick();
    await waitForChanges();
    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should render as disabled when `disabled` prop is set', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1" disabled>
        Tab text
      </bq-tab>,
    );

    const btn = root.shadowRoot.querySelector<HTMLButtonElement>('[part="base"]');
    // The disabled attribute on the inner button prevents real user interaction.
    // bq-tab has no explicit guard in handleClick — the browser's disabled state handles it.
    expect(btn).toHaveAttribute('disabled');
    expect(btn).toEqualAttribute('aria-disabled', 'true');
  });

  it('should respect design style', async () => {
    await render(
      <div>
        <bq-tab tabId="1" controls="panel-1" size="small">
          Tab text
        </bq-tab>
        <bq-tab tabId="2" controls="panel-2" size="medium">
          Tab text
        </bq-tab>
        <bq-tab tabId="3" controls="panel-3" size="large">
          Tab text
        </bq-tab>
      </div>,
    );

    const smallStyle = computedStyle('bq-tab[size="small"] >>> [part="base"]', ['padding']);
    const mediumStyle = computedStyle('bq-tab[size="medium"] >>> [part="base"]', ['padding']);
    const largeStyle = computedStyle('bq-tab[size="large"] >>> [part="base"]', ['padding']);

    expect(smallStyle).toEqual({ padding: '4px 16px' });
    expect(mediumStyle).toEqual({ padding: '8px 24px' });
    expect(largeStyle).toEqual({ padding: '12px 24px' });
  });
});

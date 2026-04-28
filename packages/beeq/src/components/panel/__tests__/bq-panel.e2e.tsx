import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const getPanel = (element: HTMLElement) => element.shadowRoot?.querySelector<HTMLDivElement>('[part="panel"]');
const getSlot = (element: HTMLElement) => element.shadowRoot?.querySelector<HTMLSlotElement>('slot');

describe('bq-panel', () => {
  it('should render', async () => {
    const { root } = await render(<bq-panel />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-panel />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should toggle panel visibility semantics with the open property', async () => {
    const { root, waitForChanges } = await render(<bq-panel>Some content</bq-panel>);
    const bqPanel = root as HTMLBqPanelElement;

    const panel = getPanel(root);

    expect(panel.hidden).toBe(true);
    expect(panel.getAttribute('aria-hidden')).toBe('true');

    bqPanel.open = true;
    await waitForChanges();

    expect(panel.hidden).toBe(false);
    expect(panel.getAttribute('aria-hidden')).toBe('false');
  });

  it('should render slotted content when open', async () => {
    const { root } = await render(<bq-panel open>Panel content</bq-panel>);

    expect(getTextContent(getSlot(root))).toBe('Panel content');
  });

  it('should reflect the disableScrollLock property', async () => {
    const { root } = await render(
      <bq-panel disableScrollLock open>
        Some content
      </bq-panel>,
    );

    expect(root).toHaveAttribute('disable-scroll-lock');
  });

  it('should reflect positioning-related properties', async () => {
    const { root } = await render(
      <bq-panel distance={12} open placement="top-end" sameWidth skidding={8} strategy="absolute">
        Some content
      </bq-panel>,
    );

    expect(root).toEqualAttribute('distance', '12');
    expect(root).toEqualAttribute('placement', 'top-end');
    expect(root).toHaveAttribute('same-width');
    expect(root).toEqualAttribute('skidding', '8');
    expect(root).toEqualAttribute('strategy', 'absolute');
  });

  it('should respect the expected design styles', async () => {
    const { root } = await render(<bq-panel open>Some content in the panel</bq-panel>);

    await waitForStable(root);

    const panelStyle = computedStyle('bq-panel >>> [part="panel"]', ['width', 'boxShadow', 'padding']);

    expect(panelStyle).toEqual({
      width: '320px',
      boxShadow:
        'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.12) 0px 10px 48px -16px',
      padding: '8px',
    });
  });
});

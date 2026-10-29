import { h } from '@stencil/core';
import { beforeEach, describe, expect, it, render } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

/** Waits for any running CSS transition inside the element's shadow root to finish */
const waitForTransitions = async (element: Element) => {
  const animations = element.shadowRoot?.getAnimations() ?? [];
  await Promise.all(animations.map((animation) => animation.finished));
};

// Hover/click tests leave the Playwright cursor where they finished, so a freshly rendered element can
// render under it and pick up `:hover` styles. Before each test, park the cursor in the bottom-right corner
// of the top-level page (CDP coordinates), which lies outside the scaled test iframe.
const movePointerOff = () =>
  cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: window.top.innerWidth - 1,
    y: window.top.innerHeight - 1,
  });

beforeEach(async () => {
  await movePointerOff();
});

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
    const icon = root.shadowRoot.querySelector<HTMLElement>('[part="icon"]');
    const content = root.shadowRoot.querySelector<HTMLElement>('[part="content"]');
    const slottedIcon = root.querySelector<HTMLElement>('bq-icon');

    expect(iconSlot.assignedElements({ flatten: true })).toHaveLength(1);
    expect(icon).not.toHaveAttribute('hidden');
    expect(getComputedStyle(icon).display).toBe('flex');
    expect(getComputedStyle(content).columnGap).toBe('8px');
    expect(getComputedStyle(slottedIcon).getPropertyValue('--bq-icon--size').trim()).toBe('24px');
  });

  it('should hide the optional icon wrapper with the native hidden attribute', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );

    const icon = root.shadowRoot.querySelector<HTMLElement>('[part="icon"]');

    expect(icon).toHaveAttribute('hidden');
    expect(getComputedStyle(icon).display).toBe('none');
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
    expect(getComputedStyle(btn).cursor).toBe('not-allowed');
    expect(getComputedStyle(btn).opacity).toBe('0.6');
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

    const smallStyle = computedStyle('bq-tab[size="small"] >>> [part="base"]', ['fontSize', 'padding']);
    const mediumStyle = computedStyle('bq-tab[size="medium"] >>> [part="base"]', ['fontSize', 'padding']);
    const largeStyle = computedStyle('bq-tab[size="large"] >>> [part="base"]', ['fontSize', 'padding']);

    expect(smallStyle).toEqual({ fontSize: '16px', padding: '4px 16px' });
    expect(mediumStyle).toEqual({ fontSize: '16px', padding: '8px 24px' });
    expect(largeStyle).toEqual({ fontSize: '18px', padding: '12px 24px' });
  });

  it('should preserve native structure, typography and transition timing', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );

    const base = root.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    const content = root.shadowRoot.querySelector<HTMLElement>('[part="content"]');
    const text = root.shadowRoot.querySelector<HTMLElement>('[part="text"]');
    const baseStyle = getComputedStyle(base);
    const contentStyle = getComputedStyle(content);
    const textStyle = getComputedStyle(text);

    expect(baseStyle.display).toBe('flex');
    expect(baseStyle.alignItems).toBe('center');
    expect(baseStyle.justifyContent).toBe('center');
    expect(baseStyle.borderRadius).toBe('8px');
    expect(baseStyle.fontSize).toBe('16px');
    expect(baseStyle.fontWeight).toBe('500');
    expect(baseStyle.lineHeight).toBe('24px');
    expect(baseStyle.transitionDuration).toBe('0.3s');
    expect(baseStyle.transitionProperty).toBe('color, background-color, border-color, box-shadow, -webkit-box-shadow');
    expect(baseStyle.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(contentStyle.display).toBe('flex');
    expect(textStyle.overflow).toBe('hidden');
    expect(textStyle.webkitLineClamp).toBe('1');
  });

  it.each([
    {
      orientation: 'horizontal',
      placement: 'start',
      expectedInsets: { 'inset-block-end': '-4px', 'inset-inline-start': '-2px' },
    },
    {
      orientation: 'vertical',
      placement: 'start',
      expectedInsets: { 'inset-block-end': '-4px', 'inset-inline-end': '-4px' },
    },
    {
      orientation: 'vertical',
      placement: 'end',
      expectedInsets: { 'inset-block-end': '-4px', 'inset-inline-start': '-4px' },
    },
  ] as const)(
    'should preserve the $orientation-$placement indicator geometry',
    async ({ orientation, placement, expectedInsets }) => {
      const { root } = await render(
        <bq-tab tabId="1" controls="panel-1" orientation={orientation} placement={placement} active>
          Tab text
        </bq-tab>,
      );

      const base = root.shadowRoot.querySelector<HTMLElement>('[part="base"]');
      const indicator = getComputedStyle(base, '::after');
      const baseRect = base.getBoundingClientRect();

      if (orientation === 'horizontal') {
        expect(indicator.blockSize).toBe('2px');
        expect(Number.parseFloat(indicator.inlineSize)).toBeCloseTo(baseRect.width + 4);
      } else {
        expect(Number.parseFloat(indicator.blockSize)).toBeCloseTo(baseRect.height + 4);
        expect(indicator.inlineSize).toBe('2px');
      }
      expect(indicator.opacity).toBe('1');
      expect(indicator.transitionDuration).toBe('0.3s');
      expect(indicator.transitionProperty).toBe('opacity');
      expect(indicator.transitionTimingFunction).toBe('linear');
      for (const [property, value] of Object.entries(expectedInsets)) {
        expect(indicator.getPropertyValue(property)).toBe(value);
      }
    },
  );

  it('should draw the standard focus ring around the native button', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );

    await userEvent.tab();

    const baseStyle = getComputedStyle(root.shadowRoot.querySelector('[part="base"]'));
    expect(baseStyle.outlineColor).toBe(resolveColorToken('--bq-focus'));
    expect(baseStyle.outlineOffset).toBe('1px');
    expect(baseStyle.outlineStyle).toBe('solid');
    expect(baseStyle.outlineWidth).toBe('2px');
  });

  it('should use the text and indicator color variables', async () => {
    const { root } = await render(
      <div>
        <bq-tab tabId="1" controls="panel-1">
          Tab text
        </bq-tab>
        <bq-tab tabId="2" controls="panel-2" active>
          Tab text
        </bq-tab>
      </div>,
    );

    const tabStyle = getComputedStyle(root.querySelector('bq-tab'));
    expect(tabStyle.getPropertyValue('--bq-tab--text-color').trim()).toBe(
      tabStyle.getPropertyValue('--bq-text--primary').trim(),
    );
    expect(tabStyle.getPropertyValue('--bq-tab--text-color-active').trim()).toBe(
      tabStyle.getPropertyValue('--bq-text--brand').trim(),
    );
    expect(tabStyle.getPropertyValue('--bq-tab--indicator-color').trim()).toBe(
      tabStyle.getPropertyValue('--bq-ui--brand').trim(),
    );

    await Promise.all(Array.from(root.querySelectorAll('bq-tab')).map((tab) => waitForTransitions(tab)));

    const inactiveBase = computedStyle('bq-tab[tab-id="1"] >>> [part="base"]', ['color']);
    const activeBase = computedStyle('bq-tab[tab-id="2"] >>> [part="base"]', ['color']);
    const activeIndicator = getComputedStyle(
      root.querySelector('bq-tab[tab-id="2"]').shadowRoot.querySelector('[part="base"]'),
      '::after',
    );

    expect(inactiveBase.color).toBe(resolveColorToken('--bq-text--primary'));
    expect(activeBase.color).toBe(resolveColorToken('--bq-text--brand'));
    expect(activeIndicator.backgroundColor).toBe(resolveColorToken('--bq-ui--brand'));
  });

  it('should allow overriding the active text color variable', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1" active style={{ '--bq-tab--text-color-active': 'rgb(1, 2, 3)' }}>
        Tab text
      </bq-tab>,
    );

    await waitForTransitions(root);

    expect(computedStyle('bq-tab >>> [part="base"]', ['color']).color).toBe('rgb(1, 2, 3)');
  });

  it('should mix the hover base colors with the hover overlay', async () => {
    const { root } = await render(
      <bq-tab tabId="1" controls="panel-1">
        Tab text
      </bq-tab>,
    );

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-tab--background-hover').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--primary').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-tab--text-color-hover').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--brand').trim(),
    );

    const base = root.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    await userEvent.hover(base);

    const colorProbe = document.createElement('span');
    root.shadowRoot.appendChild(colorProbe);
    colorProbe.style.backgroundColor = 'color-mix(in srgb, var(--bq-ui--primary), var(--bq-hover) 20%)';
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-text--brand), var(--bq-hover) 20%)';
    const expectedBackground = getComputedStyle(colorProbe).backgroundColor;
    const expectedText = getComputedStyle(colorProbe).color;

    await expect.poll(() => getComputedStyle(base).backgroundColor).toBe(expectedBackground);
    await expect.poll(() => getComputedStyle(base).color).toBe(expectedText);
    colorProbe.remove();
  });
});

import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

afterEach(() => {
  vi.restoreAllMocks();
});

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

describe('bq-breadcrumb-item', () => {
  it('should render', async () => {
    const { root } = await render(<bq-breadcrumb-item />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-breadcrumb-item />);

    expect(root).toHaveShadowRoot();
  });

  it('should display text', async () => {
    const { root } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);

    await waitForStable(root);

    expect(root.textContent?.trim()).toBe('Home');
  });

  it('should render `button` tag', async () => {
    const { root } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);

    const element = root.shadowRoot.querySelector('[part="item"]');

    expect(element?.tagName.toLowerCase()).toBe('button');
  });

  it('should render `a` tag', async () => {
    const { root } = await render(<bq-breadcrumb-item href="https://example.com/">Home</bq-breadcrumb-item>);

    const element = root.shadowRoot.querySelector('[part="item"]');

    expect(element?.tagName.toLowerCase()).toBe('a');
  });

  it('should hide the separator from assistive technology', async () => {
    const { root } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);

    const separator = root.shadowRoot.querySelector('[part="separator"]');

    expect(separator).toEqualAttribute('aria-hidden', 'true');
  });

  it('should apply `target` to anchor items', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="https://example.com/" target="_blank">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('[part="item"]');

    expect(element.target).toBe('_blank');
  });

  it('should use `noreferrer noopener` by default when `target` is set and `rel` is not provided', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="https://example.com/" target="_blank">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('[part="item"]');

    expect(element.rel).toBe('noreferrer noopener');
  });

  it('should not set `rel` when neither `rel` nor `target` is provided', async () => {
    const { root } = await render(<bq-breadcrumb-item href="https://example.com/">Home</bq-breadcrumb-item>);

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('[part="item"]');

    expect(element).not.toHaveAttribute('rel');
  });

  it('should apply a custom `rel` without `target`', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="https://example.com/" rel="nofollow">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('[part="item"]');

    expect(element.rel).toBe('nofollow');
  });

  it('should merge the safety tokens with a custom `rel` when `target` is set', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="https://example.com/" rel="external" target="_blank">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('[part="item"]');

    expect(element.target).toBe('_blank');
    expect(element.rel).toBe('external noreferrer noopener');
  });

  it('should not duplicate safety tokens already present in `rel`', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="https://example.com/" rel="  NoOpener   nofollow " target="_blank">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('[part="item"]');

    expect(Array.from(element.relList, (token) => token.toLowerCase()).sort()).toEqual([
      'nofollow',
      'noopener',
      'noreferrer',
    ]);
  });

  it('should update the anchor `rel` when the prop changes', async () => {
    const { root, setProps } = await render(
      <bq-breadcrumb-item href="https://example.com/" rel="external">
        Home
      </bq-breadcrumb-item>,
    );
    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('[part="item"]');

    await setProps({ rel: 'nofollow' });

    expect(element.rel).toBe('nofollow');
  });

  it('should not apply `rel` or `target` to the `button` rendered for non-link items', async () => {
    const { root } = await render(
      <bq-breadcrumb-item rel="external" target="_blank">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector('[part="item"]');

    expect(element?.tagName.toLowerCase()).toBe('button');
    expect(element).not.toHaveAttribute('rel');
    expect(element).not.toHaveAttribute('target');
  });

  it('should emit focus, click, and blur events', async () => {
    const { root, spyOnEvent } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);
    const element = root.shadowRoot?.querySelector<HTMLButtonElement>('[part="item"]');

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.click(element);
    await userEvent.tab();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should prevent native navigation without stopping click propagation when bqClick is canceled', async () => {
    const { root, spyOnEvent } = await render(<bq-breadcrumb-item href="#destination">Home</bq-breadcrumb-item>);
    const anchor = root.shadowRoot.querySelector<HTMLAnchorElement>('[part="item"]');
    const nativeClick = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true });
    const clickHandler = vi.fn();
    const bqClick = spyOnEvent('bqClick');

    root.addEventListener('bqClick', (event) => event.preventDefault(), { once: true });
    root.addEventListener('click', clickHandler);
    anchor.dispatchEvent(nativeClick);

    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(nativeClick.defaultPrevented).toBe(true);
    expect(clickHandler).toHaveBeenCalledOnce();
  });

  it('should keep `rel` on the anchor when bqClick is canceled', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="#destination" rel="nofollow" target="_blank">
        Home
      </bq-breadcrumb-item>,
    );
    const anchor = root.shadowRoot.querySelector<HTMLAnchorElement>('[part="item"]');
    const nativeClick = new MouseEvent('click', { bubbles: true, cancelable: true, composed: true });

    root.addEventListener('bqClick', (event) => event.preventDefault(), { once: true });
    anchor.dispatchEvent(nativeClick);

    expect(nativeClick.defaultPrevented).toBe(true);
    expect(anchor.rel).toBe('nofollow noreferrer noopener');
  });

  it('should use the text and separator color variables', async () => {
    const { root } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);

    await waitForStable(root);

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-breadcrumb-item--text-color').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--brand').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-breadcrumb-item--text-color-current').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--secondary').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-breadcrumb-item--separator-color').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--tertiary').trim(),
    );

    await waitForTransitions(root);

    const item = getComputedStyle(root.shadowRoot.querySelector('[part="item"]'));
    const separator = getComputedStyle(root.shadowRoot.querySelector('[part="separator"]'));

    expect(item.color).toBe(resolveColorToken('--bq-text--brand', root));
    expect(separator.color).toBe(resolveColorToken('--bq-ui--tertiary', root));
  });

  it('should apply native geometry, typography, and transition styles from public variables', async () => {
    const { root } = await render(
      <bq-breadcrumb-item
        style={{
          '--bq-breadcrumb-item--background': 'rgb(10, 20, 30)',
          '--bq-breadcrumb-item--border-color': 'rgb(40, 50, 60)',
          '--bq-breadcrumb-item--border-radius': '6px',
          '--bq-breadcrumb-item--border-style': 'solid',
          '--bq-breadcrumb-item--border-width': '2px',
          '--bq-breadcrumb-item--line-height': '24px',
          '--bq-breadcrumb-item--padding-end': '7px',
          '--bq-breadcrumb-item--padding-end-separator': '13px',
          '--bq-breadcrumb-item--padding-start': '3px',
          '--bq-breadcrumb-item--padding-start-separator': '11px',
          '--bq-breadcrumb-item--paddingY': '5px',
          '--bq-breadcrumb-item--separator-color': 'rgb(70, 80, 90)',
          '--bq-breadcrumb-item--text-size': '16px',
          '--bq-breadcrumb-item--text-size-separator': '12px',
        }}
      >
        Home
        <span slot="separator">/</span>
      </bq-breadcrumb-item>,
    );

    await waitForStable(root);

    const baseStyle = getComputedStyle(root.shadowRoot.querySelector('[part="base"]'));
    const itemStyle = getComputedStyle(root.shadowRoot.querySelector('[part="item"]'));
    const contentStyle = getComputedStyle(root.shadowRoot.querySelector('[part="content"]'));
    const separatorStyle = getComputedStyle(root.shadowRoot.querySelector('[part="separator"]'));

    expect(baseStyle.display).toBe('flex');
    expect(baseStyle.alignItems).toBe('center');
    expect(itemStyle).toMatchObject({
      backgroundColor: 'rgb(10, 20, 30)',
      borderBlockStartColor: 'rgb(40, 50, 60)',
      borderBlockStartStyle: 'solid',
      borderBlockStartWidth: '2px',
      borderStartStartRadius: '6px',
      boxSizing: 'border-box',
      fontSize: '16px',
      lineHeight: '24px',
      paddingBlockStart: '5px',
      paddingInlineEnd: '7px',
      paddingInlineStart: '3px',
      textDecorationLine: 'none',
      transitionDuration: '0.3s',
      transitionProperty: 'color',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });
    expect(contentStyle.display).toBe('flex');
    expect(contentStyle.alignItems).toBe('center');
    expect(separatorStyle).toMatchObject({
      color: 'rgb(70, 80, 90)',
      display: 'flex',
      fontSize: '12px',
      paddingInlineEnd: '13px',
      paddingInlineStart: '11px',
    });
  });

  it('should use the current text color when marked as the current page', async () => {
    const { root } = await render(
      <bq-breadcrumb-item aria-current="page" style={{ '--bq-breadcrumb-item--text-color-current': 'rgb(20, 40, 60)' }}>
        Current page
      </bq-breadcrumb-item>,
    );

    const item = root.shadowRoot.querySelector('[part="item"]');

    expect(getComputedStyle(item).color).toBe('rgb(20, 40, 60)');
  });

  it('should map logical padding to the RTL writing direction', async () => {
    const { root } = await render(
      <bq-breadcrumb-item
        dir="rtl"
        style={{
          '--bq-breadcrumb-item--padding-end': '7px',
          '--bq-breadcrumb-item--padding-start': '3px',
        }}
      >
        Home
      </bq-breadcrumb-item>,
    );

    const itemStyle = getComputedStyle(root.shadowRoot.querySelector('[part="item"]'));

    expect(itemStyle.paddingLeft).toBe('7px');
    expect(itemStyle.paddingRight).toBe('3px');
  });

  it('should derive the hover text color from the text color variable', async () => {
    const { root } = await render(
      <bq-breadcrumb-item style={{ '--bq-breadcrumb-item--text-color': 'rgb(1, 2, 3)' }}>Home</bq-breadcrumb-item>,
    );

    await waitForStable(root);

    const item = root.shadowRoot.querySelector<HTMLElement>('[part="item"]');
    await userEvent.hover(item);

    root.style.setProperty('--expected-hover-color', 'color-mix(in srgb, rgb(1, 2, 3), var(--bq-hover) 20%)');
    const expectedText = resolveColorToken('--expected-hover-color', root);
    await expect.poll(() => getComputedStyle(item).color).toBe(expectedText);
  });
});

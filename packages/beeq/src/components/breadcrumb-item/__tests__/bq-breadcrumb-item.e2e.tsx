import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

/** Resolves a CSS color value (e.g. `var(--bq-text--brand)`) to its computed `rgb()` form */
const resolveColor = (value: string): string => {
  const probe = document.createElement('div');
  probe.style.color = value;
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};

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

    const element = root.shadowRoot.querySelector('.breadcrumb-item');

    expect(element?.tagName.toLowerCase()).toBe('button');
  });

  it('should render `a` tag', async () => {
    const { root } = await render(<bq-breadcrumb-item href="https://example.com/">Home</bq-breadcrumb-item>);

    const element = root.shadowRoot.querySelector('.breadcrumb-item');

    expect(element?.tagName.toLowerCase()).toBe('a');
  });

  it('should hide the separator from assistive technology', async () => {
    const { root } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);

    const separator = root.shadowRoot.querySelector('[part="separator"]');

    expect(separator).toEqualAttribute('aria-hidden', 'true');
  });

  it('should apply `target` and `rel` to anchor items', async () => {
    const { root } = await render(
      <bq-breadcrumb-item href="https://example.com/" rel="external" target="_blank">
        Home
      </bq-breadcrumb-item>,
    );

    const element = root.shadowRoot?.querySelector<HTMLAnchorElement>('.breadcrumb-item');

    expect(element.target).toBe('_blank');
    expect(element.rel).toBe('noreferrer noopener');
  });

  it('should emit focus, click, and blur events', async () => {
    const { root, spyOnEvent } = await render(<bq-breadcrumb-item>Home</bq-breadcrumb-item>);
    const element = root.shadowRoot?.querySelector<HTMLButtonElement>('.breadcrumb-item');

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
    const anchor = root.shadowRoot.querySelector<HTMLAnchorElement>('.breadcrumb-item');
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
    const separator = getComputedStyle(root.shadowRoot.querySelector('.breadcrumb-separator'));

    expect(item.color).toBe(resolveColor('var(--bq-text--brand)'));
    expect(separator.color).toBe(resolveColor('var(--bq-ui--tertiary)'));
  });

  it('should derive the hover text color from the text color variable', async () => {
    const { root } = await render(
      <bq-breadcrumb-item style={{ '--bq-breadcrumb-item--text-color': 'rgb(1, 2, 3)' }}>Home</bq-breadcrumb-item>,
    );

    await waitForStable(root);

    const item = root.shadowRoot.querySelector<HTMLElement>('[part="item"]');
    await userEvent.hover(item);

    const expectedText = resolveColor('color-mix(in srgb, rgb(1, 2, 3), var(--bq-hover) 20%)');
    await expect.poll(() => getComputedStyle(item).color).toBe(expectedText);
  });
});

import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const getButtonElement = (button: HTMLBqButtonElement) =>
  button.shadowRoot?.querySelector<HTMLAnchorElement | HTMLButtonElement>('[part="button"]');

/** Resolves a CSS color value (e.g. `var(--bq-ui--brand)`) to its computed `rgb()` form */
const resolveColor = (value: string): string => {
  const probe = document.createElement('div');
  probe.style.color = value;
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};

/** Waits for any running CSS transition inside the element's shadow root to finish */
const waitForTransitions = async (element: Element) => {
  const animations = element.shadowRoot?.getAnimations() ?? [];
  await Promise.all(animations.map((animation) => animation.finished));
};

afterEach(() => {
  vi.restoreAllMocks();
});

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

describe('bq-button', () => {
  it('should render', async () => {
    const { root } = await render(<bq-button>Button</bq-button>);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-button>Button</bq-button>);
    expect(root).toHaveShadowRoot();
  });

  it('should render <a> tag', async () => {
    const { root } = await render(<bq-button href="https://www.example.com">Button</bq-button>);

    const element = getButtonElement(root as HTMLBqButtonElement);
    expect(element.tagName.toLowerCase()).toBe('a');
  });

  it('should render prefix element', async () => {
    const { root } = await render(
      <bq-button>
        <span slot="prefix">Prefix text</span> Button
      </bq-button>,
    );

    await waitForStable(root);

    const prefixSlot = (root as HTMLBqButtonElement).shadowRoot?.querySelector<HTMLSlotElement>('slot[name="prefix"]');

    expect(getTextContent(prefixSlot, { recurse: true })).toBe('Prefix text');
  });

  it('should render suffix element', async () => {
    const { root } = await render(
      <bq-button>
        <span slot="suffix">Suffix text</span> Button
      </bq-button>,
    );

    await waitForStable(root);

    const suffixSlot = (root as HTMLBqButtonElement).shadowRoot?.querySelector<HTMLSlotElement>('slot[name="suffix"]');

    expect(getTextContent(suffixSlot, { recurse: true })).toBe('Suffix text');
  });

  it('should render loading indicator', async () => {
    const { root } = await render(<bq-button loading>Button</bq-button>);

    await waitForStable(root);

    const spinnerIcon = root.shadowRoot?.querySelector('bq-icon[name="spinner-gap"]');

    expect(spinnerIcon).not.toBeNull();
  });

  it('should apply appearance class to inner button', async () => {
    const { root } = await render(<bq-button appearance="secondary">Button</bq-button>);

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn).toHaveClass('bq-button--secondary');
  });

  it('should apply variant class to inner button', async () => {
    const { root } = await render(<bq-button variant="danger">Button</bq-button>);

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn).toHaveClass('danger');
  });

  it('should apply `block` class when `block` prop is set', async () => {
    const { root } = await render(<bq-button block>Button</bq-button>);

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn).toHaveClass('block');
  });

  it('should apply `only-icon` class when `only-icon` prop is set', async () => {
    const { root } = await render(
      <bq-button onlyIcon label="Close">
        <bq-icon name="x" />
      </bq-button>,
    );

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn).toHaveClass('only-icon');
  });

  it('should apply justifyContent class to inner button', async () => {
    const { root } = await render(<bq-button justify-content="left">Button</bq-button>);

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn).toHaveClass('content-left');
  });

  it('should set `rel` when `target` is set on a link button', async () => {
    const { root } = await render(
      <bq-button href="https://www.example.com" target="_blank">
        Button
      </bq-button>,
    );

    const anchor = getButtonElement(root as HTMLBqButtonElement) as HTMLAnchorElement;

    expect(anchor.rel).toContain('noreferrer');
    expect(anchor.rel).toContain('noopener');
  });

  it('should handle invalid properties', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(
      <bq-button size="small" appearance="secondary" type="submit" variant="ghost">
        Button
      </bq-button>,
    );

    const btn = root as HTMLBqButtonElement;
    await setProps({ type: 'invalid', size: 'invalid', variant: 'invalid', appearance: 'invalid' });

    expect({
      type: btn.type,
      size: btn.size,
      variant: btn.variant,
      appearance: btn.appearance,
    }).toEqual({
      type: 'button',
      size: 'medium',
      variant: 'standard',
      appearance: 'primary',
    });
    expect(warnSpy).toHaveBeenCalledTimes(4);
    expect(warnSpy).toHaveBeenCalledWith('[BQ-BUTTON] Please notice that "type" should be one of button|submit|reset');
    expect(warnSpy).toHaveBeenCalledWith('[BQ-BUTTON] Please notice that "size" should be one of small|medium|large');
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-BUTTON] Please notice that "variant" should be one of standard|ghost|danger',
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-BUTTON] Please notice that "appearance" should be one of primary|secondary|link|text',
    );
  });

  it('should warn when `only-icon` is set without a `label`', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    await render(
      <bq-button onlyIcon>
        <bq-icon name="x" />
      </bq-button>,
    );

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('it is required to set the `label` prop for accessibility reasons'),
    );
  });

  it('should trigger bqClick', async () => {
    const { root, spyOnEvent } = await render(<bq-button>Button</bq-button>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.click(getButtonElement(root as HTMLBqButtonElement));

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should be keyboard accessible', async () => {
    const { spyOnEvent } = await render(
      <div>
        <bq-button>Button</bq-button>
        <bq-button>Button</bq-button>
      </div>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.tab();
    await userEvent.tab();

    const buttons = document.querySelectorAll('bq-button') as NodeListOf<HTMLBqButtonElement>;
    const secondButton = buttons[1];
    const secondButtonInner = getButtonElement(secondButton);

    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(
      document.activeElement === secondButton || secondButton.shadowRoot?.activeElement === secondButtonInner,
    ).toBe(true);
  });

  it('should not emit any event when disabled', async () => {
    const { root, spyOnEvent } = await render(<bq-button disabled>Button</bq-button>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');
    const innerButton = getButtonElement(root as HTMLBqButtonElement);

    await userEvent.tab();
    // Dispatch natively — Playwright blocks clicks on disabled elements
    innerButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(innerButton).toBeDisabled();
    expect(innerButton).toEqualAttribute('aria-disabled', 'true');

    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should not emit bqClick when `loading` is true', async () => {
    const { root, spyOnEvent } = await render(<bq-button loading>Button</bq-button>);
    const bqClick = spyOnEvent('bqClick');

    // Dispatch natively — Playwright's actionability would block userEvent on a visually-busy button
    getButtonElement(root as HTMLBqButtonElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(bqClick).toHaveReceivedEventTimes(0);
  });

  it('should not emit bqClick when bqClick is defaultPrevented', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-button>Button</bq-button>);
    const bqClick = spyOnEvent('bqClick');
    root.addEventListener('bqClick', (e: Event) => e.preventDefault(), { once: true });

    await userEvent.click(getButtonElement(root as HTMLBqButtonElement));
    await waitForChanges();

    // Event fired once but was prevented — the native click should have been stopped
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqClick.events[0].defaultPrevented).toBe(true);
  });

  it('should behave as submit button', async () => {
    const onSubmit = vi.fn((event: Event) => event.preventDefault());
    const { root } = await render(
      <form id="formId">
        <input type="text" name="test" value="test-value" />
        <bq-button type="submit">Button</bq-button>
      </form>,
    );

    const form = root as HTMLFormElement;
    const button = form.querySelector('bq-button') as HTMLBqButtonElement;

    form.addEventListener('submit', onSubmit as EventListener);
    await waitForStable(button);
    await userEvent.click(getButtonElement(button));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should behave as reset button', async () => {
    const { root } = await render(
      <form id="formId">
        <input type="text" name="test" defaultValue="test" />
        <bq-button type="reset">Button</bq-button>
      </form>,
    );

    const form = root as HTMLFormElement;
    const input = form.querySelector('input') as HTMLInputElement;
    const button = form.querySelector('bq-button') as HTMLBqButtonElement;

    await userEvent.clear(input);
    await userEvent.type(input, 'value test');

    expect(input.value).toBe('value test');

    await waitForStable(button);
    await userEvent.click(getButtonElement(button));

    expect(input.value).toBe('test');
  });

  it('should respect design style', async () => {
    const { root } = await render(
      <div>
        <bq-button size="small">Button</bq-button>
        <bq-button size="medium">Button</bq-button>
        <bq-button size="large">Button</bq-button>
      </div>,
    );

    await waitForStable(root);

    const styleProps = ['height', 'padding'] as const;

    const smallStyle = computedStyle('bq-button[size="small"] >>> [part="button"]', styleProps);
    const mediumStyle = computedStyle('bq-button[size="medium"] >>> [part="button"]', styleProps);
    const largeStyle = computedStyle('bq-button[size="large"] >>> [part="button"]', styleProps);

    expect(smallStyle).toEqual({ height: '32px', padding: '2px 8px' });
    expect(mediumStyle).toEqual({ height: '48px', padding: '10px 16px' });
    expect(largeStyle).toEqual({ height: '56px', padding: '14px 24px' });
  });

  it('ghost buttons should be the same height as their non-ghost counterparts', async () => {
    const { root } = await render(
      <div>
        <bq-button size="small">Button</bq-button>
        <bq-button size="small" appearance="primary" variant="ghost">
          Button
        </bq-button>
        <bq-button size="medium">Button</bq-button>
        <bq-button size="medium" appearance="primary" variant="ghost">
          Button
        </bq-button>
        <bq-button size="large">Button</bq-button>
        <bq-button size="large" appearance="primary" variant="ghost">
          Button
        </bq-button>
      </div>,
    );

    await waitForStable(root);

    const styleProps = ['height'] as const;

    const smallDefault = computedStyle('bq-button[size="small"][variant="standard"] >>> [part="button"]', styleProps);
    const smallGhost = computedStyle('bq-button[size="small"][variant="ghost"] >>> [part="button"]', styleProps);
    const mediumDefault = computedStyle('bq-button[size="medium"][variant="standard"] >>> [part="button"]', styleProps);
    const mediumGhost = computedStyle('bq-button[size="medium"][variant="ghost"] >>> [part="button"]', styleProps);
    const largeDefault = computedStyle('bq-button[size="large"][variant="standard"] >>> [part="button"]', styleProps);
    const largeGhost = computedStyle('bq-button[size="large"][variant="ghost"] >>> [part="button"]', styleProps);

    expect(smallGhost.height).toBe(smallDefault.height);
    expect(mediumGhost.height).toBe(mediumDefault.height);
    expect(largeGhost.height).toBe(largeDefault.height);
  });

  it('should map the color variables to the theme role tokens', async () => {
    const { root } = await render(<bq-button>Button</bq-button>);

    const hostStyle = getComputedStyle(root);
    const expectedRoles = {
      '--bq-button--primary-background': '--bq-ui--brand',
      '--bq-button--primary-text-color': '--bq-text--on-brand',
      '--bq-button--primary-border-color-ghost': '--bq-stroke--brand',
      '--bq-button--primary-text-color-ghost': '--bq-text--brand',
      '--bq-button--primary-background-danger': '--bq-ui--danger',
      '--bq-button--primary-text-color-danger': '--bq-text--on-danger',
      '--bq-button--secondary-background': '--bq-ui--secondary',
      '--bq-button--secondary-text-color': '--bq-text--primary',
      '--bq-button--secondary-border-color-ghost': '--bq-stroke--tertiary',
      '--bq-button--secondary-text-color-ghost': '--bq-text--primary',
      '--bq-button--link-text-color': '--bq-text--brand',
      '--bq-button--text-text-color': '--bq-text--primary',
    };

    for (const [componentVar, roleVar] of Object.entries(expectedRoles)) {
      expect(hostStyle.getPropertyValue(componentVar).trim()).toBe(hostStyle.getPropertyValue(roleVar).trim());
    }
  });

  it('should paint each appearance and variant with its color variables', async () => {
    const { root } = await render(
      <div>
        <bq-button id="primary">Button</bq-button>
        <bq-button id="primary-ghost" variant="ghost">
          Button
        </bq-button>
        <bq-button id="primary-danger" variant="danger">
          Button
        </bq-button>
        <bq-button id="secondary" appearance="secondary">
          Button
        </bq-button>
        <bq-button id="secondary-ghost" appearance="secondary" variant="ghost">
          Button
        </bq-button>
        <bq-button id="link" appearance="link">
          Button
        </bq-button>
        <bq-button id="text" appearance="text">
          Button
        </bq-button>
      </div>,
    );

    await waitForStable(root);
    const buttons = Array.from(root.querySelectorAll<HTMLBqButtonElement>('bq-button'));
    await Promise.all(buttons.map((button) => waitForTransitions(button)));

    const styleProps = ['backgroundColor', 'color', 'borderTopColor'] as const;

    expect(computedStyle('#primary >>> [part="button"]', ['backgroundColor', 'color'])).toEqual({
      backgroundColor: resolveColor('var(--bq-ui--brand)'),
      color: resolveColor('var(--bq-text--on-brand)'),
    });
    expect(computedStyle('#primary-ghost >>> [part="button"]', ['color', 'borderTopColor'])).toEqual({
      color: resolveColor('var(--bq-text--brand)'),
      borderTopColor: resolveColor('var(--bq-stroke--brand)'),
    });
    expect(computedStyle('#primary-danger >>> [part="button"]', ['backgroundColor', 'color'])).toEqual({
      backgroundColor: resolveColor('var(--bq-ui--danger)'),
      color: resolveColor('var(--bq-text--on-danger)'),
    });
    expect(computedStyle('#secondary >>> [part="button"]', ['backgroundColor', 'color'])).toEqual({
      backgroundColor: resolveColor('var(--bq-ui--secondary)'),
      color: resolveColor('var(--bq-text--primary)'),
    });
    expect(computedStyle('#secondary-ghost >>> [part="button"]', styleProps)).toEqual({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      color: resolveColor('var(--bq-text--primary)'),
      borderTopColor: resolveColor('var(--bq-stroke--tertiary)'),
    });
    expect(computedStyle('#link >>> [part="button"]', ['color']).color).toBe(resolveColor('var(--bq-text--brand)'));
    expect(computedStyle('#text >>> [part="button"]', ['color']).color).toBe(resolveColor('var(--bq-text--primary)'));
  });

  it('should allow overriding the color variables', async () => {
    const { root } = await render(
      <bq-button
        style={{ '--bq-button--primary-background': 'rgb(1, 2, 3)', '--bq-button--primary-text-color': 'rgb(4, 5, 6)' }}
      >
        Button
      </bq-button>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-button >>> [part="button"]', ['backgroundColor', 'color'])).toEqual({
      backgroundColor: 'rgb(1, 2, 3)',
      color: 'rgb(4, 5, 6)',
    });
  });
});

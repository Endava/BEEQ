import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const getButtonElement = (button: HTMLBqButtonElement) =>
  button.shadowRoot?.querySelector<HTMLAnchorElement | HTMLButtonElement>('[part="button"]');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-button', () => {
  it('should render', async () => {
    const { root } = await render(<bq-button>Button</bq-button>);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-button>Button</bq-button>);
    expect(root.shadowRoot).not.toBeNull();
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

    expect(innerBtn.classList.contains('bq-button--secondary')).toBe(true);
  });

  it('should apply variant class to inner button', async () => {
    const { root } = await render(<bq-button variant="danger">Button</bq-button>);

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn.classList.contains('danger')).toBe(true);
  });

  it('should apply `block` class when `block` prop is set', async () => {
    const { root } = await render(<bq-button block>Button</bq-button>);

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn.classList.contains('block')).toBe(true);
  });

  it('should apply `only-icon` class when `only-icon` prop is set', async () => {
    const { root } = await render(
      <bq-button onlyIcon label="Close">
        <bq-icon name="x" />
      </bq-button>,
    );

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn.classList.contains('only-icon')).toBe(true);
  });

  it('should apply justifyContent class to inner button', async () => {
    const { root } = await render(<bq-button justify-content="left">Button</bq-button>);

    const innerBtn = getButtonElement(root as HTMLBqButtonElement);

    expect(innerBtn.classList.contains('content-left')).toBe(true);
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
    const { root, waitForChanges } = await render(
      <bq-button size="small" appearance="secondary" type="submit" variant="ghost">
        Button
      </bq-button>,
    );

    const btn = root as HTMLBqButtonElement;
    btn.type = 'invalid' as HTMLBqButtonElement['type'];
    btn.size = 'invalid' as HTMLBqButtonElement['size'];
    btn.variant = 'invalid' as HTMLBqButtonElement['variant'];
    btn.appearance = 'invalid' as HTMLBqButtonElement['appearance'];

    await waitForChanges();

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
    expect(innerButton.getAttribute('aria-disabled')).toBe('true');

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

    expect(smallStyle).toEqual({ height: '32px', padding: '4px 8px' });
    expect(mediumStyle).toEqual({ height: '48px', padding: '12px 16px' });
    expect(largeStyle).toEqual({ height: '56px', padding: '16px 24px' });
  });
});

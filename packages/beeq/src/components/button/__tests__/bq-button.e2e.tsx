import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

const getButtonElement = (button: HTMLBqButtonElement) =>
  button.shadowRoot?.querySelector('[part="button"]') as HTMLAnchorElement | HTMLButtonElement;

const getSlotContent = (button: HTMLBqButtonElement, slotName: 'prefix' | 'suffix') => {
  const slot = button.shadowRoot?.querySelector(`slot[name="${slotName}"]`) as HTMLSlotElement;

  return slot.assignedElements({ flatten: true })[0];
};

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

    const element = getButtonElement(root);

    expect(element.tagName.toLowerCase()).toBe('a');
  });

  it('should trigger bqClick', async () => {
    const { root, spyOnEvent } = await render(<bq-button>Button</bq-button>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.click(getButtonElement(root));

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

  it('should handle `disabled` property', async () => {
    const { root, spyOnEvent } = await render(<bq-button disabled>Button</bq-button>);

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');
    const innerButton = getButtonElement(root);

    await userEvent.tab();

    expect(innerButton).toBeDisabled();
    expect(innerButton.getAttribute('aria-disabled')).toBe('true');
    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should render prefix element', async () => {
    const { root } = await render(
      <bq-button>
        <span slot="prefix">Prefix text</span>
        Button
      </bq-button>,
    );

    await waitForStable(root);

    const prefixElement = getSlotContent(root, 'prefix');

    expect(prefixElement.textContent?.trim()).toBe('Prefix text');
  });

  it('should render suffix element', async () => {
    const { root } = await render(
      <bq-button>
        <span slot="suffix">Suffix text</span>
        Button
      </bq-button>,
    );

    await waitForStable(root);

    const suffixElement = getSlotContent(root, 'suffix');

    expect(suffixElement.textContent?.trim()).toBe('Suffix text');
  });

  it('should render loading indicator', async () => {
    const { root } = await render(<bq-button loading>Button</bq-button>);

    await waitForStable(root);

    const spinnerIcon = root.shadowRoot?.querySelector('bq-icon[name="spinner-gap"]');

    expect(spinnerIcon).not.toBeNull();
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

  it('should handle invalid properties', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(
      <bq-button size="small" appearance="secondary" type="submit" variant="ghost">
        Button
      </bq-button>,
    );

    root.type = 'invalid' as HTMLBqButtonElement['type'];
    root.size = 'invalid' as HTMLBqButtonElement['size'];
    root.variant = 'invalid' as HTMLBqButtonElement['variant'];
    root.appearance = 'invalid' as HTMLBqButtonElement['appearance'];

    await waitForChanges();

    expect({
      type: root.type,
      size: root.size,
      variant: root.variant,
      appearance: root.appearance,
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
});

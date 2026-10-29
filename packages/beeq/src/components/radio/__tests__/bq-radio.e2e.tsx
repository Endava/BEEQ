import { h } from '@stencil/core';
import { beforeEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

const getInput = (element: HTMLBqRadioElement) => element.shadowRoot?.querySelector<HTMLInputElement>('input');
const getBase = (element: HTMLBqRadioElement) => element.shadowRoot?.querySelector<HTMLElement>('[part="base"]');
const getCircle = (element: HTMLBqRadioElement) => element.shadowRoot?.querySelector<HTMLElement>('[part="radio"]');
const getChecked = (element: HTMLBqRadioElement) =>
  element.shadowRoot?.querySelector<HTMLElement>('.bq-radio__checked');

/** Waits for any running CSS transition inside the element's shadow root to finish */
const waitForTransitions = async (element: Element) => {
  const animations = element.shadowRoot?.getAnimations() ?? [];
  await Promise.all(animations.map((animation) => animation.finished));
};

const movePointerOff = () =>
  cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: window.top.innerWidth - 1,
    y: window.top.innerHeight - 1,
  });

beforeEach(async () => {
  await movePointerOff();
});

describe('bq-radio', () => {
  it('should render', async () => {
    const { root } = await render(<bq-radio name="test-option" value="test-value" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-radio name="test-option" value="test-value" />);

    expect(root).toHaveShadowRoot();
  });

  it('should display the slotted label', async () => {
    const { root } = await render(
      <bq-radio name="test-option" value="test-value">
        <span>Label</span>
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    await waitForStable(bqRadio);

    const labelSlot = bqRadio.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])');
    expect(getTextContent(labelSlot, { recurse: true })).toBe('Label');
  });

  it('should handle checked state correctly', async () => {
    const { root, setProps } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    const input = getInput(bqRadio);

    expect(bqRadio).not.toHaveAttribute('checked');
    expect(input.checked).toBe(false);

    await setProps({ checked: true });

    expect(bqRadio).toHaveAttribute('checked');
    expect(input.checked).toBe(true);

    await setProps({ checked: false });

    expect(bqRadio).not.toHaveAttribute('checked');
    expect(input.checked).toBe(false);
  });

  it('should emit bqClick when clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqClick = spyOnEvent('bqClick');
    const bqRadio = root as HTMLBqRadioElement;

    await bqRadio.vClick();
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should apply hover background styles when enabled', async () => {
    const { root } = await render(
      <bq-radio backgroundOnHover name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );

    expect(root.shadowRoot?.querySelector('[part="base"]')).toHaveClass('has-background');
  });

  it('should not emit bqClick when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio disabled name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqClick = spyOnEvent('bqClick');
    const input = getInput(bqRadio);

    expect(input).toBeDisabled();

    input.click();
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(0);
  });

  it('should disable the input when forceDisabled is set', async () => {
    const { root } = await render(
      <bq-radio forceDisabled name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    expect(getInput(bqRadio)).toBeDisabled();
    expect(getInput(bqRadio)).toEqualAttribute('aria-disabled', 'true');
  });

  it('should emit bqFocus and bqBlur through the native input', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getInput(bqRadio);

    input.focus();
    input.blur();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should propagate native input properties', async () => {
    const { root } = await render(
      <bq-radio formId="my-form" name="test-option" required value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    const input = getInput(bqRadio);

    expect(input).toEqualAttributes({
      form: 'my-form',
      name: 'test-option',
    });
    expect(input.required).toBe(true);
    expect(input.value).toBe('test-value');
  });

  it('should expose the native input through getNativeInput', async () => {
    const { root } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;

    expect(await bqRadio.getNativeInput()).toBe(getInput(bqRadio));
  });

  it('should not emit bqFocus when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio disabled name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqFocus = spyOnEvent('bqFocus');

    getInput(bqRadio).focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
  });

  it('should emit bqKeyDown without triggering click or blur', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');
    const bqKeyDown = spyOnEvent('bqKeyDown');

    getInput(bqRadio).focus();
    await userEvent.keyboard('0');
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqKeyDown).toHaveReceivedEventTimes(1);
  });

  it('should remove focus from the native input via vBlur', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-radio name="test-option" value="test-value">
        Test Label
      </bq-radio>,
    );
    const bqRadio = root as HTMLBqRadioElement;
    const bqBlur = spyOnEvent('bqBlur');

    await bqRadio.vFocus();
    await bqRadio.vBlur();
    await waitForChanges();

    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should respect the expected design styles', async () => {
    const { root } = await render(
      <bq-radio name="option" value="1">
        Option 1
      </bq-radio>,
    );

    await waitForStable(root);

    const style = computedStyle('bq-radio >>> [part="base"]', [
      'height',
      'gap',
      'borderRadius',
      'transitionDuration',
      'transitionTimingFunction',
    ]);
    const circleStyle = computedStyle('bq-radio >>> [part="radio"]', [
      'transitionDuration',
      'transitionTimingFunction',
    ]);

    expect(style).toEqual({
      height: '40px',
      gap: '8px',
      borderRadius: '8px',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });
    expect(circleStyle).toEqual({
      transitionDuration: '0.3s',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });
  });

  it('should map the color variables to the theme role tokens', async () => {
    const { root } = await render(<bq-radio name="option" value="1" />);

    const hostStyle = getComputedStyle(root);
    const expectedRoles = {
      '--bq-radio--background-color': '--bq-ui--primary',
      '--bq-radio--border-color': '--bq-stroke--tertiary',
      '--bq-radio--border-color-checked': '--bq-icon--brand',
      '--bq-radio--dot-color-checked': '--bq-icon--brand',
      '--bq-radio--label-text-color': '--bq-text--primary',
    };

    for (const [componentVar, roleVar] of Object.entries(expectedRoles)) {
      expect(hostStyle.getPropertyValue(componentVar).trim()).toBe(hostStyle.getPropertyValue(roleVar).trim());
    }
  });

  it('should paint the unchecked state with the color variables', async () => {
    const { root } = await render(
      <bq-radio name="option" value="1">
        Option 1
      </bq-radio>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-radio >>> [part="radio"]', ['backgroundColor', 'borderTopColor'])).toEqual({
      backgroundColor: resolveColorToken('--bq-ui--primary', root),
      borderTopColor: resolveColorToken('--bq-stroke--tertiary', root),
    });
    expect(computedStyle('bq-radio >>> [part="label"]', ['color']).color).toBe(
      resolveColorToken('--bq-text--primary', root),
    );
  });

  it('should paint the hover state with mixed component colors', async () => {
    const { root } = await render(
      <bq-radio backgroundOnHover name="option" value="1">
        Option 1
      </bq-radio>,
    );
    const radio = root as HTMLBqRadioElement;

    await userEvent.hover(getBase(radio));
    await waitForTransitions(root);

    const colorProbe = document.createElement('span');
    root.appendChild(colorProbe);

    colorProbe.style.color = 'color-mix(in srgb, var(--bq-ui--primary), var(--bq-hover) var(--bq-state-mix-hover))';
    expect(computedStyle('bq-radio >>> [part="base"]', ['backgroundColor']).backgroundColor).toBe(
      getComputedStyle(colorProbe).color,
    );

    colorProbe.style.color = 'color-mix(in srgb, var(--bq-icon--brand), var(--bq-hover) var(--bq-state-mix-hover))';
    expect(computedStyle('bq-radio >>> [part="radio"]', ['borderTopColor']).borderTopColor).toBe(
      getComputedStyle(colorProbe).color,
    );

    colorProbe.style.color = 'color-mix(in srgb, var(--bq-text--primary), var(--bq-hover) var(--bq-state-mix-hover))';
    expect(computedStyle('bq-radio >>> [part="label"]', ['color']).color).toBe(getComputedStyle(colorProbe).color);

    colorProbe.remove();
  });

  it('should paint the checked state with the color variables', async () => {
    const { root } = await render(
      <bq-radio checked name="option" value="1">
        Option 1
      </bq-radio>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-radio >>> [part="radio"]', ['borderTopColor']).borderTopColor).toBe(
      resolveColorToken('--bq-icon--brand', root),
    );
    expect(computedStyle('bq-radio >>> .bq-radio__checked', ['backgroundColor']).backgroundColor).toBe(
      resolveColorToken('--bq-icon--brand', root),
    );
  });

  it('should preserve separate checked border and dot overrides on hover', async () => {
    const { root } = await render(
      <bq-radio
        checked
        name="option"
        style={{ '--bq-radio--border-color-checked': 'rgb(1, 2, 3)', '--bq-radio--dot-color-checked': 'rgb(4, 5, 6)' }}
        value="1"
      >
        Option 1
      </bq-radio>,
    );
    const radio = root as HTMLBqRadioElement;

    await userEvent.hover(getBase(radio));
    await waitForTransitions(root);

    const colorProbe = document.createElement('span');
    root.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, rgb(1, 2, 3), var(--bq-hover) var(--bq-state-mix-hover))';
    const expectedHoverBorder = getComputedStyle(colorProbe).color;

    expect(getComputedStyle(getCircle(radio)).borderTopColor).toBe(expectedHoverBorder);
    expect(getComputedStyle(getChecked(radio)).borderTopColor).toBe(expectedHoverBorder);
    expect(getComputedStyle(getChecked(radio)).backgroundColor).toBe('rgb(4, 5, 6)');

    colorProbe.remove();
  });

  it('should expose the focus ring and disabled visual state', async () => {
    const { root, setProps } = await render(
      <bq-radio name="option" value="1">
        Option 1
      </bq-radio>,
    );
    const radio = root as HTMLBqRadioElement;

    await userEvent.tab();

    expect(computedStyle('bq-radio >>> [part="radio"]', ['outlineOffset', 'outlineStyle', 'outlineWidth'])).toEqual({
      outlineOffset: '1px',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    });

    await setProps({ disabled: true });
    await waitForStable(root);

    expect(getComputedStyle(getBase(radio)).cursor).toBe('not-allowed');
    expect(getComputedStyle(getBase(radio)).opacity).toBe('0.6');
    expect(getInput(radio)).toBeDisabled();
  });

  it('should allow overriding the checked color variables', async () => {
    const { root } = await render(
      <bq-radio
        checked
        name="option"
        style={{ '--bq-radio--border-color-checked': 'rgb(1, 2, 3)', '--bq-radio--dot-color-checked': 'rgb(4, 5, 6)' }}
        value="1"
      >
        Option 1
      </bq-radio>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-radio >>> [part="radio"]', ['borderTopColor']).borderTopColor).toBe('rgb(1, 2, 3)');
    expect(computedStyle('bq-radio >>> .bq-radio__checked', ['backgroundColor']).backgroundColor).toBe('rgb(4, 5, 6)');
  });
});

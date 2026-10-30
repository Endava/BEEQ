import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

const getSwitchInput = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector<HTMLInputElement>('input.bq-switch--input');

const getSwitchBase = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector<HTMLLabelElement>('[part="base"]');

const getSwitchDot = (switchElement: HTMLBqSwitchElement) =>
  switchElement.shadowRoot?.querySelector<HTMLElement>('[part="dot"]');

/** Waits for any running CSS transition inside the element's shadow root to finish */
const waitForTransitions = async (element: Element) => {
  const animations = element.shadowRoot?.getAnimations() ?? [];
  await Promise.all(animations.map((animation) => animation.finished));
};

afterEach(() => {
  vi.restoreAllMocks();
});

const movePointerOff = () =>
  cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: window.top.innerWidth - 1,
    y: window.top.innerHeight - 1,
  });

beforeEach(async () => {
  await movePointerOff();
});

describe('bq-switch', () => {
  it('should render', async () => {
    const { root } = await render(<bq-switch name="bq-switch" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-switch name="bq-switch" />);

    expect(root).toHaveShadowRoot();
  });

  it('should load checked', async () => {
    const { root } = await render(<bq-switch name="bq-switch" checked />);
    const sw = root as HTMLBqSwitchElement;

    expect(getSwitchInput(sw).getAttribute('aria-checked')).toBe('true');
  });

  it('should display label text', async () => {
    const { root } = await render(<bq-switch name="bq-switch">Toggle me!</bq-switch>);
    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('[part="label"] slot');
    expect(getTextContent(slotElement, { recurse: true })).toBe('Toggle me!');
  });

  it('should toggle on click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-switch name="bq-switch" />);
    const sw = root as HTMLBqSwitchElement;

    const bqChange = spyOnEvent('bqChange');

    expect(sw.checked).toBe(false);

    await userEvent.click(getSwitchBase(sw));
    await waitForChanges();

    expect(sw.checked).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should do nothing if disabled', async () => {
    const { root } = await render(
      <div>
        <bq-switch name="bq-switch-disabled" disabled>
          Disabled
        </bq-switch>
        <bq-switch name="bq-switch-enabled">Enabled</bq-switch>
      </div>,
    );

    const switches = root.querySelectorAll('bq-switch') as NodeListOf<HTMLBqSwitchElement>;
    const disabledSwitch = switches[0];
    const enabledSwitch = switches[1];

    const bqChange = vi.fn();
    const bqFocus = vi.fn();
    const bqBlur = vi.fn();
    disabledSwitch.addEventListener('bqChange', bqChange);
    disabledSwitch.addEventListener('bqFocus', bqFocus);
    disabledSwitch.addEventListener('bqBlur', bqBlur);
    enabledSwitch.addEventListener('bqFocus', bqFocus);

    const input = getSwitchInput(disabledSwitch);

    expect(input).toBeDisabled();
    expect(input.getAttribute('aria-disabled')).toBe('true');

    getSwitchBase(disabledSwitch).click();
    await userEvent.tab();

    expect(disabledSwitch.checked).toBe(false);
    expect(bqChange).toHaveBeenCalledTimes(0);
    expect(bqFocus).toHaveBeenCalledTimes(1);
    expect(bqBlur).toHaveBeenCalledTimes(0);
    expect(
      document.activeElement === enabledSwitch ||
        enabledSwitch.shadowRoot?.activeElement === getSwitchInput(enabledSwitch),
    ).toBe(true);
  });

  it('should render inner icon labels', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" innerLabel="icon">
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    await waitForStable(root);

    const iconElements = sw.shadowRoot?.querySelectorAll('bq-icon.bq-switch--control__icon');

    expect(iconElements).toHaveLength(2);
  });

  it('should change the content order', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" reverseOrder>
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    expect(getSwitchBase(sw)).toHaveClass('is-reversed');
  });

  it('should expose `vClick`, `vFocus`, and `vBlur` methods', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-switch name="bq-switch">Toggle me!</bq-switch>);
    const sw = root as HTMLBqSwitchElement;

    const bqChange = spyOnEvent('bqChange');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');

    await sw.vFocus();
    await waitForChanges();
    await sw.vClick();
    await waitForChanges();
    await sw.vBlur();
    await waitForChanges();

    expect(sw.checked).toBe(true);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should apply hover background and full width classes', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" backgroundOnHover fullWidth>
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    expect(sw).toHaveClass('full-width');
    expect(getSwitchBase(sw)).toHaveClass('has-background');
  });

  it('should apply justifyContent as an inline CSS variable', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" justifyContent="space-between">
        Toggle me!
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    expect(sw.style.getPropertyValue('--bq-switch--justify-content')).toBe('space-between');
  });

  it('should participate in forms, reset, and required validation', async () => {
    const { waitForChanges } = await render(
      <form>
        <bq-switch formValidationMessage="Please enable this switch" name="terms" required>
          Toggle me!
        </bq-switch>
      </form>,
    );

    const form = document.querySelector('form') as HTMLFormElement;
    const switchElement = form.querySelector('bq-switch') as HTMLBqSwitchElement;

    await waitForStable(switchElement);

    expect(form.checkValidity()).toBe(false);

    await userEvent.click(getSwitchBase(switchElement));
    await waitForChanges();

    const formData = new FormData(form);

    expect(switchElement.checked).toBe(true);
    expect(form.checkValidity()).toBe(true);
    expect(formData.get('terms')).toBe('on');

    form.reset();
    await waitForChanges();

    expect(switchElement.checked).toBe(false);
    expect(form.checkValidity()).toBe(false);
  });

  it('should preserve the native structure, spacing, and transition timing', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" innerLabel="icon">
        Label
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    await waitForStable(root);

    expect(
      computedStyle('bq-switch >>> [part="base"]', [
        'borderRadius',
        'columnGap',
        'height',
        'transitionDuration',
        'transitionTimingFunction',
      ]),
    ).toEqual({
      borderRadius: '8px',
      columnGap: '12px',
      height: '40px',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });
    expect(
      computedStyle('bq-switch >>> [part="control"]', [
        'height',
        'paddingBlockStart',
        'paddingInlineStart',
        'transitionDuration',
        'transitionTimingFunction',
        'width',
      ]),
    ).toEqual({
      height: '24px',
      paddingBlockStart: '4px',
      paddingInlineStart: '4px',
      transitionDuration: '0.3s',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      width: '44px',
    });
    expect(computedStyle('bq-switch >>> [part="dot"]', ['height', 'insetInlineStart', 'width'])).toEqual({
      height: '16px',
      insetInlineStart: '4px',
      width: '16px',
    });
    expect(computedStyle('bq-switch >>> [part="label"]', ['fontSize', 'fontWeight', 'lineHeight'])).toEqual({
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '24px',
    });
    expect(getComputedStyle(getSwitchInput(sw)).clipPath).toBe('inset(50%)');
  });

  it('should paint the hover background with the mixed UI color', async () => {
    const { root } = await render(
      <bq-switch backgroundOnHover name="bq-switch">
        Label
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    await userEvent.hover(getSwitchBase(sw));
    await waitForTransitions(root);

    const colorProbe = document.createElement('span');
    root.shadowRoot.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-ui--primary), var(--bq-hover) var(--bq-state-mix-hover))';

    expect(computedStyle('bq-switch >>> [part="base"]', ['backgroundColor']).backgroundColor).toBe(
      getComputedStyle(colorProbe).color,
    );

    colorProbe.remove();
  });

  it('should expose the focus ring and disabled visual state', async () => {
    const { root, setProps } = await render(<bq-switch name="bq-switch">Label</bq-switch>);
    const sw = root as HTMLBqSwitchElement;

    await sw.vFocus();
    await waitForTransitions(root);

    expect(
      computedStyle('bq-switch >>> [part="control"]', [
        'outlineColor',
        'outlineOffset',
        'outlineStyle',
        'outlineWidth',
      ]),
    ).toEqual({
      outlineColor: resolveColorToken('--bq-focus'),
      outlineOffset: '1px',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    });

    await setProps({ disabled: true });

    expect(computedStyle('bq-switch >>> [part="base"]', ['cursor', 'opacity'])).toEqual({
      cursor: 'not-allowed',
      opacity: '0.6',
    });
  });

  it('should move the dot and reverse the content order through semantic states', async () => {
    const { root } = await render(
      <bq-switch checked name="bq-switch" reverseOrder>
        Label
      </bq-switch>,
    );
    const sw = root as HTMLBqSwitchElement;

    await waitForStable(root);
    await waitForTransitions(root);

    expect(getSwitchBase(sw)).toHaveClass('is-checked', 'is-reversed', 'has-label');
    expect(computedStyle('bq-switch >>> [part="base"]', ['flexDirection']).flexDirection).toBe('row-reverse');
    expect(getComputedStyle(getSwitchDot(sw)).insetInlineStart).toBe('24px');
  });

  it('should map the color variables to the theme role tokens', async () => {
    const { root } = await render(<bq-switch name="bq-switch" />);

    const hostStyle = getComputedStyle(root);
    const expectedRoles = {
      '--bq-switch--dot-color': '--bq-ui--primary',
      '--bq-switch--dot-color-checked': '--bq-text--on-brand',
      '--bq-switch--icon-color': '--bq-icon--inverse',
      '--bq-switch--icon-color-checked': '--bq-text--on-brand',
      '--bq-switch--label-text-color': '--bq-text--primary',
      '--bq-switch--track-color': '--bq-ui--tertiary',
      '--bq-switch--track-color-checked': '--bq-ui--brand',
    };

    for (const [componentVar, roleVar] of Object.entries(expectedRoles)) {
      expect(hostStyle.getPropertyValue(componentVar).trim()).toBe(hostStyle.getPropertyValue(roleVar).trim());
    }
  });

  it('should paint the unchecked state with the color variables', async () => {
    const { root } = await render(
      <bq-switch name="bq-switch" innerLabel="icon">
        Label
      </bq-switch>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-switch >>> [part="control"]', ['backgroundColor']).backgroundColor).toBe(
      resolveColorToken('--bq-ui--tertiary'),
    );
    expect(computedStyle('bq-switch >>> [part="dot"]', ['backgroundColor']).backgroundColor).toBe(
      resolveColorToken('--bq-ui--primary'),
    );
    expect(computedStyle('bq-switch >>> slot[name="icon-off"]', ['color']).color).toBe(
      resolveColorToken('--bq-icon--inverse'),
    );
    expect(computedStyle('bq-switch >>> [part="label"]', ['color']).color).toBe(
      resolveColorToken('--bq-text--primary'),
    );
  });

  it('should paint the checked state with the on-brand color variables', async () => {
    const { root } = await render(
      <bq-switch checked name="bq-switch" innerLabel="icon">
        Label
      </bq-switch>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-switch >>> [part="control"]', ['backgroundColor']).backgroundColor).toBe(
      resolveColorToken('--bq-ui--brand'),
    );
    expect(computedStyle('bq-switch >>> [part="dot"]', ['backgroundColor']).backgroundColor).toBe(
      resolveColorToken('--bq-text--on-brand'),
    );
    expect(computedStyle('bq-switch >>> slot[name="icon-on"]', ['color']).color).toBe(
      resolveColorToken('--bq-text--on-brand'),
    );
  });

  it('should allow overriding the track and dot color variables', async () => {
    const { root } = await render(
      <bq-switch
        checked
        name="bq-switch"
        style={{ '--bq-switch--track-color-checked': 'rgb(1, 2, 3)', '--bq-switch--dot-color-checked': 'rgb(4, 5, 6)' }}
      />,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-switch >>> [part="control"]', ['backgroundColor']).backgroundColor).toBe('rgb(1, 2, 3)');
    expect(computedStyle('bq-switch >>> [part="dot"]', ['backgroundColor']).backgroundColor).toBe('rgb(4, 5, 6)');
  });
});

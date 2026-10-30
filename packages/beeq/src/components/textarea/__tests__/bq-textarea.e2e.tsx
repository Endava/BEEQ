import { h } from '@stencil/core';
import { beforeEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';

/** Waits for any running CSS transition inside the element's shadow root to finish */
const waitForTransitions = async (element: Element) => {
  const animations = element.shadowRoot?.getAnimations() ?? [];
  await Promise.all(animations.map((animation) => animation.finished));
};

const getTextarea = (el: HTMLBqTextareaElement) => el.shadowRoot.querySelector<HTMLTextAreaElement>('[part="input"]');

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

describe('bq-textarea', () => {
  it('should render', async () => {
    const { root } = await render(<bq-textarea name="textarea" placeholder="Placeholder..." />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-textarea name="textarea" placeholder="Placeholder..." />);

    expect(root).toHaveShadowRoot();
  });

  it('should display value', async () => {
    const textValue = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
    const { root } = await render(<bq-textarea value={textValue} name="textarea" placeholder="Placeholder..." />);
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    expect(nativeTextarea.value).toBe(textValue);
  });

  it('should render with label content', async () => {
    const { root } = await render(
      <bq-textarea name="textarea" placeholder="Placeholder...">
        <span slot="label">Input label</span>
      </bq-textarea>,
    );
    const labelContainer = root.shadowRoot.querySelector('.bq-textarea__label');

    expect(labelContainer).not.toHaveAttribute('hidden');
  });

  it('should render with helper text', async () => {
    const { root } = await render(
      <bq-textarea name="textarea" placeholder="Placeholder...">
        <span slot="helper-text">Helper text</span>
      </bq-textarea>,
    );
    const helperContainer = root.shadowRoot.querySelector('.bq-textarea__helper');

    expect(helperContainer).not.toHaveAttribute('hidden');
  });

  it('should render with maxlength counter', async () => {
    const { root } = await render(<bq-textarea maxlength={100} name="textarea" placeholder="Placeholder..." />);
    const counterElem = root.shadowRoot.querySelector('.bq-textarea__helper--counter');

    expect(counterElem).not.toHaveAttribute('hidden');
  });

  it('should hide helper content if no helper text and no maxlength', async () => {
    const { root } = await render(<bq-textarea name="textarea" placeholder="Placeholder..." />);
    const helperContainer = root.shadowRoot.querySelector('.bq-textarea__helper');

    expect(helperContainer).toHaveAttribute('hidden');
  });

  it('should hide empty slot wrappers with the native hidden attribute', async () => {
    const { root } = await render(<bq-textarea name="textarea" />);

    const label = root.shadowRoot.querySelector('.bq-textarea__label');
    const helper = root.shadowRoot.querySelector('.bq-textarea__helper');
    const counter = root.shadowRoot.querySelector('.bq-textarea__helper--counter');

    expect(label).toHaveAttribute('hidden');
    expect(helper).toHaveAttribute('hidden');
    expect(counter).toHaveAttribute('hidden');
    expect(getComputedStyle(label).display).toBe('none');
    expect(getComputedStyle(helper).display).toBe('none');
    expect(getComputedStyle(counter).display).toBe('none');
  });

  it('should write and emit bqChange event on blur', async () => {
    const value = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-textarea name="textarea" placeholder="Placeholder..." />,
    );
    const bqChange = spyOnEvent('bqChange');
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    await userEvent.type(nativeTextarea, value);
    nativeTextarea.blur();
    await waitForChanges();

    expect((root as HTMLBqTextareaElement).value).toBe(value);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should write and emit bqInput event per keystroke', async () => {
    const value = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-textarea name="textarea" placeholder="Placeholder..." />,
    );
    const bqInput = spyOnEvent('bqInput');
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    await userEvent.type(nativeTextarea, value);
    await waitForChanges();

    expect((root as HTMLBqTextareaElement).value).toBe(value);
    expect(bqInput).toHaveReceivedEventTimes(value.length);
    expect(bqInput).toHaveReceivedEventDetail({ value, el: root });
  });

  it('should emit bqInput synchronously within the native input event by default', async () => {
    const { root } = await render(<bq-textarea name="textarea" />);
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');
    const received: string[] = [];
    root.addEventListener('bqInput', (ev: CustomEvent<{ value: string }>) => received.push(ev.detail.value));

    nativeTextarea.value = 'Hi';
    nativeTextarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    // No await on purpose: with the default `debounceTime` of 0 the event must not be deferred
    expect(received).toEqual(['Hi']);
  });

  it('should keep every typed character when a controlled consumer re-renders between keystrokes', async () => {
    const value = 'hello world';
    const { root, waitForChanges } = await render(<bq-textarea name="textarea" />);
    const textareaElem = root as HTMLBqTextareaElement;
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    // Controlled consumer: state follows `bqInput`, and an unrelated re-render queued on each keydown
    // re-applies the controlled value from state (like a React render landing mid-typing)
    let state = '';
    root.addEventListener('bqInput', (ev: CustomEvent<{ value: string }>) => {
      state = ev.detail.value;
    });
    root.addEventListener(
      'keydown',
      () =>
        setTimeout(() => {
          textareaElem.value = state;
        }),
      true,
    );

    await userEvent.type(nativeTextarea, value);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await waitForChanges();

    expect(state).toBe(value);
    expect(nativeTextarea.value).toBe(value);
  });

  it('should debounce bqInput and emit only the latest value when debounceTime is positive', async () => {
    const { root, spyOnEvent } = await render(<bq-textarea debounceTime={50} name="textarea" />);
    const bqInput = spyOnEvent('bqInput');
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    for (const value of ['a', 'ab', 'abc']) {
      nativeTextarea.value = value;
      nativeTextarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    }

    expect(bqInput).toHaveReceivedEventTimes(0);

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(bqInput).toHaveReceivedEventTimes(1);
    expect(bqInput).toHaveReceivedEventDetail({ value: 'abc', el: root });
  });

  it('should emit bqInput synchronously after debounceTime changes to 0', async () => {
    const { root, setProps, spyOnEvent } = await render(<bq-textarea debounceTime={50} name="textarea" />);
    const bqInput = spyOnEvent('bqInput');
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    await setProps({ debounceTime: 0 });

    nativeTextarea.value = 'Hi';
    nativeTextarea.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(bqInput).toHaveReceivedEventTimes(1);
    expect(bqInput).toHaveReceivedEventDetail({ value: 'Hi', el: root });
  });

  it('should show and count all characters', async () => {
    const value = 'Hello';
    const maxlength = 100;
    const { root, setProps } = await render(
      <bq-textarea maxlength={maxlength} name="textarea" placeholder="Placeholder..." />,
    );
    const counterElem = root.shadowRoot.querySelector<HTMLElement>('.bq-textarea__helper--counter');

    await setProps({ value });

    expect(counterElem.textContent).toBe(`${value.length}/${maxlength}`);
  });

  it('should truncate text longer than maxlength', async () => {
    const value = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
    const maxlength = 10;
    const { root, setProps } = await render(
      <bq-textarea maxlength={maxlength} name="textarea" placeholder="Placeholder..." />,
    );
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    await setProps({ value });

    expect(nativeTextarea.value).toBe(value.substring(0, maxlength));
  });

  it('should show the initial value count in the counter', async () => {
    const value = 'Hello';
    const maxlength = 100;
    const { root } = await render(
      <bq-textarea maxlength={maxlength} value={value} name="textarea" placeholder="Placeholder..." />,
    );
    const counterElem = root.shadowRoot.querySelector<HTMLElement>('.bq-textarea__helper--counter');

    expect(counterElem.textContent).toBe(`${value.length}/${maxlength}`);
  });

  it('should display programmatic value changes after the user types', async () => {
    const maxlength = 200;
    const { root, waitForChanges } = await render(
      <bq-textarea maxlength={maxlength} name="textarea" placeholder="Placeholder..." />,
    );
    const textareaElem = root as HTMLBqTextareaElement;
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');
    const counterElem = root.shadowRoot.querySelector<HTMLElement>('.bq-textarea__helper--counter');

    textareaElem.value = 'First value set from code';
    await waitForChanges();
    await userEvent.type(nativeTextarea, 'ddd');
    await waitForChanges();
    expect(textareaElem.value).toBe('First value set from codeddd');

    const nextValue = 'Second value';
    textareaElem.value = nextValue;
    await waitForChanges();

    expect(nativeTextarea.value).toBe(nextValue);
    expect(counterElem.textContent).toBe(`${nextValue.length}/${maxlength}`);

    textareaElem.value = '';
    await waitForChanges();

    expect(nativeTextarea.value).toBe('');
    expect(counterElem.textContent).toBe(`0/${maxlength}`);
  });

  it('should truncate a programmatic value longer than maxlength after the user types', async () => {
    const maxlength = 10;
    const { root, waitForChanges } = await render(
      <bq-textarea maxlength={maxlength} name="textarea" placeholder="Placeholder..." />,
    );
    const textareaElem = root as HTMLBqTextareaElement;
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    await userEvent.type(nativeTextarea, 'abc');
    await waitForChanges();

    textareaElem.value = 'Lorem ipsum dolor sit amet';
    await waitForChanges();

    expect(textareaElem.value).toBe('Lorem ipsu');
    expect(nativeTextarea.value).toBe('Lorem ipsu');
  });

  it('should grow to fit a programmatic value when auto-grow is enabled', async () => {
    const { root, waitForChanges } = await render(
      <bq-textarea auto-grow rows={2} name="textarea" placeholder="Placeholder..." />,
    );
    const textareaElem = root as HTMLBqTextareaElement;
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');
    const initialHeight = nativeTextarea.getBoundingClientRect().height;

    textareaElem.value = Array.from({ length: 10 }, (_, i) => `Line ${i + 1}`).join('\n');
    await waitForChanges();

    expect(nativeTextarea.getBoundingClientRect().height).toBeGreaterThan(initialHeight);
  });

  it('should clear the visible text on form reset after the user types', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-textarea name="notes" placeholder="Placeholder..." />
      </form>,
    );
    const form = root as HTMLFormElement;
    const textareaElem = form.querySelector('bq-textarea');
    const nativeTextarea = textareaElem.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    await userEvent.type(nativeTextarea, 'Hello');
    await waitForChanges();
    expect(new FormData(form).get('notes')).toBe('Hello');

    form.reset();
    await waitForChanges();

    expect(textareaElem.value).toBe('');
    expect(nativeTextarea.value).toBe('');
    expect(new FormData(form).get('notes')).toBeNull();
  });

  it('should emit bqFocus and bqBlur events', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-textarea name="textarea" placeholder="Placeholder..." />,
    );
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    nativeTextarea.focus();
    await waitForChanges();
    expect(bqFocus).toHaveReceivedEventTimes(1);

    nativeTextarea.blur();
    await waitForChanges();
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should not emit events when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-textarea disabled name="textarea" placeholder="Placeholder..." />,
    );
    const bqFocus = spyOnEvent('bqFocus');
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    nativeTextarea.focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(0);
  });

  it('should apply validation-status class', async () => {
    const { root } = await render(
      <bq-textarea validation-status="error" name="textarea" placeholder="Placeholder..." />,
    );
    const nativeTextarea = root.shadowRoot.querySelector('.bq-textarea__input');

    expect(nativeTextarea).toHaveClass('validation-error');
  });

  it('should reflect the placeholder attribute', async () => {
    const { root } = await render(<bq-textarea placeholder="Type here..." name="textarea" />);
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    expect(nativeTextarea.placeholder).toBe('Type here...');
  });

  it('should reflect the rows attribute', async () => {
    const { root } = await render(<bq-textarea rows={8} name="textarea" placeholder="Placeholder..." />);
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    expect(nativeTextarea.rows).toBe(8);
  });

  it('should disable native resizing when disable-resize is set', async () => {
    const { root } = await render(<bq-textarea disable-resize name="textarea" placeholder="Placeholder..." />);
    const nativeTextarea = root.shadowRoot.querySelector('.bq-textarea__input');

    expect(nativeTextarea).toHaveClass('is-resize-disabled');
    expect(getComputedStyle(nativeTextarea).resize).toBe('none');
  });

  it('should not emit bqChange when readonly', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-textarea readonly name="textarea" placeholder="Placeholder..." />,
    );
    const bqChange = spyOnEvent('bqChange');
    const nativeTextarea = root.shadowRoot.querySelector<HTMLTextAreaElement>('.bq-textarea__input');

    // Dispatch a native change event directly — userEvent.type is blocked by readOnly
    nativeTextarea.dispatchEvent(new Event('change', { bubbles: true }));
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(0);
  });

  it('should preserve the native structure, spacing, and transition timing', async () => {
    const { root } = await render(
      <bq-textarea maxlength={100} name="textarea">
        <span slot="label">Label</span>
        <span slot="helper-text">Helper text</span>
      </bq-textarea>,
    );

    await waitForStable(root);

    expect(computedStyle('bq-textarea >>> [part="base"]', ['display', 'flexDirection'])).toEqual({
      display: 'flex',
      flexDirection: 'column',
    });
    expect(computedStyle('bq-textarea >>> [part="label"]', ['marginBlockEnd']).marginBlockEnd).toBe('8px');
    expect(computedStyle('bq-textarea >>> [part="helper-info"]', ['display', 'marginBlockStart'])).toEqual({
      display: 'flex',
      marginBlockStart: '8px',
    });
    expect(computedStyle('bq-textarea >>> [part="helper-counter"]', ['fontVariantNumeric', 'opacity'])).toEqual({
      fontVariantNumeric: 'tabular-nums',
      opacity: '0.6',
    });
    expect(
      computedStyle('bq-textarea >>> [part="input"]', [
        'borderRadius',
        'borderWidth',
        'resize',
        'transitionDuration',
        'transitionProperty',
        'transitionTimingFunction',
      ]),
    ).toEqual({
      borderRadius: '8px',
      borderWidth: '1px',
      resize: 'vertical',
      transitionDuration: '0.15s',
      transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
      transitionTimingFunction: 'ease-in-out',
    });
  });

  it('should paint the idle, hover, and focus states with native CSS', async () => {
    const { root } = await render(<bq-textarea name="textarea" />);
    const host = root as HTMLBqTextareaElement;
    const textarea = getTextarea(host);

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-textarea >>> [part="input"]', ['backgroundColor', 'borderTopColor', 'color'])).toEqual({
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderTopColor: resolveColorToken('--bq-stroke--tertiary'),
      color: resolveColorToken('--bq-text--primary'),
    });

    await userEvent.hover(textarea);
    await waitForTransitions(root);

    const colorProbe = document.createElement('span');
    root.shadowRoot.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-stroke--brand), var(--bq-hover) var(--bq-state-mix-hover))';
    expect(computedStyle('bq-textarea >>> [part="input"]', ['borderTopColor']).borderTopColor).toBe(
      getComputedStyle(colorProbe).color,
    );

    textarea.focus();
    await waitForTransitions(root);

    expect(
      computedStyle('bq-textarea >>> [part="input"]', [
        'borderTopColor',
        'outlineColor',
        'outlineOffset',
        'outlineStyle',
        'outlineWidth',
      ]),
    ).toEqual({
      borderTopColor: resolveColorToken('--bq-stroke--brand'),
      outlineColor: resolveColorToken('--bq-stroke--brand'),
      outlineOffset: '0px',
      outlineStyle: 'solid',
      outlineWidth: '1px',
    });

    colorProbe.remove();
  });

  it('should mix validation borders on hover and focus', async () => {
    const { root, setProps } = await render(<bq-textarea name="textarea" validationStatus="error" />);
    const host = root as HTMLBqTextareaElement;
    const textarea = getTextarea(host);
    const colorProbe = document.createElement('span');
    root.shadowRoot.appendChild(colorProbe);

    for (const [validationStatus, role] of Object.entries({
      error: 'danger',
      success: 'success',
      warning: 'warning',
    })) {
      textarea.blur();
      await movePointerOff();
      await setProps({ validationStatus });
      await waitForTransitions(root);

      await userEvent.hover(textarea);
      await waitForTransitions(root);
      colorProbe.style.color = `color-mix(in srgb, var(--bq-textarea--border-color-${role}), var(--bq-hover) 20%)`;
      expect(computedStyle('bq-textarea >>> [part="input"]', ['borderTopColor']).borderTopColor).toBe(
        getComputedStyle(colorProbe).color,
      );

      textarea.focus();
      await waitForTransitions(root);
      colorProbe.style.color = `color-mix(in srgb, var(--bq-textarea--border-color-${role}), var(--bq-active) 20%)`;
      expect(computedStyle('bq-textarea >>> [part="input"]', ['borderTopColor']).borderTopColor).toBe(
        getComputedStyle(colorProbe).color,
      );
      expect(computedStyle('bq-textarea >>> [part="input"]', ['outlineColor']).outlineColor).toBe(
        resolveColorToken(`--bq-stroke--${role}`),
      );
    }

    colorProbe.remove();
  });

  it('should expose the disabled visual state without hover styling', async () => {
    const { root } = await render(<bq-textarea disabled name="textarea" />);
    const host = root as HTMLBqTextareaElement;
    const textarea = getTextarea(host);

    await userEvent.hover(textarea);
    await waitForTransitions(root);

    expect(computedStyle('bq-textarea >>> [part="input"]', ['borderTopColor', 'cursor', 'opacity'])).toEqual({
      borderTopColor: resolveColorToken('--bq-stroke--tertiary'),
      cursor: 'not-allowed',
      opacity: '0.6',
    });
  });

  it('should allow overriding the base color variables', async () => {
    const { root } = await render(
      <bq-textarea
        name="textarea"
        style={{
          '--bq-textarea--background-color': 'rgb(1, 2, 3)',
          '--bq-textarea--border-color': 'rgb(4, 5, 6)',
          '--bq-textarea--helper-text-color': 'rgb(7, 8, 9)',
          '--bq-textarea--label-text-color': 'rgb(10, 11, 12)',
          '--bq-textarea--text-color': 'rgb(13, 14, 15)',
        }}
      >
        <span slot="label">Label</span>
        <span slot="helper-text">Helper text</span>
      </bq-textarea>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-textarea >>> [part="input"]', ['backgroundColor', 'borderTopColor', 'color'])).toEqual({
      backgroundColor: 'rgb(1, 2, 3)',
      borderTopColor: 'rgb(4, 5, 6)',
      color: 'rgb(13, 14, 15)',
    });
    expect(computedStyle('bq-textarea >>> [part="helper-info"]', ['color']).color).toBe('rgb(7, 8, 9)');
    expect(computedStyle('bq-textarea >>> [part="label"]', ['color']).color).toBe('rgb(10, 11, 12)');
  });

  it('should map the color variables to the theme role tokens', async () => {
    const { root } = await render(<bq-textarea name="textarea" placeholder="Placeholder..." />);

    const hostStyle = getComputedStyle(root);
    const expectedRoles = {
      '--bq-textarea--border-color': '--bq-stroke--tertiary',
      '--bq-textarea--border-color-focus': '--bq-stroke--brand',
      '--bq-textarea--helper-text-color': '--bq-text--primary',
      '--bq-textarea--label-text-color': '--bq-text--primary',
      '--bq-textarea--text-color': '--bq-text--primary',
      '--bq-textarea--text-placeholder-color': '--bq-text--secondary',
    };

    for (const [componentVar, roleVar] of Object.entries(expectedRoles)) {
      expect(hostStyle.getPropertyValue(componentVar).trim()).toBe(hostStyle.getPropertyValue(roleVar).trim());
    }

    for (const status of ['danger', 'success', 'warning']) {
      expect(hostStyle.getPropertyValue(`--bq-textarea--border-color-${status}`).trim()).toBe(
        hostStyle.getPropertyValue(`--bq-stroke--${status}`).trim(),
      );
      expect(hostStyle.getPropertyValue(`--bq-textarea--helper-text-color-${status}`).trim()).toBe(
        hostStyle.getPropertyValue(`--bq-text--${status}`).trim(),
      );
    }
  });

  it('should paint the border and helper text with the validation color variables', async () => {
    const { root, setProps } = await render(
      <bq-textarea name="textarea" placeholder="Placeholder...">
        <span slot="helper-text">Helper text</span>
      </bq-textarea>,
    );
    const statuses = { error: 'danger', success: 'success', warning: 'warning' } as const;

    for (const [validationStatus, role] of Object.entries(statuses)) {
      await setProps({ validationStatus });
      await waitForStable(root);
      await waitForTransitions(root);

      expect(computedStyle('bq-textarea >>> [part="input"]', ['borderTopColor']).borderTopColor).toBe(
        resolveColorToken(`--bq-stroke--${role}`),
      );
      expect(computedStyle('bq-textarea >>> [part="helper-info"]', ['color']).color).toBe(
        resolveColorToken(`--bq-text--${role}`),
      );
    }
  });

  it('should allow overriding the validation color variables', async () => {
    const { root } = await render(
      <bq-textarea
        name="textarea"
        placeholder="Placeholder..."
        validationStatus="error"
        style={{
          '--bq-textarea--border-color-danger': 'rgb(1, 2, 3)',
          '--bq-textarea--helper-text-color-danger': 'rgb(4, 5, 6)',
        }}
      >
        <span slot="helper-text">Helper text</span>
      </bq-textarea>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-textarea >>> [part="input"]', ['borderTopColor']).borderTopColor).toBe('rgb(1, 2, 3)');
    expect(computedStyle('bq-textarea >>> [part="helper-info"]', ['color']).color).toBe('rgb(4, 5, 6)');
  });
});

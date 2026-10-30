import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { cdp, userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import type { TInputValue } from '../bq-input.types';

/** Waits for any running CSS transition inside the element's shadow root to finish */
const waitForTransitions = async (element: Element) => {
  const animations = element.shadowRoot?.getAnimations() ?? [];
  await Promise.all(animations.map((animation) => animation.finished));
};

const getInput = (el: HTMLBqInputElement) => el.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');
const getControl = (el: HTMLBqInputElement) => el.shadowRoot?.querySelector<HTMLElement>('[part="control"]');
const getClearButton = (el: HTMLBqInputElement) =>
  el.shadowRoot?.querySelector<HTMLBqButtonElement>('[part="clear-btn"]');

/** Sets the native input value and dispatches a native `input` event synchronously */
const dispatchNativeInput = (input: HTMLInputElement, value: string) => {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

describe('bq-input', () => {
  it('should render', async () => {
    const { root } = await render(<bq-input name="bq-input" />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-input name="bq-input" />);
    expect(root).toHaveShadowRoot();
  });

  it('should render with prefix icon', async () => {
    const { root } = await render(
      <bq-input name="bq-input">
        <bq-icon name="user-circle" slot="prefix"></bq-icon>
      </bq-input>,
    );

    const prefixContainerElem = root?.shadowRoot?.querySelector('.bq-input--control__prefix');
    expect(prefixContainerElem).not.toHaveAttribute('hidden');
  });

  it('should render with suffix icon', async () => {
    const { root } = await render(
      <bq-input name="bq-input">
        <bq-icon name="gear" slot="suffix"></bq-icon>
      </bq-input>,
    );

    const suffixContainerElem = root?.shadowRoot?.querySelector('.bq-input--control__suffix');
    expect(suffixContainerElem).not.toHaveAttribute('hidden');
  });

  it('should render with label content', async () => {
    const { root } = await render(
      <bq-input name="bq-input">
        <label slot="label" htmlFor="bq-input-test">
          Input label
        </label>
      </bq-input>,
    );

    const labelContainerElem = root?.shadowRoot?.querySelector('.bq-input--label');
    expect(labelContainerElem).not.toHaveAttribute('hidden');
  });

  it('should render with helper content', async () => {
    const { root } = await render(
      <bq-input name="bq-input">
        <span slot="helper-text">Helper text</span>
      </bq-input>,
    );

    const helperContainerElem = root?.shadowRoot?.querySelector('.bq-input--helper-text');
    expect(helperContainerElem).not.toHaveAttribute('hidden');
  });

  it('should hide empty slot wrappers with the native hidden attribute', async () => {
    const { root } = await render(<bq-input name="bq-input" />);

    for (const selector of [
      '.bq-input--label',
      '.bq-input--control__prefix',
      '.bq-input--control__suffix',
      '.bq-input--helper-text',
    ]) {
      const wrapper = root.shadowRoot?.querySelector(selector);
      expect(wrapper).toHaveAttribute('hidden');
      expect(getComputedStyle(wrapper as Element).display).toBe('none');
    }
  });

  it('should write and emit change event', async () => {
    const inputValue = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input name="bq-input"></bq-input>);
    const bqInput = root as HTMLBqInputElement;

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    const bqChange = spyOnEvent('bqChange');

    await userEvent.type(nativeInput, inputValue);
    nativeInput?.blur();
    await waitForChanges();

    expect(bqInput.value).toBe(inputValue);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should write and emit input event', async () => {
    const inputValue = 'Hello';
    const { root, spyOnEvent } = await render(<bq-input name="bq-input"></bq-input>);
    const bqInput = root as HTMLBqInputElement;

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    const bqInputEvent = spyOnEvent('bqInput');

    await userEvent.type(nativeInput, inputValue);

    expect(bqInput.value).toBe(inputValue);
    expect(bqInputEvent).toHaveReceivedEventTimes(inputValue.length);
  });

  it.each([
    ['text', 'x', 'x'],
    ['number', '42', 42],
  ] as const)('should emit `bqInput` synchronously for %s input by default', async (type, text, value) => {
    const onInput = vi.fn();
    const { root } = await render(<bq-input name="bq-input" type={type} onBqInput={onInput} />);
    const host = root as HTMLBqInputElement;

    dispatchNativeInput(getInput(host), text);

    // Asserted before any await: the event must fire inside the native `input` dispatch
    expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value, el: host } }));
  });

  it.each([
    ['text', 'hello world', 'hello world'],
    ['number', '12345', 12345],
  ] as const)(
    'should keep typed %s input when a controlled consumer re-renders stale state',
    async (type, text, value) => {
      const { root } = await render(<bq-input name="bq-input" type={type} />);
      const host = root as HTMLBqInputElement;
      const input = getInput(host);

      let state: TInputValue = '';
      host.addEventListener('bqInput', (ev: CustomEvent<{ value: TInputValue }>) => {
        state = ev.detail.value;
      });
      // Simulates an unrelated framework re-render that re-applies the controlled value from state
      host.addEventListener(
        'keydown',
        () =>
          setTimeout(() => {
            host.value = state;
          }, 0),
        true,
      );

      await userEvent.type(input, text);
      await wait(50);

      expect(state).toBe(value);
      expect(host.value).toBe(value);
      expect(input.value).toBe(text);
    },
  );

  it('should clear the value and emit clear event', async () => {
    const inputValue = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-input name="bq-input" value={`${inputValue}`}></bq-input>,
    );
    const bqInput = root as HTMLBqInputElement;

    const bqClear = spyOnEvent('bqClear');

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    expect(bqInput.value).toBe(inputValue);

    nativeInput?.focus();
    await waitForChanges();

    const clearBtnElem = root.shadowRoot?.querySelector('.bq-input--control__clear');
    await userEvent.click(clearBtnElem);

    expect(bqClear).toHaveReceivedEventTimes(1);
    expect(bqInput.value).toEqual('');
  });

  it('should emit `bqFocus` when the input receives focus', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input name="bq-input" />);

    const bqFocus = spyOnEvent('bqFocus');
    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');

    nativeInput?.focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
  });

  it('should emit `bqBlur` when the input loses focus', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input name="bq-input" />);

    const bqBlur = spyOnEvent('bqBlur');
    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');

    nativeInput?.focus();
    nativeInput?.blur();
    await waitForChanges();

    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should not emit events when `disabled`', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input name="bq-input" disabled />);

    const bqFocus = spyOnEvent('bqFocus');
    const bqInput = spyOnEvent('bqInput');
    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');

    await userEvent.type(nativeInput, 'test');
    nativeInput?.focus();
    await waitForChanges();

    expect(bqFocus).not.toHaveReceivedEvent();
    expect(bqInput).not.toHaveReceivedEvent();
  });

  it('should not allow typing when `readonly`', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input name="bq-input" readonly />);

    const bqInput = spyOnEvent('bqInput');
    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');

    await userEvent.type(nativeInput, 'test');
    await waitForChanges();

    expect(bqInput).not.toHaveReceivedEvent();
    expect((root as HTMLBqInputElement).value).toBeFalsy();
  });

  it('should reflect `placeholder` on the native input', async () => {
    const placeholder = 'Enter your name';
    const { root } = await render(<bq-input name="bq-input" placeholder={placeholder} />);

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    expect(nativeInput?.placeholder).toBe(placeholder);
  });

  it('should hide the clear button when `disable-clear` is set', async () => {
    const { root, waitForChanges } = await render(<bq-input name="bq-input" value="Hello" disable-clear />);

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    nativeInput?.focus();
    await waitForChanges();

    const clearBtn = root.shadowRoot?.querySelector('.bq-input--control__clear');
    expect(clearBtn).toBeNull();
  });

  it('should apply `validation-error` class when `validationStatus` is "error"', async () => {
    const { root } = await render(<bq-input name="bq-input" validation-status="error" />);

    const control = root.shadowRoot?.querySelector('.bq-input--control');
    expect(control).toHaveClass('validation-error');
  });

  it('should apply `validation-success` class when `validationStatus` is "success"', async () => {
    const { root } = await render(<bq-input name="bq-input" validation-status="success" />);

    const control = root.shadowRoot?.querySelector('.bq-input--control');
    expect(control).toHaveClass('validation-success');
  });

  it('should apply `validation-warning` class when `validationStatus` is "warning"', async () => {
    const { root } = await render(<bq-input name="bq-input" validation-status="warning" />);

    const control = root.shadowRoot?.querySelector('.bq-input--control');
    expect(control).toHaveClass('validation-warning');
  });

  it('should debounce `bqInput` emission when `debounce-time` is set', async () => {
    const DEBOUNCE_TIME = 50;
    const onInput = vi.fn();
    const { root } = await render(<bq-input name="bq-input" debounce-time={DEBOUNCE_TIME} onBqInput={onInput} />);
    const host = root as HTMLBqInputElement;
    const input = getInput(host);

    for (const text of ['a', 'ab', 'abc']) {
      dispatchNativeInput(input, text);
    }

    expect(host.value).toBe('abc');
    expect(onInput).not.toHaveBeenCalled();

    // After the debounce settles, the event fires exactly once with the latest value
    await wait(DEBOUNCE_TIME + 20);
    expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: 'abc', el: host } }));
  });

  it('should switch between synchronous and debounced `bqInput` when `debounceTime` changes', async () => {
    const DEBOUNCE_TIME = 50;
    const onInput = vi.fn();
    const { root, setProps } = await render(<bq-input name="bq-input" onBqInput={onInput} />);
    const host = root as HTMLBqInputElement;
    const input = getInput(host);

    await setProps({ debounceTime: DEBOUNCE_TIME });
    dispatchNativeInput(input, 'a');
    expect(onInput).not.toHaveBeenCalled();
    await wait(DEBOUNCE_TIME + 20);
    expect(onInput).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 'a', el: host } }));

    await setProps({ debounceTime: 0 });
    dispatchNativeInput(input, 'ab');
    expect(onInput).toHaveBeenCalledTimes(2);
    expect(onInput).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: 'ab', el: host } }));
  });

  it('should drop a pending debounced `bqInput` when the value is cleared', async () => {
    // Long enough for the clicks below to land before the pending emit would fire
    const DEBOUNCE_TIME = 500;
    const onInput = vi.fn();
    const { root, waitForChanges } = await render(
      <bq-input name="bq-input" debounce-time={DEBOUNCE_TIME} onBqInput={onInput} />,
    );
    const host = root as HTMLBqInputElement;
    const input = getInput(host);

    await userEvent.click(input);
    dispatchNativeInput(input, 'abc');
    await waitForChanges();
    await waitForStable(root);
    await userEvent.click(getClearButton(host));
    expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '', el: host } }));

    await wait(DEBOUNCE_TIME + 20);
    expect(host.value).toBe('');
    expect(onInput).toHaveBeenCalledOnce();
  });

  it('should drop a pending debounced `bqInput` when the input is removed from the DOM', async () => {
    const DEBOUNCE_TIME = 50;
    const onInput = vi.fn();
    const { root } = await render(<bq-input name="bq-input" debounce-time={DEBOUNCE_TIME} onBqInput={onInput} />);
    const host = root as HTMLBqInputElement;

    dispatchNativeInput(getInput(host), 'abc');
    host.remove();
    await wait(DEBOUNCE_TIME + 20);

    expect(onInput).not.toHaveBeenCalled();
  });

  it.each(['Backspace', 'Delete'])('should keep numeric input empty after %s and blur', async (key) => {
    const onInput = vi.fn();
    const onChange = vi.fn();
    const onClear = vi.fn();
    const { root, waitForChanges } = await render(
      <form>
        <bq-input
          name="amount"
          type="number"
          value={10}
          onBqInput={onInput}
          onBqChange={onChange}
          onBqClear={onClear}
        />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    await userEvent.click(input);
    input.select();
    await userEvent.keyboard(`{${key}}`);
    await waitForChanges();
    await waitForStable(root);

    expect(input.value).toBe('');
    expect(host.value).toBe('');
    expect(host).toEqualAttribute('value', '');
    expect(new FormData(form).get('amount')).toBe('');
    expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '', el: host } }));

    input.blur();
    await waitForChanges();
    await waitForStable(root);

    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '', el: host } }));
    expect(onClear).not.toHaveBeenCalled();
    expect(input.value).toBe('');
    expect(new FormData(form).get('amount')).toBe('');

    host.placeholder = 'Still empty';
    await waitForChanges();
    expect(input.value).toBe('');
  });

  it('should preserve empty numeric values in the change handler without an input event', async () => {
    const onChange = vi.fn();
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="amount" type="number" value={10} onBqChange={onChange} />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    input.value = '';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await waitForChanges();

    expect(host.value).toBe('');
    expect(input.value).toBe('');
    expect(new FormData(form).get('amount')).toBe('');
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '', el: host } }));
  });

  it('should update the form value and validity when only a change event is dispatched', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="text" required form-validation-message="Enter a value" />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    expect(form.checkValidity()).toBe(false);

    input.value = 'Hello';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await waitForChanges();

    expect(host.value).toBe('Hello');
    expect(new FormData(form).get('text')).toBe('Hello');
    expect(form.checkValidity()).toBe(true);
  });

  it.each([
    ['-', '5', -5],
    ['.', '5', 0.5],
    ['1e', '2', 100],
  ])('should allow completing the partial numeric token %s without emitting zero', async (partial, rest, value) => {
    const onInput = vi.fn();
    const { root, waitForChanges } = await render(<bq-input name="amount" type="number" onBqInput={onInput} />);
    const host = root as HTMLBqInputElement;
    const input = getInput(host);

    await userEvent.type(input, partial);
    await waitForChanges();
    await waitForStable(root);

    expect(input.value).toBe('');
    expect(host.value).toBe('');
    expect(onInput).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value: '', el: host } }));

    await userEvent.keyboard(rest);
    await waitForChanges();
    await waitForStable(root);

    expect(host.value).toBe(value);
    expect(input.valueAsNumber).toBe(value);
    expect(onInput).toHaveBeenLastCalledWith(expect.objectContaining({ detail: { value, el: host } }));
  });

  it('should treat deliberately entered zero as a required numeric value', async () => {
    const onInput = vi.fn();
    const onChange = vi.fn();
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="amount" type="number" required onBqInput={onInput} onBqChange={onChange} />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    expect(form.checkValidity()).toBe(false);
    await userEvent.type(input, '0');
    input.blur();
    await waitForChanges();
    await waitForStable(root);

    expect(host.value).toBe(0);
    expect(input.value).toBe('0');
    expect(new FormData(form).get('amount')).toBe('0');
    expect(form.checkValidity()).toBe(true);
    expect(getClearButton(host)).not.toBeNull();
    expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: 0, el: host } }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: 0, el: host } }));
  });

  it.each([0, '0'])('should preserve initial and programmatic zero %j', async (value) => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="amount" type="number" value={value} required />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    expect(host.value).toBe(value);
    expect(form.checkValidity()).toBe(true);
    expect(getClearButton(host)).not.toBeNull();
    expect(new FormData(form).get('amount')).toBe('0');

    host.value = '';
    await waitForChanges();
    expect(form.checkValidity()).toBe(false);
    expect(getClearButton(host)).toBeNull();
    expect(new FormData(form).get('amount')).toBe('');

    host.required = false;
    await waitForChanges();
    expect(form.checkValidity()).toBe(true);

    host.required = true;
    host.value = value;
    await waitForChanges();
    expect(host.value).toBe(value);
    expect(input.value).toBe('0');
    expect(form.checkValidity()).toBe(true);
    expect(getClearButton(host)).not.toBeNull();
  });

  it('should clear numeric zero with the existing event order, validity, and focus', async () => {
    const events: string[] = [];
    const onClear = vi.fn(() => events.push('clear'));
    const onInput = vi.fn(() => events.push('input'));
    const onChange = vi.fn(() => events.push('change'));
    const { root, waitForChanges } = await render(
      <form>
        <bq-input
          name="amount"
          type="number"
          value={0}
          required
          onBqClear={onClear}
          onBqInput={onInput}
          onBqChange={onChange}
        />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    await userEvent.click(input);
    await waitForStable(root);
    expect(getClearButton(host)).not.toBeNull();
    await userEvent.click(getClearButton(host));
    await waitForChanges();

    expect(events).toEqual(['clear', 'input', 'change']);
    expect(onClear).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: host }));
    expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '', el: host } }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '', el: host } }));
    expect(host.value).toBe('');
    expect(input.value).toBe('');
    expect(new FormData(form).get('amount')).toBe('');
    expect(form.checkValidity()).toBe(false);
    expect(host.shadowRoot.activeElement).toBe(input);
  });

  it.each([
    ['10', 10],
    ['-5', -5],
    ['1.5', 1.5],
    ['1e2', 100],
  ])('should continue emitting numbers for %s', async (text, value) => {
    const onChange = vi.fn();
    const { root, waitForChanges } = await render(
      <bq-input name="amount" type="number" min={-10} max={100} step="any" onBqChange={onChange} />,
    );
    const host = root as HTMLBqInputElement;
    const input = getInput(host);

    expect(input.min).toBe('-10');
    expect(input.max).toBe('100');
    expect(input.step).toBe('any');
    await userEvent.type(input, text);
    input.blur();
    await waitForChanges();

    expect(host.value).toBe(value);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value, el: host } }));
  });

  it.each(['text', 'search', 'tel'] as const)('should keep zero as a string for %s inputs', async (type) => {
    const onInput = vi.fn();
    const { root, waitForChanges } = await render(<bq-input name="text" type={type} onBqInput={onInput} />);
    const host = root as HTMLBqInputElement;

    await userEvent.type(getInput(host), '0');
    await waitForChanges();

    expect(host.value).toBe('0');
    expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '0', el: host } }));
  });

  it('should preserve whitespace-only required validation for text', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="text" value="   " required form-validation-message="Enter a value" />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');

    expect(form.checkValidity()).toBe(false);
    host.value = '0';
    await waitForChanges();
    expect(form.checkValidity()).toBe(true);
  });

  it('should preserve array serialization and Clear behavior', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="text" value={['one', 'two']} />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');

    expect(new FormData(form).get('text')).toBe('one,two');
    await userEvent.click(getInput(host));
    await waitForStable(root);
    await userEvent.click(getClearButton(host));
    await waitForChanges();
    expect(host.value).toBe('');
    expect(new FormData(form).get('text')).toBe('');

    host.value = [];
    await waitForChanges();
    expect(getClearButton(host)).toBeNull();
    expect(new FormData(form).get('text')).toBe('');
  });

  it('should keep the form value and validity in sync when a form reset leaves the value unchanged', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="text" value="" required form-validation-message="Enter a value" />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');

    expect(form.checkValidity()).toBe(false);

    form.reset();
    await waitForChanges();

    expect(host.value).toBe('');
    expect(new FormData(form).get('text')).toBe('');
    expect(form.checkValidity()).toBe(false);

    await userEvent.type(getInput(host), 'abc');
    await userEvent.click(getClearButton(host));
    await waitForChanges();
    expect(form.checkValidity()).toBe(false);

    form.reset();
    await waitForChanges();

    expect(host.value).toBe('');
    expect(new FormData(form).get('text')).toBe('');
    expect(form.checkValidity()).toBe(false);
  });

  it('should discard a partial numeric token on form reset and keep the empty form value', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="amount" type="number" value="" required />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    await userEvent.type(input, '-');
    await waitForChanges();
    expect(input.validity.badInput).toBe(true);
    expect(host.value).toBe('');

    form.reset();
    await waitForChanges();

    expect(input.validity.badInput).toBe(false);
    expect(host.value).toBe('');
    expect(new FormData(form).get('amount')).toBe('');
    expect(form.checkValidity()).toBe(false);
  });

  it('should preserve numeric reset behavior without emitting user events', async () => {
    const onInput = vi.fn();
    const onChange = vi.fn();
    const onClear = vi.fn();
    const { root, waitForChanges } = await render(
      <form>
        <bq-input
          name="amount"
          type="number"
          value={10}
          onBqInput={onInput}
          onBqChange={onChange}
          onBqClear={onClear}
        />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');

    form.reset();
    await waitForChanges();
    expect(host.value).toBe('');
    expect(getInput(host).value).toBe('');
    expect(new FormData(form).get('amount')).toBe('');
    expect(onInput).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onClear).not.toHaveBeenCalled();
  });

  it.each(['disabled', 'readonly', 'disableClear'] as const)('should preserve %s for numeric zero', async (prop) => {
    const onInput = vi.fn();
    const { root, waitForChanges } = await render(
      <bq-input name="amount" type="number" value={0} {...{ [prop]: true }} onBqInput={onInput} />,
    );
    const host = root as HTMLBqInputElement;
    const input = getInput(host);

    if (prop === 'disableClear') {
      expect(getClearButton(host)).toBeNull();
    } else {
      await userEvent.type(input, '5');
      await waitForChanges();
      expect(prop === 'readonly' ? input.readOnly : input.disabled).toBe(true);
      expect(onInput).not.toHaveBeenCalled();
      expect(host.value).toBe(0);
    }
  });

  it('should debounce numeric deletion without changing its empty value', async () => {
    const onInput = vi.fn();
    const { root, waitForChanges } = await render(
      <form>
        <bq-input name="amount" type="number" value={10} debounceTime={50} onBqInput={onInput} />
      </form>,
    );
    const form = root as HTMLFormElement;
    const host = form.querySelector<HTMLBqInputElement>('bq-input');
    const input = getInput(host);

    await userEvent.click(input);
    input.select();
    await userEvent.keyboard('{Backspace}');
    await waitForChanges();
    expect(host.value).toBe('');
    expect(new FormData(form).get('amount')).toBe('');
    await vi.waitFor(() => {
      expect(onInput).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ detail: { value: '', el: host } }));
    });
  });

  it('should preserve the native control geometry and transition timing', async () => {
    const { root } = await render(
      <bq-input name="bq-input">
        <span slot="label">Label</span>
        <span slot="helper-text">Helper text</span>
      </bq-input>,
    );

    await waitForStable(root);

    expect(computedStyle('bq-input >>> [part="label"]', ['marginBlockEnd']).marginBlockEnd).toBe('8px');
    expect(computedStyle('bq-input >>> [part="helper-text"]', ['marginBlockStart']).marginBlockStart).toBe('8px');
    expect(
      computedStyle('bq-input >>> [part="control"]', [
        'borderRadius',
        'borderWidth',
        'transitionDuration',
        'transitionProperty',
        'transitionTimingFunction',
      ]),
    ).toEqual({
      borderRadius: '8px',
      borderWidth: '1px',
      transitionDuration: '0.15s',
      transitionProperty: 'border-color, box-shadow',
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    });

    expect(computedStyle('bq-input >>> [part="input"]', ['minHeight', 'minWidth'])).toEqual({
      minHeight: '24px',
      minWidth: '0px',
    });
  });

  it('should paint the idle, hover, and focus states with native CSS', async () => {
    const { root } = await render(<bq-input name="bq-input" />);
    const host = root as HTMLBqInputElement;

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-input >>> [part="control"]', ['backgroundColor', 'borderTopColor', 'color'])).toEqual({
      backgroundColor: resolveColorToken('--bq-ui--primary'),
      borderTopColor: resolveColorToken('--bq-stroke--tertiary'),
      color: resolveColorToken('--bq-text--primary'),
    });

    await userEvent.hover(getControl(host));
    await waitForTransitions(root);

    const colorProbe = document.createElement('span');
    root.shadowRoot?.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-stroke--brand), var(--bq-hover) var(--bq-state-mix-hover))';

    expect(computedStyle('bq-input >>> [part="control"]', ['borderTopColor']).borderTopColor).toBe(
      getComputedStyle(colorProbe).color,
    );

    getInput(host).focus();
    await waitForTransitions(root);

    expect(
      computedStyle('bq-input >>> [part="control"]', [
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
    const { root, setProps } = await render(<bq-input name="bq-input" validationStatus="error" />);
    const host = root as HTMLBqInputElement;
    const control = getControl(host);
    const input = getInput(host);
    const colorProbe = document.createElement('span');
    root.shadowRoot?.appendChild(colorProbe);

    for (const [validationStatus, role] of Object.entries({
      error: 'danger',
      success: 'success',
      warning: 'warning',
    })) {
      input.blur();
      await movePointerOff();
      await setProps({ validationStatus });
      await waitForTransitions(root);

      await userEvent.hover(control);
      await waitForTransitions(root);
      colorProbe.style.color = `color-mix(in srgb, var(--bq-input--border-color-${role}), var(--bq-hover) 20%)`;
      expect(computedStyle('bq-input >>> [part="control"]', ['borderTopColor']).borderTopColor).toBe(
        getComputedStyle(colorProbe).color,
      );

      input.focus();
      await waitForTransitions(root);
      colorProbe.style.color = `color-mix(in srgb, var(--bq-input--border-color-${role}), var(--bq-active) 20%)`;
      expect(computedStyle('bq-input >>> [part="control"]', ['borderTopColor']).borderTopColor).toBe(
        getComputedStyle(colorProbe).color,
      );
      expect(computedStyle('bq-input >>> [part="control"]', ['outlineColor']).outlineColor).toBe(
        resolveColorToken(`--bq-stroke--${role}`),
      );
    }

    colorProbe.remove();
  });

  it('should reveal and reset the clear button when the control is interactive', async () => {
    const { root } = await render(<bq-input name="bq-input" value="Hello" />);
    const host = root as HTMLBqInputElement;
    const clearButton = getClearButton(host);

    expect(getComputedStyle(clearButton as Element).display).toBe('none');

    getInput(host).focus();
    await waitForStable(root);

    expect(getComputedStyle(clearButton as Element).display).toBe('block');

    const button = clearButton.shadowRoot?.querySelector('[part="button"]');
    expect(getComputedStyle(button as Element).borderTopStyle).toBe('none');
    expect(getComputedStyle(button as Element).paddingBlockStart).toBe('0px');
    expect(getComputedStyle(button as Element).paddingInlineStart).toBe('0px');
  });

  it('should expose the disabled visual state', async () => {
    const { root } = await render(<bq-input disabled name="bq-input" value="Hello" />);

    expect(computedStyle('bq-input >>> [part="control"]', ['cursor', 'opacity'])).toEqual({
      cursor: 'not-allowed',
      opacity: '0.6',
    });
    expect((root as HTMLBqInputElement).shadowRoot?.querySelector('[part="clear-btn"]')).toBeNull();
  });

  it('should allow overriding the base color variables', async () => {
    const { root } = await render(
      <bq-input
        name="bq-input"
        style={{
          '--bq-input--background-color': 'rgb(1, 2, 3)',
          '--bq-input--border-color': 'rgb(4, 5, 6)',
          '--bq-input--helper-text-color': 'rgb(7, 8, 9)',
          '--bq-input--label-text-color': 'rgb(10, 11, 12)',
          '--bq-input--text-color': 'rgb(13, 14, 15)',
        }}
      >
        <span slot="label">Label</span>
        <span slot="helper-text">Helper text</span>
      </bq-input>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-input >>> [part="control"]', ['backgroundColor', 'borderTopColor', 'color'])).toEqual({
      backgroundColor: 'rgb(1, 2, 3)',
      borderTopColor: 'rgb(4, 5, 6)',
      color: 'rgb(13, 14, 15)',
    });
    expect(computedStyle('bq-input >>> [part="helper-text"]', ['color']).color).toBe('rgb(7, 8, 9)');
    expect(computedStyle('bq-input >>> [part="label"]', ['color']).color).toBe('rgb(10, 11, 12)');
  });

  it('should map the color variables to the theme role tokens', async () => {
    const { root } = await render(<bq-input name="bq-input" />);

    const hostStyle = getComputedStyle(root);
    const expectedRoles = {
      '--bq-input--background-color': '--bq-ui--primary',
      '--bq-input--border-color': '--bq-stroke--tertiary',
      '--bq-input--border-color-focus': '--bq-stroke--brand',
      '--bq-input--helper-text-color': '--bq-text--primary',
      '--bq-input--label-text-color': '--bq-text--primary',
      '--bq-input--text-color': '--bq-text--primary',
      '--bq-input--text-placeholder-color': '--bq-text--secondary',
    };

    for (const [componentVar, roleVar] of Object.entries(expectedRoles)) {
      expect(hostStyle.getPropertyValue(componentVar).trim()).toBe(hostStyle.getPropertyValue(roleVar).trim());
    }

    for (const status of ['danger', 'success', 'warning']) {
      expect(hostStyle.getPropertyValue(`--bq-input--border-color-${status}`).trim()).toBe(
        hostStyle.getPropertyValue(`--bq-stroke--${status}`).trim(),
      );
      expect(hostStyle.getPropertyValue(`--bq-input--helper-text-color-${status}`).trim()).toBe(
        hostStyle.getPropertyValue(`--bq-text--${status}`).trim(),
      );
    }
  });

  it('should paint the border and helper text with the validation color variables', async () => {
    const { root, setProps } = await render(
      <bq-input name="bq-input">
        <span slot="helper-text">Helper text</span>
      </bq-input>,
    );
    const statuses = { error: 'danger', success: 'success', warning: 'warning' } as const;

    for (const [validationStatus, role] of Object.entries(statuses)) {
      await setProps({ validationStatus });
      await waitForStable(root);
      await waitForTransitions(root);

      expect(computedStyle('bq-input >>> [part="control"]', ['borderTopColor']).borderTopColor).toBe(
        resolveColorToken(`--bq-stroke--${role}`),
      );
      expect(computedStyle('bq-input >>> [part="helper-text"]', ['color']).color).toBe(
        resolveColorToken(`--bq-text--${role}`),
      );
    }
  });

  it('should allow overriding the validation color variables', async () => {
    const { root } = await render(
      <bq-input
        name="bq-input"
        validationStatus="error"
        style={{
          '--bq-input--border-color-danger': 'rgb(1, 2, 3)',
          '--bq-input--helper-text-color-danger': 'rgb(4, 5, 6)',
        }}
      >
        <span slot="helper-text">Helper text</span>
      </bq-input>,
    );

    await waitForStable(root);
    await waitForTransitions(root);

    expect(computedStyle('bq-input >>> [part="control"]', ['borderTopColor']).borderTopColor).toBe('rgb(1, 2, 3)');
    expect(computedStyle('bq-input >>> [part="helper-text"]', ['color']).color).toBe('rgb(4, 5, 6)');
  });
});

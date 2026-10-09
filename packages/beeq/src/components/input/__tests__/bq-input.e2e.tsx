import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getInput = (el: HTMLBqInputElement) => el.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');
const getClearButton = (el: HTMLBqInputElement) =>
  el.shadowRoot?.querySelector<HTMLBqButtonElement>('[part="clear-btn"]');

afterEach(() => {
  vi.restoreAllMocks();
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
    expect(prefixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with suffix icon', async () => {
    const { root } = await render(
      <bq-input name="bq-input">
        <bq-icon name="gear" slot="suffix"></bq-icon>
      </bq-input>,
    );

    const suffixContainerElem = root?.shadowRoot?.querySelector('.bq-input--control__suffix');
    expect(suffixContainerElem).not.toHaveClass('hidden');
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
    expect(labelContainerElem).not.toHaveClass('hidden');
  });

  it('should render with helper content', async () => {
    const { root } = await render(
      <bq-input name="bq-input">
        <span slot="helper-text">Helper text</span>
      </bq-input>,
    );

    const helperContainerElem = root?.shadowRoot?.querySelector('.bq-input--helper-text');
    expect(helperContainerElem).not.toHaveClass('hidden');
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
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input name="bq-input"></bq-input>);
    const bqInput = root as HTMLBqInputElement;

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    const bqInputEvent = spyOnEvent('bqInput');

    nativeInput?.blur();
    await waitForChanges();

    for (const char of inputValue) {
      await userEvent.type(nativeInput, char);
      await waitForChanges();
    }

    expect(bqInput.value).toBe(inputValue);
    expect(bqInputEvent).toHaveReceivedEventTimes(inputValue.length);
  });

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
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-input name="bq-input" debounce-time={DEBOUNCE_TIME} />,
    );

    const bqInput = spyOnEvent('bqInput');
    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');

    await userEvent.type(nativeInput, 'abc');

    // Let the real debounce timer settle
    await new Promise((resolve) => setTimeout(resolve, DEBOUNCE_TIME + 20));
    await waitForChanges();

    // After the debounce settles, the event fires exactly once for the entire typing sequence
    expect(bqInput).toHaveReceivedEventTimes(1);
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
});

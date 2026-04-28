import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

describe('bq-input', () => {
  it('should render', async () => {
    const { root } = await render(<bq-input name="bq-input" />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-input name="bq-input" />);
    expect(root.shadowRoot).not.toBeNull();
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

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    const bqChange = spyOnEvent('bqChange');

    await userEvent.type(nativeInput, inputValue);
    nativeInput?.blur();
    await waitForChanges();

    expect((root as HTMLBqInputElement).value).toBe(inputValue);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should write and emit input event', async () => {
    const inputValue = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input name="bq-input"></bq-input>);

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    const bqInput = spyOnEvent('bqInput');

    nativeInput?.blur();
    await waitForChanges();

    for (const char of inputValue) {
      await userEvent.type(nativeInput, char);
      await waitForChanges();
    }

    expect((root as HTMLBqInputElement).value).toBe(inputValue);
    expect(bqInput).toHaveReceivedEventTimes(inputValue.length);
  });

  it('should clear the value and emit clear event', async () => {
    const inputValue = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-input name="bq-input" value={`${inputValue}`}></bq-input>,
    );

    const bqClear = spyOnEvent('bqClear');

    const nativeInput = root.shadowRoot?.querySelector<HTMLInputElement>('.bq-input--control__input');
    expect((root as HTMLBqInputElement).value).toBe(inputValue);

    nativeInput?.focus();
    await waitForChanges();

    const clearBtnElem = root.shadowRoot?.querySelector('.bq-input--control__clear');
    await userEvent.click(clearBtnElem);

    expect(bqClear).toHaveReceivedEventTimes(1);
    expect((root as HTMLBqInputElement).value).toEqual('');
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
});

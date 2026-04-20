import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

describe('bq-input', () => {
  it('should render', async () => {
    const { root } = await render(<bq-input />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-input />);
    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render with prefix icon', async () => {
    const { root } = await render(
      <bq-input>
        <bq-icon name="user-circle" slot="prefix"></bq-icon>
      </bq-input>,
    );

    const prefixContainerElem = root?.shadowRoot?.querySelector('.bq-input--control__prefix');
    expect(prefixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with suffix icon', async () => {
    const { root } = await render(
      <bq-input>
        <bq-icon name="gear" slot="suffix"></bq-icon>
      </bq-input>,
    );

    const suffixContainerElem = root?.shadowRoot?.querySelector('.bq-input--control__suffix');
    expect(suffixContainerElem).not.toHaveClass('hidden');
  });

  it('should render with label content', async () => {
    const { root } = await render(
      <bq-input>
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
      <bq-input>
        <span slot="helper-text">Helper text</span>
      </bq-input>,
    );

    const helperContainerElem = root?.shadowRoot?.querySelector('.bq-input--helper-text');
    expect(helperContainerElem).not.toHaveClass('hidden');
  });

  it('should write and emit change event', async () => {
    const inputValue = 'Hello';

    const { root, spyOnEvent, waitForChanges } = await render(<bq-input></bq-input>);

    const nativeInputSelector = root.shadowRoot?.querySelector('.bq-input--control__input');
    const bqChange = spyOnEvent('bqChange');

    await userEvent.type(nativeInputSelector, inputValue, { delay: 100 });
    await nativeInputSelector.blur();
    await waitForChanges();

    expect(root.value).toBe(inputValue);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should write and emit input event', async () => {
    const inputValue = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input></bq-input>);

    const nativeInputSelector = root.shadowRoot?.querySelector('.bq-input--control__input');
    const bqInput = spyOnEvent('bqInput');

    await nativeInputSelector.blur();
    await waitForChanges();

    for (const char of inputValue) {
      await userEvent.type(nativeInputSelector, char);
      await waitForChanges();
    }

    expect(root.value).toBe(inputValue);
    expect(bqInput).toHaveReceivedEventTimes(inputValue.length);
  });

  it('should clear the value and emit clear event', async () => {
    const inputValue = 'Hello';
    const { root, spyOnEvent, waitForChanges } = await render(<bq-input value={`${inputValue}`}></bq-input>);

    const bqClear = await spyOnEvent('bqClear');

    const nativeInputElem = root.shadowRoot?.querySelector('.bq-input--control__input');
    expect(root.value).toBe(inputValue);

    await nativeInputElem.focus();
    await waitForChanges();

    const clearBtnElem = root.shadowRoot?.querySelector('.bq-input--control__clear');
    await userEvent.click(clearBtnElem);

    expect(bqClear).toHaveReceivedEventTimes(1);
    expect(root.value).toEqual('');
  });
});

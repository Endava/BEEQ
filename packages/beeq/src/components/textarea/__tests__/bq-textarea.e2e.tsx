import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

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

    expect(labelContainer).not.toHaveClass('!hidden');
  });

  it('should render with helper text', async () => {
    const { root } = await render(
      <bq-textarea name="textarea" placeholder="Placeholder...">
        <span slot="helper-text">Helper text</span>
      </bq-textarea>,
    );
    const helperContainer = root.shadowRoot.querySelector('.bq-textarea__helper');

    expect(helperContainer).not.toHaveClass('!hidden');
  });

  it('should render with maxlength counter', async () => {
    const { root } = await render(<bq-textarea maxlength={100} name="textarea" placeholder="Placeholder..." />);
    const counterElem = root.shadowRoot.querySelector('.bq-textarea__helper--counter');

    expect(counterElem).not.toHaveClass('!hidden');
  });

  it('should hide helper content if no helper text and no maxlength', async () => {
    const { root } = await render(<bq-textarea name="textarea" placeholder="Placeholder..." />);
    const helperContainer = root.shadowRoot.querySelector('.bq-textarea__helper');

    expect(helperContainer).toHaveClass('!hidden');
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

    // Type one character at a time and wait for changes between each keystroke.
    // debounceTime defaults to 0ms — rapid typing cancels the previous debounce before
    // it fires. Waiting after each character lets the 0ms setTimeout resolve, matching
    // the per-keystroke timing expected by this interaction test.
    for (const char of value) {
      await userEvent.type(nativeTextarea, char);
      await waitForChanges();
    }

    expect((root as HTMLBqTextareaElement).value).toBe(value);
    expect(bqInput).toHaveReceivedEventTimes(value.length);
  });

  it('should show and count all characters', async () => {
    const value = 'Hello';
    const maxlength = 100;
    const { root, setProps } = await render(
      <bq-textarea maxlength={maxlength} name="textarea" placeholder="Placeholder..." />,
    );
    const counterElem = root.shadowRoot.querySelector<HTMLElement>('.bq-textarea__helper--counter');

    await setProps({ value });

    expect(counterElem.innerText).toBe(`${value.length}/${maxlength}`);
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

    expect(counterElem.innerText).toBe(`${value.length}/${maxlength}`);
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
    expect(counterElem.innerText).toBe(`${nextValue.length}/${maxlength}`);

    textareaElem.value = '';
    await waitForChanges();

    expect(nativeTextarea.value).toBe('');
    expect(counterElem.innerText).toBe(`0/${maxlength}`);
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

  it('should apply resize-none class when disable-resize is set', async () => {
    const { root } = await render(<bq-textarea disable-resize name="textarea" placeholder="Placeholder..." />);
    const nativeTextarea = root.shadowRoot.querySelector('.bq-textarea__input');

    expect(nativeTextarea).toHaveClass('resize-none');
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
});

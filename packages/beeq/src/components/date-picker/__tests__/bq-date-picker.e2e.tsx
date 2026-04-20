import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const CALLY_SCRIPT_ATTRIBUTE = 'data-cally-library';

const getDatePickerInput = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');

const getDropdownPanel = (datePicker: HTMLBqDatePickerElement) => {
  const dropdown = datePicker.shadowRoot?.querySelector<HTMLBqDropdownElement>('.bq-date-picker__dropdown');

  return dropdown.shadowRoot?.querySelector<HTMLElement>('.bq-dropdown__panel');
};

const getClearButton = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLBqButtonElement | null>('[part="clear-btn"]');

beforeEach(() => {
  // The date picker checks for the Cally library presence using `document.querySelector`.
  // A script tag with the marker attribute satisfies the guard without loading the actual library.
  const script = document.createElement('script');
  script.setAttribute(CALLY_SCRIPT_ATTRIBUTE, '');
  document.head.appendChild(script);
});

afterEach(() => {
  document.querySelectorAll(`script[${CALLY_SCRIPT_ATTRIBUTE}]`).forEach((script) => {
    script.remove();
  });
  vi.restoreAllMocks();
});

describe('bq-date-picker', () => {
  it('should render', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render with date picker panel opened', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" open />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    const selectPanelElem = getDropdownPanel(datePicker);

    expect(selectPanelElem).toHaveAttribute('open');
  });

  it('should render single type of date picker', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" open type="single" />);

    await waitForStable(root);

    const calendarDefaultElement = root.shadowRoot?.querySelector('calendar-date');

    expect(calendarDefaultElement).not.toBeNull();
  });

  it('should render range type of date picker', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" open type="range" />);

    await waitForStable(root);

    const calendarRangeElement = root.shadowRoot?.querySelector('calendar-range');

    expect(calendarRangeElement).not.toBeNull();
  });

  it('should render multi type of date picker', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" open type="multi" />);

    await waitForStable(root);

    const calendarMultiElement = root.shadowRoot?.querySelector('calendar-multi');

    expect(calendarMultiElement).not.toBeNull();
  });

  it('should render multiple months for range type of date picker', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" open type="range" months={4} />);

    await waitForStable(root);

    const calendarMonthElement = root.shadowRoot?.querySelectorAll('calendar-month');

    expect(calendarMonthElement).toHaveLength(4);
  });

  it('should clamp input value to min when below range', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" max="2024-05-30" min="2024-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    const input = getDatePickerInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2024-05-10');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2024-05-20');
  });

  it('should clamp input value to max when above range', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" max="2024-05-30" min="2024-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    const input = getDatePickerInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2024-06-10');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2024-05-30');
  });

  it('should clear the selected value through the public method', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" type="single" value="2024-05-25" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    const bqClear = spyOnEvent('bqClear');

    await datePicker.clear();
    await waitForChanges();

    expect(datePicker.value).toBeUndefined();
    expect(getDatePickerInput(datePicker).value).toBe('');
    expect(bqClear).toHaveReceivedEventTimes(1);
  });

  it('should emit focus and blur events from the input', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getDatePickerInput(datePicker);

    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should emit change events when the input value changes', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    const bqChange = spyOnEvent('bqChange');
    const input = getDatePickerInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2024-05-21');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2024-05-21');
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqChange.events[0].detail.value).toBe('2024-05-21');
  });

  it('should not show the clear button when disableClear is set', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" disableClear type="single" value="2024-05-25" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getClearButton(datePicker)).toBeNull();
  });

  it('should apply validation status classes and aria-invalid', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" type="single" validationStatus="error" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    const control = root.shadowRoot?.querySelector('[part="control"]');
    const input = getDatePickerInput(datePicker);

    expect(control?.classList.contains('validation-error')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should handle invalid type values', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="range" />);
    const datePicker = root as HTMLBqDatePickerElement;

    datePicker.type = 'invalid' as HTMLBqDatePickerElement['type'];
    await waitForChanges();

    expect(datePicker.type).toBe('single');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-DATE-PICKER] Please notice that "type" should be one of single|multi|range',
    );
  });

  it('should guard focus, blur, change, and clear when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" disabled type="single" value="2024-05-25" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqChange = spyOnEvent('bqChange');
    const bqClear = spyOnEvent('bqClear');
    const input = getDatePickerInput(datePicker);

    input.dispatchEvent(new Event('focus'));
    input.dispatchEvent(new Event('blur'));
    input.value = '2024-05-30';
    input.dispatchEvent(new Event('change'));
    await datePicker.clear();
    await waitForChanges();

    expect(datePicker.value).toBe('2024-05-25');
    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqClear).toHaveReceivedEventTimes(0);
  });
});

import { h } from '@stencil/core';
import { afterEach, beforeEach, describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const CALLY_SCRIPT_ATTRIBUTE = 'data-cally-library';

const getDatePickerInput = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector('[part="input"]') as HTMLInputElement;

const getDropdownPanel = (datePicker: HTMLBqDatePickerElement) => {
  const dropdown = datePicker.shadowRoot?.querySelector('.bq-date-picker__dropdown') as HTMLBqDropdownElement;

  return dropdown.shadowRoot?.querySelector('.bq-dropdown__panel') as HTMLElement;
};

beforeEach(() => {
  const script = document.createElement('script');
  script.setAttribute(CALLY_SCRIPT_ATTRIBUTE, '');
  document.head.appendChild(script);
});

afterEach(() => {
  document.querySelectorAll(`script[${CALLY_SCRIPT_ATTRIBUTE}]`).forEach((script) => {
    script.remove();
  });
});

describe('bq-date-picker', () => {
  it('should render', async () => {
    const { root } = await render(<bq-date-picker />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-date-picker />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render with date picker panel opened', async () => {
    const { root } = await render(<bq-date-picker open />);

    await waitForStable(root);

    const selectPanelElem = getDropdownPanel(root);

    expect(selectPanelElem).toHaveAttribute('open');
  });

  it('should render single type of date picker', async () => {
    const { root } = await render(<bq-date-picker open type="single" />);

    await waitForStable(root);

    const calendarDefaultElement = root.shadowRoot?.querySelector('calendar-date');

    expect(calendarDefaultElement).not.toBeNull();
  });

  it('should render range type of date picker', async () => {
    const { root } = await render(<bq-date-picker open type="range" />);

    await waitForStable(root);

    const calendarRangeElement = root.shadowRoot?.querySelector('calendar-range');

    expect(calendarRangeElement).not.toBeNull();
  });

  it('should render multi type of date picker', async () => {
    const { root } = await render(<bq-date-picker open type="multi" />);

    await waitForStable(root);

    const calendarMultiElement = root.shadowRoot?.querySelector('calendar-multi');

    expect(calendarMultiElement).not.toBeNull();
  });

  it('should render multiple months for range type of date picker', async () => {
    const { root } = await render(<bq-date-picker open type="range" months={4} />);

    await waitForStable(root);

    const calendarMonthElement = root.shadowRoot?.querySelectorAll('calendar-month');

    expect(calendarMonthElement).toHaveLength(4);
  });

  it('should clamp input value to min when below range', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker max="2024-05-30" min="2024-05-20" type="single" />);

    const input = getDatePickerInput(root);

    await userEvent.clear(input);
    await userEvent.type(input, '2024-05-10');
    await userEvent.tab();
    await waitForChanges();

    expect(root.value).toBe('2024-05-20');
  });

  it('should clamp input value to max when above range', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker max="2024-05-30" min="2024-05-20" type="single" />);

    const input = getDatePickerInput(root);

    await userEvent.clear(input);
    await userEvent.type(input, '2024-06-10');
    await userEvent.tab();
    await waitForChanges();

    expect(root.value).toBe('2024-05-30');
  });

  it('should clear the selected value through the public method', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker type="single" value="2024-05-25" />);

    const bqClear = spyOnEvent('bqClear');

    await root.clear();
    await waitForChanges();

    expect(root.value).toBeUndefined();
    expect(getDatePickerInput(root).value).toBe('');
    expect(bqClear).toHaveReceivedEventTimes(1);
  });
});

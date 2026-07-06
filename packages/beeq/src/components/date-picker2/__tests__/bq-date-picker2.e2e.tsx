import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getInput = (datePicker: HTMLBqDatePicker2Element) =>
  datePicker.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');

const getDropdownPanel = (datePicker: HTMLBqDatePicker2Element) => {
  const dropdown = datePicker.shadowRoot?.querySelector<HTMLBqDropdownElement>('.bq-date-picker2__dropdown');
  return dropdown?.shadowRoot?.querySelector<HTMLElement>('.bq-dropdown__panel');
};

const getClearButton = (datePicker: HTMLBqDatePicker2Element) =>
  datePicker.shadowRoot?.querySelector<HTMLBqButtonElement | null>('[part="clear-btn"]');

const getHeaderTitle = (datePicker: HTMLBqDatePicker2Element) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>('[part~="calendar__heading"]');

const getPrevButton = (datePicker: HTMLBqDatePicker2Element) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>('[part~="calendar__previous"]');

const getNextButton = (datePicker: HTMLBqDatePicker2Element) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>('[part~="calendar__next"]');

const getDayButton = (datePicker: HTMLBqDatePicker2Element, iso: string) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`);

const getMonthButton = (datePicker: HTMLBqDatePicker2Element, month: number) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>(`[data-month="${month}"]`);

const getYearButton = (datePicker: HTMLBqDatePicker2Element, year: number) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>(`[data-year="${year}"]`);

const getGrid = (datePicker: HTMLBqDatePicker2Element) =>
  datePicker.shadowRoot?.querySelector<HTMLElement>('[role="grid"]');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-date-picker2', () => {
  it('should render', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" />);

    expect(root).toHaveShadowRoot();
  });

  it('should render with panel opened when `open` is set initially', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" open />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getDropdownPanel(datePicker)).toHaveAttribute('open');
  });

  it('should reflect a single ISO value into the display input', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" type="single" value="2026-05-30" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getInput(datePicker)?.value).not.toBe('');
    expect(datePicker.value).toBe('2026-05-30');
  });

  it('should drop invalid tokens and normalize the public value', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker2 name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    datePicker.value = '2026-99-99';
    await waitForChanges();

    expect(datePicker.value).toBeUndefined();
  });

  it('should clear the selected value through the public `clear()` method', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" type="single" value="2026-05-25" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;
    const bqClear = spyOnEvent('bqClear');

    await datePicker.clear();
    await waitForChanges();

    expect(datePicker.value).toBeUndefined();
    expect(getInput(datePicker)?.value).toBe('');
    expect(bqClear).toHaveReceivedEventTimes(1);
  });

  it('should not render the clear button when `disable-clear` is set', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" disableClear type="single" value="2026-05-25" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getClearButton(datePicker)).toBeNull();
  });

  it('should emit focus and blur events from the input', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker2 name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePicker2Element;
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const input = getInput(datePicker);

    input?.dispatchEvent(new Event('focus'));
    input?.dispatchEvent(new Event('blur'));
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should emit `bqChange` when the input value changes', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker2 name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePicker2Element;
    const bqChange = spyOnEvent('bqChange');
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2026-05-21');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-21');
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqChange.events[0].detail.value).toBe('2026-05-21');
  });

  it('should clamp the input value to `min` when below range', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" max="2026-05-30" min="2026-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2026-05-10');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
  });

  it('should clamp the input value to `max` when above range', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" max="2026-05-30" min="2026-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2026-06-10');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-30');
  });

  it('should apply validation status classes and aria-invalid', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" type="single" validationStatus="error" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    const control = root.shadowRoot?.querySelector('[part="control"]');
    const input = getInput(datePicker);

    expect(control).toHaveClass('validation-error');
    expect(input).toEqualAttribute('aria-invalid', 'true');
  });

  it('should warn and fall back to the default for invalid enum props', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-date-picker2 name="date-picker" type="range" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await setProps({ type: 'invalid' });

    expect(datePicker.type).toBe('single');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should guard focus, blur, change, and clear when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" disabled type="single" value="2026-05-25" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const bqChange = spyOnEvent('bqChange');
    const bqClear = spyOnEvent('bqClear');
    const input = getInput(datePicker);

    input?.dispatchEvent(new Event('focus'));
    input?.dispatchEvent(new Event('blur'));
    if (input) input.value = '2026-05-30';
    input?.dispatchEvent(new Event('change'));
    await datePicker.clear();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-25');
    expect(bqFocus).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(0);
    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(bqClear).toHaveReceivedEventTimes(0);
  });

  it('should render a single day-view grid by default', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.querySelectorAll('[role="grid"]')).toHaveLength(1);
  });

  it('should render multiple day-view grids when `months` is > 1', async () => {
    const { root } = await render(
      <bq-date-picker2 name="date-picker" open months={2} monthsPerView="multiple" type="range" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.querySelectorAll('[role="grid"]')).toHaveLength(2);
  });

  it('should give the day-view grid a localized "Month Year" aria-label', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" locale="en-GB" open value="2026-07-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getGrid(datePicker)).toEqualAttribute('aria-label', 'July 2026');
  });

  it('should open on the `initialView` when the panel becomes visible', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" initialView="months" open value="2026-07-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getMonthButton(datePicker, 6)).not.toBeNull();
  });

  it('should switch to the months view when the header title is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;
    const bqViewChange = spyOnEvent('bqViewChange');

    await waitForStable(root);
    getHeaderTitle(datePicker)?.click();
    await waitForChanges();

    expect(getMonthButton(datePicker, 4)).not.toBeNull();
    expect(bqViewChange).toHaveReceivedEventTimes(1);
    expect(bqViewChange.events[0].detail.view).toBe('months');
  });

  it('should switch to the years view from the months view', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" initialView="months" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    getHeaderTitle(datePicker)?.click();
    await waitForChanges();

    expect(getYearButton(datePicker, 2026)).not.toBeNull();
  });

  it('should select a date when a day cell is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;
    const bqChange = spyOnEvent('bqChange');

    await waitForStable(root);
    getDayButton(datePicker, '2026-05-20')?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should toggle selections in `multi` type', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" open type="multi" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    getDayButton(datePicker, '2026-05-20')?.click();
    await waitForChanges();

    expect(datePicker.value?.split(/\s+/).sort()).toEqual(['2026-05-15', '2026-05-20']);

    getDayButton(datePicker, '2026-05-15')?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
  });

  it('should build a range across two clicks in `range` type', async () => {
    // Anchor the picker on May 2026 via an initial single-date range; clicking
    // the fresh start/end below replaces it with the new range.
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" open type="range" value="2026-05-10/2026-05-10" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    // First click starts a fresh range (previous full range is discarded).
    getDayButton(datePicker, '2026-05-15')?.click();
    await waitForChanges();
    getDayButton(datePicker, '2026-05-20')?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-15/2026-05-20');
  });

  it('should move to the previous month when the previous button is clicked', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" locale="en-GB" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    getPrevButton(datePicker)?.click();
    await waitForChanges();

    expect(getGrid(datePicker)).toEqualAttribute('aria-label', 'April 2026');
  });

  it('should move to the next month when the next button is clicked', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" locale="en-GB" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    getNextButton(datePicker)?.click();
    await waitForChanges();

    expect(getGrid(datePicker)).toEqualAttribute('aria-label', 'June 2026');
  });

  it('should mark days outside the min/max bounds as aria-disabled', async () => {
    const { root } = await render(
      <bq-date-picker2 name="date-picker" min="2026-05-10" max="2026-05-20" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getDayButton(datePicker, '2026-05-05')).toEqualAttribute('aria-disabled', 'true');
    expect(getDayButton(datePicker, '2026-05-25')).toEqualAttribute('aria-disabled', 'true');
    expect(getDayButton(datePicker, '2026-05-15')).not.toHaveAttribute('aria-disabled');
  });

  it('should restore the initial value on form reset', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-date-picker2 name="date-picker" type="single" value="2026-05-15" />
      </form>,
    );
    const form = root as HTMLFormElement;
    const datePicker = form.querySelector<HTMLBqDatePicker2Element>('bq-date-picker2');

    datePicker.value = '2026-06-01';
    await waitForChanges();
    expect(datePicker.value).toBe('2026-06-01');

    form.reset();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-15');
  });

  it('should focus the input when `autofocus` is set', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" autofocus />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.activeElement).toBe(getInput(datePicker));
  });

  it('should wire ARIA relationships between input and popup', async () => {
    const { root } = await render(<bq-date-picker2 name="my-picker" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    const input = getInput(datePicker);
    const popup = datePicker.shadowRoot?.querySelector<HTMLElement>('[role="dialog"]');
    const controlsId = input?.getAttribute('aria-controls');

    expect(input).toEqualAttribute('aria-haspopup', 'dialog');
    expect(controlsId).toBeTruthy();
    expect(popup?.id).toBe(controlsId);
  });
});

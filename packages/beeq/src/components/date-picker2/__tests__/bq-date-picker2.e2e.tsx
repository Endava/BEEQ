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
      <bq-date-picker2 name="date-picker" open months={2} monthsPerView="months" type="range" value="2026-05-15" />,
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

  /* ------------------------------- Slots -------------------------------- */

  it('should reveal the label wrapper when the `label` slot has content', async () => {
    const { root } = await render(
      <bq-date-picker2 name="date-picker">
        <span slot="label">Pick a date</span>
      </bq-date-picker2>,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    const label = datePicker.shadowRoot?.querySelector<HTMLElement>('[part="label"]');

    expect(label).not.toHaveClass('is-hidden');
    expect(datePicker.textContent).toContain('Pick a date');
  });

  it('should reveal the prefix wrapper when the `prefix` slot has content', async () => {
    const { root } = await render(
      <bq-date-picker2 name="date-picker">
        <bq-icon slot="prefix" name="calendar" />
      </bq-date-picker2>,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    const prefix = datePicker.shadowRoot?.querySelector<HTMLElement>('[part="prefix"]');

    expect(prefix).not.toHaveClass('is-hidden');
  });

  it('should render slotted `suffix` content in place of the default calendar icon', async () => {
    const { root } = await render(
      <bq-date-picker2 name="date-picker">
        <span slot="suffix" data-testid="custom-suffix">
          !
        </span>
      </bq-date-picker2>,
    );

    await waitForStable(root);

    expect(root.querySelector('[data-testid="custom-suffix"]')).not.toBeNull();
  });

  it('should render slotted `clear-icon` content inside the clear button', async () => {
    const { root } = await render(
      <bq-date-picker2 name="date-picker" type="single" value="2026-05-25">
        <span slot="clear-icon" data-testid="custom-clear">
          ×
        </span>
      </bq-date-picker2>,
    );

    await waitForStable(root);

    expect(root.querySelector('[data-testid="custom-clear"]')).not.toBeNull();
  });

  it('should hide the label wrapper when the `label` slot is empty', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.querySelector('[part="label"]')).toHaveClass('is-hidden');
  });

  /* ---------------------------- isDateDisallowed ---------------------------- */

  it('should mark disallowed dates as aria-disabled via `isDateDisallowed`', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker2 name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;
    // Predicate must be assigned as a property (functions cannot be attributes).
    datePicker.isDateDisallowed = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
    await waitForChanges();
    await waitForStable(root);

    // 2026-05-16 is a Saturday, 2026-05-17 a Sunday, 2026-05-18 a Monday.
    expect(getDayButton(datePicker, '2026-05-16')).toEqualAttribute('aria-disabled', 'true');
    expect(getDayButton(datePicker, '2026-05-17')).toEqualAttribute('aria-disabled', 'true');
    expect(getDayButton(datePicker, '2026-05-18')).not.toHaveAttribute('aria-disabled');
  });

  it('should not select a disallowed date on click', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;
    datePicker.isDateDisallowed = (date: Date) => date.getDate() === 20;
    const bqChange = spyOnEvent('bqChange');
    await waitForChanges();
    await waitForStable(root);

    getDayButton(datePicker, '2026-05-20')?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-15');
    expect(bqChange).toHaveReceivedEventTimes(0);
  });

  /* --------------------------- Keyboard navigation --------------------------- */

  it('should move the focused day with ArrowRight', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker2 name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await waitForChanges();

    expect(datePicker.shadowRoot?.querySelector('[data-iso="2026-05-16"][tabindex="0"]')).not.toBeNull();
  });

  it('should move the focused day one week down with ArrowDown', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker2 name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitForChanges();

    expect(datePicker.shadowRoot?.querySelector('[data-iso="2026-05-22"][tabindex="0"]')).not.toBeNull();
  });

  it('should select the focused day with Enter', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;
    const bqChange = spyOnEvent('bqChange');

    await waitForStable(root);
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await waitForChanges();
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-16');
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should close the popup and clear `open` on Escape', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker2 name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(datePicker.open).toBe(false);
  });

  /* ------------------------- Full drill-in flow ------------------------- */

  it('should walk years -> months -> days when selecting through each view', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" initialView="years" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    // years view: pick 2028
    getYearButton(datePicker, 2028)?.click();
    await waitForChanges();

    // months view: pick March (index 2)
    expect(getMonthButton(datePicker, 2)).not.toBeNull();
    getMonthButton(datePicker, 2)?.click();
    await waitForChanges();

    // days view: value stays until a day is clicked, but the viewDate should
    // now show March 2028.
    expect(getGrid(datePicker)).toEqualAttribute('aria-label', 'March 2028');
  });

  /* ------------------------------ Required ------------------------------ */

  it('should block form submission when `required` and no value is set', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-date-picker2 name="date-picker" required />
        <button type="submit">Submit</button>
      </form>,
    );
    const form = root as HTMLFormElement;
    const submitSpy = vi.fn((ev: Event) => ev.preventDefault());
    form.addEventListener('submit', submitSpy);

    await waitForChanges();
    form.requestSubmit();
    await waitForChanges();

    expect(submitSpy).not.toHaveBeenCalled();
  });

  it('should allow form submission when `required` is satisfied', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-date-picker2 name="date-picker" required value="2026-05-15" />
        <button type="submit">Submit</button>
      </form>,
    );
    const form = root as HTMLFormElement;
    const submitSpy = vi.fn((ev: Event) => ev.preventDefault());
    form.addEventListener('submit', submitSpy);

    await waitForChanges();
    form.requestSubmit();
    await waitForChanges();

    expect(submitSpy).toHaveBeenCalledTimes(1);
  });

  /* ---------------------------- Prop passthrough ---------------------------- */

  it('should clamp `months` to the maximum panel count', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker2 name="date-picker" months={5} monthsPerView="multiple" type="range" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForChanges();

    expect(datePicker.months).toBe(2);
    expect(datePicker).toEqualAttribute('months', '2');
  });

  it('should apply `clearButtonLabel` to the clear button', async () => {
    const { root } = await render(
      <bq-date-picker2 name="date-picker" clearButtonLabel="Reset date" type="single" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getClearButton(datePicker)).toEqualAttribute('label', 'Reset date');
  });

  it('should apply `placeholder` to the input', async () => {
    const { root } = await render(<bq-date-picker2 name="date-picker" placeholder="DD/MM/YYYY" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);

    expect(getInput(datePicker)).toEqualAttribute('placeholder', 'DD/MM/YYYY');
  });

  it('should reorder weekday headers when `firstDayOfWeek` changes', async () => {
    const { root, setProps } = await render(
      <bq-date-picker2 name="date-picker" firstDayOfWeek={1} locale="en-GB" open />,
    );
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    const initial = Array.from(datePicker.shadowRoot?.querySelectorAll('[part~="calendar__th"]') ?? []).map((el) =>
      el.textContent?.trim(),
    );
    expect(initial[0]).toBe('Mon');

    await setProps({ firstDayOfWeek: 0 });
    await waitForStable(root);
    const swapped = Array.from(datePicker.shadowRoot?.querySelectorAll('[part~="calendar__th"]') ?? []).map((el) =>
      el.textContent?.trim(),
    );
    expect(swapped[0]).toBe('Sun');
  });

  it('should hide outside-month days by default and reveal them with `showOutsideDays`', async () => {
    const { root, setProps } = await render(<bq-date-picker2 name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePicker2Element;

    await waitForStable(root);
    // 2026-04-27 is a Monday in the trailing week of April rendered by May's grid.
    const outsideDay = getDayButton(datePicker, '2026-04-27');
    expect(outsideDay).toHaveClass('is-outside');
    expect(outsideDay).toHaveClass('is-hidden');

    await setProps({ showOutsideDays: true });
    await waitForStable(root);
    expect(getDayButton(datePicker, '2026-04-27')).not.toHaveClass('is-hidden');
  });
});

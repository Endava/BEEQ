import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getInput = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');

const getDropdownPanel = (datePicker: HTMLBqDatePickerElement) => {
  const dropdown = datePicker.shadowRoot?.querySelector<HTMLBqDropdownElement>('.bq-date-picker__dropdown');
  return dropdown?.shadowRoot?.querySelector<HTMLElement>('.bq-dropdown__panel');
};

const getClearButton = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLBqButtonElement | null>('[part="clear-btn"]');

const getHeaderTitle = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLBqButtonElement>('[part~="calendar__heading"]');

const getHeaderTitleInnerButton = (datePicker: HTMLBqDatePickerElement) =>
  getHeaderTitle(datePicker)?.shadowRoot?.querySelector<HTMLButtonElement>('button');

const getPrevButton = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot
    ?.querySelector<HTMLBqButtonElement>('[part~="calendar__previous"]')
    ?.shadowRoot?.querySelector<HTMLButtonElement>('button');

const getNextButton = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot
    ?.querySelector<HTMLBqButtonElement>('[part~="calendar__next"]')
    ?.shadowRoot?.querySelector<HTMLButtonElement>('button');

const getDayButton = (datePicker: HTMLBqDatePickerElement, iso: string) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>(`[data-iso="${iso}"]`);

const getMonthButton = (datePicker: HTMLBqDatePickerElement, month: number) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>(`[data-month="${month}"]`);

const getYearButton = (datePicker: HTMLBqDatePickerElement, year: number) =>
  datePicker.shadowRoot?.querySelector<HTMLButtonElement>(`[data-year="${year}"]`);

const getGrid = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLElement>('[role="grid"]');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-date-picker', () => {
  it('should render', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" />);

    expect(root).toHaveShadowRoot();
  });

  it('should render with panel opened when `open` is set initially', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" open />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getDropdownPanel(datePicker)).toHaveAttribute('open');
    expect(getInput(datePicker)).toEqualAttribute('aria-expanded', 'true');
  });

  it('should reflect popup state through `aria-expanded`', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-date-picker name="date-picker" />);
    const datePicker = root as HTMLBqDatePickerElement;

    expect(getInput(datePicker)).toEqualAttribute('aria-expanded', 'false');

    await setProps({ open: true });
    await waitForChanges();
    await waitForStable(root);

    expect(getInput(datePicker)).toEqualAttribute('aria-expanded', 'true');
  });

  it('should reflect a single ISO value into the display input', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" type="single" value="2026-05-30" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getInput(datePicker)?.value).not.toBe('');
    expect(datePicker.value).toBe('2026-05-30');
  });

  it('should drop invalid tokens and normalize the public value', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    datePicker.value = '2026-99-99';
    await waitForChanges();

    expect(datePicker.value).toBeUndefined();
  });

  it('should clear the selected value through the public `clear()` method', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" type="single" value="2026-05-25" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqClear = spyOnEvent('bqClear');

    await datePicker.clear();
    await waitForChanges();

    expect(datePicker.value).toBeUndefined();
    expect(getInput(datePicker)?.value).toBe('');
    expect(bqClear).toHaveReceivedEventTimes(1);
  });

  it('should not render the clear button when `disable-clear` is set', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" disableClear type="single" value="2026-05-25" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getClearButton(datePicker)).toBeNull();
  });

  it('should emit focus and blur events from the input', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
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
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
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
      <bq-date-picker name="date-picker" max="2026-05-30" min="2026-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2026-05-10');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
  });

  it('should clamp the input value to `max` when above range', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" max="2026-05-30" min="2026-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2026-06-10');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-30');
  });

  it('should apply validation status classes and aria-invalid', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" type="single" validationStatus="error" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    const control = root.shadowRoot?.querySelector('[part="control"]');
    const input = getInput(datePicker);

    expect(control).toHaveClass('validation-error');
    expect(input).toEqualAttribute('aria-invalid', 'true');
  });

  it('should warn and fall back to the default for invalid enum props', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-date-picker name="date-picker" type="range" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await setProps({ type: 'invalid' });

    expect(datePicker.type).toBe('single');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('should guard focus, blur, change, and clear when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" disabled type="single" value="2026-05-25" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

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
    const { root } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.querySelectorAll('[role="grid"]')).toHaveLength(1);
  });

  it('should render multiple day-view grids when `months` is > 1', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker" open months={2} monthsPerView="months" type="range" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.querySelectorAll('[role="grid"]')).toHaveLength(2);
  });

  it('should give the day-view grid a localized "Month Year" aria-label', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" locale="en-GB" open value="2026-07-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getGrid(datePicker)).toEqualAttribute('aria-label', 'July 2026');
  });

  it('should open on the `initialView` when the panel becomes visible', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" initialView="months" open value="2026-07-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getMonthButton(datePicker, 6)).not.toBeNull();
  });

  it('should switch to the months view when the header title is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqViewChange = spyOnEvent('bqViewChange');

    await waitForStable(root);
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();

    expect(getMonthButton(datePicker, 4)).not.toBeNull();
    expect(bqViewChange).toHaveReceivedEventTimes(1);
    expect(bqViewChange.events[0].detail.view).toBe('months');
  });

  it('should switch to the years view from the months view', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" initialView="months" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();

    expect(getYearButton(datePicker, 2026)).not.toBeNull();
  });

  it('should cycle back from the years view to the days view (day precision)', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" initialView="years" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();

    expect(getDayButton(datePicker, '2026-05-15')).not.toBeNull();
  });

  it('should cycle back from the years view to the months view (month precision)', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" open value="2026-05" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);
    // months → years
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();
    expect(getYearButton(datePicker, 2026)).not.toBeNull();
    // years → months (cycle)
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();
    expect(getMonthButton(datePicker, 4)).not.toBeNull();
  });

  it('should select a date when a day cell is clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');

    await waitForStable(root);
    getDayButton(datePicker, '2026-05-20')?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should toggle selections in `multi` type', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" open type="multi" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

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
      <bq-date-picker name="date-picker" open type="range" value="2026-05-10/2026-05-10" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

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
      <bq-date-picker name="date-picker" locale="en-GB" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getPrevButton(datePicker)?.click();
    await waitForChanges();

    expect(getGrid(datePicker)).toEqualAttribute('aria-label', 'April 2026');
  });

  it('should move to the next month when the next button is clicked', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" locale="en-GB" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getNextButton(datePicker)?.click();
    await waitForChanges();

    expect(getGrid(datePicker)).toEqualAttribute('aria-label', 'June 2026');
  });

  it('should mark days outside the min/max bounds as aria-disabled', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker" min="2026-05-10" max="2026-05-20" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getDayButton(datePicker, '2026-05-05')).toEqualAttribute('aria-disabled', 'true');
    expect(getDayButton(datePicker, '2026-05-25')).toEqualAttribute('aria-disabled', 'true');
    expect(getDayButton(datePicker, '2026-05-15')).not.toHaveAttribute('aria-disabled');
  });

  it('should restore the initial value on form reset', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-date-picker name="date-picker" type="single" value="2026-05-15" />
      </form>,
    );
    const form = root as HTMLFormElement;
    const datePicker = form.querySelector<HTMLBqDatePickerElement>('bq-date-picker');

    datePicker.value = '2026-06-01';
    await waitForChanges();
    expect(datePicker.value).toBe('2026-06-01');

    form.reset();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-15');
  });

  it('should focus the input when `autofocus` is set', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" autofocus />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.activeElement).toBe(getInput(datePicker));
  });

  it('should wire ARIA relationships between input and popup', async () => {
    const { root } = await render(<bq-date-picker name="my-picker" />);
    const datePicker = root as HTMLBqDatePickerElement;

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
      <bq-date-picker name="date-picker">
        <span slot="label">Pick a date</span>
      </bq-date-picker>,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    const label = datePicker.shadowRoot?.querySelector<HTMLElement>('[part="label"]');

    expect(label).not.toHaveClass('is-hidden');
    expect(datePicker.textContent).toContain('Pick a date');
  });

  it('should reveal the prefix wrapper when the `prefix` slot has content', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker">
        <bq-icon slot="prefix" name="calendar" />
      </bq-date-picker>,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    const prefix = datePicker.shadowRoot?.querySelector<HTMLElement>('[part="prefix"]');

    expect(prefix).not.toHaveClass('is-hidden');
  });

  it('should render slotted `suffix` content in place of the default calendar icon', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker">
        <span slot="suffix" data-testid="custom-suffix">
          !
        </span>
      </bq-date-picker>,
    );

    await waitForStable(root);

    expect(root.querySelector('[data-testid="custom-suffix"]')).not.toBeNull();
  });

  it('should render slotted `clear-icon` content inside the clear button', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker" type="single" value="2026-05-25">
        <span slot="clear-icon" data-testid="custom-clear">
          ×
        </span>
      </bq-date-picker>,
    );

    await waitForStable(root);

    expect(root.querySelector('[data-testid="custom-clear"]')).not.toBeNull();
  });

  it('should hide the label wrapper when the `label` slot is empty', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.querySelector('[part="label"]')).toHaveClass('is-hidden');
  });

  /* ---------------------------- isDateDisallowed ---------------------------- */

  it('should mark disallowed dates as aria-disabled via `isDateDisallowed`', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;
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
      <bq-date-picker name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
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
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    await waitForChanges();

    expect(datePicker.shadowRoot?.querySelector('[data-iso="2026-05-16"][tabindex="0"]')).not.toBeNull();
  });

  it('should move the focused day one week down with ArrowDown', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await waitForChanges();

    expect(datePicker.shadowRoot?.querySelector('[data-iso="2026-05-22"][tabindex="0"]')).not.toBeNull();
  });

  it('should select the focused day with Enter', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
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
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await waitForChanges();

    expect(datePicker.open).toBe(false);
  });

  /* ------------------------- Full drill-in flow ------------------------- */

  it('should walk years -> months -> days when selecting through each view', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" initialView="years" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

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
        <bq-date-picker name="date-picker" required />
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
        <bq-date-picker name="date-picker" required value="2026-05-15" />
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
      <bq-date-picker name="date-picker" months={5} monthsPerView="months" type="range" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForChanges();

    expect(datePicker.months).toBe(2);
    expect(datePicker).toEqualAttribute('months', '2');
  });

  it('should apply `clearButtonLabel` to the clear button', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker" clearButtonLabel="Reset date" type="single" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getClearButton(datePicker)).toEqualAttribute('label', 'Reset date');
  });

  it('should apply `placeholder` to the input', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" placeholder="DD/MM/YYYY" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getInput(datePicker)).toEqualAttribute('placeholder', 'DD/MM/YYYY');
  });

  it('should reorder weekday headers when `firstDayOfWeek` changes', async () => {
    const { root, setProps } = await render(
      <bq-date-picker name="date-picker" firstDayOfWeek={1} locale="en-GB" open />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

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
    const { root, setProps } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    // 2026-04-27 is a Monday in the trailing week of April rendered by May's grid.
    const outsideDay = getDayButton(datePicker, '2026-04-27');
    expect(outsideDay).toHaveClass('is-outside');
    expect(outsideDay).toHaveClass('is-hidden');

    await setProps({ showOutsideDays: true });
    await waitForStable(root);
    expect(getDayButton(datePicker, '2026-04-27')).not.toHaveClass('is-hidden');
  });

  /* --------------------------------- Precision ---------------------------------- */

  it('opens on the months view and commits YYYY-MM on month click when precision="month"', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" open value="2026-05" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    // Months view is active from the start (no days grid).
    expect(getMonthButton(datePicker, 4)).not.toBeNull();
    expect(getDayButton(datePicker, '2026-05-15')).toBeNull();

    getMonthButton(datePicker, 7)?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-08');
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(datePicker.open).toBe(false);
  });

  it('opens on the years view and commits YYYY on year click when precision="year"', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" open value="2026" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    expect(getYearButton(datePicker, 2026)).not.toBeNull();
    expect(getMonthButton(datePicker, 0)).toBeNull();

    getYearButton(datePicker, 2028)?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2028');
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(datePicker.open).toBe(false);
  });

  it('normalizes a full YYYY-MM-DD value to YYYY-MM when precision="month"', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" value="2026-05-30" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    // 2026-05-30 does not match the YYYY-MM shape and is dropped.
    expect(datePicker.value).toBeUndefined();
  });

  it('supports YYYY-MM ranges', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" type="range" open value="2026-05/2026-05" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    // First click starts a new range anchor at Feb (month index 1).
    getMonthButton(datePicker, 1)?.click();
    await waitForChanges();
    // Second click completes the range at Aug (month index 7).
    getMonthButton(datePicker, 7)?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-02/2026-08');
    expect(bqChange).toHaveReceivedEventTimes(2);
  });

  it('supports YYYY multi selection', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" type="multi" open />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    getYearButton(datePicker, 2026)?.click();
    await waitForChanges();
    getYearButton(datePicker, 2028)?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026 2028');
    expect(bqChange).toHaveReceivedEventTimes(2);
    // Multi keeps the panel open.
    expect(datePicker.open).toBe(true);
  });

  it('auto-swaps default formatOptions per precision when not provided', async () => {
    // Month precision → default is { month: 'long', year: 'numeric' } — no day number.
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" value="2026-05" locale="en-GB" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    const input = getInput(datePicker);
    expect(input?.value).toMatch(/May/);
    expect(input?.value).toMatch(/2026/);
    // Should NOT contain the day number.
    expect(input?.value).not.toMatch(/\b(1|01)\b/);
  });

  it('respects consumer-provided formatOptions over the precision default', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker
        name="date-picker"
        precision="month"
        value="2026-05"
        locale="en-GB"
        formatOptions={{ month: '2-digit', year: 'numeric' }}
      />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    const input = getInput(datePicker);
    expect(input?.value).toMatch(/05/);
    expect(input?.value).not.toMatch(/May/);
  });

  it('formats a multi value without day numbers when precision is month', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker
        name="date-picker"
        precision="month"
        type="multi"
        value="2026-01 2026-03 2026-05"
        locale="en-GB"
      />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    const input = getInput(datePicker);
    // Precision default is { month: 'long', year: 'numeric' } — no day number.
    expect(input?.value).toMatch(/January/);
    expect(input?.value).toMatch(/March/);
    expect(input?.value).toMatch(/May/);
    expect(input?.value).not.toMatch(/\b1 Jan\b/);
    expect(input?.value).not.toMatch(/\b01\b/);
  });

  it('formats a multi value with only the year when precision is year', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" type="multi" value="2020 2022 2025" locale="en-GB" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    const input = getInput(datePicker);
    expect(input?.value).toMatch(/2020/);
    expect(input?.value).toMatch(/2022/);
    expect(input?.value).toMatch(/2025/);
    // No month name, no day.
    expect(input?.value).not.toMatch(/Jan|January/);
  });

  it('applies is-selected to a new month anchor after a completed range', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" type="range" open value="2026-03/2026-08" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    // Click November (month index 10) — not part of the current range.
    getMonthButton(datePicker, 10)?.click();
    await waitForChanges();

    const novBtn = getMonthButton(datePicker, 10);
    expect(novBtn).toHaveClass('is-selected');
    expect(datePicker.value).toBe('2026-11');
  });

  it('marks inner months as is-range-inner in a month-precision range', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker" precision="month" type="range" open value="2026-03/2026-08" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    // March (start) and August (end) are selected endpoints.
    expect(getMonthButton(datePicker, 2)).toHaveClass('is-range-start');
    expect(getMonthButton(datePicker, 7)).toHaveClass('is-range-end');
    // April–July are inner cells.
    expect(getMonthButton(datePicker, 3)).toHaveClass('is-range-inner');
    expect(getMonthButton(datePicker, 6)).toHaveClass('is-range-inner');
    // Feb and Sept are outside the range.
    expect(getMonthButton(datePicker, 1)).not.toHaveClass('is-selected');
    expect(getMonthButton(datePicker, 8)).not.toHaveClass('is-selected');
  });

  it('previews month range while hovering the second endpoint (precision="month")', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" type="range" open value="2026-04" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    const september = getMonthButton(datePicker, 8);
    september?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();

    expect(getMonthButton(datePicker, 3)).toHaveClass('is-range-start');
    expect(getMonthButton(datePicker, 8)).toHaveClass('is-range-end');
    expect(getMonthButton(datePicker, 4)).toHaveClass('is-range-inner');
    expect(getMonthButton(datePicker, 7)).toHaveClass('is-range-inner');
  });

  it('previews year range while hovering the second endpoint (precision="year")', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" type="range" open value="2026" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    const year2030 = getYearButton(datePicker, 2030);
    year2030?.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await waitForChanges();

    expect(getYearButton(datePicker, 2026)).toHaveClass('is-range-start');
    expect(getYearButton(datePicker, 2030)).toHaveClass('is-range-end');
    expect(getYearButton(datePicker, 2027)).toHaveClass('is-range-inner');
    expect(getYearButton(datePicker, 2029)).toHaveClass('is-range-inner');
  });

  it('year + range: selecting the first visible year keeps the current decade in view', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" type="range" open value="2026" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    const initialHeader = getHeaderTitle(datePicker)?.textContent;
    getYearButton(datePicker, 2019)?.click();
    await waitForChanges();

    expect(getHeaderTitle(datePicker)?.textContent).toBe(initialHeader);
  });

  it('year + range: selecting the last visible year keeps the current decade in view', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" type="range" open value="2026" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    const initialHeader = getHeaderTitle(datePicker)?.textContent;
    getYearButton(datePicker, 2030)?.click();
    await waitForChanges();

    expect(getHeaderTitle(datePicker)?.textContent).toBe(initialHeader);
  });

  it('multi + month: committing a selection preserves the currently navigated year', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" type="multi" open />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    const initialYear = Number(getHeaderTitle(datePicker)?.textContent);
    // Step one year back.
    getPrevButton(datePicker)?.click();
    await waitForChanges();
    const targetYear = initialYear - 1;
    expect(getHeaderTitle(datePicker)?.textContent).toContain(String(targetYear));

    // Commit a month — the header must stay on the year the user navigated to.
    getMonthButton(datePicker, 0)?.click();
    await waitForChanges();

    expect(getHeaderTitle(datePicker)?.textContent).toContain(String(targetYear));
    expect(datePicker.value).toBe(`${targetYear}-01`);
  });

  it('single + month: opens on the value year, not on today', async () => {
    const { root, waitForChanges, setProps } = await render(
      <bq-date-picker name="date-picker" precision="month" value="2020-05" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    await setProps({ open: true });
    await waitForStable(root);

    expect(getHeaderTitle(datePicker)?.textContent).toContain('2020');
    expect(getMonthButton(datePicker, 4)).toHaveClass('is-selected');
  });

  it('single + year: opens on the value decade, not on today', async () => {
    const { root, waitForChanges, setProps } = await render(
      <bq-date-picker name="date-picker" precision="year" value="2018" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    await setProps({ open: true });
    await waitForStable(root);

    expect(getYearButton(datePicker, 2018)).not.toBeNull();
    expect(getYearButton(datePicker, 2018)).toHaveClass('is-selected');
  });

  /* ------------------------------- Bounds ------------------------------- */

  it('renders out-of-bounds month cells as disabled and ignores click commits (precision="month")', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" open value="2026-05" min="2026-04" max="2026-07" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    // January 2026 (month=0) is before min → disabled.
    const jan = getMonthButton(datePicker, 0);
    expect(jan).toHaveAttribute('disabled');
    expect(jan).toHaveClass('is-out-of-bounds');

    jan?.click();
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(datePicker.value).toBe('2026-05');
  });

  it('does not commit an out-of-bounds month via Enter (precision="month")', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" open value="2026-05" min="2026-04" max="2026-07" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    // Arrow to March 2026 (month=2) — out of bounds (min is 2026-04).
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await waitForChanges();
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await waitForChanges();
    // Attempt to commit via keyboard Enter.
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(datePicker.value).toBe('2026-05');
  });

  it('does not commit an out-of-bounds year via Enter (precision="year")', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" open value="2026" min="2025" max="2027" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    // Arrow to 2024 — out of bounds (min is 2025).
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await waitForChanges();
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    await waitForChanges();
    getGrid(datePicker)?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(datePicker.value).toBe('2026');
  });

  it('treats a day-precision bound as fully inclusive for month/year cells', async () => {
    // min="2026-04-15" — April 2026 must remain selectable even though half
    // its days are before the bound. Confirms bounds helpers ignore the day
    // component when checking month cells.
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" open value="2026-05" min="2026-04-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();
    await waitForStable(root);

    const april = getMonthButton(datePicker, 3);
    expect(april).not.toBeNull();
    expect(april).not.toHaveAttribute('disabled');
  });

  /* Precision-aware typed input */

  it('should emit month-precision value when typing at precision="month"', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="month" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2026-05-21');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05');
    expect(bqChange.events.at(-1)?.detail.value).toBe('2026-05');
  });

  it('should emit year-precision value when typing at precision="year"', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" precision="year" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, '2026-05-21');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026');
    expect(bqChange.events.at(-1)?.detail.value).toBe('2026');
  });

  it('should emit undefined (not the raw typed string) when input is unparseable', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, 'not-a-date');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBeUndefined();
    expect(bqChange.events.at(-1)?.detail.value).toBeUndefined();
  });

  it('should mark validity as rangeUnderflow when value is below a new min', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-date-picker name="date-picker" type="single" value="2026-01-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await setProps({ min: '2026-06-01' });
    await waitForChanges();

    // Value is preserved; the picker exposes invalidity via the `:state(invalid)` flag.
    expect(datePicker.value).toBe('2026-01-15');
    expect(datePicker.matches(':state(invalid)')).toBe(true);
    expect(getInput(datePicker)).toEqualAttribute('aria-invalid', 'true');
  });

  it('should not stay invalid once value is brought back within bounds', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-date-picker min="2026-06" name="date-picker" type="single" value="2026-01-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    // Precision-truncated min (`2026-06`) should treat June 2026 as in-bounds.
    await setProps({ value: '2026-06-20' });
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(false);
  });

  it('should mark validity as rangeOverflow when value is above a new max', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-date-picker name="date-picker" type="single" value="2026-12-31" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await setProps({ max: '2026-06-30' });
    await waitForChanges();

    expect(datePicker.value).toBe('2026-12-31');
    expect(datePicker.matches(':state(invalid)')).toBe(true);
  });

  it('should treat coarse `max="YYYY-MM"` as end-of-month in day mode', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker max="2026-05" name="date-picker" type="single" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    expect(datePicker.matches(':state(invalid)')).toBe(false);
  });

  it('should mark validity as `badInput` when typed text cannot be parsed', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, 'not-a-date');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.matches(':state(invalid)')).toBe(true);
    expect(getInput(datePicker)).toEqualAttribute('aria-invalid', 'true');
  });

  it('should clear the `badInput` flag on the next valid typed input', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, 'not-a-date');
    await userEvent.tab();
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    await userEvent.clear(input);
    await userEvent.type(input, '15/06/2026');
    await userEvent.tab();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-06-15');
    expect(datePicker.matches(':state(invalid)')).toBe(false);
    expect(getInput(datePicker)).toEqualAttribute('aria-invalid', 'false');
  });

  it('should clear the `badInput` flag after selecting a valid date from the calendar', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const input = getInput(datePicker);

    await waitForStable(root);
    await userEvent.clear(input);
    await userEvent.type(input, 'not-a-date');
    await userEvent.tab();
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    getDayButton(datePicker, '2026-05-20')?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
    expect(datePicker.matches(':state(invalid)')).toBe(false);
    expect(getInput(datePicker)).toEqualAttribute('aria-invalid', 'false');
  });

  it('should clear the `badInput` flag after an external valid value update', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const input = getInput(datePicker);

    await userEvent.clear(input);
    await userEvent.type(input, 'not-a-date');
    await userEvent.tab();
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    await setProps({ value: '2026-06-15' });
    await waitForChanges();

    expect(datePicker.value).toBe('2026-06-15');
    expect(datePicker.matches(':state(invalid)')).toBe(false);
    expect(getInput(datePicker)).toEqualAttribute('aria-invalid', 'false');
  });

  it('should keep `rangeUnderflow` when `required` is toggled after a bad value is set', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-date-picker min="2026-06-01" name="date-picker" type="single" value="2026-01-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    // Toggling `required` must not clear existing bounds-based invalidity.
    await setProps({ required: true });
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    await setProps({ required: false });
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);
  });
});

import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTodayISO } from '../../../shared/utils';
import { getTextContent } from '../../../shared/utils/slot';

const getSegmentContainer = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLElement>('[part="input"]');

const getSelectionAnnouncement = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLElement>('[role="status"]');

const getSegment = (datePicker: HTMLBqDatePickerElement, field: 'day' | 'month' | 'year', groupId = 0) =>
  datePicker.shadowRoot?.querySelector<HTMLElement>(`[data-group-id="${groupId}"][data-segment-field="${field}"]`);

const getSegmentFields = (datePicker: HTMLBqDatePickerElement, groupId = 0) =>
  Array.from(datePicker.shadowRoot?.querySelectorAll<HTMLElement>(`[data-group-id="${groupId}"]`) ?? []).map(
    (segment) => segment.getAttribute('data-segment-field'),
  );

const getSegmentGroup = (datePicker: HTMLBqDatePickerElement, groupId = 0) =>
  datePicker.shadowRoot?.querySelectorAll<HTMLElement>('.bq-date-picker__segment-group')[groupId];

const expectSegmentsAriaInvalid = (datePicker: HTMLBqDatePickerElement, value: 'true' | 'false'): void => {
  for (const field of ['day', 'month', 'year'] as const) {
    expect(getSegment(datePicker, field)).toEqualAttribute('aria-invalid', value);
  }
};

const typeSegment = async (
  datePicker: HTMLBqDatePickerElement,
  field: 'day' | 'month' | 'year',
  value: string,
  groupId = 0,
): Promise<void> => {
  const segment = getSegment(datePicker, field, groupId);
  if (!segment) throw new Error(`Expected ${field} segment in group ${groupId}`);

  segment.focus();
  await userEvent.keyboard(value);
  await waitForSegmentFocus();
};

const getDropdownPanel = (datePicker: HTMLBqDatePickerElement) => {
  const dropdown = datePicker.shadowRoot?.querySelector<HTMLBqDropdownElement>('.bq-date-picker__dropdown');
  return dropdown?.shadowRoot?.querySelector<HTMLElement>('.bq-dropdown__panel');
};

const getClearButton = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLBqButtonElement | null>('[part="clear-btn"]');

const getCalendarTriggerButton = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot
    ?.querySelector<HTMLBqButtonElement>('[part~="calendar-trigger"]')
    ?.shadowRoot?.querySelector<HTMLButtonElement>('button');

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

const getMonthGrid = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLElement>('.bq-date-picker__months[role="grid"]');

const getYearGrid = (datePicker: HTMLBqDatePickerElement) =>
  datePicker.shadowRoot?.querySelector<HTMLElement>('.bq-date-picker__years[role="grid"]');

const waitForSegmentFocus = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

const waitForSelectionAnnouncement = async (): Promise<void> => {
  await waitForSegmentFocus();
  await waitForSegmentFocus();
};

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
    expect(getSegmentContainer(datePicker)).toEqualAttribute('role', 'group');
    expect(getSegment(datePicker, 'day')).toEqualAttribute('tabindex', '0');
  });

  it('should retain the segmented field while the popup state changes', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-date-picker name="date-picker" />);
    const datePicker = root as HTMLBqDatePickerElement;

    expect(getSegmentContainer(datePicker)).toEqualAttribute('role', 'group');

    await setProps({ open: true });
    await waitForChanges();
    await waitForStable(root);

    expect(getDropdownPanel(datePicker)).toHaveAttribute('open');
    expect(getSegmentContainer(datePicker)).toEqualAttribute('role', 'group');
  });

  it('should reflect `disabled` to the host attribute', async () => {
    const { root } = await render(<bq-date-picker disabled name="date-picker" />);

    await waitForStable(root);

    expect(root).toHaveAttribute('disabled');
  });

  it('should reflect configured public props to host attributes', async () => {
    const { root } = await render(
      <bq-date-picker
        autofocus
        clearButtonLabel="Reset date"
        disableClear
        distance={12}
        firstDayOfWeek={0}
        form="booking-form"
        initialView="months"
        locale="pt-PT"
        max="2026-12-31"
        min="2026-01-01"
        months={2}
        monthsPerView="months"
        name="date-picker"
        open
        panelHeight="24rem"
        placeholder="DD/MM/YYYY"
        placement="bottom-start"
        precision="month"
        required
        showOutsideDays
        skidding={4}
        strategy="absolute"
        type="range"
        validationStatus="warning"
        value="2026-05/2026-06"
      />,
    );

    await waitForStable(root);

    expect(root).toHaveAttribute('autofocus');
    expect(root).toEqualAttribute('clear-button-label', 'Reset date');
    expect(root).toHaveAttribute('disable-clear');
    expect(root).toEqualAttribute('distance', '12');
    expect(root).toEqualAttribute('first-day-of-week', '0');
    expect(root).toEqualAttribute('form', 'booking-form');
    expect(root).toEqualAttribute('initial-view', 'months');
    expect(root).toEqualAttribute('locale', 'pt-PT');
    expect(root).toEqualAttribute('max', '2026-12-31');
    expect(root).toEqualAttribute('min', '2026-01-01');
    expect(root).toEqualAttribute('months', '2');
    expect(root).toEqualAttribute('months-per-view', 'months');
    expect(root).toEqualAttribute('name', 'date-picker');
    expect(root).toHaveAttribute('open');
    expect(root).toEqualAttribute('panel-height', '24rem');
    expect(root).toEqualAttribute('placeholder', 'DD/MM/YYYY');
    expect(root).toEqualAttribute('placement', 'bottom-start');
    expect(root).toEqualAttribute('precision', 'month');
    expect(root).toHaveAttribute('required');
    expect(root).toHaveAttribute('show-outside-days');
    expect(root).toEqualAttribute('skidding', '4');
    expect(root).toEqualAttribute('strategy', 'absolute');
    expect(root).toEqualAttribute('type', 'range');
    expect(root).toEqualAttribute('validation-status', 'warning');
    expect(root).toEqualAttribute('value', '2026-05/2026-06');
  });

  it('should reflect a single ISO value into populated segments', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" type="single" value="2026-05-30" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getSegment(datePicker, 'day')?.textContent).toBe('30');
    expect(getSegment(datePicker, 'month')?.textContent).toBe('05');
    expect(getSegment(datePicker, 'year')?.textContent).toBe('2026');
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
    expect(getSegment(datePicker, 'day')?.textContent).toBe('dd');
    expect(getSegment(datePicker, 'day')).toEqualAttribute('aria-valuetext', 'Empty');
    expect(bqClear).toHaveReceivedEventTimes(1);
  });

  it('should not render the clear button when `disable-clear` is set', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" disableClear type="single" value="2026-05-25" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getClearButton(datePicker)).toBeNull();
  });

  it('should emit focus and blur events from the segmented field', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const day = getSegment(datePicker, 'day');
    const trigger = getCalendarTriggerButton(datePicker);

    day?.focus();
    trigger?.focus();
    await waitForChanges();

    expect(bqFocus.events.some((event) => event.detail === datePicker)).toBe(true);
    expect(bqBlur.events.some((event) => event.detail === datePicker)).toBe(true);
  });

  it('should not open the calendar when a segment receives keyboard focus', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const day = getSegment(datePicker, 'day');

    day?.focus();
    await waitForStable(root);

    expect(datePicker.open).toBe(false);
    expect(datePicker.shadowRoot?.activeElement).toBe(day);
  });

  it('should render locale-ordered range spinbutton groups and focus the first segment', async () => {
    const { root } = await render(<bq-date-picker locale="en-GB" name="date-picker" type="range" />);
    const datePicker = root as HTMLBqDatePickerElement;

    expect(datePicker.shadowRoot?.querySelectorAll('[role="spinbutton"]')).toHaveLength(6);
    expect(getSegment(datePicker, 'day')?.textContent).toBe('dd');
    expect(getSegment(datePicker, 'month')?.textContent).toBe('mm');
    expect(getSegment(datePicker, 'year')?.textContent).toBe('yyyy');
    expect(getSegment(datePicker, 'day', 1)?.textContent).toBe('dd');

    getSegment(datePicker, 'day')?.focus();
    await waitForStable(root);

    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
  });

  it('should retain segment literals when deleting an entered segment', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker locale="en-GB" name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '15');
    await waitForChanges();
    expect(getSegment(datePicker, 'day')?.textContent).toBe('15');
    expect(datePicker.shadowRoot?.querySelectorAll('[part="segment-literal"]')).toHaveLength(2);

    getSegment(datePicker, 'day')?.focus();
    await userEvent.keyboard('{Delete}');
    await waitForChanges();

    expect(getSegment(datePicker, 'day')?.textContent).toBe('dd');
    expect(datePicker.shadowRoot?.querySelectorAll('[part="segment-literal"]')).toHaveLength(2);
  });

  it('should advance after a completed segment and return on Backspace', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker locale="en-GB" name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '25');
    await waitForChanges();

    expect(getSegment(datePicker, 'day')?.textContent).toBe('25');
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'month'));

    await userEvent.keyboard('{Backspace}');
    await waitForSegmentFocus();
    await waitForChanges();

    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
  });

  it('should keep partial month and year edits in their active segment', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker locale="en-GB" name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '25');
    await typeSegment(datePicker, 'month', '12');
    await typeSegment(datePicker, 'year', '2');
    await waitForChanges();

    expect(getSegment(datePicker, 'day')?.textContent).toBe('25');
    expect(getSegment(datePicker, 'month')?.textContent).toBe('12');
    expect(getSegment(datePicker, 'year')?.textContent).toBe('2');
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'year'));

    await userEvent.keyboard('{Backspace}');
    await waitForChanges();
    expect(getSegment(datePicker, 'year')?.textContent).toBe('yyyy');
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'month'));
  });

  it('should clear a completed segment before replacing it', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker locale="en-GB" name="date-picker" type="single" value="1983-12-25" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '1');
    await waitForChanges();

    expect(getSegment(datePicker, 'day')?.textContent).toBe('1');
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
  });

  it('should replace both digits of a completed month segment', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker locale="en-GB" name="date-picker" type="single" value="1983-12-25" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'month', '11');
    await waitForChanges();

    expect(getSegment(datePicker, 'month')?.textContent).toBe('11');
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'year'));
  });

  it('should expose the populated final segment before the clear button', async () => {
    const { root } = await render(
      <bq-date-picker locale="en-GB" name="date-picker" type="single" value="1983-12-25" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const clearButton = datePicker.shadowRoot?.querySelector<HTMLBqButtonElement>('[part="clear-btn"]');
    if (!clearButton) throw new Error('Expected clear button');

    expect(getSegment(datePicker, 'year')?.textContent).toBe('1983');
    expect(clearButton).toEqualAttribute('label', 'Clear value');
  });

  it('should open the calendar from a segment pointer click without moving focus', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const day = getSegment(datePicker, 'day');

    await userEvent.click(day);
    await waitForChanges();
    await waitForStable(root);

    expect(datePicker.open).toBe(true);
    expect(datePicker.shadowRoot?.activeElement).toBe(day);
  });

  it('should move focus into the calendar when the icon trigger is activated', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const trigger = getCalendarTriggerButton(datePicker);

    trigger?.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();
    await waitForStable(root);

    expect(datePicker.open).toBe(true);
    expect(datePicker.shadowRoot?.activeElement).not.toBe(trigger);
    expect(datePicker.shadowRoot?.querySelector('[role="grid"] button:focus')).toBe(
      datePicker.shadowRoot?.querySelector('[role="grid"] [tabindex="0"]'),
    );
  });

  it('should emit `bqChange` when a segmented date is completed', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');

    await typeSegment(datePicker, 'day', '21');
    await typeSegment(datePicker, 'month', '05');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-21');
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqChange.events[0].detail.value).toBe('2026-05-21');
  });

  it('should commit completed range segment groups to the range wire format', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="range" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '15', 0);
    await typeSegment(datePicker, 'month', '05', 0);
    await typeSegment(datePicker, 'year', '2026', 0);
    await typeSegment(datePicker, 'day', '20', 1);
    await typeSegment(datePicker, 'month', '05', 1);
    await typeSegment(datePicker, 'year', '2026', 1);
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-15/2026-05-20');
    expect(getDayButton(datePicker, '2026-05-15')).toHaveClass('is-selected');
    expect(getDayButton(datePicker, '2026-05-20')).toHaveClass('is-selected');
  });

  it('should commit multiple segment groups to the sorted multi wire format', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="multi" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '20', 0);
    await typeSegment(datePicker, 'month', '05', 0);
    await typeSegment(datePicker, 'year', '2026', 0);
    await typeSegment(datePicker, 'day', '15', 1);
    await typeSegment(datePicker, 'month', '05', 1);
    await typeSegment(datePicker, 'year', '2026', 1);
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-15 2026-05-20');
  });

  it('should clamp completed segments to `min` when focus leaves the field', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" max="2026-05-30" min="2026-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await typeSegment(datePicker, 'day', '10');
    await typeSegment(datePicker, 'month', '05');
    await typeSegment(datePicker, 'year', '2026');
    getCalendarTriggerButton(datePicker)?.focus();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
  });

  it('should clamp completed segments to `max` when focus leaves the field', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" max="2026-05-30" min="2026-05-20" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await typeSegment(datePicker, 'day', '10');
    await typeSegment(datePicker, 'month', '06');
    await typeSegment(datePicker, 'year', '2026');
    getCalendarTriggerButton(datePicker)?.focus();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-30');
  });

  it('should apply validation status classes and mark date segments invalid', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" type="single" validationStatus="error" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    const control = root.shadowRoot?.querySelector('[part="control"]');
    expect(control).toHaveClass('validation-error');
    expectSegmentsAriaInvalid(datePicker, 'true');
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
    const day = getSegment(datePicker, 'day');

    day?.focus();
    getCalendarTriggerButton(datePicker)?.focus();
    await typeSegment(datePicker, 'day', '30');
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

  it('should give calendar day buttons complete localized date labels', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" locale="en-GB" open value="2026-07-15" />);
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    expect(getDayButton(datePicker, '2026-07-15')).toEqualAttribute('aria-label', 'Wednesday, 15 July 2026');
  });

  it('should give abbreviated month buttons full localized month and year labels', async () => {
    const { root } = await render(
      <bq-date-picker initialView="months" name="date-picker" locale="en-GB" open value="2026-07-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    expect(getMonthButton(datePicker, 6)).toEqualAttribute('aria-label', 'July 2026');
    expect(getMonthButton(datePicker, 6)?.textContent).toBe('Jul');
  });

  it('should open on the `initialView` when the panel becomes visible', async () => {
    const { root } = await render(<bq-date-picker initialView="months" name="date-picker" open value="2026-07-15" />);
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
      <bq-date-picker initialView="months" name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();

    expect(getYearButton(datePicker, 2026)).not.toBeNull();
  });

  it('should render months view with the required grid > row > gridcell structure', async () => {
    const { root } = await render(<bq-date-picker initialView="months" name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    const monthGrid = getMonthGrid(datePicker);

    expect(monthGrid?.querySelectorAll('[role="row"]')).toHaveLength(4);
    expect(monthGrid?.querySelectorAll('[role="gridcell"]')).toHaveLength(12);
  });

  it('should render years view with the required grid > row > gridcell structure', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker initialView="months" name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();
    await waitForStable(root);

    const yearGrid = getYearGrid(datePicker);

    expect(yearGrid?.querySelectorAll('[role="row"]')).toHaveLength(4);
    expect(yearGrid?.querySelectorAll('[role="gridcell"]')).toHaveLength(12);
  });

  it('should cycle back from the years view to the days view (day precision)', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker initialView="years" name="date-picker" open value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    getHeaderTitleInnerButton(datePicker)?.click();
    await waitForChanges();

    expect(getDayButton(datePicker, '2026-05-15')).not.toBeNull();
  });

  it('should cycle back from the years view to the months view (month precision)', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker precision="month" name="date-picker" open value="2026-05" />,
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

  it('should normalize inverted range segments when focus leaves the field', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker name="date-picker" type="range" value="2026-05-20" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    const enterSegmentValue = async (field: 'day' | 'month' | 'year', value: string): Promise<void> => {
      for (const key of value) {
        getSegment(datePicker, field, 1)?.dispatchEvent(
          new KeyboardEvent('keydown', { bubbles: true, cancelable: true, composed: true, key }),
        );
        await waitForChanges();
      }
    };

    await enterSegmentValue('day', '10');
    await enterSegmentValue('month', '05');
    await enterSegmentValue('year', '2026');
    await waitForStable(root);

    expect(datePicker.value).toBe('2026-05-10/2026-05-20');
    expect(getSegment(datePicker, 'day', 0)?.textContent).toBe('20');
    expect(getSegment(datePicker, 'day', 1)?.textContent).toBe('10');
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'year', 1));
    expect(bqChange).toHaveReceivedEventTimes(1);

    getCalendarTriggerButton(datePicker)?.focus();
    await waitForChanges();

    expect(getSegment(datePicker, 'day', 0)?.textContent).toBe('10');
    expect(getSegment(datePicker, 'day', 1)?.textContent).toBe('20');
  });

  it('should step an incomplete range end-date segment after seeding it', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" type="range" value="2026-05-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    const seededDay = Number(getTodayISO().slice(8, 10));
    const key = seededDay < 31 ? 'ArrowUp' : 'ArrowDown';
    const expectedDay = `${seededDay + (key === 'ArrowUp' ? 1 : -1)}`.padStart(2, '0');

    getSegment(datePicker, 'day', 1)?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, composed: true, key }),
    );
    await waitForChanges();
    getSegment(datePicker, 'day', 1)?.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, composed: true, key }),
    );
    await waitForChanges();

    expect(getSegment(datePicker, 'day', 1)?.textContent).toBe(expectedDay);
    expect(datePicker.value).toBe('2026-05-15');
  });

  it('should focus the trailing multi-date segment after ArrowUp completes a date', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="multi" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const increment = async (groupId: number, field: 'day' | 'month' | 'year'): Promise<void> => {
      getSegment(datePicker, field, groupId)?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, composed: true, key: 'ArrowUp' }),
      );
      await waitForChanges();
    };

    await increment(0, 'day');
    await increment(0, 'month');
    await increment(0, 'year');
    await waitForStable(root);

    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day', 1));

    const firstYear = getSegment(datePicker, 'year', 0)?.textContent;
    await increment(1, 'day');

    expect(getSegment(datePicker, 'year', 0)?.textContent).toBe(firstYear);
    expect(getSegment(datePicker, 'day', 1)?.textContent).toBe(getTodayISO().slice(8, 10));
  });

  it('should use roving tabindex for ArrowLeft, ArrowRight, Home, and End segment navigation', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const day = getSegment(datePicker, 'day');

    day?.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    await waitForSegmentFocus();

    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'month'));
    expect(getSegment(datePicker, 'month')).toEqualAttribute('tabindex', '0');
    expect(getSegment(datePicker, 'day')).toEqualAttribute('tabindex', '-1');

    await userEvent.keyboard('{End}');
    await waitForSegmentFocus();
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'year'));

    await userEvent.keyboard('{Home}');
    await waitForSegmentFocus();
    expect(datePicker.shadowRoot?.activeElement).toBe(day);
  });

  it('should retain pointer focus on the selected segment while opening the calendar', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const month = getSegment(datePicker, 'month');

    if (!month) throw new Error('Expected month segment');
    await userEvent.click(month);
    await waitForSegmentFocus();

    expect(datePicker.open).toBe(true);
    expect(datePicker.shadowRoot?.activeElement).toBe(month);
  });

  it('should reset focus to the first segment after clearing a date', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const clearButton = getClearButton(datePicker)?.shadowRoot?.querySelector<HTMLButtonElement>('button');
    if (!clearButton) throw new Error('Expected clear button');

    await userEvent.click(clearButton);
    await waitForSegmentFocus();

    expect(datePicker.value).toBeUndefined();
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
    expect(getSegment(datePicker, 'day')).toEqualAttribute('aria-valuetext', 'Empty');
  });

  it('should clear a whole segment and move backward on Backspace', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const month = getSegment(datePicker, 'month');

    month?.focus();
    await userEvent.keyboard('{Delete}');
    await waitForChanges();

    expect(getSegment(datePicker, 'month')?.textContent).toBe('mm');
    expect(datePicker.shadowRoot?.activeElement).toBe(month);

    await userEvent.keyboard('{Backspace}');
    await waitForSegmentFocus();

    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
  });

  it('should expose empty and populated segment spinbutton states', async () => {
    const { root: emptyRoot } = await render(<bq-date-picker name="empty-date-picker" />);
    const emptyPicker = emptyRoot as HTMLBqDatePickerElement;
    await waitForStable(emptyRoot);

    expect(getSegment(emptyPicker, 'day')).toEqualAttribute('role', 'spinbutton');
    expect(getSegment(emptyPicker, 'day')).toEqualAttribute('aria-valuemin', '1');
    expect(getSegment(emptyPicker, 'day')).toEqualAttribute('aria-valuemax', '31');
    expect(getSegment(emptyPicker, 'day')).toEqualAttribute('aria-valuetext', 'Empty');
    expect(getSegment(emptyPicker, 'day')).not.toHaveAttribute('aria-valuenow');

    const { root: populatedRoot } = await render(<bq-date-picker name="populated-date-picker" value="2026-05-15" />);
    const populatedPicker = populatedRoot as HTMLBqDatePickerElement;
    await waitForStable(populatedRoot);

    expect(getSegment(populatedPicker, 'day')).toEqualAttribute('aria-valuetext', '15');
    expect(getSegment(populatedPicker, 'month')).toEqualAttribute('aria-valuetext', '05');
    expect(getSegment(populatedPicker, 'year')).toEqualAttribute('aria-valuetext', '2026');
    expect(getSegment(populatedPicker, 'day')).toEqualAttribute('aria-valuenow', '15');
    expect(getSegment(populatedPicker, 'month')).toEqualAttribute('aria-valuenow', '5');
    expect(getSegment(populatedPicker, 'year')).toEqualAttribute('aria-valuenow', '2026');
  });

  it.each([
    ['single', '2026-07-15', 'Selected date: Wednesday, 15 July 2026'],
    ['range', '2026-07-15/2026-07-20', 'Selected date range: Wednesday, 15 July 2026 to Monday, 20 July 2026'],
    ['multi', '2026-07-15 2026-07-20', 'Selected dates: Wednesday, 15 July 2026, Monday, 20 July 2026'],
  ] as const)('should announce the current %s selection when focus enters the segments', async (type, value, expected) => {
    const { root } = await render(<bq-date-picker name="date-picker" type={type} value={value} />);
    const datePicker = root as HTMLBqDatePickerElement;

    getSegment(datePicker, 'day')?.focus();
    await waitForSelectionAnnouncement();

    expect(getSelectionAnnouncement(datePicker)?.textContent).toBe(expected);
  });

  it('should not change the selection announcement while roving between segments', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" value="2026-07-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    getSegment(datePicker, 'day')?.focus();
    await waitForSelectionAnnouncement();
    await userEvent.keyboard('{ArrowRight}');
    await waitForSelectionAnnouncement();

    expect(getSelectionAnnouncement(datePicker)?.textContent).toBe('Selected date: Wednesday, 15 July 2026');
  });

  it('should announce a date committed from the calendar panel', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-10" />);
    const datePicker = root as HTMLBqDatePickerElement;

    getDayButton(datePicker, '2026-05-15')?.click();
    await waitForChanges();
    await waitForSelectionAnnouncement();

    expect(getSelectionAnnouncement(datePicker)?.textContent).toBe('Selected date: Friday, 15 May 2026');
  });

  it.each([
    ['days', undefined, 'Calendar: June 2026'],
    ['months', 'months', 'Calendar: 2025'],
    ['years', 'years', 'Calendar: 2007 – 2018'],
  ] as const)('should announce the %s view context after calendar navigation', async (_, initialView, expected) => {
    const { root } = await render(
      <bq-date-picker initialView={initialView} name="date-picker" open value="2026-07-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await userEvent.click(getPrevButton(datePicker) as HTMLButtonElement);
    await waitForSelectionAnnouncement();

    expect(getSelectionAnnouncement(datePicker)?.textContent).toBe(expected);
  });

  it('should focus the first segment after committing a calendar selection', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" value="2026-05-10" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const trigger = getCalendarTriggerButton(datePicker);
    if (!trigger) throw new Error('Expected calendar trigger');

    await userEvent.click(trigger);
    await waitForStable(root);
    await userEvent.click(getDayButton(datePicker, '2026-05-15') as HTMLButtonElement);
    await waitForStable(root);
    await waitForSegmentFocus();

    expect(datePicker.open).toBe(false);
    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
  });

  it('should focus the active segment when its label is activated', async () => {
    const { root } = await render(
      <bq-date-picker name="date-picker">
        <span slot="label">Appointment date</span>
      </bq-date-picker>,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const label = datePicker.shadowRoot?.querySelector<HTMLElement>('[part="label"]');
    if (!label) throw new Error('Expected date picker label');

    await userEvent.click(label);
    await waitForSegmentFocus();

    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
  });

  it('should label range endpoints and multi-date segment groups', async () => {
    const { root: rangeRoot } = await render(
      <bq-date-picker name="range-date-picker" type="range" value="2026-05-15/2026-05-20" />,
    );
    const rangePicker = rangeRoot as HTMLBqDatePickerElement;
    await waitForStable(rangeRoot);

    expect(getSegmentGroup(rangePicker, 0)).toEqualAttribute('role', 'group');
    expect(getSegmentGroup(rangePicker, 0)).toEqualAttribute('aria-label', 'Start date');
    expect(getSegmentGroup(rangePicker, 1)).toEqualAttribute('aria-label', 'End date');
    expect(getSegment(rangePicker, 'day', 0)).toEqualAttribute('aria-label', 'Start date day');
    expect(getSegment(rangePicker, 'day', 1)).toEqualAttribute('aria-label', 'End date day');

    const { root: multiRoot } = await render(
      <bq-date-picker name="multi-date-picker" type="multi" value="2026-05-15" />,
    );
    const multiPicker = multiRoot as HTMLBqDatePickerElement;
    await waitForStable(multiRoot);

    expect(getSegmentGroup(multiPicker, 0)).toEqualAttribute('aria-label', 'Date 1');
    expect(getSegmentGroup(multiPicker, 1)).toEqualAttribute('aria-label', 'Date 2');
  });

  it('should expose invalid state on every segment', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" validationStatus="error" value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForStable(root);

    expect(getSegment(datePicker, 'day')).toEqualAttribute('aria-invalid', 'true');
    expect(getSegment(datePicker, 'month')).toEqualAttribute('aria-invalid', 'true');
    expect(getSegment(datePicker, 'year')).toEqualAttribute('aria-invalid', 'true');
  });

  it('should return focus to the calendar trigger after closing the panel', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const trigger = getCalendarTriggerButton(datePicker);
    if (!trigger) throw new Error('Expected calendar trigger');

    await userEvent.click(trigger);
    await waitForStable(root);
    await userEvent.keyboard('{Escape}');
    await waitForStable(root);
    await waitForSegmentFocus();

    expect(datePicker.open).toBe(false);
    expect(datePicker.shadowRoot?.activeElement).toBe(
      datePicker.shadowRoot?.querySelector<HTMLBqButtonElement>('[part~="calendar-trigger"]'),
    );
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

  it('should clamp a complete out-of-bounds segment value when focus leaves the field', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" min="2026-05-01" max="2026-05-31" value="2026-04-10" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const monthSegment = getSegment(datePicker, 'month');
    const trigger = getCalendarTriggerButton(datePicker);

    monthSegment?.focus();
    trigger?.focus();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-01');
    expect(getSegment(datePicker, 'day')?.textContent).toBe('01');
    expect(getSegment(datePicker, 'month')?.textContent).toBe('05');
  });

  it.each([
    ['range', '2026-04-10/2026-06-20', '2026-05-01/2026-05-31'],
    ['multi', '2026-04-10 2026-06-20', '2026-05-01 2026-05-31'],
  ] as const)('should clamp every complete out-of-bounds %s group when focus leaves the field', async (type, value, expected) => {
    const { root, waitForChanges } = await render(
      <bq-date-picker name="date-picker" max="2026-05-31" min="2026-05-01" type={type} value={value} />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const firstMonthSegment = getSegment(datePicker, 'month');
    const trigger = getCalendarTriggerButton(datePicker);

    firstMonthSegment?.focus();
    trigger?.focus();
    await waitForChanges();

    expect(datePicker.value).toBe(expected);
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

  it('should focus the first segment when `autofocus` is set', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" autofocus />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(datePicker.shadowRoot?.activeElement).toBe(getSegment(datePicker, 'day'));
  });

  it('should expose group and dialog semantics for the segmented picker', async () => {
    const { root } = await render(<bq-date-picker name="my-picker" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    const segments = getSegmentContainer(datePicker);
    const popup = datePicker.shadowRoot?.querySelector<HTMLElement>('[role="dialog"]');

    expect(segments).toEqualAttribute('role', 'group');
    expect(segments).toEqualAttribute('aria-disabled', 'false');
    expect(popup).toEqualAttribute('aria-label', 'Date picker');
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
    const labelSlot = label?.querySelector<HTMLSlotElement>('slot[name="label"]');

    expect(label).not.toHaveClass('is-hidden');
    expect(labelSlot).not.toBeNull();
    if (!labelSlot) throw new Error('Expected label slot to exist');
    expect(getTextContent(labelSlot, { recurse: true })).toBe('Pick a date');
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

  it('should skip disallowed dates when incrementing or decrementing a completed segment', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" value="2026-05-17" />);
    const datePicker = root as HTMLBqDatePickerElement;
    datePicker.isDateDisallowed = (date: Date) => date.getDate() === 15 || date.getDate() === 16;
    await waitForChanges();
    await waitForStable(root);

    const daySegment = getSegment(datePicker, 'day');
    const decrement = new KeyboardEvent('keydown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      key: 'ArrowDown',
    });
    daySegment?.dispatchEvent(decrement);
    await waitForChanges();

    expect(decrement.defaultPrevented).toBe(true);
    expect(getSegment(datePicker, 'day')?.textContent).toBe('14');
    expect(datePicker.value).toBe('2026-05-14');

    const increment = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, composed: true, key: 'ArrowUp' });
    daySegment?.dispatchEvent(increment);
    await waitForChanges();

    expect(increment.defaultPrevented).toBe(true);
    expect(datePicker.value).toBe('2026-05-17');
  });

  /* --------------------------- Keyboard navigation --------------------------- */

  it('should move the focused day with ArrowRight', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();

    expect(datePicker.shadowRoot?.querySelector('[data-iso="2026-05-16"][tabindex="0"]')).not.toBeNull();
  });

  it('should move the focused day one week down with ArrowDown', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    await userEvent.keyboard('{ArrowDown}');
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
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-16');
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should close the popup and clear `open` on Escape', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    await userEvent.keyboard('{Escape}');
    await waitForChanges();

    expect(datePicker.open).toBe(false);
  });

  /* ------------------------- Full drill-in flow ------------------------- */

  it('should walk years -> months -> days when selecting through each view', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker initialView="years" name="date-picker" open value="2026-05-15" />,
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

  it('should retain locale-derived segment placeholders when `placeholder` is set', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" placeholder="DD/MM/YYYY" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getSegment(datePicker, 'day')?.textContent).toBe('dd');
    expect(getSegment(datePicker, 'month')?.textContent).toBe('mm');
    expect(getSegment(datePicker, 'year')?.textContent).toBe('yyyy');
  });

  it('should describe the locale-derived mask to assistive technology', async () => {
    const { root } = await render(<bq-date-picker name="date-picker" locale="de-DE" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    const segments = getSegmentContainer(datePicker);
    const descriptionId = segments?.getAttribute('aria-describedby');
    const description = datePicker.shadowRoot?.querySelector<HTMLElement>(`#${descriptionId}`);
    expect(description?.textContent?.trim()).toBe('Expected format: dd.mm.yyyy');
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
      <bq-date-picker precision="month" name="date-picker" open value="2026-05" />,
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
      <bq-date-picker precision="year" name="date-picker" open value="2026" />,
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
      <bq-date-picker precision="month" name="date-picker" value="2026-05-30" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    // 2026-05-30 does not match the YYYY-MM shape and is dropped.
    expect(datePicker.value).toBeUndefined();
  });

  it('supports YYYY-MM ranges', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker precision="month" name="date-picker" type="range" open value="2026-05/2026-05" />,
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
      <bq-date-picker precision="year" name="date-picker" type="multi" open />,
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

  it('uses locale-ordered numeric month and year segments when formatOptions are not provided', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker precision="month" name="date-picker" value="2026-05" locale="en-GB" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    expect(getSegmentFields(datePicker)).toEqual(['month', 'year']);
    expect(getSegment(datePicker, 'month')?.textContent).toBe('05');
    expect(getSegment(datePicker, 'year')?.textContent).toBe('2026');
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

    expect(getSegmentFields(datePicker)).toEqual(['month', 'year']);
    expect(getSegment(datePicker, 'month')?.textContent).toBe('05');
    expect(getSegment(datePicker, 'month')?.textContent).not.toMatch(/May/);
  });

  it('should fall back to the locale numeric mask for incompatible formatOptions', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root } = await render(
      <bq-date-picker name="date-picker" value="2026-05-15" formatOptions={{ dateStyle: 'full' }} />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);

    expect(getSegmentFields(datePicker)).toEqual(['day', 'month', 'year']);
    expect(getSegment(datePicker, 'day')?.textContent).toBe('15');
    expect(getSegment(datePicker, 'month')?.textContent).toBe('05');
    expect(getSegment(datePicker, 'year')?.textContent).toBe('2026');
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-DATE-PICKER] formatOptions must contain only numeric date fields to configure the input mask; using the locale default.',
    );
  });

  it('formats multi values with month segments and a trailing empty group', async () => {
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

    expect(getSegment(datePicker, 'month', 0)?.textContent).toBe('01');
    expect(getSegment(datePicker, 'month', 1)?.textContent).toBe('03');
    expect(getSegment(datePicker, 'month', 2)?.textContent).toBe('05');
    expect(getSegment(datePicker, 'month', 3)?.textContent).toBe('mm');
    expect(getSegment(datePicker, 'year', 3)?.textContent).toBe('yyyy');
  });

  it('formats multi values as year-only segments when precision is year', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker precision="year" name="date-picker" type="multi" value="2020 2022 2025" locale="en-GB" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    expect(getSegmentFields(datePicker, 0)).toEqual(['year']);
    expect(getSegment(datePicker, 'year', 0)?.textContent).toBe('2020');
    expect(getSegment(datePicker, 'year', 1)?.textContent).toBe('2022');
    expect(getSegment(datePicker, 'year', 2)?.textContent).toBe('2025');
    expect(getSegment(datePicker, 'year', 3)?.textContent).toBe('yyyy');
  });

  it('applies is-selected to a new month anchor after a completed range', async () => {
    const { root, waitForChanges } = await render(
      <bq-date-picker precision="month" name="date-picker" type="range" open value="2026-03/2026-08" />,
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
      <bq-date-picker precision="month" name="date-picker" type="range" open value="2026-03/2026-08" />,
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
      <bq-date-picker precision="month" name="date-picker" type="range" open value="2026-04" />,
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
      <bq-date-picker precision="year" name="date-picker" type="range" open value="2026" />,
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
      <bq-date-picker precision="year" name="date-picker" type="range" open value="2026" />,
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
      <bq-date-picker precision="year" name="date-picker" type="range" open value="2026" />,
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
      <bq-date-picker precision="month" name="date-picker" type="multi" open />,
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
      <bq-date-picker precision="month" name="date-picker" value="2020-05" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();

    await setProps({ name: 'date-picker', open: true });
    await waitForStable(root);

    expect(getHeaderTitle(datePicker)?.textContent).toContain('2020');
    expect(getMonthButton(datePicker, 4)).toHaveClass('is-selected');
  });

  it('single + year: opens on the value decade, not on today', async () => {
    const { root, waitForChanges, setProps } = await render(
      <bq-date-picker precision="year" name="date-picker" value="2018" />,
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
      <bq-date-picker precision="month" name="date-picker" open value="2026-05" min="2026-04" max="2026-07" />,
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
      <bq-date-picker precision="month" name="date-picker" open value="2026-05" min="2026-04" max="2026-07" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    // Arrow to March 2026 (month=2) — out of bounds (min is 2026-04).
    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();
    // Attempt to commit via keyboard Enter.
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(datePicker.value).toBe('2026-05');
  });

  it('does not commit an out-of-bounds year via Enter (precision="year")', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker precision="year" name="date-picker" open value="2026" min="2025" max="2027" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await waitForStable(root);

    // Arrow to 2024 — out of bounds (min is 2025).
    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();
    await userEvent.keyboard('{ArrowLeft}');
    await waitForChanges();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(bqChange).toHaveReceivedEventTimes(0);
    expect(datePicker.value).toBe('2026');
  });

  it('treats a day-precision bound as fully inclusive for month/year cells', async () => {
    // min="2026-04-15" — April 2026 must remain selectable even though half
    // its days are before the bound. Confirms bounds helpers ignore the day
    // component when checking month cells.
    const { root, waitForChanges } = await render(
      <bq-date-picker precision="month" name="date-picker" open value="2026-05" min="2026-04-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();
    await waitForStable(root);

    const april = getMonthButton(datePicker, 3);
    expect(april).not.toBeNull();
    expect(april).not.toHaveAttribute('disabled');
  });

  /* Precision-aware segment entry */

  it('should emit a month-precision value when month and year segments are completed', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker precision="month" name="date-picker" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');

    await typeSegment(datePicker, 'month', '05');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05');
    expect(bqChange.events.at(-1)?.detail.value).toBe('2026-05');
  });

  it('should emit a year-precision value when the year segment is completed', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-date-picker precision="year" name="date-picker" type="single" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');

    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();

    expect(datePicker.value).toBe('2026');
    expect(bqChange.events.at(-1)?.detail.value).toBe('2026');
  });

  it('should not commit or emit a raw value for an invalid completed segment group', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;
    const bqChange = spyOnEvent('bqChange');

    await typeSegment(datePicker, 'day', '99');
    await typeSegment(datePicker, 'month', '99');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();

    expect(datePicker.value).toBeUndefined();
    expect(datePicker.matches(':state(invalid)')).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(0);
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
    expectSegmentsAriaInvalid(datePicker, 'true');
  });

  it('should not stay invalid once value is brought back within bounds', async () => {
    const { root, setProps, waitForChanges } = await render(
      <bq-date-picker min="2026-06" name="date-picker" type="single" value="2026-01-15" />,
    );
    const datePicker = root as HTMLBqDatePickerElement;
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    // Precision-truncated min (`2026-06`) should treat June 2026 as in-bounds.
    await setProps({ name: 'date-picker', value: '2026-06-20' });
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

  it('should mark validity as `badInput` when completed segments form an invalid date', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '99');
    await typeSegment(datePicker, 'month', '99');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();

    expect(datePicker.matches(':state(invalid)')).toBe(true);
    expectSegmentsAriaInvalid(datePicker, 'true');
  });

  it('should expose the custom `formValidationMessage` for bounds errors', async () => {
    const setValiditySpy = vi.spyOn(ElementInternals.prototype, 'setValidity');
    const { root, waitForChanges } = await render(
      <bq-date-picker
        formValidationMessage="Choose a date on or after 1 June 2026"
        min="2026-06-01"
        name="date-picker"
        type="single"
        value="2026-01-15"
      />,
    );
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForChanges();

    expect(datePicker.matches(':state(invalid)')).toBe(true);
    expect(setValiditySpy).toHaveBeenCalled();
    expect(setValiditySpy.mock.calls.at(-1)?.[1]).toBe('Choose a date on or after 1 June 2026');
  });

  it('should clear the `badInput` flag on the next valid segment entry', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '99');
    await typeSegment(datePicker, 'month', '99');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    for (const field of ['day', 'month', 'year'] as const) {
      getSegment(datePicker, field)?.focus();
      await userEvent.keyboard('{Delete}');
    }
    await typeSegment(datePicker, 'day', '15');
    await typeSegment(datePicker, 'month', '06');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();

    expect(datePicker.value).toBe('2026-06-15');
    expect(datePicker.matches(':state(invalid)')).toBe(false);
    expectSegmentsAriaInvalid(datePicker, 'false');
  });

  it('should clear the `badInput` flag after selecting a valid date from the calendar', async () => {
    const { root, waitForChanges } = await render(<bq-date-picker name="date-picker" open value="2026-05-15" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await waitForStable(root);
    await typeSegment(datePicker, 'day', '99');
    await typeSegment(datePicker, 'month', '99');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    getDayButton(datePicker, '2026-05-20')?.click();
    await waitForChanges();

    expect(datePicker.value).toBe('2026-05-20');
    expect(datePicker.matches(':state(invalid)')).toBe(false);
    expectSegmentsAriaInvalid(datePicker, 'false');
  });

  it('should clear the `badInput` flag after an external valid value update', async () => {
    const { root, setProps, waitForChanges } = await render(<bq-date-picker name="date-picker" type="single" />);
    const datePicker = root as HTMLBqDatePickerElement;

    await typeSegment(datePicker, 'day', '99');
    await typeSegment(datePicker, 'month', '99');
    await typeSegment(datePicker, 'year', '2026');
    await waitForChanges();
    expect(datePicker.matches(':state(invalid)')).toBe(true);

    await setProps({ value: '2026-06-15' });
    await waitForChanges();

    expect(datePicker.value).toBe('2026-06-15');
    expect(datePicker.matches(':state(invalid)')).toBe(false);
    expectSegmentsAriaInvalid(datePicker, 'false');
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

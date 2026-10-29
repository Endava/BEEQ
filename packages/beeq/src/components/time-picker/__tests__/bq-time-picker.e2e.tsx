import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

type TField = 'hour' | 'minute' | 'second' | 'dayPeriod';

const nextFrame = (): Promise<void> => new Promise((resolve) => requestAnimationFrame(() => resolve()));

const settle = async (): Promise<void> => {
  await nextFrame();
  await nextFrame();
};

const getSegment = (tp: HTMLBqTimePickerElement, field: TField) =>
  tp.shadowRoot?.querySelector<HTMLElement>(`[data-segment-field="${field}"]`);

const getSegmentFields = (tp: HTMLBqTimePickerElement) =>
  Array.from(tp.shadowRoot?.querySelectorAll<HTMLElement>('[role="spinbutton"]') ?? []).map((segment) =>
    segment.getAttribute('data-segment-field'),
  );

const getSegmentText = (tp: HTMLBqTimePickerElement) =>
  tp.shadowRoot?.querySelector<HTMLElement>('[part="input"]')?.textContent;

const getColumn = (tp: HTMLBqTimePickerElement, field: TField) =>
  tp.shadowRoot?.querySelector<HTMLElement>(`[data-column="${field}"]`);

const getColumnHeader = (tp: HTMLBqTimePickerElement, field: TField) => {
  const headerId = getColumn(tp, field)?.getAttribute('aria-labelledby');
  return headerId ? tp.shadowRoot?.getElementById(headerId) : undefined;
};

const getColumnFields = (tp: HTMLBqTimePickerElement) =>
  Array.from(tp.shadowRoot?.querySelectorAll<HTMLElement>('[data-column]') ?? []).map((column) =>
    column.getAttribute('data-column'),
  );

const getOption = (tp: HTMLBqTimePickerElement, field: TField, value: string | number) =>
  getColumn(tp, field)?.querySelector<HTMLElement>(`[data-value="${value}"]`);

const getSelectedOption = (tp: HTMLBqTimePickerElement, field: TField) =>
  getColumn(tp, field)?.querySelector<HTMLElement>('[aria-selected="true"]');

const getInnerButton = (tp: HTMLBqTimePickerElement, part: string) =>
  tp.shadowRoot
    ?.querySelector<HTMLBqButtonElement>(`[part~="${part}"]`)
    ?.shadowRoot?.querySelector<HTMLButtonElement>('button');

const getClearButton = (tp: HTMLBqTimePickerElement) =>
  tp.shadowRoot?.querySelector<HTMLBqButtonElement>('[part="clear-btn"]');

const typeInSegment = async (tp: HTMLBqTimePickerElement, field: TField, text: string): Promise<void> => {
  getSegment(tp, field)?.focus();
  await userEvent.keyboard(text);
  await nextFrame();
};

const openPanel = async (tp: HTMLBqTimePickerElement, waitForChanges: () => Promise<void>): Promise<void> => {
  tp.open = true;
  await waitForChanges();
  await settle();
};

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('bq-time-picker', () => {
  /* -------------------------------- Rendering -------------------------------- */

  it('should render', async () => {
    const { root } = await render(<bq-time-picker name="time" />);

    expect(root).not.toBeNull();
    expect(root).toHaveShadowRoot();
  });

  it('should render hour and minute segments by default', async () => {
    const { root } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(getSegmentFields(tp)).toEqual(['hour', 'minute']);
    expect(getSegmentText(tp)).toBe('hh:mm');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-label', 'hour');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-valuetext', 'Empty');
  });

  it('should render the segments of the configured `precision`', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" precision="hour" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(getSegmentFields(tp)).toEqual(['hour']);

    tp.precision = 'second';
    await waitForChanges();
    await waitForStable(root);

    expect(getSegmentFields(tp)).toEqual(['hour', 'minute', 'second']);
    expect(getSegmentText(tp)).toBe('hh:mm:ss');
  });

  it('should render the value in the segments', async () => {
    const { root } = await render(<bq-time-picker name="time" precision="second" value="09:05:30" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(getSegmentText(tp)).toBe('09:05:30');
    expect(getSegment(tp, 'minute')).toEqualAttribute('aria-valuenow', '5');
  });

  it('should normalize the value to the `precision`', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:05:30" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(tp.value).toBe('09:05');

    tp.precision = 'hour';
    await waitForChanges();
    await waitForStable(root);

    expect(tp.value).toBe('09:00');
  });

  it('should drop an invalid value', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:05" />);
    const tp = root as HTMLBqTimePickerElement;

    tp.value = '25:99';
    await waitForChanges();
    await waitForStable(root);

    expect(tp.value).toBeUndefined();
    expect(getSegmentText(tp)).toBe('hh:mm');
  });

  it('should render the label and prefix slots', async () => {
    const { root } = await render(
      <bq-time-picker name="time">
        <span slot="label">Start time</span>
        <bq-icon slot="prefix" name="alarm" />
      </bq-time-picker>,
    );
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    expect(tp.shadowRoot?.querySelector('[part="label"]')).not.toHaveAttribute('hidden');
    expect(tp.shadowRoot?.querySelector('[part="prefix"]')).not.toHaveAttribute('hidden');
  });

  it('should hide the label and prefix wrappers without slot content', async () => {
    const { root } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    expect(tp.shadowRoot?.querySelector('[part="label"]')).toHaveAttribute('hidden');
    expect(tp.shadowRoot?.querySelector('[part="prefix"]')).toHaveAttribute('hidden');
  });

  /* ---------------------------- Locale and format ---------------------------- */

  it('should use the 24-hour clock by default, whatever the `locale`', async () => {
    const { root } = await render(<bq-time-picker locale="en-US" name="time" value="14:30" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(tp.hourFormat).toBe('24');
    expect(tp).toEqualAttribute('hour-format', '24');
    expect(getSegmentFields(tp)).toEqual(['hour', 'minute']);
    expect(getSegment(tp, 'hour')?.textContent).toBe('14');
  });

  it('should use the 12-hour clock with `hour-format="12"`', async () => {
    const { root } = await render(<bq-time-picker hourFormat="12" locale="en-US" name="time" value="14:30" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(getSegmentFields(tp)).toEqual(['hour', 'minute', 'dayPeriod']);
    expect(getSegment(tp, 'hour')?.textContent).toBe('02');
    expect(getSegment(tp, 'dayPeriod')?.textContent).toBe('PM');
    expect(tp.value).toBe('14:30');
  });

  it('should switch the clock when `hour-format` changes', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker hourFormat="24" locale="en-US" name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(getSegmentFields(tp)).toEqual(['hour', 'minute']);

    tp.hourFormat = '12';
    await waitForChanges();
    await waitForStable(root);

    expect(getSegmentFields(tp)).toEqual(['hour', 'minute', 'dayPeriod']);
  });

  it('should order the panel columns like the field segments', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker hourFormat="12" locale="ko-KR" name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    expect(getSegmentFields(tp)[0]).toBe('dayPeriod');
    expect(getColumnFields(tp)).toEqual(getSegmentFields(tp));
  });

  /* ------------------------------ Segment typing ----------------------------- */

  it('should commit a typed time and emit `bqChange`', async () => {
    const { root, spyOnEvent } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqChange = spyOnEvent('bqChange');

    await typeInSegment(tp, 'hour', '0930');

    expect(tp.value).toBe('09:30');
    expect(bqChange).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventDetail({ value: '09:30', el: tp });
  });

  it('should auto-pad unambiguous digits and move to the next segment', async () => {
    const { root } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '7');

    expect(getSegment(tp, 'hour')?.textContent).toBe('07');
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'minute'));
  });

  it('should keep a partial time out of the value', async () => {
    const { root } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '1');

    expect(getSegment(tp, 'hour')?.textContent).toBe('1');
    expect(tp.value).toBeUndefined();
  });

  it('should set the day period from a typed letter', async () => {
    const { root } = await render(<bq-time-picker hourFormat="12" locale="en-US" name="time" value="02:30" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'dayPeriod', 'p');

    expect(tp.value).toBe('14:30');
  });

  it('should step a segment with the arrow keys, wrapping around', async () => {
    const { root } = await render(<bq-time-picker name="time" value="23:58" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '{ArrowUp}');
    expect(tp.value).toBe('00:58');

    await typeInSegment(tp, 'minute', '{ArrowUp}{ArrowUp}');
    expect(tp.value).toBe('00:00');

    await typeInSegment(tp, 'minute', '{ArrowDown}');
    expect(tp.value).toBe('00:59');
  });

  it('should step an empty segment to the first or last option', async () => {
    const { root } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '{ArrowUp}');
    expect(getSegment(tp, 'hour')?.textContent).toBe('00');

    await typeInSegment(tp, 'minute', '{ArrowDown}');
    expect(tp.value).toBe('00:59');
  });

  it('should step by `minute-step` and skip disabled options', async () => {
    const { root } = await render(<bq-time-picker max="10:30" min="10:00" minuteStep={15} name="time" value="10:15" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'minute', '{ArrowUp}');
    expect(tp.value).toBe('10:30');

    await typeInSegment(tp, 'minute', '{ArrowUp}');
    expect(tp.value).toBe('10:00');
  });

  it('should move between segments with ArrowLeft, ArrowRight, Home and End', async () => {
    const { root } = await render(<bq-time-picker name="time" precision="second" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '{ArrowRight}');
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'minute'));

    await userEvent.keyboard('{End}');
    await nextFrame();
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'second'));

    await userEvent.keyboard('{Home}');
    await nextFrame();
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'hour'));

    await userEvent.keyboard('{ArrowLeft}');
    await nextFrame();
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'hour'));
  });

  it('should clear a segment with Backspace and keep the value empty', async () => {
    const { root, spyOnEvent } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqChange = spyOnEvent('bqChange');

    await typeInSegment(tp, 'minute', '{Backspace}');

    expect(getSegment(tp, 'minute')?.textContent).toBe('mm');
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'hour'));
    expect(tp.value).toBe('09:30');

    await userEvent.keyboard('{Backspace}');
    await nextFrame();

    expect(tp.value).toBeUndefined();
    expect(bqChange).toHaveReceivedEventDetail({ value: undefined, el: tp });
  });

  it('should flag an incomplete time as bad input once the field is blurred', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '09');
    (tp.shadowRoot?.activeElement as HTMLElement | null)?.blur();
    await waitForChanges();

    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-invalid', 'true');
  });

  /* ------------------------------- Constraints ------------------------------- */

  it('should flag a typed time out of range, then clamp it on blur', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker max="17:00" min="09:00" name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '0815');

    expect(tp.value).toBe('08:15');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-invalid', 'true');

    getSegment(tp, 'minute')?.blur();
    await waitForChanges();

    expect(tp.value).toBe('09:00');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-invalid', 'false');
  });

  it('should keep an off-step value and flag it as invalid', async () => {
    const { root } = await render(<bq-time-picker minuteStep={15} name="time" value="10:10" />);
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    expect(tp.value).toBe('10:10');
    expect(getSegment(tp, 'minute')).toEqualAttribute('aria-invalid', 'true');
  });

  it('should disable panel options outside of `min` and `max`', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker max="17:00" min="09:30" name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    expect(getOption(tp, 'hour', 8)).toEqualAttribute('aria-disabled', 'true');
    expect(getOption(tp, 'hour', 9)).not.toHaveAttribute('aria-disabled');
    expect(getOption(tp, 'hour', 18)).toEqualAttribute('aria-disabled', 'true');
    expect(getOption(tp, 'minute', 0)).toEqualAttribute('aria-disabled', 'true');
    expect(getOption(tp, 'minute', 30)).not.toHaveAttribute('aria-disabled');
  });

  it('should only render options matching the steps', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker hourStep={6} minuteStep={20} name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    const values = (field: TField) =>
      Array.from(getColumn(tp, field)?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).map(
        (option) => option.dataset.value,
      );

    expect(values('hour')).toEqual(['0', '6', '12', '18']);
    expect(values('minute')).toEqual(['0', '20', '40']);
  });

  /* ---------------------------------- Panel ---------------------------------- */

  it('should render the panel columns as listboxes', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    const panel = tp.shadowRoot?.querySelector('[part="container"]');
    expect(panel).toEqualAttribute('role', 'dialog');
    expect(getColumn(tp, 'hour')).toEqualAttribute('role', 'listbox');
    expect(getColumn(tp, 'hour')).toEqualAttribute('aria-labelledby', getColumnHeader(tp, 'hour')?.id);
    expect(getSelectedOption(tp, 'hour')?.dataset.value).toBe('9');
    expect(getSelectedOption(tp, 'hour')).toEqualAttribute('tabindex', '0');
    expect(getOption(tp, 'hour', 10)).toEqualAttribute('tabindex', '-1');
  });

  it.each([
    ['en-US', '12', ['hour', 'minute', 'second', 'AM/PM']],
    ['de-DE', '24', ['Stunde', 'Minute', 'Sekunde']],
  ] as const)('should render a localized header above each column for `%s`', async (locale, hourFormat, headers) => {
    const { root, waitForChanges } = await render(
      <bq-time-picker hourFormat={hourFormat} locale={locale} name="time" precision="second" value="09:30:00" />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    const fields: TField[] = ['hour', 'minute', 'second', 'dayPeriod'];
    const rendered = fields.map((field) => getColumnHeader(tp, field)?.textContent).filter(Boolean);
    expect(rendered).toEqual(headers);
  });

  it('should keep the column headers in place while the columns scroll', async () => {
    const { root, waitForChanges } = await render(
      <bq-time-picker
        name="time"
        style={{ '--bq-time-picker--column-header-text-color': 'rgb(255, 0, 0)' }}
        value="09:30"
      />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);
    await settle();

    const column = getColumn(tp, 'minute');
    const header = getColumnHeader(tp, 'minute');
    expect(header).toEqualAttribute('part', 'column-header');
    expect(column?.contains(header ?? null)).toBe(false);
    expect(getComputedStyle(header as HTMLElement).color).toBe('rgb(255, 0, 0)');

    const headerTop = header?.getBoundingClientRect().top;
    column?.scrollTo({ top: 0, behavior: 'auto' });
    column?.scrollTo({ top: 400, behavior: 'auto' });
    await settle();

    expect(column?.scrollTop).toBeGreaterThan(0);
    expect(header?.getBoundingClientRect().top).toBe(headerTop);
    expect((header as HTMLElement).getBoundingClientRect().bottom).toBeLessThanOrEqual(
      (column as HTMLElement).getBoundingClientRect().top,
    );
  });

  it('should open the panel from the clock trigger and focus the first column', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;

    getInnerButton(tp, 'time-trigger')?.click();
    await waitForChanges();
    await settle();

    expect(tp.open).toBe(true);
    expect(tp.shadowRoot?.activeElement).toBe(getSelectedOption(tp, 'hour'));
  });

  it('should open the panel with Alt+ArrowDown', async () => {
    const { root } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '{Alt>}{ArrowDown}{/Alt}');
    await settle();

    expect(tp.open).toBe(true);
    expect(tp.shadowRoot?.activeElement).toBe(getOption(tp, 'hour', 0));
  });

  it('should open the panel from a segment click and keep focus on the segment', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    getSegment(tp, 'minute')?.click();
    await waitForChanges();
    await settle();

    expect(tp.open).toBe(true);
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'minute'));
  });

  it('should fill empty fields with the first allowed time when an option is picked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-time-picker min="08:15" name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await openPanel(tp, waitForChanges);

    getOption(tp, 'hour', 8)?.click();
    await waitForChanges();

    expect(tp.value).toBe('08:15');
    expect(tp.open).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should show a fixed minute column on a 24-hour clock at hour precision', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" precision="hour" value="14:00" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    const minuteColumn = getColumn(tp, 'minute');
    const options = minuteColumn?.querySelectorAll<HTMLElement>('[role="option"]') ?? [];
    expect(getColumnHeader(tp, 'minute')?.textContent).toBe('minute');
    expect(minuteColumn).toEqualAttribute('aria-disabled', 'true');
    expect(minuteColumn).toEqualAttribute('tabindex', '-1');
    expect(options).toHaveLength(1);
    expect(options[0]).toEqualText('00');
    expect(options[0]).toEqualAttribute('aria-disabled', 'true');
    expect(options[0]).toEqualAttribute('aria-selected', 'true');
    expect(options[0]).toEqualAttribute('tabindex', '-1');

    options[0].click();
    await waitForChanges();
    expect(tp.value).toBe('14:00');
    expect(tp.open).toBe(true);

    getSelectedOption(tp, 'hour')?.focus();
    await userEvent.keyboard('{ArrowRight}');
    await waitForChanges();
    expect(tp.shadowRoot?.activeElement).toBe(getSelectedOption(tp, 'hour'));

    tp.hourFormat = '12';
    await waitForChanges();
    expect(getColumn(tp, 'minute')).toBeNull();
    expect(getColumn(tp, 'dayPeriod')).not.toBeNull();
  });

  it('should close the panel after picking from the precision column', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    getOption(tp, 'minute', 45)?.click();
    await waitForChanges();
    await settle();

    expect(tp.value).toBe('09:45');
    expect(tp.open).toBe(false);
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'hour'));
  });

  it('should move the selection with the column keys and commit each move', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await openPanel(tp, waitForChanges);

    getSelectedOption(tp, 'hour')?.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(tp.value).toBe('10:30');

    await userEvent.keyboard('{PageDown}');
    await waitForChanges();
    expect(tp.value).toBe('15:30');

    await userEvent.keyboard('{End}');
    await waitForChanges();
    expect(tp.value).toBe('23:30');

    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(tp.value).toBe('23:30');

    await userEvent.keyboard('{Home}');
    await waitForChanges();
    expect(tp.value).toBe('00:30');
    expect(bqChange).toHaveReceivedEventTimes(4);
  });

  it.each([
    ['09:30:15', { hour: '9', minute: '30', second: '15' }],
    ['23:59:59', { hour: '23', minute: '59', second: '59' }],
  ])(
    'should keep the selected options of `%s` visible without empty space below the last option',
    async (value, selected) => {
      const { root, waitForChanges } = await render(<bq-time-picker name="time" precision="second" value={value} />);
      const tp = root as HTMLBqTimePickerElement;
      await openPanel(tp, waitForChanges);
      await new Promise((resolve) => setTimeout(resolve, 600));

      for (const [field, optionValue] of Object.entries(selected) as [TField, string][]) {
        const column = getColumn(tp, field) as HTMLElement;
        const options = column.querySelectorAll<HTMLElement>('[role="option"]');
        const last = options[options.length - 1];
        const option = getSelectedOption(tp, field) as HTMLElement;
        const frame = column.getBoundingClientRect();
        const rect = option.getBoundingClientRect();

        expect(option.dataset.value).toBe(optionValue);
        expect(column.scrollHeight - (last.offsetTop + last.offsetHeight)).toBeLessThanOrEqual(1);
        expect(rect.top).toBeGreaterThanOrEqual(frame.top - 1);
        expect(rect.bottom).toBeLessThanOrEqual(frame.bottom + 1);
      }
    },
  );

  it('should render options as buttons that only react once to Space', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await openPanel(tp, waitForChanges);

    const option = getOption(tp, 'minute', 30);
    expect(option?.tagName).toBe('BUTTON');
    expect(option).toEqualAttribute('type', 'button');
    expect(option).toEqualAttribute('role', 'option');

    getOption(tp, 'minute', 30)?.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    await userEvent.keyboard(' ');
    await waitForChanges();

    // A native click on the last column would close the panel, so it must stay open.
    expect(tp.open).toBe(true);
    expect(tp.value).toBe('09:31');
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should move focus between columns with ArrowLeft and ArrowRight', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    getSelectedOption(tp, 'hour')?.focus();
    await userEvent.keyboard('{ArrowRight}');
    await settle();
    expect(tp.shadowRoot?.activeElement).toBe(getSelectedOption(tp, 'minute'));

    await userEvent.keyboard('{ArrowLeft}');
    await settle();
    expect(tp.shadowRoot?.activeElement).toBe(getSelectedOption(tp, 'hour'));
  });

  it('should close the panel with Escape and return focus to the field', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    getSelectedOption(tp, 'minute')?.focus();
    await userEvent.keyboard('{Escape}');
    await waitForChanges();
    await settle();

    expect(tp.open).toBe(false);
    expect(tp.shadowRoot?.activeElement).toEqualAttribute('role', 'spinbutton');
  });

  it('should pick the focused option and close the panel with Enter', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    getOption(tp, 'hour', 0)?.focus();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(tp.value).toBe('00:00');
    expect(tp.open).toBe(false);
  });

  it('should set the current time with the Now button', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 0, 1, 14, 37, 12));
    const { root, spyOnEvent, waitForChanges } = await render(<bq-time-picker minuteStep={5} name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await openPanel(tp, waitForChanges);

    getInnerButton(tp, 'now-btn')?.click();
    await waitForChanges();

    expect(tp.value).toBe('14:35');
    expect(tp.open).toBe(false);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should disable the Now button when the current time is out of range', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 0, 1, 20, 0, 0));
    const { root, waitForChanges } = await render(<bq-time-picker max="17:00" name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    expect(getInnerButton(tp, 'now-btn')).toHaveAttribute('disabled');
  });

  it('should hide the Now button when `disable-now` is set', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker disableNow name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    expect(tp.shadowRoot?.querySelector('[part~="now-btn"]')).toBeNull();
    expect(tp.shadowRoot?.querySelector('[part~="confirm-btn"]')).not.toBeNull();
  });

  it('should render custom footer button labels', async () => {
    const { root, waitForChanges } = await render(
      <bq-time-picker labels={{ confirm: 'Apply', now: 'Current' }} name="time" />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    expect(tp.shadowRoot?.querySelector('[part~="now-btn"]')?.textContent).toBe('Current');
    expect(tp.shadowRoot?.querySelector('[part~="confirm-btn"]')?.textContent).toBe('Apply');
  });

  /* ----------------------------- Require confirm ----------------------------- */

  it('should keep panel picks as a draft until confirmed with `require-confirm`', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-time-picker name="time" requireConfirm value="09:30" />,
    );
    const tp = root as HTMLBqTimePickerElement;
    const bqChange = spyOnEvent('bqChange');
    await openPanel(tp, waitForChanges);

    getOption(tp, 'hour', 11)?.click();
    getOption(tp, 'minute', 15)?.click();
    await waitForChanges();

    expect(getSegmentText(tp)).toBe('09:30');
    expect(getSelectedOption(tp, 'hour')).toEqualAttribute('data-value', '11');
    expect(getSelectedOption(tp, 'minute')).toEqualAttribute('data-value', '15');
    expect(tp.value).toBe('09:30');
    expect(tp.open).toBe(true);
    expect(bqChange).toHaveReceivedEventTimes(0);

    getInnerButton(tp, 'confirm-btn')?.click();
    await waitForChanges();

    expect(tp.value).toBe('11:15');
    expect(getSegmentText(tp)).toBe('11:15');
    expect(tp.open).toBe(false);
    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should discard the draft when the panel closes without confirming', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" requireConfirm value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    getOption(tp, 'hour', 11)?.click();
    await waitForChanges();
    getSelectedOption(tp, 'hour')?.focus();
    await userEvent.keyboard('{Escape}');
    await waitForChanges();

    expect(tp.value).toBe('09:30');
    expect(getSegmentText(tp)).toBe('09:30');
  });

  it('should confirm the draft with Enter', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" requireConfirm value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    getSelectedOption(tp, 'hour')?.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitForChanges();
    expect(tp.value).toBe('09:30');
    expect(getSegmentText(tp)).toBe('09:30');

    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(tp.value).toBe('10:30');
    expect(getSegmentText(tp)).toBe('10:30');
    expect(tp.open).toBe(false);
  });

  it('should keep the Now draft out of the field until confirmed', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2024, 0, 1, 14, 45, 0));
    const { root, waitForChanges } = await render(<bq-time-picker name="time" requireConfirm value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    getInnerButton(tp, 'now-btn')?.click();
    await waitForChanges();

    expect(getSegmentText(tp)).toBe('09:30');
    expect(getSelectedOption(tp, 'hour')).toEqualAttribute('data-value', '14');
    expect(tp.value).toBe('09:30');

    getInnerButton(tp, 'confirm-btn')?.click();
    await waitForChanges();

    expect(tp.value).toBe('14:45');
  });

  it('should commit typed segments directly with `require-confirm`', async () => {
    const { root } = await render(<bq-time-picker name="time" requireConfirm />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '1015');

    expect(tp.value).toBe('10:15');
  });

  /* ---------------------------------- Clear ---------------------------------- */

  it('should clear the value with the clear button', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqClear = spyOnEvent('bqClear');
    const bqChange = spyOnEvent('bqChange');

    getClearButton(tp)?.shadowRoot?.querySelector('button')?.click();
    await waitForChanges();

    expect(tp.value).toBeUndefined();
    expect(getSegmentText(tp)).toBe('hh:mm');
    expect(bqClear).toHaveReceivedEventTimes(1);
    expect(bqChange).toHaveReceivedEventDetail({ value: undefined, el: tp });
  });

  it('should clear the value through the public `clear()` method', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqClear = spyOnEvent('bqClear');

    await tp.clear();
    await waitForChanges();

    expect(tp.value).toBeUndefined();
    expect(bqClear).toHaveReceivedEventTimes(1);
  });

  it('should not render the clear button when `disable-clear` is set or there is no value', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker disableClear name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(getClearButton(tp)).toBeNull();

    tp.disableClear = false;
    tp.value = undefined;
    await waitForChanges();
    await waitForStable(root);

    expect(getClearButton(tp)).toBeNull();
  });

  /* ------------------------- Disabled and read-only ------------------------- */

  it('should not open, edit or clear when `disabled`', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker disabled name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;

    tp.open = true;
    await waitForChanges();
    await tp.clear();
    await waitForChanges();

    expect(tp.open).toBe(false);
    expect(tp.value).toBe('09:30');
    expect(getClearButton(tp)).toBeNull();
    expect(getSegment(tp, 'hour')).toEqualAttribute('tabindex', '-1');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-disabled', 'true');
    expect(getInnerButton(tp, 'time-trigger')).toHaveAttribute('disabled');
  });

  it('should keep segments focusable but not editable when `readonly`', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" readonly value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;

    await typeInSegment(tp, 'hour', '{ArrowUp}1');
    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'hour'));
    expect(tp.value).toBe('09:30');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-readonly', 'true');

    tp.open = true;
    await waitForChanges();

    expect(tp.open).toBe(false);
    expect(getClearButton(tp)).toBeNull();
  });

  /* ----------------------------------- Form ---------------------------------- */

  it('should submit the value with the form', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-time-picker name="start" value="09:30" />
        <bq-time-picker name="end" readonly value="17:00" />
        <bq-time-picker disabled name="break" value="12:00" />
      </form>,
    );
    const form = root as HTMLFormElement;
    await waitForChanges();

    const data = new FormData(form);
    expect(data.get('start')).toBe('09:30');
    expect(data.get('end')).toBe('17:00');
    expect(data.has('break')).toBe(false);
  });

  it('should associate with a form through the `form` attribute', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <form id="schedule" />
        <bq-time-picker form="schedule" name="start" value="09:30" />
      </div>,
    );
    const form = root.querySelector<HTMLFormElement>('#schedule');
    await waitForChanges();

    expect(new FormData(form).get('start')).toBe('09:30');
  });

  it('should restore the initial value on form reset', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-time-picker name="time" value="09:30" />
      </form>,
    );
    const form = root as HTMLFormElement;
    const tp = form.querySelector<HTMLBqTimePickerElement>('bq-time-picker');

    tp.value = '11:00';
    await waitForChanges();
    form.reset();
    await waitForChanges();

    expect(tp.value).toBe('09:30');
    expect(getSegmentText(tp)).toBe('09:30');
  });

  it('should block form submission when `required` and empty', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-time-picker name="time" required />
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

  it('should focus a segment when the form reports the error, so blurring it dismisses the message', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-time-picker name="time" required />
        <button type="button">Outside</button>
      </form>,
    );
    const form = root as HTMLFormElement;
    const tp = form.querySelector<HTMLBqTimePickerElement>('bq-time-picker');
    await waitForChanges();

    expect(form.reportValidity()).toBe(false);
    await waitForChanges();

    const focused = tp.shadowRoot.activeElement as HTMLElement;
    expect(document.activeElement).toBe(tp);
    expect(focused).toEqualAttribute('role', 'spinbutton');
    expect(focused.dataset.segmentField).toBe('hour');

    form.querySelector('button').focus();
    expect(tp.shadowRoot.activeElement).toBeNull();
  });

  it('should block form submission when the value is out of range', async () => {
    const { root, waitForChanges } = await render(
      <form>
        <bq-time-picker max="17:00" name="time" value="18:00" />
      </form>,
    );
    const form = root as HTMLFormElement;
    const tp = form.querySelector<HTMLBqTimePickerElement>('bq-time-picker');
    await waitForChanges();

    expect(form.checkValidity()).toBe(false);

    tp.value = '16:00';
    await waitForChanges();

    expect(form.checkValidity()).toBe(true);
  });

  /* ------------------------------ Props and API ------------------------------ */

  it('should reflect its props to attributes', async () => {
    const { root } = await render(
      <bq-time-picker
        disableClear
        name="time"
        precision="second"
        required
        validationStatus="warning"
        value="09:30:15"
      />,
    );
    const tp = root as HTMLBqTimePickerElement;

    expect(tp).toHaveAttribute('disable-clear');
    expect(tp).toEqualAttribute('name', 'time');
    expect(tp).toEqualAttribute('precision', 'second');
    expect(tp).toHaveAttribute('required');
    expect(tp).toEqualAttribute('validation-status', 'warning');
    expect(tp).toEqualAttribute('value', '09:30:15');
  });

  it('should fall back to the defaults when given invalid prop values', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root } = await render(
      <bq-time-picker
        hourFormat={'13' as never}
        name="time"
        placement={'middle' as never}
        precision={'millisecond' as never}
        strategy={'sticky' as never}
        validationStatus={'danger' as never}
      />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    expect(tp.hourFormat).toBe('24');
    expect(tp.placement).toBe('bottom-end');
    expect(tp.precision).toBe('minute');
    expect(tp.strategy).toBe('fixed');
    expect(tp.validationStatus).toBe('none');
    expect(warn).toHaveBeenCalled();
  });

  it('should use the default labels when `labels` is not set', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    expect(getInnerButton(tp, 'clear-btn')).toEqualAttribute('aria-label', 'Clear');
    expect(getInnerButton(tp, 'time-trigger')).toEqualAttribute('aria-label', 'Open time picker');
    expect(tp.shadowRoot?.querySelector('[part="container"]')).toEqualAttribute('aria-label', 'Choose time');
    expect(tp.shadowRoot?.querySelector('[part~="now-btn"]')).toEqualText('Now');
    expect(tp.shadowRoot?.querySelector('[part~="confirm-btn"]')).toEqualText('OK');
  });

  it('should apply the `labels` to the headers, segments, day periods and buttons', async () => {
    const labels = {
      hour: 'Heure',
      minute: 'Minute',
      second: 'Seconde',
      am: 'matin',
      pm: 'soir',
      now: 'Maintenant',
      clear: 'Effacer',
      confirm: 'Valider',
      openPanel: 'Ouvrir',
      panelLabel: "Choisir l'heure",
    };
    const { root, waitForChanges } = await render(
      <bq-time-picker hourFormat="12" labels={labels} name="time" precision="second" value="02:30:00" />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    const fields: TField[] = ['hour', 'minute', 'second', 'dayPeriod'];
    expect(fields.map((field) => getColumnHeader(tp, field)?.textContent)).toEqual([
      'Heure',
      'Minute',
      'Seconde',
      'matin/soir',
    ]);
    expect(fields.map((field) => getSegment(tp, field)?.getAttribute('aria-label'))).toEqual([
      'Heure',
      'Minute',
      'Seconde',
      'matin/soir',
    ]);
    expect(getSegment(tp, 'dayPeriod')).toEqualText('matin');
    expect(getOption(tp, 'dayPeriod', 'pm')).toEqualText('soir');
    expect(getInnerButton(tp, 'clear-btn')).toEqualAttribute('aria-label', 'Effacer');
    expect(getInnerButton(tp, 'time-trigger')).toEqualAttribute('aria-label', 'Ouvrir');
    expect(tp.shadowRoot?.querySelector('[part="container"]')).toEqualAttribute('aria-label', "Choisir l'heure");
    expect(tp.shadowRoot?.querySelector('[part~="now-btn"]')).toEqualText('Maintenant');
    expect(tp.shadowRoot?.querySelector('[part~="confirm-btn"]')).toEqualText('Valider');

    tp.labels = { ...labels, period: 'Période' };
    await waitForChanges();
    expect(getColumnHeader(tp, 'dayPeriod')).toEqualText('Période');

    await typeInSegment(tp, 'dayPeriod', 's');
    expect(tp.value).toBe('14:30:00');
  });

  it('should accept the `labels` as a JSON string and ignore invalid JSON', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(
      <bq-time-picker labels='{"clear":"Reset time","openPanel":"Choose a time"}' name="time" value="09:30" />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    expect(getInnerButton(tp, 'clear-btn')).toEqualAttribute('aria-label', 'Reset time');
    expect(getInnerButton(tp, 'time-trigger')).toEqualAttribute('aria-label', 'Choose a time');

    tp.labels = '{clear:';
    await waitForChanges();
    expect(getInnerButton(tp, 'clear-btn')).toEqualAttribute('aria-label', 'Clear');
    expect(warn).toHaveBeenCalled();
  });

  it('should apply the `validation-status` to the control and segments', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" validationStatus="success" />);
    const tp = root as HTMLBqTimePickerElement;
    const control = tp.shadowRoot?.querySelector('[part="control"]');

    expect(control).toHaveClass('validation-success');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-invalid', 'false');

    tp.validationStatus = 'error';
    await waitForChanges();
    await waitForStable(root);

    expect(control).toHaveClass('validation-error');
    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-invalid', 'true');
  });

  it('should only render second options matching the `second-step`', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" precision="second" secondStep={15} />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    const seconds = Array.from(getColumn(tp, 'second')?.querySelectorAll<HTMLElement>('[role="option"]') ?? []).map(
      (option) => option.dataset.value,
    );
    expect(seconds).toEqual(['0', '15', '30', '45']);
  });

  it('should forward the floating props to the dropdown', async () => {
    const { root } = await render(
      <bq-time-picker
        distance={12}
        name="time"
        panelHeight="200px"
        placement="top-start"
        skidding={4}
        strategy="absolute"
      />,
    );
    const tp = root as HTMLBqTimePickerElement;
    const dropdown = tp.shadowRoot?.querySelector<HTMLBqDropdownElement>('bq-dropdown');

    expect(dropdown?.distance).toBe(12);
    expect(dropdown?.panelHeight).toBe('200px');
    expect(dropdown?.placement).toBe('top-start');
    expect(dropdown?.skidding).toBe(4);
    expect(dropdown?.strategy).toBe('absolute');
  });

  /* ------------------------------ Accessibility ------------------------------ */

  it('should mark the segments as required when `required`', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" />);
    const tp = root as HTMLBqTimePickerElement;

    expect(getSegment(tp, 'hour')).not.toHaveAttribute('aria-required');

    tp.required = true;
    await waitForChanges();
    await waitForStable(root);

    expect(getSegment(tp, 'hour')).toEqualAttribute('aria-required', 'true');
    expect(getSegment(tp, 'minute')).toEqualAttribute('aria-required', 'true');
  });

  it('should describe the field with the validation message when a constraint fails', async () => {
    const { root, waitForChanges } = await render(
      <bq-time-picker formValidationMessage="Pick a time during office hours" min="09:00" name="time" />,
    );
    const tp = root as HTMLBqTimePickerElement;
    const group = tp.shadowRoot?.querySelector<HTMLElement>('[part="input"]');

    expect(group).toEqualAttribute('aria-describedby', 'bq-time-picker__mask-time');

    tp.value = '08:00';
    await waitForChanges();
    await waitForStable(root);

    expect(group).toEqualAttribute('aria-describedby', 'bq-time-picker__mask-time bq-time-picker__error-time');
    expect(tp.shadowRoot?.getElementById('bq-time-picker__error-time')).toEqualText('Pick a time during office hours');

    tp.value = '10:00';
    await waitForChanges();
    await waitForStable(root);

    expect(group).toEqualAttribute('aria-describedby', 'bq-time-picker__mask-time');
    expect(tp.shadowRoot?.getElementById('bq-time-picker__error-time')).toBeNull();
  });

  /* ------------------------------ Slots and parts ---------------------------- */

  it('should render the label and prefix slot content', async () => {
    const { root } = await render(
      <bq-time-picker name="time">
        <span slot="label">Start time</span>
        <span slot="prefix">At</span>
      </bq-time-picker>,
    );
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    const label = tp.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="label"]');
    const prefix = tp.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="prefix"]');
    expect(label?.assignedElements()[0]).toEqualText('Start time');
    expect(prefix?.assignedElements()[0]).toEqualText('At');
    expect(tp.shadowRoot?.querySelector('[part="input"]')).toEqualAttribute(
      'aria-labelledby',
      'bq-time-picker__label-time',
    );
  });

  it('should render custom suffix and clear-icon slot content', async () => {
    const { root } = await render(
      <bq-time-picker name="time" value="09:30">
        <bq-icon name="alarm" slot="suffix" />
        <bq-icon name="trash" slot="clear-icon" />
      </bq-time-picker>,
    );
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    const suffix = tp.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="suffix"]');
    const clearIcon = tp.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="clear-icon"]');
    expect(suffix?.assignedElements()[0]).toEqualAttribute('name', 'alarm');
    expect(clearIcon?.assignedElements()[0]).toEqualAttribute('name', 'trash');
  });

  it('should expose its shadow parts', async () => {
    const { root, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    const parts = [
      'base',
      'label',
      'control',
      'prefix',
      'suffix',
      'input',
      'segment',
      'segment-literal',
      'clear-btn',
      'time-trigger',
      'container',
      'columns',
      'column',
      'column-header',
      'option',
      'option-selected',
      'footer',
      'now-btn',
    ];
    for (const part of parts) {
      expect(tp.shadowRoot?.querySelector(`[part~="${part}"]`), part).not.toBeNull();
    }
  });

  it('should apply the CSS custom properties', async () => {
    const { root } = await render(
      <bq-time-picker name="time" style={{ '--bq-time-picker--border-color': 'rgb(255, 0, 0)' }} />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    const control = tp.shadowRoot?.querySelector<HTMLElement>('[part="control"]');
    expect(getComputedStyle(control).borderTopColor).toBe('rgb(255, 0, 0)');
  });

  it('should color the validation border through the component variable', async () => {
    const { root } = await render(
      <bq-time-picker
        name="time"
        style={{ '--bq-time-picker--border-color-danger': 'rgb(0, 128, 0)' }}
        validationStatus="error"
      />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);

    const control = tp.shadowRoot?.querySelector<HTMLElement>('[part="control"]');
    expect(getComputedStyle(control).borderTopColor).toBe('rgb(0, 128, 0)');
  });

  it.each([
    ['`--bq-text--on-brand`', 'rgb(4, 5, 6)', 'rgb(4, 5, 6)'],
    ['the `--bq-text--alt` fallback', 'initial', 'rgb(1, 2, 3)'],
  ])('should color the selected option with %s', async (_, onBrand, expected) => {
    const { root, waitForChanges } = await render(
      <bq-time-picker
        name="time"
        style={{ '--bq-text--alt': 'rgb(1, 2, 3)', '--bq-text--on-brand': onBrand }}
        value="09:30"
      />,
    );
    const tp = root as HTMLBqTimePickerElement;
    await openPanel(tp, waitForChanges);

    expect(getComputedStyle(getSelectedOption(tp, 'hour')).color).toBe(expected);
  });

  /* --------------------------------- Events ---------------------------------- */

  it('should emit focus and blur events only when focus enters or leaves the component', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <div>
        <bq-time-picker name="time" requireConfirm />
        <button type="button">Outside</button>
      </div>,
    );
    const tp = root.querySelector<HTMLBqTimePickerElement>('bq-time-picker');
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');

    getSegment(tp, 'hour')?.focus();
    getSegment(tp, 'minute')?.focus();
    getInnerButton(tp, 'time-trigger')?.focus();
    await openPanel(tp, waitForChanges);
    getOption(tp, 'hour', 10)?.focus();
    getInnerButton(tp, 'confirm-btn')?.click();
    await waitForChanges();
    await settle();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);

    root.querySelector('button')?.focus();
    await waitForChanges();

    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should not leak the internal button events', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(<bq-time-picker name="time" value="09:30" />);
    const tp = root as HTMLBqTimePickerElement;
    const bqClick = spyOnEvent('bqClick');
    const bqFocus = spyOnEvent('bqFocus');
    await openPanel(tp, waitForChanges);

    getInnerButton(tp, 'confirm-btn')?.focus();
    getInnerButton(tp, 'confirm-btn')?.click();
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqFocus).toHaveReceivedEventDetail(tp);
  });

  it('should focus the first segment when `autofocus` is set', async () => {
    const { root } = await render(<bq-time-picker autofocus name="time" />);
    const tp = root as HTMLBqTimePickerElement;
    await waitForStable(root);
    await settle();

    expect(tp.shadowRoot?.activeElement).toBe(getSegment(tp, 'hour'));
  });
});

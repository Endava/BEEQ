import { newE2EPage } from '@stencil/core/testing';

describe('bq-date-picker', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker></bq-date-picker>',
    });
    const element = await page.find('bq-date-picker');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker></bq-date-picker>',
    });
    const element = await page.find('bq-date-picker');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render with date picker panel opened', async () => {
    const page = await newE2EPage({
      html: `
        <bq-date-picker open />
      `,
    });
    const selectPanelElem = await page.find('bq-date-picker >>> .bq-date-picker__dropdown >>> .bq-dropdown__panel');

    expect(selectPanelElem).toHaveAttribute('open');
  });

  it('should render single type of date picker', async () => {
    const page = await newE2EPage({
      html: `
        <bq-date-picker open type="single" />
      `,
    });
    const calendarDefaultElement = await page.find('bq-date-picker >>> calendar-date');

    expect(calendarDefaultElement).not.toBeNull();
  });

  it('should render range type of date picker', async () => {
    const page = await newE2EPage({
      html: `
        <bq-date-picker open type="range" />
      `,
    });
    const calendarRangeElement = await page.find('bq-date-picker >>> calendar-range');

    expect(calendarRangeElement).not.toBeNull();
  });

  it('should render multi type of date picker', async () => {
    const page = await newE2EPage({
      html: `
        <bq-date-picker open type="multi" />
      `,
    });
    const calendarMultiElement = await page.find('bq-date-picker >>> calendar-multi');

    expect(calendarMultiElement).not.toBeNull();
  });

  it('should render multiple months for range type of date picker', async () => {
    const page = await newE2EPage({
      html: `
        <bq-date-picker open type="range" months="4" />
      `,
    });
    const calendarMonthElement = await page.findAll('bq-date-picker >>> calendar-month');

    expect(calendarMonthElement.length).toEqual(4);
  });

  it('should clamp input value to min when below range', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker type="single" min="2024-05-20" max="2024-05-30"></bq-date-picker>',
    });

    await page.type('bq-date-picker >>> input', '2024-05-10');
    await page.keyboard.press('Tab');
    await page.waitForChanges();

    const datePicker = await page.find('bq-date-picker');
    const value = await datePicker.getProperty('value');
    expect(value).toBe('2024-05-20');
  });

  it('should clamp input value to max when above range', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker type="single" min="2024-05-20" max="2024-05-30"></bq-date-picker>',
    });

    await page.type('bq-date-picker >>> input', '2024-06-10');
    await page.keyboard.press('Tab');
    await page.waitForChanges();

    const datePicker = await page.find('bq-date-picker');
    const value = await datePicker.getProperty('value');
    expect(value).toBe('2024-05-30');
  });

  it('should toggle views when heading is clicked if allow-header-view-toggle is true', async () => {
    const page = await newE2EPage({
      html: '<bq-date-picker open allow-header-view-toggle calendarView="days"></bq-date-picker>',
    });

    const headingBtn = await page.find('bq-date-picker >>> .bq-date-picker__heading-btn');
    expect(headingBtn).not.toBeNull();
    // Initially: days grid exists
    let dayGridMonth = await page.find('bq-date-picker >>> calendar-month');
    expect(dayGridMonth).not.toBeNull();

    // Click 1 → months
    await headingBtn.click();
    await page.waitForChanges();
    let monthsContainer = await page.find('bq-date-picker >>> .bq-date-picker_custom_container');
    dayGridMonth = await page.find('bq-date-picker >>> calendar-month');
    expect(monthsContainer).not.toBeNull();
    expect(dayGridMonth).toBeNull();

    // Click 2 → years
    await headingBtn.click();
    await page.waitForChanges();
    const yearsContainer = await page.find('bq-date-picker >>> .bq-date-picker_custom_container');
    expect(yearsContainer).not.toBeNull();

    // Click 3 → decades
    await headingBtn.click();
    await page.waitForChanges();
    const decadesContainer = await page.find('bq-date-picker >>> .bq-date-picker_custom_container');
    expect(decadesContainer).not.toBeNull();
  });

  it('should not toggle views when heading is clicked if allow-header-view-toggle is false', async () => {
    const page = await newE2EPage({ html: '<bq-date-picker open calendarView="days"></bq-date-picker>' });

    const headingBtn = await page.find('bq-date-picker >>> .bq-date-picker__heading-btn');
    expect(await headingBtn.getProperty('disabled')).toBe(true);

    const dayGridMonth = await page.find('bq-date-picker >>> calendar-month');
    expect(dayGridMonth).not.toBeNull();

    await headingBtn.click();
    await page.waitForChanges();

    const stillDayGrid = await page.find('bq-date-picker >>> calendar-month');
    expect(stillDayGrid).not.toBeNull();
  });
});

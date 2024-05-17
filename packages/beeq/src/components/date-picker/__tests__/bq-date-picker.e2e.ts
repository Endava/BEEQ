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
});

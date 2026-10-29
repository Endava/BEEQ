import { describe, expect, it } from 'vitest';

import { getDayPeriodLabels, getLocaleHourCycle, getTimeMask } from '../date';

const fields = (locale: string, precision: 'hour' | 'minute' | 'second', hourCycle?: 'h12' | 'h23') =>
  getTimeMask(locale, precision, hourCycle).segments.map((segment) => segment.field);

describe(getLocaleHourCycle.name, () => {
  it('should resolve the locale hour cycle', () => {
    expect(getLocaleHourCycle('en-GB')).toBe('h23');
    expect(getLocaleHourCycle('en-US')).toBe('h12');
  });
});

describe(getDayPeriodLabels.name, () => {
  it('should return localized AM and PM labels', () => {
    expect(getDayPeriodLabels('en-US')).toEqual(['AM', 'PM']);
    expect(getDayPeriodLabels('ko-KR')).toEqual(['오전', '오후']);
  });
});

describe(getTimeMask.name, () => {
  it('should build a 24-hour minute mask', () => {
    const mask = getTimeMask('en-GB', 'minute');

    expect(mask.template).toBe('hh:mm');
    expect(mask.hourCycle).toBe('h23');
    expect(mask.segments).toEqual([
      { field: 'hour', placeholder: 'hh', start: 0, end: 2 },
      { field: 'minute', placeholder: 'mm', start: 3, end: 5 },
    ]);
  });

  it('should render a fixed minute literal at hour precision', () => {
    const mask = getTimeMask('en-GB', 'hour');

    expect(mask.template).toBe('hh:00');
    expect(mask.segments.map((segment) => segment.field)).toEqual(['hour']);
  });

  it('should include seconds at second precision', () => {
    expect(fields('en-GB', 'second')).toEqual(['hour', 'minute', 'second']);
  });

  it('should add a trailing day period for 12-hour locales', () => {
    const mask = getTimeMask('en-US', 'minute');

    expect(mask.hourCycle).toBe('h12');
    expect(mask.segments.map((segment) => segment.field)).toEqual(['hour', 'minute', 'dayPeriod']);
    expect(mask.segments[2].placeholder).toBe('AM');
  });

  it('should place the day period first when the locale does', () => {
    expect(fields('ko-KR', 'minute')).toEqual(['dayPeriod', 'hour', 'minute']);
  });

  it('should use locale-specific separators', () => {
    expect(getTimeMask('fi-FI', 'second').template).toBe('hh.mm.ss');
  });

  it('should honour an explicit hour cycle override', () => {
    expect(fields('en-GB', 'minute', 'h12')).toEqual(['hour', 'minute', 'dayPeriod']);
    expect(fields('en-US', 'minute', 'h23')).toEqual(['hour', 'minute']);
  });

  it('should keep segment offsets aligned with the template', () => {
    const mask = getTimeMask('en-US', 'second');

    for (const segment of mask.segments) {
      expect(mask.template.slice(segment.start, segment.end)).toBe(segment.placeholder);
    }
  });
});

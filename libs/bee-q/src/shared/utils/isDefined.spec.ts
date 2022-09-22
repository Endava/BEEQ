import { isDefined } from './';

describe(isDefined.name, () => {
  it('returns true if value is a String', () => {
    expect(isDefined('')).toBe(true);
  });

  it('returns true if value is a Number', () => {
    expect(isDefined(0)).toBe(true);
  });

  it('returns true if value is a Array', () => {
    expect(isDefined([])).toBe(true);
  });

  it('returns true if value is a Object', () => {
    expect(isDefined({})).toBe(true);
  });

  it('returns true if value is a boolean', () => {
    expect(isDefined(true)).toBe(true);
    expect(isDefined(false)).toBe(true);
  });

  it('returns true if value is a NaN', () => {
    expect(isDefined(NaN)).toBe(true);
  });

  it('returns false if value is an undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('returns false if value is an null', () => {
    expect(isDefined(null)).toBe(false);
  });
});

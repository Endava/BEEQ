import { isDefined } from '..';

describe(isDefined.name, () => {
  it('returns false if value is empty string', () => {
    expect(isDefined('')).toBe(false);
    expect(isDefined(``)).toBe(false);
    expect(isDefined(new String(''))).toBe(false);
    expect(isDefined(String(''))).toBe(false);
  });

  it('returns false if value is 0', () => {
    expect(isDefined(0)).toBe(false);
    expect(isDefined(-0)).toBe(false);
    expect(isDefined(0n)).toBe(false);
  });

  it('returns false if value is false', () => {
    expect(isDefined(false)).toBe(false);
  });

  it('returns false if value is NaN', () => {
    expect(isDefined(NaN)).toBe(false);
  });

  it('returns false if value is null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('returns false if value is undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('returns true if value is object', () => {
    expect(isDefined({})).toBe(true);
  });

  it('returns true if value is array', () => {
    expect(isDefined([])).toBe(true);
  });

  it('returns true if value is infinity', () => {
    expect(isDefined(Number.POSITIVE_INFINITY)).toBe(true);
    expect(isDefined(Number.NEGATIVE_INFINITY)).toBe(true);
  });
});

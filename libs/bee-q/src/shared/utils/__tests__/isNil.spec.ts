import { isNil } from '..';

describe(isNil.name, () => {
  it('returns true if value is undefined', () => {
    expect(isNil(undefined)).toBe(true);
  });

  it('returns true if value is null', () => {
    expect(isNil(null)).toBe(true);
  });

  it('returns false if value is string', () => {
    expect(isNil('')).toBe(false);
    expect(isNil(new String(''))).toBe(false);
  });

  it('returns false if value is number', () => {
    expect(isNil(0)).toBe(false);
  });

  it('returns false if value is array', () => {
    expect(isNil([])).toBe(false);
  });

  it('returns false if value is object', () => {
    expect(isNil({})).toBe(false);
  });

  it('returns false if value is boolean', () => {
    expect(isNil(true)).toBe(false);
    expect(isNil(false)).toBe(false);
  });

  it('returns false if value is NaN', () => {
    expect(isNil(NaN)).toBe(false);
  });
});

import { isEmpty } from '..';

describe(isEmpty.name, () => {
  it('should return true for empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return true for empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return true for empty set', () => {
    expect(isEmpty(new Set())).toBe(true);
  });

  it('should return true for empty Map', () => {
    expect(isEmpty(new Map())).toBe(true);
  });

  it('should return false for non empty array', () => {
    expect(isEmpty([0])).toBe(false);
  });

  it('should return false for non empty object', () => {
    expect(isEmpty({ '': 0 })).toBe(false);
  });

  it('should return false for non empty set', () => {
    expect(isEmpty(new Set([0]))).toBe(false);
  });

  it('should return false for non empty map', () => {
    const map = new Map([[false, 0]]);
    expect(isEmpty(map)).toBe(false);
  });
});

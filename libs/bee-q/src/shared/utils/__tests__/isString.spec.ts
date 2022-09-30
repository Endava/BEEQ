import { isString } from '..';

describe('isString', () => {
  it('returns true if value is a String', () => {
    expect(isString('text string')).toBe(true);
  });

  it('returns true if value is an empty String', () => {
    expect(isString('')).toBe(true);
  });

  it('returns false if value is an Object', () => {
    expect(isString({ a: 'Value 1', b: 'Value 2' })).toBe(false);
  });

  it('returns false if value is an Array', () => {
    expect(isString(['Value 1', 2, 'Value'])).toBe(false);
  });
});

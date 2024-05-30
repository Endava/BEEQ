import { clamp } from '..';

describe(clamp.name, () => {
  it('should return value', () => {
    expect(clamp(10)).toBe(10);
  });

  it('should return lower value', () => {
    expect(clamp(10, 20, 30)).toBe(20);
  });

  it('should return upper value', () => {
    expect(clamp(40, 20, 30)).toBe(30);
  });

  it('should return value unchanged', () => {
    expect(clamp(25, 20, 30)).toBe(25);
  });
});

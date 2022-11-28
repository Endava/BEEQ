import { isHTMLElement } from '..';

describe(isHTMLElement.name, () => {
  it('should return false for null', () => {
    expect(isHTMLElement(null, 'div')).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isHTMLElement(undefined, 'div')).toBe(false);
  });

  it('should return false if the tag does not match', () => {
    expect(isHTMLElement(document.createElement('span'), 'div')).toBe(false);
  });

  it('should return true if the tag does not match', () => {
    expect(isHTMLElement(document.createElement('div'), 'div')).toBe(false);
  });

  it('should return true if the tag is uppercase', () => {
    expect(isHTMLElement(document.createElement('div'), 'DIV' as unknown as 'div')).toBe(false);
  });
});

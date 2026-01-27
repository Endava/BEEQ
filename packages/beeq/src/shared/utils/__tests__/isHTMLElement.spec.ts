import { isHTMLElement } from '..';

describe(isHTMLElement.name, () => {
  describe('when target is not a Node', () => {
    it('should return false for null', () => {
      expect(isHTMLElement(null, 'div')).toBe(false);
    });

    it('should return false for undefined', () => {
      expect(isHTMLElement(undefined, 'div')).toBe(false);
    });

    it('should return false for primitive string', () => {
      expect(isHTMLElement('div', 'div')).toBe(false);
    });

    it('should return false for number', () => {
      expect(isHTMLElement(42, 'div')).toBe(false);
    });

    it('should return false for plain object with nodeName property', () => {
      expect(isHTMLElement({ nodeName: 'DIV' }, 'div')).toBe(false);
    });

    it('should return false for array', () => {
      expect(isHTMLElement([], 'div')).toBe(false);
    });
  });

  describe('when target is a non-Element Node', () => {
    it('should return false for Text node', () => {
      const textNode = document.createTextNode('hello');
      expect(isHTMLElement(textNode, 'div')).toBe(false);
    });

    it('should return false for Comment node', () => {
      const commentNode = document.createComment('comment');
      expect(isHTMLElement(commentNode, 'div')).toBe(false);
    });

    it('should return false for DocumentFragment', () => {
      const fragment = document.createDocumentFragment();
      expect(isHTMLElement(fragment, 'div')).toBe(false);
    });
  });

  describe('when target is an HTMLElement', () => {
    it('should return false if the tag does not match', () => {
      expect(isHTMLElement(document.createElement('span'), 'div')).toBe(false);
    });

    it('should return true if the tag matches', () => {
      expect(isHTMLElement(document.createElement('div'), 'div')).toBe(true);
    });

    it.each([
      ['input', 'input'],
      ['button', 'button'],
      ['a', 'a'],
      ['form', 'form'],
    ] as const)('should return true for <%s> element with matching tag', (elementTag, tag) => {
      expect(isHTMLElement(document.createElement(elementTag), tag)).toBe(true);
    });
  });

  describe('case insensitivity', () => {
    it('should match when tag parameter is uppercase', () => {
      expect(isHTMLElement(document.createElement('div'), 'DIV' as unknown as 'div')).toBe(true);
    });

    it('should match when tag parameter is mixed case', () => {
      expect(isHTMLElement(document.createElement('div'), 'DiV' as unknown as 'div')).toBe(true);
    });
  });

  describe('type guard behavior', () => {
    it('should narrow the type to HTMLInputElement for input tag', () => {
      const element: unknown = document.createElement('input');

      if (isHTMLElement(element, 'input')) {
        // Accessing HTMLInputElement-specific property
        expect(element.type).toBeDefined();
      }
    });
  });
});

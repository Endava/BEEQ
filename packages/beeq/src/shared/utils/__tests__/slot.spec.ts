import { getInnerHTML, getTextContent, hasSlot, hasSlotContent } from '../slot';

interface IHTMLSlotElement extends HTMLSlotElement {
  assignedElements: jest.Mock<
    ReturnType<HTMLSlotElement['assignedElements']>,
    Parameters<HTMLSlotElement['assignedElements']>
  >;
  assignedNodes: jest.Mock<ReturnType<HTMLSlotElement['assignedNodes']>, Parameters<HTMLSlotElement['assignedNodes']>>;
}

interface IHTMLElement extends HTMLElement {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  querySelectorAll: jest.Mock<any, Parameters<HTMLElement['querySelectorAll']>>;
  querySelector: jest.Mock<ReturnType<HTMLElement['querySelector']>, Parameters<HTMLElement['querySelector']>>;
}

function makeSlot(slotName?: string): IHTMLSlotElement {
  const slot = new HTMLElement() as IHTMLSlotElement;
  if (slotName) {
    slot.slot = slotName;
  }
  slot.assignedNodes = jest.fn();
  slot.assignedElements = jest.fn();
  return slot;
}

describe('slot', () => {
  describe('slot - getInnerHTML', () => {
    let slot: IHTMLSlotElement;

    beforeEach(() => {
      slot = makeSlot();
    });

    it('should return slot innerHTML', () => {
      slot.assignedNodes.mockImplementationOnce((options) => [document.createElement('div')]);
      expect(getInnerHTML(slot)).toEqual('<div></div>');
    });

    it('should return slot textContent', () => {
      slot.assignedNodes.mockImplementationOnce(() => [document.createTextNode('test')]);
      expect(getInnerHTML(slot)).toEqual('test');
    });

    it('should return slot innerHtml and textContent', () => {
      slot.assignedNodes.mockImplementationOnce(() => [document.createElement('div'), document.createTextNode('test')]);
      expect(getInnerHTML(slot)).toEqual('<div></div>test');
    });

    it('should ignore other nodes', () => {
      slot.assignedNodes.mockImplementationOnce(() => [document.createAttribute('test_attr')]);
      expect(getInnerHTML(slot)).toEqual('');
    });
  });

  describe('slot - getTextContent', () => {
    let slot: IHTMLSlotElement;

    beforeEach(() => {
      slot = makeSlot();
    });

    it('should return text content', () => {
      slot.assignedNodes.mockImplementationOnce(() => [document.createTextNode('   test ')]);
      expect(getTextContent(slot)).toBe('test');
    });

    it('should return text content concatenated', () => {
      slot.assignedNodes.mockImplementationOnce(() => [
        document.createTextNode('    test  '),
        document.createTextNode(' second part    '),
      ]);
      expect(getTextContent(slot)).toBe('test   second part');
    });

    it('should return nested text', () => {
      slot.assignedNodes.mockImplementationOnce(() => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `2nd level <div> 3rd level <div> 4th level </div></div>`;

        return [document.createTextNode(' 1st level '), wrapper];
      });

      expect(getTextContent(slot, { recurse: true })).toBe('1st level 2nd level  3rd level  4th level');
    });

    it('should ignore html content', () => {
      slot.assignedNodes.mockImplementationOnce(() => {
        const element = document.createElement('div');
        element.appendChild(document.createTextNode('test node here'));
        return [element];
      });
      expect(getTextContent(slot)).toBe('');
    });

    it('should only go 1 level if recurse is false', () => {
      slot.assignedNodes.mockImplementationOnce(() => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `<div> 1st level <div> 2nd level <div> 3rd level </div></div></div>`;

        return [document.createTextNode('1st level'), wrapper];
      });
      expect(getTextContent(slot, { recurse: false, maxLevel: Infinity })).toBe('1st level');
    });

    it('should only go max level', () => {
      slot.assignedNodes.mockImplementationOnce(() => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `2nd level <div> 3rd level <div> 4th level </div></div>`;

        return [wrapper, document.createTextNode(' 1st level')];
      });
      expect(getTextContent(slot, { recurse: true, maxLevel: 3 })).toBe('2nd level  3rd level  1st level');
    });
  });

  describe('slot - hasSlot', () => {
    let element: IHTMLElement;

    beforeEach(() => {
      element = { ...document.createElement('div'), querySelectorAll: jest.fn(), querySelector: jest.fn() };
    });

    it('should return true if slot is present', () => {
      element.querySelectorAll.mockImplementationOnce(() => [makeSlot('test-slot')]);
      expect(hasSlot(element, 'test-slot')).toBe(true);
    });

    it('should return false if slot with given name is not present', () => {
      element.querySelectorAll.mockImplementationOnce(() => [makeSlot('test')]);
      expect(hasSlot(element, 'test-slot')).toBe(false);
    });

    it('should return false if slot is not present', () => {
      element.querySelectorAll.mockImplementationOnce(() => []);
      expect(hasSlot(element, 'test-slot')).toBe(false);
    });
  });

  describe('slot - hasSlotContent', () => {
    let element: IHTMLElement;

    beforeEach(() => {
      element = { ...document.createElement('div'), querySelectorAll: jest.fn(), querySelector: jest.fn() };
    });

    it('should return true if slot has html element', () => {
      element.querySelector.mockImplementationOnce(() => {
        const slot = makeSlot();
        slot.assignedElements.mockImplementationOnce(() => [document.createElement('div')]);
        return slot;
      });
      expect(hasSlotContent(element)).toBe(true);
    });

    it('should return false if slot html is empty', () => {
      element.querySelector.mockImplementationOnce(() => {
        const slot = makeSlot();
        slot.assignedElements.mockImplementationOnce(() => []);
        return slot;
      });
      expect(hasSlotContent(element)).toBe(false);
    });

    it('should return false if slot assignedElements does not return an array', () => {
      element.querySelector.mockImplementationOnce(() => {
        const slot = makeSlot();
        slot.assignedElements.mockImplementationOnce(() => document.createElement('div') as unknown as Element[]);
        return slot;
      });
      expect(hasSlotContent(element)).toBe(false);
    });

    it('should return false if slot is not present', () => {
      element.querySelector.mockImplementationOnce(() => null);
      expect(hasSlotContent(element)).toBe(false);
    });

    it('should return false if slot has no html element', () => {
      element.querySelector.mockImplementationOnce(() => {
        const slot = makeSlot();
        slot.assignedElements.mockImplementationOnce(() => []);
        return slot;
      });
      expect(hasSlotContent(element)).toBe(false);
    });
  });
});

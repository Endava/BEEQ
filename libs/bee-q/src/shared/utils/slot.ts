/*=========================================================================================
= Credit:                                                                                =
= https://github.com/shoelace-style/shoelace/blob/next/src/utilities/slot.ts             =
=========================================================================================*/

function isElementNode(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

function isTextNode(node: Node): node is Text {
  return node.nodeType === Node.TEXT_NODE;
}

function getText(node: Node, currentLevel = 1, maxLevel = Infinity): string {
  let text = '';
  if (currentLevel <= maxLevel) {
    if (isTextNode(node)) {
      text += node.textContent;
    } else if (isElementNode(node) && node.hasChildNodes()) {
      const nextLevel = currentLevel + 1;
      node.childNodes.forEach((node) => {
        text += getText(node, nextLevel, maxLevel);
      });
    }
  }

  return text;
}

export interface IOptions {
  recurse: boolean;
  maxLevel?: number;
}

/**
 * Iterates over all of its assigned element and text nodes of a given a slot and returns the concatenated HTML as a string.
 *
 * @param {HTMLSlotElement} slot - Slot HTML element
 * @return {string} The concatenated HTML as a string
 */
export function getInnerHTML(slot: HTMLSlotElement): string {
  const nodes = slot.assignedNodes({ flatten: true });
  let html = '';

  [...nodes].forEach((node) => {
    if (isElementNode(node)) {
      html += node.outerHTML;
    }

    if (isTextNode(node)) {
      html += node.textContent;
    }
  });

  return html;
}

/**
 * Iterates over all of its assigned text nodes of a given slot and returns the concatenated text as a string.
 *
 * @param {HTMLSlotElement} slot - Slot HTML element
 * @return {string} The concatenated text as a string
 */
export function getTextContent(slot: HTMLSlotElement): string;
/**
 * Iterates over all of its assigned text nodes of a given slot and returns the concatenated text as a string.
 *
 * @param {HTMLSlotElement} slot - Slot HTML element
 * @param {IOptions} options - Options to retrieve text
 * @return {string} The concatenated text as a string
 */
export function getTextContent(slot: HTMLSlotElement, options: IOptions): string;
export function getTextContent(slot: HTMLSlotElement, options?: IOptions): string {
  const nodes = slot.assignedNodes({ flatten: true });
  const { recurse = false, maxLevel } = options ?? {};
  let text = '';

  [...nodes].forEach((node) => {
    text += getText(node, 1, recurse ? maxLevel : 1);
  });

  return text.trim();
}

/**
 * Determines whether a slot with the given name exists in an element.
 *
 * @param {HTMLElement} el - The HTMl element to check
 * @param {string} name - Name of the slot to check inside the HTML element
 * @return {boolean} True or false if the given HTML element has slot
 */
export function hasSlot(el: HTMLElement, name: string): boolean {
  return (
    Array.from(el.querySelectorAll('[slot]')).filter((slottedEl: HTMLSlotElement) => slottedEl.slot === name).length > 0
  );
}

/**
 * Will return whether if a given slot have HTML children elements or not.
 *
 * @param {HTMLElement} el - The HTML element that holds the slot
 * @param {string} [name] - Optional slot name
 * @return {boolean} True or false if the slot have HTML children elements
 */
export function hasSlotContent(el: HTMLElement, name?: string): boolean {
  const slotSelector = name ? `[name='${name}']` : '';
  const slotContent = el.querySelector<HTMLSlotElement>(`slot${slotSelector}`)?.assignedElements({ flatten: true });
  if (!slotContent || !Array.isArray(slotContent)) return false;

  return !!slotContent.length;
}

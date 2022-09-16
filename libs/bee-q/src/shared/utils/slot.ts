/*=========================================================================================
= Credit:                                                                                =
= https://github.com/shoelace-style/shoelace/blob/next/src/utilities/slot.ts             =
=========================================================================================*/

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
    if (node.nodeType === Node.ELEMENT_NODE) {
      html += (node as HTMLElement).outerHTML;
    }

    if (node.nodeType === Node.TEXT_NODE) {
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
export function getTextContent(slot: HTMLSlotElement): string {
  const nodes = slot.assignedNodes({ flatten: true });
  let text = '';

  [...nodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
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

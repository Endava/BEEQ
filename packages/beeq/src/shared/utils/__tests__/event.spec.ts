import { describe, expect, it } from 'vitest';

import { isEventTargetChildOfElement } from '..';

describe(isEventTargetChildOfElement.name, () => {
  it('should return true when the event target is the host element itself', () => {
    const host = document.createElement('div');
    const event = new Event('click', { bubbles: true, composed: true });

    host.dispatchEvent(event);

    expect(isEventTargetChildOfElement(event, host)).toBe(true);
  });

  it('should return true when the event target is a child of the host element', () => {
    const host = document.createElement('div');
    const child = document.createElement('button');
    host.appendChild(child);

    const event = new Event('click', { bubbles: true, composed: true });
    child.dispatchEvent(event);

    expect(isEventTargetChildOfElement(event, host)).toBe(true);
  });

  it('should return false when the event target is outside the host element', () => {
    const host = document.createElement('div');
    const outside = document.createElement('span');

    const event = new Event('click', { bubbles: true, composed: true });
    outside.dispatchEvent(event);

    expect(isEventTargetChildOfElement(event, host)).toBe(false);
  });
});

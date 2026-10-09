import { describe, expect, it } from 'vitest';

import { isEventHandled, isEventTargetChildOfElement, markEventHandled } from '..';

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

describe(markEventHandled.name, () => {
  it('should mark only the given event as handled', () => {
    const event = new Event('click');
    const other = new Event('click');

    markEventHandled(event);

    expect(isEventHandled(event)).toBe(true);
    expect(isEventHandled(other)).toBe(false);
  });
});

describe(isEventHandled.name, () => {
  it('should return false for an event that was not marked', () => {
    expect(isEventHandled(new Event('click'))).toBe(false);
  });
});

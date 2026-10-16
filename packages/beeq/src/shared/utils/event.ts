/**
 * Check if the event target is a child of the host element
 * @param event - The event to check
 * @param hostElement - The host element to check against
 * @returns True if the event target is a child of the host element
 */
export const isEventTargetChildOfElement = (event: Event, hostElement: EventTarget): boolean => {
  const path = event.composedPath();

  return path.includes(hostElement);
};

const handledEvents = new WeakSet<Event>();

/**
 * Marks an event as already handled by a component, so internal listeners further up
 * the propagation path can skip their default handling without stopping propagation.
 * @param event - The event to mark
 */
export const markEventHandled = (event: Event): void => {
  handledEvents.add(event);
};

/**
 * Check if an event was marked as handled with `markEventHandled`
 * @param event - The event to check
 * @returns True if the event was marked as handled
 */
export const isEventHandled = (event: Event): boolean => handledEvents.has(event);

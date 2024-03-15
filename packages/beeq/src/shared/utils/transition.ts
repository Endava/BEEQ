/* -------------------------------------------------------------------------- */
/*            Credits to MikeMcCall for the original implementation           */
/*            Github: https://github.com/mmccall10/el-transition              */
/* -------------------------------------------------------------------------- */

interface HTMLElementWithAnimations extends HTMLElement {
  getAnimations(): Animation[];
}

/**
 * Transition an element entry
 *
 * @param element The element to enter
 * @param transitionName The name of the transition
 * @returns A promise that resolves when the transition is complete
 */
export const enter = async (element: HTMLElement, transitionName: string | null = null): Promise<void> => {
  element.classList.remove('hidden');
  await transition('enter', element, transitionName);
};

/**
 * Transition an element exit
 *
 * @param element The element to leave
 * @param transitionName The name of the transition
 * @returns A promise that resolves when the transition is complete
 */
export const leave = async (element: HTMLElement, transitionName: string | null = null): Promise<void> => {
  await transition('leave', element, transitionName);
  element.classList.add('hidden');
};

/**
 * Toggle an element entry/exit
 *
 * @param element The element to toggle
 * @param transitionName The name of the transition
 * @returns A promise that resolves when the transition is complete
 */
export const toggle = async (element: HTMLElement, transitionName: string | null = null): Promise<void> => {
  if (element.classList.contains('hidden')) {
    await enter(element, transitionName);
  } else {
    await leave(element, transitionName);
  }
};

/**
 * Perform a transition on an element
 *
 * @param direction The direction of the transition
 * @param element The element to transition
 * @param animation The animation to use
 * @returns A promise that resolves when the transition is complete
 * @internal
 */
const transition = async (direction: string, element: HTMLElement, animation: string | null): Promise<void> => {
  const dataset = element.dataset;
  const animationClass = animation ? `${animation}-${direction}` : direction;
  const transition = `transition${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
  const genesis = dataset[transition] ? dataset[transition].split(' ') : [animationClass];
  const start = dataset[`${transition}Start`] ? dataset[`${transition}Start`].split(' ') : [`${animationClass}-start`];
  const end = dataset[`${transition}End`] ? dataset[`${transition}End`].split(' ') : [`${animationClass}-end`];

  addClasses(element, genesis);
  addClasses(element, start);
  await nextFrame();

  removeClasses(element, start);
  addClasses(element, end);
  await afterTransition(element as HTMLElementWithAnimations);

  removeClasses(element, end);
  removeClasses(element, genesis);
};

/**
 * Add classes to an element
 *
 * @param element The element to add the CSS classes to
 * @param classes The classes to add
 */
const addClasses = (element: HTMLElement, classes: string[]): void => {
  element.classList.add(...classes);
};

/**
 * Remove classes from an element
 *
 * @param element The element to remove the CSS classes from
 * @param classes The classes to remove
 */
const removeClasses = (element: HTMLElement, classes: string[]): void => {
  element.classList.remove(...classes);
};

/**
 * Wait for the next frame
 * @returns A promise that resolves when the next frame is available
 * @internal
 */
const nextFrame = (): Promise<void> => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
};

/**
 * Wait for all animations to finish
 * @param element The element to wait for
 * @returns A promise that resolves when all animations are finished
 * @internal
 */
const afterTransition = (element: HTMLElementWithAnimations): Promise<Animation[]> => {
  return Promise.all(element.getAnimations().map((animation) => animation.finished));
};

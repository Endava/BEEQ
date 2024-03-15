interface HTMLElementWithAnimations extends HTMLElement {
  getAnimations(): Animation[];
}

export const enter = async (element: HTMLElement, transitionName: string | null = null): Promise<void> => {
  element.classList.remove('hidden');
  await transition('enter', element, transitionName);
};

export const leave = async (element: HTMLElement, transitionName: string | null = null): Promise<void> => {
  await transition('leave', element, transitionName);
  element.classList.add('hidden');
};

export const toggle = async (element: HTMLElement, transitionName: string | null = null): Promise<void> => {
  if (element.classList.contains('hidden')) {
    await enter(element, transitionName);
  } else {
    await leave(element, transitionName);
  }
};

async function transition(direction: string, element: HTMLElement, animation: string | null): Promise<void> {
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
}

function addClasses(element: HTMLElement, classes: string[]): void {
  element.classList.add(...classes);
}

function removeClasses(element: HTMLElement, classes: string[]): void {
  element.classList.remove(...classes);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

function afterTransition(element: HTMLElementWithAnimations): Promise<Animation[]> {
  return Promise.all(element.getAnimations().map((animation) => animation.finished));
}

import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

afterEach(() => {
  vi.restoreAllMocks();
});

const getStepButton = (step: HTMLBqStepItemElement) =>
  step.shadowRoot?.querySelector<HTMLButtonElement>('[part="base"]');

describe('bq-step-item', () => {
  it('should render', async () => {
    const { root } = await render(<bq-step-item />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-step-item />);

    expect(root).toHaveShadowRoot();
  });

  it('should display text title', async () => {
    const { root } = await render(
      <bq-step-item status="default" type="numeric">
        <span>Title</span>
        <span slot="description">Description for step item</span>
      </bq-step-item>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('[part="title"] slot');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Title');
  });

  it('should display description', async () => {
    const { root } = await render(
      <bq-step-item status="default" type="numeric">
        <span>Title</span>
        <span slot="description">Description for step item</span>
      </bq-step-item>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="description"]');

    expect(getTextContent(slotElement, { recurse: true })).toBe('Description for step item');
  });

  it('should display icon prefix', async () => {
    const { root } = await render(
      <bq-step-item status="default">
        <bq-icon name="circle" slot="prefix" />
        <span>Title</span>
        <span slot="description">Description</span>
      </bq-step-item>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="prefix"]');
    const assignedElement = slotElement.assignedElements({ flatten: true })[0];

    expect(assignedElement.tagName.toLowerCase()).toBe('bq-icon');
  });

  it('should emit bqFocus and bqBlur events when focused and blurred', async () => {
    const { root, waitForChanges } = await render(
      <div>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
        <button type="button">Next</button>
      </div>,
    );

    const stepItem = root.querySelector('bq-step-item') as HTMLBqStepItemElement;
    const bqFocus = vi.fn();
    const bqBlur = vi.fn();
    stepItem.addEventListener('bqFocus', bqFocus);
    stepItem.addEventListener('bqBlur', bqBlur);

    await userEvent.tab();
    await userEvent.tab();
    await waitForChanges();

    expect(document.activeElement?.tagName.toLowerCase()).toBe('button');
    expect(bqFocus).toHaveBeenCalledTimes(1);
    expect(bqBlur).toHaveBeenCalledTimes(1);
    expect(getStepButton(stepItem)).toEqualAttribute('type', 'button');
  });

  it('should emit bqClick event when clicked', async () => {
    const { root, waitForChanges } = await render(
      <bq-steps>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );
    const stepItem = root.querySelector<HTMLBqStepItemElement>('bq-step-item');

    const bqClick = vi.fn();
    stepItem.addEventListener('bqClick', bqClick);

    await userEvent.click(getStepButton(stepItem));
    await waitForChanges();

    expect(bqClick).toHaveBeenCalledTimes(1);
  });

  it('should emit bqClick event on Space key press', async () => {
    const { root, waitForChanges } = await render(
      <bq-steps>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );

    const stepItem = root.querySelector<HTMLBqStepItemElement>('bq-step-item');

    const bqClick = vi.fn();
    stepItem.addEventListener('bqClick', bqClick);

    await userEvent.tab();
    await userEvent.keyboard(' ');
    await waitForChanges();

    expect(bqClick).toHaveBeenCalledTimes(1);
  });

  it('should emit bqClick event on Enter key press', async () => {
    const { root, waitForChanges } = await render(
      <bq-steps>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );

    const stepItem = root.querySelector<HTMLBqStepItemElement>('bq-step-item');
    const bqClick = vi.fn();
    stepItem.addEventListener('bqClick', bqClick);

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(bqClick).toHaveBeenCalledTimes(1);
  });

  it('should not emit bqClick event when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-steps>
        <bq-step-item status="disabled">
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );

    const bqClick = spyOnEvent('bqClick');
    const stepItem = root.querySelector<HTMLBqStepItemElement>('bq-step-item');
    const stepButton = getStepButton(stepItem);

    expect(stepButton).toBeDisabled();

    stepButton.click();
    await waitForChanges();

    expect(bqClick).not.toHaveReceivedEvent();
  });

  it('should set aria-current when status is current', async () => {
    const { root } = await render(
      <bq-step-item status="current">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    expect(getStepButton(stepItem)).toEqualAttribute('aria-current', 'step');
  });

  it('should apply status classes', async () => {
    const { root, setProps } = await render(
      <bq-step-item status="current">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    const stepButton = getStepButton(stepItem);

    expect(stepButton).toHaveClass('bq-step-item--current');

    await setProps({ status: 'completed' });

    expect(stepButton).toHaveClass('bq-step-item--completed');
  });

  it('should hide the divider when it is the last item', async () => {
    const { root, setProps } = await render(
      <bq-step-item>
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    expect(stepItem.shadowRoot?.querySelector('bq-divider')).not.toBeNull();

    await setProps({ isLast: true });

    expect(stepItem.shadowRoot?.querySelector('bq-divider')).toBeNull();
  });

  it('should apply the type class to the prefix element', async () => {
    const { root, setProps } = await render(
      <bq-step-item status="default" type="dot">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    const prefixEl = stepItem.shadowRoot?.querySelector('.bq-step-item__prefix');

    expect(prefixEl).toHaveClass('dot');

    await setProps({ type: 'numeric' });

    expect(prefixEl).not.toHaveClass('dot');
    expect(prefixEl).toHaveClass('numeric');
  });

  it('should apply vertical orientation layout', async () => {
    const { root } = await render(
      <bq-step-item orientation="vertical" status="default">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    const listItem = stepItem.shadowRoot?.querySelector('[role="listitem"]');

    expect(getComputedStyle(listItem).flexDirection).toBe('column');
  });

  it('should preserve native structure, spacing and transitions', async () => {
    const { root } = await render(
      <bq-steps type="numeric">
        <bq-step-item status="default">
          <span slot="prefix">1</span>
          <span>Title</span>
          <span slot="description">Description</span>
        </bq-step-item>
      </bq-steps>,
    );
    await waitForStable(root);

    const stepItem = root.querySelector<HTMLBqStepItemElement>('bq-step-item');
    const base = stepItem.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    const prefix = stepItem.shadowRoot.querySelector<HTMLElement>('.bq-step-item__prefix');
    const title = stepItem.shadowRoot.querySelector<HTMLElement>('[part="title"]');
    const description = stepItem.shadowRoot.querySelector<HTMLElement>('[part="description"]');
    const baseStyle = getComputedStyle(base);
    const prefixStyle = getComputedStyle(prefix);

    expect(baseStyle.display).toBe('flex');
    expect(baseStyle.gap).toBe('12px');
    expect(baseStyle.padding).toBe('4px 16px 4px 0px');
    expect(baseStyle.borderRadius).toBe('12px');
    expect(baseStyle.transitionDuration).toBe('0.3s');
    expect(baseStyle.transitionProperty).toBe(
      'color, background-color, border-color, text-decoration-color, fill, stroke',
    );
    expect(prefixStyle.blockSize).toBe('32px');
    expect(prefixStyle.inlineSize).toBe('32px');
    expect(prefixStyle.borderRadius).toBe('9999px');
    expect(prefixStyle.fontSize).toBe('16px');
    expect(prefixStyle.fontWeight).toBe('600');
    expect(getComputedStyle(title).fontSize).toBe('16px');
    expect(getComputedStyle(description).fontSize).toBe('14px');
  });

  it('should preserve the small numeric prefix and divider geometry', async () => {
    const { root } = await render(
      <bq-step-item orientation="vertical" size="small" status="default" type="numeric">
        <span slot="prefix">1</span>
        <span>Title</span>
      </bq-step-item>,
    );
    await waitForStable(root);

    const prefix = root.shadowRoot.querySelector<HTMLElement>('.bq-step-item__prefix');
    const divider = root.shadowRoot.querySelector<HTMLBqDividerElement>('bq-divider');
    const dividerBase = divider.shadowRoot.querySelector<HTMLElement>('[part="base"]');

    expect(getComputedStyle(prefix).blockSize).toBe('24px');
    expect(getComputedStyle(prefix).inlineSize).toBe('24px');
    expect(getComputedStyle(prefix).fontSize).toBe('14px');
    expect(getComputedStyle(dividerBase).padding).toBe('12px');
  });

  it('should preserve the standard focus ring and disabled opacity stacking', async () => {
    const { root } = await render(
      <div>
        <bq-step-item status="default">
          <span>Default</span>
        </bq-step-item>
        <bq-step-item status="disabled" type="numeric">
          <span slot="prefix">2</span>
          <span>Disabled</span>
          <span slot="description">Description</span>
        </bq-step-item>
      </div>,
    );

    const [defaultStep, disabledStep] = Array.from(root.querySelectorAll<HTMLBqStepItemElement>('bq-step-item'));
    await userEvent.tab();

    const defaultBase = getComputedStyle(defaultStep.shadowRoot.querySelector('[part="base"]'));
    const disabledBase = getComputedStyle(disabledStep.shadowRoot.querySelector('[part="base"]'));
    const disabledPrefix = getComputedStyle(disabledStep.shadowRoot.querySelector('.bq-step-item__prefix'));
    const disabledDescription = getComputedStyle(disabledStep.shadowRoot.querySelector('[part="description"]'));

    expect(defaultBase.outlineColor).toBe(resolveColorToken('--bq-focus'));
    expect(defaultBase.outlineStyle).toBe('solid');
    expect(defaultBase.outlineWidth).toBe('2px');
    expect(disabledBase.pointerEvents).toBe('none');
    expect(disabledBase.opacity).toBe('0.6');
    expect(disabledPrefix.opacity).toBe('0.6');
    expect(disabledDescription.opacity).toBe('0.6');
  });

  it('should pass dividerColor to the divider element', async () => {
    const { root } = await render(
      <bq-step-item dividerColor="stroke--brand" status="default">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    const divider = stepItem.shadowRoot?.querySelector<HTMLBqDividerElement>('bq-divider');

    expect(divider).toEqualAttribute('stroke-color', 'stroke--brand');
  });

  it('should use the title and description color variables', async () => {
    const { root } = await render(
      <bq-step-item status="current">
        Title
        <span slot="description">Description</span>
      </bq-step-item>,
    );

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-step-item--title-color-current').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--brand').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-step-item--description-color').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--secondary').trim(),
    );

    const title = getComputedStyle(root.shadowRoot.querySelector('[part="title"]'));
    const description = getComputedStyle(root.shadowRoot.querySelector('[part="description"]'));
    const slottedDescription = getComputedStyle(root.querySelector('[slot="description"]'));

    expect(title.color).toBe(resolveColorToken('--bq-text--brand'));
    expect(description.color).toBe(resolveColorToken('--bq-text--secondary'));
    expect(slottedDescription.opacity).toBe('1');
  });

  it('should use the primary title color when not current', async () => {
    const { root } = await render(<bq-step-item status="default">Title</bq-step-item>);

    const title = getComputedStyle(root.shadowRoot.querySelector('[part="title"]'));
    expect(title.color).toBe(resolveColorToken('--bq-text--primary'));
  });

  it('should use the on-brand text color for the current numeric prefix', async () => {
    const { root } = await render(
      <bq-step-item status="current" type="numeric">
        <span slot="prefix">1</span>
        Title
      </bq-step-item>,
    );

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-step-item--prefix-num-bg-color-current').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--brand').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-step-item--prefix-num-text-color-current').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--on-brand').trim(),
    );

    const prefix = getComputedStyle(root.shadowRoot.querySelector('.bq-step-item__prefix'));
    expect(prefix.backgroundColor).toBe(resolveColorToken('--bq-ui--brand'));
    expect(prefix.color).toBe(resolveColorToken('--bq-text--on-brand'));
  });

  it('should use the status colors for the completed and error numeric prefix', async () => {
    const { root } = await render(
      <div>
        <bq-step-item status="completed" type="numeric">
          <span slot="prefix">1</span>
          Completed
        </bq-step-item>
        <bq-step-item status="error" type="numeric">
          <span slot="prefix">2</span>
          Error
        </bq-step-item>
      </div>,
    );

    const [completed, error] = Array.from(root.querySelectorAll('bq-step-item'));
    const completedPrefix = getComputedStyle(completed.shadowRoot.querySelector('.bq-step-item__prefix'));
    const errorPrefix = getComputedStyle(error.shadowRoot.querySelector('.bq-step-item__prefix'));

    expect(completedPrefix.backgroundColor).toBe(resolveColorToken('--bq-ui--success-alt'));
    expect(completedPrefix.color).toBe(resolveColorToken('--bq-text--success'));
    expect(errorPrefix.backgroundColor).toBe(resolveColorToken('--bq-ui--danger-alt'));
    expect(errorPrefix.color).toBe(resolveColorToken('--bq-text--danger'));
  });

  it('should mix the hover base background with the hover overlay', async () => {
    const { root } = await render(<bq-step-item status="default">Title</bq-step-item>);

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-step-item--background-hover').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--secondary').trim(),
    );

    const base = root.shadowRoot.querySelector<HTMLElement>('[part="base"]');
    await userEvent.hover(base);

    const colorProbe = document.createElement('span');
    root.shadowRoot.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-ui--secondary), var(--bq-hover) 20%)';
    const expectedBackground = getComputedStyle(colorProbe).color;
    await expect.poll(() => getComputedStyle(base).backgroundColor).toBe(expectedBackground);
    colorProbe.remove();
  });
});

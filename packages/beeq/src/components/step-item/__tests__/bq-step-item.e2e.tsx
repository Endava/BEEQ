import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

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

    expect(getStepButton(stepItem)).toHaveAttribute('aria-current', 'step');
  });

  it('should apply status classes', async () => {
    const { root, waitForChanges } = await render(
      <bq-step-item status="current">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    const stepButton = getStepButton(stepItem);

    expect(stepButton).toHaveClass('bq-step-item--current');

    stepItem.status = 'completed';
    await waitForChanges();

    expect(stepButton).toHaveClass('bq-step-item--completed');
  });

  it('should hide the divider when it is the last item', async () => {
    const { root, waitForChanges } = await render(
      <bq-step-item>
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    expect(stepItem.shadowRoot?.querySelector('bq-divider')).not.toBeNull();

    stepItem.isLast = true;
    await waitForChanges();

    expect(stepItem.shadowRoot?.querySelector('bq-divider')).toBeNull();
  });

  it('should apply the type class to the prefix element', async () => {
    const { root, waitForChanges } = await render(
      <bq-step-item status="default" type="dot">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    const prefixEl = stepItem.shadowRoot?.querySelector('.bq-step-item__prefix');

    expect(prefixEl).toHaveClass('dot');

    stepItem.type = 'numeric';
    await waitForChanges();

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

    expect(listItem).toHaveClass('flex-col');
    expect(listItem).not.toHaveClass('flex-row');
  });

  it('should pass dividerColor to the divider element', async () => {
    const { root } = await render(
      <bq-step-item dividerColor="stroke--brand" status="default">
        <span>Title</span>
      </bq-step-item>,
    );
    const stepItem = root as HTMLBqStepItemElement;

    const divider = stepItem.shadowRoot?.querySelector('bq-divider') as HTMLBqDividerElement;

    expect(divider).toHaveAttribute('stroke-color', 'stroke--brand');
  });
});

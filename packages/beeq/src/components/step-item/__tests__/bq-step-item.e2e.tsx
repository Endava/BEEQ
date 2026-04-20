import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { getTextContent } from '../../../shared/utils/slot';

const getStepButton = (step: HTMLBqStepItemElement) =>
  step.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;

describe('bq-step-item', () => {
  it('should render', async () => {
    const { root } = await render(<bq-step-item />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-step-item />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display text title', async () => {
    const { root } = await render(
      <bq-step-item status="default" type="numeric">
        <span>Title</span>
        <span slot="description">Description for step item</span>
      </bq-step-item>,
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('[part="title"] slot') as HTMLSlotElement;

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

    const slotElement = root.shadowRoot?.querySelector('slot[name="description"]') as HTMLSlotElement;

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

    const slotElement = root.shadowRoot?.querySelector('slot[name="prefix"]') as HTMLSlotElement;
    const assignedElement = slotElement.assignedElements({ flatten: true })[0];

    expect(assignedElement.tagName.toLowerCase()).toBe('bq-icon');
  });

  it('should emit bqFocus and bqBlur events when focused and blurred', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <div>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
        <button type="button">Next</button>
      </div>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');
    const stepItem = root.querySelector('bq-step-item') as HTMLBqStepItemElement;

    await userEvent.tab();
    await userEvent.tab();
    await waitForChanges();

    expect(document.activeElement?.tagName.toLowerCase()).toBe('button');
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(1);
    expect(getStepButton(stepItem)).toHaveAttribute('type', 'button');
  });

  it('should emit bqClick event when clicked', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      <bq-steps>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );

    const bqClick = spyOnEvent('bqClick');
    const stepItem = root.querySelector('bq-step-item') as HTMLBqStepItemElement;

    await userEvent.click(getStepButton(stepItem));
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick event on Space key press', async () => {
    const { spyOnEvent, waitForChanges } = await render(
      <bq-steps>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );

    const bqClick = spyOnEvent('bqClick');

    await userEvent.tab();
    await userEvent.keyboard(' ');
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick event on Enter key press', async () => {
    const { spyOnEvent, waitForChanges } = await render(
      <bq-steps>
        <bq-step-item status="default">
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );

    const bqClick = spyOnEvent('bqClick');

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
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
    const stepItem = root.querySelector('bq-step-item') as HTMLBqStepItemElement;
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

    expect(getStepButton(root)).toHaveAttribute('aria-current', 'step');
  });

  it('should apply status classes', async () => {
    const { root, waitForChanges } = await render(
      <bq-step-item status="current">
        <span>Title</span>
      </bq-step-item>,
    );

    const stepButton = getStepButton(root);

    expect(stepButton).toHaveClass('bq-step-item--current');

    root.status = 'completed';
    await waitForChanges();

    expect(stepButton).toHaveClass('bq-step-item--completed');
  });

  it('should hide the divider when it is the last item', async () => {
    const { root, waitForChanges } = await render(
      <bq-step-item>
        <span>Title</span>
      </bq-step-item>,
    );

    expect(root.shadowRoot?.querySelector('bq-divider')).not.toBeNull();

    root.isLast = true;
    await waitForChanges();

    expect(root.shadowRoot?.querySelector('bq-divider')).toBeNull();
  });
});

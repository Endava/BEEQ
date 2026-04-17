import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getStepButton = (step: HTMLBqStepItemElement) =>
  step.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;

describe('bq-step-item', () => {
  it('should render', async () => {
    const { root } = await render(h('bq-step-item', null));

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(h('bq-step-item', null));

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display text title', async () => {
    const { root } = await render(
      h(
        'bq-step-item',
        { type: 'numeric', status: 'default' },
        h('span', null, 'Title'),
        h('span', { slot: 'description' }, 'Description for step item'),
      ),
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('[part="title"] slot') as HTMLSlotElement;
    const assignedElement = slotElement.assignedElements({ flatten: true })[0];

    expect(assignedElement.textContent?.trim()).toBe('Title');
  });

  it('should display description', async () => {
    const { root } = await render(
      h(
        'bq-step-item',
        { type: 'numeric', status: 'default' },
        h('span', null, 'Title'),
        h('span', { slot: 'description' }, 'Description for step item'),
      ),
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('slot[name="description"]') as HTMLSlotElement;
    const assignedElement = slotElement.assignedElements({ flatten: true })[0];

    expect(assignedElement.textContent?.trim()).toBe('Description for step item');
  });

  it('should display icon prefix', async () => {
    const { root } = await render(
      h(
        'bq-step-item',
        { status: 'default' },
        h('bq-icon', { slot: 'prefix', name: 'circle' }),
        h('span', null, 'Title'),
        h('span', { slot: 'description' }, 'Description'),
      ),
    );

    await waitForStable(root);

    const slotElement = root.shadowRoot?.querySelector('slot[name="prefix"]') as HTMLSlotElement;
    const assignedElement = slotElement.assignedElements({ flatten: true })[0];

    expect(assignedElement.tagName.toLowerCase()).toBe('bq-icon');
  });

  it('should emit bqFocus and bqBlur events when focused and blurred', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      h('div', null, h('bq-step-item', { status: 'default' }, h('span', null, 'Title')), h('button', null, 'Next')),
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
      h('bq-steps', null, h('bq-step-item', { status: 'default' }, h('span', null, 'Title'))),
    );

    const bqClick = spyOnEvent('bqClick');
    const stepItem = root.querySelector('bq-step-item') as HTMLBqStepItemElement;

    await userEvent.click(getStepButton(stepItem));
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick event on Space key press', async () => {
    const { spyOnEvent, waitForChanges } = await render(
      h('bq-steps', null, h('bq-step-item', { status: 'default' }, h('span', null, 'Title'))),
    );

    const bqClick = spyOnEvent('bqClick');

    await userEvent.tab();
    await userEvent.keyboard(' ');
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick event on Enter key press', async () => {
    const { spyOnEvent, waitForChanges } = await render(
      h('bq-steps', null, h('bq-step-item', { status: 'default' }, h('span', null, 'Title'))),
    );

    const bqClick = spyOnEvent('bqClick');

    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await waitForChanges();

    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should not emit bqClick event when disabled', async () => {
    const { root, spyOnEvent, waitForChanges } = await render(
      h('bq-steps', null, h('bq-step-item', { status: 'disabled' }, h('span', null, 'Title'))),
    );

    const bqClick = spyOnEvent('bqClick');
    const stepItem = root.querySelector('bq-step-item') as HTMLBqStepItemElement;
    const stepButton = getStepButton(stepItem);

    expect(stepButton).toBeDisabled();

    stepButton.click();
    await waitForChanges();

    expect(bqClick).not.toHaveReceivedEvent();
  });
});

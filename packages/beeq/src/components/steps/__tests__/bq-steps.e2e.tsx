import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

const getStepButton = (step: HTMLBqStepItemElement) =>
  step.shadowRoot?.querySelector('[part="base"]') as HTMLButtonElement;

describe('bq-steps', () => {
  it('should render', async () => {
    const { root } = await render(
      h(
        'bq-steps',
        { type: 'icon', size: 'medium' },
        h(
          'bq-step-item',
          { status: 'default' },
          h('bq-icon', { slot: 'prefix', name: 'bell-ringing' }),
          h('span', null, 'Title'),
          h('span', { slot: 'description' }, 'Description'),
        ),
      ),
    );

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(h('bq-steps', { type: 'numeric', size: 'medium' }));

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render the correct number of steps', async () => {
    const { root } = await render(
      h(
        'bq-steps',
        { type: 'numeric', size: 'medium' },
        h('bq-step-item', null, h('span', { slot: 'prefix' }, '1'), h('span', null, 'Title')),
        h('bq-step-item', null, h('span', { slot: 'prefix' }, '2'), h('span', null, 'Title')),
      ),
    );

    expect(root.querySelectorAll('bq-step-item')).toHaveLength(2);
  });

  it('should set the current step item when clicked', async () => {
    const { root, waitForChanges } = await render(
      h(
        'bq-steps',
        { type: 'numeric', size: 'medium' },
        h('bq-step-item', null, h('span', { slot: 'prefix' }, '1'), h('span', null, 'Title')),
        h('bq-step-item', null, h('span', { slot: 'prefix' }, '2'), h('span', null, 'Title')),
      ),
    );

    await waitForChanges();

    const [step1, step2] = root.querySelectorAll('bq-step-item') as NodeListOf<HTMLBqStepItemElement>;

    expect(step1.status).toBe('default');
    expect(step2.status).toBe('default');

    await userEvent.click(getStepButton(step1));
    await waitForChanges();

    expect(step1.status).toBe('current');
    expect(step2.status).toBe('default');

    await userEvent.click(getStepButton(step2));
    await waitForChanges();

    expect(step1.status).toBe('default');
    expect(step2.status).toBe('current');
  });

  it('should expose `setCurrentStepItem` and sync child props', async () => {
    const { root, waitForChanges } = await render(
      h(
        'bq-steps',
        { dividerColor: 'stroke--brand', orientation: 'vertical', size: 'small', type: 'dot' },
        h('bq-step-item', { status: 'current' }, h('span', null, 'First')),
        h('bq-step-item', null, h('span', null, 'Second')),
      ),
    );

    await waitForStable(root);

    const [step1, step2] = root.querySelectorAll('bq-step-item') as NodeListOf<HTMLBqStepItemElement>;

    expect(step1.orientation).toBe('vertical');
    expect(step1.size).toBe('small');
    expect(step1.type).toBe('dot');
    expect(step1.dividerColor).toBe('stroke--brand');
    expect(step2.isLast).toBe(true);

    await root.setCurrentStepItem(step2);
    await waitForChanges();

    expect(step1.status).toBe('default');
    expect(step2.status).toBe('current');
  });
});

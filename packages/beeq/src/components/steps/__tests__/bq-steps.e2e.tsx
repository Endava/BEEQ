import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

afterEach(() => {
  vi.restoreAllMocks();
});

const getStepButton = (step: HTMLBqStepItemElement) =>
  step.shadowRoot?.querySelector<HTMLButtonElement>('[part="base"]');

describe('bq-steps', () => {
  it('should render', async () => {
    const { root } = await render(
      <bq-steps type="icon" size="medium">
        <bq-step-item status="default">
          <bq-icon name="bell-ringing" slot="prefix" />
          <span>Title</span>
          <span slot="description">Description</span>
        </bq-step-item>
      </bq-steps>,
    );

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-steps type="numeric" size="medium" />);

    expect(root).toHaveShadowRoot();
  });

  it('should render the correct number of steps', async () => {
    const { root } = await render(
      <bq-steps type="numeric" size="medium">
        <bq-step-item>
          <span slot="prefix">1</span>
          <span>Title</span>
        </bq-step-item>
        <bq-step-item>
          <span slot="prefix">2</span>
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
    );

    expect(root.querySelectorAll('bq-step-item')).toHaveLength(2);
  });

  it('should set the current step item when clicked', async () => {
    const { root, waitForChanges } = await render(
      <bq-steps type="numeric" size="medium">
        <bq-step-item>
          <span slot="prefix">1</span>
          <span>Title</span>
        </bq-step-item>
        <bq-step-item>
          <span slot="prefix">2</span>
          <span>Title</span>
        </bq-step-item>
      </bq-steps>,
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
      <bq-steps dividerColor="stroke--brand" orientation="vertical" size="small" type="dot">
        <bq-step-item status="current">
          <span>First</span>
        </bq-step-item>
        <bq-step-item>
          <span>Second</span>
        </bq-step-item>
      </bq-steps>,
    );

    await waitForStable(root);

    const steps = root as HTMLBqStepsElement;
    const [step1, step2] = root.querySelectorAll('bq-step-item') as NodeListOf<HTMLBqStepItemElement>;

    expect(step1.orientation).toBe('vertical');
    expect(step1.size).toBe('small');
    expect(step1.type).toBe('dot');
    expect(step1.dividerColor).toBe('stroke--brand');
    expect(step2.isLast).toBe(true);

    await steps.setCurrentStepItem(step2);
    await waitForChanges();

    expect(step1.status).toBe('default');
    expect(step2.status).toBe('current');
  });

  it('should apply vertical layout classes', async () => {
    const { root } = await render(<bq-steps orientation="vertical" />);

    const container = root.shadowRoot?.querySelector('[part="container"]');

    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('bs-full');
  });

  it('should handle invalid props', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(<bq-steps orientation="vertical" size="small" type="dot" />);
    const steps = root as HTMLBqStepsElement;

    steps.orientation = 'invalid' as HTMLBqStepsElement['orientation'];
    steps.size = 'invalid' as HTMLBqStepsElement['size'];
    steps.type = 'invalid' as HTMLBqStepsElement['type'];
    await waitForChanges();

    expect({
      orientation: steps.orientation,
      size: steps.size,
      type: steps.type,
    }).toEqual({
      orientation: 'horizontal',
      size: 'medium',
      type: 'numeric',
    });
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-STEPS] Please notice that "orientation" should be one of horizontal|vertical',
    );
    expect(warnSpy).toHaveBeenCalledWith('[BQ-STEPS] Please notice that "size" should be one of medium|small');
    expect(warnSpy).toHaveBeenCalledWith('[BQ-STEPS] Please notice that "type" should be one of numeric|icon|dot');
  });

  it('should propagate dividerColor changes to child step items', async () => {
    const { root, waitForChanges } = await render(
      <bq-steps dividerColor="stroke--primary" type="dot">
        <bq-step-item status="default">
          <span>First</span>
        </bq-step-item>
        <bq-step-item status="default">
          <span>Second</span>
        </bq-step-item>
      </bq-steps>,
    );
    const steps = root as HTMLBqStepsElement;

    await waitForChanges();

    const [step1, step2] = root.querySelectorAll('bq-step-item') as NodeListOf<HTMLBqStepItemElement>;

    expect(step1.dividerColor).toBe('stroke--primary');
    expect(step2.dividerColor).toBe('stroke--primary');

    steps.dividerColor = 'stroke--brand';
    await waitForChanges();

    expect(step1.dividerColor).toBe('stroke--brand');
    expect(step2.dividerColor).toBe('stroke--brand');
  });
});

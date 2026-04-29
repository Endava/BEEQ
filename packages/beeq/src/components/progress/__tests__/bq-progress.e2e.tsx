import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

const getLabel = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLDivElement>('[part="label"]');
const getProgressBar = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLProgressElement>('[part="progress-bar"]');
const getTooltip = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLBqTooltipElement>('bq-tooltip');
const getIndeterminate = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector<HTMLDivElement>('[part="indeterminate"]');

describe('bq-progress', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render', async () => {
    const { root } = await render(<bq-progress />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-progress />);
    expect(root).toHaveShadowRoot();
  });

  it('should render the progress bar with label', async () => {
    const value = 60;
    const { root } = await render(<bq-progress label value={value} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    const label = getLabel(bqProgress);

    expect(label).not.toBeNull();
    expect(label).toEqualAttribute('aria-hidden', 'false');
    expect(label.textContent?.trim()).toBe(`${value}%`);
  });

  it('should render the progress bar without label', async () => {
    const { root } = await render(<bq-progress value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    const label = getLabel(bqProgress);

    expect(label).toEqualAttribute('aria-hidden', 'true');
    expect(label).toHaveClass('invisible');
  });

  it('should render the progress bar with tooltip', async () => {
    const value = 60;
    const { root } = await render(<bq-progress enableTooltip value={value} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    const tooltip = getTooltip(bqProgress);

    expect(tooltip).not.toBeNull();
    expect(tooltip.textContent?.trim()).toBe(`${value}`);
  });

  it('should render the progress bar without tooltip', async () => {
    const { root } = await render(<bq-progress value={60} />);
    const tooltip = root as HTMLBqProgressElement;

    expect(getTooltip(tooltip)).toBeNull();
  });

  it('should render the error type styles', async () => {
    const { root } = await render(<bq-progress label type="error" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(getProgressBar(bqProgress)).toHaveClass('progress-bar__error');
    expect(getLabel(bqProgress)).toHaveClass('text-danger');
    expect(bqProgress.style.getPropertyValue('--bq-progress-bar--indicatorColor')).toBe('var(--bq-ui--danger)');
  });

  it('should render the large thickness styles', async () => {
    const { root } = await render(<bq-progress thickness="large" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(bqProgress.style.getPropertyValue('--bq-progress-bar--height')).toBe('var(--bq-spacing-xs)');
  });

  it('should clamp the value to the supported range', async () => {
    const { root, setProps } = await render(<bq-progress value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await setProps({ value: 120 });
    expect(bqProgress.value).toBe(100);

    await setProps({ value: -5 });
    expect(bqProgress.value).toBe(0);
  });

  it('should render the indeterminate state', async () => {
    const { root } = await render(<bq-progress indeterminate value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    await waitForStable(bqProgress);

    expect(getProgressBar(bqProgress)).not.toHaveAttribute('value');
    expect(getIndeterminate(bqProgress)).not.toBeNull();
    expect(getLabel(bqProgress).getAttribute('aria-hidden')).toBe('true');
  });

  it('should render the rounded border shape', async () => {
    const { root } = await render(<bq-progress borderShape="rounded" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    expect(getProgressBar(bqProgress)).toHaveClass('progress-bar__border-shape');
  });

  it('should render the square border shape without rounded styles', async () => {
    const { root } = await render(<bq-progress borderShape="square" value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    expect(getProgressBar(bqProgress)).not.toHaveClass('progress-bar__border-shape');
  });

  it('should not render tooltip content for indeterminate progress', async () => {
    const { root } = await render(<bq-progress enableTooltip indeterminate value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    expect(getTooltip(bqProgress)).toBeNull();
  });

  it('should update the label text when the value changes', async () => {
    const { root, setProps } = await render(<bq-progress label value={10} />);
    const bqProgress = root as HTMLBqProgressElement;

    await setProps({ value: 75 });

    expect(getLabel(bqProgress).textContent?.trim()).toBe('75%');
  });

  it('should fallback invalid prop values to defaults', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, setProps } = await render(<bq-progress />);
    const bqProgress = root as HTMLBqProgressElement;

    await setProps({ borderShape: 'invalid', thickness: 'invalid', type: 'invalid' });

    expect(bqProgress.borderShape).toBe('rounded');
    expect(bqProgress.thickness).toBe('medium');
    expect(bqProgress.type).toBe('default');
    expect(warn).toHaveBeenCalledTimes(3);

    warn.mockRestore();
  });
});

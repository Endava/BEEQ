import { h } from '@stencil/core';
import { describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

const getLabel = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector('[part="label"]') as HTMLDivElement;
const getProgressBar = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector('[part="progress-bar"]') as HTMLProgressElement;
const getTooltip = (element: HTMLBqProgressElement) => element.shadowRoot?.querySelector('bq-tooltip');
const getIndeterminate = (element: HTMLBqProgressElement) =>
  element.shadowRoot?.querySelector('[part="indeterminate"]');

describe('bq-progress', () => {
  it('should render', async () => {
    const { root } = await render(<bq-progress />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-progress />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should render the progress bar with label', async () => {
    const value = 60;
    const { root } = await render(<bq-progress label value={value} />);

    await waitForStable(root);

    const label = getLabel(root);

    expect(label).not.toBeNull();
    expect(label.getAttribute('aria-hidden')).toBe('false');
    expect(label.textContent?.trim()).toBe(`${value}%`);
  });

  it('should render the progress bar without label', async () => {
    const { root } = await render(<bq-progress value={60} />);

    await waitForStable(root);

    const label = getLabel(root);

    expect(label.getAttribute('aria-hidden')).toBe('true');
    expect(label).toHaveClass('invisible');
  });

  it('should render the progress bar with tooltip', async () => {
    const value = 60;
    const { root } = await render(<bq-progress enableTooltip value={value} />);

    await waitForStable(root);

    expect(getTooltip(root)).not.toBeNull();
    expect(getTooltip(root)?.textContent?.trim()).toBe(`${value}`);
  });

  it('should render the progress bar without tooltip', async () => {
    const { root } = await render(<bq-progress value={60} />);

    expect(getTooltip(root)).toBeNull();
  });

  it('should render the error type styles', async () => {
    const { root } = await render(<bq-progress label type="error" value={60} />);

    await waitForStable(root);

    expect(getProgressBar(root)).toHaveClass('progress-bar__error');
    expect(getLabel(root)).toHaveClass('text-danger');
    expect(root.style.getPropertyValue('--bq-progress-bar--indicatorColor')).toBe('var(--bq-ui--danger)');
  });

  it('should render the large thickness styles', async () => {
    const { root } = await render(<bq-progress thickness="large" value={60} />);

    await waitForStable(root);

    expect(root.style.getPropertyValue('--bq-progress-bar--height')).toBe('var(--bq-spacing-xs)');
  });

  it('should clamp the value to the supported range', async () => {
    const { root, waitForChanges } = await render(<bq-progress value={60} />);
    const bqProgress = root as HTMLBqProgressElement;

    bqProgress.value = 120;
    await waitForChanges();
    expect(bqProgress.value).toBe(100);

    bqProgress.value = -5;
    await waitForChanges();
    expect(bqProgress.value).toBe(0);
  });

  it('should render the indeterminate state', async () => {
    const { root } = await render(<bq-progress indeterminate value={60} />);

    await waitForStable(root);

    expect(getProgressBar(root)).not.toHaveAttribute('value');
    expect(getIndeterminate(root)).not.toBeNull();
    expect(getLabel(root).getAttribute('aria-hidden')).toBe('true');
  });

  it('should render the rounded border shape', async () => {
    const { root } = await render(<bq-progress borderShape="rounded" value={60} />);

    expect(getProgressBar(root)).toHaveClass('progress-bar__border-shape');
  });

  it('should render the square border shape without rounded styles', async () => {
    const { root } = await render(<bq-progress borderShape="square" value={60} />);

    expect(getProgressBar(root)).not.toHaveClass('progress-bar__border-shape');
  });

  it('should not render tooltip content for indeterminate progress', async () => {
    const { root } = await render(<bq-progress enableTooltip indeterminate value={60} />);

    expect(getTooltip(root)).toBeNull();
  });

  it('should update the label text when the value changes', async () => {
    const { root, waitForChanges } = await render(<bq-progress label value={10} />);
    const bqProgress = root as HTMLBqProgressElement;

    bqProgress.value = 75;
    await waitForChanges();

    expect(getLabel(root).textContent?.trim()).toBe('75%');
  });

  it('should fallback invalid prop values to defaults', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(<bq-progress />);
    const bqProgress = root as HTMLBqProgressElement;

    // @ts-expect-error testing invalid prop handling
    bqProgress.borderShape = 'invalid';
    // @ts-expect-error testing invalid prop handling
    bqProgress.thickness = 'invalid';
    // @ts-expect-error testing invalid prop handling
    bqProgress.type = 'invalid';
    await waitForChanges();

    expect(bqProgress.borderShape).toBe('rounded');
    expect(bqProgress.thickness).toBe('medium');
    expect(bqProgress.type).toBe('default');
    expect(warn).toHaveBeenCalledTimes(3);

    warn.mockRestore();
  });
});

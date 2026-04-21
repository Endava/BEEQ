import { h } from '@stencil/core';
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('bq-spinner', () => {
  it('should render', async () => {
    const { root } = await render(<bq-spinner />);

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-spinner />);

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should handle `animation` property', async () => {
    const { root, waitForChanges } = await render(<bq-spinner animation />);
    const spinner = root as HTMLBqSpinnerElement;

    const element = spinner.shadowRoot?.querySelector('.bq-spinner');

    expect(element).toHaveClass('is-animated');

    spinner.animation = false;
    await waitForChanges();

    expect(element).not.toHaveClass('is-animated');
  });

  it('should handle `size` property', async () => {
    const { root, waitForChanges } = await render(<bq-spinner />);
    const spinner = root as HTMLBqSpinnerElement;

    const loader = () => spinner.shadowRoot?.querySelector('.bq-spinner--loader');

    expect(loader()).toHaveClass('medium');

    spinner.size = 'large';
    await waitForChanges();
    expect(loader()).toHaveClass('large');

    spinner.size = 'small';
    await waitForChanges();
    expect(loader()).toHaveClass('small');
  });

  it('should handle `text-position` property', async () => {
    const { root, waitForChanges } = await render(<bq-spinner textPosition="above" />);
    const spinner = root as HTMLBqSpinnerElement;

    const spinnerEl = () => spinner.shadowRoot?.querySelector('.bq-spinner');
    const spinnerText = () => spinner.shadowRoot?.querySelector('.bq-spinner--text');

    expect(spinnerEl()).toHaveClass('text-above');

    spinner.textPosition = 'below';
    await waitForChanges();
    expect(spinnerEl()).toHaveClass('text-below');

    spinner.textPosition = 'left';
    await waitForChanges();
    expect(spinnerEl()).toHaveClass('text-left');

    spinner.textPosition = 'right';
    await waitForChanges();
    expect(spinnerEl()).toHaveClass('text-right');

    spinner.textPosition = 'none';
    await waitForChanges();

    expect(spinnerText()).toHaveClass('!hidden');
    expect(spinnerEl()).toHaveClass('text-none');
  });

  it('should render icon slot element', async () => {
    const { root } = await render(
      <bq-spinner>
        <bq-icon name="spinner-gap" slot="icon" />
      </bq-spinner>,
    );

    await waitForStable(root);

    const spinnerIcon = root.shadowRoot?.querySelector<HTMLSlotElement>('.bq-spinner--icon');
    const slotElement = root.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="icon"]');
    const iconSlotElements = slotElement.assignedElements({ flatten: true });

    expect(spinnerIcon).not.toHaveClass('hidden');
    expect(iconSlotElements).toHaveLength(1);
  });

  it('should handle invalid properties', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(<bq-spinner />);
    const spinner = root as HTMLBqSpinnerElement;

    spinner.size = 'invalid' as HTMLBqSpinnerElement['size'];
    spinner.textPosition = 'invalid' as HTMLBqSpinnerElement['textPosition'];
    await waitForChanges();

    expect({
      size: spinner.size,
      textPosition: spinner.textPosition,
    }).toEqual({
      size: 'medium',
      textPosition: 'none',
    });

    expect(warnSpy).toHaveBeenCalledTimes(2);
    expect(warnSpy).toHaveBeenCalledWith('[BQ-SPINNER] Please notice that "size" should be one of small|medium|large');
    expect(warnSpy).toHaveBeenCalledWith(
      '[BQ-SPINNER] Please notice that "textPosition" should be one of none|left|right|above|below',
    );
  });

  it('should respect design style', async () => {
    await render(
      <div>
        <bq-spinner size="small" textPosition="below" />
        <bq-spinner size="medium" textPosition="below" />
        <bq-spinner size="large" textPosition="below" />
      </div>,
    );

    const getLineHeightValue = (fontSize: string): string => {
      return `${(150 * parseInt(fontSize, 10)) / 100}px`;
    };

    const sizeStyleProps = ['width', 'height'] as const;

    const smallStyle = computedStyle('bq-spinner[size="small"] >>> .bq-spinner--loader', sizeStyleProps);
    const mediumStyle = computedStyle('bq-spinner[size="medium"] >>> .bq-spinner--loader', sizeStyleProps);
    const largeStyle = computedStyle('bq-spinner[size="large"] >>> .bq-spinner--loader', sizeStyleProps);

    const textStyleProps = ['fontSize', 'fontWeight', 'lineHeight'] as const;

    const smallTextStyle = computedStyle('bq-spinner[size="small"] >>> .bq-spinner--text', textStyleProps);
    const mediumTextStyle = computedStyle('bq-spinner[size="medium"] >>> .bq-spinner--text', textStyleProps);
    const largeTextStyle = computedStyle('bq-spinner[size="large"] >>> .bq-spinner--text', textStyleProps);

    expect(smallStyle).toEqual({ width: '32px', height: '32px' });
    expect(mediumStyle).toEqual({ width: '48px', height: '48px' });
    expect(largeStyle).toEqual({ width: '56px', height: '56px' });

    const textStyleExpected = {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: getLineHeightValue(smallTextStyle.fontSize),
    };

    expect(smallTextStyle).toEqual(textStyleExpected);
    expect(mediumTextStyle).toEqual(textStyleExpected);
    expect(largeTextStyle).toEqual(textStyleExpected);
  });

  it('should render default slot text content', async () => {
    const { root } = await render(
      <bq-spinner textPosition="below">
        <span>Loading...</span>
      </bq-spinner>,
    );

    await waitForStable(root);

    const textEl = root.shadowRoot?.querySelector<HTMLElement>('[part="text"]');
    const slot = textEl?.querySelector<HTMLSlotElement>('slot');
    const assigned = slot.assignedElements({ flatten: true });

    expect(textEl).not.toHaveClass('!hidden');
    expect(assigned).toHaveLength(1);
    expect(assigned[0].textContent).toBe('Loading...');
  });
});

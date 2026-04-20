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

    const element = root.shadowRoot?.querySelector('.bq-spinner');

    expect(element).toHaveClass('is-animated');

    root.animation = false;
    await waitForChanges();

    expect(element).not.toHaveClass('is-animated');
  });

  it('should handle `size` property', async () => {
    const { root, waitForChanges } = await render(<bq-spinner />);

    const loader = () => root.shadowRoot?.querySelector('.bq-spinner--loader');

    expect(loader()).toHaveClass('medium');

    root.size = 'large';
    await waitForChanges();
    expect(loader()).toHaveClass('large');

    root.size = 'small';
    await waitForChanges();
    expect(loader()).toHaveClass('small');
  });

  it('should handle `text-position` property', async () => {
    const { root, waitForChanges } = await render(<bq-spinner textPosition="above" />);

    const spinner = () => root.shadowRoot?.querySelector('.bq-spinner');
    const spinnerText = () => root.shadowRoot?.querySelector('.bq-spinner--text');

    expect(spinner()).toHaveClass('text-above');

    root.textPosition = 'below';
    await waitForChanges();
    expect(spinner()).toHaveClass('text-below');

    root.textPosition = 'left';
    await waitForChanges();
    expect(spinner()).toHaveClass('text-left');

    root.textPosition = 'right';
    await waitForChanges();
    expect(spinner()).toHaveClass('text-right');

    root.textPosition = 'none';
    await waitForChanges();

    expect(spinnerText()).toHaveClass('!hidden');
    expect(spinner()).toHaveClass('text-none');
  });

  it('should render icon slot element', async () => {
    const { root } = await render(
      <bq-spinner>
        <bq-icon name="spinner-gap" slot="icon" />
      </bq-spinner>,
    );

    await waitForStable(root);

    const spinnerIcon = root.shadowRoot?.querySelector('.bq-spinner--icon');
    const slotElement = root.shadowRoot?.querySelector('slot[name="icon"]') as HTMLSlotElement;
    const iconSlotElements = slotElement.assignedElements({ flatten: true });

    expect(spinnerIcon).not.toHaveClass('hidden');
    expect(iconSlotElements).toHaveLength(1);
  });

  it('should handle invalid properties', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { root, waitForChanges } = await render(<bq-spinner />);

    root.size = 'invalid' as HTMLBqSpinnerElement['size'];
    root.textPosition = 'invalid' as HTMLBqSpinnerElement['textPosition'];
    await waitForChanges();

    expect({
      size: root.size,
      textPosition: root.textPosition,
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
});

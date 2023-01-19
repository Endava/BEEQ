import { E2EElement, newE2EPage } from '@stencil/core/testing';
import { computedStyle } from '../../../shared/test-utils';

describe('bq-spinner', () => {
  const checkSpinnerHasClass = (element: E2EElement, className: string) => {
    const spinner = element.shadowRoot.querySelector('.bq-spinner');
    return spinner.classList.contains(className);
  };

  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should handle `animation` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner animation></bq-spinner>');

    const element = await page.find('bq-spinner >>> .bq-spinner');

    expect(element.classList.contains('is-animated')).toBe(true);
  });

  it('should handle `size` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner size="large"></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(checkSpinnerHasClass(element, 'large')).toBe(true);

    element.setProperty('size', 'medium');
    await page.waitForChanges();

    expect(checkSpinnerHasClass(element, 'medium')).toBe(true);

    element.setProperty('size', 'small');
    await page.waitForChanges();

    expect(checkSpinnerHasClass(element, 'small')).toBe(true);
  });

  it('should handle `text-position` property', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner text-position="above"></bq-spinner>');

    const element = await page.find('bq-spinner');

    expect(checkSpinnerHasClass(element, 'text-above')).toBe(true);

    element.setProperty('textPosition', 'bellow');
    await page.waitForChanges();

    expect(checkSpinnerHasClass(element, 'text-bellow')).toBe(true);

    element.setProperty('textPosition', 'left');
    await page.waitForChanges();

    expect(checkSpinnerHasClass(element, 'text-left')).toBe(true);

    element.setProperty('textPosition', 'right');
    await page.waitForChanges();

    expect(checkSpinnerHasClass(element, 'text-right')).toBe(true);

    element.setProperty('textPosition', 'none');
    await page.waitForChanges();
    const spinnerText = await page.find('bq-spinner >>> .bq-spinner--text');

    expect(checkSpinnerHasClass(element, 'text-none')).toBe(true);
    expect(spinnerText).toBeNull();
  });

  it('should render icon slot element', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner><bq-icon name="spinner-gap" slot="icon"></bq-icon></bq-spinner>');
    const spinnerIcon = await page.find('bq-spinner >>> .bq-spinner--icon');

    const iconSlotElements = await page.$eval('bq-spinner', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot[name="icon"]');
      const assignedElements = (slotElement as HTMLSlotElement).assignedElements({ flatten: true });

      return assignedElements;
    });

    expect(spinnerIcon.classList.contains('hidden')).toBe(false);
    expect(iconSlotElements.length).toBe(1);
  });

  it('should handle invalid properties', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-spinner></bq-spinner>');

    const console: jest.Mock<void, string[]> = jest.fn();
    page.on('console', (message) => console(message.type(), message.text()));

    const element = await page.find('bq-spinner');

    element.setProperty('size', 'invalid');
    element.setProperty('textPosition', 'invalid');

    await page.waitForChanges();

    expect(console).toHaveBeenCalledTimes(2);
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-SPINNER] Please notice that "size" should be one of small|medium|large',
    );
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-SPINNER] Please notice that "textPosition" should be one of none|left|right|above|bellow',
    );
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent(`
      <bq-spinner size="small" text-position="bellow"></bq-spinner>
      <bq-spinner size="medium" text-position="bellow"></bq-spinner>
      <bq-spinner size="large" text-position="bellow"></bq-spinner>
    `);

    const getLineHeightValue = (fontSize: string): string => {
      return `${(150 * parseInt(fontSize)) / 100}px`;
    };

    const smallStyle = await computedStyle(page, 'bq-spinner[size="small"] >>> .bq-spinner--loader');
    const mediumStyle = await computedStyle(page, 'bq-spinner[size="medium"] >>> .bq-spinner--loader');
    const largeStyle = await computedStyle(page, 'bq-spinner[size="large"] >>> .bq-spinner--loader');
    const smallTextStyle = await computedStyle(page, 'bq-spinner[size="small"] >>> .bq-spinner--text');
    const mediumTextStyle = await computedStyle(page, 'bq-spinner[size="medium"] >>> .bq-spinner--text');
    const largeTextStyle = await computedStyle(page, 'bq-spinner[size="large"] >>> .bq-spinner--text');

    expect({ width: smallStyle.width, height: smallStyle.height }).toMatchObject({ width: '32px', height: '32px' });
    expect({ width: mediumStyle.width, height: mediumStyle.height }).toMatchObject({ width: '48px', height: '48px' });
    expect({ width: largeStyle.width, height: largeStyle.height }).toMatchObject({ width: '56px', height: '56px' });
    expect({
      fontSize: smallTextStyle.fontSize,
      fontWeight: smallTextStyle.fontWeight,
      lineHeight: smallTextStyle.lineHeight,
    }).toMatchObject({
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: getLineHeightValue(smallTextStyle.fontSize),
    });
    expect({
      fontSize: mediumTextStyle.fontSize,
      fontWeight: mediumTextStyle.fontWeight,
      lineHeight: mediumTextStyle.lineHeight,
    }).toMatchObject({
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: getLineHeightValue(mediumTextStyle.fontSize),
    });
    expect({
      fontSize: largeTextStyle.fontSize,
      fontWeight: largeTextStyle.fontWeight,
      lineHeight: largeTextStyle.lineHeight,
    }).toMatchObject({
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: getLineHeightValue(largeTextStyle.fontSize),
    });
  });
});

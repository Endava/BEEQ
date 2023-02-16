import { newE2EPage } from '@stencil/core/testing';
import { computedStyle, setProperties } from '../../../shared/test-utils';

describe('bq-divider', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-divider></bq-divider>');

    const element = await page.find('bq-divider');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-divider></bq-divider>');

    const element = await page.find('bq-divider');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render label', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-divider><p>Label</p></bq-divider>');

    const labelText = await page.$eval('bq-divider', (element) => {
      const slotElement = element.shadowRoot.querySelector('slot');
      const assignedElements = slotElement.assignedElements({ flatten: true })[0];

      return assignedElements.textContent;
    });

    expect(labelText).toBe('Label');
  });

  it('should handle invalid properties', async () => {
    const page = await newE2EPage();
    await page.setContent(
      '<bq-divider orientation="vertical" titleAlignment="start" strokeLinecap="square">Divider</bq-divider>',
    );

    const console: jest.Mock<void, string[]> = jest.fn();
    page.on('console', (message) => console(message.type(), message.text()));

    expect(
      await setProperties(page, 'bq-divider', {
        // @ts-expect-error we're testing that component is handling invalid properties
        orientation: 'invalid',
        // @ts-expect-error we're testing that component is handling invalid properties
        titleAlignment: 'invalid',
        // @ts-expect-error we're testing that component is handling invalid properties
        strokeLinecap: 'invalid',
      }),
    ).toEqual({
      orientation: 'horizontal',
      titleAlignment: 'middle',
      strokeLinecap: 'butt',
    });

    expect(console).toHaveBeenCalledTimes(3);
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-DIVIDER] Please notice that "orientation" should be one of horizontal|vertical',
    );
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-DIVIDER] Please notice that "titleAlignment" should be one of start|middle|end',
    );
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-DIVIDER] Please notice that "strokeLinecap" should be one of square|round|butt',
    );
  });

  it('should respect design style', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-divider></bq-divider>');

    const style = await computedStyle(page, 'bq-divider >>> [part="base"]', ['height']);

    expect(style).toEqual({ height: '2px' });
  });
});

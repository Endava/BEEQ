import { newE2EPage } from '@stencil/core/testing';
import { computedStyle, setProperties } from '../../../shared/test-utils';

describe('bq-status', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status>Neutral status</bq-status>');

    const element = await page.find('bq-status');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status>Neutral status</bq-status>');

    const element = await page.find('bq-status');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display status text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status>Neutral status</bq-status>');

    const element = await page.find('bq-status');

    expect(element).toEqualText('Neutral status');
  });

  it('should handle status type', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status>Neutral status</bq-status>');

    expect(await setProperties(page, 'bq-status', { type: 'danger' })).toEqual({ type: 'danger' });
    expect(await page.find('bq-status >>> [part="circle"]')).toHaveClass('danger');
  });

  it('should handle invalid status type', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status status="danger">Neutral status</bq-status>');

    const console: jest.Mock<void, string[]> = jest.fn();

    page.on('console', (message) => console(message.type(), message.text()));
    // @ts-expect-error we're testing that component is handling invalid properties
    expect(await setProperties(page, 'bq-status', { type: 'invalid-status' })).toEqual({ type: 'neutral' });
    expect(await page.find('bq-status >>> [part="circle"]')).toHaveClass('neutral');
    expect(console).toHaveBeenCalledTimes(1);
    expect(console).toHaveBeenCalledWith(
      'warning',
      '[BQ-STATUS] Please notice that "type" should be one of success|info|danger|neutral|guide|alert',
    );
  });

  it('should respect design height', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status status="danger">Neutral status</bq-status>');

    const style = await computedStyle(page, 'bq-status >>> [part="base"]');

    expect(style.height).toEqual('20px');
  });

  it('should have status as circle', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status status="danger">Neutral status</bq-status>');

    const style = await computedStyle(page, 'bq-status >>> [part="circle"]');

    expect(style.borderRadius).toEqual('9999px');
  });

  it('should respect design space between status and text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-status status="danger">Neutral status</bq-status>');

    const style = await computedStyle(page, 'bq-status >>> [part="base"]', ['gap']);

    expect(style).toEqual({ gap: '8px' });
  });
});

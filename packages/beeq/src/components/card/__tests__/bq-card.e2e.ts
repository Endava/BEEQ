import { newE2EPage } from '@stencil/core/testing';

import { computedStyle } from '../../../shared/test-utils';

describe('bq-card', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: '<bq-card></bq-card>',
    });
    const element = await page.find('bq-card');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: '<bq-card></bq-card>',
    });
    const element = await page.find('bq-card');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render default type', async () => {
    const page = await newE2EPage({
      html: '<bq-card type="default"></bq-card>',
    });
    const element = await page.find('bq-card');

    const styleProps = ['padding'] as const;

    const minimalStyle = await computedStyle(page, 'bq-card[type="default"] >>> [part="wrapper"]', styleProps);

    expect(minimalStyle).toEqual({ padding: '24px' });

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render minimal type', async () => {
    const page = await newE2EPage({
      html: '<bq-card type="minimal"></bq-card>',
    });
    const element = await page.find('bq-card');

    const styleProps = ['padding'] as const;

    const minimalStyle = await computedStyle(page, 'bq-card[type="minimal"] >>> [part="wrapper"]', styleProps);

    expect(minimalStyle).toEqual({ padding: '0px' });

    expect(element.shadowRoot).not.toBeNull();
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('bq-steps', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-steps></bq-steps>');

    const element = await page.find('bq-steps');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-steps></bq-steps>');

    const element = await page.find('bq-steps');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should display text', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-steps></bq-steps>');

    const element = await page.find('bq-steps >>> p');

    expect(element).toEqualText('My name is Stencil');
  });
});

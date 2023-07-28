import { newE2EPage } from '@stencil/core/testing';

describe('bq-textarea', () => {
  it('should render', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-textarea></bq-textarea>');

    const textareaElem = await page.find('bq-textarea');

    expect(textareaElem).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage();
    await page.setContent('<bq-textarea></bq-textarea>');

    const textareaElem = await page.find('bq-textarea');

    expect(textareaElem.shadowRoot).not.toBeNull();
  });

  it('should display value', async () => {
    const textValue = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.';
    const page = await newE2EPage();
    await page.setContent(`
      <bq-textarea value="${textValue}"></bq-textarea>
    `);

    const textareaElem = await page.find('bq-textarea >>> .bq-textarea__input');
    expect(await textareaElem.getProperty('value')).toBe(textValue);
  });
});

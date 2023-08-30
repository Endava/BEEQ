import { newE2EPage } from '@stencil/core/testing';

describe('bq-steps', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `
        <bq-steps type="default" size="medium">
          <bq-step-item status="default" value="x">
            <bq-icon slot="prefix" name="bell-ringing" size="24" weight="regular"></bq-icon>
            <span>Step 1</span>
            <span slot="description">Description for step 1</span>
          </bq-step-item>
        </bq-steps>
      `,
    });

    const element = await page.find('bq-steps');

    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-steps></bq-steps>`,
    });

    const element = await page.find('bq-steps');

    expect(element.shadowRoot).not.toBeNull();
  });

  it('should emit bqChange on step item click', async () => {
    const page = await newE2EPage({
      html: `<bq-steps>
      <bq-step-item value="testValue"></bq-step-item>
      </bq-steps>`,
    });

    const stepItem = await page.find('bq-step-item');
    const bqChange = await page.spyOnEvent('bqChange');

    await stepItem.click();

    expect(bqChange).toHaveReceivedEventTimes(1);
  });

  it('should render the correct number of steps', async () => {
    const page = await newE2EPage({
      html: `
      <bq-steps>
        <bq-step-item value="1">Step 1</bq-step-item>
        <bq-step-item value="2">Step 2</bq-step-item>
      </bq-steps>
      `,
    });

    const steps = await page.findAll('bq-step-item');

    expect(steps.length).toBe(2);
  });
});

import { newE2EPage } from '@stencil/core/testing';

describe('bq-steps', () => {
  it('should render', async () => {
    const page = await newE2EPage({
      html: `
        <bq-steps type="icon" size="medium">
          <bq-step-item status="default">
            <bq-icon slot="prefix" name="bell-ringing"></bq-icon>
            <span>Title</span>
            <span slot="description">Description</span>
          </bq-step-item>
        </bq-steps>
      `,
    });

    const element = await page.find('bq-steps');
    expect(element).toHaveClass('hydrated');
  });

  it('should have shadow root', async () => {
    const page = await newE2EPage({
      html: `<bq-steps type="numeric" size="medium"></bq-steps>`,
    });

    const element = await page.find('bq-steps');
    expect(element.shadowRoot).not.toBeNull();
  });

  it('should render the correct number of steps', async () => {
    const page = await newE2EPage({
      html: `
        <bq-steps type="numeric" size="medium">
          <bq-step-item>
            <span slot="prefix">1</span>
            <span>Title</span>
          </bq-step-item>
          <bq-step-item>
            <span slot="prefix">2</span>
            <span>Title</span>
          </bq-step-item>
        </bq-steps>
      `,
    });

    const steps = await page.findAll('bq-step-item');
    expect(steps).toHaveLength(2);
  });

  it('should set the current step item when clicked', async () => {
    const page = await newE2EPage({
      html: `
        <bq-steps type="numeric" size="medium">
          <bq-step-item>
            <span slot="prefix">1</span>
            <span>Title</span>
          </bq-step-item>
          <bq-step-item>
            <span slot="prefix">2</span>
            <span>Title</span>
          </bq-step-item>
        </bq-steps>
      `,
    });

    const steps = await page.findAll('bq-step-item');
    expect(steps).toHaveLength(2);

    const step1 = steps[0];
    const step2 = steps[1];

    await step1.click();
    await page.waitForChanges();

    expect(step1.getAttribute('status')).toBe('current');
    expect(step2.getAttribute('status')).toBe('default');

    await step2.click();
    await page.waitForChanges();

    expect(step2.getAttribute('status')).toBe('current');
    expect(step1.getAttribute('status')).toBe('default');
  });
});

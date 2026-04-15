import { h } from '@stencil/core';
import { describe, expect, it, render } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

describe('bq-accordion-group', () => {
  it('should render', async () => {
    const { root } = await render(
      <bq-accordion-group>
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(
      <bq-accordion-group>
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    expect(root.shadowRoot).not.toBeNull();
  });

  it('should expand all accordions', async () => {
    await render(
      <bq-accordion-group expand-all>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    const expanded = document.querySelectorAll('bq-accordion[expanded]');
    expect(expanded).toHaveLength(3);
  });

  it('should collapse all accordions', async () => {
    const { root, waitForChanges } = await render(
      <bq-accordion-group expand-all>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    (root as HTMLBqAccordionGroupElement).expandAll = false;
    await waitForChanges();

    const expanded = document.querySelectorAll('bq-accordion[expanded]');
    expect(expanded).toHaveLength(0);
  });

  it('should change appearance to all accordions', async () => {
    const { root, waitForChanges } = await render(
      <bq-accordion-group>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    expect(document.querySelectorAll('bq-accordion[appearance="ghost"]')).toHaveLength(0);

    (root as HTMLBqAccordionGroupElement).appearance = 'ghost';
    await waitForChanges();

    expect(document.querySelectorAll('bq-accordion[appearance="ghost"]')).toHaveLength(3);
  });

  it('should change size to all accordions', async () => {
    const { root, waitForChanges } = await render(
      <bq-accordion-group>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    expect(document.querySelectorAll('bq-accordion[size="small"]')).toHaveLength(0);

    (root as HTMLBqAccordionGroupElement).size = 'small';
    await waitForChanges();

    expect(document.querySelectorAll('bq-accordion[size="small"]')).toHaveLength(3);
  });

  it('should emit bqClick on accordion click', async () => {
    const { root, spyOnEvent } = await render(
      <bq-accordion-group>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    const element = root.querySelector('bq-accordion') as HTMLBqAccordionElement;
    await userEvent.click(element);

    expect(element.expanded).toBe(true);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should have only one accordion expanded', async () => {
    const { spyOnEvent } = await render(
      <bq-accordion-group expand-all>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    const element = document.querySelector('bq-accordion') as HTMLBqAccordionElement;
    await userEvent.click(element);
    await userEvent.click(element);

    const expanded = document.querySelectorAll('bq-accordion[expanded]');

    expect(expanded).toHaveLength(1);
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqClick).toHaveReceivedEventTimes(2);
    expect(bqBlur).toHaveReceivedEventTimes(0);
  });

  it('should not collapse other accordions when `multiple` is true', async () => {
    const { spyOnEvent } = await render(
      <bq-accordion-group multiple>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion />
      </bq-accordion-group>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    const elements = document.querySelectorAll('bq-accordion') as NodeListOf<HTMLBqAccordionElement>;
    await userEvent.click(elements[0]);
    await userEvent.click(elements[1]);

    const expanded = document.querySelectorAll('bq-accordion[expanded]');

    expect(expanded).toHaveLength(2);
    expect(bqFocus).toHaveReceivedEventTimes(2);
    expect(bqClick).toHaveReceivedEventTimes(2);
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should be keyboard navigable', async () => {
    const { spyOnEvent } = await render(
      <bq-accordion-group expand-all>
        <bq-accordion />
        <bq-accordion />
        <bq-accordion disabled />
        <bq-accordion />
      </bq-accordion-group>,
    );

    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.tab();
    await userEvent.tab();
    await userEvent.tab();

    const focusedTagName = document.activeElement?.tagName.toLowerCase();
    const lastFocusedElement = document.activeElement as HTMLElement;
    const lastAccordion = document.querySelectorAll('bq-accordion')[3];

    expect(bqFocus).toHaveReceivedEventTimes(3);
    expect(bqClick).toHaveReceivedEventTimes(0);
    expect(bqBlur).toHaveReceivedEventTimes(2);
    expect(focusedTagName).toEqual('bq-accordion');
    expect(lastFocusedElement).toEqual(lastAccordion);
  });
});

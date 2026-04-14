import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';

const HEADER_TEXT = 'Test text';

describe('bq-accordion', () => {
  it('should render', async () => {
    const { root } = await render(<bq-accordion />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-accordion />);
    expect(root.shadowRoot).not.toBeNull();
  });

  it('should display header text', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="header"]') as HTMLSlotElement;
    const headerText = slot.assignedElements({ flatten: true })[0].textContent;

    expect(headerText?.trim()).toBe(HEADER_TEXT);
    expect(headerText).not.toBeNull();
  });

  it('should render prefix', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
        <span slot="prefix">Test prefix</span>
      </bq-accordion>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="prefix"]') as HTMLSlotElement;
    const prefixText = slot.assignedElements({ flatten: true })[0].textContent;

    expect(prefixText?.trim()).toBe('Test prefix');
    expect(prefixText).not.toBeNull();
  });

  it('should render suffix', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
        <span slot="suffix">Test suffix</span>
      </bq-accordion>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="suffix"]') as HTMLSlotElement;
    const suffixText = slot.assignedElements({ flatten: true })[0].textContent;

    expect(suffixText?.trim()).toBe('Test suffix');
    expect(suffixText).not.toBeNull();
  });

  it('should be open if expanded prop is provided', async () => {
    const { root } = await render(
      <bq-accordion expanded>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );

    const details = root.shadowRoot.querySelector('[part="base"]');
    expect(details.hasAttribute('open')).toBe(true);

    const header = details.querySelector('.bq-accordion__header');
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });

  it('should be collapsed when disabled', async () => {
    const { root, waitForChanges } = await render(
      <bq-accordion expanded>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );

    (root as HTMLBqAccordionElement).disabled = true;
    await waitForChanges();

    const summary = root.shadowRoot.querySelector('[part="base"] summary');
    expect(summary.getAttribute('aria-disabled')).toBe('true');
    expect(summary.getAttribute('aria-expanded')).toBe('false');
  });

  it('should emit bqFocus when the component receives focus', async () => {
    const { spyOnEvent } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );
    const bqFocus = spyOnEvent('bqFocus');

    await userEvent.tab();

    expect(bqFocus).toHaveReceivedEvent();
    expect(bqFocus).toHaveReceivedEventTimes(1);
  });

  it('should emit bqClick when the component is clicked', async () => {
    const { root, spyOnEvent } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );
    const bqClick = spyOnEvent('bqClick');

    await userEvent.click(root);

    expect(bqClick).toHaveReceivedEvent();
    expect(bqClick).toHaveReceivedEventTimes(1);
  });

  it('should emit bqBlur when the component loses focus', async () => {
    const { spyOnEvent } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );
    const bqFocus = spyOnEvent('bqFocus');
    const bqBlur = spyOnEvent('bqBlur');

    await userEvent.tab();
    await userEvent.tab();

    expect(bqFocus).toHaveReceivedEvent();
    expect(bqFocus).toHaveReceivedEventTimes(1);
    expect(bqBlur).toHaveReceivedEvent();
    expect(bqBlur).toHaveReceivedEventTimes(1);
  });

  it('should not emit bqFocus and bqClick when the component is disabled', async () => {
    const { root, spyOnEvent } = await render(
      <bq-accordion disabled>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );
    const bqFocus = spyOnEvent('bqFocus');
    const bqClick = spyOnEvent('bqClick');

    await userEvent.tab();
    await userEvent.click(root);

    expect(bqFocus).not.toHaveReceivedEvent();
    expect(bqClick).not.toHaveReceivedEvent();
  });

  it('should respect design style', async () => {
    const { root } = await render(
      <div>
        <bq-accordion size="small">
          <span slot="header">{HEADER_TEXT}</span>
        </bq-accordion>
        <bq-accordion size="medium">
          <span slot="header">{HEADER_TEXT}</span>
        </bq-accordion>
      </div>,
    );

    await waitForStable(root);

    const smallHeaderStyle = computedStyle('bq-accordion[size="small"] >>> summary', ['borderRadius', 'padding']);
    const smallPanelStyle = computedStyle('bq-accordion[size="small"] >>> .bq-accordion__content', [
      'borderRadius',
      'padding',
    ]);

    const mediumHeaderStyle = computedStyle('bq-accordion[size="medium"] >>> summary', ['borderRadius', 'padding']);
    const mediumPanelStyle = computedStyle('bq-accordion[size="medium"] >>> .bq-accordion__content', [
      'borderRadius',
      'padding',
    ]);

    expect(smallHeaderStyle).toEqual({ borderRadius: '4px', padding: '8px 12px' });
    expect(smallPanelStyle).toEqual({ borderRadius: '0px 0px 4px 4px', padding: '12px' });
    expect(mediumHeaderStyle).toEqual({ borderRadius: '12px', padding: '12px 16px' });
    expect(mediumPanelStyle).toEqual({ borderRadius: '0px 0px 12px 12px', padding: '16px' });
  });
});

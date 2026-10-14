import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { getTextContent } from '../../../shared/utils/slot';

const HEADER_TEXT = 'Test text';

/** Resolves a CSS color value (e.g. `var(--bq-text--brand)`) to its computed `rgb()` form */
const resolveColor = (value: string): string => {
  const probe = document.createElement('div');
  probe.style.color = value;
  document.body.appendChild(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
};

describe('bq-accordion', () => {
  it('should render', async () => {
    const { root } = await render(<bq-accordion />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-accordion />);
    expect(root).toHaveShadowRoot();
  });

  it('should display header text', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="header"]') as HTMLSlotElement;

    expect(getTextContent(slot, { recurse: true })).toBe(HEADER_TEXT);
  });

  it('should render prefix', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
        <span slot="prefix">Test prefix</span>
      </bq-accordion>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="prefix"]') as HTMLSlotElement;

    expect(getTextContent(slot, { recurse: true })).toBe('Test prefix');
  });

  it('should render suffix', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
        <span slot="suffix">Test suffix</span>
      </bq-accordion>,
    );

    const slot = root.shadowRoot.querySelector('slot[name="suffix"]') as HTMLSlotElement;

    expect(getTextContent(slot, { recurse: true })).toBe('Test suffix');
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
    expect(header).toEqualAttribute('aria-expanded', 'true');
  });

  it('should be collapsed when disabled', async () => {
    const { root, setProps } = await render(
      <bq-accordion expanded>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );

    await setProps({ disabled: true });

    const summary = root.shadowRoot.querySelector('[part="base"] summary');
    expect(summary).toEqualAttribute('aria-disabled', 'true');
    expect(summary).toEqualAttribute('aria-expanded', 'false');
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

  it('should use the panel color variables', async () => {
    const { root } = await render(
      <bq-accordion expanded>
        <span slot="header">Header</span>
        <p>Panel content</p>
      </bq-accordion>,
    );

    await waitForStable(root);

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-accordion--panel-background').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--primary').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-accordion--panel-text-color').trim()).toBe(
      hostStyle.getPropertyValue('--bq-text--primary').trim(),
    );

    const panelStyle = computedStyle('bq-accordion >>> [part="panel"]', ['backgroundColor', 'color']);
    expect(panelStyle).toEqual({
      backgroundColor: resolveColor('var(--bq-ui--primary)'),
      color: resolveColor('var(--bq-text--primary)'),
    });
  });

  it('should allow overriding the panel background variable', async () => {
    const { root } = await render(
      <bq-accordion expanded style={{ '--bq-accordion--panel-background': 'rgb(1, 2, 3)' }}>
        <span slot="header">Header</span>
        <p>Panel content</p>
      </bq-accordion>,
    );

    await waitForStable(root);

    expect(computedStyle('bq-accordion >>> [part="panel"]', ['backgroundColor']).backgroundColor).toBe('rgb(1, 2, 3)');
  });

  it('should mix the collapsed filled background with the hover overlay', async () => {
    const { root } = await render(
      <bq-accordion appearance="filled" style={{ '--bq-accordion--filled-collapsed-background': 'rgb(1, 2, 3)' }}>
        <span slot="header">Header</span>
        <p>Panel content</p>
      </bq-accordion>,
    );

    await waitForStable(root);

    const header = root.shadowRoot.querySelector<HTMLElement>('[part="header"]');
    await userEvent.hover(header);

    const expectedBackground = resolveColor('color-mix(in srgb, rgb(1, 2, 3), var(--bq-hover) 20%)');
    await expect.poll(() => getComputedStyle(header).backgroundColor).toBe(expectedBackground);
  });

  it('should mix the hover base variables with the hover overlay', async () => {
    const { root } = await render(
      <bq-accordion appearance="ghost">
        <span slot="header">Header</span>
        <p>Panel content</p>
      </bq-accordion>,
    );

    await waitForStable(root);

    const hostStyle = getComputedStyle(root);
    expect(hostStyle.getPropertyValue('--bq-accordion--filled-expanded-collapsed-hover').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--secondary').trim(),
    );
    expect(hostStyle.getPropertyValue('--bq-accordion--ghost-expanded-collapsed-hover').trim()).toBe(
      hostStyle.getPropertyValue('--bq-ui--secondary').trim(),
    );

    const header = root.shadowRoot.querySelector<HTMLElement>('[part="header"]');
    await userEvent.hover(header);

    const expectedBackground = resolveColor('color-mix(in srgb, var(--bq-ui--secondary), var(--bq-hover) 20%)');
    await expect.poll(() => getComputedStyle(header).backgroundColor).toBe(expectedBackground);
  });
});

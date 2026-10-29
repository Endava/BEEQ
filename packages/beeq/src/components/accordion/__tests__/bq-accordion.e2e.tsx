import { h } from '@stencil/core';
import { describe, expect, it, render, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser';

import { computedStyle } from '../../../shared/test-utils/computedStyle';
import { resolveColorToken } from '../../../shared/test-utils/resolveColorToken';
import { getTextContent } from '../../../shared/utils/slot';

const HEADER_TEXT = 'Test text';

describe('bq-accordion', () => {
  it('should render', async () => {
    const { root } = await render(<bq-accordion />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-accordion />);
    expect(root).toHaveShadowRoot();
  });

  it('should preserve the native geometry and transition timing', async () => {
    const { root } = await render(
      <bq-accordion expanded>
        <span slot="header">{HEADER_TEXT}</span>
        <p>Panel content</p>
      </bq-accordion>,
    );
    await waitForStable(root);

    const details = root.shadowRoot?.querySelector<HTMLElement>('[part="base"]');
    const header = root.shadowRoot?.querySelector<HTMLElement>('[part="header"]');
    const content = root.shadowRoot?.querySelector<HTMLElement>('.bq-accordion__content');
    const icon = root.shadowRoot?.querySelector<HTMLElement>('.bq-accordion__header--icon:not([hidden])');
    const expandIcon = root.shadowRoot?.querySelector<HTMLElement>('.bq-accordion__header--icon-expand');
    const detailsStyle = getComputedStyle(details);
    const headerStyle = getComputedStyle(header);
    const contentStyle = getComputedStyle(content);
    const iconStyle = getComputedStyle(icon);
    const expandIconStyle = getComputedStyle(expandIcon);

    expect(detailsStyle.overflow).toBe('hidden');
    expect(headerStyle.display).toBe('flex');
    expect(headerStyle.gap).toBe('16px');
    expect(headerStyle.padding).toBe('12px 16px');
    expect(headerStyle.borderRadius).toBe('12px 12px 0px 0px');
    expect(headerStyle.transitionDuration).toBe('0.3s');
    expect(headerStyle.transitionProperty).toBe(
      'color, background-color, border-color, text-decoration-color, fill, stroke',
    );
    expect(headerStyle.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
    expect(contentStyle.display).toBe('block');
    expect(contentStyle.padding).toBe('16px');
    expect(contentStyle.borderRadius).toBe('0px 0px 12px 12px');
    expect(contentStyle.borderWidth).toBe('1px');
    expect(iconStyle.display).toBe('flex');
    expect(expandIconStyle.transitionDuration).toBe('0.3s');
    expect(expandIconStyle.transitionProperty).toBe('transform, -webkit-transform');
    expect(expandIconStyle.transitionTimingFunction).toBe('cubic-bezier(0.4, 0, 0.2, 1)');
  });

  it('should use native hidden attributes for optional content and state icons', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );
    await waitForStable(root);

    for (const part of ['prefix', 'suffix']) {
      const element = root.shadowRoot?.querySelector<HTMLElement>(`[part="${part}"]`);
      expect(element, part).toHaveAttribute('hidden');
      expect(getComputedStyle(element).display, part).toBe('none');
    }

    const icons = root.shadowRoot?.querySelectorAll<HTMLElement>('.bq-accordion__header--icon');
    expect(icons[0]).not.toHaveAttribute('hidden');
    expect(icons[1]).toHaveAttribute('hidden');
    expect(getComputedStyle(icons[1]).display).toBe('none');
  });

  it('should rotate the expand icon without swapping state icons when rotate is enabled', async () => {
    const { root, setProps } = await render(
      <bq-accordion rotate>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );
    await waitForStable(root);

    const icons = root.shadowRoot?.querySelectorAll<HTMLElement>('.bq-accordion__header--icon');
    expect(icons[0]).not.toHaveAttribute('hidden');
    expect(icons[1]).toHaveAttribute('hidden');
    expect(getComputedStyle(icons[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 0)');

    await setProps({ expanded: true });
    await waitForStable(root);

    expect(icons[0]).not.toHaveAttribute('hidden');
    expect(icons[1]).toHaveAttribute('hidden');
    await expect.poll(() => getComputedStyle(icons[0]).transform).toBe('matrix(-1, 0, 0, -1, 0, 0)');
  });

  it('should draw the standard inset focus ring around the header', async () => {
    const { root } = await render(
      <bq-accordion>
        <span slot="header">{HEADER_TEXT}</span>
      </bq-accordion>,
    );
    await waitForStable(root);

    await userEvent.tab();

    const headerStyle = getComputedStyle(root.shadowRoot?.querySelector('[part="header"]'));
    expect(headerStyle.outlineColor).toBe(resolveColorToken('--bq-focus'));
    expect(headerStyle.outlineOffset).toBe('-2px');
    expect(headerStyle.outlineStyle).toBe('solid');
    expect(headerStyle.outlineWidth).toBe('2px');
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
      backgroundColor: resolveColorToken('--bq-ui--primary'),
      color: resolveColorToken('--bq-text--primary'),
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

    const colorProbe = document.createElement('span');
    root.shadowRoot.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, rgb(1, 2, 3), var(--bq-hover) 20%)';
    const expectedBackground = getComputedStyle(colorProbe).color;
    await expect.poll(() => getComputedStyle(header).backgroundColor).toBe(expectedBackground);
    colorProbe.remove();
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

    const colorProbe = document.createElement('span');
    root.shadowRoot.appendChild(colorProbe);
    colorProbe.style.color = 'color-mix(in srgb, var(--bq-ui--secondary), var(--bq-hover) 20%)';
    const expectedBackground = getComputedStyle(colorProbe).color;
    await expect.poll(() => getComputedStyle(header).backgroundColor).toBe(expectedBackground);
    colorProbe.remove();
  });
});

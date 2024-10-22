import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit-html';

import mdx from './bq-tab-group.mdx';
import { TAB_ORIENTATION, TAB_PLACEMENT, TAB_SIZE } from '../../tab/bq-tab.types';

const meta: Meta = {
  title: 'Components/Tabs',
  component: 'bq-tab-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    size: { control: 'select', options: [...TAB_SIZE] },
    orientation: { control: 'select', options: [...TAB_ORIENTATION] },
    placement: { control: 'select', options: [...TAB_PLACEMENT] },
    'disable-divider': { control: 'boolean' },
    tabs: { control: 'text', table: { disable: true } },
    icons: { control: 'text', table: { disable: true } },
    // Event handlers
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus', table: { disable: true } },
    bqBlur: { action: 'bqBlur', table: { disable: true } },
  },
  args: {
    size: 'medium',
    orientation: 'horizontal',
    placement: 'start',
    'disable-divider': false,
    // Not part of the public API, so we don't want to expose it in the docs
    tabs: [
      { id: 1, label: 'First' },
      { id: 2, label: 'Second' },
      { id: 3, label: 'Long name' },
      { id: 4, label: 'Four', disabled: true },
      { id: 5, label: 'Five' },
      { id: 6, label: 'Six' },
      { id: 7, label: 'Seven' },
      { id: 8, label: 'Eight' },
    ],
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  return html`
    <main
      class=${classMap({
        flex: args.orientation === 'vertical',
        'flex-row-reverse': args.placement === 'end',
        'gap-xs2': true,
      })}
    >
      <bq-tab-group
        class=${classMap({ 'm-be-m': args.orientation !== 'vertical' })}
        value="5"
        .size=${args.size}
        .orientation=${args.orientation}
        .placement=${args.placement}
        ?disable-divider=${args['disable-divider']}
        @bqChange=${args.bqChange}
        @bqFocus=${args.bqFocus}
        @bqBlur=${args.bqBlur}
      >
        ${args.tabs.map(
          (tab, index) => html`
            <bq-tab tab-id=${tab.id} ?disabled=${tab.disabled}>
              ${tab.label}
              ${args.icons
                ? html`<bq-icon name="${args.icons[index % args.icons.length]}" slot="icon"></bq-icon>`
                : null}
            </bq-tab>
          `,
        )}
      </bq-tab-group>
      <div class="border h-80 w-full flex-1 border-dashed border-stroke-primary bg-ui-alt">
        <h3 class="m-l">Tab content</h3>
      </div>
    </main>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Vertical: Story = {
  render: Template,
  args: {
    orientation: 'vertical',
  },
};

export const Icon: Story = {
  render: Template,
  args: {
    icons: [
      'pulse',
      'bell',
      'airplane-in-flight',
      'airplane-tilt',
      'align-right-simple',
      'anchor',
      'anchor-simple',
      'android-logo',
    ],
  },
};

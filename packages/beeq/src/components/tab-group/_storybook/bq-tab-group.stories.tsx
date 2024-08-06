import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { classMap } from 'lit/directives/class-map.js';
import { html } from 'lit-html';

import mdx from './bq-tab-group.mdx';
import { TAB_ORIENTATION, TAB_POSITION, TAB_SIZE } from '../../tab/bq-tab.types';

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
    position: { control: 'select', options: [...TAB_POSITION] },
    'disable-divider': { control: 'boolean' },
    // Event handlers
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus', table: { disable: true } },
    bqBlur: { action: 'bqBlur', table: { disable: true } },
  },
  args: {
    size: 'medium',
    orientation: 'horizontal',
    position: 'start',
    'disable-divider': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  return html`
    <main
      class=${classMap({
        flex: args.orientation === 'vertical',
        'flex-row-reverse': args.position === 'end',
      })}
    >
      <bq-tab-group
        value="5"
        .size=${args.size}
        .orientation=${args.orientation}
        .position=${args.position}
        ?disable-divider=${args['disable-divider']}
        @bqChange=${args.bqChange}
        @bqFocus=${args.bqFocus}
        @bqBlur=${args.bqBlur}
      >
        <bq-tab tab-id="1">Tab</bq-tab>
        <bq-tab tab-id="2">Tab</bq-tab>
        <bq-tab tab-id="3">Long Tab name</bq-tab>
        <bq-tab tab-id="4" disabled>Tab</bq-tab>
        <bq-tab tab-id="5" active>Tab</bq-tab>
        <bq-tab tab-id="6">Tab</bq-tab>
        <bq-tab tab-id="7">Tab</bq-tab>
        <bq-tab tab-id="8">Tab</bq-tab>
      </bq-tab-group>
      <div class="border h-80 w-full flex-1 border-dashed border-stroke-primary bg-[--bq-ui--alt]">
        <h3 class="m-l">Tab content</h3>
      </div>
    </main>
  `;
};

export const Default: Story = {
  render: Template,
};

const IconTemplate = (args: Args) => {
  return html`
    <main
      class=${classMap({
        flex: args.orientation === 'vertical',
        'flex-row-reverse': args.position === 'end',
      })}
    >
      <bq-tab-group
        value="5"
        .size=${args.size}
        .orientation=${args.orientation}
        .position=${args.position}
        ?disable-divider=${args['disable-divider']}
        @bqChange=${args.bqChange}
        @bqFocus=${args.bqFocus}
        @bqBlur=${args.bqBlur}
      >
        <bq-tab tab-id="1"><bq-icon name="pulse" slot="icon"></bq-icon>Tab</bq-tab>
        <bq-tab tab-id="2"><bq-icon name="bell" slot="icon"></bq-icon>Tab</bq-tab>
        <bq-tab tab-id="3"><bq-icon name="airplane-in-flight" slot="icon"></bq-icon>Long Tab name</bq-tab>
        <bq-tab tab-id="4" disabled><bq-icon name="airplane-tilt" slot="icon"></bq-icon>Tab</bq-tab>
        <bq-tab tab-id="5" active><bq-icon name="align-right-simple" slot="icon"></bq-icon>Tab</bq-tab>
        <bq-tab tab-id="6"><bq-icon name="anchor" slot="icon"></bq-icon>Tab</bq-tab>
        <bq-tab tab-id="7"><bq-icon name="anchor-simple" slot="icon"></bq-icon>Tab</bq-tab>
        <bq-tab tab-id="8"><bq-icon name="android-logo" slot="icon"></bq-icon>Tab</bq-tab>
      </bq-tab-group>
      <div class="border h-80 w-full flex-1 border-dashed border-stroke-primary bg-[--bq-ui--alt]">
        <h3 class="m-l">Tab content</h3>
      </div>
    </main>
  `;
};

export const Icon: Story = {
  render: IconTemplate,
};

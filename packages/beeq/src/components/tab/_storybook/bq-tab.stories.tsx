import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';

import mdx from './bq-tab.mdx';
import { TAB_ORIENTATION, TAB_PLACEMENT, TAB_SIZE } from '../bq-tab.types';

const meta: Meta = {
  title: 'Components/Tabs/Tab',
  component: 'bq-tab',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: [...TAB_SIZE] },
    orientation: { control: 'select', options: [...TAB_ORIENTATION] },
    position: { control: 'select', options: [...TAB_PLACEMENT] },
    // Not part of the component
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'Tab',
    active: false,
    disabled: false,
    divider: false,
    size: 'medium',
    orientation: 'horizontal',
    position: 'start',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  return html`
    <bq-tab
      .size=${args.size}
      .orientation=${args.orientation}
      .position=${args.position}
      ${args.active}
      ?disabled=${args.disabled}
    >
      ${args.text}
    </bq-tab>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Icon: Story = {
  render: (args: Args) => html`
    <bq-tab
      .size=${args.size}
      .orientation=${args.orientation}
      .position=${args.position}
      ?active=${args.active}
      ?disabled=${args.disabled}
    >
      <bq-icon name="arrow-circle-left" slot="icon"></bq-icon>
      ${args.text}
    </bq-tab>
  `,
};

import { html } from 'lit-html';
import { TAB_SIZE } from '../bq-tab.types';
import mdx from './bq-tab.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

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
    divider: { control: 'boolean' },
    size: { control: 'select', options: [...TAB_SIZE] },
    // Not part of the component
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'Tab',
    active: false,
    disabled: false,
    divider: false,
    size: 'small',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  return html`
    <bq-tab .size=${args.size} ?active=${args.active} ?disabled=${args.disabled} ?divider=${args.divider}>
      ${args.text}
    </bq-tab>
  `;
};

export const Default: Story = {
  render: Template,
};

export const Icon: Story = {
  render: (args: Args) => html`
    <bq-tab .size=${args.size} ?active=${args.active} ?disabled=${args.disabled} ?divider=${args.divider}>
      <bq-icon name="arrow-circle-left" slot="icon"></bq-icon>
      ${args.text}
    </bq-tab>
  `,
};

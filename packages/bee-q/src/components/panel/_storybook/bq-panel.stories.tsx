import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';
import mdx from './bq-panel.mdx';

import { PANEL_PLACEMENT } from '../bq-panel.type';

const meta: Meta = {
  title: 'Components/Panel',
  component: 'bq-panel',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    distance: { control: 'number' },
    placement: { control: 'select', options: PANEL_PLACEMENT },
    open: { control: 'boolean' },
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    distance: 0,
    placement: 'bottom',
    open: true,
    text: 'Some content in the panel',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-dropdown>
    <bq-button slot="trigger">Open</bq-button>
    <bq-panel distance=${args.distance} placement=${args.placement} open=${args.open}> ${args.text} </bq-panel>
  </bq-dropdown>
`;

export const Bottom: Story = {
  render: Template,
  args: {
    text: 'Panel is displayed on the bottom',
    placement: 'bottom',
    open: true,
    distance: 0,
  },
};

export const Top: Story = {
  render: Template,
  args: {
    text: 'Panel displayed on top',
    placement: 'top',
    open: true,
    distance: 0,
  },
};

export const Distance: Story = {
  render: Template,
  args: {
    text: 'Hello!',
    placement: 'bottom',
    open: true,
    distance: 10,
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-accordion-group.mdx';
import { ACCORDION_APPEARANCE, ACCORDION_SIZE } from '../../accordion/bq-accordion.types';

const meta: Meta = {
  title: 'Components/Accordions',
  component: 'bq-accordion-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    expanded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    appearance: { control: 'select', options: [...ACCORDION_APPEARANCE] },
    size: { control: 'select', options: [...ACCORDION_SIZE] },
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    expanded: false,
    disabled: false,
    appearance: 'filled',
    size: 'medium',
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-accordion-group>
    <bq-accordion size=${args.size} appearance=${args.appearance} .expanded=${args.expanded} .disabled=${args.disabled}>
      <span slot="header">${args.text}</span>
      <div>hello world</div>
    </bq-accordion>
    <bq-accordion size=${args.size} appearance=${args.appearance} .expanded=${args.expanded} .disabled=${args.disabled}>
      <span slot="header">${args.text}</span>
      <div>hello world</div>
    </bq-accordion>
    <bq-accordion size=${args.size} appearance=${args.appearance} .expanded=${args.expanded} .disabled=${args.disabled}>
      <span slot="header">${args.text}</span>
      <div>hello world</div>
    </bq-accordion>
    <bq-accordion size=${args.size} appearance=${args.appearance} .expanded=${args.expanded} .disabled=${args.disabled}>
      <span slot="header">${args.text}</span>
      <div>hello world</div>
    </bq-accordion>
  </bq-accordion-group>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

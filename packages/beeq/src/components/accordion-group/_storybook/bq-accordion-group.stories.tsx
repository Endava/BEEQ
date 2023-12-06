import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-accordion-group.mdx';
import { ACCORDION_SIZE } from '../../accordion/bq-accordion.types';

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
    size: { control: 'select', options: [...ACCORDION_SIZE] },
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    expanded: false,
    size: 'medium',
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-accordion-group>
    <bq-accordion size=${args.size} .expanded=${args.expanded}><span slot="header">${args.text}</span></bq-accordion>
    <bq-accordion size=${args.size} .expanded=${args.expanded}><span slot="header">${args.text}</span></bq-accordion>
    <bq-accordion size=${args.size} .expanded=${args.expanded}><span slot="header">${args.text}</span></bq-accordion>
    <bq-accordion size=${args.size} .expanded=${args.expanded}><span slot="header">${args.text}</span></bq-accordion>
  </bq-accordion-group>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

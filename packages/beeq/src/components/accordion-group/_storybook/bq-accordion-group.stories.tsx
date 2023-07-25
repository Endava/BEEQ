import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-accordion-group.mdx';

const meta: Meta = {
  title: 'Components/Accordions',
  component: 'bq-accordion-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-accordion-group>
    <bq-accordion><span slot="header">${args.text}</span></bq-accordion>
    <bq-accordion><span slot="header">${args.text}</span></bq-accordion>
    <bq-accordion><span slot="header">${args.text}</span></bq-accordion>
    <bq-accordion><span slot="header">${args.text}</span></bq-accordion>
  </bq-accordion-group>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

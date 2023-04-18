import { html } from 'lit-html';
import { BADGE_SIZE } from '../bq-badge.types';
import mdx from './bq-badge.mdx';

import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Badge',
  component: 'bq-badge',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'background-color': { control: 'text' },
    size: { control: 'select', options: BADGE_SIZE },
    'text-color': { control: 'text' },
    // This control is not part of the component
    content: { control: 'text' },
  },
  args: {
    size: 'small',
  },
};

export default meta;
type Story = StoryObj;

const Template = (args) => html`
  <bq-badge background-color=${args['background-color']} size=${args.size} text-color=${args['text-color']}>
    ${args.content}
  </bq-badge>
`;

export const Default: Story = Template.bind({});

export const Medium: Story = Template.bind({});
Medium.args = { size: 'medium' };

export const Digit: Story = Template.bind({});
Digit.args = { content: '2' };

export const Number: Story = Template.bind({});
Number.args = { content: '12' };

export const Green: Story = Template.bind({});
Green.args = {
  'background-color': 'ui--success',
  size: 'large',
};

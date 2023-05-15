import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-badge.mdx';
import { BADGE_SIZE } from '../bq-badge.types';

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

const Template = (args: Args) => html`
  <bq-badge background-color=${args['background-color']} size=${args.size} text-color=${args['text-color']}>
    ${args.content}
  </bq-badge>
`;

export const Default: Story = {
  render: Template,
};

export const Medium: Story = {
  render: Template,
  args: { size: 'medium' },
};

export const Digit: Story = {
  render: Template,
  args: { content: '2' },
};

export const Number: Story = {
  render: Template,
  args: { content: '12' },
};

export const Green: Story = {
  render: Template,

  args: {
    'background-color': 'ui--success',
    size: 'large',
  },
};

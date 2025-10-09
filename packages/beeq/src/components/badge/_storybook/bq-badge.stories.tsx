import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';

import { BADGE_SIZE } from '../bq-badge.types';
import mdx from './bq-badge.mdx';

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
    content: { control: 'text', table: { disable: true } },
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

export const SizeMedium: Story = {
  render: Template,
  args: { size: 'medium' },
};

export const BackgroundColor: Story = {
  render: Template,
  args: {
    'background-color': 'ui--success',
    size: 'medium',
  },
};

export const SingleDigit: Story = {
  render: Template,
  args: { content: '2' },
};

export const TwoDigits: Story = {
  render: Template,
  args: { content: '12' },
};

export const WithText: Story = {
  render: Template,
  args: {
    'background-color': 'ui--success',
    content: 'online',
  },
};

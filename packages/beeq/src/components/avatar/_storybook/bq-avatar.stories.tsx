import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';

import mdx from './bq-avatar.mdx';

const meta: Meta = {
  title: 'Components/Avatar',
  component: 'bq-avatar',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'alt-text': { control: 'text' },
    image: { control: 'text' },
    label: { control: 'text' },
    initials: { control: 'text' },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    size: { control: 'select', options: ['xsmall', 'small', 'medium', 'large'] },
    // Not part of the component API, but used for the storybook
    'badge-content': { control: 'text', table: { disable: true } },
  },
  args: {
    label: 'Avatar component label',
    shape: 'circle',
    size: 'medium',
    'badge-content': '9',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-avatar
    alt-text=${args['alt-text']}
    image=${args.image}
    label=${args.label}
    initials=${args.initials}
    shape=${args.shape}
    size=${args.size}
  ></bq-avatar>
`;

export const Image: Story = {
  render: Template,
  args: {
    'alt-text': 'User profile',
    image:
      'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
  },
};

export const Initials: Story = {
  render: Template,
  args: {
    initials: 'JS',
  },
};

export const WithBadge: Story = {
  render: (args: Args) =>
    html`<bq-avatar
      alt-text=${args['alt-text']}
      image=${args.image}
      label=${args.label}
      initials=${args.initials}
      shape=${args.shape}
      size=${args.size}
    >
      <bq-badge slot="badge" text-color="#fff">${args['badge-content']}</bq-badge>
    </bq-avatar>`,
  args: {
    image:
      'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-tag.mdx';
import { TAG_SIZE, TAG_TYPE, TAG_VARIANT } from '../bq-tag.types';

const meta: Meta = {
  title: 'Components/Tag',
  component: 'bq-tag',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    size: { control: 'select', options: [...TAG_SIZE] },
    open: { control: 'boolean' },
    type: { control: 'select', options: [...TAG_TYPE] },
    variant: { control: 'select', options: [...TAG_VARIANT] },
    'is-removable': { control: 'boolean' },
    'has-icon': { control: 'boolean' },
    'has-color': { control: 'boolean' },
  },
  args: {
    size: 'small',
    open: false,
    type: 'default',
    variant: 'default',
    'is-removable': false,
    'has-icon': false,
    'has-color': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) =>
  html`<bq-tag
    ?is-removable=${args['is-removable']}
    size=${args.size}
    ?open=${args.open}
    type=${args.type}
    variant=${args.variant}
    ?has-icon=${args['has-icon']}
    ?has-color=${args['has-color']}
  >
    <span slot="tag">Tag</span>
  </bq-tag>`;

export const Default: Story = {
  render: Template,
  args: {
    open: true,
    'is-removable': true,
    'has-color': true,
  },
};

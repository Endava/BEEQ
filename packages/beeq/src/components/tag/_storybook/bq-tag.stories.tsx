import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-tag.mdx';
import { TAG_SIZE } from '../bq-tag.types';

const meta: Meta = {
  title: 'Components/Tag',
  component: 'bq-tag',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'is-removable': { control: 'boolean' },
    size: { control: 'select', options: [...TAG_SIZE] },
  },
  args: {
    'is-removable': false,
    size: 'small',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) =>
  html`<bq-tag ?is-removable=${args['is-removable']} size=${args.size}>
    <span slot="tag">Tag</span>
  </bq-tag>`;

export const Default: Story = {
  render: Template,
  args: {
    'is-removable': true,
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-tag.mdx';

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
  },
  args: {
    'is-removable': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) =>
  html`<bq-tag ?is-removable=${args['is-removable']}>
    <span slot="tag"> My Tag </span>
  </bq-tag>`;

export const Default: Story = {
  render: Template,
  args: {
    'is-removable': true,
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-page-title.mdx';

const meta: Meta = {
  title: 'Components/Page title',
  component: 'bq-page-title',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'show-back-icon': { control: 'boolean' },
  },
  args: {
    'show-back-icon': false,
  },
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: (args: Args) => html` <bq-page-title ?show-back-icon=${args['show-back-icon']}> Title </bq-page-title> `,
};

export const TitleBack: Story = {
  name: 'Title + Back',
  render: (args: Args) => html` <bq-page-title ?show-back-icon=${args['show-back-icon']}> Title </bq-page-title> `,
  args: {
    'show-back-icon': true,
  },
};

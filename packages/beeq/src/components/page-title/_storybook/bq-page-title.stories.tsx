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
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => html` <bq-page-title> Title </bq-page-title> `,
};

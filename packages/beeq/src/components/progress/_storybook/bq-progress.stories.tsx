import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-progress.mdx';

const meta: Meta = {
  title: 'Components/Progress',
  component: 'bq-progress',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    value: { control: 'number' },
  },
  args: {
    value: 0,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`<bq-progress .value=${args.value}></bq-progress>`;

export const Default: Story = {
  render: Template,
  args: {
    value: 50,
  },
};

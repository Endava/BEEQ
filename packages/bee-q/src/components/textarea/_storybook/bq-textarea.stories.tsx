import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-textarea.mdx';

const meta: Meta = {
  title: 'Components/Textarea',
  component: 'bq-textarea',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {},
  args: {},
};
export default meta;

type Story = StoryObj;

const Template = (_args: Args) => html`
  <bq-textarea>
    <span slot="label">Label</span>
  </bq-textarea>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

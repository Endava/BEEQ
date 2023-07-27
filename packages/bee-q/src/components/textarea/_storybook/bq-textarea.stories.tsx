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
  argTypes: {
    'auto-grow': { control: 'boolean' },
    rows: { control: 'number' },
  },
  args: {
    'auto-grow': false,
    rows: 5,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-textarea ?auto-grow=${args['auto-grow']} rows=${args.rows}>
    <span slot="label">Label</span>
  </bq-textarea>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

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
    disabled: { control: 'boolean' },
    maxlength: { control: 'number' },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
  },
  args: {
    'auto-grow': false,
    disabled: false,
    maxlength: 0,
    name: 'textarea',
    placeholder: 'Placeholder...',
    rows: 5,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-textarea
    ?auto-grow=${args['auto-grow']}
    ?disabled=${args.disabled}
    maxlength=${args.maxlength}
    name=${args.name}
    placeholder=${args.placeholder}
    rows=${args.rows}
  >
    <span slot="label">Label</span>
  </bq-textarea>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

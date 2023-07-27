import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import { ifDefined } from 'lit-html/directives/if-defined.js';

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
    value: { control: 'text' },
  },
  args: {
    'auto-grow': false,
    disabled: false,
    maxlength: 0,
    name: 'textarea',
    placeholder: 'Placeholder...',
    rows: 5,
    value: undefined,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-textarea
    ?auto-grow=${args['auto-grow']}
    ?disabled=${args.disabled}
    maxlength=${ifDefined(args.maxlength)}
    name=${ifDefined(args.name)}
    placeholder=${ifDefined(args.placeholder)}
    rows=${ifDefined(args.rows)}
    value=${ifDefined(args.value)}
  >
    <span slot="label">Label</span>
  </bq-textarea>
`;

export const Default: Story = {
  render: Template,
};

export const InitialValue: Story = {
  render: Template,
  args: {
    value:
      'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Tempora, nulla. Ab non odio facere enim, voluptatum voluptates quod molestias suscipit fugiat et expedita accusamus quidem nostrum maxime illo recusandae ratione?',
  },
};

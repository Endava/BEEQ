import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-progress.mdx';
import { PROGRESS_MODE, PROGRESS_THICKNESS, PROGRESS_TYPE } from '../bq-progress.types';

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
    mode: { control: 'select', options: [...PROGRESS_MODE] },
    thickness: { control: 'select', options: [...PROGRESS_THICKNESS] },
    type: { control: 'select', options: [...PROGRESS_TYPE] },
    'border-shape': { control: 'boolean' },
    label: { control: 'boolean' },
    'enable-tooltip': { control: 'boolean' },
  },
  args: {
    value: 0,
    mode: 'determinate',
    thickness: 'medium',
    type: 'default',
    'border-shape': false,
    label: false,
    'enable-tooltip': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-progress
    value=${args.value}
    mode=${args.mode}
    thickness=${args.thickness}
    type=${args.type}
    ?border-shape=${args['border-shape']}
    ?label=${args.label}
    ?enable-tooltip=${args['enable-tooltip']}
  ></bq-progress>
`;

export const Default: Story = {
  render: Template,
  args: {
    value: 10,
  },
};

export const MediumThickness: Story = {
  render: Template,
  args: {
    value: 20,
    thickness: 'large',
  },
};

export const Error: Story = {
  render: Template,
  args: {
    value: 40,
    type: 'error',
  },
};

export const WithLabel: Story = {
  render: Template,
  args: {
    value: 60,
    label: true,
  },
};

export const WithTooltip: Story = {
  render: Template,
  args: {
    value: 80,
    'enable-tooltip': true,
  },
};

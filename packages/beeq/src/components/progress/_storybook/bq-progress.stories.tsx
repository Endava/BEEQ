import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-progress.mdx';
import { PROGRESS_BORDER_SHAPE, PROGRESS_THICKNESS, PROGRESS_TYPE } from '../bq-progress.types';

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
    indeterminate: { control: 'boolean' },
    thickness: { control: 'select', options: [...PROGRESS_THICKNESS] },
    type: { control: 'select', options: [...PROGRESS_TYPE] },
    'border-shape': { control: 'select', options: [...PROGRESS_BORDER_SHAPE] },
    label: { control: 'boolean' },
    'enable-tooltip': { control: 'boolean' },
  },
  args: {
    value: 0,
    indeterminate: false,
    thickness: 'medium',
    type: 'default',
    'border-shape': 'rounded',
    label: false,
    'enable-tooltip': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div class="w-64">
    <bq-progress
      value=${args.value}
      indeterminate=${args.indeterminate}
      thickness=${args.thickness}
      type=${args.type}
      border-shape=${args['border-shape']}
      ?label=${args.label}
      ?enable-tooltip=${args['enable-tooltip']}
    ></bq-progress>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    value: 10,
  },
};

export const LargeThickness: Story = {
  render: Template,
  args: {
    value: 20,
    thickness: 'large',
  },
};

export const ErrorState: Story = {
  name: 'Error',
  render: Template,
  args: {
    value: 40,
    type: 'error',
  },
};

export const BorderShape: Story = {
  render: Template,
  args: {
    value: 80,
    'border-shape': 'square',
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

export const Indeterminate: Story = {
  render: Template,
  args: {
    indeterminate: true,
  },
};

import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-progress.mdx';
import { PROGRESS_MODE, PROGRESS_TICKNESS, PROGRESS_TYPE } from '../bq-progress.types';

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
    thickness: { control: 'select', options: [...PROGRESS_TICKNESS] },
    type: { control: 'select', options: [...PROGRESS_TYPE] },
    level: { control: 'boolean' },
  },
  args: {
    value: 0,
    mode: 'determinated',
    thickness: 'medium',
    type: 'default',
    level: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) =>
  html`<bq-progress
    value=${args.value}
    mode=${args.mode}
    thickness=${args.thickness}
    type=${args.type}
    ?level=${args.level}
  ></bq-progress>`;

export const Default: Story = {
  render: Template,
  args: {
    value: 50,
    mode: 'determinated',
    thickness: 'large',
    type: 'error',
    level: true,
  },
};

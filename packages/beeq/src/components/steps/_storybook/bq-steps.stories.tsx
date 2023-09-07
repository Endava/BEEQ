import { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-steps.mdx';
import { STEPS_SIZE, STEPS_TYPE } from '../bq-steps.types';

const meta: Meta = {
  title: 'Components/Steps',
  component: 'bq-steps',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
    type: { control: 'select', options: [...STEPS_TYPE] },
    size: { control: 'select', options: [...STEPS_SIZE] },
    bqClick: { action: 'bqClick' },
  },
  args: {
    text: 'text',
    type: 'numeric',
    size: 'medium',
  },
};
export default meta;

const Template = (args: Args) => {
  return html` <bq-steps type=${args.type} class="p-2" size=${args.size}>
    <bq-step-item status="default" value="x">
      <bq-icon slot="prefix" name="bell-ringing" size="24" weight="regular"></bq-icon>
      <span>step item 1</span>
      <span slot="description">description for step</span>
    </bq-step-item>
    <bq-step-item status="disabled" value="xy">
      <bq-icon slot="prefix" name="bell-ringing" size="24" weight="regular"></bq-icon>
      <span>step item 2 with longerlongerlongerlongerlonger title</span>
      <span slot="description">description for step</span>
    </bq-step-item>
    <bq-step-item status="completed" value="xyz">
      <bq-icon slot="prefix" name="factory" size="24" weight="regular"></bq-icon>
      <span>title</span>
      <span slot="description">description for step 3</span>
    </bq-step-item>
  </bq-steps>`;
};

export const Default: StoryObj = {
  render: Template,
};

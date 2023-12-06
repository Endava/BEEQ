import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-empty-state.mdx';
import { EMPTY_STATE_SIZE } from '../bq-empty-state.types';

const meta: Meta = {
  title: 'Components/Empty state',
  component: 'bq-empty-state',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    size: { control: 'select', options: [...EMPTY_STATE_SIZE] },
  },
  args: {
    size: 'medium',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html` <bq-empty-state size=${args.size}> Title </bq-empty-state> `;

const TemplateWithBody = (args: Args) => html`
  <div class="flex flex-row gap-20">
    <bq-empty-state size=${args.size}>
      Title
      <span slot="body"> Description </span>
    </bq-empty-state>
    <bq-empty-state size=${args.size}>
      Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
    </bq-empty-state>
  </div>
`;

const TemplateWithCTA = (args: Args) => html`
  <div class="flex flex-row gap-20">
    <bq-empty-state size=${args.size}>
      Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
      <div class="flex gap-xs" slot="footer">
        <bq-button appearance="primary" size="small"> Button </bq-button>
      </div>
    </bq-empty-state>
    <bq-empty-state size=${args.size}>
      Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
      <div class="flex gap-xs" slot="footer">
        <bq-button size="small" variant="ghost"> Button </bq-button>
      </div>
    </bq-empty-state>
    <bq-empty-state size=${args.size}>
      Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
      <div class="flex gap-xs" slot="footer">
        <bq-button size="small" variant="ghost"> Button </bq-button>
        <bq-button appearance="primary" size="small"> Button </bq-button>
      </div>
    </bq-empty-state>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

export const WithBody: Story = {
  render: TemplateWithBody,
  args: {},
};

export const WithCallToAction: Story = {
  render: TemplateWithCTA,
  args: {},
};

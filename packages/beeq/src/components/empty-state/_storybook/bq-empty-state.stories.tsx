import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';

import { EMPTY_STATE_SIZE } from '../bq-empty-state.types';
import mdx from './bq-empty-state.mdx';

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

const storyStyles = html`
  <style>
    .bq-empty-state-story__examples {
      display: flex;
      flex-direction: row;
      gap: 5rem;
    }

    .bq-empty-state-story__footer {
      display: flex;
      gap: var(--bq-spacing-xs);
    }
  </style>
`;

export const Default: Story = {
  render: (args: Args) => html` <bq-empty-state size=${args.size}> Title </bq-empty-state> `,
};

export const WithBody: Story = {
  render: (args: Args) => html`
    ${storyStyles}
    <div class="bq-empty-state-story__examples">
      <bq-empty-state size=${args.size}>
        Title
        <span slot="body"> Description </span>
      </bq-empty-state>
      <bq-empty-state size=${args.size}>
        Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
      </bq-empty-state>
    </div>
  `,
};

export const WithCallToAction: Story = {
  render: (args: Args) => html`
    ${storyStyles}
    <div class="bq-empty-state-story__examples">
      <bq-empty-state size=${args.size}>
        Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
        <div class="bq-empty-state-story__footer" slot="footer">
          <bq-button appearance="primary" size="small"> Button </bq-button>
        </div>
      </bq-empty-state>
      <bq-empty-state size=${args.size}>
        Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
        <div class="bq-empty-state-story__footer" slot="footer">
          <bq-button size="small" variant="ghost"> Button </bq-button>
        </div>
      </bq-empty-state>
      <bq-empty-state size=${args.size}>
        Title <span slot="body"> Description <a class="bq-link" href="https://example.com">Link</a> </span>
        <div class="bq-empty-state-story__footer" slot="footer">
          <bq-button size="small" variant="ghost"> Button </bq-button>
          <bq-button appearance="primary" size="small"> Button </bq-button>
        </div>
      </bq-empty-state>
    </div>
  `,
};

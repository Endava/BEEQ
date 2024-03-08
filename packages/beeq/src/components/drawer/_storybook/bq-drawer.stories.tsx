import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-drawer.mdx';

const meta: Meta = {
  title: 'Components/Drawer',
  component: 'bq-drawer',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    open: { control: 'boolean' },
    // Events
    bqShow: { action: 'bqOpen' },
    bqHide: { action: 'bqClose' },
    bqAfterOpen: { action: 'bqAfterOpen' },
    bqAfterClose: { action: 'bqAfterClose' },
  },
  args: {
    open: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div class="flex gap-xl">
    <div class="w-80">
      <bq-drawer ?open=${args.open}
        >Title
        <div
          class="flex h-60 items-center justify-center border-[0.2px] border-dashed border-stroke-brand bg-[var(--bq-danger-light)]"
          slot="body"
        >
          Slot
        </div>
        <div class="flex flex-1 justify-center gap-xs" slot="footer">
          <bq-button appearance="primary" block size="small"> Button </bq-button>
          <bq-button appearance="link" block size="small"> Button </bq-button>
        </div></bq-drawer
      >
    </div>
    <div class="w-80">
      <bq-drawer ?open=${args.open}
        ><bq-icon name="user-circle" weight="bold" slot="icon"></bq-icon>Title
        <div
          class="flex h-60 items-center justify-center border-[0.2px] border-dashed border-stroke-brand bg-[var(--bq-danger-light)]"
          slot="body"
        >
          Slot
        </div>
      </bq-drawer>
    </div>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    open: true,
  },
};

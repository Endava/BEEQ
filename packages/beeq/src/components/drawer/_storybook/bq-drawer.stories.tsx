import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

import mdx from './bq-drawer.mdx';
import { DRAWER_PLACEMENT } from '../bq-drawer.types';

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
    placement: { control: 'select', options: [...DRAWER_PLACEMENT] },
    // Events
    bqShow: { action: 'bqOpen' },
    bqHide: { action: 'bqClose' },
    bqAfterOpen: { action: 'bqAfterOpen' },
    bqAfterClose: { action: 'bqAfterClose' },
  },
  args: {
    open: false,
    placement: 'left',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const handleOpenDrawer = async () => {
    const dialogElem = document.querySelector('bq-drawer');
    await dialogElem.show();
  };

  return html`
    <bq-button @bqClick=${handleOpenDrawer}>Open Drawer</bq-button>
    <bq-drawer
      ?open=${args.open}
      placement=${args.placement}
      @bqCancel=${args.bqCancel}
      @bqClose=${args.bqClose}
      @bqOpen=${args.bqOpen}
      @bqAfterOpen=${args.bqAfterOpen}
      @bqAfterClose=${args.bqAfterClose}
    >
      <div class="flex gap-xs" slot="title">
        <bq-icon name="user-circle" weight="bold" role="img" title="Info"></bq-icon>
        Title
      </div>
      <div
        class="flex h-full items-center justify-center rounded-xs border border-dashed border-stroke-brand bg-red-100"
        slot="body"
      >
        Slot
      </div>
      <div class="flex flex-1 justify-center gap-xs" slot="footer">
        <bq-button appearance="primary" block size="small"> Button </bq-button>
        <bq-button appearance="link" block size="small"> Button </bq-button>
      </div>
    </bq-drawer>
  `;
};

export const Default: Story = {
  render: Template,
  args: {
    open: false,
    placement: 'left',
  },
};

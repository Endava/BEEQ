import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

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
    'close-on-click-outside': { control: 'boolean' },
    'close-on-esc': { control: 'boolean' },
    'enable-backdrop': { control: 'boolean' },
    // Events
    bqOpen: { action: 'bqOpen' },
    bqClose: { action: 'bqClose' },
    bqAfterOpen: { action: 'bqAfterOpen' },
    bqAfterClose: { action: 'bqAfterClose' },
    // Not part of the component API
    noFooter: { control: 'boolean', table: { disable: true } },
    customFooterDivider: { control: 'boolean', table: { disable: true } },
  },
  args: {
    open: false,
    placement: 'left',
    'close-on-click-outside': false,
    'close-on-esc': false,
    'enable-backdrop': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const handleOpenDrawer = async () => {
    const drawerElem = document.querySelector('bq-drawer');
    await drawerElem.show();
  };

  return html`
    <bq-button @bqClick=${handleOpenDrawer}>Open Drawer</bq-button>
    <bq-drawer
      placement=${args.placement}
      ?open=${args.open}
      ?close-on-click-outside=${args['close-on-click-outside']}
      ?close-on-esc=${args['close-on-esc']}
      ?enable-backdrop=${args['enable-backdrop']}
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
      >
        Slot
      </div>
      ${!args.noFooter
        ? html`
            ${args.customFooterDivider ? html`<bq-divider slot="footer-divider" class="mb-m block" />` : nothing}
            <div class="flex flex-1 justify-center gap-xs" slot="footer">
              <bq-button appearance="primary" block size="small"> Button </bq-button>
              <bq-button appearance="link" block size="small"> Button </bq-button>
            </div>
          `
        : nothing}
    </bq-drawer>
  `;
};

export const Default: Story = {
  render: Template,
  args: {
    open: false,
    placement: 'right',
  },
};

export const NoFooter: Story = {
  render: Template,
  args: {
    open: false,
    placement: 'right',
    noFooter: true,
  },
};

export const Placement: Story = {
  render: Template,
  args: {
    open: false,
    placement: 'left',
  },
};

export const WithBackdrop: Story = {
  render: Template,
  args: {
    open: false,
    placement: 'right',
    'enable-backdrop': true,
  },
};

export const WithCustomDivider: Story = {
  render: Template,
  args: {
    open: false,
    placement: 'right',
    'enable-backdrop': true,
    customFooterDivider: true,
  },
};

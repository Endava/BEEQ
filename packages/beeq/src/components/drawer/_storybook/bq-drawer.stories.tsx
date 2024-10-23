import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-drawer.mdx';
import { DRAWER_POSITIONS } from '../bq-drawer.types';

const meta: Meta = {
  title: 'Components/Drawer',
  component: 'bq-drawer',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'enable-backdrop': { control: 'boolean' },
    'close-on-click-outside': { control: 'boolean' },
    'close-on-esc': { control: 'boolean' },
    open: { control: 'boolean' },
    position: { control: 'inline-radio', options: [...DRAWER_POSITIONS] },
    // Events
    bqOpen: { action: 'bqOpen' },
    bqClose: { action: 'bqClose' },
    bqAfterOpen: { action: 'bqAfterOpen' },
    bqAfterClose: { action: 'bqAfterClose' },
    // Not part of the component API
    noFooter: { control: 'boolean', table: { disable: true } },
    customFooterDivider: { control: 'boolean', table: { disable: true } },
    customCloseIcon: { control: 'text', table: { disable: true } },
  },
  args: {
    open: false,
    position: 'end',
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

  const customFooterDivider = args.customFooterDivider
    ? html`
        <bq-divider
          slot="footer-divider"
          class="block m-be-m"
          stroke-color="stroke--primary"
          stroke-thickness="1"
        ></bq-divider>
      `
    : nothing;

  return html`
    <bq-button @bqClick=${handleOpenDrawer}>Open Drawer</bq-button>
    <bq-drawer
      ?close-on-click-outside=${args['close-on-click-outside']}
      ?close-on-esc=${args['close-on-esc']}
      ?enable-backdrop=${args['enable-backdrop']}
      ?open=${args.open}
      position=${args.position}
      @bqClose=${args.bqClose}
      @bqOpen=${args.bqOpen}
      @bqAfterOpen=${args.bqAfterOpen}
      @bqAfterClose=${args.bqAfterClose}
    >
      ${ifDefined(args.customCloseIcon) ? args.customCloseIcon : nothing}
      <div class="flex gap-xs" slot="title">
        <bq-icon name="user-circle" weight="bold" role="img" title="Info"></bq-icon>
        Title
      </div>
      <div class="flex items-center justify-center rounded-xs border-s border-dashed border-brand bg-red-100 bs-full">
        Slot
      </div>
      ${!args.noFooter
        ? html`
            ${customFooterDivider}
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
};

export const NoFooter: Story = {
  render: Template,
  args: {
    noFooter: true,
  },
};

export const Position: Story = {
  render: Template,
  args: {
    open: false,
    position: 'start',
  },
};

export const WithBackdrop: Story = {
  render: Template,
  args: {
    'enable-backdrop': true,
  },
};

export const WithCustomFooterDivider: Story = {
  render: Template,
  args: {
    'enable-backdrop': true,
    customFooterDivider: true,
  },
};

export const WithCustomCloseIcon: Story = {
  render: Template,
  args: {
    'enable-backdrop': true,
    customCloseIcon: html`<bq-icon
      name="arrow-fat-lines-right"
      role="img"
      title="Close"
      slot="button-close"
    ></bq-icon>`,
  },
};

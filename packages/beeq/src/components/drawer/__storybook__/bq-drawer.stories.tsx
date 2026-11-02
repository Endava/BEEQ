import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import { fn } from 'storybook/test';

import { DRAWER_POSITIONS } from '../bq-drawer.types';
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
    'enable-backdrop': { control: 'boolean' },
    'close-on-click-outside': { control: 'boolean' },
    'close-on-esc': { control: 'boolean' },
    open: { control: 'boolean' },
    position: { control: 'inline-radio', options: [...DRAWER_POSITIONS] },
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
    // Events
    bqOpen: fn(),
    bqClose: fn(),
    bqAfterOpen: fn(),
    bqAfterClose: fn(),
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
        <bq-divider slot="footer-divider" stroke-color="stroke--primary" stroke-thickness="1"></bq-divider>
      `
    : nothing;

  return html`
    <style>
      .bq-story-drawer div[slot='title'] {
        display: flex;
        align-items: center;
        gap: var(--bq-spacing-xs);
      }

      .bq-story-drawer__content {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: var(--bq-radius--xs);
        border-width: var(--bq-stroke-s);
        border-style: dashed;
        border-color: var(--bq-stroke--brand);
        background-color: var(--bq-background--secondary);
        block-size: 100%;
      }

      .bq-story-drawer bq-divider[slot='footer-divider'] {
        display: block;
        margin-block-end: var(--bq-spacing-m);
      }

      .bq-story-drawer div[slot='footer'] {
        display: flex;
        flex: 1 1 0%;
        justify-content: center;
        gap: var(--bq-spacing-xs);
      }
    </style>
    <bq-button @bqClick=${handleOpenDrawer}>Open Drawer</bq-button>
    <bq-drawer
      class="bq-story-drawer"
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
      ${ifDefined(args.customCloseIcon) ? unsafeHTML(args.customCloseIcon) : nothing}
      <div slot="title">
        <bq-icon name="user-circle" weight="bold" role="img" title="Info"></bq-icon>
        Title
      </div>
      <div class="bq-story-drawer__content">
        Slot
      </div>
      ${
        !args.noFooter
          ? html`
            ${customFooterDivider}
            <div slot="footer">
              <bq-button appearance="primary" block size="small"> Button </bq-button>
              <bq-button appearance="link" block size="small"> Button </bq-button>
            </div>
          `
          : nothing
      }
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
    customCloseIcon: `
      <bq-icon
        name="arrow-fat-lines-right"
        role="img"
        title="Close"
        slot="button-close"
      ></bq-icon>
    `,
  },
};

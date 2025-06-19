import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import mdx from './bq-dialog.mdx';
import { DIALOG_BORDER_RADIUS, DIALOG_FOOTER_APPEARANCE, DIALOG_SIZE } from '../bq-dialog.types';

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'bq-dialog',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'disable-backdrop': { control: 'boolean' },
    'disable-close-click-outside': { control: 'boolean' },
    'disable-close-esc-keydown': { control: 'boolean' },
    'footer-appearance': { control: 'inline-radio', options: [...DIALOG_FOOTER_APPEARANCE] },
    'hide-close-button': { control: 'boolean' },
    border: { control: 'select', options: [...DIALOG_BORDER_RADIUS] },
    open: { control: 'boolean' },
    size: { control: 'select', options: [...DIALOG_SIZE] },
    // Events
    bqCancel: { action: 'bqCancel' },
    bqClose: { action: 'bqClose' },
    bqOpen: { action: 'bqOpen' },
    bqAfterOpen: { action: 'bqAfterOpen' },
    bqAfterClose: { action: 'bqAfterClose' },
    // Not part of the public API
    noContent: { control: 'boolean', table: { disable: true } },
    noFooter: { control: 'boolean', table: { disable: true } },
    customClose: { control: 'text', table: { disable: true } },
  },
  args: {
    'disable-backdrop': false,
    'disable-close-click-outside': false,
    'disable-close-esc-keydown': false,
    'hide-close-button': false,
    'footer-appearance': 'standard',
    border: 'm',
    open: false,
    size: 'medium',
    // Not part of the public API
    noContent: false,
    noFooter: false,
  },
};

export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const handleOpenDialog = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.show();
  };

  return html`
    <bq-button @bqClick=${handleOpenDialog}>Open Dialog</bq-button>
    <bq-dialog
      ?disable-backdrop=${args['disable-backdrop']}
      ?disable-close-esc-keydown=${args['disable-close-esc-keydown']}
      ?disable-close-click-outside=${args['disable-close-click-outside']}
      footer-appearance=${args['footer-appearance']}
      ?hide-close-button=${args['hide-close-button']}
      border=${args.border}
      ?open=${args.open}
      size=${args.size}
      @bqCancel=${args.bqCancel}
      @bqClose=${args.bqClose}
      @bqOpen=${args.bqOpen}
      @bqAfterOpen=${args.bqAfterOpen}
      @bqAfterClose=${args.bqAfterClose}
    >
      ${ifDefined(args.customClose) ? unsafeHTML(args.customClose) : nothing}
      <h5 class="bold flex items-center gap-s" slot="title">
        <bq-icon name="info" size="30" color="text--accent" role="img" title="Info"></bq-icon>
        Title
      </h5>
      ${!args.noContent
        ? html`
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
              scrambled it to make a type specimen book.
            </p>
          `
        : nothing}
      ${!args.noFooter
        ? html`
            <div class="flex gap-xs" slot="footer">
              <bq-button appearance="link"> Button </bq-button>
              <bq-button variant="ghost"> Button </bq-button>
              <bq-button variant="standard" slot="footer"> Button </bq-button>
            </div>
          `
        : nothing}
    </bq-dialog>
  `;
};

export const Default: Story = {
  render: Template,
  args: {
    open: true,
  },
};

export const HighlightFooter: Story = {
  render: Template,
  args: {
    open: true,
    'footer-appearance': 'highlight',
  },
};

export const NoFooter: Story = {
  render: Template,
  args: {
    open: true,
    noFooter: true,
  },
};

export const NoBackdrop: Story = {
  render: Template,
  args: {
    open: true,
    'disable-backdrop': true,
  },
};

export const CustomCloseButton: Story = {
  render: Template,
  args: {
    open: true,
    customClose: `
      <style>
        bq-button[slot='button-close']::part(button) {
          border-radius: var(--bq-radius--full);
          /* Paddings */
          padding-block: 0;
          padding-inline: 0;
          /* Size (width/height) */
          block-size: var(--bq-spacing-xl);
          inline-size: var(--bq-spacing-xl);
        }
      </style>
      <bq-button appearance="text" size="small" slot="button-close">
        <bq-icon class="cursor-pointer" name="x" role="img" title="Close"></bq-icon>
      </bq-button>
    `,
  },
};

const ConfirmTemplate = (args: Args) => {
  const handleOpenDialog = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.show();
  };

  const handleDialogConfirm = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.hide();
    alert('Account deactivated');
  };

  const handleDialogCancel = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.cancel();
  };

  return html`
    <bq-button variant="ghost" @bqClick=${handleOpenDialog}>Deactivate account</bq-button>
    <bq-dialog
      ?disable-backdrop=${args['disable-backdrop']}
      ?disable-close-esc-keydown=${args['disable-close-esc-keydown']}
      ?disable-close-click-outside=${args['disable-close-click-outside']}
      footer-appearance=${args['footer-appearance']}
      ?hide-close-button=${args['hide-close-button']}
      border=${args.border}
      ?open=${args.open}
      size=${args.size}
      @bqCancel=${args.bqCancel}
      @bqClose=${args.bqClose}
      @bqOpen=${args.bqOpen}
      @bqAfterOpen=${args.bqAfterOpen}
      @bqAfterClose=${args.bqAfterClose}
    >
      <h5 class="bold flex items-center gap-s" slot="title">
        <bq-icon name="info" size="30" color="icon--danger" role="img" title="Danger"></bq-icon>
        Deactivate account
      </h5>
      <p>Are your sure you want to deactivate your account? All of your data will be permanently removed.</p>
      <span class="text-s text-secondary"> This action cannot be undone </span>
      <div class="flex gap-xs" slot="footer">
        <bq-button appearance="secondary" @bqClick=${handleDialogCancel}> Cancel </bq-button>
        <bq-button variant="danger" @bqClick=${handleDialogConfirm}> Yes, deactivate </bq-button>
      </div>
    </bq-dialog>
  `;
};

export const DialogConfirm: Story = {
  render: ConfirmTemplate,
  args: {
    'disable-close-click-outside': true,
    'disable-close-esc-keydown': true,
    'hide-close-button': true,
  },
};

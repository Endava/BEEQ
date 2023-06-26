import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

import mdx from './bq-dialog.mdx';

import { DIALOG_FOOTER_APPEARANCE, DIALOG_SIZE } from '../bq-dialog.types';

const meta: Meta = {
  title: 'Components/Dialog',
  component: 'bq-dialog',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'disable-close-click-outside': { control: 'boolean' },
    'disable-close-esc-keydown': { control: 'boolean' },
    'footer-apperance': { control: 'select', options: [...DIALOG_FOOTER_APPEARANCE] },
    'hide-close-button': { control: 'boolean' },
    open: { control: 'boolean' },
    size: { control: 'select', options: [...DIALOG_SIZE] },
    // Not part of the public API
    noContent: { control: 'boolean', table: { disable: true } },
    noFooter: { control: 'boolean', table: { disable: true } },
  },
  args: {
    'disable-close-click-outside': false,
    'disable-close-esc-keydown': false,
    'hide-close-button': false,
    'footer-apperance': 'standard',
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
      ?disable-close-esc-keydown=${args['disable-close-esc-keydown']}
      ?disable-close-click-outside=${args['disable-close-click-outside']}
      footer-apperance=${args['footer-apperance']}
      ?hide-close-button=${args['hide-close-button']}
      ?open=${args.open}
      size=${args.size}
    >
      <bq-icon name="info" size="30" color="text--accent" role="img" title="Info" slot="icon"></bq-icon>
      <h3 slot="title">Title</h3>
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
};

export const NoFooter: Story = {
  render: Template,
  args: {
    noFooter: true,
  },
};

const ConfirmTemplate = (args: Args) => {
  const handleOpenDialog = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.show();
  };

  const handleCloseDialog = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.hide();
  };

  return html`
    <bq-button @bqClick=${handleOpenDialog}>Open Confirm Dialog</bq-button>
    <bq-dialog
      ?disable-close-esc-keydown=${args['disable-close-esc-keydown']}
      ?disable-close-click-outside=${args['disable-close-click-outside']}
      footer-apperance=${args['footer-apperance']}
      ?hide-close-button=${args['hide-close-button']}
      ?open=${args.open}
      size=${args.size}
    >
      <h3 slot="title">Please confirm</h3>
      <p>Are your sure you want to leave this page?</p>
      <span> All unsaved work will be lost. </span>
      <div class="flex gap-xs" slot="footer">
        <bq-button variant="ghost" @bqClick=${handleCloseDialog}> Yes, I confirm </bq-button>
        <bq-button variant="standard" slot="footer"> No, I want to stay </bq-button>
      </div>
    </bq-dialog>
  `;
};

export const Confirm: Story = {
  render: ConfirmTemplate,
  args: {
    'disable-close-click-outside': true,
    'disable-close-esc-keydown': true,
    'hide-close-button': true,
  },
};

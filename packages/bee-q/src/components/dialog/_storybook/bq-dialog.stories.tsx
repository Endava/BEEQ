import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

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
    text: { control: 'text', table: { disable: true } },
    size: { control: 'select', options: [...DIALOG_SIZE] },
    'footer-apperance': { control: 'select', options: [...DIALOG_FOOTER_APPEARANCE] },
    'hide-close-button': { control: 'boolean' },
    'disable-outside-click-close': { control: 'boolean' },
    'disable-esc-key-down-close': { control: 'boolean' },
  },
  args: {
    text: 'text',
    size: 'medium',
    'footer-apperance': 'standard',
  },
};

export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const handleOpenDialog = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.open();
  };

  return html`
    <bq-button @bqClick=${handleOpenDialog}>Open Dialog</bq-button>
    <bq-dialog
      size=${args.size}
      footer-apperance=${args['footer-apperance']}
      ?hide-close-button=${args['hide-close-button']}
      ?disable-outside-click-close=${args['disable-outside-click-close']}
      ?disable-esc-key-down-close=${args['disable-esc-key-down-close']}
    >
      <bq-icon name="info" color="text--accent" role="img" title="Info" part="icon-on" slot="icon"></bq-icon>
      <h3 slot="title">Title</h3>
      <p slot="description">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book.
      </p>
      <bq-button appearance="primary" size="medium" type="button" variant="ghost" class="hydrated" slot="footer">
        Ghost button
      </bq-button>
      <bq-button appearance="primary" size="medium" type="button" variant="standard" slot="footer">
        Standard button
      </bq-button>
    </bq-dialog>
  `;
};

export const Default: Story = {
  render: Template,
};

const ConfirmTemplate = (args: Args) => {
  const handleOpenDialog = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.open();
  };

  const handleCloseDialog = async () => {
    const dialogElem = document.querySelector('bq-dialog');
    await dialogElem.close();
  };

  return html`
    <bq-button @bqClick=${handleOpenDialog}>Open Confirm Dialog</bq-button>
    <bq-dialog
      size=${args.size}
      footer-apperance=${args['footer-apperance']}
      ?hide-close-button=${args['hide-close-button']}
      ?disable-outside-click-close=${args['disable-outside-click-close']}
      ?disable-esc-key-down-close=${args['disable-esc-key-down-close']}
    >
      <h3 slot="title">Lorem Ipsum ?</h3>
      <p slot="description">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
      <bq-button
        appearance="primary"
        size="medium"
        type="button"
        variant="ghost"
        class="hydrated"
        @bqClick=${handleCloseDialog}
        slot="footer"
      >
        Disagree
      </bq-button>
      <bq-button
        appearance="primary"
        size="medium"
        type="button"
        variant="standard"
        class="hydrated"
        @bqClick=${handleCloseDialog}
        slot="footer"
      >
        Agree
      </bq-button>
    </bq-dialog>
  `;
};

export const Confirm: Story = {
  render: ConfirmTemplate,
  args: {
    'hide-close-button': true,
    'disable-outside-click-close': true,
    'disable-esc-key-down-close': true,
  },
};

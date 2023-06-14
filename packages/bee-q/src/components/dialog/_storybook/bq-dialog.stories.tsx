import { html } from 'lit-html';

import mdx from './bq-dialog.mdx';

import { DIALOG_FOOTER_VARIANT } from '../bq-dialog.types';

export default {
  title: 'Components/Dialog',
  component: 'bq-dialog',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    variant: { control: 'select', options: [...DIALOG_FOOTER_VARIANT] },
  },
  args: {
    text: 'text',
    size: 'medium',
    variant: 'standard',
  },
};

const Template = (args) => {
  return html` <bq-button>Open Dialog</bq-button>
    <bq-dialog size=${args.size} variant=${args.variant}>
      <div slot="info">
        <bq-icon name="info" color="text--accent" role="img" title="Info" part="icon-on" />
      </div>
      <h3 slot="title">Title</h3>
      <p slot="content">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's
        standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make
        a type specimen book.
      </p>
      <footer slot="buttons">
        <bq-button appearance="primary" size="small" type="button" variant="ghost" class="hydrated">
          Primary button
        </bq-button>
        <bq-button appearance="primary" size="small" type="button" variant="standard"> Primary button </bq-button>
      </footer>
    </bq-dialog>

    <script>
      const buttonElem = document.querySelector('bq-button');
      const dialogElem = document.querySelector('bq-dialog');

      buttonElem.addEventListener('bqClick', async function () {
        await dialogElem.open();
      });
    </script>`;
};

export const Default = (args) => Template(args);

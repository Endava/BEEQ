import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';

import mdx from './bq-page-title.mdx';

const meta: Meta = {
  title: 'Components/Page title',
  component: 'bq-page-title',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    // Not part of the component's API, so we don't want to expose it in the controls panel
    'have-back-navigation': { control: 'boolean', table: { disable: true } },
    customDivider: { control: 'boolean', table: { disable: true } },
    title: { control: 'text', table: { disable: true } },
    'sub-title': { control: 'text', table: { disable: true } },
    actions: { control: 'text', table: { disable: true } },
    'custom-style': { control: 'boolean', table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj;

const storyStyles = html`
  <style>
    .bq-page-title-story__actions {
      display: flex;
    }

    .bq-page-title-story__actions--end {
      flex: 1 1 0;
      justify-content: flex-end;
    }

    .bq-page-title-story__action {
      padding-block: var(--bq-spacing-xs2);
      padding-inline: var(--bq-spacing-xs2);
    }
  </style>
`;

const Template = (args: Args) => {
  const actionsSlotClass = args['custom-style']
    ? 'bq-page-title-story__actions bq-page-title-story__actions--end'
    : 'bq-page-title-story__actions';

  return html`
    ${storyStyles}
    <bq-page-title>
      ${
        args['have-back-navigation']
          ? html`
            <bq-button appearance="link" slot="back">
              <bq-icon
                color="text--primary"
                name="arrow-left"
                weight="bold"
                role="img"
                title="Navigate back to the previous page"
              ></bq-icon>
            </bq-button>
          `
          : nothing
      }
      ${args.title} ${args['sub-title'] ? html`<div slot="sub-title">${args['sub-title']}</div>` : nothing}
      ${args.actions ? html`<div class="${actionsSlotClass}" slot="suffix">${unsafeHTML(args.actions)}</div>` : nothing}
    </bq-page-title>
  `;
};

export const Default: Story = {
  render: Template,
  args: {
    title: 'Title',
  },
};

export const TitleBack: Story = {
  name: 'Title + Back',
  render: Template,
  args: {
    'have-back-navigation': true,
    title: 'Title',
  },
};

export const TitleBackSubtitle: Story = {
  name: 'Title + Back + Subtitle',
  render: Template,
  args: {
    'have-back-navigation': true,
    title: 'Title',
    'sub-title': 'Sub-title',
  },
};

export const TitleBackActions: Story = {
  name: 'Custom - Title + Back + Subtitle + Actions',
  render: Template,
  args: {
    'have-back-navigation': true,
    title: 'Title',
    'sub-title': 'Sub-title',
    actions: `
      <bq-icon color="text--brand" class="bq-page-title-story__action" name="pencil-simple-bold"></bq-icon>
      <bq-icon color="text--brand" class="bq-page-title-story__action" name="download-simple-bold"></bq-icon>
    `,
    'custom-style': true,
  },
};

export const TitleBackActionsCustomDefault: Story = {
  name: 'Default - Title + Back + Subtitle + Actions + Divider',
  render: Template,
  args: {
    'have-back-navigation': true,
    title: 'Title',
    'sub-title': 'Sub-title',
    actions: `
      <bq-icon color="text--brand" class="bq-page-title-story__action" name="pencil-simple-bold"></bq-icon>
      <bq-icon color="text--brand" class="bq-page-title-story__action" name="download-simple-bold"></bq-icon>
    `,
  },
};

export const TitleBackActionsCustom: Story = {
  name: 'Custom - Title + Back + Subtitle + Actions + Divider',
  render: Template,
  args: {
    customDivider: true,
    'have-back-navigation': true,
    title: 'Title',
    'sub-title': 'Sub-title',
    actions: `
      <bq-icon color="text--brand" class="bq-page-title-story__action" name="pencil-simple-bold"></bq-icon>
      <bq-icon color="text--brand" class="bq-page-title-story__action" name="download-simple-bold"></bq-icon>
    `,
    'custom-style': true,
  },
};

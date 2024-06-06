import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

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

const Template = (args: Args) => {
  const customDivider = args.customDivider
    ? html`<bq-divider
        slot="divider"
        class="mb-m block"
        stroke-color="stroke--secondary"
        stroke-thickness="1"
        dashed
      />`
    : nothing;

  const actionsSlotClass = args['custom-style'] ? 'flex flex-grow justify-end' : 'flex';

  return html`
    <bq-page-title>
      ${args['have-back-navigation']
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
        : nothing}
      ${args.title} ${args['sub-title'] ? html`<div slot="sub-title">${args['sub-title']}</div>` : nothing}
      ${args.actions ? html`<div class="${actionsSlotClass}" slot="suffix">${args.actions}</div>` : nothing}
      ${customDivider}
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
    actions: html`
      <bq-icon class="p-xs2" color="text--brand" name="pencil-simple" weight="bold"></bq-icon>
      <bq-icon class="p-xs2" color="text--brand" name="download-simple" weight="bold"></bq-icon>
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
    actions: html`
      <bq-icon class="p-xs2" color="text--brand" name="pencil-simple" weight="bold"></bq-icon>
      <bq-icon class="p-xs2" color="text--brand" name="download-simple" weight="bold"></bq-icon>
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
    actions: html`
      <bq-icon class="p-xs2" color="text--brand" name="pencil-simple" weight="bold"></bq-icon>
      <bq-icon class="p-xs2" color="text--brand" name="download-simple" weight="bold"></bq-icon>
    `,
    'custom-style': true,
  },
};

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
    haveBackNavigation: { control: 'boolean' },
    // Event handlers
    bqBackClick: { action: 'bqBackClick' },
    bqBackBlur: { action: 'bqBackBlur' },
    bqBackFocus: { action: 'bqBackFocus' },
  },
  args: {
    haveBackNavigation: false,
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

  return html`
    <bq-page-title
      ?have-back-navigation=${args.haveBackNavigation}
      @bqBackClick=${args.bqBackClick}
      @bqBackFocus=${args.bqBackFocus}
      @bqBackBlur=${args.bqBackBlur}
    >
      ${args.title} ${args.subTitle ? html`<div slot="sub-title">${args.subTitle}</div>` : nothing}
      ${args.actions ? html`<div class="flex gap-xs" slot="suffix">${args.actions}</div>` : nothing} ${customDivider}
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
    haveBackNavigation: true,
    title: 'Title',
  },
};

export const TitleBackSubtitle: Story = {
  name: 'Title + Back + Subtitle',
  render: Template,
  args: {
    haveBackNavigation: true,
    title: 'Title',
    subTitle: 'Sub-title',
  },
};

export const TitleBackActions: Story = {
  name: 'Title + Back + Subtitle + Actions',
  render: Template,
  args: {
    haveBackNavigation: true,
    title: 'Title',
    subTitle: 'Sub-title',
    actions: html`
      <bq-icon class="p-xs2" color="text--brand" name="pencil-simple" size="24" weight="bold"></bq-icon>
      <bq-icon class="p-xs2" color="text--brand" name="download-simple" size="24" weight="bold"></bq-icon>
    `,
  },
};

export const TitleBackActionsCustom: Story = {
  name: 'Title + Back + Subtitle + Actions + Custom Divider',
  render: Template,
  args: {
    customDivider: true,
    haveBackNavigation: true,
    title: 'Title',
    subTitle: 'Sub-title',
    actions: html`
      <bq-icon class="p-xs2" color="text--brand" name="pencil-simple" size="24" weight="bold"></bq-icon>
      <bq-icon class="p-xs2" color="text--brand" name="download-simple" size="24" weight="bold"></bq-icon>
    `,
  },
};
